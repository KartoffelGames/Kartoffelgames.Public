// Import mock at start of file.
import { TestUtil } from '../../utility/test-util.ts';

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
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // Instruction Anchor
            Comment, // Static Anchor
            HTMLSlotElement
        ], true);
        expect(lSlotName).toBeNull();

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
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
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // Instruction Anchor
            Comment, // Static Anchor
            {
                node: HTMLSlotElement,
                attributes: [{ name: 'name', value: lSlotName, }]
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
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
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // Instruction Anchor
            Comment, // Static Anchor
            {
                node: HTMLSlotElement,
                attributes: [{ name: 'name', value: lSlotName, }]
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});