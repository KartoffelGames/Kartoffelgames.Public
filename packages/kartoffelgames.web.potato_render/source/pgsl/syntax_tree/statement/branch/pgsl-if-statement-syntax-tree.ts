import { Exception } from '@kartoffelgames/core';
import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslTypeName } from '../../type/enum/pgsl-type-name.enum';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree';
import { PgslBlockStatementSyntaxTree } from '../pgsl-block-statement-syntax-tree';

/**
 * PGSL structure for a if statement with optional else block.
 */
export class PgslIfStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslIfStatementSyntaxTreeStructureData> {
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
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslIfStatementSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

        // Set data.
        this.mExpression = pData.expression;
        this.mBlock = pData.block;
        this.mElse = pData.else ?? null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Expression must be a boolean.
        if (this.mExpression.resolveType.baseType !== PgslTypeName.Boolean) {
            throw new Exception('Expression of do-while loops must resolve into a boolean.', this);
        }
    }
}

type PgslIfStatementSyntaxTreeStructureData = {
    expression: BasePgslExpressionSyntaxTree,
    block: PgslBlockStatementSyntaxTree;
    else?: PgslBlockStatementSyntaxTree | PgslIfStatementSyntaxTree;
};