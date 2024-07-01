import { expect } from 'chai';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator';
import { Processor } from '../../../source/core/core_entity/processor';
import { AccessMode } from '../../../source/core/enum/access-mode.enum';
import { UpdateTrigger } from '../../../source/core/enum/update-trigger.enum';
import { PwbExtensionModule } from '../../../source/core/extension/pwb-extension-module.decorator';
import { PwbDebug } from '../../../source/core/configuration/pwb-debug';
import { TestUtil } from '../../utility/test-util';

describe('BaseExtension', () => {
    before(() => {
        const lConfiguration: PwbDebug = new PwbDebug();
        lConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
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
        expect(lExtensionCalled).to.be.true;
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
        expect(lExtensionCalled).to.be.false;
    });
});