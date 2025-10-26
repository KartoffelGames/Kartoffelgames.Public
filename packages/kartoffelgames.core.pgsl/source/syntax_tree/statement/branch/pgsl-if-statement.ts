import type { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import { PgslBooleanType } from '../../../type/pgsl-boolean-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { PgslExpression } from '../../expression/pgsl-expression.ts';
import { BasePgslStatement } from '../base-pgsl-statement.ts';
import type { PgslBlockStatement } from '../execution/pgsl-block-statement.ts';

/**
 * PGSL structure for a if statement with optional else block.
 */
export class PgslIfStatement extends BasePgslStatement {
    private readonly mBlock: PgslBlockStatement;
    private readonly mElse: PgslIfStatement | PgslBlockStatement | null;
    private readonly mExpression: PgslExpression;

    /**
     * If block.
     */
    public get block(): PgslBlockStatement {
        return this.mBlock;
    }

    /**
     * Else statement of if..
     */
    public get else(): PgslIfStatement | PgslBlockStatement | null {
        return this.mElse;
    }

    /**
     * If boolean expression reference.
     */
    public get expression(): PgslExpression {
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
    expression: PgslExpression,
    block: PgslBlockStatement;
    else: PgslBlockStatement | PgslIfStatement | null;
};