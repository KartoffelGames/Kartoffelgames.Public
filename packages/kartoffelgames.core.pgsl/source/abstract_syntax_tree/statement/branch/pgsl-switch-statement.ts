import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import { PgslNumericType } from '../../../type/pgsl-numeric-type.ts';
import type { PgslType } from '../../../type/pgsl-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { PgslExpression } from '../../expression/pgsl-expression.ts';
import { PgslStatement } from '../pgsl-statement.ts';
import type { PgslBlockStatement } from '../execution/pgsl-block-statement.ts';

/**
 * PGSL structure for a switch statement with optional default block.
 */
export class PgslSwitchStatement extends PgslStatement {
    private readonly mCases: Array<PgslSwitchStatementSwitchCase>;
    private readonly mDefault: PgslBlockStatement;
    private readonly mExpression: PgslExpression;

    /**
     * Switch cases.
     */
    public get cases(): Array<PgslSwitchStatementSwitchCase> {
        return [...this.mCases];
    }

    /**
     * Default block.
     */
    public get default(): PgslBlockStatement {
        return this.mDefault;
    }

    /**
     * Switch boolean expression reference.
     */
    public get expression(): PgslExpression {
        return this.mExpression;
    }

    /**
     * Constructor.
     *
     * @param pMeta - Syntax tree meta data. 
     * @param pParameter - Construction parameter.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pParameter: PgslSwitchStatementSyntaxTreeConstructorParameter) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pMeta);

        // Set data.
        this.mCases = pParameter.cases;
        this.mExpression = pParameter.expression;
        this.mDefault = pParameter.default;

        // Add data as child tree.
        this.appendChild(this.mExpression);
        this.appendChild(this.mDefault);

        // Add each case as 
        for (const lCase of this.mCases) {
            this.appendChild(lCase.block, ...lCase.cases);
        }
    }

    /**
     * Trace data of current structure.
     * 
     * @param pTrace - Current trace context.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Trace expression.
        this.mExpression.trace(pTrace);

        // Read trace of expression.
        const lExpressionTrace: PgslExpressionTrace = pTrace.getExpression(this.mExpression);

        const lCastableIntoInteger = (pType: PgslType) => {
            return pType.isImplicitCastableInto(new PgslNumericType(pTrace, PgslNumericType.typeName.signedInteger)) || pType.isImplicitCastableInto(new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger));
        };

        // Expression resolve type must be a unsigned integer.
        if (!lCastableIntoInteger(lExpressionTrace.resolveType)) {
            pTrace.pushIncident('Switch expression must resolve into a unsigned integer.', this.mExpression);
        }

        const lSelectorValues: Set<number> = new Set<number>();

        // Validate each case.
        for (const lCase of this.mCases) {
            // Validate case block.
            lCase.block.trace(pTrace);

            // Validate any case value.
            for (const lCaseValue of lCase.cases) {
                // Validate case value.
                lCaseValue.trace(pTrace);

                // Read trace of case value.
                const lCaseValueTrace: PgslExpressionTrace = pTrace.getExpression(lCaseValue);

                // Check for duplicate case values.
                if (typeof lCaseValueTrace.constantValue === 'number') {
                    if (lSelectorValues.has(lCaseValueTrace.constantValue)) {
                        pTrace.pushIncident('Duplicate case value found.', lCaseValue);
                    }

                    lSelectorValues.add(lCaseValueTrace.constantValue);
                }

                // Must be number type.
                if (!lCastableIntoInteger(lCaseValueTrace.resolveType)) {
                    pTrace.pushIncident('Case expression must be of a unsigned integer type.', lCaseValue);
                }

                // Cases must be constant.
                if (lCaseValueTrace.fixedState !== PgslValueFixedState.Constant) {
                    pTrace.pushIncident('Case expression must be a constant.', lCaseValue);
                }
            }
        }

        // Trace default block.
        this.mDefault.trace(pTrace);
    }
}

export type PgslSwitchStatementSwitchCase = {
    readonly cases: Array<PgslExpression>,
    readonly block: PgslBlockStatement;
};

export type PgslSwitchStatementSyntaxTreeConstructorParameter = {
    expression: PgslExpression,
    cases: Array<PgslSwitchStatementSwitchCase>;
    default: PgslBlockStatement;
};