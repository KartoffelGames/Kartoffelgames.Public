// Import mock at start of file.
import { TestUtil } from '../../../utility/test-util.ts';

// Funcitonal imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator.ts';
import { Processor } from '../../../../source/core/core_entity/processor.ts';
import { AccessMode } from '../../../../source/core/enum/access-mode.enum.ts';
import { UpdateTrigger } from '../../../../source/core/enum/update-trigger.enum.ts';
import { PwbExtensionModule } from '../../../../source/core/extension/pwb-extension-module.decorator.ts';

Deno.test('PwbExtensionModule--Functionality: Call extension constructor on component restriction', async (pContext) => {
    await pContext.step('Default', async () => {
        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent extends Processor { }

        // Process. Create extension.
        let lExtensionCalled: boolean = false;
        @PwbExtensionModule({
            access: AccessMode.Read,
            trigger: UpdateTrigger.Any,
            targetRestrictions: [TestComponent]
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class UselessExtension extends Processor {
            public constructor() {
                super();

                lExtensionCalled = true;
            }
        }

        // Process. Create and initialize element.
        const lComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lExtensionCalled).toBeTruthy();

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbExtensionModule--Functionality: Ignore extension without valid target restriction', async (pContext) => {
    await pContext.step('Default', async () => {
        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent extends Processor { }

        // Process. Create extension.
        let lExtensionCalled: boolean = false;
        @PwbExtensionModule({
            access: AccessMode.Read,
            trigger: UpdateTrigger.Any,
            targetRestrictions: [class NotUsed { }]
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class UselessExtension extends Processor {
            public constructor() {
                super();

                lExtensionCalled = true;
            }
        }

        // Process. Create and initialize element.
        const lComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lExtensionCalled).toBeFalsy();

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});