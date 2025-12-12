import type { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import { PgslBooleanType } from '../../../type/pgsl-boolean-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../../abstract-syntax-tree.ts';
import type { ExpressionAst } from '../../expression/pgsl-expression.ts';
import { PgslStatement } from '../pgsl-statement.ts';
import type { PgslBlockStatement } from '../execution/pgsl-block-statement.ts';

/**
 * PGSL structure for a do while statement.
 */
export class PgslDoWhileStatement extends PgslStatement {
    private readonly mBlock: PgslBlockStatement;
    private readonly mExpression: ExpressionAst;

    /**
     * If block.
     */
    public get block(): PgslBlockStatement {
        return this.mBlock;
    }

    /**
     * If boolean expression reference.
     */
    public get expression(): ExpressionAst {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pExpression - Boolean expression.
     * @param pBlock - Looped block.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pExpression: ExpressionAst, pBlock: PgslBlockStatement, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mExpression = pExpression;
        this.mBlock = pBlock;

        // Add data as child tree.
        this.appendChild(this.mExpression, this.mBlock);
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected onTrace(pTrace: PgslTrace): void {
        // Validate expression.
        this.mExpression.trace(pTrace);

        // Trace block in own loop scope.
        pTrace.newScope('loop', () => {
            this.mBlock.trace(pTrace);
        }, this);

        // Read attachments of expression.
        const lExpressionAttachment: PgslExpressionTrace = pTrace.getExpression(this.mExpression);

        // Expression must be a boolean.
        if (!lExpressionAttachment.resolveType.isImplicitCastableInto(new PgslBooleanType(pTrace))) {
            pTrace.pushIncident('Expression of do-while loops must resolve into a boolean.', this.mExpression);
        }
    }
}