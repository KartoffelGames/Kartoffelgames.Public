import { Dictionary } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentManager } from '../component/component-manager';
import { ComponentElementReference } from '../injection_reference/general/component-element-reference';
import { BaseExtension } from './base-extension';
import { IPwbExtensionProcessorClass } from '../interface/extension.interface';
import { ComponentConstructorReference } from '../injection_reference/general/component-constructor-reference';

export class ComponentExtension extends BaseExtension {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pParameter: ComponentExtensionConstructorParameter) {
        super(pParameter);

        this.setProcessorAttributes(ComponentConstructorReference, this.mLayerValues);
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