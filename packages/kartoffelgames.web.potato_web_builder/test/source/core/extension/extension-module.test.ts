import { expect } from '@kartoffelgames/core-test';
import { before, describe, it } from '@std/testing/bdd';
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator.ts';
import { PwbConfiguration } from '../../../../source/core/configuration/pwb-configuration.ts';
import { Processor } from '../../../../source/core/core_entity/processor.ts';
import { AccessMode } from '../../../../source/core/enum/access-mode.enum.ts';
import { UpdateTrigger } from '../../../../source/core/enum/update-trigger.enum.ts';
import { PwbExtensionModule } from '../../../../source/core/extension/pwb-extension-module.decorator.ts';
import { TestUtil } from '../../../utility/test-util.ts';

// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';

// Setup global scope.
(() => {
    const lMockDom: JSDOM = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');

    PwbConfiguration.configuration.scope.window = lMockDom.window as unknown as typeof globalThis;
    PwbConfiguration.configuration.scope.document = lMockDom.window.document;
})();

describe('ExtensionModule', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- Call extension constructor on component restriction', async () => {
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
        await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lExtensionCalled).toBeTruthy();
    });

    it('-- Ignore extension without valid target restriction', async () => {
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
        await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lExtensionCalled).toBeFalsy();
    });
});