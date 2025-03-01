import { expect } from '@kartoffelgames/core-test';
import { before, describe, it } from '@std/testing/bdd';
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator.ts';
import { PwbTemplateXmlNode } from '../../../../source/core/component/template/nodes/pwb-template-xml-node.ts';
import { PwbTemplate } from '../../../../source/core/component/template/nodes/pwb-template.ts';
import { PwbConfiguration } from '../../../../source/core/configuration/pwb-configuration.ts';
import { Processor } from '../../../../source/core/core_entity/processor.ts';
import type { ComponentDataLevel } from '../../../../source/core/data/component-data-level.ts';
import { UpdateTrigger } from '../../../../source/core/enum/update-trigger.enum.ts';
import type { IInstructionOnUpdate } from '../../../../source/core/module/instruction_module/instruction-module.ts';
import { InstructionResult } from '../../../../source/core/module/instruction_module/instruction-result.ts';
import { PwbInstructionModule } from '../../../../source/core/module/instruction_module/pwb-instruction-module.decorator.ts';
import '../../../utility/request-animation-frame-mock-session.ts';
import { TestUtil } from '../../../utility/test-util.ts';

describe('Custom Module', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- Same result, twice', async () => {
        // Setup. Define module.
        @PwbInstructionModule({
            instructionType: 'multiresult',
            trigger: UpdateTrigger.Any
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class WrongModule extends Processor implements IInstructionOnUpdate {
            private readonly mDataLevel: ComponentDataLevel;

            public constructor(pValueReference: ComponentDataLevel) {
                super();

                this.mDataLevel = pValueReference;
            }

            public onUpdate(): InstructionResult {
                // If in any way the execution result is true, add template to result.
                const lModuleResult: InstructionResult = new InstructionResult();

                const lTemplateOne: PwbTemplate = new PwbTemplate();
                lTemplateOne.appendChild(new PwbTemplateXmlNode());

                const lTemplateTwo: PwbTemplate = new PwbTemplate();
                lTemplateTwo.appendChild(new PwbTemplateXmlNode());

                lModuleResult.addElement(lTemplateOne, this.mDataLevel.data);
                lModuleResult.addElement(lTemplateTwo, this.mDataLevel.data);

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
        expect(lErrorMessage).toBe(`Can't add same template or values for multiple Elements.`);
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
});