// Import mock at start of file.
import { TestUtil } from '../../utility/test-util.ts';

// Funcitonal imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { CoreEntityProcessorProxy } from '../../../source/core/core_entity/interaction-tracker/core-entity-processor-proxy.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator.ts';
import { PwbChild } from '../../../source/module/pwb_child/pwb-child.decorator.ts';

describe('PwbChild', () => {
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
            public accessor idChild!: HTMLDivElement;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lComponentIdChild: HTMLDivElement = CoreEntityProcessorProxy.getOriginal(lComponent.idChild);
        const lRealIdChild: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponentIdChild).toBe(lRealIdChild);
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
                public static accessor idChild: HTMLDivElement;
            }
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('Event target is not for a static property.');
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
            public accessor idChild!: HTMLDivElement;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lErrorFunction = () => {
            return lComponent.idChild;
        };

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lErrorFunction).toThrow(`Can't find child "${lWrongName}".`);
    });

    it('-- Child decorator on none Component object', () => {
        // Setup. Define class.
        class TestClass {
            @PwbChild('SomeName')
            public accessor child!: HTMLElement;
        }

        // Process. Create class and read child.
        const lErrorFunction = () => {
            const lObject: TestClass = new TestClass();
            return lObject.child;
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('PwbChild target class it not a component.');
    });

    it('-- Read inherited id child', async () => {
        // Setup. Values.
        const lIdName: string = 'IdChildId';

        // Setup. Define parent class.
        class ParentClass extends Processor {
            @PwbExport
            @PwbChild(lIdName)
            public accessor idChild!: HTMLDivElement;
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
        expect(lComponentIdChild).toBe(lRealIdChild);
    });
});