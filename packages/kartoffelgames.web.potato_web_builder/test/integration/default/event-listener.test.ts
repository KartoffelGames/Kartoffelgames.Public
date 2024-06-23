import { Exception } from '@kartoffelgames/core.data';
import { expect } from 'chai';
import { ModuleValues } from '../../../source';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator';
import { PwbTemplate } from '../../../source/core/component/template/nodes/pwb-template';
import { PwbTemplateInstructionNode } from '../../../source/core/component/template/nodes/pwb-template-instruction-node';
import { ScopedValues } from '../../../source/core/component/values/scoped-values';
import { ModuleTemplateReference } from '../../../source/core/injection-reference/module/module-template-reference';
import { PwbAttributeModule } from '../../../source/core/module/attribute_module/pwb-attribute-module.decorator';
import { IInstructionOnUpdate } from '../../../source/core/module/instruction_module/instruction-module';
import { PwbInstructionModule } from '../../../source/core/module/instruction_module/pwb-instruction-module.decorator';
import { InstructionResult } from '../../../source/core/module/instruction_module/result/instruction-result';
import { ComponentEvent } from '../../../source/default_module/component-event/component-event';
import { ComponentEventEmitter } from '../../../source/default_module/component-event/component-event-emitter';
import { PwbComponentEvent } from '../../../source/default_module/component-event/pwb-component-event.decorator';
import { PwbEventListener } from '../../../source/default_module/event-listener/pwb-event-listener.decorator';
import { PwbExport } from '../../../source/default_module/export/pwb-export.decorator';
import { AccessMode } from '../../../source/enum/access-mode.enum';
import { UpdateTrigger } from '../../../source/enum/update-trigger.enum';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

describe('PwbEventListener', () => {
    it('-- Native listener', async () => {
        // Process.
        let lEventCalled: boolean = false;

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.click();

        // Evaluation.
        expect(lEventCalled).to.be.true;
    });

    it('-- Custom event listener', async () => {
        // Setup.
        const lEventValue: string = 'EVENT-VALUE';

        // Process.
        let lEventValueResult: string = 'EVENT-VALUE';

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbComponentEvent('custom-event')
            private readonly mCustomEvent!: ComponentEventEmitter<string>;

            @PwbExport
            public callEvent() {
                this.mCustomEvent.dispatchEvent(lEventValue);
            }

            @PwbEventListener('custom-event')
            private listener(pEvent: ComponentEvent<string>) {
                lEventValueResult = pEvent.value;
            }
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.callEvent();

        // Evaluation.
        expect(lEventValueResult).to.equal(lEventValue);
    });

    it('-- Error on static properties', async () => {
        // Process.
        const lErrorFunction = () => {
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestComponent {
                @PwbEventListener('click')
                private static listener(_pEvent: MouseEvent) {/* Empty */ }
            }
        };

        // Evaluation.
        expect(lErrorFunction).to.throw(Exception, 'Event listener is only valid on instanced property');
    });

    it('-- Error on none function properties', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbEventListener('click')
            private readonly mListener!: string;
        }

        // Setup. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (pError) {
            const lError: Error = <Error>pError;
            lErrorMessage = lError.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal('Event listener property must be of type Function');
    });

    it('-- Two parallel listener', async () => {
        // Process.
        let lEventOneCalled: boolean = false;
        let lEventTwoCalled: boolean = false;

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbEventListener('click')
            private listenerOne(_pEvent: MouseEvent) {
                lEventOneCalled = true;
            }

            @PwbEventListener('click')
            private listenerTwo(_pEvent: MouseEvent) {
                lEventTwoCalled = true;
            }
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.click();

        // Evaluation.
        expect(lEventOneCalled).to.be.true;
        expect(lEventTwoCalled).to.be.true;
    });

    it('-- Remove listener on deconstruct', async () => {
        // Process.
        let lEventCalled: boolean = false;

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.deconstructComponent(lComponent);
        lComponent.click();

        // Evaluation.
        expect(lEventCalled).to.be.false;
    });

    it('-- Native listener on static module', async () => {
        // Process.
        let lEventCalled: boolean = false;

        @PwbAttributeModule({
            access: AccessMode.Read,
            selector: /^listenerTestModuleOne$/,
            trigger: UpdateTrigger.Default
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class MyModule {
            @PwbEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div listenerTestModuleOne />'
        })
        class TestComponent { }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lDivElement: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');
        lDivElement.dispatchEvent(new Event('click', { bubbles: false }));

        // Evaluation.
        expect(lEventCalled).to.be.true;
    });

    it('-- Remove module listener on deconstruct on static modules', async () => {
        // Process.
        let lEventCalled: boolean = false;

        @PwbAttributeModule({
            access: AccessMode.Read,
            selector: /^listenerTestModuleTwo$/,
            trigger: UpdateTrigger.Default
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class MyModule {
            @PwbEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div listenerTestModuleTwo />'
        })
        class TestComponent { }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.deconstructComponent(lComponent);
        lComponent.click();

        // Evaluation.
        expect(lEventCalled).to.be.false;
    });

    it('-- Error on none function properties on static module', async () => {
        // Setup. Create static module.
        @PwbAttributeModule({
            access: AccessMode.Read,
            selector: /^listenerTestModuleThree$/,
            trigger: UpdateTrigger.Default
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class MyModule {
            @PwbEventListener('click')
            private readonly mListener!: string;
        }

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div listenerTestModuleThree />'
        })
        class TestComponent { }

        // Setup. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (pError) {
            const lError: Error = <Error>pError;
            lErrorMessage = lError.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal('Event listener property must be of type Function');
    });

    it('-- Dont call event listener for instruction modules.', async () => {
        // Process.
        let lEventCalled: boolean = false;

        @PwbInstructionModule({
            instructionType: 'listenerTestModuleFour',
            trigger: UpdateTrigger.Default
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class MyModule implements IInstructionOnUpdate {
            public constructor(private readonly mTemplate: ModuleTemplateReference, private readonly mValue: ModuleValues) { }

            onUpdate(): InstructionResult | null {
                const lResult: InstructionResult = new InstructionResult();

                const lTemplate: PwbTemplate = new PwbTemplate();
                lTemplate.appendChild(...(<PwbTemplateInstructionNode>this.mTemplate).childList);

                lResult.addElement(lTemplate, new ScopedValues(this.mValue.scopedValues));

                return lResult;
            }

            @PwbEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '$listenerTestModuleFour{<div/>}'
        })
        class TestComponent { }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lDivElement: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');

        // Evaluation after inner click..
        lDivElement.dispatchEvent(new Event('click', { bubbles: true }));

        // Evaluation after component click.
        expect(lEventCalled).to.be.false;
    });

    it('-- Native listener inherited from parent', async () => {
        // Process.
        let lEventCalled: boolean = false;

        // Process. Define parent class.
        class ParentClass {
            @PwbEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent extends ParentClass { }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.click();

        // Evaluation.
        expect(lEventCalled).to.be.true;
    });
});