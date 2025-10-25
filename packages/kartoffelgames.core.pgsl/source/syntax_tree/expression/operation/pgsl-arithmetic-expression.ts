import { EnumUtil } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueAddressSpace } from "../../../enum/pgsl-value-address-space.enum.ts";
import { PgslExpressionTrace } from "../../../trace/pgsl-expression-trace.ts";
import { PgslTrace } from "../../../trace/pgsl-trace.ts";
import { PgslNumericType } from "../../../type/pgsl-numeric-type.ts";
import { PgslVectorType } from "../../../type/pgsl-vector-type.ts";
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslExpression } from "../pgsl-expression.ts";

export class PgslArithmeticExpression extends PgslExpression {
    private readonly mLeftExpression: PgslExpression;
    private readonly mOperatorName: string;
    private readonly mRightExpression: PgslExpression;

    /**
     * Left expression reference.
     */
    public get leftExpression(): PgslExpression {
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
    public get rightExpression(): PgslExpression {
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
    public constructor(pLeft: PgslExpression, pOperator: string, pRight: PgslExpression, pMeta: BasePgslSyntaxTreeMeta) {
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

        // Create list of all arithmetic operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.Plus,
            PgslOperator.Minus,
            PgslOperator.Multiply,
            PgslOperator.Divide,
            PgslOperator.Modulo
        ];

        // Validate.
        if (!lComparisonList.includes(lOperator as PgslOperator)) {
            pTrace.pushIncident(`Operator "${this.mOperatorName}" can not used for arithmetic operations.`, this);
        }

        // Read left and right expression attachments.
        const lLeftExpressionTrace: PgslExpressionTrace = pTrace.getExpression(this.mLeftExpression);
        const lRightExpressionTrace: PgslExpressionTrace = pTrace.getExpression(this.mRightExpression);

        // TODO: Also matrix calculations :(
        // TODO: And Mixed vector calculation...

        // Left and right need to be same type or implicitly castable.
        if (!lRightExpressionTrace.resolveType.isImplicitCastableInto(lLeftExpressionTrace.resolveType)) {
            pTrace.pushIncident('Left and right side of arithmetic expression must be the same type.', this);
        }

        // Validate vector inner values. 
        if (lLeftExpressionTrace.resolveType instanceof PgslVectorType) {
            // Validate left side vector type. Right ist the same type.
            if (!(lLeftExpressionTrace.resolveType.innerType instanceof PgslNumericType)) {
                pTrace.pushIncident('Left and right side of arithmetic expression must be a numeric vector value', this);
            }
        } else {
            // Validate left side type. Right ist the same type.
            if (!(lLeftExpressionTrace.resolveType instanceof PgslNumericType)) {
                pTrace.pushIncident('Left and right side of arithmetic expression must be a numeric value', this);
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