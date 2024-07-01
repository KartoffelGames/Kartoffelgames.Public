import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { expect } from 'chai';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator';
import { Processor } from '../../../source/core/core_entity/processor';
import { PwbDebug } from '../../../source/core/configuration/pwb-debug';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

// eslint-disable-next-line @typescript-eslint/naming-convention
const HTMLSlotElement: InjectionConstructor = <any>document.createElement('slot').constructor;

describe('SlotAttribute', () => {
    before(() => {
        const lConfiguration: PwbDebug = new PwbDebug();
        lConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
    });

    it('-- Default slot', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '$slot'
        })
        class TestComponent extends Processor { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lSlotName: string | null = TestUtil.getComponentNode<HTMLSlotElement>(lComponent, 'slot').getAttribute('name');

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // Instruction Anchor
            Comment, // Static Anchor
            HTMLSlotElement
        ], true);
        expect(lSlotName).to.be.null;
    });

    it('-- Named slot', async () => {
        // Setup. Values.
        const lSlotName: string = 'slotname';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$slot(${lSlotName})`
        })
        class TestComponent extends Processor { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // Instruction Anchor
            Comment, // Static Anchor
            {
                node: HTMLSlotElement,
                attributes: [{ name: 'name', value: lSlotName, }]
            }
        ], true);
    });
});