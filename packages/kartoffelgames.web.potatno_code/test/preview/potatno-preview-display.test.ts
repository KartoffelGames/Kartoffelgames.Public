import { expect } from '@kartoffelgames/core-test';
import { PotatnoPreviewDisplay } from '../../source/preview/potatno-preview-display.ts';
import { PotatnoPreviewFunctionExecutor } from '../../source/preview/potatno-preview-function-executor.ts';
import { PotatnoHelper } from '../helper/potatno-helper.ts';

const gNewExecutor = (): PotatnoPreviewFunctionExecutor<any, Record<string, unknown>, 'number'> => {
    return new PotatnoPreviewFunctionExecutor(PotatnoHelper.TestProject.entryPoint, {
        defaultParameters: {},
        types: ['number'],
        build: (): { execute: () => number; type: 'number' } => {
            return {
                type: 'number',
                execute: (): number => 1
            };
        }
    });
};

Deno.test('new PotatnoPreviewDisplay()', async (pContext) => {
    await pContext.step('Constructs and filters adapters to executor-supported types', () => {
        // Setup. Process.
        const lDisplay = new PotatnoPreviewDisplay(gNewExecutor(), {
            id: 'TestDisplay',
            name: 'Test Display',
            typeAdapter: {
                number: (pValue: unknown): unknown => pValue
            },
            generate: (): Element => {
                return { name: 'PreviewElement' } as unknown as Element;
            },
            update: (): void => { }
        });

        // Evaluation.
        expect(lDisplay.name).toBe('Test Display');
        expect(lDisplay.allowsType('number')).toBe(true);
        expect(lDisplay.allowsType('boolean')).toBe(false);
    });
});

Deno.test('PotatnoPreviewDisplay.executor', async (pContext) => {
    await pContext.step('Returns configured executor', () => {
        // Setup.
        const lExecutor = gNewExecutor();
        const lDisplay = new PotatnoPreviewDisplay(lExecutor, {
            id: 'TestDisplay',
            name: 'Test Display',
            typeAdapter: {
                number: (pValue: unknown): unknown => pValue
            },
            generate: (): Element => {
                return { name: 'PreviewElement' } as unknown as Element;
            },
            update: (): void => { }
        });

        // Process.
        const lResult = lDisplay.executor;

        // Evaluation.
        expect(lResult).toBe(lExecutor);
    });
});

Deno.test('PotatnoPreviewDisplay.id', async (pContext) => {
    await pContext.step('Returns display id combined with executor function id', () => {
        // Setup.
        const lDisplay = new PotatnoPreviewDisplay(gNewExecutor(), {
            id: 'TestDisplay',
            name: 'Test Display',
            typeAdapter: {
                number: (pValue: unknown): unknown => pValue
            },
            generate: (): Element => {
                return { name: 'PreviewElement' } as unknown as Element;
            },
            update: (): void => { }
        });

        // Process.
        const lResult: string = lDisplay.id;

        // Evaluation.
        expect(lResult).toBe(`TestDisplay-${PotatnoHelper.TestProject.entryPoint.id}`);
    });
});

Deno.test('PotatnoPreviewDisplay.name', async (pContext) => {
    await pContext.step('Returns configured name', () => {
        // Setup.
        const lDisplay = new PotatnoPreviewDisplay(gNewExecutor(), {
            id: 'TestDisplay',
            name: 'Test Display',
            typeAdapter: {
                number: (pValue: unknown): unknown => pValue
            },
            generate: (): Element => {
                return { name: 'PreviewElement' } as unknown as Element;
            },
            update: (): void => { }
        });

        // Process.
        const lResult: string = lDisplay.name;

        // Evaluation.
        expect(lResult).toBe('Test Display');
    });
});

