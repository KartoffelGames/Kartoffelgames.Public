import { EnumUtil } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../../abstract-syntax-tree.ts';
import { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import { PgslBooleanType } from '../../../type/pgsl-boolean-type.ts';
import { ExpressionAst } from '../i-expression-ast.interface.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';

/**
 * PGSL structure for a logical expression between two values.
 */
export class PgslLogicalExpression extends ExpressionAst {
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
     * Operator name reference.
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

        // Create list of all short circuit operations.
        const lShortCircuitOperationList: Array<PgslOperator> = [
            PgslOperator.ShortCircuitOr,
            PgslOperator.ShortCircuitAnd
        ];

        // Validate operator usable for logical expressions.
        if (!lShortCircuitOperationList.includes(lOperator as PgslOperator)) {
            pTrace.pushIncident(`Operator "${this.mOperatorName}" can not used for logical expressions.`, this);
        }

        // Read left and right expression attachments.
        const lLeftExpressionAttachment: PgslExpressionTrace = pTrace.getExpression(this.mLeftExpression);
        const lRightExpressionAttachment: PgslExpressionTrace = pTrace.getExpression(this.mRightExpression);

        // Validate left side type.
        if (!lLeftExpressionAttachment.resolveType.isImplicitCastableInto(new PgslBooleanType(pTrace))) {
            pTrace.pushIncident('Left side of logical expression needs to be a boolean', this);
        }

        // Validate right side type.
        if (!lRightExpressionAttachment.resolveType.isImplicitCastableInto(new PgslBooleanType(pTrace))) {
            pTrace.pushIncident('Right side of logical expression needs to be a boolean', this);
        }

        return new PgslExpressionTrace({
            fixedState: Math.min(lLeftExpressionAttachment.fixedState, lRightExpressionAttachment.fixedState),
            isStorage: false,
            resolveType: new PgslBooleanType(pTrace),
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        });
    }
}