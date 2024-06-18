import { Dictionary, Exception, IDeconstructable } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { InteractionZoneStack } from '@kartoffelgames/web.change-detection/library/source/change_detection/interaction-zone';
import { AccessMode } from '../enum/access-mode.enum';
import { UpdateHandler } from './component/handler/update-handler';
import { ComponentUpdateHandlerReference } from './injection-reference/component/component-update-handler-reference';
import { ExtensionModule } from './module/extension_module/extension-module';
import { ExtensionModuleConfiguration, GlobalModuleStorage } from './module/global-module-storage';

export abstract class BaseComponentEntity<TProcessor extends object = object> implements IDeconstructable {
    private readonly mExtensionList: Array<ExtensionModule>;
    private readonly mIncludeExtensions: boolean;
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private mLocked: boolean;
    private mProcessor: TProcessor | null;
    private readonly mProcessorConstructor: InjectionConstructor;
    private readonly mTrackProcessor: boolean;
    private readonly mUpdateHandler: UpdateHandler;

    /**
     * Processor of module.
     * Initialize processor when it hasn't already.
     */
    public get processor(): TProcessor {
        if (!this.processorCreated) {
            this.createProcessor();
        }

        return this.mProcessor!;
    }

    /**
     * Processor constructor of module.
     */
    public get processorConstructor(): InjectionConstructor {
        return this.mProcessorConstructor;
    }

    /**
     * If processor is created or not.
     */
    public get processorCreated(): boolean {
        return !!this.mProcessor;
    }

    /**
     * Update handler of component entity.
     */
    protected get updateHandler(): UpdateHandler {
        return this.mUpdateHandler;
    }

    public constructor(pParameter: BaseComponentEntityConstructorParameter) {
        this.mProcessorConstructor = pParameter.processorConstructor;
        this.mProcessor = null;
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.mExtensionList = new Array<ExtensionModule>();
        this.mLocked = false;
        this.mIncludeExtensions = pParameter.includeExtensions;
        this.mTrackProcessor = pParameter.trackProcessor;

        // Passthrough parents entity injections.
        if (pParameter.parent) {
            for (const [lTarget, lValue] of pParameter.parent.mInjections.entries()) {
                this.setProcessorAttributes(lTarget, lValue);
            }
        }

        // Create new updater for every component entity.
        const lCurrentInteractionStack: InteractionZoneStack | undefined = pParameter.parent?.updateHandler.interactionStack;
        this.mUpdateHandler = new UpdateHandler(pParameter.isolatedInteraction, lCurrentInteractionStack);

        // Add update handler reference as injectable object.
        this.setProcessorAttributes(ComponentUpdateHandlerReference, this.updateHandler);

        // Attach automatic update listener to handler when this entity is not set to be manual.
        if (!pParameter.manualUpdate) {
            this.mUpdateHandler.addUpdateListener(() => {
                this.update();
            });
        }
    }

    /**
     * Deconstruct module.
     */
    public deconstruct(): void {
        // Deconstruct extensions.
        for (const lExtensions of this.mExtensionList) {
            lExtensions.deconstruct();
        }

        // Remove change listener from app.
        this.mUpdateHandler.deconstruct();
    }

    /**
     * Get injection parameter for the processor class construction. 
     * 
     * @param pInjectionTarget - Injection type that should be provided to processor.
     */
    public getProcessorAttribute<T>(pInjectionTarget: InjectionConstructor): T | undefined {
        return this.mInjections.get(pInjectionTarget);
    }

    /**
     * Set injection parameter for the module processor class construction. 
     * 
     * @param pInjectionTarget - Injection type that should be provided to processor.
     * @param pInjectionValue - Actual injected value in replacement for {@link pInjectionTarget}.
     * 
     * @throws {@link Exception}
     * When the processor was already initialized.
     */
    public setProcessorAttributes(pInjectionTarget: InjectionConstructor, pInjectionValue: any): void {
        if (this.mLocked) {
            throw new Exception('Cant add injections to after construction.', this);
        }

        this.mInjections.set(pInjectionTarget, pInjectionValue);
    }