Deno.test('PotatnoPreviewDisplay.adapterFor()', async (pContext) => {
    await pContext.step('Returns adapter for supported type', () => {
        // Setup.
        const lDisplay = new PotatnoPreviewDisplay(gNewExecutor(), {
            id: 'TestDisplay',
            name: 'Test Display',
            typeAdapter: {
                number: (pValue: unknown): string => `Value:${pValue}`
            },
            generate: (): Element => {
                return { name: 'PreviewElement' } as unknown as Element;
            },
            update: (): void => { }
        });

        // Process.
        const lResult = lDisplay.adapterFor('number');

        // Evaluation.
        expect(lResult(5)).toBe('Value:5');
    });

    await pContext.step('Error - Unsupported type', () => {
        // Setup.
        const lDisplay = new PotatnoPreviewDisplay(gNewExecutor(), {
            id: 'TestDisplay',
            name: 'Test Display',
            typeAdapter: {
                number: (pValue: unknown): unknown => pValue
            },
            generate: (): Element => {
                return { name: 'PreviewElement' } as unknown as Element;
            },
            update: (): void => { }
        });

        // Process.
        const lAction = (): void => {
            lDisplay.adapterFor('boolean');
        };

        // Evaluation.
        expect(lAction).toThrow('Display "TestDisplay" has no type adapter for type "boolean".');
    });
});

Deno.test('PotatnoPreviewDisplay.allowsType()', async (pContext) => {
    await pContext.step('Returns whether adapter exists', () => {
        // Setup.
        const lDisplay = new PotatnoPreviewDisplay(gNewExecutor(), {
            id: 'TestDisplay',
            name: 'Test Display',
            typeAdapter: {
                number: (pValue: unknown): unknown => pValue
            },
            generate: (): Element => {
                return { name: 'PreviewElement' } as unknown as Element;
            },
            update: (): void => { }
        });

        // Process.
        const lNumberResult: boolean = lDisplay.allowsType('number');
        const lBooleanResult: boolean = lDisplay.allowsType('boolean');

        // Evaluation.
        expect(lNumberResult).toBe(true);
        expect(lBooleanResult).toBe(false);
    });
});

Deno.test('PotatnoPreviewDisplay.createDriver()', async (pContext) => {
    await pContext.step('Creates driver bound to display', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDisplay = new PotatnoPreviewDisplay(gNewExecutor(), {
            id: 'TestDisplay',
            name: 'Test Display',
            typeAdapter: {
                number: (pValue: unknown): unknown => pValue
            },
            generate: (): Element => {
                return { name: 'PreviewElement' } as unknown as Element;
            },
            update: (): void => { }
        });

        // Process.
        const lResult = lDisplay.createDriver(lFunction);

        // Evaluation.
        expect(lResult.display).toBe(lDisplay);
    });
});

Deno.test('PotatnoPreviewDisplay.generate()', async (pContext) => {
    await pContext.step('Calls configured element factory', () => {
        // Setup.
        const lElement = { name: 'PreviewElement' } as unknown as Element;
        const lDisplay = new PotatnoPreviewDisplay(gNewExecutor(), {
            id: 'TestDisplay',
            name: 'Test Display',
            typeAdapter: {
                number: (pValue: unknown): unknown => pValue
            },
            generate: (): Element => {
                return lElement;
            },
            update: (): void => { }
        });

        // Process.
        const lResult = lDisplay.generate();

        // Evaluation.
        expect(lResult).toBe(lElement);
    });
});

Deno.test('PotatnoPreviewDisplay.update()', async (pContext) => {
    await pContext.step('Calls configured update callback', async () => {
        // Setup.
        const lElement = { name: 'PreviewElement' } as unknown as Element;
        let lCapturedElement: Element | null = null;
        let lCapturedValue: unknown = null;
        const lDisplay = new PotatnoPreviewDisplay(gNewExecutor(), {
            id: 'TestDisplay',
            name: 'Test Display',
            typeAdapter: {
                number: (pValue: unknown): unknown => pValue
            },
            generate: (): Element => {
                return lElement;
            },
            update: async (pElement, pExecutor): Promise<void> => {
                lCapturedElement = pElement;
                lCapturedValue = await pExecutor({});
            }
        });

        // Process.
        await lDisplay.update(lElement, async (): Promise<number> => 9);

        // Evaluation.
        expect(lCapturedElement).toBe(lElement);
        expect(lCapturedValue).toBe(9);
    });
});
