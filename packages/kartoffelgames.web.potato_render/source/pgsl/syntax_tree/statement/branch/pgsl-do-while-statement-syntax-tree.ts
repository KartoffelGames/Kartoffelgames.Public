import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree';
import { PgslBlockStatementSyntaxTree } from '../pgsl-block-statement-syntax-tree';

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
        super(pMeta);

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