import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree';
import { PgslBlockStatementSyntaxTree } from '../pgsl-block-statement-syntax-tree';

/**
 * PGSL structure for a if statement with optional else block.
 */
export class PgslIfStatementSyntaxTree extends BasePgslStatementSyntaxTree {
    private readonly mBlock: PgslBlockStatementSyntaxTree;
    private readonly mElse: PgslIfStatementSyntaxTree | PgslBlockStatementSyntaxTree | null;
    private readonly mExpression: BasePgslExpressionSyntaxTree;

    /**
     * If block.
     */
    public get block(): PgslBlockStatementSyntaxTree {
        return this.mBlock;
    }

    /**
     * Else statement of if..
     */
    public get else(): PgslIfStatementSyntaxTree | PgslBlockStatementSyntaxTree | null {
        return this.mElse;
    }

    /**
     * If boolean expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pParameter - Parameters.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pParameter: PgslIfStatementSyntaxTreeConstructorParameter, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta, false);

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
     */
    protected override onValidateIntegrity(): void {
        // Expression must be a boolean.
        if (this.mExpression.resolveType.baseType !== PgslBaseTypeName.Boolean) {
            throw new Exception('Expression of do-while loops must resolve into a boolean.', this);
        }
    }
}

type PgslIfStatementSyntaxTreeConstructorParameter = {
    expression: BasePgslExpressionSyntaxTree,
    block: PgslBlockStatementSyntaxTree;
    else: PgslBlockStatementSyntaxTree | PgslIfStatementSyntaxTree | null;
};