import { expect } from 'chai';
import { PwbComponent } from '../../../source/decorator/pwb-component.decorator';
import { PwbTemplateXmlNode } from '../../../source/component/template/nodes/pwb-template-xml-node';
import { LayerValues } from '../../../source/component/values/layer-values';
import { PwbInstructionModule } from '../../../source/decorator/pwb-instruction-module.decorator';
import { PwbAttributeModule } from '../../../source/decorator/pwb-attribute-module.decorator';
import { AccessMode } from '../../../source/enum/access-mode.enum';
import { IPwbInstructionModuleOnUpdate } from '../../../source/interface/module.interface';
import { InstructionResult } from '../../../source/module/result/instruction-result';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';
import { PwbTemplate } from '../../../source/component/template/nodes/pwb-template';
import { ComponentElement } from '../../../source/interface/component.interface';
import { ComponentLayerValuesReference } from '../../../source/injection/references/component/component-layer-values-reference';
import { UpdateTrigger } from '../../../source/enum/update-trigger.enum';

describe('Custom Module', () => {
    it('-- Same result, twice', async () => {
        // Setup. Define module.
        @PwbInstructionModule({
            instructionType: 'multiresult',
            trigger: UpdateTrigger.Default
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class WrongModule implements IPwbInstructionModuleOnUpdate {
            private readonly mValueHandler: LayerValues;

            public constructor(pValueReference: ComponentLayerValuesReference) {
                this.mValueHandler = pValueReference;
            }

            public onUpdate(): InstructionResult {
                // If in any way the execution result is true, add template to result.
                const lModuleResult: InstructionResult = new InstructionResult();

                const lTemplateOne: PwbTemplate = new PwbTemplate();
                lTemplateOne.appendChild(new PwbTemplateXmlNode());

                const lTemplateTwo: PwbTemplate = new PwbTemplate();
                lTemplateTwo.appendChild(new PwbTemplateXmlNode());

                lModuleResult.addElement(lTemplateOne, this.mValueHandler);
                lModuleResult.addElement(lTemplateTwo, this.mValueHandler);

                return lModuleResult;
            }
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$multiresult`
        })
        class TestComponent { }

        // Process. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(TestComponent);
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
            instructionType: 'noupdatemethod',
            trigger: UpdateTrigger.Default
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class WrongModule { }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$noupdatemethod`
        })
        class TestComponent { }

        // Process. Create element.
        await <any>TestUtil.createComponent(TestComponent);

        // Should be allowed. No errors.
    });

    it('-- Deconstruct module without deconstructor method', async () => {
        // Setup. Define module.
        @PwbAttributeModule({
            access: AccessMode.Read,
            selector: /^nodeconstructmethod$/,
            trigger: UpdateTrigger.Default
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
        const lComponent: ComponentElement = await TestUtil.createComponent(TestComponent);
        TestUtil.deconstructComponent(lComponent);
    });
});