import { expect } from 'chai';
import { ComponentRegister } from '../../../source/core/component/component-register';
import { ComponentDataLevel } from '../../../source/core/data/component-data-level';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator';
import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration';
import { Processor } from '../../../source/core/core_entity/processor';
import { DataLevel } from '../../../source/core/data/data-level';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';


describe('DataLevel', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
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
            class TestComponent extends Processor { }

            // Setup. Create element and get root scope.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: ComponentDataLevel = ComponentRegister.ofElement(lComponent).component.getProcessorAttribute<ComponentDataLevel>(ComponentDataLevel)!;
            lRootValues.data.store[lScopeKey] = lScopeValue;

            // Process.
            const lResultValue: string = lRootValues.data.store[lScopeKey];

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
            class TestComponent extends Processor { }

            // Setup. Create element and get root scope.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: ComponentDataLevel = ComponentRegister.ofElement(lComponent).component.getProcessorAttribute<ComponentDataLevel>(ComponentDataLevel)!;
            lRootValues.data.store[lScopeKey] = lScopeValue;

            // Setup. Create child scope.
            const lChildScope: DataLevel = new DataLevel(lRootValues.data);

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
        class TestComponent extends Processor { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lRootValues: ComponentDataLevel = ComponentRegister.ofElement(lComponent).component.getProcessorAttribute<ComponentDataLevel>(ComponentDataLevel)!;

        // Setup. Create child scope.
        const lChildScope: DataLevel = new DataLevel(lRootValues.data);

        // Process. Set root in child one and access in two.
        lRootValues.data.store[lScopeKey] = lScopeValue;
        const lResultValue: string = lChildScope.store[lScopeKey];

        // Evaluation.
        expect(lResultValue).to.equal(lScopeValue);
    });
});