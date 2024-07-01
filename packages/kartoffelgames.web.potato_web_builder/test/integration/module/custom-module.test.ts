import { expect } from 'chai';
import { ComponentScopedValues } from '../../../source/core/component/injection_reference/component-scoped-values';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator';
import { PwbTemplate } from '../../../source/core/component/template/nodes/pwb-template';
import { PwbTemplateXmlNode } from '../../../source/core/component/template/nodes/pwb-template-xml-node';
import { Processor } from '../../../source/core/core_entity/processor';
import { AccessMode } from '../../../source/core/enum/access-mode.enum';
import { UpdateTrigger } from '../../../source/core/enum/update-trigger.enum';
import { PwbAttributeModule } from '../../../source/core/module/attribute_module/pwb-attribute-module.decorator';
import { IInstructionOnUpdate } from '../../../source/core/module/instruction_module/instruction-module';
import { InstructionResult } from '../../../source/core/module/instruction_module/instruction-result';
import { PwbInstructionModule } from '../../../source/core/module/instruction_module/pwb-instruction-module.decorator';
import { ScopedValues } from '../../../source/core/scoped-values';
import { PwbDebug } from '../../../source/core/configuration/pwb-debug';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

describe('Custom Module', () => {
    before(() => {
        const lConfiguration: PwbDebug = new PwbDebug();
        lConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
    });

    it('-- Same result, twice', async () => {
        // Setup. Define module.
        @PwbInstructionModule({
            instructionType: 'multiresult',
            trigger: UpdateTrigger.Any
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class WrongModule extends Processor implements IInstructionOnUpdate {
            private readonly mScopedValues: ScopedValues;

            public constructor(pValueReference: ComponentScopedValues) {
                super();

                this.mScopedValues = pValueReference;
            }

            public onUpdate(): InstructionResult {
                // If in any way the execution result is true, add template to result.
                const lModuleResult: InstructionResult = new InstructionResult();

                const lTemplateOne: PwbTemplate = new PwbTemplate();
                lTemplateOne.appendChild(new PwbTemplateXmlNode());

                const lTemplateTwo: PwbTemplate = new PwbTemplate();
                lTemplateTwo.appendChild(new PwbTemplateXmlNode());

                lModuleResult.addElement(lTemplateOne, this.mScopedValues);
                lModuleResult.addElement(lTemplateTwo, this.mScopedValues);

                return lModuleResult;
            }
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$multiresult`
        })
        class TestComponent extends Processor { }

        // Process. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (pError) {
            const lError: Error = <Error>pError;
            lErrorMessage = lError.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal(`Can't add same template or values for multiple Elements.`);
    });

    it('-- Manupulator without update method', async () => {
        // Setup. Define module.
        @PwbInstructionModule({
            instructionType: 'noupdatemethod',
            trigger: UpdateTrigger.Any
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class WrongModule extends Processor { }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$noupdatemethod`
        })
        class TestComponent extends Processor { }

        // Process. Create element.
        await <any>TestUtil.createComponent(TestComponent);

        // Should be allowed. No errors.
    });

    it('-- Deconstruct module without deconstructor method', async () => {
        // Setup. Define module.
        @PwbAttributeModule({
            access: AccessMode.Read,
            selector: /^nodeconstructmethod$/,
            trigger: UpdateTrigger.Any
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class Module extends Processor { }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div nodeconstructmethod/>`
        })
        class TestComponent extends Processor { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);
        TestUtil.deconstructComponent(lComponent);
    });
});