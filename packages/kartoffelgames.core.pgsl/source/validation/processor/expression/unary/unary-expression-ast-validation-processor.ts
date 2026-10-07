import { UnaryExpressionAst, type UnaryExpressionAstData } from '../../../../abstract_syntax_tree/expression/unary/unary-expression-ast.ts';
import { type BasePgslType, BasePgslTypeKind } from '../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslOperator } from '../../../../enum/pgsl-operator.enum.ts';
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
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: UnaryExpressionAstData): void {
        // Validate expression.
        this.validateAst(pData.expression);

        const lCastableIntoType = (pType: BasePgslType, ...pAllowedKinds: Array<BasePgslTypeKind>): boolean => {
            for (const lTypeKind of pAllowedKinds) {
                if (pType.isKind(lTypeKind)) {
                    return true;
                }
            }

            return false;
        };

        // Validate that the operator is one of ~, - and !.
        // And validate value is correct type.
        switch (pData.operator) {
            case PgslOperator.BinaryNegate: {
                if (!lCastableIntoType(pData.itemType, BasePgslTypeKind.Integer)) {
                    this.pushIncident(`Binary negation only valid for integer type.`);
                }

                break;
            }
            case PgslOperator.Minus: {
                if (!lCastableIntoType(pData.itemType, BasePgslTypeKind.Float, BasePgslTypeKind.SignedInteger, BasePgslTypeKind.Abstract | BasePgslTypeKind.Integer)) {
                    this.pushIncident(`Negation only valid for signed numeric or vector type.`);
                }

                break;
            }
            case PgslOperator.Not: {
                if (!lCastableIntoType(pData.itemType, BasePgslTypeKind.Boolean)) {
                    this.pushIncident(`Boolean negation only valid for boolean type.`);
                }

                break;
            }
            default: {
                this.pushIncident(`Unknown unary operator "${pData.operator}".`);
            }
        }
    }
}
