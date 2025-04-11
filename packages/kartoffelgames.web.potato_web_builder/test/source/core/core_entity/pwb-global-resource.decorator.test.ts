// Import mock at start of file.
import { MOCK_WINDOW, TestUtil } from '../../../utility/test-util.ts';

// Functional imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator.ts';
import { PwbGlobalResource } from '../../../../source/core/core_entity/interaction-tracker/pwb-global-resource.decorator.ts';
import { Processor } from '../../../../source/core/core_entity/processor.ts';
import { PwbExport } from '../../../../source/module/export/pwb-export.decorator.ts';

Deno.test('PwbGlobalResource--Functionality: Call extension constructor on component restriction', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup.
        const lTestValue: number = 112233;

        // Setup. Define global resource.
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

        // Setup. Define Second component.
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
        expect(MyGlobalResource.getNumber()).toBe(lTestValue);
        expect(lComponentOne, 'Component One').toBeComponentStructure(MOCK_WINDOW, [
            MOCK_WINDOW.Comment, // Component Anchor
            {
                node: MOCK_WINDOW.HTMLDivElement,
                textContent: lTestValue.toString()
            }
        ], true);
        expect(lComponentTwo, 'Component Two').toBeComponentStructure(MOCK_WINDOW, [
            MOCK_WINDOW.Comment, // Component Anchor
            {
                node: MOCK_WINDOW.HTMLDivElement,
                textContent: lTestValue.toString()
            }
        ], true);
    });
});