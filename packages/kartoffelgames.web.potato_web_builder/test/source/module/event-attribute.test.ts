// Import mock at start of file.
import { TestUtil } from '../../utility/test-util.ts';

// Funcitonal imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';

Deno.test('EventAttribute--Functionality: Basic click event', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        const lEventComponentSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lEventComponentSelector,
        })
        class EventComponent extends Processor { }

        // Process. Define component and wait for update.
        let lEventValueResult: string | null = null;
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lEventComponentSelector} (click)="this.handler($event)"/>`
        })
        class TestComponent extends Processor {
            public handler(pEvent: MouseEvent): void {
                lEventValueResult = pEvent.type;
            }
        }

        // Setup. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lEventChild: HTMLDivElement & EventComponent = TestUtil.getComponentNode(lComponent, lEventComponentSelector);
        lEventChild.click();

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lEventValueResult).toBe('click');

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('EventAttribute--Functionality: Clear listener events on deconstruct', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        let lClicked: boolean = false;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div (click)="this.handler($event)"/>`
        })
        class TestComponent extends Processor {
            public handler(_pEvent: MouseEvent): void {
                lClicked = true;
            }
        }

        // Setup. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lClickableChild: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');
        TestUtil.deconstructComponent(lComponent);
        lClickableChild.click();

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lClicked).toBeFalsy();

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});