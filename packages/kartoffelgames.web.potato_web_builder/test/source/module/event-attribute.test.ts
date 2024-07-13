import { expect } from 'chai';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator';
import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration';
import { Processor } from '../../../source/core/core_entity/processor';
import '../../utility/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

describe('EventAttribute', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- Basic click event', async () => {
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
        expect(lEventValueResult).to.equal('click');
    });

    it('-- Clear listener events on deconstruct', async () => {
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
        expect(lClicked).to.be.false;
    });
});