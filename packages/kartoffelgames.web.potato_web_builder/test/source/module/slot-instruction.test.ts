import type { InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { expect } from '@kartoffelgames/core-test';
import { before, describe, it } from '@std/testing/bdd';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import '../../utility/request-animation-frame-mock-session.ts';
import { TestUtil } from '../../utility/test-util.ts';

// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';

// Setup global scope.
// eslint-disable-next-line @typescript-eslint/naming-convention
const HTMLSlotElement: InjectionConstructor = (() => {
    const lMockDom: JSDOM = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');

    PwbConfiguration.configuration.scope.window = lMockDom.window as unknown as typeof globalThis;
    PwbConfiguration.configuration.scope.document = lMockDom.window.document;

    return PwbConfiguration.configuration.scope.document.createElement('slot').constructor as InjectionConstructor;
})();

describe('SlotInstruction', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- Default slot', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '$slot'
        })
        class TestComponent extends Processor { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lSlotName: string | null = TestUtil.getComponentNode<HTMLSlotElement>(lComponent, 'slot').getAttribute('name');

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // Instruction Anchor
            Comment, // Static Anchor
            HTMLSlotElement
        ], true);
        expect(lSlotName).toBeNull();
    });

    it('-- Named slot', async () => {
        // Setup. Values.
        const lSlotName: string = 'slotname';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$slot(${lSlotName})`
        })
        class TestComponent extends Processor { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // Instruction Anchor
            Comment, // Static Anchor
            {
                node: HTMLSlotElement,
                attributes: [{ name: 'name', value: lSlotName, }]
            }
        ], true);
    });

    it('-- Named slot after component update', async () => {
        // Setup. Values.
        const lSlotName: string = 'slotname';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$slot(${lSlotName})`
        })
        class TestComponent extends Processor { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.manualUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // Instruction Anchor
            Comment, // Static Anchor
            {
                node: HTMLSlotElement,
                attributes: [{ name: 'name', value: lSlotName, }]
            }
        ], true);
    });
});