import { expect } from 'chai';
import { PwbExport } from '../../../../source';
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator';
import { PwbConfiguration } from '../../../../source/core/configuration/pwb-configuration';
import { PwbGlobalResource } from '../../../../source/core/core_entity/interaction-tracker/pwb-global-resource.decorator';
import { Processor } from '../../../../source/core/core_entity/processor';
import { TestUtil } from '../../../utility/test-util';

describe('ExtensionModule', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- Call extension constructor on component restriction', async () => {
        // Setup.
        const lTestValue: number = 112233;

        // Setup. Define gloabl resource.
        @PwbGlobalResource()
        class MyGlobalResource {
            private static mMyNumber: number = 11;

            public static getNumber(): number {
                return MyGlobalResource.mMyNumber;
            }

            public static setNumber(pValue: number): void {
                MyGlobalResource.mMyNumber = pValue;
            }
        }

        // Setup. Define First component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div>{{MyGlobalResource.getNumber()}}</div>`
        })
        class TestComponentOne extends Processor {
        }

        // Setup. Define First component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div>{{MyGlobalResource.getNumber()}}</div>`
        })
        class TestComponentTwo extends Processor {
            @PwbExport
            public setNumber() {
                MyGlobalResource.setNumber(lTestValue);
            }
        }

        // Process. Create element.
        const lComponentOne: HTMLElement & TestComponentOne = await <any>TestUtil.createComponent(TestComponentOne);
        const lComponentTwo: HTMLElement & TestComponentTwo = await <any>TestUtil.createComponent(TestComponentTwo);

        // Process. Change value.
        lComponentTwo.setNumber();

        // Wait for both updates.
        await TestUtil.waitForUpdate(lComponentOne);
        await TestUtil.waitForUpdate(lComponentTwo);

        // Evaluation.
        expect(MyGlobalResource.getNumber()).to.equal(lTestValue);
        expect(lComponentOne, 'Component One').to.have.componentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                textContent: lTestValue.toString()
            }
        ], true);
        expect(lComponentTwo, 'Component Two').to.have.componentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                textContent: lTestValue.toString()
            }
        ], true);
    });

});