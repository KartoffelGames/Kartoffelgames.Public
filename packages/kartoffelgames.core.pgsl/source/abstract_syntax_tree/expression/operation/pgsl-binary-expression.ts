import { EnumUtil } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import { PgslNumericType } from '../../../type/pgsl-numeric-type.ts';
import type { PgslType } from '../../../type/pgsl-type.ts';
import { PgslVectorType } from '../../../type/pgsl-vector-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../../abstract-syntax-tree.ts';
import { ExpressionAst } from '../i-expression-ast.interface.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';

export class PgslBinaryExpression extends ExpressionAst {
    private readonly mLeftExpression: ExpressionAst;
    private readonly mOperatorName: string;
    private readonly mRightExpression: ExpressionAst;

    /**
     * Left expression reference.
     */
    public get leftExpression(): ExpressionAst {
        return this.mLeftExpression;
    }

    /**
     * Operator name.
     */
    public get operatorName(): string {
        return this.mOperatorName;
    }

    /**
     * Right expression reference.
     */
    public get rightExpression(): ExpressionAst {
        return this.mRightExpression;
    }

    /**
     * Constructor.
     * 
     * @param pLeft - Left expression.
     * @param pOperator - Operator.
     * @param pRight - Right expression.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pLeft: ExpressionAst, pOperator: string, pRight: ExpressionAst, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        super(pMeta);

        // Set data.
        this.mLeftExpression = pLeft;
        this.mOperatorName = pOperator;
        this.mRightExpression = pRight;

        // Add data as child tree.
        this.appendChild(this.mLeftExpression, this.mRightExpression);
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace {
        // Validate left and right expressions.
        this.mLeftExpression.trace(pTrace);
        this.mRightExpression.trace(pTrace);

        // Try to convert operator.
        const lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.mOperatorName);

        // Create list of all bit operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.BinaryOr,
            PgslOperator.BinaryAnd,
            PgslOperator.BinaryXor,
            PgslOperator.ShiftLeft,
            PgslOperator.ShiftRight
        ];

        // Validate operator usable for bit operations.
        if (!lComparisonList.includes(lOperator as PgslOperator)) {
            pTrace.pushIncident(`Operator "${this.mOperatorName}" can not used for bit operations.`, this);
        }

        // Read left and right expression traces.
        const lLeftExpressionTrace: PgslExpressionTrace = pTrace.getExpression(this.mLeftExpression);
        const lRightExpressionTrace: PgslExpressionTrace = pTrace.getExpression(this.mRightExpression);

        // Type buffer for validating the processed types.
        let lLeftValueType: PgslType;
        let lRightValueType: PgslType;

        // Validate vectors differently.
        if (lLeftExpressionTrace.resolveType instanceof PgslVectorType) {
            lLeftValueType = lLeftExpressionTrace.resolveType.innerType;

            // Left and right must be a vector.
            if (lRightExpressionTrace.resolveType instanceof PgslVectorType) {
                lRightValueType = lRightExpressionTrace.resolveType.innerType;

                // Validate that both vectors are of same size.
                if (lLeftExpressionTrace.resolveType.dimension !== lRightExpressionTrace.resolveType.dimension) {
                    pTrace.pushIncident('Left and right side of bit expression must be of the same vector size.', this);
                }
            } else {
                pTrace.pushIncident('Left and right side of bit expression must be the a vector type.', this);
                lRightValueType = lRightExpressionTrace.resolveType;
            }
        } else {
            // Expression types are the processed types.
            lLeftValueType = lLeftExpressionTrace.resolveType;
            lRightValueType = lRightExpressionTrace.resolveType;
        }

        const lUnsignedInteger: PgslNumericType = new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger);
        const lSignedInteger: PgslNumericType = new PgslNumericType(pTrace, PgslNumericType.typeName.signedInteger);

        // Left value need to be a integer numeric.
        if (!lLeftValueType.isImplicitCastableInto(lUnsignedInteger) && !lLeftValueType.isImplicitCastableInto(lSignedInteger)) {
            pTrace.pushIncident(`Binary operations can only be applied to integer types.`, this.mLeftExpression);
        }
        if (!lRightValueType.isImplicitCastableInto(lUnsignedInteger) && !lRightValueType.isImplicitCastableInto(lSignedInteger)) {
            pTrace.pushIncident(`Binary operations can only be applied to integer types.`, this.mRightExpression);
        }

        // Validate that right expression of shift operator needs to be a signed integer.
        if (lOperator === PgslOperator.ShiftLeft || lOperator === PgslOperator.ShiftRight) {
            // Left must be variable.
            if (!lLeftExpressionTrace.isStorage) {
                pTrace.pushIncident(`Left expression of a shift operation must be a variable that can store a value.`, this.mLeftExpression);
            }

            // Right must be assignable to unsigned integer.
            if (!lRightValueType.isImplicitCastableInto(lUnsignedInteger)) {
                pTrace.pushIncident(`Right expression of a shift operation must be an unsigned integer type.`, this.mRightExpression);
            }
        }

        return new PgslExpressionTrace({
            fixedState: Math.min(lLeftExpressionTrace.fixedState, lRightExpressionTrace.fixedState),
            isStorage: false,
            resolveType: lLeftExpressionTrace.resolveType,
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        });
    }
}