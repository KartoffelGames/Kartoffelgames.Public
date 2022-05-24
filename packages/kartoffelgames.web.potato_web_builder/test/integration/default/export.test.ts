import { Exception } from '@kartoffelgames/core.data';
import { expect } from 'chai';
import { PwbComponent } from '../../../source/component/decorator/pwb-component.decorator';
import { TestUtil } from '../../utility/test-util';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { PwbExport } from '../../../source/default/export/pwb-export.decorator';

describe('Export', () => {
    it('-- Default export get', async () => {
        // Setup.
        const lTestValue: string = 'TEST-VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbExport
            public value: string = lTestValue;
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lResultValue: string = lComponent.value;

        // Evaluation.
        expect(lResultValue).to.equal(lTestValue);
    });

    it('-- Default export set', async () => {
        // Setup.
        const lTestValue: string = 'TEST-VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbExport
            public value: string = '';
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.value = lTestValue;
        const lResultValue: string = lComponent.value;

        // Evaluation.
        expect(lResultValue).to.equal(lTestValue);
    });

    it('-- Two parallel exports get', async () => {
        // Setup.
        const lTestValueOne: string = 'TEST-VALUE-ONE';
        const lTestValueTwo: string = 'TEST-VALUE-TWO';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbExport
            public valueOne: string = lTestValueOne;
            @PwbExport
            public valueTwo: string = lTestValueTwo;
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lResultValueOne: string = lComponent.valueOne;
        const lResultValueTwo: string = lComponent.valueTwo;

        // Evaluation.
        expect(lResultValueOne).to.equal(lTestValueOne);
        expect(lResultValueTwo).to.equal(lTestValueTwo);
    });

    it('-- Forbidden static usage', () => {
        // Process.
        const lErrorFunction = () => {
            // Setup. Define component.
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestComponent {
                @PwbExport
                public static value: string = '';
            }
        };

        // Evaluation.
        expect(lErrorFunction).to.throw(Exception, 'Event target is not for a static property.');
    });

    it('-- Linked setAttribute', async () => {
        // Setup.
        const lTestValue: string = 'TEST-VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbExport
            public value: string = '';
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.setAttribute('value', lTestValue);
        const lResultValue: string = lComponent.value;

        // Evaluation.
        expect(lResultValue).to.equal(lTestValue);
    });

    it('-- Linked getAttribute', async () => {
        // Setup.
        const lTestValue: string = 'TEST-VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbExport
            public value: string = '';
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.value = lTestValue;
        const lResultValue: string | null = lComponent.getAttribute('value');

        // Evaluation.
        expect(lResultValue).to.equal(lTestValue);
    });

    it('-- Preserve original getAttribute and setAttribute', async () => {
        // Setup.
        const lTestValue: string = 'TEST-VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.setAttribute('value', lTestValue);
        const lResultValue: string | null = lComponent.getAttribute('value');

        // Evaluation.
        expect(lResultValue).to.equal(lTestValue);
    });

    it('-- Override native properties', async () => {
        // Setup.
        const lTestValue: string = 'TEST-VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbExport
            public children: string = lTestValue;
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lResultValue: string = lComponent.children;

        // Evaluation.
        expect(lResultValue).to.equal(lTestValue);
    });

    it('-- Export parent class exported properties', async () => {
        // Setup.
        const lTestValue: string = 'TEST-VALUE';

        // Setup. Define parent class.
        class ParentClass {
            @PwbExport
            public children: string = lTestValue;
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent extends ParentClass {}

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lResultValue: string = lComponent.children;

        // Evaluation.
        expect(lResultValue).to.equal(lTestValue);
    });
});