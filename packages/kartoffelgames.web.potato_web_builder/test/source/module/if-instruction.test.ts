// Import mock at start of file.
import { MOCK_WINDOW, TestUtil } from '../../utility/test-util.ts';

// Funcitonal imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator.ts';

Deno.test('IfInstruction--Functionality: Initial false', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        const lDisplayed: boolean = false;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$if(this.displayed) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            public displayed: boolean = lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponent).toBeComponentStructure(MOCK_WINDOW, [
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // - Manipulator Anchor
        ], true);
    });
});

Deno.test('IfInstruction--Functionality: Initial true', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        const lDisplayed: boolean = true;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$if(this.displayed) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            public displayed: boolean = lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure(MOCK_WINDOW, [
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // - Manipulator Anchor
            MOCK_WINDOW.Comment, // -- Manipulator Child Anchor
            MOCK_WINDOW.HTMLDivElement
        ], true);
    });
});

Deno.test('IfInstruction--Functionality: Updated false', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        const lDisplayed: boolean = false;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$if(this.displayed) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            @PwbExport
            public displayed: boolean = !lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.displayed = lDisplayed;
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponent).toBeComponentStructure(MOCK_WINDOW, [
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // - Manipulator Anchor
        ], true);
    });
});

Deno.test('IfInstruction--Functionality: Updated true', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        const lDisplayed: boolean = true;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$if(this.displayed) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            @PwbExport
            public displayed: boolean = !lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.displayed = lDisplayed;
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure(MOCK_WINDOW, [
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // - Manipulator Anchor
            MOCK_WINDOW.Comment, // -- Manipulator Child Anchor
            MOCK_WINDOW.HTMLDivElement
        ], true);
    });
});

Deno.test('IfInstruction--Functionality: None boolean false value', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        const lDisplayed: any = null;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$if(this.displayed) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            public displayed: any = lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponent).toBeComponentStructure(MOCK_WINDOW, [
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // - Manipulator Anchor
        ], true);
    });
});

Deno.test('IfInstruction--Functionality: None boolean true value', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        const lDisplayed: any = new Object();

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$if(this.displayed) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            public displayed: any = lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure(MOCK_WINDOW, [
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // - Manipulator Anchor
            MOCK_WINDOW.Comment, // -- Manipulator Child Anchor
            MOCK_WINDOW.HTMLDivElement
        ], true);
    });
});