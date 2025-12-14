import { EnumUtil } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import type { BasePgslSyntaxTreeMeta } from '../../abstract-syntax-tree.ts';
import type { ExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { PgslStatement } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure holding a increment or decrement statement.
 */
export class PgslIncrementDecrementStatement extends PgslStatement {
    private readonly mExpression: ExpressionAst;
    private readonly mOperatorName: string;

    /**
     * Expression reference.
     */
    public get expression(): ExpressionAst {
        return this.mExpression;
    }

    /**
     * Operator name.
     */
    public get operatorName(): string {
        return this.mOperatorName;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pOperator: string, pExpression: ExpressionAst, pMeta: BasePgslSyntaxTreeMeta) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pMeta);

        // Set base data.
        this.mOperatorName = pOperator;
        this.mExpression = pExpression;

        // Add child trees.
        if (this.mExpression) {
            this.appendChild(this.mExpression);
        }
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     * 
     * @returns Attachment data.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Validate expression.
        this.mExpression.trace(pTrace);

        // Create list of all bit operations.
        const lIncrementDecrementOperatorList: Array<PgslOperator> = [
            PgslOperator.Increment,
            PgslOperator.Decrement
        ];

        // Try to parse operator and validate operator.
        const lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.mOperatorName);
        if (!lIncrementDecrementOperatorList.includes(lOperator!)) {
            pTrace.pushIncident(`Invalid increment or decrement operator "${this.mOperatorName}".`, this);
        }

        // Read trace of expression.
        const lExpressionTrace: PgslExpressionTrace = pTrace.getExpression(this.mExpression);

        // Must be a storage.
        if (!lExpressionTrace.isStorage) {
            pTrace.pushIncident('Increment or decrement expression must be applied to a storage expression', this);
        }

        // Shouldnt be a const value.
        if (lExpressionTrace.fixedState !== PgslValueFixedState.Variable) {
            pTrace.pushIncident(`Increment or decrement expression must be a variable`, this);
        }
    }
}