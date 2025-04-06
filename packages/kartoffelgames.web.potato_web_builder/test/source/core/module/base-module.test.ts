import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { ModuleTargetNode } from '../../../../source/core/module/injection_reference/module-target-node.ts';
import { ModuleTemplate } from '../../../../source/core/module/injection_reference/module-template.ts';

describe('Custom Module', () => {
    it('-- Try to construct ModuleTargetNode', async () => {
        // Process. Create error function.
        const lErrorFunction = () => {
            new ModuleTargetNode();
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('Reference should not be instanced.');
    });

    it('-- Try to construct ModuleTempate', async () => {
        // Process. Create error function.
        const lErrorFunction = () => {
            new ModuleTemplate();
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('Reference should not be instanced.');
    });
});