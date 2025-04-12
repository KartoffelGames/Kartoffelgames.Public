// Import mock at start of file.
import { TestUtil } from '../../utility/test-util.ts';

// Funcitonal imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator.ts';

Deno.test('Export--Functionality: Default export get', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lResultValue).toBe(lTestValue);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('Export--Functionality: Default export set', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lResultValue).toBe(lTestValue);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('Export--Functionality: Two parallel exports get', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lResultValueOne).toBe(lTestValueOne);
        expect(lResultValueTwo).toBe(lTestValueTwo);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('Export--Functionality: Forbidden static usage', async (pContext) => {
    await pContext.step('Default', () => {
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
        expect(lErrorFunction).toThrow('Event target is not for a static property.');
    });
});

Deno.test('Export--Functionality: Linked setAttribute', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lResultValue).toBe(lTestValue);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('Export--Functionality: Get unexported value with getAttribute', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lResultValue).toBeNull();

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('Export--Functionality: Preserve original getAttribute and setAttribute', async (pContext) => {
    await pContext.step('Default', async () => {
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
        lComponent.setAttribute('htmlvalue', lTestValue);
        const lResultValue: string | null = lComponent.getAttribute('htmlvalue');

        // Evaluation.
        expect(lResultValue).toBe(lTestValue);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('Export--Functionality: Override native properties', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lResultValue).toBe(lTestValue);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('Export--Functionality: Export parent class exported properties', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lResultValue).toBe(lTestValue);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('Export--Functionality: Exported value with getAttribute', async (pContext) => {
    await pContext.step('Default', async () => {
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
        expect(lResultValue).toBe(lTestValue);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('Export--Functionality: Set attribute values on export init', async (pContext) => {
    await pContext.step('Default', async () => {
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
        const lComponent: HTMLElement & TestComponent = document.body.querySelector(lSelector)!;

        // Process. Start a async task to let the mutation observer to it thing.
        lComponent.justSomethingThatStartsUpdate = 'RED or GREEN i dont know';
        await TestUtil.waitForUpdate(lComponent);

        // Process. Read attribute value.
        const lExportedValue: string = lComponent.value;

        // Evaluation.
        expect(lExportedValue).toBe(lValue);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});