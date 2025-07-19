import { expect } from '@kartoffelgames/core-test';
import { EnumUtil } from '../../source/util/enum-util.ts';

Deno.test('EnumUtil.cast()', async (pContext) => {
    await pContext.step('Number Enum', () => {
        // Setup.
        enum TestEnum {
            One = 1,
            Two = 2,
            Three = 3,
            Five = 5
        }

        // Process.
        const lCastedValue: TestEnum | undefined = EnumUtil.cast(TestEnum, 3);

        // Evaluation.
        expect(lCastedValue).toBe(TestEnum.Three);
    });

    await pContext.step('String Enum', () => {
        // Setup.
        enum TestEnum {
            One = 'one1',
            Two = 'two2',
            Three = 'three3',
            Five = 'five5',
        }

        // Process.
        const lCastedValue: TestEnum | undefined = EnumUtil.cast(TestEnum, 'three3');

        // Evaluation.
        expect(lCastedValue).toBe(TestEnum.Three);
    });

    await pContext.step('Mixed Enum', () => {
        // Setup.
        enum TestEnum {
            One = 1,
            Two = 2,
            Three = 'three3',
            Five = 'five5',
        }

        // Process.
        const lCastedValue: TestEnum | undefined = EnumUtil.cast(TestEnum, 'three3');

        // Evaluation.
        expect(lCastedValue).toBe(TestEnum.Three);
    });

    await pContext.step('Mixed Enum missing value', () => {
        // Setup.
        enum TestEnum {
            One = 1,
            Two = 2,
            Three = 'three3',
            Five = 'five5',
        }

        // Process.
        const lCastedValue: TestEnum | undefined = EnumUtil.cast(TestEnum, 'NOT_THERE');

        // Evaluation.
        expect(lCastedValue).toBeUndefined();
    });
});

Deno.test('EnumUtil.exists()', async (pContext) => {
    await pContext.step('Number Enum', () => {
        // Setup.
        enum TestEnum {
            One = 1,
            Two = 2,
            Three = 3,
            Five = 5
        }

        // Process.
        const lValueExists: boolean = EnumUtil.exists(TestEnum, 3);

        // Evaluation.
        expect(lValueExists).toBeTruthy();
    });

    await pContext.step('String Enum', () => {
        // Setup.
        enum TestEnum {
            One = 'one1',
            Two = 'two2',
            Three = 'three3',
            Five = 'five5',
        }

        // Process.
        const lValueExists: boolean = EnumUtil.exists(TestEnum, 'three3');

        // Evaluation.
        expect(lValueExists).toBeTruthy();
    });

    await pContext.step('Mixed Enum', () => {
        // Setup.
        enum TestEnum {
            One = 1,
            Two = 2,
            Three = 'three3',
            Five = 'five5',
        }

        // Process.
        const lValueExists: boolean = EnumUtil.exists(TestEnum, 'three3');

        // Evaluation.
        expect(lValueExists).toBeTruthy();
    });

    await pContext.step('Mixed Enum missing value', () => {
        // Setup.
        enum TestEnum {
            One = 1,
            Two = 2,
            Three = 'three3',
            Five = 'five5',
        }

        // Process.
        const lValueExists: boolean = EnumUtil.exists(TestEnum, 'NOT_THERE');

        // Evaluation.
        expect(lValueExists).toBeFalsy();
    });
});

Deno.test('EnumUtil.namesOf()', async (pContext) => {
    await pContext.step('should return names of Number Enum', () => {
        // Setup.
        enum TestEnum {
            One = 1,
            Two = 2,
            Three = 3,
            Five = 5,
        }

        // Process.
        const lNameArray: Array<keyof typeof TestEnum> = EnumUtil.namesOf(TestEnum);

        // Evaluation.
        expect(lNameArray).toBeDeepEqual(['One', 'Two', 'Three', 'Five']);
    });

    await pContext.step('should return names of String Enum', () => {
        // Setup.
        enum TestEnum {
            One = 'one1',
            Two = 'two2',
            Three = 'three3',
            Five = 'five5',
        }

        // Process.
        const lNameArray: Array<keyof typeof TestEnum> = EnumUtil.namesOf(TestEnum);

        // Evaluation.
        expect(lNameArray).toBeDeepEqual(['One', 'Two', 'Three', 'Five']);
    });

    await pContext.step('should return names of Mixed Enum', () => {
        // Setup.
        enum TestEnum {
            One = 1,
            Two = 2,
            Three = 'three3',
            Five = 'five5',
        }

        // Process.
        const lNameArray: Array<keyof typeof TestEnum> = EnumUtil.namesOf(TestEnum);

        // Evaluation.
        expect(lNameArray).toBeDeepEqual(['One', 'Two', 'Three', 'Five']);
    });
});

Deno.test('EnumUtil.valuesOf()', async (pContext) => {
    await pContext.step('should return values of Number Enum', () => {
        // Setup.
        enum TestEnum {
            One = 1,
            Two = 2,
            Three = 3,
            Five = 5
        }

        // Process.
        const lValueArray: Array<TestEnum> = EnumUtil.valuesOf(TestEnum);

        // Evaluation.
        expect(lValueArray).toBeDeepEqual([1, 2, 3, 5]);
    });

    await pContext.step('should return values of String Enum', () => {
        // Setup.
        enum TestEnum {
            One = 'one1',
            Two = 'two2',
            Three = 'three3',
            Five = 'five5',
        }

        // Process.
        const lValueArray: Array<TestEnum> = EnumUtil.valuesOf(TestEnum);

        // Evaluation.
        expect(lValueArray).toBeDeepEqual(['one1', 'two2', 'three3', 'five5']);
    });

    await pContext.step('should return values of Mixed Enum', () => {
        // Setup.
        enum TestEnum {
            One = 1,
            Two = 2,
            Three = 'three3',
            Five = 'five5',
        }

        // Process.
        const lValueArray: Array<TestEnum> = EnumUtil.valuesOf(TestEnum);

        // Evaluation.
        expect(lValueArray).toBeDeepEqual([1, 2, 'three3', 'five5']);
    });
});