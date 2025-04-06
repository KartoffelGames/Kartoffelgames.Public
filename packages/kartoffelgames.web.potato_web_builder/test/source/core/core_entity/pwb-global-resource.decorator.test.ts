import { expect } from '@kartoffelgames/core-test';
import { before, describe, it } from '@std/testing/bdd';
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator.ts';
import { PwbConfiguration } from '../../../../source/core/configuration/pwb-configuration.ts';
import { PwbGlobalResource } from '../../../../source/core/core_entity/interaction-tracker/pwb-global-resource.decorator.ts';
import { Processor } from '../../../../source/core/core_entity/processor.ts';
import { PwbExport } from '../../../../source/module/export/pwb-export.decorator.ts';
import { TestUtil } from '../../../utility/test-util.ts';

// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';

// Setup global scope.
(() => {
    const lMockDom: JSDOM = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');

    PwbConfiguration.configuration.scope.window = lMockDom.window as unknown as typeof globalThis;
    PwbConfiguration.configuration.scope.document = lMockDom.window.document;
})();

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
        expect(MyGlobalResource.getNumber()).toBe(lTestValue);
        expect(lComponentOne, 'Component One').toBeComponentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                textContent: lTestValue.toString()
            }
        ], true);
        expect(lComponentTwo, 'Component Two').toBeComponentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                textContent: lTestValue.toString()
            }
        ], true);
    });

});