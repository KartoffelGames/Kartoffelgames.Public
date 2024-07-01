import { Exception } from '@kartoffelgames/core';
import { expect } from 'chai';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator';
import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration';
import { CoreEntityProcessorProxy } from '../../../source/core/core_entity/interaction-tracker/core-entity-processor-proxy';
import { Processor } from '../../../source/core/core_entity/processor';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator';
import { PwbChild } from '../../../source/module/pwb_child/pwb-child.decorator';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

describe('PwbChildAttributeModule', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
    });

    it('-- Read id child', async () => {
        // Setup. Values.
        const lIdName: string = 'IdChildId';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div #${lIdName}/>`
        })
        class TestComponent extends Processor {
            @PwbExport
            @PwbChild(lIdName)
            public idChild!: HTMLDivElement;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lComponentIdChild: HTMLDivElement = CoreEntityProcessorProxy.getOriginal(lComponent.idChild);
        const lRealIdChild: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponentIdChild).to.equal(lRealIdChild);
    });

    it('-- Forbidden static property use', () => {
        // Process.
        const lErrorFunction = () => {
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestComponent extends Processor {
                @PwbChild('Name')
                public static idChild: HTMLDivElement;
            }
        };

        // Evaluation.
        expect(lErrorFunction).to.throw(Exception, 'Event target is not for a static property.');
    });

    it('-- Read with wrong id child name', async () => {
        // Setup.
        const lWrongName: string = 'WrongName';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div #Name/>`
        })
        class TestComponent extends Processor {
            @PwbExport
            @PwbChild(lWrongName)
            public idChild!: HTMLDivElement;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lErrorFunction = () => {
            lComponent.idChild;
        };

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lErrorFunction).to.throw(Exception, `Can't find child "${lWrongName}".`);
    });

    it('-- Child decorator on none Component object', () => {
        // Setup. Define class.
        class TestClass {
            @PwbChild('SomeName')
            public child!: HTMLElement;
        }

        // Process. Create class and read child.
        const lErrorFunction = () => {
            const lObject: TestClass = new TestClass();
            lObject.child;
        };

        // Evaluation.
        expect(lErrorFunction).to.throw(Exception, 'PwbChild target class it not a component.');
    });

    it('-- Read inherited id child', async () => {
        // Setup. Values.
        const lIdName: string = 'IdChildId';

        // Setup. Define parent class.
        class ParentClass extends Processor {
            @PwbExport
            @PwbChild(lIdName)
            public idChild!: HTMLDivElement;
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div #${lIdName}/>`
        })
        class TestComponent extends ParentClass { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lComponentIdChild: HTMLDivElement = CoreEntityProcessorProxy.getOriginal(lComponent.idChild);
        const lRealIdChild: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponentIdChild).to.equal(lRealIdChild);
    });
});