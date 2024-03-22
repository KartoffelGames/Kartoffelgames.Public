import { expect } from 'chai';
import { PwbComponent } from '../../../source/decorator/pwb-component.decorator';
import { PwbTemplateXmlNode } from '../../../source/component/template/nodes/pwb-template-xml-node';
import { LayerValues } from '../../../source/component/values/layer-values';
import { ComponentLayerValuesReference } from '../../../source/injection_reference/general/component-layer-values-reference';
import { PwbInstructionModule } from '../../../source/decorator/pwb-instruction-module.decorator';
import { PwbAttributeModule } from '../../../source/decorator/pwb-attribute-module.decorator';
import { AccessMode } from '../../../source/enum/module-access-mode.enum';
import { IPwbInstructionModuleOnUpdate } from '../../../source/interface/module.interface';
import { InstructionResult } from '../../../source/module/result/instruction-result';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

describe('Custom Module', () => {
    it('-- Same result, twice', async () => {
        // Setup. Define module.
        @PwbInstructionModule({
            selector: /^\*multiresult$/
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class WrongModule implements IPwbInstructionModuleOnUpdate {
            private readonly mValueHandler: LayerValues;

            public constructor(pValueReference: ComponentLayerValuesReference) {
                this.mValueHandler = pValueReference.value;
            }

            public onUpdate(): InstructionResult {
                // If in any way the execution result is true, add template to result.
                const lModuleResult: InstructionResult = new InstructionResult();
                lModuleResult.addElement(new PwbTemplateXmlNode(), this.mValueHandler);
                lModuleResult.addElement(new PwbTemplateXmlNode(), this.mValueHandler);

                return lModuleResult;
            }
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *multiresult/>`
        })
        class TestComponent { }

        // Process. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(TestComponent, true);
        } catch (pError) {
            const lError: Error = <Error>pError;
            lErrorMessage = lError.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal(`Can't add same template or value handler for multiple Elements.`);
    });

    it('-- Manupulator without update method', async () => {
        // Setup. Define module.
        @PwbInstructionModule({
            selector: /^\*noupdatemethod$/
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class WrongModule { }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *noupdatemethod/>`
        })
        class TestComponent { }

        // Process. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(TestComponent, true);
        } catch (pError) {
            const lError: Error = <Error>pError;
            lErrorMessage = lError.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal(`Multiplicator modules need to implement IPwbMultiplicatorModuleOnUpdate`);
    });

    it('-- Deconstruct module without deconstructor method', async () => {
        // Setup. Define module.
        @PwbAttributeModule({
            selector: /^nodeconstructmethod$/,
            forbiddenInManipulatorScopes: false,
            access: AccessMode.Read
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class Module { }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div nodeconstructmethod/>`
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.deconstructComponent(lComponent);
    });
});