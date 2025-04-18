// Import test environment.
import './test-dom-environment.ts';

// Import default modules
import '../../source/module/dynamic-content/dynamic-content-module.ts';
import '../../source/module/event_attribute/event-attribute-module.ts';
import '../../source/module/for-instruction/for-instruction-module.ts';
import '../../source/module/if_instruction/if-instruction-module.ts';
import '../../source/module/one_way_binding/one-way-binding-attribute-module.ts';
import '../../source/module/pwb_child/pwb-child-attribute-module.ts';
import '../../source/module/slot_instruction/slot-instruction-module.ts';
import '../../source/module/two_way_binding/two-way-binding-attribute-module.ts';

// Import default extensions.
import '../../source/module/component-event-listener/component-event-listener-component-extension.ts';
import '../../source/module/component-event-listener/component-event-listener-module-extension.ts';
import '../../source/module/export/export-extension.ts';

import { PwbApplicationConfiguration } from '../../source/application/pwb-application-configuration.ts';
import { ComponentRegister } from '../../source/core/component/component-register.ts';
import { Component, type ComponentProcessor } from '../../source/core/component/component.ts';
import type { Processor } from '../../source/core/core_entity/processor.ts';

// Define update metrics.
PwbApplicationConfiguration.DEFAULT.updating.frameTime = Number.MAX_SAFE_INTEGER;
PwbApplicationConfiguration.DEFAULT.error.print = false;

export class TestUtil {
    /**
     * Create component from selector.
     * @param pSelector - component selector.
     */
    public static async createComponent(pClass: typeof Processor): Promise<HTMLElement> {
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

