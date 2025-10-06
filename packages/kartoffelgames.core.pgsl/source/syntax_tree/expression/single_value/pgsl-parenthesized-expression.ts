import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslFileMetaInformation } from "../../pgsl-build-result.ts";
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { PgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../pgsl-expression.ts';

/**
 * PGSL structure holding a expression surrounded with parentheses.
 */
export class PgslParenthesizedExpression extends PgslExpression {
    private readonly mExpression: PgslExpression;

    /**
     * Expression reference.
     */
    public get expression(): PgslExpression {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pExpression - Inner expression.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pExpression: PgslExpression, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mExpression = pExpression;

        // Add data as child tree.
        this.appendChild(this.mExpression);
    }

    /**
     * Transpile current expression to WGSL code.
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns WGSL code of current expression.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
        return `(${this.mExpression.transpile(pTrace)})`;
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