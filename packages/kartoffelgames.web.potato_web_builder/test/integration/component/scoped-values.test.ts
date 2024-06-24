import { expect } from 'chai';
import { ComponentRegister } from '../../../source/core/component/component-register';
import { ComponentScopedValues } from '../../../source/core/component/injection_reference/component-scoped-values';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator';
import { ScopedValues } from '../../../source/core/scoped-values';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';


describe('ScopedValues', () => {
    describe('-- Equal', () => {
        it('-- Everything equal', async () => {
            // Setup. Define component.
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponent { }

            // Setup. Create element.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: ScopedValues = ComponentRegister.ofElement(lComponent).component.getProcessorAttribute<ScopedValues>(ComponentScopedValues)!;

            // Process. Create child scope.
            const lIsEqual: boolean = lRootValues.equals(lRootValues);

            // Evaluation.
            expect(lIsEqual).to.be.true;
        });

        it('-- Different user object', async () => {
            // Setup. Define component one.
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponentOne { }

            // Setup. Define component two.
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponentTwo { }

            // Setup. Create element.
            const lComponentOne: HTMLElement = await <any>TestUtil.createComponent(TestComponentOne);
            const lRootValuesOne: ScopedValues = ComponentRegister.ofElement(lComponentOne).component.getProcessorAttribute<ScopedValues>(ComponentScopedValues)!;
            const lComponentTwo: HTMLElement = await <any>TestUtil.createComponent(TestComponentTwo);
            const lRootValuesTwo: ScopedValues = ComponentRegister.ofElement(lComponentTwo).component.getProcessorAttribute<ScopedValues>(ComponentScopedValues)!;

            // Process.
            const lIsEqual: boolean = lRootValuesOne.equals(lRootValuesTwo);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Different temporary data', async () => {
            // Setup. Define component.
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponent { }

            // Setup. Create element.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: ScopedValues = ComponentRegister.ofElement(lComponent).component.getProcessorAttribute<ScopedValues>(ComponentScopedValues)!;

            // Setup. Create child scope.
            const lChildScopeOne: ScopedValues = new ScopedValues(lRootValues);
            const lChildScopeTwo: ScopedValues = new ScopedValues(lRootValues);
            lChildScopeTwo.store['Temporary-Key'] = 'Temporary-Value';

            // Process.
            const lIsEqual: boolean = lChildScopeOne.equals(lChildScopeTwo);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Same keys, different temporary data value', async () => {
            // Setup. Define component.
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponent { }

            // Setup. Create element.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: ScopedValues = ComponentRegister.ofElement(lComponent).component.getProcessorAttribute<ScopedValues>(ComponentScopedValues)!;

            // Setup. Create child scope.
            const lChildScopeOne: ScopedValues = new ScopedValues(lRootValues);
            lChildScopeOne.store['Temporary-Key'] = 'Temporary-Value-One';
            const lChildScopeTwo: ScopedValues = new ScopedValues(lRootValues);
            lChildScopeTwo.store['Temporary-Key'] = 'Temporary-Value-Two';

            // Process.
            const lIsEqual: boolean = lChildScopeOne.equals(lChildScopeTwo);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });
    });

    describe('-- Get values', () => {
        it('-- From same scope', async () => {
            // Setup.
            const lScopeKey: string = 'SCOPE-KEY';
            const lScopeValue: string = 'SCOPE-VALUE';

            // Setup. Define component.
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponent { }

            // Setup. Create element and get root scope.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: ScopedValues = ComponentRegister.ofElement(lComponent).component.getProcessorAttribute<ScopedValues>(ComponentScopedValues)!;
            lRootValues.store[lScopeKey] = lScopeValue;

            // Process.
            const lResultValue: string = lRootValues.store[lScopeKey];

            // Evaluation.
            expect(lResultValue).to.equal(lScopeValue);
        });

        it('-- From parent scope', async () => {
            // Setup.
            const lScopeKey: string = 'SCOPE-KEY';
            const lScopeValue: string = 'SCOPE-VALUE';

            // Setup. Define component.
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponent { }

            // Setup. Create element and get root scope.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: ScopedValues = ComponentRegister.ofElement(lComponent).component.getProcessorAttribute<ScopedValues>(ComponentScopedValues)!;
            lRootValues.store[lScopeKey] = lScopeValue;

            // Setup. Create child scope.
            const lChildScope: ScopedValues = new ScopedValues(lRootValues);

            // Process.
            const lResultValue: string = lChildScope.store[lScopeKey];

            // Evaluation.
            expect(lResultValue).to.equal(lScopeValue);
        });
    });

    it('-- Set root values', async () => {
        // Setup.
        const lScopeKey: string = 'SCOPE-KEY';
        const lScopeValue: string = 'SCOPE-VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lRootValues: ScopedValues = ComponentRegister.ofElement(lComponent).component.getProcessorAttribute<ScopedValues>(ComponentScopedValues)!;

        // Setup. Create child scope.
        const lChildScope: ScopedValues = new ScopedValues(lRootValues);

        // Process. Set root in child one and access in two.
        lRootValues.store[lScopeKey] = lScopeValue;
        const lResultValue: string = lChildScope.store[lScopeKey];

        // Evaluation.
        expect(lResultValue).to.equal(lScopeValue);
    });
});