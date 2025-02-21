import { expect } from '@kartoffelgames/core-test';
import { describe, it, before } from '@std/testing/bdd';
import { Component, IComponentOnAttributeChange, IComponentOnDeconstruct, IComponentOnUpdate } from '../../../../source/core/component/component.ts';
import { ComponentRegister } from '../../../../source/core/component/component-register.ts';
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator.ts';
import { PwbConfiguration } from '../../../../source/core/configuration/pwb-configuration.ts';
import { CoreEntityProcessorProxy } from '../../../../source/core/core_entity/interaction-tracker/core-entity-processor-proxy.ts';
import { Processor } from '../../../../source/core/core_entity/processor.ts';
import { UpdateLoopError } from '../../../../source/core/core_entity/updater/update-loop-error.ts';
import { UpdateMode } from '../../../../source/core/enum/update-mode.enum.ts';
import { UpdateTrigger } from '../../../../source/core/enum/update-trigger.enum.ts';
import { IExpressionOnUpdate } from '../../../../source/core/module/expression_module/expression-module.ts';
import { PwbExpressionModule } from '../../../../source/core/module/expression_module/pwb-expression-module.decorator.ts';
import { PwbExport } from '../../../../source/module/export/pwb-export.decorator.ts';
import '../../../utility/request-animation-frame-mock-session.ts';
import { TestUtil } from '../../../utility/test-util.ts';

