import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { EnumUtil } from '../../source/util/enum-util.ts';

describe('EnumUtil', () => {
    describe('Static Method: cast', () => {
        it('-- Number Enum', () => {
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

        it('-- String Enum', () => {
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

        it('-- Mixed Enum', () => {
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

        it('-- Mixed Enum missing value', () => {
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

    describe('Static Method: exists', () => {
        it('-- Number Enum', () => {
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

        it('-- String Enum', () => {
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

        it('-- Mixed Enum', () => {
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

        it('-- Mixed Enum missing value', () => {
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

    describe('Static Method: namesOf', () => {
        it('-- Number Enum', () => {
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
            expect(lNameArray).toDeepEqual(['One', 'Two', 'Three', 'Five']);
        });

        it('-- String Enum', () => {
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
            expect(lNameArray).toDeepEqual(['One', 'Two', 'Three', 'Five']);
        });

        it('-- Mixed Enum', () => {
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
            expect(lNameArray).toDeepEqual(['One', 'Two', 'Three', 'Five']);
        });
    });

    describe('Static Method: valuesOf', () => {
        it('-- Number Enum', () => {
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
            expect(lValueArray).toDeepEqual([1, 2, 3, 5]);
        });

        it('-- String Enum', () => {
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
            expect(lValueArray).toDeepEqual(['one1', 'two2', 'three3', 'five5']);
        });

        it('-- Mixed Enum', () => {
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
            expect(lValueArray).toDeepEqual([1, 2, 'three3', 'five5']);
        });
    });
});