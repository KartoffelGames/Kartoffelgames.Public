import { Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree.ts';
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree.ts';
import type { PgslBlockStatementSyntaxTree } from '../pgsl-block-statement-syntax-tree.ts';

/**
 * PGSL structure for a do while statement.
 */
export class PgslDoWhileStatementSyntaxTree extends BasePgslStatementSyntaxTree {
    private readonly mBlock: PgslBlockStatementSyntaxTree;
    private readonly mExpression: BasePgslExpressionSyntaxTree;

    /**
     * If block.
     */
    public get block(): PgslBlockStatementSyntaxTree {
        return this.mBlock;
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
     * @param pExpression - Boolean expression.
     * @param pBlock - Looped block.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pExpression: BasePgslExpressionSyntaxTree, pBlock: PgslBlockStatementSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta, false);

        // Set data.
        this.mExpression = pExpression;
        this.mBlock = pBlock;

        // Add data as child tree.
        this.appendChild(this.mExpression, this.mBlock);
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