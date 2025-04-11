// Import mock at start of file.
import { MOCK_WINDOW, TestUtil } from '../../utility/test-util.ts';

// Funcitonal imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { PwbTemplateTextNode } from '../../../source/core/component/template/nodes/pwb-template-text-node.ts';
import { PwbTemplateXmlNode } from '../../../source/core/component/template/nodes/pwb-template-xml-node.ts';
import { PwbTemplate } from '../../../source/core/component/template/nodes/pwb-template.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';

Deno.test('DynamicContent--Functionality: Initial', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$dynamic-content(this.getContent())`
        })
        class TestComponent extends Processor {
            public getContent(): PwbTemplate {
                const lTemlplate: PwbTemplate = new PwbTemplate();

                // Inner div
                const lDiv: PwbTemplateXmlNode = new PwbTemplateXmlNode();
                lDiv.tagName = 'div';

                lTemlplate.appendChild(lDiv);

                return lTemlplate;
            }
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure(MOCK_WINDOW, [
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // - Manipulator Anchor
            MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
            MOCK_WINDOW.HTMLDivElement
        ], true);
    });
});

Deno.test('DynamicContent--Functionality: Keep content', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        const lTextContent: string = 'Text content';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$dynamic-content(this.getContent())`
        })
        class TestComponent extends Processor {
            public getContent(): PwbTemplate {
                const lTemlplate: PwbTemplate = new PwbTemplate();

                // Inner div
                const lDiv: PwbTemplateXmlNode = new PwbTemplateXmlNode();
                lDiv.tagName = 'div';

                // Inner text node.
                const lTextNode: PwbTemplateTextNode = new PwbTemplateTextNode();
                lTextNode.addValue(lTextContent);

                lDiv.appendChild(lTextNode);

                lTemlplate.appendChild(lDiv);

                return lTemlplate;
            }
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure(MOCK_WINDOW, [
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // - Manipulator Anchor
            MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
            {
                node: MOCK_WINDOW.HTMLDivElement,
                textContent: lTextContent
            }
        ], true);
    });
});

Deno.test('DynamicContent--Functionality: Wrong result type', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$dynamic-content(this.getContent())`
        })
        class TestComponent extends Processor {
            public getContent(): number {
                return 111;
            }
        }

        // Process. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (pError) {
            const lError: Error = <Error>pError;
            lErrorMessage = lError.message;
        }

        // Evaluation.
        expect(lErrorMessage).toBe('Dynamic content method has a wrong result type.');
    });
});