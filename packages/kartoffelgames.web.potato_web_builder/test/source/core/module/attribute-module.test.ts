import { expect } from 'chai';
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator';
import { PwbConfiguration } from '../../../../source/core/configuration/pwb-configuration';
import { Processor } from '../../../../source/core/core_entity/processor';
import { ModuleDataLevel } from '../../../../source/core/data/module-data-level';
import { AccessMode } from '../../../../source/core/enum/access-mode.enum';
import { UpdateTrigger } from '../../../../source/core/enum/update-trigger.enum';
import { PwbAttributeModule } from '../../../../source/core/module/attribute_module/pwb-attribute-module.decorator';
import '../../../utility/chai-helper';
import '../../../utility/request-animation-frame-mock-session';
import { TestUtil } from '../../../utility/test-util';

describe('Custom Module', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- Set non existing temporary value of level procedure', async () => {
        // Setup.
        const lTemporaryValueName: string = 'notthere';

        // Setup. Define module.
        @PwbAttributeModule({
            access: AccessMode.Read,
            selector: /^setnonexistingtemporaryvalue$/,
            trigger: UpdateTrigger.Any
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class Module extends Processor {
            public constructor(pData: ModuleDataLevel) {
                super();

                const lExpression = pData.createExpressionProcedure('');
                lExpression.setTemporaryValue(lTemporaryValueName, 0);
            }
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div setnonexistingtemporaryvalue/>`
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
        expect(lErrorMessage).to.equal(`Temporary value "${lTemporaryValueName}" does not exist for this procedure.`);
    });
});