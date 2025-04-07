// Import mock at start of file.
import { TestUtil } from '../../utility/test-util.ts';

// Funcitonal imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { Injection } from "../../../../kartoffelgames.core.dependency_injection/source/index.ts";
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import type { PwbTemplateInstructionNode } from '../../../source/core/component/template/nodes/pwb-template-instruction-node.ts';
import { PwbTemplate } from '../../../source/core/component/template/nodes/pwb-template.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import { DataLevel } from '../../../source/core/data/data-level.ts';
import { ModuleDataLevel } from '../../../source/core/data/module-data-level.ts';
import { AccessMode } from '../../../source/core/enum/access-mode.enum.ts';
import { UpdateTrigger } from '../../../source/core/enum/update-trigger.enum.ts';
import { PwbAttributeModule } from '../../../source/core/module/attribute_module/pwb-attribute-module.decorator.ts';
import { ModuleTemplate } from '../../../source/core/module/injection_reference/module-template.ts';
import type { IInstructionOnUpdate } from '../../../source/core/module/instruction_module/instruction-module.ts';
import { InstructionResult } from '../../../source/core/module/instruction_module/instruction-result.ts';
import { PwbInstructionModule } from '../../../source/core/module/instruction_module/pwb-instruction-module.decorator.ts';
import { PwbComponentEventListener } from '../../../source/module/component-event-listener/pwb-component-event-listener.decorator.ts';
import type { ComponentEventEmitter } from '../../../source/module/component-event/component-event-emitter.ts';
import type { ComponentEvent } from '../../../source/module/component-event/component-event.ts';
import { PwbComponentEvent } from '../../../source/module/component-event/pwb-component-event.decorator.ts';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator.ts';

