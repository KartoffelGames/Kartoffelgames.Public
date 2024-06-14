import { Injection } from '@kartoffelgames/core.dependency-injection';
import { IPwbExtensionModuleProcessor, IPwbExtensionModuleProcessorClass } from '../interface/extension.interface';
import { InjectionHierarchyParent } from '../injection/injection-hierarchy-parent';

export class BaseExtension extends InjectionHierarchyParent {
    private mExtensionProcessor: IPwbExtensionModuleProcessor | null;   
    private readonly mProcessorConstructor: IPwbExtensionModuleProcessorClass;

    /**
     * Processor of extension.
     * Initialize processor when it hasn't already.
     */
    protected get processor(): IPwbExtensionModuleProcessor {
        if (!this.mExtensionProcessor) {
            this.mExtensionProcessor = this.createExtensionProcessor();
        }

        return this.mExtensionProcessor;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    constructor(pParameter: BaseExtensionConstructorParameter) {
        super(pParameter.parent);

        this.mProcessorConstructor = pParameter.constructor;
        this.mExtensionProcessor = null;
    }

    /**
     * Deconstruct module.
     */
    public deconstruct(): void {
        this.mExtensionProcessor?.onDeconstruct?.();
    }

    /**
     * Execute extension.
     */
    public execute(): void {
        // Call needed to construct extension!!!
        const lProcessor: IPwbExtensionModuleProcessor = this.processor;

        // Execute extension.
        lProcessor?.onExecute?.();
    }

    /**
      * Create extension processor.
      * @param pInjections - Local injections.
      */
    protected createExtensionProcessor(): IPwbExtensionModuleProcessor {
        // Lock new injections.
        this.lock();

        // Create module object with local injections.
        return Injection.createObject(this.mProcessorConstructor, this.injections);
    }
}

type BaseExtensionConstructorParameter = {
    constructor: IPwbExtensionModuleProcessorClass;
    parent: InjectionHierarchyParent;
};