import { InteractionReason, InteractionResponseType } from '@kartoffelgames/web.change-detection';
import { InteractionDetectionProxy } from '@kartoffelgames/web.change-detection/library/source/change_detection/synchron_tracker/interaction-detection-proxy';
import { expect } from 'chai';
import { ComponentElement, IComponentOnAttributeChange, IComponentOnDeconstruct, IComponentOnUpdate } from '../../source/core/component/component';
import { ComponentRegister } from '../../source/core/component/component-register';
import { LoopError } from '../../source/core/component/handler/loop-detection-handler';
import { UpdateHandler } from '../../source/core/component/handler/update-handler';
import { PwbComponent } from '../../source/core/component/pwb-component.decorator';
import { ComponentElementReference } from '../../source/core/injection-reference/component/component-element-reference';
import { ComponentUpdateHandlerReference } from '../../source/core/injection-reference/component/component-update-handler-reference';
import { IExpressionOnUpdate } from '../../source/core/module/expression_module/expression-module';
import { PwbExpressionModule } from '../../source/core/module/expression_module/pwb-expression-module.decorator';
import { PwbExport } from '../../source/default_module/export/pwb-export.decorator';
import { UpdateMode } from '../../source/enum/update-mode.enum';
import { UpdateTrigger } from '../../source/enum/update-trigger.enum';
import '../mock/request-animation-frame-mock-session';
import '../utility/chai-helper';
import { TestUtil } from '../utility/test-util';

