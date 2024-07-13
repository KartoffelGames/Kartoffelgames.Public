import { expect } from 'chai';
import { Component } from '../../../../source';
import { ComponentRegister } from '../../../../source/core/component/component-register';
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator';
import { PwbConfiguration } from '../../../../source/core/configuration/pwb-configuration';
import { Processor } from '../../../../source/core/core_entity/processor';
import { DataLevel } from '../../../../source/core/data/data-level';
import '../../../utility/chai-helper';
import '../../../utility/request-animation-frame-mock-session';
import { TestUtil } from '../../../utility/test-util';


describe('DataLevel', () => {
    let lComponent: Component;

    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;

        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent extends Processor { }

        // Get component html constructor from class.
        const lComponentConstructor: CustomElementConstructor = ComponentRegister.ofConstructor(TestComponent).elementConstructor;

        // Get component.
        const lElement: HTMLElement = new lComponentConstructor() as any;

        // Get component reference of component.
        lComponent = ComponentRegister.ofElement(lElement).component.getProcessorAttribute<Component>(Component)!;
    });

    describe('-- Get values', () => {
        it('-- From same scope', async () => {
            // Setup.
            const lScopeKey: string = 'SCOPE-KEY';
            const lScopeValue: string = 'SCOPE-VALUE';

            // Setup. Define Data Level
            const lDataLevel: DataLevel = new DataLevel(lComponent);

            // Setup. Create element and get root scope.
            lDataLevel.store[lScopeKey] = lScopeValue;

            // Process.
            const lResultValue: string = lDataLevel.store[lScopeKey];

            // Evaluation.
            expect(lResultValue).to.equal(lScopeValue);
        });

        it('-- From parent scope', async () => {
            // Setup.
            const lScopeKey: string = 'SCOPE-KEY';
            const lScopeValue: string = 'SCOPE-VALUE';

            // Setup. Create element and get root scope.
            const lRootValues: DataLevel = new DataLevel(lComponent);
            lRootValues.store[lScopeKey] = lScopeValue;

            // Setup. Create child scope.
            const lChildScope: DataLevel = new DataLevel(lRootValues);

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

        // Setup. Create element.
        const lRootValues: DataLevel = new DataLevel(lComponent);

        // Setup. Create child scope.
        const lChildScope: DataLevel = new DataLevel(lRootValues);

        // Process. Set root in child one and access in two.
        lRootValues.store[lScopeKey] = lScopeValue;
        const lResultValue: string = lChildScope.store[lScopeKey];

        // Evaluation.
        expect(lResultValue).to.equal(lScopeValue);
    });
});