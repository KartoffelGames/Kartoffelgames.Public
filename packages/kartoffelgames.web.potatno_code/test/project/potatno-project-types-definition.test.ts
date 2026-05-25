import { expect } from '@kartoffelgames/core-test';
import { PotatnoProjectTypesDefinition } from '../../source/project/potatno-project-types-definition.ts';

const lSingleTypeConfig = {
    number: {
        default: { string: ['0'], value: 0 },
        convert: (pValues: Array<string>): string => pValues[0],
        inputs: [{ name: 'value', type: 'number' as const }]
    }
};

const lMultiTypeConfig = {
    number: {
        default: { string: ['0'], value: 0 },
        convert: (pValues: Array<string>): string => pValues[0],
        inputs: [{ name: 'value', type: 'number' as const }]
    },
    string: {
        default: { string: [''], value: '' },
        convert: (pValues: Array<string>): string => pValues[0],
        inputs: [{ name: 'value', type: 'string' as const }]
    },
    boolean: {
        default: { string: ['false'], value: false },
        convert: (pValues: Array<string>): string => pValues[0],
        inputs: [{ name: 'value', type: 'boolean' as const }]
    }
};

Deno.test('PotatnoProjectTypesDefinition.new()', async (pContext) => {
    await pContext.step('Construct with single type', () => {
        // Setup. Process.
        const lTypes = PotatnoProjectTypesDefinition.new(lSingleTypeConfig);

        // Evaluation.
        expect(lTypes).toBeDefined();
        expect(lTypes.types.size).toBe(1);
    });

    await pContext.step('Construct with multiple types', () => {
        // Setup. Process.
        const lTypes = PotatnoProjectTypesDefinition.new(lMultiTypeConfig);

        // Evaluation.
        expect(lTypes.types.size).toBe(3);
    });
});

Deno.test('PotatnoProjectTypesDefinition.types', async (pContext) => {
    await pContext.step('Returns a readonly map keyed by type name', () => {
        // Setup.
        const lTypes = PotatnoProjectTypesDefinition.new(lMultiTypeConfig);

        // Process.
        const lResult = lTypes.types;

        // Evaluation.
        expect(lResult.has('number')).toBe(true);
        expect(lResult.has('string')).toBe(true);
        expect(lResult.has('boolean')).toBe(true);
    });

    await pContext.step('Map size matches type count', () => {
        // Setup.
        const lTypes = PotatnoProjectTypesDefinition.new(lMultiTypeConfig);

        // Process.
        const lResult: number = lTypes.types.size;

        // Evaluation.
        expect(lResult).toBe(3);
    });
});

Deno.test('PotatnoProjectTypesDefinition.typeNames', async (pContext) => {
    await pContext.step('Returns the configured type names', () => {
        // Setup.
        const lTypes = PotatnoProjectTypesDefinition.new(lMultiTypeConfig);

        // Process.
        const lResult = lTypes.typeNames;

        // Evaluation.
        expect(lResult).toContain('number');
        expect(lResult).toContain('string');
        expect(lResult).toContain('boolean');
    });

    await pContext.step('Order matches insertion', () => {
        // Setup.
        const lTypes = PotatnoProjectTypesDefinition.new(lMultiTypeConfig);

        // Process.
        const lResult = lTypes.typeNames;

        // Evaluation.
        expect(lResult[0]).toBe('number');
        expect(lResult[1]).toBe('string');
        expect(lResult[2]).toBe('boolean');
    });
});

Deno.test('PotatnoProjectTypesDefinition.getType()', async (pContext) => {
    await pContext.step('Returns the definition for an existing type', () => {
        // Setup.
        const lTypes = PotatnoProjectTypesDefinition.new(lSingleTypeConfig);

        // Process.
        const lDefinition = lTypes.getType('number');

        // Evaluation.
        expect(lDefinition).toBeDefined();
    });

    await pContext.step('Type definition has a name field matching the lookup key', () => {
        // Setup.
        const lTypes = PotatnoProjectTypesDefinition.new(lMultiTypeConfig);

        // Process.
        const lDefinition = lTypes.getType('boolean');

        // Evaluation.
        expect(lDefinition.name).toBe('boolean');
    });
});

Deno.test('PotatnoProjectTypesDefinition.isGenericType()', async (pContext) => {
    await pContext.step('Returns true for <T>', () => {
        // Setup.
        const lTypes = PotatnoProjectTypesDefinition.new(lSingleTypeConfig);

        // Process.
        const lResult: boolean = lTypes.isGenericType('<T>');

        // Evaluation.
        expect(lResult).toBe(true);
    });

    await pContext.step('Returns true for <TValue>', () => {
        // Setup.
        const lTypes = PotatnoProjectTypesDefinition.new(lSingleTypeConfig);

        // Process.
        const lResult: boolean = lTypes.isGenericType('<TValue>');

        // Evaluation.
        expect(lResult).toBe(true);
    });

    await pContext.step('Returns false for plain identifier', () => {
        // Setup.
        const lTypes = PotatnoProjectTypesDefinition.new(lSingleTypeConfig);

        // Process.
        const lResult: boolean = lTypes.isGenericType('number');

        // Evaluation.
        expect(lResult).toBe(false);
    });

    await pContext.step('Returns false for empty string', () => {
        // Setup.
        const lTypes = PotatnoProjectTypesDefinition.new(lSingleTypeConfig);

        // Process.
        const lResult: boolean = lTypes.isGenericType('');

        // Evaluation.
        expect(lResult).toBe(false);
    });

    await pContext.step('Returns false for string with leading bracket but no closing', () => {
        // Setup.
        const lTypes = PotatnoProjectTypesDefinition.new(lSingleTypeConfig);

        // Process.
        const lResult: boolean = lTypes.isGenericType('<T');

        // Evaluation.
        expect(lResult).toBe(false);
    });

    await pContext.step('Returns false for string with only closing bracket', () => {
        // Setup.
        const lTypes = PotatnoProjectTypesDefinition.new(lSingleTypeConfig);

        // Process.
        const lResult: boolean = lTypes.isGenericType('T>');

        // Evaluation.
        expect(lResult).toBe(false);
    });
});

Deno.test('Error: PotatnoProjectTypesDefinition.getType() on unknown type', async (pContext) => {
    await pContext.step('Throws on lookup of unregistered type', () => {
        // Setup.
        const lTypes = PotatnoProjectTypesDefinition.new(lSingleTypeConfig);

        // Process.
        const lAction = (): void => {
            lTypes.getType('missing' as never);
        };

        // Evaluation.
        expect(lAction).toThrow('Type "missing" is not defined in the project types definition.');
    });
});
