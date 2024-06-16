import { Dictionary, Exception, IDeconstructable } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { AccessMode } from '../enum/access-mode.enum';
import { ExtensionModule } from '../module/extension-module';
import { ExtensionModuleConfiguration, GlobalModuleStorage } from '../module/global-module-storage';

export class InjectionHierarchyParent<TProcessor extends object = object> implements IDeconstructable {
    private readonly mExtensionList: Array<ExtensionModule>;
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private mLocked: boolean;
    private mProcessor: TProcessor | null;
    private readonly mProcessorConstructor: InjectionConstructor;

    /**
     * All injections of processor.
     */
    public get injections(): Dictionary<InjectionConstructor, any> {
        return this.mInjections;
    }

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
     * If processor is created or not.
     */
    public get processorCreated(): boolean {
        return !!this.mProcessor;
    }

    public constructor(pProcessorConstructor: InjectionConstructor, pParent: InjectionHierarchyParent<any> | null) {
        this.mProcessorConstructor = pProcessorConstructor;
        this.mProcessor = null;
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.mExtensionList = new Array<ExtensionModule>();
        this.mLocked = false;

        // Init injections from hierarchy parent.
        if (pParent) {
            for (const [lTarget, lValue] of pParent.injections.entries()) {
                this.setProcessorAttributes(lTarget, lValue);
            }
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
    protected update(): void {
        for (const lExtension of this.mExtensionList) {
            lExtension.update();
        }
    }

    /**
     * Create module object.
     * @param pValue - Value for module object.
     */
    private createProcessor(): void {
        // TODO: Use updatehandler and execute processor in set trigger.
        // TODO: How to prevent creation recursion for extensions extending itself?
        // TODO: Not only use this.mProcessorConstructor as restriction. use this.constructor as well to cover [Component, InstructionModule and more]

        const lExtensions: GlobalModuleStorage = new GlobalModuleStorage();

        // Create every write module extension.
        for (const lExtensionModuleConfiguration of lExtensions.getExtensionModuleConfiguration(this.mProcessorConstructor, AccessMode.Write)) {
            const lModuleExtension: ExtensionModule = new ExtensionModule({
                constructor: lExtensionModuleConfiguration.constructor,
                parent: this
            });

            this.mExtensionList.push(lModuleExtension);
        }

        // Lock new injections.
        this.mLocked = true;

        // Create and store processor to be accessable for all read extensions.
        this.mProcessor = Injection.createObject<TProcessor>(this.mProcessorConstructor, this.injections);

        // Get all read extensions. Keep order to execute readWrite extensions first.
        const lReadExtensions: Array<ExtensionModuleConfiguration> = [
            ...lExtensions.getExtensionModuleConfiguration(this.mProcessorConstructor, AccessMode.ReadWrite),
            ...lExtensions.getExtensionModuleConfiguration(this.mProcessorConstructor, AccessMode.Read)
        ];

        // Create every read module extension.
        for (const lExtensionModuleConfiguration of lReadExtensions) {
            const lModuleExtension: ExtensionModule = new ExtensionModule({
                constructor: lExtensionModuleConfiguration.constructor,
                parent: this
            });

            this.mExtensionList.push(lModuleExtension);
        }
    }
}