describe('HtmlComponent', () => {
    it('-- Single element', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div/>`
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).to.have.componentStructure([Comment, HTMLDivElement], true);
    });

    it('-- Sibling element', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div/><span/>'
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div, Span.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(3);
        expect(lComponent).to.have.componentStructure([Comment, HTMLDivElement, HTMLSpanElement], true);
    });

    it('-- Child element', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div><span/></div>'
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).to.have.componentStructure([
            Comment,
            {
                node: HTMLDivElement,
                childs: [HTMLSpanElement]
            }
        ], true);
    });

    it('-- Ignore comments', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div><!-- Comment --></div>'
        })
        class TestComponent { }


        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).to.have.componentStructure([
            Comment,
            {
                node: HTMLDivElement,
                childs: []
            }
        ], true);
    });

    it('-- Same component childs', async () => {
        // Setup. Define child component.
        const lChildSelector: string = TestUtil.randomSelector();
        @PwbComponent({
            selector: lChildSelector
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestChildComponent { }

        // Setup. Define parent component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lChildSelector}/><${lChildSelector}/>`
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);
        const lFirstChild: HTMLElement = <HTMLElement>(<ShadowRoot>lComponent.shadowRoot).childNodes[1];
        const lSecondChild: HTMLElement = <HTMLElement>(<ShadowRoot>lComponent.shadowRoot).childNodes[2];

        // Evaluation
        expect(lFirstChild).instanceOf(HTMLElement);
        expect(lSecondChild).instanceOf(HTMLElement);
        expect(lFirstChild).to.not.be.equal(lSecondChild);
    });

    it('-- No template', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        expect(lComponent).to.have.componentStructure([
            Comment
        ], true);
    });

    it('-- Add local styles', async () => {
        const lStyleContent: string = 'p {color: red;}';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            style: lStyleContent
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);
        const lStyleElement: HTMLStyleElement = <HTMLStyleElement>(<ShadowRoot>lComponent.shadowRoot).childNodes[0];

        // Evaluation
        expect(lComponent).to.have.componentStructure([
            HTMLStyleElement,
            Comment
        ], true);
        expect(lStyleElement.textContent).to.equal(lStyleContent);
    });

    it('-- Manual update. No initial update', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div />',
            updateScope: UpdateMode.Manual
        })
        class TestComponent { }

        // Process. Create element.
        const lComponentConstructor: CustomElementConstructor = ComponentRegister.ofConstructor(TestComponent).elementConstructor;
        const lComponent: ComponentElement = new lComponentConstructor() as any;
        document.body.appendChild(lComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment
        ], true);
    });

    it('-- Manual update. User triggered update', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div />',
            updateScope: UpdateMode.Manual
        })
        class TestComponent {
            private readonly mUpdater: UpdateHandler;
            public constructor(pUpdateReference: ComponentUpdateHandlerReference) {
                this.mUpdater = pUpdateReference;
            }

            @PwbExport
            public update(): void {
                this.mUpdater.update();
            }
        }

        // Process. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.update();
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment,
            HTMLDivElement
        ], true);
    });

    it('-- Isolated update scope', async () => {
        // Setup.
        const lIsolatedSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lIsolatedSelector,
            template: '{{this.innerValue}}',
            updateScope: UpdateMode.Isolated
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class CapsuledTestComponent {
            @PwbExport
            public innerValue: string = '';
        }

        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lIsolatedSelector}/>`,
            updateScope: UpdateMode.Default
        })
        class TestComponent { }

        // Process. Create and initialize element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        await TestUtil.waitForUpdate(lComponent);
        const lCapsuledContent: HTMLElement & CapsuledTestComponent = TestUtil.getComponentNode(lComponent, lIsolatedSelector);

        // Process. Wait for any update to finish.
        await TestUtil.waitForUpdate(lComponent);
        await TestUtil.waitForUpdate(lCapsuledContent);

        // Set update listener.
        let lWasUpdated: boolean = false;
        TestUtil.getComponentManager(lComponent)?.getProcessorAttribute<UpdateHandler>(ComponentUpdateHandlerReference)?.addUpdateListener((pReason: InteractionReason) => {
            lWasUpdated = pReason.property === 'innerValue' || lWasUpdated;
        });

        // Set update listener.
        let lInnerValueWasUpdated: boolean = false;
        TestUtil.getComponentManager(lCapsuledContent)?.getProcessorAttribute<UpdateHandler>(ComponentUpdateHandlerReference)?.addUpdateListener((pReason: InteractionReason) => {
            lInnerValueWasUpdated = pReason.property === 'innerValue' || lInnerValueWasUpdated;
        });

        // Proccess. Change Capsuled value.
        lCapsuledContent.innerValue = '12';
        await TestUtil.waitForUpdate(lComponent);
        await TestUtil.waitForUpdate(lCapsuledContent);

        // Evaluation.
        expect(lWasUpdated).to.be.false;
        expect(lInnerValueWasUpdated).to.be.true;
    });

    it('-- Custom expression module', async () => {
        // Setup.
        const lExpressionValue: string = 'EXPRESSION-VALUE';

        // Setup. Custom expression module.
        @PwbExpressionModule({
            trigger: UpdateTrigger.Default
        })
        class TestExpressionModule implements IExpressionOnUpdate {
            public onUpdate(): string {
                return lExpressionValue;
            }
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div>{{Anything}}</div>',
            expressionmodule: TestExpressionModule
        })
        class TestComponent { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                textContent: lExpressionValue
            }
        ], true);
    });

    it('-- Create HTMLUnknownElement on unknown element', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<unknowncomponent/>'
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, unknown-component.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).to.have.componentStructure([Comment, HTMLUnknownElement], true);
    });

    it('-- Create HTMLElement on unknown component', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<unknown-component/>'
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, unknown-component.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).to.have.componentStructure([Comment, HTMLElement], true); // HTMLUnknownElement not creates in JSDOM.
    });

    it('-- Element reference', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class TestComponent {
            private readonly mElementReference: Node;
            public constructor(pElementReference: ComponentElementReference) {
                this.mElementReference = pElementReference;
            }

            @PwbExport
            public element(): Node {
                return this.mElementReference;
            }
        }

        // Process. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lComponentReference: Node = (<any>InteractionDetectionProxy).getOriginal(lComponent.element());

        // Evaluation
        // 2 => StaticAnchor, unknown-component.
        expect(lComponent).to.equal(lComponentReference);
    });

    it('-- User callbacks', async () => {
        // Setup.
        const lCallPosition = {
            onPwbInitialize: 1,
            onPwbUpdate: 3,
            onPwbAttributeChange: 5,
            onPwbDeconstruct: 6,
        };

        // Process.
        const lExpectedCallOrder: Array<number> = new Array<number>();

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div>{{this.innerValue}}</div>'
        })
        class TestComponent implements IComponentOnUpdate, IComponentOnAttributeChange, IComponentOnDeconstruct {
            @PwbExport
            public innerValue: string = 'DUMMY-VALUE';

            private mOnPwbUpdateCalled: boolean = false;

            public constructor() {
                lExpectedCallOrder.push(lCallPosition.onPwbInitialize);
            }

            public onAttributeChange(_pAttributeName: string): void {
                lExpectedCallOrder.push(lCallPosition.onPwbAttributeChange);
            }

            public onDeconstruct(): void {
                lExpectedCallOrder.push(lCallPosition.onPwbDeconstruct);
            }

            public onUpdate(): void {
                // Update can be called multiple times.
                if (!this.mOnPwbUpdateCalled) {
                    this.mOnPwbUpdateCalled = true;
                    lExpectedCallOrder.push(lCallPosition.onPwbUpdate);
                }
            }
        }

        // Process. Create element indirect callback.
        const lComponent: ComponentElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.innerValue = 'New-Value';
        TestUtil.deconstructComponent(lComponent);

        // Evaluation.
        expect(lExpectedCallOrder).to.deep.equal(
            [
                lCallPosition.onPwbInitialize,
                lCallPosition.onPwbUpdate,
                lCallPosition.onPwbAttributeChange,
                lCallPosition.onPwbDeconstruct,
            ]
        );
    });

    it('-- Deconstruct Manual', async () => {
        // Process. Define component.
        let lWasDeconstructed: boolean = false;
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            updateScope: UpdateMode.Manual
        })
        class TestComponent implements IComponentOnDeconstruct {
            public onDeconstruct(): void {
                lWasDeconstructed = true;
            }
        }

        // Process. Create element indirect callback.
        const lComponent: ComponentElement = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.forceProcessorCreation(lComponent);
        TestUtil.deconstructComponent(lComponent);

        // Evaluation.
        expect(lWasDeconstructed).to.be.true;
    });

    it('-- Loop detection', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div>{{this.innerValue}}</div>'
        })
        class TestComponent implements IComponentOnUpdate {
            public innerValue: number = 1;

            private readonly mUpdater: UpdateHandler;
            public constructor(pUpdateReference: ComponentUpdateHandlerReference) {
                this.mUpdater = pUpdateReference;
            }

            public onUpdate(): void {
                // Trigger update again after update.
                this.triggerUpdate();
            }

            private triggerUpdate(): void {
                this.innerValue++;
                this.mUpdater.requestUpdate(new InteractionReason(InteractionResponseType.Any, this));
            }
        }

        // Process. Create element.
        let lError: any;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (e) {
            lError = e;
        }

        // Evaluation.
        expect(lError).to.be.instanceOf(LoopError);
    });

    it('-- Creation without PwbApp', async () => {
        // Setup.
        const lSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lSelector
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestComponent { }

        // Process. Create element.
        const lComponentConstructor: CustomElementConstructor | undefined = window.customElements.get(lSelector);
        let lComponent: HTMLElement | null = null;
        if (lComponentConstructor) {
            lComponent = new lComponentConstructor();
        }

        // Evaluation.
        expect(lComponent).to.be.instanceOf(HTMLElement);
    });

    it('-- Prevent construction of processor when not needed.', async () => {
        // Setup. Define flag.
        let lConstructionCalled: boolean = false;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div/>`
        })
        class TestComponent {
            public constructor() {
                lConstructionCalled = true;
            }
        }

        // Process. Create element.
        await TestUtil.createComponent(TestComponent);

        // Evaluation
        expect(lConstructionCalled).to.be.false;
    });
});