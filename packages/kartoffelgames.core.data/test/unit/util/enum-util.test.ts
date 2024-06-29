import { expect } from 'chai';
import { EnumUtil } from '../../../source/util/enum-util';

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
            expect(lCastedValue).to.equal(TestEnum.Three);
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
            expect(lCastedValue).to.equal(TestEnum.Three);
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
            expect(lCastedValue).to.equal(TestEnum.Three);
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
            expect(lCastedValue).to.be.undefined;
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
            const lValueExists: boolean = EnumUtil.exists<TestEnum>(TestEnum, 3);

            // Evaluation.
            expect(lValueExists).to.be.true;
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
            const lValueExists: boolean = EnumUtil.exists<TestEnum>(TestEnum, 'three3');

            // Evaluation.
            expect(lValueExists).to.be.true;
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
            const lValueExists: boolean = EnumUtil.exists<TestEnum>(TestEnum, 'three3');

            // Evaluation.
            expect(lValueExists).to.be.true;
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
            const lValueExists: boolean = EnumUtil.exists<TestEnum>(TestEnum, 'NOT_THERE');

            // Evaluation.
            expect(lValueExists).to.be.false;
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
            const lNameArray: Array<keyof TestEnum> = EnumUtil.namesOf(TestEnum);

            // Evaluation.
            expect(lNameArray).to.be.deep.equal(['One', 'Two', 'Three', 'Five']);
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
            const lNameArray: Array<keyof TestEnum> = EnumUtil.namesOf(TestEnum);

            // Evaluation.
            expect(lNameArray).to.be.deep.equal(['One', 'Two', 'Three', 'Five']);
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
            const lNameArray: Array<keyof TestEnum> = EnumUtil.namesOf(TestEnum);

            // Evaluation.
            expect(lNameArray).to.be.deep.equal(['One', 'Two', 'Three', 'Five']);
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
            expect(lValueArray).to.be.deep.equal([1, 2, 3, 5]);
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
            expect(lValueArray).to.be.deep.equal(['one1', 'two2', 'three3', 'five5']);
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
            expect(lValueArray).to.be.deep.equal([1, 2, 'three3', 'five5']);
        });
    });
});