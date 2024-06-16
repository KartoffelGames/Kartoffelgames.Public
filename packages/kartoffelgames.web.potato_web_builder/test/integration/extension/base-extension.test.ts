import { expect } from 'chai';
import { AccessMode } from '../../../source';
import { PwbComponent } from '../../../source/component_entity/component/pwb-component.decorator';
import { PwbExtensionModule } from '../../../source/component_entity/module/extension_module/pwb-extension-module.decorator';
import { UpdateTrigger } from '../../../source/enum/update-trigger.enum';
import { TestUtil } from '../../utility/test-util';

describe('BaseExtension', () => {
    it('-- Injection extension without injection', async () => {
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

    it('-- Ignore wrong injections', async () => {
        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div #child />' // Module for module injection.
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

            public onCollectInjections(): Array<object | null> {
                const lInjectionList: Array<object | null> = new Array<object | null>();
                lInjectionList.push(null);
                lInjectionList.push(<any>1);
                return lInjectionList;
            }
        }

        // Process. Create and initialize element.
        await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lExtensionCalled).to.be.true;
    });
});