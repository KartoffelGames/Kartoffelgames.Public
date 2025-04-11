// Import mock at start of file.
import { TestUtil } from '../../utility/test-util.ts';

// Functional imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator.ts';

Deno.test('OneWayBinding--Functionality: Initial value', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define values.
        const lInitialValue: string = 'INITIAL__VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<input [value]="this.userValue"/>'
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
});

Deno.test('OneWayBinding--Functionality: Change component value', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define values.
        const lNewValue: string = 'NEW__VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<input [value]="this.userValue"/>'
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

Deno.test('OneWayBinding--Functionality: Exchange value to child component', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define values.
        const lValueOne: string = 'NEW__VALUE';

        // Setup. Define component.
        const lChildComponentSelector: string = TestUtil.randomSelector();
        @PwbComponent({
            selector: lChildComponentSelector
        })
        class TestChildComponent extends Processor {
            @PwbExport
            public valueOne!: string;
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lChildComponentSelector} [valueOne]="this.valueOneExternal"/>`
        })
        class TestComponent extends Processor {
            public valueOneExternal: string = lValueOne;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lChildComponent: HTMLElement & TestChildComponent = TestUtil.getComponentNode(lComponent, lChildComponentSelector);

        // Process.
        const lExportOne: string = lChildComponent.valueOne;

        // Evaluation.
        expect(lExportOne).toBe(lValueOne);
    });
});

Deno.test('OneWayBinding--Functionality: Exchange two values to the same component', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define values.
        const lValueOne: string = 'NEW__VALUE';
        const lValueTwo: string = 'NEW__VALUE';

        // Setup. Define component.
        const lChildComponentSelector: string = TestUtil.randomSelector();
        @PwbComponent({
            selector: lChildComponentSelector
        })
        class TestChildComponent extends Processor {
            @PwbExport
            public valueOne!: string;

            @PwbExport
            public valueTwo!: string;
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lChildComponentSelector} [valueOne]="this.valueOneExternal" [valueTwo]="this.valueTwoExternal"/>`
        })
        class TestComponent extends Processor {
            public valueOneExternal: string = lValueOne;
            public valueTwoExternal: string = lValueTwo;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lChildComponent: HTMLElement & TestChildComponent = TestUtil.getComponentNode(lComponent, lChildComponentSelector);

        // Process.
        const lExportOne: string = lChildComponent.valueOne;
        const lExportTwo: string = lChildComponent.valueTwo;

        // Evaluation.
        expect(lExportOne).toBe(lValueOne);
        expect(lExportTwo).toBe(lValueTwo);
    });
});