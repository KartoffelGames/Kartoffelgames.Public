import { expect } from 'chai';
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator';
import { PwbExport } from '../../../../source/default/export/pwb-export.decorator';
import '../../../mock/request-animation-frame-mock-session';
import '../../../utility/chai-helper';
import { TestUtil } from '../../../utility/test-util';
import { ComponentElement } from '../../../../source/core/component/component.interface';

describe('ForInstructionModule', () => {
    it('Array items', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent {
            public list: Array<string> = ['One', 'Two', 'Three'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
            Comment, // -- Manipulator 3. Child Anchor
            HTMLDivElement, // 3. Element
        ], true);
    });

    it('Object properties', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent {
            public list: object = {
                one: 'One',
                two: 'Two',
                three: 'Three'
            };
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
            Comment, // -- Manipulator 3. Child Anchor
            HTMLDivElement, // 3. Element
        ], true);
    });

    it('Custom iterator', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.customIterator(1,4)) {
                <div/>
            }`
        })
        class TestComponent {
            public * customIterator(pStart = 0, pEnd = 100) {
                let lIterationCount = 0;
                for (let lIndex = pStart; lIndex < pEnd; lIndex++) {
                    lIterationCount++;
                    yield lIndex;
                }
                return lIterationCount;
            }
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
            Comment, // -- Manipulator 3. Child Anchor
            HTMLDivElement, // 3. Element
        ], true);
    });

    it('Push item to list', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent {
            @PwbExport
            public list: Array<string> = ['One'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.list.push('Two');
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
        ], true);
    });

    it('Pop item from list', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent {
            @PwbExport
            public list: Array<string> = ['One', 'Two'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.list.pop();
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement // 1. Element
        ], true);
    });

    it('Push middle item to list', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent {
            @PwbExport
            public list: Array<string> = ['One', 'Three'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.list.splice(1, 0, 'Two');
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
            Comment, // -- Manipulator 3. Child Anchor
            HTMLDivElement // 3. Element
        ], true);
    });

    it('pop middle item to list', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent {
            @PwbExport
            public list: Array<string> = ['One', 'Two', 'Three'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.list.splice(1, 1);
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement // 2. Element
        ], true);
    });

    it('Null value', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent {
            @PwbExport
            public list: Array<string> | null = null;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
        ], true);
    });

    it('Use iterator item values', async () => {
        // Setup. Text content.
        const lTextContent: string = 'TEXT CONTENT.';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div>{{this.item}}</div>
            }`
        })
        class TestComponent {
            public list: Array<string> = [lTextContent];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: lTextContent
            }
        ], true);
    });

    it('Use object item values', async () => {
        // Setup. Text content.
        const lTextContent: string = 'TEXT CONTENT.';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div>{{this.item}}</div>
            }`
        })
        class TestComponent {
            public list: object = {
                one: lTextContent
            };
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: lTextContent
            }
        ], true);
    });

    it('Array index', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list; index = $index) {
                <div>{{this.index}}</div>
            }`
        })
        class TestComponent {
            public list: Array<string> = ['One', 'Two'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: '0'
            },
            Comment, // -- Manipulator 2. Child Anchor
            {
                node: HTMLDivElement,
                textContent: '1'
            }
        ], true);
    });

    it('Object property as index', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list; index = $index) {
                <div>{{this.index}}</div>
            }`
        })
        class TestComponent {
            public list: object = {
                one: 'SomeValue',
                two: 'SomeSecondValue'
            };
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: 'one'
            },
            Comment, // -- Manipulator 2. Child Anchor
            {
                node: HTMLDivElement,
                textContent: 'two'
            }
        ], true);
    });

    it('Index calculation', async () => {
        const lList: Array<number> = [2, 4];

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `
            $for(item of this.list; index = $index * this.item) {
                <div>{{this.index}}</div>
            }`
        })
        class TestComponent {
            public list: Array<number> = lList;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: (0 * lList[0]).toString()
            },
            Comment, // -- Manipulator 2. Child Anchor
            {
                node: HTMLDivElement,
                textContent: (1 * lList[1]).toString()
            }
        ], true);
    });

    it('-- Wrong syntax', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item WRONG this.list) {
                <div/>
            }`
        })
        class TestComponent { }

        // Process. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (pError) {
            const lError: Error = <Error>pError;
            lErrorMessage = lError.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal('For-Parameter value has wrong format: item WRONG this.list');
    });

    it('-- Wrapped itself', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(outerItem of [1,2]) {
                <div>
                    $for(innerItem of this.list) {
                        <div/>
                    }
                </div>
            }`
        })
        class TestComponent {
            @PwbExport
            public list: Array<number> = [1];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.list.push(2);
        await TestUtil.waitForUpdate(lComponent);
        lComponent.list.pop();
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Parent Anchor
            Comment, // Static
            {
                node: HTMLDivElement,
                childs: [
                    // First For element.
                    Comment, // Manipulator
                    Comment, // Static
                    HTMLDivElement,
                ]
            },
            Comment, // Static
            {
                node: HTMLDivElement,
                childs: [
                    // First For element.
                    Comment, // Manipulator
                    Comment, // Static
                    HTMLDivElement,
                ]
            }
        ], true);
    });

    it('-- Deconstruct wrapped modules', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(outerItem of [1,2]) {
                            <div>
                                $for(innerItem of this.list) {
                                    <div/>
                                }
                            </div>
                        }`
        })
        class TestComponent {
            public list: Array<number> = [1];
        }

        // Setup. Create element.
        const lComponent: ComponentElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.deconstructComponent(lComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([], true);
    });

    it('-- After native elements', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `
            <div/>
            $for(item of this.list) {
                <div/>
            }
            <div/>`
        })
        class TestComponent {
            public list: Array<number> = [1];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            HTMLDivElement,
            Comment, // - Instruction Anchor
            Comment, // Static Anchor
            HTMLDivElement,
            HTMLDivElement, // Static element
        ], true);
    });

    it('-- Inside native elements', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `
            <div>
                $for(item of this.list) {
                    <div/>
                }
            </div>`
        })
        class TestComponent {
            public list: Array<number> = [1];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                childs: [
                    Comment, // - Manipulator Parent Anchor
                    Comment, // Static
                    HTMLDivElement,
                ]
            }
        ], true);
    });

    it('-- Only self created values', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of new Array(3).fill('a')) {
                <div>{{this.item}}</div>
            }`
        })
        class TestComponent { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: 'a'
            },
            Comment, // -- Manipulator 2. Child Anchor
            {
                node: HTMLDivElement,
                textContent: 'a'
            },
            Comment, // -- Manipulator 3. Child Anchor
            {
                node: HTMLDivElement,
                textContent: 'a'
            }
        ], true);
    });
});