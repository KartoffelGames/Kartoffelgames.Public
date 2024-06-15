import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { AccessMode } from '../enum/access-mode.enum';
import { ExtensionType } from '../enum/extension-type.enum';
import { ExtensionModule } from '../extension/extension-module';
import { InjectionHierarchyParent } from '../injection/injection-hierarchy-parent';
import { ModuleConstructorReference } from '../injection/references/module/module-constructor-reference';
import { ModuleReference } from '../injection/references/module/module-reference';
import { IPwbModuleProcessor, IPwbModuleProcessorConstructor } from '../interface/module.interface';
import { ExtensionModuleConfiguration, GlobalModuleStorage } from './global-module-storage';

export abstract class BaseModule<TModuleProcessor extends IPwbModuleProcessor> extends InjectionHierarchyParent {
    private readonly mExtensionList: Array<ExtensionModule>;
    private mProcessor: TModuleProcessor | null;
    private readonly mProcessorConstructor: InjectionConstructor;

    /**
     * Processor of module.
     * Initialize processor when it hasn't already.
     */
    public get processor(): TModuleProcessor {
        if (!this.mProcessor) {
            this.createModuleProcessor();
        }

        return this.mProcessor!;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    constructor(pParameter: BaseModuleConstructorParameter) {
        super(pParameter.parent);

        // Save parameter
        this.mProcessorConstructor = pParameter.constructor;

        // Init runtime lists.
        this.mProcessor = null;
        this.mExtensionList = new Array<ExtensionModule>();

        // Create module injection mapping.
        this.setProcessorAttributes(ModuleConstructorReference, pParameter.constructor);
        this.setProcessorAttributes(ModuleReference, this);
    }

    /**
     * Deconstruct module.
     */
    public deconstruct(): void {
        // Deconstruct extensions.
        for (const lExtensions of this.mExtensionList) {
            lExtensions.deconstruct();
        }

        // Deconstruct modules.
        if ('onDeconstruct' in this.processor && typeof this.processor.onDeconstruct === 'function') {
            this.processor.onDeconstruct();
        }
    }

    /**
     * Update module.
     * 
     * @returns True when any update happened, false when all values stayed the same.
     */
    public update(): boolean {
        // TODO: Update extensions first.

        return this.onUpdate();
    }

    /**
     * Create module object.
     * @param pValue - Value for module object.
     */
    private createModuleProcessor(): void {
        const lExtensions: GlobalModuleStorage = new GlobalModuleStorage();

        // Create every write module extension.
        for (const lExtensionModuleConfiguration of lExtensions.getExtensionModuleConfiguration(ExtensionType.Module, AccessMode.Write, this.mProcessorConstructor)) {
            const lModuleExtension: ExtensionModule = new ExtensionModule({
                constructor: lExtensionModuleConfiguration.constructor,
                parent: this
            });

            // Execute extension.
            lModuleExtension.execute();

            this.mExtensionList.push(lModuleExtension);
        }

        // Lock new injections.
        this.lock();

        // Create and store processor to be accessable for all read extensions.
        this.mProcessor = Injection.createObject<TModuleProcessor>(this.mProcessorConstructor, this.injections);

        // Get all read extensions. Keep order to execute readWrite extensions first.
        const lReadExtensions: Array<ExtensionModuleConfiguration> = [
            ...lExtensions.getExtensionModuleConfiguration(ExtensionType.Module, AccessMode.ReadWrite, this.mProcessorConstructor),
            ...lExtensions.getExtensionModuleConfiguration(ExtensionType.Module, AccessMode.Read, this.mProcessorConstructor)
        ];

        // Create every read module extension.
        for (const lExtensionModuleConfiguration of lReadExtensions) {
            const lModuleExtension: ExtensionModule = new ExtensionModule({
                constructor: lExtensionModuleConfiguration.constructor,
                parent: this
            });

            // Execute extension.
            lModuleExtension.execute();

            this.mExtensionList.push(lModuleExtension);
        }
    }

    /**
     * Update module.
     * 
     * @returns True when any update happened, false when all values stayed the same.
     */
    protected abstract onUpdate(): boolean;
}

export type BaseModuleConstructorParameter = {
    parent: InjectionHierarchyParent,
    constructor: IPwbModuleProcessorConstructor<IPwbModuleProcessor>,
};