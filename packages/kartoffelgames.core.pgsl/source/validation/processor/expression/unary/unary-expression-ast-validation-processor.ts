import { UnaryExpressionAst } from '../../../../abstract_syntax_tree/expression/unary/unary-expression-ast.ts';
import { BasePgslType, BasePgslTypeKind } from "../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts";
import { PgslOperator } from "../../../../enum/pgsl-operator.enum.ts";
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of UnaryExpressionAst.
 */
export class UnaryExpressionAstValidationProcessor extends PgslValidatorProcessor<UnaryExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof UnaryExpressionAst {
        return UnaryExpressionAst;
    }

    /**
     * Validates the PGSL unary expression syntax tree.
     * 
     * @param pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(pInstance: UnaryExpressionAst): void {
        // Validate expression.
        this.validateAst(pInstance.data.expression);

        const lCastableIntoNumeric = (pType: BasePgslType, pIncludeUnsigned: boolean, pIncludeFloat: boolean): boolean => {
            if (pIncludeFloat && pType.isKind(BasePgslTypeKind.Float)) {
                return true;
            }

            if (pType.isKind(BasePgslTypeKind.SignedInteger)) {
                return true;
            }

            if (pIncludeUnsigned && pType.isKind(BasePgslTypeKind.UnsignedInteger)) {
                return true;
            }

            return false;
        };

        // Validate that the operator is one of ~, - and !.
        // And validate value is correct type.
        switch (pInstance.data.operator) {
            case PgslOperator.BinaryNegate: {
                if (!lCastableIntoNumeric(pInstance.data.itemValue, true, false)) {
                    this.pushIncident(`Binary negation only valid for integer type.`);
                }

                break;
            }
            case PgslOperator.Minus: {
                // TODO: This shit should block unsigned ints, but does not.
                if (!lCastableIntoNumeric(pInstance.data.itemValue, true, true)) {
                    this.pushIncident(`Negation only valid for numeric or vector type.`);
                }

                break;
            }
            case PgslOperator.Not: {
                if (!pInstance.data.itemValue.isKind(BasePgslTypeKind.Boolean)) {
                    this.pushIncident(`Boolean negation only valid for boolean type.`);
                }

                break;
            }
            default: {
                this.pushIncident(`Unknown unary operator "${pInstance.data.operator}".`);
            }
        }

        // TODO: Report "Unary operation <operator> not supported for <operand type>." once when the result type is poison while the operand type is not poison and the operator is valid (~ on an operand that converts to no int, uint or Vector of them, - on an operand that converts to no int, float, float16 or Vector of them, so never on a uint or a Vector of uint, ! on an operand that is no bool or Vector of bool).
    }
}
