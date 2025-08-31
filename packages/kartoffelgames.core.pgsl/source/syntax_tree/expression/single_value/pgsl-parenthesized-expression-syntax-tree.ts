import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression-syntax-tree.ts';

/**
 * PGSL structure holding a expression surrounded with parentheses.
 */
export class PgslParenthesizedExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
    private readonly mExpression: BasePgslExpressionSyntaxTree;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pExpression - Inner expression.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pExpression: BasePgslExpressionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mExpression = pExpression;

        // Add data as child tree.
        this.appendChild(this.mExpression);
    }

    /**
     * Transpile current expression to WGSL code.
     */
    protected override onTranspile(): string {
        return `(${this.mExpression.transpile()})`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
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