// Import mock at start of file.
import { TestUtil } from '../../utility/test-util.ts';

// Funcitonal imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator.ts';

Deno.test('MustacheExpression--Functionality: Initial text value', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Text content.
        const lTextContent: string = 'TEXT CONTENT.';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div>{{this.text}}</div>`
        })
        class TestComponent extends Processor {
            public readonly text: string = lTextContent;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                textContent: lTextContent
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('MustacheExpression--Functionality: Updated text value', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Text content.
        const lTextContent: string = 'TEXT CONTENT.';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div>{{this.text}}</div>`
        })
        class TestComponent extends Processor {
            @PwbExport
            public text: string | undefined;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.text = lTextContent;
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                textContent: lTextContent
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('MustacheExpression--Functionality: Initial attribute value', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Text content.
        const lTextContent: string = 'TEXT CONTENT.';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div attr="{{this.text}}"></div>`
        })
        class TestComponent extends Processor {
            public readonly text: string = lTextContent;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                attributes: [
                    { name: 'attr', value: lTextContent }
                ]
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('MustacheExpression--Functionality: Updated attribute value', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Text content.
        const lTextContent: string = 'TEXT CONTENT.';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div attr="{{this.text}}"></div>`
        })
        class TestComponent extends Processor {
            @PwbExport
            public text: string | undefined;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.text = lTextContent;
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                attributes: [
                    { name: 'attr', value: lTextContent }
                ]
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('MustacheExpression--Functionality: Only self-created values', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Text content.
        const lTextContent: string = new Array<string>(10).fill('a').join('');

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div>{{ new Array(10).fill('a').join('') }}</div>`
        })
        class TestComponent extends Processor { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                textContent: lTextContent
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});