import { Exception } from '@kartoffelgames/core';
import { expect } from 'chai';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator';
import { ComponentEvent } from '../../../source/module/component-event/component-event';
import { ComponentEventEmitter } from '../../../source/module/component-event/component-event-emitter';
import { PwbComponentEvent } from '../../../source/module/component-event/pwb-component-event.decorator';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

describe('ComponentEventEmitterExtension', () => {
    it('-- Correct event value', async () => {
        // Setup. Values.
        const lEventValue: string = 'EVENT-VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class EventComponent {
            @PwbComponentEvent('custom-event')
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
            lEventComponent.addEventListener('custom-event', (pEvent: any) => {
                pResolve(pEvent);
            });

            // Process. Call event.
            lEventComponent.callEvent();
        });

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lEventResult.value).to.equal(lEventValue);
    });

    it('-- Forbidden static usage', () => {
        // Process. Define component.
        const lErrorFunction = () => {
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class EventComponent {
                @PwbComponentEvent('custom-event')
                private static readonly mEvent: ComponentEventEmitter<string>;
            }
        };

        // Evaluation.
        expect(lErrorFunction).to.throw(Exception, 'Event target is not for an instanced property.');
    });

    it('-- Inherited and overriden event-emitter event', async () => {
        // Setup. Values.
        const lEventValue: string = 'EVENT-VALUE';

        // Process. Define parent class.
        class ParentClass {
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
        expect(lEventResult.value).to.equal(lEventValue);
    });

    it('-- Inherited event-emitter event', async () => {
        // Setup. Values.
        const lEventValue: string = 'EVENT-VALUE';

        // Process. Define parent class.
        class ParentClass {
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
        expect(lEventResult).to.be.instanceOf(ComponentEvent);
    });

    it('-- Override native events', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class EventComponent {
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
        expect(lEventResult).to.be.instanceOf(ComponentEvent);
    });

    it('-- Nativ and custom event parallel', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class EventComponent {
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
        class EventComponent {
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
        expect(lCustomOneValue).to.equal(lEventValueOne);
        expect(lCustomTwoValue).to.equal(lEventValueTwo);
    });

    it('-- Wrong emmiter type', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class EventComponent {
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
        expect(lErrorMessage).to.equal('Event emitter property must be of type ComponentEventEmitter');
    });
});