describe('ComponentEventListener', () => {
    it('-- Component click event', async () => {
        // Setup. Define component and wait for update.
        const lEventResult = await new Promise<MouseEvent>((pResolve) => {
            @PwbComponent({
                selector: TestUtil.randomSelector(),
            })
            class TestComponent extends Processor {
                @PwbComponentEventListener('click')
                public handler(pEvent: MouseEvent): void {
                    pResolve(pEvent);
                }
            }

            // Process. Create element and click div.
            TestUtil.createComponent(TestComponent).then((pComponent) => {
                pComponent.click();
            });
        });

        // Evaluation.
        expect(lEventResult).toBeInstanceOf(MouseEvent);
    });

    it('-- Native listener', async () => {
        // Process.
        let lEventCalled: boolean = false;

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent extends Processor {
            @PwbComponentEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.click();

        // Evaluation.
        expect(lEventCalled).toBeTruthy();
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
        class TestComponent extends Processor {
            @PwbComponentEvent('custom-event')
            private accessor mCustomEvent!: ComponentEventEmitter<string>;

            @PwbExport
            public callEvent() {
                this.mCustomEvent.dispatchEvent(lEventValue);
            }

            @PwbComponentEventListener('custom-event')
            private listener(pEvent: ComponentEvent<string>) {
                lEventValueResult = pEvent.value;
            }
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.callEvent();

        // Evaluation.
        expect(lEventValueResult).toBe(lEventValue);
    });

    it('-- Error on static properties', async () => {
        // Process.
        const lErrorFunction = () => {
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestComponent extends Processor {
                @PwbComponentEventListener('click')
                private static listener(_pEvent: MouseEvent) {/* Empty */ }
            }
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('Event listener is only valid on instanced property');
    });

    it('-- Error on none function properties', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent extends Processor {
            @PwbComponentEventListener('click')
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
        expect(lErrorMessage).toBe('Event listener property must be of type Function');
    });

    it('-- Two parallel listener', async () => {
        // Process.
        let lEventOneCalled: boolean = false;
        let lEventTwoCalled: boolean = false;

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent extends Processor {
            @PwbComponentEventListener('click')
            private listenerOne(_pEvent: MouseEvent) {
                lEventOneCalled = true;
            }

            @PwbComponentEventListener('click')
            private listenerTwo(_pEvent: MouseEvent) {
                lEventTwoCalled = true;
            }
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.click();

        // Evaluation.
        expect(lEventOneCalled).toBeTruthy();
        expect(lEventTwoCalled).toBeTruthy();
    });

    it('-- Remove listener on deconstruct', async () => {
        // Process.
        let lEventCalled: boolean = false;

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent extends Processor {
            @PwbComponentEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.deconstructComponent(lComponent);
        lComponent.click();

        // Evaluation.
        expect(lEventCalled).toBeFalsy();
    });

    it('-- Native listener on static module', async () => {
        // Process.
        let lEventCalled: boolean = false;

        @PwbAttributeModule({
            access: AccessMode.Read,
            selector: /^listenerTestModuleOne$/,
            trigger: UpdateTrigger.Any
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class MyModule extends Processor {
            @PwbComponentEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div listenerTestModuleOne />'
        })
        class TestComponent extends Processor { }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lDivElement: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');
        lDivElement.dispatchEvent(new Event('click', { bubbles: false }));

        // Evaluation.
        expect(lEventCalled).toBeTruthy();
    });

    it('-- Remove module listener on deconstruct on static modules', async () => {
        // Process.
        let lEventCalled: boolean = false;

        @PwbAttributeModule({
            access: AccessMode.Read,
            selector: /^listenerTestModuleTwo$/,
            trigger: UpdateTrigger.Any
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class MyModule extends Processor {
            @PwbComponentEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div listenerTestModuleTwo />'
        })
        class TestComponent extends Processor { }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.deconstructComponent(lComponent);
        lComponent.click();

        // Evaluation.
        expect(lEventCalled).toBeFalsy();
    });

    it('-- Error on none function properties on static module', async () => {
        // Setup. Create static module.
        @PwbAttributeModule({
            access: AccessMode.Read,
            selector: /^listenerTestModuleThree$/,
            trigger: UpdateTrigger.Any
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class MyModule extends Processor {
            @PwbComponentEventListener('click')
            private readonly mListener!: string;
        }

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div listenerTestModuleThree />'
        })
        class TestComponent extends Processor { }

        // Setup. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (pError) {
            const lError: Error = <Error>pError;
            lErrorMessage = lError.message;
        }

        // Evaluation.
        expect(lErrorMessage).toBe('Event listener property must be of type Function');
    });

    it('-- Dont call event listener for instruction modules', async () => {
        // Process.
        let lEventCalled: boolean = false;

        @PwbInstructionModule({
            instructionType: 'listenerTestModuleFour',
            trigger: UpdateTrigger.Any
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class MyModule extends Processor implements IInstructionOnUpdate {
            private readonly mTemplate: ModuleTemplate;
            private readonly mValue: ModuleDataLevel;

            public constructor(pTemplate = Injection.use(ModuleTemplate), pValue = Injection.use(ModuleDataLevel)) {
                super();

                this.mTemplate = pTemplate;
                this.mValue = pValue;
            }

            onUpdate(): InstructionResult | null {
                const lResult: InstructionResult = new InstructionResult();

                const lTemplate: PwbTemplate = new PwbTemplate();
                lTemplate.appendChild(...(<PwbTemplateInstructionNode>this.mTemplate).childList);

                lResult.addElement(lTemplate, new DataLevel(this.mValue.data));

                return lResult;
            }

            @PwbComponentEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '$listenerTestModuleFour{<div/>}'
        })
        class TestComponent extends Processor { }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lDivElement: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');

        // Evaluation after inner click..
        lDivElement.dispatchEvent(new Event('click', { bubbles: true }));

        // Evaluation after component click.
        expect(lEventCalled).toBeFalsy();
    });

    it('-- Native listener inherited from parent', async () => {
        // Process.
        let lEventCalled: boolean = false;

        // Process. Define parent class.
        class ParentClass extends Processor {
            @PwbComponentEventListener('click')
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
        expect(lEventCalled).toBeTruthy();
    });
});