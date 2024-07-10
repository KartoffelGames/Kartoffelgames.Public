import { expect } from 'chai';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator';
import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration';
import { Processor } from '../../../source/core/core_entity/processor';
import { PwbComponentEventListener } from '../../../source/module/component-event-listener/pwb-component-event-listener.decorator';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

describe('ComponentEventListenerExtension', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- Component click event', async () => {
        // Setup. Define component and wait for update.
        const lEventResult = await new Promise<MouseEvent>((pResolve) => {
            @PwbComponent({
                selector: TestUtil.randomSelector(),
            })
            class TestComponent extends Processor {
                @PwbComponentEventListener('click')
                public handler(pEvent: MouseEvent): void {
                    pResolve(pEvent);
                }
            }

            // Process. Create element and click div.
            TestUtil.createComponent(TestComponent).then((pComponent) => {
                pComponent.click();
            });
        });

        // Evaluation.
        expect(lEventResult).to.instanceOf(MouseEvent);
    });
});