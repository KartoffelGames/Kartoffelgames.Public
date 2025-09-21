import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import type { BasePgslTypeDefinitionSyntaxTree } from '../../type/base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/pgsl-vector-type-definition-syntax-tree.ts';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression-syntax-tree.ts';

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

        // Add data as child tree.
        this.appendChild(this.mExpression);
    }

    /**
     * Transpile current expression to WGSL code.
     * 
     * @returns WGSL code.
     */
    protected override onTranspile(): string {
        // Transpile expression.
        const lExpression: string = this.mExpression.transpile();
        return `${this.mOperator}${lExpression}`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pTrace: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Validate child expression.
        this.mExpression.validate(pTrace);

        // Read attached value of expression.
        const lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mExpression);

        // Type buffer for validating the processed types.
        let lValueType: BasePgslTypeDefinitionSyntaxTree;

        // Validate vectors differently.
        if (lExpressionAttachment.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) {  // TODO: Cant do this, as alias types could be vectors as well.
            lValueType = lExpressionAttachment.resolveType.innerType;
        } else {
            lValueType = lExpressionAttachment.resolveType;
        }

        // Read expression resolve type attachment.
        const lExpressionResolveTypeAttachment = pTrace.getAttachment(lValueType);

        // Validate type for each.
        switch (this.mOperator) {
            case PgslOperator.BinaryNegate: {
                if (lExpressionResolveTypeAttachment.baseType !== PgslBaseTypeName.Integer && lExpressionResolveTypeAttachment.baseType !== PgslBaseTypeName.Float) {
                    pTrace.pushError(`Binary negation only valid for numeric type.`, this.meta, this);
                }

                break;
            }
            case PgslOperator.Minus: {
                // TODO: Not unsigned int.
                if (lExpressionResolveTypeAttachment.baseType !== PgslBaseTypeName.Integer && lExpressionResolveTypeAttachment.baseType !== PgslBaseTypeName.Float) {
                    pTrace.pushError(`Negation only valid for numeric or vector type.`, this.meta, this);
                }

                break;
            }
            case PgslOperator.Not: {
                if (lExpressionResolveTypeAttachment.baseType !== PgslBaseTypeName.Boolean) {
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
            fixedState: lExpressionAttachment.fixedState,
            isStorage: false,
            resolveType: lExpressionAttachment.resolveType,
        };
    }
}