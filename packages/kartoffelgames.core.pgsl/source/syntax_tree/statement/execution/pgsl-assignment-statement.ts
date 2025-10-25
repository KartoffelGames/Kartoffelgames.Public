import { EnumUtil } from '@kartoffelgames/core';
import { PgslAssignment } from '../../../enum/pgsl-assignment.enum.ts';
import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import { PgslExpressionTrace } from "../../../trace/pgsl-expression-trace.ts";
import { PgslTrace } from "../../../trace/pgsl-trace.ts";
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { PgslExpression } from '../../expression/pgsl-expression.ts';
import { BasePgslStatement } from '../base-pgsl-statement.ts';

/**
 * PGSL structure holding a assignment statement.
 */
export class PgslAssignmentStatement extends BasePgslStatement {
    private readonly mAssignmentName: string;
    private readonly mExpression: PgslExpression;
    private readonly mVariable: PgslExpression;

    /**
     * Assignment name.
     */
    public get assignmentName(): string {
        return this.mAssignmentName;
    }

    /**
     * Expression reference.
     */
    public get expression(): PgslExpression {
        return this.mExpression;
    }

    /**
     * Expression reference.
     */
    public get variable(): PgslExpression {
        return this.mVariable;
    }

    /**
     * Constructor.
     * 
     * @param pParameter - Parameter.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pParameter: PgslAssignmentStatementSyntaxTreeConstructorParameter) {
        super(pMeta);

        // Set data.
        this.mAssignmentName = pParameter.assignment;
        this.mVariable = pParameter.variable;
        this.mExpression = pParameter.expression;

        // Set data as child trees.
        this.appendChild(this.mVariable, this.mExpression);
    }

    /**
     * Validate data of current structure.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Try to parse assignment.
        const lAssignment: PgslAssignment | undefined = EnumUtil.cast(PgslAssignment, this.mAssignmentName);
        if (!lAssignment) {
            pTrace.pushIncident(`Operation "${this.mAssignmentName}" can not used for assignment statements.`, this);
        }

        // Read variable attachments.
        const lVariableTrace: PgslExpressionTrace = pTrace.getExpression(this.mVariable);

        // Must be a storage.
        if (!lVariableTrace.isStorage) {
            pTrace.pushIncident('Assignment statement must be applied to a storage expression', this.mVariable);
        }

        // Validate that it is not a constant.
        if (lVariableTrace.fixedState !== PgslValueFixedState.Variable) {
            pTrace.pushIncident('Assignment statement must be applied to a variable', this.mVariable);
        }

        // Read expression attachments.
        const lExpressionTrace: PgslExpressionTrace = pTrace.getExpression(this.mExpression);

        // Validate that it has the same value.
        if (!lExpressionTrace.resolveType.isImplicitCastableInto(lVariableTrace.resolveType)) {
            pTrace.pushIncident(`Can't assign a different type to a variable`, this.mExpression);
        }
    }
}

export type PgslAssignmentStatementSyntaxTreeConstructorParameter = {
    assignment: string;
    variable: PgslExpression;
    expression: PgslExpression;
};