    /**
     * Update extensions.
     */
    public update(): boolean {
        for (const lExtension of this.mExtensionList) {
            lExtension.update();
        }

        return this.onUpdate();
    }

    /**
     * On processor creation.
     * 
     * @param _pProcessor -  Created processor
     */
    protected onCreation(_pProcessor: TProcessor): void {
        // Nothing.
    }

    /**
     * Create module object.
     * @param pValue - Value for module object.
     */
    private createProcessor(): void {
        // TODO: Caching is the key. Cache found extensions for constructor in weakmap. 

        const lExtensions: GlobalModuleStorage = new GlobalModuleStorage();

        let lReadExtensionList: Array<ExtensionModuleConfiguration> = new Array<ExtensionModuleConfiguration>();
        let lWriteExtensionList: Array<ExtensionModuleConfiguration> = new Array<ExtensionModuleConfiguration>();
        let lReadWriteExtensionList: Array<ExtensionModuleConfiguration> = new Array<ExtensionModuleConfiguration>();

        if (this.mIncludeExtensions) {
            // Filter extension list.
            const lExtensionList: Array<ExtensionModuleConfiguration> = lExtensions.extensionModuleConfigurations.filter((pExtensionConfiguration: ExtensionModuleConfiguration) => {
                for (const lRestriction of pExtensionConfiguration.targetRestrictions) {
                    if (this instanceof lRestriction || this.mProcessorConstructor.prototype instanceof lRestriction) {
                        return true;
                    }
                }

                return false;
            });

            lReadExtensionList = lExtensionList.filter((pExtensionConfiguration: ExtensionModuleConfiguration) => { return pExtensionConfiguration.access === AccessMode.Read; });
            lWriteExtensionList = lExtensionList.filter((pExtensionConfiguration: ExtensionModuleConfiguration) => { return pExtensionConfiguration.access === AccessMode.Write; });
            lReadWriteExtensionList = lExtensionList.filter((pExtensionConfiguration: ExtensionModuleConfiguration) => { return pExtensionConfiguration.access === AccessMode.ReadWrite; });
        }

        // Create every write module extension.
        for (const lExtensionModuleConfiguration of lWriteExtensionList) {
            const lModuleExtension: ExtensionModule = new ExtensionModule({
                constructor: lExtensionModuleConfiguration.constructor,
                parent: this
            });

            this.mExtensionList.push(lModuleExtension);
        }

        // Lock new injections.
        this.mLocked = true;

        // Create and store processor to be accessable for all read extensions.
        this.mProcessor = this.mUpdateHandler.enableInteractionTrigger(() => {
            return Injection.createObject<TProcessor>(this.mProcessorConstructor, this.mInjections);
        });

        // Track any change of processor.
        if (this.mTrackProcessor) {
            this.mProcessor = this.mUpdateHandler.registerObject(this.mProcessor);
        }

        // Call on creation hook.
        this.onCreation(this.mProcessor);

        // Get all read extensions. Keep order to execute readWrite extensions first.
        const lReadExtensions: Array<ExtensionModuleConfiguration> = [...lReadWriteExtensionList, ...lReadExtensionList];

        // Create every read module extension.
        for (const lExtensionModuleConfiguration of lReadExtensions) {
            const lModuleExtension: ExtensionModule = new ExtensionModule({
                constructor: lExtensionModuleConfiguration.constructor,
                parent: this
            });

            this.mExtensionList.push(lModuleExtension);
        }
    }

    /**
     * Update component entity.
     * 
     * @returns True when any update happened, false when all values stayed the same.
     */
    protected abstract onUpdate(): boolean;
}

type BaseComponentEntityConstructorParameter = {
    processorConstructor: InjectionConstructor;
    manualUpdate: boolean;
    isolatedInteraction: boolean;
    parent?: BaseComponentEntity<any>;
    trackProcessor: boolean;
    includeExtensions: boolean;
};