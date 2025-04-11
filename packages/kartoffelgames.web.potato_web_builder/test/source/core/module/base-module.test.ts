import { expect } from '@kartoffelgames/core-test';
import { ModuleTargetNode } from '../../../../source/core/module/injection_reference/module-target-node.ts';
import { ModuleTemplate } from '../../../../source/core/module/injection_reference/module-template.ts';

Deno.test('BaseModule--Functionality: CustomModule - Try to construct ModuleTargetNode', async (pContext) => {
    await pContext.step('Default', async () => {
        // Process. Create error function.
        const lErrorFunction = () => {
            new ModuleTargetNode();
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('Reference should not be instanced.');
    });
});

Deno.test('BaseModule--Functionality: CustomModule - Try to construct ModuleTemplate', async (pContext) => {
    await pContext.step('Default', async () => {
        // Process. Create error function.
        const lErrorFunction = () => {
            new ModuleTemplate();
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('Reference should not be instanced.');
    });
});