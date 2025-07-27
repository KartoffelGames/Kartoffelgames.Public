import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import type { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree.ts';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeState } from '../base-pgsl-expression-syntax-tree.ts';

/**
 * PGSL structure holding a expression with a single value and a single unary operation.
 */
export class PgslUnaryExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
    private readonly mExpression: BasePgslExpressionSyntaxTree;
    private readonly mOperator: string;

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pExpression: BasePgslExpressionSyntaxTree, pOperator: string, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mExpression = pExpression;
        this.mOperator = pOperator;
    }

    /**
     * Transpile current expression to WGSL code.
     */
    protected override onTranspile(): string {
        // Transpile expression.
        const lExpression: string = this.mExpression.transpile();
        return `${this.mOperator}${lExpression}`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pTrace: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeState {
        // Validate child expression.
        this.mExpression.validate(pTrace);

        // Read attached value of expression.
        const lExpressionState: PgslExpressionSyntaxTreeState = pTrace.getAttachment(this.mExpression);

        // Type buffer for validating the processed types.
        let lValueType: BasePgslTypeDefinitionSyntaxTree;

        // Validate vectors differently.
        if (lExpressionState.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) {
            lValueType = lExpressionState.resolveType.innerType;
        } else {
            lValueType = lExpressionState.resolveType;
        }

        // Validate type for each.
        switch (this.mOperator) {
            case PgslOperator.BinaryNegate: {
                if (lValueType.baseType !== PgslBaseTypeName.Numberic) {
                    pTrace.pushError(`Binary negation only valid for numeric type.`, this.meta, this);
                }

                break;
            }
            case PgslOperator.Minus: {
                // TODO: Not unsigned int.
                if (lValueType.baseType !== PgslBaseTypeName.Numberic) {
                    pTrace.pushError(`Negation only valid for numeric or vector type.`, this.meta, this);
                }

                break;
            }
            case PgslOperator.Not: {
                if (lValueType.baseType !== PgslBaseTypeName.Boolean) {
                    pTrace.pushError(`Boolean negation only valid for boolean type.`, this.meta, this);
                }

                break;
            }
            default: {
                pTrace.pushError(`Unknown unary operator "${this.mOperator}".`, this.meta, this);
            }
        }

        // TODO: Resolved integer type changes when value is negative.
        return {
            fixedState: lExpressionState.fixedState,
            isStorage: false,
            resolveType: lExpressionState.resolveType,
        };
    }
}