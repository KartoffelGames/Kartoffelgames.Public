import { expect } from '@kartoffelgames/core-test';
import { before, describe, it } from '@std/testing/bdd';
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator.ts';
import { PwbConfiguration } from '../../../../source/core/configuration/pwb-configuration.ts';
import { Processor } from '../../../../source/core/core_entity/processor.ts';
import { ModuleDataLevel } from '../../../../source/core/data/module-data-level.ts';
import { AccessMode } from '../../../../source/core/enum/access-mode.enum.ts';
import { UpdateTrigger } from '../../../../source/core/enum/update-trigger.enum.ts';
import { PwbAttributeModule } from '../../../../source/core/module/attribute_module/pwb-attribute-module.decorator.ts';
import '../../../utility/request-animation-frame-mock-session.ts';
import { TestUtil } from '../../../utility/test-util.ts';

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
        expect(lErrorMessage).toBe(`Temporary value "${lTemporaryValueName}" does not exist for this procedure.`);
    });
});