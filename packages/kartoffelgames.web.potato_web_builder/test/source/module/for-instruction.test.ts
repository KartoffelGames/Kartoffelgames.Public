// Import mock at start of file.
import { TestUtil } from '../../utility/test-util.ts';

// Funcitonal imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator.ts';

Deno.test('ForInstruction--Functionality: Array', async (pContext) => {
    await pContext.step('Initial', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            public list: Array<string> = ['One', 'Two', 'Three'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
            Comment, // -- Manipulator 3. Child Anchor
            HTMLDivElement, // 3. Element
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Add value', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            @PwbExport
            public list: Array<string> = ['One'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.list.push('Two');
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Remove value', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            @PwbExport
            public list: Array<string> = ['One', 'Two'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.list.pop();
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement // 1. Element
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Add middle value', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            @PwbExport
            public list: Array<string> = ['One', 'Three'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.list.splice(1, 0, 'Two');
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
            Comment, // -- Manipulator 3. Child Anchor
            HTMLDivElement // 3. Element
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Remove middle value', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            @PwbExport
            public list: Array<string> = ['One', 'Two', 'Three'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.list.splice(1, 1);
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement // 2. Element
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Correct index value', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list; index = $index) {
                <div>{{this.index}}</div>
            }`
        })
        class TestComponent extends Processor {
            public list: Array<string> = ['One', 'Two'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
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

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Correct values', async () => {
        // Setup. Text content.
        const lTextContent: string = 'TEXT CONTENT.';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div>{{this.item}}</div>
            }`
        })
        class TestComponent extends Processor {
            public list: Array<string> = [lTextContent];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: lTextContent
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Replace value', async () => {
        // Setup. Text content.
        const lTextContent: string = 'TEXT CONTENT.';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div>{{this.item}}</div>
            }`
        })
        class TestComponent extends Processor {
            @PwbExport
            public list: Array<string> = ['Some other values'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.list[0] = lTextContent;
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: lTextContent
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('-- Empty on null', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            @PwbExport
            public list: Array<string> | null = null;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('ForInstruction--Functionality: Object', async (pContext) => {
    await pContext.step('Initial', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            public list: { [key: string]: number; } = { One: 1, Two: 2, Three: 3 };
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
            Comment, // -- Manipulator 3. Child Anchor
            HTMLDivElement, // 3. Element
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Add value', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            @PwbExport
            public list: { [key: string]: number; } = { One: 1 };
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.list['Two'] = 2;
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Remove value', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            @PwbExport
            public list: { [key: string]: number; } = { One: 1, Two: 2 };
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        delete lComponent.list['Two'];
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement // 1. Element
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Remove middle value', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            @PwbExport
            public list: { [key: string]: number; } = { One: 1, Two: 2, Three: 3 };
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        delete lComponent.list['Two'];
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement // 2. Element
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Replace value', async () => {
        // Setup. Text content.
        const lTextContent: number = 112233;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div>{{this.item}}</div>
            }`
        })
        class TestComponent extends Processor {
            @PwbExport
            public list: { [key: string]: number; } = { One: 99 };
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        delete lComponent.list['One'];
        lComponent.list['Two'] = lTextContent;
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: lTextContent.toString()
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Correct index value', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list; index = $index) {
                <div>{{this.index}}</div>
            }`
        })
        class TestComponent extends Processor {
            public list: { [key: string]: number; } = { One: 1, Two: 2 };
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: 'One'
            },
            Comment, // -- Manipulator 2. Child Anchor
            {
                node: HTMLDivElement,
                textContent: 'Two'
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Correct values', async () => {
        // Setup. Text content.
        const lTextContent: number = 112233;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.list) {
                <div>{{this.item}}</div>
            }`
        })
        class TestComponent extends Processor {
            public list: { [key: string]: number; } = { one: lTextContent };
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: lTextContent.toString()
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('ForInstruction--Functionality: Generator', async (pContext) => {
    await pContext.step('Initial', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$for(item of this.customIterator(1,4)) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
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
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
            Comment, // -- Manipulator 3. Child Anchor
            HTMLDivElement, // 3. Element
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Syntax', async (pContext) => {
        await pContext.step('Wrong syntax', async () => {
            // Setup. Define component.
            @PwbComponent({
                selector: TestUtil.randomSelector(),
                template: `$for(item WRONG this.list) {
                    <div/>
                }`
            })
            class TestComponent extends Processor { }

            // Process. Create element.
            let lErrorMessage: string | null = null;
            try {
                await <any>TestUtil.createComponent(TestComponent);
            } catch (pError) {
                const lError: Error = <Error>pError;
                lErrorMessage = lError.message;
            }

            // Evaluation.
            expect(lErrorMessage).toBe('For-Parameter value has wrong format: item WRONG this.list');
        });

        await pContext.step('Expression created values', async () => {
            // Setup. Define component.
            @PwbComponent({
                selector: TestUtil.randomSelector(),
                template: `$for(item of new Array(3).fill('a')) {
                    <div>{{this.item}}</div>
                }`
            })
            class TestComponent extends Processor { }

            // Setup. Create element.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

            // Evaluation.
            expect(lComponent).toBeComponentStructure([
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

            // Wait for any update to finish to prevent timer leaks.
            await TestUtil.waitForUpdate(lComponent);
        });
    });
});

Deno.test('ForInstruction--Functionality: Index calculation', async (pContext) => {
    await pContext.step('Static value', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `
                    $for(item of this.list; index = $index * 2) {
                        <div>{{this.index}}</div>
                    }`
        })
        class TestComponent extends Processor {
            public list: Array<number> = [2, 4];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: (0 * 2).toString()
            },
            Comment, // -- Manipulator 2. Child Anchor
            {
                node: HTMLDivElement,
                textContent: (1 * 2).toString()
            }
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('Item value', async () => {
        const lList: Array<number> = [2, 4];

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `
                    $for(item of this.list; index = $index * item) {
                        <div>{{this.index}}</div>
                    }`
        })
        class TestComponent extends Processor {
            public list: Array<number> = lList;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
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

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('ForInstruction--Functionality: Context', async (pContext) => {
    await pContext.step('-- Wrapped itself', async () => {
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
        class TestComponent extends Processor {
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
        expect(lComponent).toBeComponentStructure([
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

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('-- After native elements', async () => {
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
        class TestComponent extends Processor {
            public list: Array<number> = [1];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            Comment, // Component Anchor
            HTMLDivElement,
            Comment, // - Instruction Anchor
            Comment, // Static Anchor
            HTMLDivElement,
            HTMLDivElement, // Static element
        ], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });

    await pContext.step('-- Inside native elements', async () => {
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
        class TestComponent extends Processor {
            public list: Array<number> = [1];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
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

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('ForInstruction--Functionality: Deconstruct', async (pContext) => {
    await pContext.step('Default', async () => {
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
        class TestComponent extends Processor {
            public list: Array<number> = [1];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.deconstructComponent(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([], true);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});
