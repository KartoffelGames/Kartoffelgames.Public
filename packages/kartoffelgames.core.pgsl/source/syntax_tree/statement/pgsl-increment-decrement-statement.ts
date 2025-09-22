import { EnumUtil } from '@kartoffelgames/core';
import { PgslOperator } from '../../enum/pgsl-operator.enum.ts';
import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../expression/base-pgsl-expression.ts';
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslStatement } from './base-pgsl-statement.ts';
import { PgslTranspilationTrace } from "../pgsl-tranpilation-trace.ts";

/**
 * PGSL structure holding a increment or decrement statement.
 */
export class PgslIncrementDecrementStatement extends BasePgslStatement<PgslIncrementDecrementStatementSyntaxTreeAttachmentData> {
    private readonly mExpression: BasePgslExpression;
    private readonly mOperatorName: string;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpression {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pOperator: string, pExpression: BasePgslExpression, pMeta: BasePgslSyntaxTreeMeta) {
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
     * Transpiles the statement to a string representation.
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(pTrace: PgslTranspilationTrace): string {
        // TODO: Maybe the semicolon should be handled differently. Loops like the for loop dont need them.
        return `${this.mExpression.transpile(pTrace)}${this.mOperatorName};`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pValidationTrace - Validation trace.
     * 
     * @returns Attachment data.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): PgslIncrementDecrementStatementSyntaxTreeAttachmentData {
        // Validate expression.
        this.mExpression.validate(pValidationTrace);

        // Create list of all bit operations.
        const lIncrementDecrementOperatorList: Array<PgslOperator> = [
            PgslOperator.Increment,
            PgslOperator.Decrement
        ];

        // Try to parse operator and validate operator.
        const lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.mOperatorName);
        if (!lIncrementDecrementOperatorList.includes(lOperator!)) {
            pValidationTrace.pushError(`Invalid increment or decrement operator "${this.mOperatorName}".`, this.meta, this);
        }

        // Read attachment of expression.
        const lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mExpression);

        // Must be a storage.
        if (!lExpressionAttachment.isStorage) {
            pValidationTrace.pushError('Increment or decrement expression must be applied to a storage expression', this.meta, this);
        }

        // Shouldnt be a const value.
        if (lExpressionAttachment.fixedState !== PgslValueFixedState.Variable) {
            pValidationTrace.pushError(`Increment or decrement expression must be a variable`, this.meta, this);
        }

        return {
            operator: lOperator ?? PgslOperator.Increment
        };
    }
}

type PgslIncrementDecrementStatementSyntaxTreeAttachmentData = {
    operator: PgslOperator;
};