// Import mock at start of file.
import { MOCK_WINDOW, TestUtil } from '../../utility/test-util.ts';

// Funcitonal imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';

Deno.test('SlotInstruction--Functionality: Default slot', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lComponent).toBeComponentStructure(MOCK_WINDOW, [
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // Instruction Anchor
            MOCK_WINDOW.Comment, // Static Anchor
            MOCK_WINDOW.HTMLSlotElement
        ], true);
        expect(lSlotName).toBeNull();
    });
});

Deno.test('SlotInstruction--Functionality: Named slot', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lComponent).toBeComponentStructure(MOCK_WINDOW, [
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // Instruction Anchor
            MOCK_WINDOW.Comment, // Static Anchor
            {
                node: MOCK_WINDOW.HTMLSlotElement,
                attributes: [{ name: 'name', value: lSlotName, }]
            }
        ], true);
    });
});

Deno.test('SlotInstruction--Functionality: Named slot after component update', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lComponent).toBeComponentStructure(MOCK_WINDOW, [
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // Instruction Anchor
            MOCK_WINDOW.Comment, // Static Anchor
            {
                node: MOCK_WINDOW.HTMLSlotElement,
                attributes: [{ name: 'name', value: lSlotName, }]
            }
        ], true);
    });
});