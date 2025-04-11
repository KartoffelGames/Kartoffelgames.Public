// Import mock at start of file.
import { MOCK_WINDOW, TestUtil } from '../../utility/test-util.ts';

// Funcitonal imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import type { ComponentEventEmitter, IComponentEvent } from '../../../source/module/component-event/component-event-emitter.ts';
import { PwbComponentEvent } from '../../../source/module/component-event/pwb-component-event.decorator.ts';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator.ts';

Deno.test('ComponentEvent--Functionality: Correct event value', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        const lEventValue: string = 'EVENT-VALUE';
        const lEventName = 'custom-event';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class EventComponent extends Processor {
            @PwbComponentEvent(lEventName)
            private accessor mEvent!: ComponentEventEmitter<string>;

            @PwbExport
            public callEvent(): void {
                this.mEvent.dispatchEvent(lEventValue);
            }
        }

        // Setup. Create element and click div.
        const lEventComponent: HTMLDivElement & EventComponent = await <any>TestUtil.createComponent(EventComponent);

        // Setup. Wait for "click" event
        const lEventResult: IComponentEvent<string> = await new Promise<IComponentEvent<string>>((pResolve) => {
            lEventComponent.addEventListener(lEventName, (pEvent: any) => {
                pResolve(pEvent);
            });

            // Process. Call event.
            lEventComponent.callEvent();
        });

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lEventResult.value).toBe(lEventValue);
    });
});

Deno.test('ComponentEvent--Functionality: Forbidden static usage', (pContext) => {
    pContext.step('Default', () => {
        // Process. Define component.
        const lErrorFunction = () => {
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class EventComponent extends Processor {
                @PwbComponentEvent('custom-event')
                private static accessor mEvent: ComponentEventEmitter<string>;
            }
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('Event target is not for a static property.');
    });
});

Deno.test('ComponentEvent--Functionality: Inherited and overridden event-emitter event', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        const lEventValue: string = 'EVENT-VALUE';

        // Process. Define parent class.
        class ParentClass extends Processor {
            @PwbComponentEvent('custom-event')
            private accessor mEvent!: ComponentEventEmitter<string>;
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class EventComponent extends ParentClass {
            @PwbComponentEvent('custom-event')
            private accessor mOverriddenEvent!: ComponentEventEmitter<string>;

            @PwbExport
            public callEvent(): void {
                this.mOverriddenEvent.dispatchEvent(lEventValue);
            }
        }

        // Setup. Create element and click div.
        const lEventComponent: HTMLDivElement & EventComponent = await <any>TestUtil.createComponent(EventComponent);

        // Setup. Wait for "click" event
        const lEventResult: IComponentEvent<string> = await new Promise<IComponentEvent<string>>((pResolve) => {
            lEventComponent.addEventListener('custom-event', (pEvent: any) => {
                pResolve(pEvent);
            });

            // Process. Call event.
            lEventComponent.callEvent();
        });

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lEventResult.value).toBe(lEventValue);
    });
});

Deno.test('ComponentEvent--Functionality: Inherited event-emitter event', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        const lEventValue: string = 'EVENT-VALUE';

        // Process. Define parent class.
        class ParentClass extends Processor {
            @PwbComponentEvent('custom-event')
            private accessor mEvent!: ComponentEventEmitter<string>;

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
        const lEventResult: IComponentEvent<string> = await new Promise<IComponentEvent<string>>((pResolve) => {
            lEventComponent.addEventListener('custom-event', (pEvent: any) => {
                pResolve(pEvent);
            });

            // Process. Call event.
            lEventComponent.callEvent();
        });

        // Evaluation.
        expect(lEventResult).toBeInstanceOf(MOCK_WINDOW.Event);
    });
});

Deno.test('ComponentEvent--Functionality: Override native events', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class EventComponent extends Processor {
            @PwbComponentEvent('click')
            private accessor mEvent!: ComponentEventEmitter<string>;

            @PwbExport
            public callEvent(): void {
                this.mEvent.dispatchEvent('ANY VALUE');
            }
        }

        // Setup. Create element and click div.
        const lEventComponent: HTMLElement & EventComponent = await <any>TestUtil.createComponent(EventComponent);

        // Setup. Wait for "click" event
        const lEventResult: IComponentEvent<string> = await new Promise<IComponentEvent<string>>((pResolve) => {
            lEventComponent.addEventListener('click', (pEvent: any) => {
                pResolve(pEvent);
            });

            // Process. Call event.
            lEventComponent.callEvent();
        });

        // Evaluation.
        expect(lEventResult).toBeInstanceOf(MOCK_WINDOW.Event);
    });
});

Deno.test('ComponentEvent--Functionality: Native and custom event parallel', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class EventComponent extends Processor {
            @PwbComponentEvent('custom-event')
            private accessor mEvent!: ComponentEventEmitter<void>;

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
        expect(lCustomCalled).toBeTruthy();
        expect(lNativeCalled).toBeTruthy();
    });
});

Deno.test('ComponentEvent--Functionality: Two parallel custom events correct values', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        const lEventValueOne: string = 'EVENT-VALUE-ONE';
        const lEventValueTwo: string = 'EVENT-VALUE-Two';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class EventComponent extends Processor {
            @PwbComponentEvent('custom-event-one')
            private accessor mEventOne!: ComponentEventEmitter<string>;
            @PwbComponentEvent('custom-event-two')
            private accessor mEventTwo!: ComponentEventEmitter<string>;

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
});