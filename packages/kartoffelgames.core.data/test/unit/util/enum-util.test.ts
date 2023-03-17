import { expect } from 'chai';
import { EnumUtil } from '../../../source/util/enum-util';

describe('EnumUtil', () => {
    it('Static Method: enumNamesToArray', () => {
        // Setup.
        enum TestEnum {
            One = 1,
            Two = 2,
            Three = '3',
            Five = '5',
        }

        // Process.
        const lNameArray: Array<string> = EnumUtil.enumNamesToArray(TestEnum);

        // Evaluation.
        expect(lNameArray).to.be.deep.equal(['One', 'Two', 'Three', 'Five']);
    });

    it('Static Method: enumValuesToArray', () => {
        // Setup.
        enum TestEnum {
            One = 1,
            Two = 2,
            Three = '3',
            Five = '5',
        }

        // Process.
        const lValueArray: Array<string> = EnumUtil.enumValuesToArray(TestEnum);

        // Evaluation.
        expect(lValueArray).to.be.deep.equal([1, 2, '3', '5']);
    });

    describe('Static Method: enumValueExists', () => {
        it('-- Exists', () => {
            // Setup.
            enum TestEnum {
                One = 1,
                Two = 2,
                Three = '3',
                Five = '5',
            }

            // Process.
            const lExists: boolean = EnumUtil.enumValueExists(TestEnum, 2);

            // Evaluation.
            expect(lExists).to.be.true;
        });

        it('-- Not Exists', () => {
            // Setup.
            enum TestEnum {
                One = 1,
                Two = 2,
                Three = '3',
                Five = '5',
            }

            // Process.
            const lExists: boolean = EnumUtil.enumValueExists(TestEnum, 'Not__Exists');

            // Evaluation.
            expect(lExists).to.be.false;
        });
    });

    describe('Static Method: enumKeyByValue', () => {
        it('-- Exists', () => {
            // Setup.
            enum TestEnum {
                One = 1,
                Two = 2,
                Three = '3',
                Five = '5',
            }

            // Process.
            const lEnum: TestEnum | undefined = EnumUtil.enumKeyByValue(TestEnum, 2);

            // Evaluation.
            expect(lEnum).to.equal(TestEnum.Two);
        });

        it('-- Not Exists', () => {
            // Setup.
            enum TestEnum {
                One = 1,
                Two = 2,
                Three = '3',
                Five = '5',
            }

            // Process.
            const lEnum: TestEnum | undefined = EnumUtil.enumKeyByValue(TestEnum, 'Not__Exists');

            // Evaluation.
            expect(lEnum).to.be.undefined;
        });
    });
});