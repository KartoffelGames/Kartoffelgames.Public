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
    it('-- Underlying component values', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: ComponentElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Read original and layer values component.
        const lComponentManager: Component = lComponent.__component__;
        const lRootValuesComponentManager: Component = lComponentManager.getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!.component;

        // Evaluation.
        expect(lRootValuesComponentManager).to.equal(lComponentManager);
    });

    it('-- Get child root value', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Setup. Create element.
        const lComponent: ComponentElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lRootValues: LayerValues = lComponent.__component__.getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!.rootValue;

        // Process. Create child layer.
        const lChildLayer: LayerValues = new LayerValues(lRootValues);
        const lRootLayerResult: LayerValues = lChildLayer.rootValue;

        // Evaluation.
        expect(lRootLayerResult).to.equal(lRootValues);
    });

    describe('-- Equal', () => {
        it('-- Everything equal', async () => {
            // Setup. Define component.
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponent { }

            // Setup. Create element.
            const lComponent: ComponentElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: LayerValues = lComponent.__component__.getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!.rootValue;

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
            const lRootValuesOne: LayerValues = lComponentOne.__component__.getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!.rootValue;
            const lComponentTwo: ComponentElement = await <any>TestUtil.createComponent(TestComponentTwo);
            const lRootValuesTwo: LayerValues = lComponentTwo.__component__.getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!.rootValue;

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
            const lRootValues: LayerValues = lComponent.__component__.getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!.rootValue;

            // Setup. Create child layer.
            const lChildLayerOne: LayerValues = new LayerValues(lRootValues);
            const lChildLayerTwo: LayerValues = new LayerValues(lRootValues);
            lChildLayerTwo.setLayerValue('Temporary-Key', 'Temporary-Value');

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
            const lRootValues: LayerValues = lComponent.__component__.getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!.rootValue;

            // Setup. Create child layer.
            const lChildLayerOne: LayerValues = new LayerValues(lRootValues);
            lChildLayerOne.setLayerValue('Temporary-Key', 'Temporary-Value-One');
            const lChildLayerTwo: LayerValues = new LayerValues(lRootValues);
            lChildLayerTwo.setLayerValue('Temporary-Key', 'Temporary-Value-Two');

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
            const lRootValues: LayerValues = lComponent.__component__.getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!.rootValue;
            lRootValues.setLayerValue(lLayerKey, lLayerValue);

            // Process.
            const lResultValue: string = lRootValues.getValue(lLayerKey);

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
            const lRootValues: LayerValues = lComponent.__component__.getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!.rootValue;
            lRootValues.setLayerValue(lLayerKey, lLayerValue);

            // Setup. Create child layer.
            const lChildLayer: LayerValues = new LayerValues(lRootValues);

            // Process.
            const lResultValue: string = lChildLayer.getValue(lLayerKey);

            // Evaluation.
            expect(lResultValue).to.equal(lLayerValue);
        });
    });

    it('-- Remove value', async () => {
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
        const lRootValues: LayerValues = lComponent.__component__.getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!.rootValue;
        lRootValues.setLayerValue(lLayerKey, lLayerValue);

        // Process.
        lRootValues.removeLayerValue(lLayerKey);
        const lResultValue: string = lRootValues.getValue(lLayerKey);

        // Evaluation.
        expect(lResultValue).to.be.undefined;
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
        const lRootValues: LayerValues = lComponent.__component__.getProcessorAttribute<LayerValues>(ComponentLayerValuesReference)!.rootValue;

        // Setup. Create child layer.
        const lChildLayerOne: LayerValues = new LayerValues(lRootValues);
        const lChildLayerTwo: LayerValues = new LayerValues(lRootValues);

        // Process. Set root in child one and access in two.
        lChildLayerOne.setRootValue(lLayerKey, lLayerValue);
        const lResultValue: string = lChildLayerTwo.getValue(lLayerKey);

        // Evaluation.
        expect(lResultValue).to.equal(lLayerValue);
    });
});