describe('HtmlComponent', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- Single element', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div/>`
        })
        class TestComponent extends Processor { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).toBeComponentStructure([Comment, HTMLDivElement], true);
    });

    it('-- Sibling element', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div/><span/>'
        })
        class TestComponent extends Processor { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div, Span.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(3);
        expect(lComponent).toBeComponentStructure([Comment, HTMLDivElement, HTMLSpanElement], true);
    });

    it('-- Child element', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div><span/></div>'
        })
        class TestComponent extends Processor { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).toBeComponentStructure([
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
        class TestComponent extends Processor { }


        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).toBeComponentStructure([
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
        class TestChildComponent extends Processor { }

        // Setup. Define parent component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lChildSelector}/><${lChildSelector}/>`
        })
        class TestComponent extends Processor { }

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
        class TestComponent extends Processor { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        expect(lComponent).toBeComponentStructure([
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
        class TestComponent extends Processor { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);
        const lStyleElement: HTMLStyleElement = <HTMLStyleElement>(<ShadowRoot>lComponent.shadowRoot).childNodes[0];

        // Evaluation
        expect(lComponent).toBeComponentStructure([
            HTMLStyleElement,
            Comment
        ], true);
        expect(lStyleElement.textContent).toBe(lStyleContent);
    });

    it('-- Manual update. Initial update', async () => {
        // Setup.
        const lInitialValue: string = 'Initial value';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div>{{ this.value }}</div>',
            updateScope: UpdateMode.Manual
        })
        class TestComponent extends Processor {
            public value: string = lInitialValue;
        }

        // Process. Create element.
        const lComponentConstructor: CustomElementConstructor = ComponentRegister.ofConstructor(TestComponent).elementConstructor;
        const lComponent: HTMLElement = new lComponentConstructor() as any;

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment,
            {
                node: HTMLDivElement,
                textContent: lInitialValue
            }
        ], true);
    });

    it('-- Manual update. User triggered update', async () => {
        // Setup.
        const lInitialValue: string = 'Initial value';
        const lNewValue: string = 'New Value';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div>{{ this.value }}</div>',
            updateScope: UpdateMode.Manual
        })
        class TestComponent extends Processor {
            @PwbExport
            public value: string = lInitialValue;

            public constructor(private readonly mComponent: Component) {
                super();
            }

            @PwbExport
            public update(): void {
                this.mComponent.update();
            }
        }

        // Process. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.value = lNewValue;

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment,
            {
                node: HTMLDivElement,
                textContent: lInitialValue
            }
        ], true);

        // Process. Trigger update.
        lComponent.update();
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment,
            {
                node: HTMLDivElement,
                textContent: lNewValue
            }
        ], true);
    });

    it('-- Isolated update scope', async () => {
        // Setup.
        const lIsolatedSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        let lIsolatedUpdated: boolean = false;
        @PwbComponent({
            selector: lIsolatedSelector,
            template: '{{this.innerValue}}',
            updateScope: UpdateMode.Isolated
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class CapsuledTestComponent extends Processor implements IComponentOnUpdate {
            @PwbExport
            public innerValue: string = '';

            onUpdate(): void {
                lIsolatedUpdated = true;
            }
        }

        // Process. Define component.
        let lDefaultUpdated: boolean = false;
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lIsolatedSelector}/>`,
            updateScope: UpdateMode.Default
        })
        class TestComponent extends Processor implements IComponentOnUpdate {
            onUpdate(): void {
                lDefaultUpdated = true;
            }
        }

        // Process. Create and initialize element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        await TestUtil.waitForUpdate(lComponent);
        const lCapsuledContent: HTMLElement & CapsuledTestComponent = TestUtil.getComponentNode(lComponent, lIsolatedSelector);

        // Process. Wait for any update to finish.
        await TestUtil.waitForUpdate(lComponent);
        await TestUtil.waitForUpdate(lCapsuledContent);

        // Reset update 
        lIsolatedUpdated = false;
        lDefaultUpdated = false;

        // Proccess. Change Capsuled value.
        lCapsuledContent.innerValue = '12';
        await TestUtil.waitForUpdate(lComponent);
        await TestUtil.waitForUpdate(lCapsuledContent);

        // Evaluation.
        expect(lDefaultUpdated, 'TestComponent').to.be.false;
        expect(lIsolatedUpdated, 'CapsuledTestComponent').to.be.true;
    });

    it('-- Custom expression module', async () => {
        // Setup.
        const lExpressionValue: string = 'EXPRESSION-VALUE';

        // Setup. Custom expression module.
        @PwbExpressionModule({
            trigger: UpdateTrigger.Any
        })
        class TestExpressionModule extends Processor implements IExpressionOnUpdate {
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
        class TestComponent extends Processor { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
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
        class TestComponent extends Processor { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, unknown-component.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).toBeComponentStructure([Comment, HTMLUnknownElement], true);
    });

    it('-- Create HTMLElement on unknown component', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<unknown-component/>'
        })
        class TestComponent extends Processor { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, unknown-component.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).toBeComponentStructure([Comment, HTMLElement], true); // HTMLUnknownElement not creates in JSDOM.
    });

    it('-- Element reference', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class TestComponent extends Processor {
            private readonly mElementReference: Node;
            public constructor(pElementReference: Component) {
                super();

                this.mElementReference = pElementReference.element;
            }

            @PwbExport
            public element(): Node {
                return this.mElementReference;
            }
        }

        // Process. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lComponentReference: Node = CoreEntityProcessorProxy.getOriginal(lComponent.element());

        // Evaluation
        // 2 => StaticAnchor, unknown-component.
        expect(lComponent).toBe(lComponentReference);
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
        class TestComponent extends Processor implements IComponentOnUpdate, IComponentOnAttributeChange, IComponentOnDeconstruct {
            @PwbExport
            public innerValue: string = 'DUMMY-VALUE';

            private mOnPwbUpdateCalled: boolean = false;

            public constructor() {
                super();

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
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.setAttribute('innerValue', 'New-Value');

        // Process. Wait for update and register onAttributeChange changes.
        await TestUtil.waitForUpdate(lComponent);

        TestUtil.deconstructComponent(lComponent);

        // Evaluation.
        expect(lExpectedCallOrder).to.deep.equal(
            [
                lCallPosition.onPwbInitialize,
                lCallPosition.onPwbUpdate,
                // lCallPosition.onPwbAttributeChange, JSDOM Complete garbage. Wo ever programmed this piece of * should rethink their life.
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
        class TestComponent extends Processor implements IComponentOnDeconstruct {
            public onDeconstruct(): void {
                lWasDeconstructed = true;
            }
        }

        // Process. Create element indirect callback.
        const lComponent: HTMLElement = await <any>TestUtil.createComponent(TestComponent);
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
        class TestComponent extends Processor implements IComponentOnUpdate {
            public innerValue: number = 1;

            private readonly mComponent: Component;
            public constructor(pComponent: Component) {
                super();

                this.mComponent = pComponent;
            }

            public onUpdate(): void {
                // Trigger update again after update.
                this.triggerUpdate();
            }

            private triggerUpdate(): void {
                this.innerValue++;
                this.mComponent.update();
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
        expect(lError).toBeInstanceOf(UpdateLoopError);
    });

    it('-- Creation without customElements register', async () => {
        // Setup.
        const lSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lSelector
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestComponent extends Processor { }

        // Process. Create element.
        const lComponentConstructor: CustomElementConstructor | undefined = globalThis.customElements.get(lSelector);
        let lComponent: HTMLElement | null = null;
        if (lComponentConstructor) {
            lComponent = new lComponentConstructor();
        }

        // Evaluation.
        expect(lComponent).toBeInstanceOf(HTMLElement);
    });

    it('-- Prevent construction of processor when not needed.', async () => {
        // Setup. Define flag.
        let lConstructionCalled: boolean = false;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div/>`
        })
        class TestComponent extends Processor {
            public constructor() {
                super();

                lConstructionCalled = true;
            }
        }

        // Process. Create element.
        await TestUtil.createComponent(TestComponent);

        // Evaluation
        expect(lConstructionCalled).to.be.false;
    });
});