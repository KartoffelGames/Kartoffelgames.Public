import { Exception } from '@kartoffelgames/core';
import type { InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import type { Processor } from '../core_entity/processor.ts';
import type { Component, ComponentProcessor } from './component.ts';

export class ComponentRegister {
    private static readonly mComponents: WeakMap<HTMLElement | ComponentProcessor, Component> = new WeakMap<HTMLElement | ComponentProcessor, Component>();
    private static readonly mConstructorSelector: WeakMap<InjectionConstructor, string> = new WeakMap<InjectionConstructor, string>();
    private static readonly mElements: WeakMap<Component, HTMLElement> = new WeakMap<Component, HTMLElement>();

    /**
     * Get the component information of a component.
     * 
     * @param pComponent - Component of a custom element.
     * 
     * @returns Component information of {@link pComponent}s component. 
     * 
     * @throws {@link Exception}
     * When {@link pComponent} is not a registered component.
     */
    public static ofComponent(pComponent: Component): ComponentInformationData {
        const lComponentConstructor: InjectionConstructor = pComponent.processorConstructor;

        // Get selector of constructor.
        const lSelector: string | undefined = ComponentRegister.mConstructorSelector.get(lComponentConstructor);
        if (!lSelector) {
            throw new Exception(`Constructor "${lComponentConstructor.name}" is not a registered custom element`, lComponentConstructor);
        }

        // Get component element.
        const lElement: HTMLElement | undefined = ComponentRegister.mElements.get(pComponent);
        if (!lElement) {
            throw new Exception(`Component "${pComponent}" is not a registered component`, pComponent);
        }

        // Only read processor when it is created.
        let lProcessor: ComponentProcessor | undefined;
        if (pComponent.isProcessorCreated) {
            lProcessor = pComponent.processor;
        }

        return {
            selector: lSelector,
            constructor: lComponentConstructor,
            element: lElement,
            component: pComponent,
            processor: lProcessor
        };
    }

    /**
     * Get component construction information of component constructor. 
     *
     * @param pConstructor - Class of component processor.
     *
     * @returns Component constructor information.
     *  
     * @throws {@link Exception}
     * When {@link pConstructor} is not a registered component processor.
     */
    public static ofConstructor(pConstructor: typeof Processor): ComponentConstructorInformationData {
        // Get selector of constructor.
        const lSelector: string | undefined = ComponentRegister.mConstructorSelector.get(pConstructor);
        if (!lSelector) {
            throw new Exception(`Constructor "${pConstructor.name}" is not a registered custom element`, pConstructor);
        }

        // Get component constructor from custom element registry.
        const lComponentConstructor: CustomElementConstructor | undefined = globalThis.customElements.get(lSelector);
        if (!lComponentConstructor) {
            throw new Exception(`Constructor "${pConstructor.name}" is not a registered custom element`, pConstructor);
        }

        return {
            selector: lSelector,
            constructor: pConstructor,
            elementConstructor: lComponentConstructor
        };
    }

    /**
     * Get the component information of a component element.
     * 
     * @param pElement - Element of a custom element.
     * 
     * @returns Component information of {@link pElement}s component. 
     * 
     * @throws {@link Exception}
     * When {@link pElement} is not a registered pwb component.
     */
    public static ofElement(pElement: HTMLElement): ComponentInformationData {
        const lComponent: Component | undefined = ComponentRegister.mComponents.get(pElement);
        if (!lComponent) {
            throw new Exception(`Element "${pElement}" is not a PwbComponent.`, pElement);
        }

        return ComponentRegister.ofComponent(lComponent);
    }

    /**
     * Get the component information of a component processor.
     * 
     * @param pProcessor - Processor custom element.
     * 
     * @returns Component information of {@link pProcessor}s component. 
     * 
     * @throws {@link Exception}
     * When {@link pProcessor} is not a registered component processor.
     */
    public static ofProcessor(pProcessor: ComponentProcessor): ComponentInformationData {
        const lComponent: Component | undefined = ComponentRegister.mComponents.get(pProcessor);
        if (!lComponent) {
            throw new Exception(`Processor is not a PwbComponent.`, pProcessor);
        }

        return ComponentRegister.ofComponent(lComponent);
    }

    /**
     * Register component information. Does not override set data.
     * 
     * @param pSelector - Selector of html element.
     * @param pElement - Element of component.
     * @param pComponent - Component.
     * @param pProcessor - Component processor.
     */
    public static registerComponent(pComponent: Component, pElement: HTMLElement, pProcessor?: ComponentProcessor): void {
        // Register HTMLElement.
        if (!ComponentRegister.mComponents.has(pElement)) {
            ComponentRegister.mComponents.set(pElement, pComponent);
        }

        // Register ComponentProcessor.
        if (pProcessor && !ComponentRegister.mComponents.has(pProcessor)) {
            ComponentRegister.mComponents.set(pProcessor, pComponent);
        }

        // Register Component
        if (!ComponentRegister.mElements.has(pComponent)) {
            ComponentRegister.mElements.set(pComponent, pElement);
        }
    }

    /**
     * Register component constructor information. Does not override set data.
     * 
     * @param pConstructor - Component processor constructor.
     * @param pSelector - Selector of html element.
     */
    public static registerConstructor(pConstructor: InjectionConstructor, pSelector: string): void {
        // Register selector.
        if (pConstructor && !ComponentRegister.mConstructorSelector.has(pConstructor)) {
            ComponentRegister.mConstructorSelector.set(pConstructor, pSelector);
        }
    }
}

export type ComponentInformationData = {
    selector: string;
    constructor: InjectionConstructor;
    element: HTMLElement;
    component: Component;
    processor?: ComponentProcessor | undefined;
};

export type ComponentConstructorInformationData = {
    selector: string,
    constructor: InjectionConstructor,
    elementConstructor: CustomElementConstructor;
};