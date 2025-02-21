import { Exception } from '@kartoffelgames/core';
import { expect } from '@kartoffelgames/core-test';
import { before, describe, it } from '@std/testing/bdd';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import { ComponentEventEmitter } from '../../../source/module/component-event/component-event-emitter.ts';
import { ComponentEvent } from '../../../source/module/component-event/component-event.ts';
import { PwbComponentEvent } from '../../../source/module/component-event/pwb-component-event.decorator.ts';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator.ts';
import '../../utility/request-animation-frame-mock-session.ts';
import { TestUtil } from '../../utility/test-util.ts';

describe('ComponentEvent', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- Correct event value', async () => {
        // Setup. Values.
        const lEventValue: string = 'EVENT-VALUE';
        const lEventName = 'custom-event';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class EventComponent extends Processor {
            @PwbComponentEvent(lEventName)
            private readonly mEvent!: ComponentEventEmitter<string>;

            @PwbExport
            public callEvent(): void {
                this.mEvent.dispatchEvent(lEventValue);
            }
        }

        // Setup. Create element and click div.
        const lEventComponent: HTMLDivElement & EventComponent = await <any>TestUtil.createComponent(EventComponent);

        // Setup. Wait for "click" event
        const lEventResult: ComponentEvent<string> = await new Promise<ComponentEvent<string>>((pResolve) => {
            lEventComponent.addEventListener(lEventName, (pEvent: any) => {
                pResolve(pEvent);
            });

            // Process. Call event.
            lEventComponent.callEvent();
        });

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lEventResult.value).toBe(lEventValue);
    });

    it('-- Forbidden static usage', () => {
        // Process. Define component.
        const lErrorFunction = () => {
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class EventComponent extends Processor {
                @PwbComponentEvent('custom-event')
                private static readonly mEvent: ComponentEventEmitter<string>;
            }
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('Event target is not for an instanced property.');
    });

    it('-- Inherited and overriden event-emitter event', async () => {
        // Setup. Values.
        const lEventValue: string = 'EVENT-VALUE';

        // Process. Define parent class.
        class ParentClass extends Processor {
            @PwbComponentEvent('custom-event')
            private readonly mEvent!: ComponentEventEmitter<string>;
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class EventComponent extends ParentClass {
            @PwbComponentEvent('custom-event')
            private readonly mOverridenEvent!: ComponentEventEmitter<string>;

            @PwbExport
            public callEvent(): void {
                this.mOverridenEvent.dispatchEvent(lEventValue);
            }
        }

        // Setup. Create element and click div.
        const lEventComponent: HTMLDivElement & EventComponent = await <any>TestUtil.createComponent(EventComponent);

        // Setup. Wait for "click" event
        const lEventResult: ComponentEvent<string> = await new Promise<ComponentEvent<string>>((pResolve) => {
            lEventComponent.addEventListener('custom-event', (pEvent: any) => {
                pResolve(pEvent);
            });

            // Process. Call event.
            lEventComponent.callEvent();
        });

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lEventResult.value).toBe(lEventValue);
    });

    it('-- Inherited event-emitter event', async () => {
        // Setup. Values.
        const lEventValue: string = 'EVENT-VALUE';

        // Process. Define parent class.
        class ParentClass extends Processor {
            @PwbComponentEvent('custom-event')
            private readonly mEvent!: ComponentEventEmitter<string>;

            @PwbExport
            public callEvent(): void {
                this.mEvent.dispatchEvent(lEventValue);
            }
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class EventComponent extends ParentClass { }

        // Setup. Create element and click div.
        const lEventComponent: HTMLElement & EventComponent = await <any>TestUtil.createComponent(EventComponent);
        lEventComponent.callEvent();

        // Setup. Wait for event
        const lEventResult: ComponentEvent<string> = await new Promise<ComponentEvent<string>>((pResolve) => {
            lEventComponent.addEventListener('custom-event', (pEvent: any) => {
                pResolve(pEvent);
            });

            // Process. Call event.
            lEventComponent.callEvent();
        });

        // Evaluation.
        expect(lEventResult).toBeInstanceOf(ComponentEvent);
    });

    it('-- Override native events', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class EventComponent extends Processor {
            @PwbComponentEvent('click')
            private readonly mEvent!: ComponentEventEmitter<string>;

            @PwbExport
            public callEvent(): void {
                this.mEvent.dispatchEvent('ANY VALUE');
            }
        }

        // Setup. Create element and click div.
        const lEventComponent: HTMLElement & EventComponent = await <any>TestUtil.createComponent(EventComponent);

        // Setup. Wait for "click" event
        const lEventResult: ComponentEvent<string> = await new Promise<ComponentEvent<string>>((pResolve) => {
            lEventComponent.addEventListener('click', (pEvent: any) => {
                pResolve(pEvent);
            });

            // Process. Call event.
            lEventComponent.callEvent();
        });

        // Evaluation.
        expect(lEventResult).toBeInstanceOf(ComponentEvent);
    });

    it('-- Nativ and custom event parallel', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class EventComponent extends Processor {
            @PwbComponentEvent('custom-event')
            private readonly mEvent!: ComponentEventEmitter<void>;

            @PwbExport
            public callEvent(): void {
                this.mEvent.dispatchEvent();
            }
        }

        // Setup. Create element and click div.
        const lEventComponent: HTMLDivElement & EventComponent = await <any>TestUtil.createComponent(EventComponent);

        // Process. Wait for event
        let lCustomCalled: boolean = false;
        let lNativeCalled: boolean = false;
        await new Promise<void>((pResolve) => {
            lEventComponent.addEventListener('custom-event', () => {
                lCustomCalled = true;
            });

            lEventComponent.addEventListener('click', () => {
                lNativeCalled = true;
                pResolve();
            });

            // Process. Call event.
            lEventComponent.callEvent();
            lEventComponent.click();
        });

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lCustomCalled).to.be.true;
        expect(lNativeCalled).to.be.true;
    });


    it('-- Two parallel custom events correct values', async () => {
        // Setup. Values.
        const lEventValueOne: string = 'EVENT-VALUE-ONE';
        const lEventValueTwo: string = 'EVENT-VALUE-Two';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class EventComponent extends Processor {
            @PwbComponentEvent('custom-event-one')
            private readonly mEventOne!: ComponentEventEmitter<string>;
            @PwbComponentEvent('custom-event-two')
            private readonly mEventTwo!: ComponentEventEmitter<string>;

            @PwbExport
            public callEventOne(): void {
                this.mEventOne.dispatchEvent(lEventValueOne);
            }

            @PwbExport
            public callEventTwo(): void {
                this.mEventTwo.dispatchEvent(lEventValueTwo);
            }
        }

        // Setup. Create element and click div.
        const lEventComponent: HTMLDivElement & EventComponent = await <any>TestUtil.createComponent(EventComponent);

        // Process. Wait for event
        let lCustomOneValue: string = '';
        let lCustomTwoValue: string = '';
        await new Promise<void>((pResolve) => {
            lEventComponent.addEventListener('custom-event-one', (pEvent: any) => {
                lCustomOneValue = pEvent.value;
            });

            lEventComponent.addEventListener('custom-event-two', (pEvent: any) => {
                lCustomTwoValue = pEvent.value;
                pResolve();
            });

            // Process. Call event.
            lEventComponent.callEventOne();
            lEventComponent.callEventTwo();
        });

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lCustomOneValue).toBe(lEventValueOne);
        expect(lCustomTwoValue).toBe(lEventValueTwo);
    });

    it('-- Wrong emmiter type', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class EventComponent extends Processor {
            @PwbComponentEvent('custom-event')
            public mEvent!: string; // Wrong type.
        }

        // Setup. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(EventComponent);
        } catch (pError) {
            const lError: Error = <Error>pError;
            lErrorMessage = lError.message;
        }

        // Evaluation.
        expect(lErrorMessage).toBe('Event emitter property must be of type ComponentEventEmitter');
    });
});