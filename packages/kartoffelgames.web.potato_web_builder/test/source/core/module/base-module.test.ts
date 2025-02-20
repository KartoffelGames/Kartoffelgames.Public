import { Exception } from '@kartoffelgames/core';
import { expect } from '@kartoffelgames/core-test';
import { before, describe, it } from '@std/testing/bdd';
import { PwbConfiguration } from '../../../../source/core/configuration/pwb-configuration.ts';
import { ModuleTargetNode } from '../../../../source/core/module/injection_reference/module-target-node.ts';
import { ModuleTemplate } from '../../../../source/core/module/injection_reference/module-template.ts';
import '../../../utility/request-animation-frame-mock-session.ts';

describe('Custom Module', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- Try to construct ModuleTargetNode', async () => {
        // Process. Create error function.
        const lErrorFunction = () => {
            new ModuleTargetNode();
        };

        // Evaluation.
        expect(lErrorFunction).to.throw(Exception, 'Reference should not be instanced.');
    });

    it('-- Try to construct ModuleTempate', async () => {
        // Process. Create error function.
        const lErrorFunction = () => {
            new ModuleTemplate();
        };

        // Evaluation.
        expect(lErrorFunction).to.throw(Exception, 'Reference should not be instanced.');
    });
});