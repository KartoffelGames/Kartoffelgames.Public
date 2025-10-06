import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslFileMetaInformation } from "../../pgsl-build-result.ts";
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import type { BasePgslTypeDefinition } from '../../type/base-pgsl-type-definition.ts';
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { PgslVectorTypeDefinition } from '../../type/pgsl-vector-type-definition.ts';
import { PgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../pgsl-expression.ts';

/**
 * PGSL structure holding a expression with a single value and a single unary operation.
 */
export class PgslUnaryExpression extends PgslExpression {
    private readonly mExpression: PgslExpression;
    private readonly mOperator: string;

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pExpression: PgslExpression, pOperator: string, pMeta: BasePgslSyntaxTreeMeta) {
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
     * @param pTrace - Transpilation trace.
     * 
     * @returns WGSL code.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
        // Transpile expression.
        const lExpression: string = this.mExpression.transpile(pTrace);
        return `${this.mOperator}${lExpression}`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pTrace: PgslValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Validate child expression.
        this.mExpression.validate(pTrace);

        // Read attached value of expression.
        const lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mExpression);

        // Type buffer for validating the processed types.
        let lValueType: BasePgslTypeDefinition;

        // Validate vectors differently.
        if (lExpressionAttachment.resolveType instanceof PgslVectorTypeDefinition) {  // TODO: Cant do this, as alias types could be vectors as well.
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