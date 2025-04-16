// Import mock at start of file.
import { TestUtil } from '../../../utility/test-util.ts';

// Functional imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { ComponentRegister } from '../../../../source/core/component/component-register.ts';
import { Component } from '../../../../source/core/component/component.ts';
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator.ts';
import { Processor } from '../../../../source/core/core_entity/processor.ts';
import { DataLevel } from '../../../../source/core/data/data-level.ts';

const gComponent: Component = (() => {
    @PwbComponent({
        selector: TestUtil.randomSelector()
    })
    class TestComponent extends Processor { }

    // Get component html constructor from class.
    const lComponentConstructor: CustomElementConstructor = ComponentRegister.ofConstructor(TestComponent).elementConstructor;

    // Get component.
    const lElement: HTMLElement = new lComponentConstructor() as any;

    // Get component reference of component.
    return ComponentRegister.ofElement(lElement).component.getProcessorAttribute<Component>(Component)!;
})();

Deno.test('DataLevel--Functionality: Get values', async (pContext) => {
    await pContext.step('From same scope', async () => {
        // Setup.
        const lScopeKey: string = 'SCOPE-KEY';
        const lScopeValue: string = 'SCOPE-VALUE';

        // Setup. Define Data Level
        const lDataLevel: DataLevel = new DataLevel(gComponent);

        // Setup. Create element and get root scope.
        lDataLevel.store[lScopeKey] = lScopeValue;

        // Process.
        const lResultValue: string = lDataLevel.store[lScopeKey];

        // Evaluation.
        expect(lResultValue).toBe(lScopeValue);
    });

    await pContext.step('From parent scope', async () => {
        // Setup.
        const lScopeKey: string = 'SCOPE-KEY';
        const lScopeValue: string = 'SCOPE-VALUE';

        // Setup. Create element and get root scope.
        const lRootValues: DataLevel = new DataLevel(gComponent);
        lRootValues.store[lScopeKey] = lScopeValue;

        // Setup. Create child scope.
        const lChildScope: DataLevel = new DataLevel(lRootValues);

        // Process.
        const lResultValue: string = lChildScope.store[lScopeKey];

        // Evaluation.
        expect(lResultValue).toBe(lScopeValue);
    });
});

Deno.test('DataLevel--Functionality: Set root values', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup.
        const lScopeKey: string = 'SCOPE-KEY';
        const lScopeValue: string = 'SCOPE-VALUE';

        // Setup. Create element.
        const lRootValues: DataLevel = new DataLevel(gComponent);

        // Setup. Create child scope.
        const lChildScope: DataLevel = new DataLevel(lRootValues);

        // Process. Set root in child one and access in two.
        lRootValues.store[lScopeKey] = lScopeValue;
        const lResultValue: string = lChildScope.store[lScopeKey];

        // Evaluation.
        expect(lResultValue).toBe(lScopeValue);
    });
});