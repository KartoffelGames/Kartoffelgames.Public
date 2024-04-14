import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { IComponentHierarchyParent } from '../interface/component-hierarchy.interface';
import { IPwbExtensionProcessor, IPwbExtensionProcessorClass } from '../interface/extension.interface';

export class BaseExtension {
    private mExtensionProcessor: IPwbExtensionProcessor | null;   
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private readonly mProcessorConstructor: IPwbExtensionProcessorClass;

    /**
     * Processor of extension.
     * Initialize processor when it hasn't already.
     */
    protected get processor(): IPwbExtensionProcessor {
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
        this.mProcessorConstructor = pParameter.constructor;
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.mExtensionProcessor = null;

        // Init injections from hierarchy parent.
        for (const lParentInjection of pParameter.parent.injections) {
            this.setProcessorAttributes(lParentInjection.target, lParentInjection.value);
        }
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
        const lProcessor: IPwbExtensionProcessor = this.processor;

        // Execute extension.
        lProcessor?.onExecute?.();
    }

    /**
     * Set injection parameter for the extension processor class construction. 
     * 
     * @param pInjectionTarget - Injection type that should be provided to processor.
     * @param pInjectionValue - Actual injected value in replacement for {@link pInjectionTarget}.
     * 
     * @throws {@link Exception}
     * When the processor was already initialized.
     */
    public setProcessorAttributes(pInjectionTarget: InjectionConstructor, pInjectionValue: any): void {
        if (this.mExtensionProcessor) {
            throw new Exception('Cant add attributes to already initialized module.', this);
        }

        this.mInjections.set(pInjectionTarget, pInjectionValue);
    }

    /**
      * Create extension processor.
      * @param pInjections - Local injections.
      */
    protected createExtensionProcessor(): IPwbExtensionProcessor {
        // Create module object with local injections.
        return Injection.createObject(this.mProcessorConstructor, this.mInjections);
    }
}

type BaseExtensionConstructorParameter = {
    constructor: IPwbExtensionProcessorClass;
    parent: IComponentHierarchyParent;
};