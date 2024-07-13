import { Exception } from '@kartoffelgames/core';
import { expect } from 'chai';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator';
import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration';
import { Processor } from '../../../source/core/core_entity/processor';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator';
import '../../utility/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';
import { ExportExtension } from '../../../source/module/export/export-extension';

describe('Export', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- Default export get', async () => {
        // Setup.
        const lTestValue: string = 'TEST-VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent extends Processor {
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
        class TestComponent extends Processor {
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
        class TestComponent extends Processor {
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
            class TestComponent extends Processor {
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
        class TestComponent extends Processor {
            @PwbExport
            public value: string = '';
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.setAttribute('value', lTestValue);
        await TestUtil.waitForUpdate(lComponent);

        const lResultValue: string = lComponent.value;

        // Evaluation.
        expect(lResultValue).to.equal(lTestValue);
    });

    it('-- Get unexported value with getAttribute', async () => {
         // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent extends Processor {
            public value: string = 'TEST-VALUE';
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lResultValue: string | null = lComponent.getAttribute('value');

        // Evaluation.
        expect(lResultValue).to.be.null;
    });

    it('-- Preserve original getAttribute and setAttribute', async () => {
        // Setup.
        const lTestValue: string = 'TEST-VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent extends Processor { 
            @PwbExport
            public value: string = ''
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.setAttribute('htmlvalue', lTestValue);
        const lResultValue: string | null = lComponent.getAttribute('htmlvalue');

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
        class TestComponent extends Processor {
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
        class ParentClass extends Processor {
            @PwbExport
            public children: string = lTestValue;
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent extends ParentClass { }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lResultValue: string = lComponent.children;

        // Evaluation.
        expect(lResultValue).to.equal(lTestValue);
    });

    it('-- Exported value with getAttribute', async () => {
        // Setup.
        const lTestValue: string = 'TEST-VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent extends Processor {
            @PwbExport
            public value: string = lTestValue;
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lResultValue: string = lComponent.getAttribute('value')!;

        // Evaluation.
        expect(lResultValue).to.equal(lTestValue);
    });

    it('-- Set attribute values on export init', async () => {
        // Setup. Defined values.
        const lSelector: string = TestUtil.randomSelector();
        const lValue: string = 'UniqueValue:)';

        // Setup. Define parent class.
        @PwbComponent({
            selector: lSelector
        })
        class TestComponent extends Processor {
            @PwbExport
            public justSomethingThatStartsUpdate: string = '';

            @PwbExport
            public value!: string;
        }

        // Process. Set component with value in DOM and try to read it.
        document.body.innerHTML = `<${lSelector} value="${lValue}" />`;
        const lComponent: HTMLElement & TestComponent = <any>document.body.querySelector(lSelector);

        // Process. Start a async task to let the mutation observer to it thing.
        lComponent.justSomethingThatStartsUpdate = 'RED or GREEN i dont know';
        await TestUtil.waitForUpdate(lComponent);

        // Process. Read attribute value.
        const lExportedValue: string = lComponent.value;

        // Evaluation.
        expect(lExportedValue).to.equal(lValue);
    });
});