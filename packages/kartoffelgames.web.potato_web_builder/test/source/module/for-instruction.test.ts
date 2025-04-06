import { expect } from '@kartoffelgames/core-test';
import { before, describe, it } from '@std/testing/bdd';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator.ts';
import '../../utility/request-animation-frame-mock-session.ts';
import { TestUtil } from '../../utility/test-util.ts';

// @deno-types="npm:@types/jsdom"
import { JSDOM, DOMWindow } from 'npm:jsdom';

// Setup global scope.
const MOCK_WINDOW: DOMWindow = (() => {
    const lMockDom: JSDOM = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', { pretendToBeVisual: true });

    PwbConfiguration.configuration.scope.window = lMockDom.window as unknown as typeof globalThis;
    PwbConfiguration.configuration.scope.document = lMockDom.window.document;

    return lMockDom.window;
})();

describe('ForInstruction', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    describe('-- Array', () => {
        it('-- Initial', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 1. Element
                MOCK_WINDOW.Comment, // -- Manipulator 2. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 2. Element
                MOCK_WINDOW.Comment, // -- Manipulator 3. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 3. Element
            ], true);
        });

        it('-- Add value', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 1. Element
                MOCK_WINDOW.Comment, // -- Manipulator 2. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 2. Element
            ], true);
        });

        it('-- Remove value', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                MOCK_WINDOW.HTMLDivElement // 1. Element
            ], true);
        });

        it('-- Add middle value', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 1. Element
                MOCK_WINDOW.Comment, // -- Manipulator 2. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 2. Element
                MOCK_WINDOW.Comment, // -- Manipulator 3. Child Anchor
                MOCK_WINDOW.HTMLDivElement // 3. Element
            ], true);
        });

        it('-- Remove middle value', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 1. Element
                MOCK_WINDOW.Comment, // -- Manipulator 2. Child Anchor
                MOCK_WINDOW.HTMLDivElement // 2. Element
            ], true);
        });

        it('-- Correct index value', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: '0'
                },
                MOCK_WINDOW.Comment, // -- Manipulator 2. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: '1'
                }
            ], true);
        });

        it('-- Correct values', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: lTextContent
                }
            ], true);
        });

        it('-- Replace value', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: lTextContent
                }
            ], true);
        });

        it('-- Empty on null', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
            ], true);
        });
    });

    describe('-- Object', () => {
        it('-- Initial', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 1. Element
                MOCK_WINDOW.Comment, // -- Manipulator 2. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 2. Element
                MOCK_WINDOW.Comment, // -- Manipulator 3. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 3. Element
            ], true);
        });

        it('-- Add value', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 1. Element
                MOCK_WINDOW.Comment, // -- Manipulator 2. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 2. Element
            ], true);
        });

        it('-- Remove value', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                MOCK_WINDOW.HTMLDivElement // 1. Element
            ], true);
        });

        it('-- Remove middle value', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 1. Element
                MOCK_WINDOW.Comment, // -- Manipulator 2. Child Anchor
                MOCK_WINDOW.HTMLDivElement // 2. Element
            ], true);
        });

        it('-- Replace value', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: lTextContent.toString()
                }
            ], true);
        });

        it('-- Correct index value', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: 'One'
                },
                MOCK_WINDOW.Comment, // -- Manipulator 2. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: 'Two'
                }
            ], true);
        });

        it('-- Correct values', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: lTextContent.toString()
                }
            ], true);
        });
    });

    it('-- Generator', () => {
        it('-- Initial', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 1. Element
                MOCK_WINDOW.Comment, // -- Manipulator 2. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 2. Element
                MOCK_WINDOW.Comment, // -- Manipulator 3. Child Anchor
                MOCK_WINDOW.HTMLDivElement, // 3. Element
            ], true);
        });
    });

    describe('-- Syntax', () => {
        it('-- Wrong syntax', async () => {
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

        it('-- Expression created values', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: 'a'
                },
                MOCK_WINDOW.Comment, // -- Manipulator 2. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: 'a'
                },
                MOCK_WINDOW.Comment, // -- Manipulator 3. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: 'a'
                }
            ], true);
        });
    });

    describe('-- Index calculation', () => {
        it('-- Static value', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: (0 * 2).toString()
                },
                MOCK_WINDOW.Comment, // -- Manipulator 2. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: (1 * 2).toString()
                }
            ], true);
        });

        it('-- Item value', async () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Anchor
                MOCK_WINDOW.Comment, // -- Manipulator 1. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: (0 * lList[0]).toString()
                },
                MOCK_WINDOW.Comment, // -- Manipulator 2. Child Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    textContent: (1 * lList[1]).toString()
                }
            ], true);
        });
    });

    describe('-- Context', () => {
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
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.Comment, // - Manipulator Parent Anchor
                MOCK_WINDOW.Comment, // Static
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    childs: [
                        // First For element.
                        MOCK_WINDOW.Comment, // Manipulator
                        MOCK_WINDOW.Comment, // Static
                        MOCK_WINDOW.HTMLDivElement,
                    ]
                },
                MOCK_WINDOW.Comment, // Static
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    childs: [
                        // First For element.
                        MOCK_WINDOW.Comment, // Manipulator
                        MOCK_WINDOW.Comment, // Static
                        MOCK_WINDOW.HTMLDivElement,
                    ]
                }
            ], true);
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
            class TestComponent extends Processor {
                public list: Array<number> = [1];
            }

            // Setup. Create element.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

            // Evaluation.
            // Evaluation.
            expect(lComponent).toBeComponentStructure([
                MOCK_WINDOW.Comment, // Component Anchor
                MOCK_WINDOW.HTMLDivElement,
                MOCK_WINDOW.Comment, // - Instruction Anchor
                MOCK_WINDOW.Comment, // Static Anchor
                MOCK_WINDOW.HTMLDivElement,
                MOCK_WINDOW.HTMLDivElement, // Static element
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
            class TestComponent extends Processor {
                public list: Array<number> = [1];
            }

            // Setup. Create element.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

            // Evaluation.
            expect(lComponent).toBeComponentStructure([
                MOCK_WINDOW.Comment, // Component Anchor
                {
                    node: MOCK_WINDOW.HTMLDivElement,
                    childs: [
                        MOCK_WINDOW.Comment, // - Manipulator Parent Anchor
                        MOCK_WINDOW.Comment, // Static
                        MOCK_WINDOW.HTMLDivElement,
                    ]
                }
            ], true);
        });
    });

    it('-- Deconstruct', async () => {
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
    });
});