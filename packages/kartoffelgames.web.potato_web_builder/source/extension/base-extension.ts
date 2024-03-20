import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentManager } from '../component/component-manager';
import { ExtensionTargetClassReference } from '../injection_reference/extension-target-class-reference';
import { ExtensionTargetObjectReference } from '../injection_reference/extension-target-object-reference';
import { IPwbExtensionProcessorClass, IPwbExtensionProcessor } from '../interface/extension.interface';
import { ComponentElementReference } from '../injection_reference/general/component-element-reference';
import { ComponentUpdateHandlerReference } from '../injection_reference/general/component-update-handler-reference';
import { ComponentLayerValuesReference } from '../injection_reference/general/component-layer-values-reference';
import { ComponentConstructorReference } from '../injection_reference/general/component-constructor-reference';

export class BaseExtension {
    private readonly mExtensionClass: IPwbExtensionProcessorClass;
    private mExtensionProcessor: IPwbExtensionProcessor | null;
    private readonly mInjections: Dictionary<InjectionConstructor, any>;

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
        this.mExtensionClass = pParameter.extensionClass;
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.mExtensionProcessor = null;

        // Create injection mapping.
        // Create component injections mapping.
        this.setProcessorAttributes(ComponentUpdateHandlerReference, pParameter.componentManager.updateHandler);
        this.setProcessorAttributes(ComponentElementReference, pParameter.componentManager.elementHandler.htmlElement);
        this.setProcessorAttributes(ComponentConstructorReference, pParameter.componentManager.userObjectHandler.userClass);
        this.setProcessorAttributes(ComponentLayerValuesReference, pParameter.);



        // TODO: Set in childs.
        


        this.mInjections.set(ExtensionTargetClassReference, new ExtensionTargetClassReference(pParameter.targetClass));
        this.mInjections.set(ExtensionTargetObjectReference, new ExtensionTargetObjectReference(pParameter.targetObject ?? {}));
    }

    /**
     * Deconstruct module.
     */
    public deconstruct(): void {
        this.mExtensionProcessor?.onDeconstruct?.();
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
        return Injection.createObject(this.mExtensionClass, this.mInjections);
    }
}

type BaseExtensionConstructorParameter = {
    extensionClass: IPwbExtensionProcessorClass;
    componentManager: ComponentManager;
    targetClass: InjectionConstructor;
};