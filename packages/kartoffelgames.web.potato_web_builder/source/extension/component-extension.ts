import { Dictionary } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentManager } from '../component/component-manager';
import { ComponentElementReference } from '../injection_reference/general/component-element-reference';
import { BaseExtension } from './base-extension';
import { IPwbExtensionProcessorClass } from '../interface/extension.interface';

export class ComponentExtension extends BaseExtension {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pParameter: ComponentExtensionConstructorParameter) {
        super(pParameter);

        // Create local injection mapping.
        const lInjections: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
        lInjections.set(ComponentElementReference, new ComponentElementReference(pParameter.componentElement));

        // Create extension.
        this.createExtensionProcessor(lInjections);
    }
}

type ComponentExtensionConstructorParameter = {
    // Base 
    extensionClass: IPwbExtensionProcessorClass;
    componentManager: ComponentManager;
    targetClass: InjectionConstructor;
    targetObject: object | null;

    // Component
    componentElement: HTMLElement;
};