// Import mock at start of file.
import { TestUtil } from '../../utility/test-util.ts';

// Functional imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { ComponentState } from '../../../source/core/core_entity/component_state/component-state.ts';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator.ts';
import { PwbChild } from '../../../source/module/pwb_child/pwb-child.decorator.ts';

Deno.test('PwbChild--Functionality: Read id child', async (pContext) => {
    await pContext.step('Read id child', async () => {
        // Setup. Values.
        const lIdName: string = 'IdChildId';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div #${lIdName}/>`
        })
        class TestComponent {
            @PwbExport
            @PwbChild(lIdName)
            public accessor idChild!: HTMLDivElement | null;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lComponentIdChild: HTMLDivElement | null = lComponent.idChild;
        const lRealIdChild: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponentIdChild).toBe(lRealIdChild);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbChild--Functionality: Read child inside a bound setter before the view is built', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        const lInnerId: string = 'InnerChild';
        const lChildSelector: string = TestUtil.randomSelector();

        // Captures what the childs @PwbChild resolves to while its setter runs before the first build.
        let lInnerWhileBinding: HTMLDivElement | null | undefined = undefined;

        // Setup. Child component whose exported input setter reads its own @PwbChild view.
        @PwbComponent({
            selector: lChildSelector,
            template: `<div #${lInnerId}/>`
        })
        class ChildComponent {
            @PwbChild(lInnerId)
            public accessor inner!: HTMLDivElement | null;

            private mValue: string = '';

            @PwbExport
            public get value(): string {
                return this.mValue;
            } set value(pValue: string) {
                this.mValue = pValue;

                // The view is not built yet on the initial binding, so the child is not resolvable.
                lInnerWhileBinding = this.inner;
            }
        }

        // Setup. Parent binds a value onto the child so the childs setter runs while the parent builds it.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lChildSelector} [value]="this.parentValue"/>`,
            components: [ChildComponent]
        })
        class ParentComponent {
            public parentValue: string = 'from-parent';
        }

        // Process. Create the parent. The childs binding is applied before the child is built.
        await TestUtil.createComponent(ParentComponent);

        // Evaluation. Reading a not-yet-built child returns null instead of throwing.
        expect(lInnerWhileBinding).toBeNull();
    });
});

Deno.test('PwbChild--Functionality: Read child after build when created by a parent', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Values.
        const lInnerId: string = 'InnerChild';
        const lChildSelector: string = TestUtil.randomSelector();

        // Setup. Child component that accesses its own @PwbChild after the build, in onUpdate.
        @PwbComponent({
            selector: lChildSelector,
            template: `<div #${lInnerId}>{{ this.value }}</div>`
        })
        class ChildComponent {
            @PwbChild(lInnerId)
            public accessor inner!: HTMLDivElement | null;

            private mValue: string = '';

            @PwbExport
            public get value(): string {
                return this.mValue;
            } set value(pValue: string) {
                this.mValue = pValue;
            }

            public onUpdate(): void {
                // The view is built when onUpdate runs, so the child is available.
                this.inner?.setAttribute('data-value', this.mValue);
            }
        }

        // Setup. Parent binds a value onto the child.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lChildSelector} [value]="this.parentValue"/>`,
            components: [ChildComponent]
        })
        class ParentComponent {
            public parentValue: string = 'from-parent';
        }

        // Process. Create the parent.
        const lComponent: HTMLElement = await TestUtil.createComponent(ParentComponent);

        // Read the child element from the parent shadow root and its inner @PwbChild view.
        const lChild: HTMLElement = lComponent.shadowRoot!.querySelector(lChildSelector) as HTMLElement;
        expect(lChild).not.toBeNull();
        const lInner: HTMLDivElement = lChild.shadowRoot!.querySelector('div') as HTMLDivElement;

        // Evaluation. The child rendered and its view was updated with the bound value after the build.
        expect(lInner.getAttribute('data-value')).toBe('from-parent');

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbChild--Functionality: Forbidden static property use', async (pContext) => {
    await pContext.step('Forbidden static property use', () => {
        // Process.
        const lErrorFunction = () => {
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestComponent {
                @PwbChild('Name')
                public static accessor idChild: HTMLDivElement | null;
            }
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('Child decorator is not for a static property.');
    });
});

Deno.test('PwbChild--Functionality: Read with wrong id child name', async (pContext) => {
    await pContext.step('Read with wrong id child name', async () => {
        // Setup.
        const lWrongName: string = 'WrongName';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div #Name/>`
        })
        class TestComponent {
            @PwbExport
            @PwbChild(lWrongName)
            public accessor idChild!: HTMLDivElement | null;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation. A child that does not exist resolves to null instead of throwing.
        expect(lComponent.idChild).toBeNull();

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbChild--Functionality: Child decorator on non-Component object', async (pContext) => {
    await pContext.step('Child decorator on non-Component object', () => {
        // Setup. Define class.
        class TestClass {
            @PwbChild('SomeName')
            public accessor child!: HTMLElement | null;
        }

        // Process. Create class and read child.
        const lErrorFunction = () => {
            const lObject: TestClass = new TestClass();
            return lObject.child;
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('PwbChild target class is not a component.');
    });
});

Deno.test('PwbChild--Functionality: Read inherited id child', async (pContext) => {
    await pContext.step('Read inherited id child', async () => {
        // Setup. Values.
        const lIdName: string = 'IdChildId';

        // Setup. Define parent class.
        class ParentClass {
            @PwbExport
            @PwbChild(lIdName)
            public accessor idChild!: HTMLDivElement | null;
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div #${lIdName}/>`
        })
        class TestComponent extends ParentClass { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lComponentIdChild: HTMLDivElement | null = lComponent.idChild;
        const lRealIdChild: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponentIdChild).toBe(lRealIdChild);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbChild--Functionality: Remove id child', async (pContext) => {
    await pContext.step('Remove id child', async () => {
        // Setup. Values.
        const lIdName: string = 'IdChildId';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$if(this.showChild) {
                <div #${lIdName}/>
            }`
        })
        class TestComponent {
            @PwbExport
            @PwbChild(lIdName)
            public accessor idChild!: HTMLDivElement | null;

            @PwbExport
            @ComponentState.state()
            public accessor showChild: boolean = true;
        }

        // Setup. Create element and remove child.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.showChild = false;
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation. Once removed, the child resolves to null instead of throwing.
        expect(lComponent.idChild).toBeNull();

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});
