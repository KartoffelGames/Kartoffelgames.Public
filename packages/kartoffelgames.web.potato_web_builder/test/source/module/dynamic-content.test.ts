import { expect } from '@kartoffelgames/core-test';
import { before, describe, it } from '@std/testing/bdd';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { PwbTemplateTextNode } from '../../../source/core/component/template/nodes/pwb-template-text-node.ts';
import { PwbTemplateXmlNode } from '../../../source/core/component/template/nodes/pwb-template-xml-node.ts';
import { PwbTemplate } from '../../../source/core/component/template/nodes/pwb-template.ts';
import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import '../../utility/request-animation-frame-mock-session.ts';
import { TestUtil } from '../../utility/test-util.ts';

describe('DynamicContent', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- Initial', async () => {
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
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement
        ], true);
    });

    it('-- Keep content', async () => {
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
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: lTextContent
            }
        ], true);
    });

    it('-- Wrong result type', async () => {
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
        expect(lErrorMessage).to.equal('Dynamic content method has a wrong result type.');
    });
});