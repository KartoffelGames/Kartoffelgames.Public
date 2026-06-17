import { expect } from '@kartoffelgames/core-test';
import type { PotatnoPreviewDisplay } from '../../source/preview/potatno-preview-display.ts';
import { PotatnoPreview, type PotatnoPreviewDisplayItem } from '../../source/preview/potatno-preview.ts';
import { PotatnoHelper } from '../helper/potatno-helper.ts';
import type { PotatnoTestProjectTypesDefinition } from '../helper/potatno_test_project/potatno-test-project-types-definition.ts';

const gNewDisplay = (pId: string, pFunctionId: string, pAllowedTypes: ReadonlyArray<string>): PotatnoPreviewDisplay<PotatnoTestProjectTypesDefinition, Element, any, any, any, any> => {
    return {
        id: pId,
        executor: {
            function: {
                id: pFunctionId
            }
        },
        allowsType: (pTypeName: string): boolean => pAllowedTypes.includes(pTypeName)
    } as unknown as PotatnoPreviewDisplay<PotatnoTestProjectTypesDefinition, Element, any, any, any, any>;
};

Deno.test('new PotatnoPreview()', async (pContext) => {
    await pContext.step('Constructs empty registry', () => {
        // Setup. Process.
        const lPreview = new PotatnoPreview<PotatnoTestProjectTypesDefinition>();

        // Evaluation.
        expect(lPreview.displayIds).toEqual([]);
    });
});

Deno.test('PotatnoPreview.displayIds', async (pContext) => {
    await pContext.step('Returns registered display ids', () => {
        // Setup.
        const lPreview = new PotatnoPreview<PotatnoTestProjectTypesDefinition>();
        lPreview.addDisplay(gNewDisplay('DisplayOne', PotatnoHelper.TEST_PROJECT.entryPoint.id, ['number']));
        lPreview.addDisplay(gNewDisplay('DisplayTwo', PotatnoHelper.TEST_PROJECT.entryPoint.id, ['boolean']));

        // Process.
        const lResult: Array<string> = lPreview.displayIds;

        // Evaluation.
        expect(lResult).toEqual(['DisplayOne', 'DisplayTwo']);
    });
});

Deno.test('PotatnoPreview.addDisplay()', async (pContext) => {
    await pContext.step('Registers display by id', () => {
        // Setup.
        const lPreview = new PotatnoPreview<PotatnoTestProjectTypesDefinition>();
        const lDisplay = gNewDisplay('DisplayOne', PotatnoHelper.TEST_PROJECT.entryPoint.id, ['number']);

        // Process.
        lPreview.addDisplay(lDisplay);

        // Evaluation.
        expect(lPreview.getDisplay('DisplayOne')).toBe(lDisplay);
    });
});

Deno.test('PotatnoPreview.availableDisplays()', async (pContext) => {
    await pContext.step('Returns displays for matching function', () => {
        // Setup.
        const lPreview = new PotatnoPreview<PotatnoTestProjectTypesDefinition>();
        lPreview.addDisplay(gNewDisplay('DisplayOne', PotatnoHelper.TEST_PROJECT.entryPoint.id, ['number']));
        lPreview.addDisplay(gNewDisplay('DisplayTwo', 'OtherFunction', ['number']));

        // Process.
        const lResult: Array<string> = lPreview.availableDisplays(PotatnoHelper.TEST_PROJECT.entryPoint);

        // Evaluation.
        expect(lResult).toEqual(['DisplayOne']);
    });

    await pContext.step('Filters by allowed type', () => {
        // Setup.
        const lPreview = new PotatnoPreview<PotatnoTestProjectTypesDefinition>();
        lPreview.addDisplay(gNewDisplay('DisplayOne', PotatnoHelper.TEST_PROJECT.entryPoint.id, ['number']));
        lPreview.addDisplay(gNewDisplay('DisplayTwo', PotatnoHelper.TEST_PROJECT.entryPoint.id, ['boolean']));

        // Process.
        const lResult: Array<string> = lPreview.availableDisplays(PotatnoHelper.TEST_PROJECT.entryPoint, 'boolean');

        // Evaluation.
        expect(lResult).toEqual(['DisplayTwo']);
    });
});

Deno.test('PotatnoPreview.getDisplay()', async (pContext) => {
    await pContext.step('Returns display for registered id', () => {
        // Setup.
        const lPreview = new PotatnoPreview<PotatnoTestProjectTypesDefinition>();
        const lDisplay = gNewDisplay('DisplayOne', PotatnoHelper.TEST_PROJECT.entryPoint.id, ['number']);
        lPreview.addDisplay(lDisplay);

        // Process.
        const lResult: PotatnoPreviewDisplayItem<PotatnoTestProjectTypesDefinition> | null = lPreview.getDisplay('DisplayOne');

        // Evaluation.
        expect(lResult).toBe(lDisplay);
    });

    await pContext.step('Returns null for unknown id', () => {
        // Setup.
        const lPreview = new PotatnoPreview<PotatnoTestProjectTypesDefinition>();

        // Process.
        const lResult: PotatnoPreviewDisplayItem<PotatnoTestProjectTypesDefinition> | null = lPreview.getDisplay('MissingDisplay');

        // Evaluation.
        expect(lResult).toBeNull();
    });
});
