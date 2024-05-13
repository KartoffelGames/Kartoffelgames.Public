import { expect } from 'chai';
import { ComponentLayerValuesReference } from '../../../../source';
import { Component } from '../../../../source/component/component';
import { LayerValues } from '../../../../source/component/values/layer-values';
import { PwbComponent } from '../../../../source/decorator/pwb-component.decorator';
import { ComponentElement } from '../../../../source/interface/component.interface';
import '../../../mock/request-animation-frame-mock-session';
import '../../../utility/chai-helper';
import { TestUtil } from '../../../utility/test-util';

describe('LayerValues', () => {
    describe('-- Equal', () => {
        it('-- Everything equal', async () => {
            // Setup. Define component.
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponent { }

            // Setup. Create element.
            const lComponent: ComponentElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: LayerValues = Component.componentOf(lComponent).getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!;

            // Process. Create child layer.
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
            const lComponentOne: ComponentElement = await <any>TestUtil.createComponent(TestComponentOne);
            const lRootValuesOne: LayerValues = Component.componentOf(lComponentOne).getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!;
            const lComponentTwo: ComponentElement = await <any>TestUtil.createComponent(TestComponentTwo);
            const lRootValuesTwo: LayerValues = Component.componentOf(lComponentTwo).getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!;

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
            const lComponent: ComponentElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: LayerValues = Component.componentOf(lComponent).getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!;

            // Setup. Create child layer.
            const lChildLayerOne: LayerValues = new LayerValues(lRootValues);
            const lChildLayerTwo: LayerValues = new LayerValues(lRootValues);
            lChildLayerTwo.data['Temporary-Key'] = 'Temporary-Value';

            // Process.
            const lIsEqual: boolean = lChildLayerOne.equals(lChildLayerTwo);

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
            const lComponent: ComponentElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: LayerValues = Component.componentOf(lComponent).getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!;

            // Setup. Create child layer.
            const lChildLayerOne: LayerValues = new LayerValues(lRootValues);
            lChildLayerOne.data['Temporary-Key'] = 'Temporary-Value-One';
            const lChildLayerTwo: LayerValues = new LayerValues(lRootValues);
            lChildLayerTwo.data['Temporary-Key'] = 'Temporary-Value-Two';

            // Process.
            const lIsEqual: boolean = lChildLayerOne.equals(lChildLayerTwo);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });
    });

    describe('-- Get values', () => {
        it('-- From same layer', async () => {
            // Setup.
            const lLayerKey: string = 'LAYER-KEY';
            const lLayerValue: string = 'LAYER-VALUE';

            // Setup. Define component.
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponent { }

            // Setup. Create element and get root layer.
            const lComponent: ComponentElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: LayerValues = Component.componentOf(lComponent).getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!;
            lRootValues.data[lLayerKey] = lLayerValue;

            // Process.
            const lResultValue: string = lRootValues.data[lLayerKey];

            // Evaluation.
            expect(lResultValue).to.equal(lLayerValue);
        });

        it('-- From parent layer', async () => {
            // Setup.
            const lLayerKey: string = 'LAYER-KEY';
            const lLayerValue: string = 'LAYER-VALUE';

            // Setup. Define component.
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponent { }

            // Setup. Create element and get root layer.
            const lComponent: ComponentElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: LayerValues = Component.componentOf(lComponent).getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!;
            lRootValues.data[lLayerKey] = lLayerValue;

            // Setup. Create child layer.
            const lChildLayer: LayerValues = new LayerValues(lRootValues);

            // Process.
            const lResultValue: string = lChildLayer.data[lLayerKey];

            // Evaluation.
            expect(lResultValue).to.equal(lLayerValue);
        });
    });

    it('-- Set root values', async () => {
        // Setup.
        const lLayerKey: string = 'LAYER-KEY';
        const lLayerValue: string = 'LAYER-VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Setup. Create element.
        const lComponent: ComponentElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lRootValues: LayerValues = Component.componentOf(lComponent).getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!;

        // Setup. Create child layer.
        const lChildLayer: LayerValues = new LayerValues(lRootValues);

        // Process. Set root in child one and access in two.
        lRootValues.data[lLayerKey] = lLayerValue;
        const lResultValue: string = lChildLayer.data[lLayerKey];

        // Evaluation.
        expect(lResultValue).to.equal(lLayerValue);
    });
});