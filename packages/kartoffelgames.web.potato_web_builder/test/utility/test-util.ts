import type { InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { Component, type ComponentProcessor } from '../../source/core/component/component.ts';
import { ComponentRegister } from '../../source/core/component/component-register.ts';

export class TestUtil {
    /**
     * Create component from selector.
     * @param pSelector - component selector.
     */
    public static async createComponent(pClass: InjectionConstructor): Promise<HTMLElement> {
        // Get component html constructor from class.
        const lComponentConstructor: CustomElementConstructor = ComponentRegister.ofConstructor(pClass).elementConstructor;

        // Get component.
        const lComponent: HTMLElement = new lComponentConstructor() as any;

        // Connect to a document to trigger updates.
        document.body.appendChild(lComponent);

        // Wait for any update to happen.
        await TestUtil.waitForUpdate(lComponent);

        return lComponent;
    }

    /**
     * Deconstruct the component.
     * @param pComponent - Pwb component.
     */
    public static deconstructComponent(pComponent: HTMLElement): void {
        ComponentRegister.ofElement(pComponent).component.deconstruct();
    }

    /**
     * Force creation of component processor.
     * 
     * @param pComponent - Pwb component.
     */
    public static forceProcessorCreation(pComponent: HTMLElement): ComponentProcessor {
        return ComponentRegister.ofElement(pComponent).component.processor;
    }

    /**
     * Get component manager of component.
     * @param pComponent - Pwb component.
     */
    public static getComponentManager(pComponent: HTMLElement): Component {
        return ComponentRegister.ofElement(pComponent).component;
    }

    /**
     * Get component inner values. Start new selector if value should be searched inside shadow root.
     * @param pComponent - Component.
     * @param pSelectorList - List of selectors.
     */
    public static getComponentNode<TExpected extends Element>(pComponent: Element, ...pSelectorList: Array<string>): TExpected {
        // Clone selector list.
        const lSelectorList: Array<string> = [...pSelectorList];

        let lComponent: Element = pComponent;

        // Check if element has shadow root.
        if (lComponent.shadowRoot) {
            lComponent = <Element>lComponent.shadowRoot.querySelector(<string>lSelectorList.shift());
        } else {
            lComponent = <Element>lComponent.querySelector(<string>lSelectorList.shift());
        }

        // Search next selector.
        if (lSelectorList.length > 0) {
            lComponent = TestUtil.getComponentNode(lComponent, ...pSelectorList);
        }

        return <TExpected>lComponent;
    }

    /**
     * Manual update component.
     * @param pComponent - Component.
     */
    public static manualUpdate(pComponent: HTMLElement): void {
        const lComponent: Component | undefined = TestUtil.getComponentManager(pComponent);
        lComponent?.getProcessorAttribute<Component>(Component)!.update();
    }

    /**
     * Get random component selector.
     */
    public static randomSelector(): string {
        let lResult = '';
        const lCharacters = 'abcdefghijklmnopqrstuvwxyz';
        const lCharactersLength = lCharacters.length;
        for (let lIndex = 0; lIndex < 10; lIndex++) {
            lResult += lCharacters.charAt(Math.floor(Math.random() * lCharactersLength));
        }
        return `${lResult}-${lResult}`;
    }

    /**
     * Wait for component to update.
     * @param pComponent - Component.
     */
    public static async waitForUpdate(pComponent: HTMLElement): Promise<void> {
        const lComponent: Component = TestUtil.getComponentManager(pComponent)!;
        return lComponent.waitForUpdate().then();
    }
}

