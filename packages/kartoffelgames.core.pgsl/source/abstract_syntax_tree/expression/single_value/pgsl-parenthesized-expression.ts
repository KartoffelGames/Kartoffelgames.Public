import { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import type { BasePgslSyntaxTreeMeta } from '../../abstract-syntax-tree.ts';
import { ExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL structure holding a expression surrounded with parentheses.
 */
export class PgslParenthesizedExpression extends ExpressionAst {
    private readonly mExpression: ExpressionAst;

    /**
     * Expression reference.
     */
    public get expression(): ExpressionAst {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pExpression - Inner expression.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pExpression: ExpressionAst, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mExpression = pExpression;

        // Add data as child tree.
        this.appendChild(this.mExpression);
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace {
        // Validate inner expression.
        this.mExpression.trace(pTrace);

        // Read attachment of inner expression.
        const lAttachment: PgslExpressionTrace = pTrace.getExpression(this.mExpression);

        return new PgslExpressionTrace({
            fixedState: lAttachment.fixedState,
            isStorage: lAttachment.isStorage,
            resolveType: lAttachment.resolveType,
            constantValue: lAttachment.constantValue,
            storageAddressSpace: lAttachment.storageAddressSpace
        });
    }
}