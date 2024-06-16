import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentUpdateHandlerReference } from '../../source';
import { Component } from '../../source/component_entity/component/component';
import { UpdateHandler } from '../../source/component_entity/component/handler/update-handler';
import { ComponentElement } from '../../source/component_entity/component/component.interface';
import { InteractionReason, InteractionResponseType } from '@kartoffelgames/web.change-detection';

export class TestUtil {
    /**
     * Create component from selector.
     * @param pSelector - component selector.
     */
    public static async createComponent(pClass: InjectionConstructor): Promise<ComponentElement> {
        // Get component html constructor from class.
        const lComponentConstructor: CustomElementConstructor = Component.elementConstructorOf(pClass);

        // Get component.
        const lComponent: ComponentElement = new lComponentConstructor() as any;

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
    public static deconstructComponent(pComponent: ComponentElement): void {
        Component.componentOf(pComponent).deconstruct();
    }

    /**
     * Force creation of component processor.
     * 
     * @param pComponent - Pwb component.
     */
    public static forceProcessorCreation(pComponent: ComponentElement): void {
        Component.componentOf(pComponent).processor;
    }

    /**
     * Get component manager of component.
     * @param pComponent - Pwb component.
     */
    public static getComponentManager(pComponent: HTMLElement): Component {
        return Component.componentOf(pComponent);
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
        lComponent?.getProcessorAttribute<UpdateHandler>(ComponentUpdateHandlerReference)!.requestUpdate(new InteractionReason(InteractionResponseType.Any, pComponent));
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
        await lComponent!.getProcessorAttribute<UpdateHandler>(ComponentUpdateHandlerReference)!.waitForUpdate();
    }
}

