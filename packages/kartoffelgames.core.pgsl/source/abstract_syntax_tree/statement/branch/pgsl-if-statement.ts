import type { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import { PgslBooleanType } from '../../../type/pgsl-boolean-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../../abstract-syntax-tree.ts';
import type { ExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { PgslStatement } from '../i-statement-ast.interface.ts';
import type { BlockStatementAst } from '../execution/block-statement-ast.ts';

/**
 * PGSL structure for a if statement with optional else block.
 */
export class PgslIfStatement extends PgslStatement {
    private readonly mBlock: BlockStatementAst;
    private readonly mElse: PgslIfStatement | BlockStatementAst | null;
    private readonly mExpression: ExpressionAst;

    /**
     * If block.
     */
    public get block(): BlockStatementAst {
        return this.mBlock;
    }

    /**
     * Else statement of if..
     */
    public get else(): PgslIfStatement | BlockStatementAst | null {
        return this.mElse;
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
     * @param pParameter - Parameters.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pParameter: PgslIfStatementSyntaxTreeConstructorParameter, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mExpression = pParameter.expression;
        this.mBlock = pParameter.block;
        this.mElse = pParameter.else;

        // Set data as child trees.
        this.appendChild(this.mExpression, this.mBlock);
        if (this.mElse) {
            this.appendChild(this.mElse);
        }
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected onTrace(pTrace: PgslTrace): void {
        // Validate expression.
        this.mExpression.trace(pTrace);

        // Validate block.
        this.mBlock.trace(pTrace);

        // Validate else block.
        if (this.mElse) {
            this.mElse.trace(pTrace);
        }

        // Read attachments of expression.
        const lExpressionAttachment: PgslExpressionTrace = pTrace.getExpression(this.mExpression);

        // Expression must be a boolean.
        if (!lExpressionAttachment.resolveType.isImplicitCastableInto(new PgslBooleanType(pTrace))) {
            pTrace.pushIncident('Expression of if must resolve into a boolean.', this.mExpression);
        }
    }
}

type PgslIfStatementSyntaxTreeConstructorParameter = {
    expression: ExpressionAst,
    block: BlockStatementAst;
    else: BlockStatementAst | PgslIfStatement | null;
};