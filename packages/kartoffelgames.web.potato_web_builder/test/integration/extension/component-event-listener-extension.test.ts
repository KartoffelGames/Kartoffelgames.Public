import { expect } from 'chai';
import { PwbComponentEventListener } from '../../../source';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

describe('ComponentEventListenerExtension', () => {
    it('-- Component click event', async () => {
        // Setup. Define component and wait for update.
        const lEventResult = await new Promise<MouseEvent>((pResolve) => {
            @PwbComponent({
                selector: TestUtil.randomSelector(),
            })
            class TestComponent {
                @PwbComponentEventListener('click')
                public handler(pEvent: MouseEvent): void {
                    pResolve(pEvent);
                }
            }

            // Process. Create element and click div.
            TestUtil.createComponent(TestComponent).then((pComponent)=>{
                pComponent.click();
            });
        });

        // Evaluation.
        expect(lEventResult).to.instanceOf(MouseEvent);
    });
});