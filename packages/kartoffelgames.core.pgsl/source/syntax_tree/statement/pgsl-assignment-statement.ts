import { EnumUtil } from '@kartoffelgames/core';
import { PgslAssignment } from '../../enum/pgsl-assignment.enum.ts';
import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../expression/base-pgsl-expression.ts';
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslStatement } from './base-pgsl-statement.ts';

/**
 * PGSL structure holding a assignment statement.
 */
export class PgslAssignmentStatement extends BasePgslStatement {
    private readonly mAssignmentName: string;
    private readonly mExpression: BasePgslExpression;
    private readonly mVariable: BasePgslExpression;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpression {
        return this.mExpression;
    }

    /**
     * Expression reference.
     */
    public get variable(): BasePgslExpression {
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
     * Transpile the current structure to a string representation.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
      return `${this.mVariable.transpile()} ${this.mAssignmentName} ${this.mExpression.transpile()};`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): void {
        // Try to parse assignment.
        const lAssignment: PgslAssignment | undefined = EnumUtil.cast(PgslAssignment, this.mAssignmentName);
        if (!lAssignment) {
            pValidationTrace.pushError(`Operation "${this.mAssignmentName}" can not used for assignment statements.`, this.meta, this);
        }

        // Read variable attachments.
        const lVariableAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mVariable);

        // Must be a storage.
        if (!lVariableAttachment.isStorage) {
            pValidationTrace.pushError('Assignment statement must be applied to a storage expression', this.meta, this);
        }

        // Validate that it is not a constant.
        if (lVariableAttachment.fixedState !== PgslValueFixedState.Variable) {
            pValidationTrace.pushError('Assignment statement must be applied to a variable', this.meta, this);
        }

        // Read expression attachments.
        const lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mExpression);

        // Validate that it has the same value.
        if (!lExpressionAttachment.resolveType.isImplicitCastableInto(pValidationTrace, lVariableAttachment.resolveType)) {
            pValidationTrace.pushError(`Can't assign a different type to a variable`, this.meta, this);
        }
    }
}

type PgslAssignmentStatementSyntaxTreeSetupData = {
    assignment: PgslAssignment;
};

export type PgslAssignmentStatementSyntaxTreeConstructorParameter = {
    assignment: string;
    variable: BasePgslExpression;
    expression: BasePgslExpression;
};