import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentManager } from '../component/component-manager';
import { ComponentConstructorReference } from '../injection_reference/general/component-constructor-reference';
import { IPwbExtensionProcessorClass } from '../interface/extension.interface';
import { BaseExtension } from './base-extension';

export class ComponentExtension extends BaseExtension {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pParameter: ComponentExtensionConstructorParameter) {
        super(pParameter);

        this.setProcessorAttributes(ComponentConstructorReference, aaaa);
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