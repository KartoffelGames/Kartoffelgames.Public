import { expect } from '@kartoffelgames/core-test';
import { before, describe, it } from '@std/testing/bdd';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator.ts';
import '../../utility/request-animation-frame-mock-session.ts';
import { TestUtil } from '../../utility/test-util.ts';

// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';

// Setup global scope.
(() => {
    const lMockDom: JSDOM = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');

    PwbConfiguration.configuration.scope.window = lMockDom.window as unknown as typeof globalThis;
    PwbConfiguration.configuration.scope.document = lMockDom.window.document;
})();

describe('TwoWayBinding', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- Initial value', async () => {
        // Setup. Define values.
        const lInitialValue: string = 'INITIAL__VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<input [(value)]="this.userValue"/>'
        })
        class TestComponent extends Processor {
            @PwbExport
            public userValue: string = lInitialValue;
        }

        // Setup. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Process. Get input value.
        const lInputValue: string = TestUtil.getComponentNode<HTMLInputElement>(lComponent, 'input').value;

        // Evaluation.
        expect(lInputValue).toBe(lInitialValue);
    });

    it('-- Change view value', async () => {
        // Setup. Define values.
        const lNewValue: string = 'NEW__VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<input [(value)]="this.userValue"/>'
        })
        class TestComponent extends Processor {
            @PwbExport
            public userValue: string = 'INITIAL__VALUE';
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Process. Get input value.
        TestUtil.getComponentNode<HTMLInputElement>(lComponent, 'input').value = lNewValue;
        TestUtil.manualUpdate(lComponent); // Manual element value set does not trigger interaction zone.  
        await TestUtil.waitForUpdate(lComponent);
        const lComponentValue: string = lComponent.userValue;

        // Evaluation.
        expect(lComponentValue).toBe(lNewValue);
    });

    it('-- Change component value', async () => {
        // Setup. Define values.
        const lNewValue: string = 'NEW__VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<input [(value)]="this.userValue"/>'
        })
        class TestComponent extends Processor {
            @PwbExport
            public userValue: string = 'INITIAL__VALUE';
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Process. Get input value.
        lComponent.userValue = lNewValue;
        await TestUtil.waitForUpdate(lComponent);
        const lViewValue: string = TestUtil.getComponentNode<HTMLInputElement>(lComponent, 'input').value;

        // Evaluation.
        expect(lViewValue).toBe(lNewValue);
    });
});