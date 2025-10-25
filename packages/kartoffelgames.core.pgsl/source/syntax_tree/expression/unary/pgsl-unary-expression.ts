import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import { PgslExpressionTrace } from "../../../trace/pgsl-expression-trace.ts";
import { PgslTrace } from "../../../trace/pgsl-trace.ts";
import { PgslBooleanType } from "../../../type/pgsl-boolean-type.ts";
import { PgslNumericType } from "../../../type/pgsl-numeric-type.ts";
import { PgslType } from "../../../type/pgsl-type.ts";
import { PgslVectorType } from "../../../type/pgsl-vector-type.ts";
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslExpression } from '../pgsl-expression.ts';

/**
 * PGSL structure holding a expression with a single value and a single unary operation.
 */
export class PgslUnaryExpression extends PgslExpression {
    private readonly mExpression: PgslExpression;
    private readonly mOperator: string;

    /**
     * Get expression.
     */
    public get expression(): PgslExpression {
        return this.mExpression;
    }

    /**
     * Get operator.
     */
    public get operator(): string {
        return this.mOperator;
    }

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
     * Validate data of current structure.
     */
    protected override onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace {
        // Validate child expression.
        this.mExpression.trace(pTrace);

        // Read attached value of expression.
        const lExpressionTrace: PgslExpressionTrace = pTrace.getExpression(this.mExpression);

        // Type buffer for validating the processed types.
        let lValueType: PgslType;

        // Validate vectors differently.
        if (lExpressionTrace.resolveType instanceof PgslVectorType) {
            lValueType = lExpressionTrace.resolveType.innerType;
        } else {
            lValueType = lExpressionTrace.resolveType;
        }

        const lCastableIntoNumeric = (pType: PgslType, pIncludeUnsigned: boolean, pIncludeFloat: boolean): boolean => {
            if (pIncludeFloat && pType.isImplicitCastableInto(new PgslNumericType(pTrace, PgslNumericType.typeName.float16))) {
                return true;
            }

            if (pIncludeFloat && pType.isImplicitCastableInto(new PgslNumericType(pTrace, PgslNumericType.typeName.float32))) {
                return true;
            }

            if (pType.isImplicitCastableInto(new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger))) {
                return true;
            }

            if (pIncludeUnsigned && pType.isImplicitCastableInto(new PgslNumericType(pTrace, PgslNumericType.typeName.signedInteger))) {
                return true;
            }

            return false;
        };

        let lResolveType: PgslType = lExpressionTrace.resolveType;

        // Validate type for each.
        switch (this.mOperator) {
            case PgslOperator.BinaryNegate: {
                if (lCastableIntoNumeric(lValueType, true, false)) {
                    pTrace.pushIncident(`Binary negation only valid for numeric type.`, this);
                }

                break;
            }
            case PgslOperator.Minus: {
                if (lCastableIntoNumeric(lValueType, false, true)) {
                    pTrace.pushIncident(`Negation only valid for numeric or vector type.`, this);
                    break;
                }

                // Convert an abstract integer into a signed integer.
                if (lResolveType instanceof PgslNumericType && lResolveType.numericTypeName === PgslNumericType.typeName.abstractInteger) {
                    lResolveType = new PgslNumericType(pTrace, PgslNumericType.typeName.signedInteger);
                }

                break;
            }
            case PgslOperator.Not: {
                if (!(lValueType instanceof PgslBooleanType)) {
                    pTrace.pushIncident(`Boolean negation only valid for boolean type.`, this);
                }

                break;
            }
            default: {
                pTrace.pushIncident(`Unknown unary operator "${this.mOperator}".`, this);
            }
        }

        // TODO: Resolved integer type changes when value is negative.

        return new PgslExpressionTrace({
            fixedState: PgslValueFixedState.Variable,
            isStorage: false,
            resolveType: lResolveType,
            constantValue: lExpressionTrace.constantValue,
            storageAddressSpace: lExpressionTrace.storageAddressSpace,
        });
    }
}