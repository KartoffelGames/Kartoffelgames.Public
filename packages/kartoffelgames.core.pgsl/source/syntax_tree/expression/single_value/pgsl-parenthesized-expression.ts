import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression.ts';

/**
 * PGSL structure holding a expression surrounded with parentheses.
 */
export class PgslParenthesizedExpression extends BasePgslExpression {
    private readonly mExpression: BasePgslExpression;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpression {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pExpression - Inner expression.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pExpression: BasePgslExpression, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mExpression = pExpression;

        // Add data as child tree.
        this.appendChild(this.mExpression);
    }

    /**
     * Transpile current expression to WGSL code.
     * 
     * @returns WGSL code of current expression.
     */
    protected override onTranspile(): string {
        return `(${this.mExpression.transpile()})`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Validate inner expression.
        this.mExpression.validate(pTrace);

        // Read attachment of inner expression.
        const lAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mExpression);

        return {
            fixedState: lAttachment.fixedState,
            isStorage: false,
            resolveType: lAttachment.resolveType
        };
    }
}