import { expect } from 'chai';
import { AccessMode } from '../../../source';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator';
import { PwbExtensionModule } from '../../../source/core/extension/pwb-extension-module.decorator';
import { UpdateTrigger } from '../../../source/enum/update-trigger.enum';
import { TestUtil } from '../../utility/test-util';

describe('BaseExtension', () => {
    it('-- Call extension constructor on component restriction', async () => {
        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Process. Create extension.
        let lExtensionCalled: boolean = false;
        @PwbExtensionModule({
            access: AccessMode.Read,
            trigger: UpdateTrigger.Default,
            targetRestrictions: [TestComponent]
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class UselessExtension {
            public constructor() {
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
        class TestComponent { }

        // Process. Create extension.
        let lExtensionCalled: boolean = false;
        @PwbExtensionModule({
            access: AccessMode.Read,
            trigger: UpdateTrigger.Default,
            targetRestrictions: [class NotUsed { }]
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class UselessExtension {
            public constructor() {
                lExtensionCalled = true;
            }
        }

        // Process. Create and initialize element.
        await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lExtensionCalled).to.be.false;
    });
});