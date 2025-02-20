import { expect } from '@kartoffelgames/core-test';
import { before, describe, it } from '@std/testing/bdd';
import { ComponentRegister } from '../../../../source/core/component/component-register.ts';
import { Component } from "../../../../source/core/component/component.ts";
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator.ts';
import { PwbConfiguration } from '../../../../source/core/configuration/pwb-configuration.ts';
import { Processor } from '../../../../source/core/core_entity/processor.ts';
import { DataLevel } from '../../../../source/core/data/data-level.ts';
import '../../../utility/request-animation-frame-mock-session.ts';
import { TestUtil } from '../../../utility/test-util.ts';


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