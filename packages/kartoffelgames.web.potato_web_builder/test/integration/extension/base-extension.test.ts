import { expect } from 'chai';
import { AccessMode } from '../../../source';
import { PwbComponent } from '../../../source/decorator/pwb-component.decorator';
import { PwbExtensionModule } from '../../../source/decorator/pwb-extension-module.decorator';
import { ExtensionType } from '../../../source/enum/extension-type.enum';
import { TestUtil } from '../../utility/test-util';
import { UpdateTrigger } from '../../../source/enum/update-trigger.enum';

describe('BaseExtension', () => {
    it('-- Injection extension without injection', async () => {
        // Process. Create extension.
        let lExtensionCalled: boolean = false;
        @PwbExtensionModule({
            access: AccessMode.Read,
            trigger: UpdateTrigger.Default,
            type: ExtensionType.Component
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class UselessExtension {
            public constructor() {
                lExtensionCalled = true;
            }
        }

        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Process. Create and initialize element.
        await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lExtensionCalled).to.be.true;
    });

    it('-- Ignore wrong injections', async () => {
        // Process. Create extension.
        let lExtensionCalled: boolean = false;
        @PwbExtensionModule({
            access: AccessMode.Read,
            trigger: UpdateTrigger.Default,
            type: ExtensionType.Component | ExtensionType.Module
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

        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div #child />' // Module for module injection.
        })
        class TestComponent { }

        // Process. Create and initialize element.
        await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lExtensionCalled).to.be.true;
    });
});