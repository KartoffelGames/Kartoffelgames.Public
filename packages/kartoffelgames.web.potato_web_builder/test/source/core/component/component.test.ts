// Import mock at start of file.
import { TestUtil } from '../../../utility/test-util.ts';

// Funcitonal imports after mock.
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { InteractionZone } from '@kartoffelgames/core-interaction-zone';
import { expect } from '@kartoffelgames/core-test';
import { ComponentRegister } from '../../../../source/core/component/component-register.ts';
import { ComponentZoneConfiguration } from '../../../../source/core/component/component-zone-configuration.ts';
import { Component, type IComponentOnAttributeChange, type IComponentOnDeconstruct, type IComponentOnUpdate } from '../../../../source/core/component/component.ts';
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator.ts';
import { ComponentState } from '../../../../source/core/core_entity/component_state/component-state.ts';
import { CoreEntityUpdateLoopError } from '../../../../source/core/core_entity/updater/core-entity-update-loop-error.ts';
import type { IExpressionOnUpdate } from '../../../../source/core/module/expression_module/expression-module.ts';
import { PwbExpressionModule } from '../../../../source/core/module/expression_module/pwb-expression-module.decorator.ts';
import { PwbExport } from '../../../../source/module/export/pwb-export.decorator.ts';

Deno.test('PwbComponent--Functionality: Single element', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lComponent.shadowRoot?.childNodes).toHaveLength(2);
        expect(lComponent).toBeComponentStructure([
            Comment,
            HTMLDivElement
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Sibling element', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lComponent.shadowRoot?.childNodes).toHaveLength(3);
        expect(lComponent).toBeComponentStructure([
            Comment,
            HTMLDivElement,
            HTMLSpanElement
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Child element', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lComponent.shadowRoot?.childNodes).toHaveLength(2);
        expect(lComponent).toBeComponentStructure([
            Comment,
            {
                node: HTMLDivElement,
                childs: [HTMLSpanElement]
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Ignore Comments', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lComponent.shadowRoot?.childNodes).toHaveLength(2);
        expect(lComponent).toBeComponentStructure([
            Comment,
            {
                node: HTMLDivElement,
                childs: []
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Same component childs', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lFirstChild).toBeInstanceOf(HTMLElement);
        expect(lSecondChild).toBeInstanceOf(HTMLElement);
        expect(lFirstChild).not.toBe(lSecondChild);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: No template', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        expect(lComponent).toBeComponentStructure([
            Comment
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Add local styles', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lComponent).toBeComponentStructure([
            HTMLStyleElement,
            Comment
        ], true);
        expect(lStyleElement.textContent).toBe(lStyleContent);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Initial update on connect', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup.
        const lInitialValue: string = 'Initial value';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div>{{ this.value }}</div>'
        })
        class TestComponent {
            public value: string = lInitialValue;
        }

        // Process. Create element. The component builds itself when it is connected to the dom.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment,
            {
                node: HTMLDivElement,
                textContent: lInitialValue
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: User triggered update', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup.
        const lInitialValue: string = 'Initial value';
        const lNewValue: string = 'New Value';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div>{{ this.value }}</div>'
        })
        class TestComponent {
            @PwbExport
            public value: string = lInitialValue;

            private readonly mComponent: Component;

            public constructor(pComponent = Injection.use(Component)) {
                this.mComponent = pComponent;
            }

            @PwbExport
            public update(): void {
                this.mComponent.updater.update();
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

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Custom expression module', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup.
        const lExpressionValue: string = 'EXPRESSION-VALUE';

        // Setup. Custom expression module.
        @PwbExpressionModule()
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
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                textContent: lExpressionValue
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Create HTMLUnknownElement on unknown element', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lComponent.shadowRoot?.childNodes).toHaveLength(2);
        expect(lComponent).toBeComponentStructure([
            Comment,
            HTMLUnknownElement
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Create HTMLElement on unknown component', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lComponent.shadowRoot?.childNodes).toHaveLength(2);
        expect(lComponent).toBeComponentStructure([
            Comment,
            HTMLElement
        ], true); // HTMLUnknownElement not creates in JSDOM.

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Element reference', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class TestComponent {
            private readonly mElementReference: Node;
            public constructor(pElementReference = Injection.use(Component)) {
                this.mElementReference = pElementReference.element;
            }

            @PwbExport
            public element(): Node {
                return this.mElementReference;
            }
        }

        // Process. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lComponentReference: Node = lComponent.element();

        // Evaluation
        expect(lComponent).toBe(lComponentReference);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Parent zone injection', async (pContext) => {
    await pContext.step('Inject value from direct parent zone', async () => {
        // Setup. Define injection target and value.
        class TestInjection {
            public value: string = 'default';
        }
        const lInjectionValue: TestInjection = new TestInjection();

        // Setup. Define component that reads the injection.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            private readonly mInjection: TestInjection;

            public constructor(pInjection = Injection.use(TestInjection)) {
                this.mInjection = pInjection;
            }

            @PwbExport
            public injection(): TestInjection {
                return this.mInjection;
            }
        }

        // Setup. Create a parent zone that holds a component zone injection.
        const lParentZone: InteractionZone = InteractionZone.create('ParentZone');
        const lZoneInjection: ComponentZoneConfiguration = new ComponentZoneConfiguration();
        lZoneInjection.setInjection(TestInjection, lInjectionValue);
        lParentZone.setAttachment(ComponentZoneConfiguration.ATTACHMENT_KEY, lZoneInjection);

        // Process. Construct the component inside the parent zone.
        const lComponentConstructor: CustomElementConstructor = ComponentRegister.ofConstructor(TestComponent as any).elementConstructor;
        const lComponent: HTMLElement & TestComponent = lParentZone.execute(() => {
            return new lComponentConstructor() as any;
        });
        document.body.appendChild(lComponent);
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent.injection()).toBe(lInjectionValue);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Inject value from indirect parent zone', async () => {
        // Setup. Define injection target and value.
        class TestInjection {
            public value: string = 'default';
        }
        const lInjectionValue: TestInjection = new TestInjection();

        // Setup. Define component that reads the injection.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            private readonly mInjection: TestInjection;

            public constructor(pInjection = Injection.use(TestInjection)) {
                this.mInjection = pInjection;
            }

            @PwbExport
            public injection(): TestInjection {
                return this.mInjection;
            }
        }

        // Setup. Create a nested zone hierarchy with the injection on the root zone.
        const lRootZone: InteractionZone = InteractionZone.create('RootZone');
        const lZoneInjection: ComponentZoneConfiguration = new ComponentZoneConfiguration();
        lZoneInjection.setInjection(TestInjection, lInjectionValue);
        lRootZone.setAttachment(ComponentZoneConfiguration.ATTACHMENT_KEY, lZoneInjection);
        const lMiddleZone: InteractionZone = lRootZone.execute(() => {
            return InteractionZone.create('MiddleZone');
        });

        // Process. Construct the component inside the innermost zone.
        const lComponentConstructor: CustomElementConstructor = ComponentRegister.ofConstructor(TestComponent as any).elementConstructor;
        const lComponent: HTMLElement & TestComponent = lMiddleZone.execute(() => {
            return new lComponentConstructor() as any;
        });
        document.body.appendChild(lComponent);
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent.injection()).toBe(lInjectionValue);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Inject multiple values from parent zone', async () => {
        // Setup. Define injection targets and values.
        class TestInjectionOne {
            public value: string = 'one';
        }
        class TestInjectionTwo {
            public value: string = 'two';
        }
        const lInjectionValueOne: TestInjectionOne = new TestInjectionOne();
        const lInjectionValueTwo: TestInjectionTwo = new TestInjectionTwo();

        // Setup. Define component that reads both injections.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            private readonly mInjectionOne: TestInjectionOne;
            private readonly mInjectionTwo: TestInjectionTwo;

            public constructor(pInjectionOne = Injection.use(TestInjectionOne), pInjectionTwo = Injection.use(TestInjectionTwo)) {
                this.mInjectionOne = pInjectionOne;
                this.mInjectionTwo = pInjectionTwo;
            }

            @PwbExport
            public injectionOne(): TestInjectionOne {
                return this.mInjectionOne;
            }

            @PwbExport
            public injectionTwo(): TestInjectionTwo {
                return this.mInjectionTwo;
            }
        }

        // Setup. Create a parent zone that holds both injections.
        const lParentZone: InteractionZone = InteractionZone.create('ParentZone');
        const lZoneInjection: ComponentZoneConfiguration = new ComponentZoneConfiguration();
        lZoneInjection.setInjection(TestInjectionOne, lInjectionValueOne);
        lZoneInjection.setInjection(TestInjectionTwo, lInjectionValueTwo);
        lParentZone.setAttachment(ComponentZoneConfiguration.ATTACHMENT_KEY, lZoneInjection);

        // Process. Construct the component inside the parent zone.
        const lComponentConstructor: CustomElementConstructor = ComponentRegister.ofConstructor(TestComponent as any).elementConstructor;
        const lComponent: HTMLElement & TestComponent = lParentZone.execute(() => {
            return new lComponentConstructor() as any;
        });
        document.body.appendChild(lComponent);
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent.injectionOne()).toBe(lInjectionValueOne);
        expect(lComponent.injectionTwo()).toBe(lInjectionValueTwo);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: User callbacks', async (pContext) => {
    await pContext.step('Default', async () => {
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
            @ComponentState.state()
            public accessor innerValue: string = 'DUMMY-VALUE';

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
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.setAttribute('innerValue', 'New-Value');

        // Process. Wait for update and register onAttributeChange changes.
        await TestUtil.waitForUpdate(lComponent);

        TestUtil.deconstructComponent(lComponent);

        // Evaluation.
        expect(lExpectedCallOrder).toBeDeepEqual(
            [
                lCallPosition.onPwbInitialize,
                lCallPosition.onPwbUpdate,
                lCallPosition.onPwbAttributeChange,
                lCallPosition.onPwbDeconstruct,
            ]
        );

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Deconstruct', async (pContext) => {
    await pContext.step('Default', async () => {
        // Process. Define component.
        let lWasDeconstructed: boolean = false;
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent implements IComponentOnDeconstruct {
            public onDeconstruct(): void {
                lWasDeconstructed = true;
            }
        }

        // Process. Create element indirect callback.
        const lComponent: HTMLElement = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.forceProcessorCreation(lComponent);
        TestUtil.deconstructComponent(lComponent);

        // Evaluation.
        expect(lWasDeconstructed).toBeTruthy();

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Loop detection', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `
            <div>
                {{this.innerValue}}
            </div>`
        })
        class TestComponent implements IComponentOnUpdate {
            @ComponentState.state()
            public accessor innerValue: number = 1;

            private readonly mComponent: Component;
            private mEnabled: boolean = false;

            public constructor(pComponent = Injection.use(Component)) {
                this.mComponent = pComponent;
                this.innerValue = 1;
                this.mEnabled = false;
            }

            @PwbExport
            public disable(): void {
                this.mEnabled = false;
            }

            @PwbExport
            public enable(): void {
                this.mEnabled = true;
                this.innerValue++;
                this.mComponent.updater.update();
            }

            public onUpdate(): void {
                if (this.mEnabled) {
                    this.innerValue++;
                    this.mComponent.updater.update();
                }
            }
        }

        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Process. Create element.
        let lError: any;
        try {
            // Enable loop.
            lComponent.enable();
            await TestUtil.waitForUpdate(lComponent);
        } catch (e) {
            lError = e;
        }

        // Disable loop.
        lComponent.disable();

        // Evaluation.
        expect(lError).toBeInstanceOf(CoreEntityUpdateLoopError);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Attribute expression chain whitespace', async (pContext) => {
    await pContext.step('Whitespace between adjacent expressions if explicit added', async () => {
        // Setup. Define expected attribute value.
        const lExpectedClass: string = 'resize-handle vertical left hasPrevious hasNext';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div class="resize-handle vertical left {{this.top ? 'hasPrevious' : ''}} {{this.bottom ? 'hasNext' : ''}}"></div>`
        })
        class TestComponent {
            public bottom: boolean = true;
            public top: boolean = true;
        }

        // Process. Create element and read div class attribute.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);
        const lDiv: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');
        const lResultClass: string | null = lDiv.getAttribute('class');

        // Evaluation.
        expect(lResultClass).toBe(lExpectedClass);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('No whitespace between adjacent expressions if not explicit added', async () => {
        // Setup. Define expected attribute value.
        const lExpectedClass: string = 'resize-handle vertical left hasPrevioushasNext';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div class="resize-handle vertical left {{this.top ? 'hasPrevious' : ''}}{{this.bottom ? 'hasNext' : ''}}"></div>`
        })
        class TestComponent {
            public bottom: boolean = true;
            public top: boolean = true;
        }

        // Process. Create element and read div class attribute.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);
        const lDiv: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');
        const lResultClass: string | null = lDiv.getAttribute('class');

        // Evaluation.
        expect(lResultClass).toBe(lExpectedClass);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbComponent--Functionality: Creation without customElements register', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup.
        const lSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lSelector
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestComponent { }

        // Process. Create element.
        const lComponentConstructor: CustomElementConstructor = window.customElements.get(lSelector)!;
        const lComponent: HTMLElement = new lComponentConstructor();

        // Evaluation.
        expect(lComponent).toBeInstanceOf(HTMLElement);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});