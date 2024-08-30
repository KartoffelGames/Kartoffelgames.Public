import { Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../../enum/pgsl-declaration-type.enum';
import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree';
import { PgslAssignmentStatementSyntaxTree } from '../pgsl-assignment-statement-syntax-tree';
import { PgslBlockStatementSyntaxTree } from '../pgsl-block-statement-syntax-tree';
import { PgslFunctionCallStatementSyntaxTree } from '../pgsl-function-call-statement-syntax-tree';
import { PgslIncrementDecrementStatementSyntaxTree } from '../pgsl-increment-decrement-statement-syntax-tree';
import { PgslVariableDeclarationStatementSyntaxTree } from '../pgsl-variable-declaration-statement-syntax-tree';
import { PgslBooleanTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-boolean-type-definition-syntax-tree';

/**
 * PGSL structure for a if statement with optional else block.
 */
export class PgslForStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslForStatementSyntaxTreeStructureData> {
    private readonly mBlock: PgslBlockStatementSyntaxTree;
    private readonly mExpression: BasePgslExpressionSyntaxTree | null;
    private readonly mInit: PgslVariableDeclarationStatementSyntaxTree | null;
    private readonly mUpdate: PgslAssignmentStatementSyntaxTree | PgslIncrementDecrementStatementSyntaxTree | PgslFunctionCallStatementSyntaxTree | null;

    /**
     * Block.
     */
    public get block(): PgslBlockStatementSyntaxTree {
        return this.mBlock;
    }

    /**
     * Compare expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree | null {
        return this.mExpression;
    }

    /**
     * Variable declaration statement reference.
     */
    public get init(): PgslVariableDeclarationStatementSyntaxTree | null {
        return this.mInit;
    }

    /**
     * Assignment expression.
     */
    public get update(): PgslAssignmentStatementSyntaxTree | PgslIncrementDecrementStatementSyntaxTree | PgslFunctionCallStatementSyntaxTree | null {
        return this.mUpdate;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslForStatementSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Validate right variable declaration type.
        if (pData.init && pData.init.declarationType !== PgslDeclarationType.Let) {
            throw new Exception(`For variable declaration can't be a constant.`, this);
        }

        // Set data.
        this.mBlock = pData.block;
        this.mUpdate = pData.update ?? null;
        this.mExpression = pData.expression ?? null;
        this.mInit = pData.init ?? null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Expression must be a boolean.
        if(this.mExpression && !(this.mExpression.resolveType instanceof PgslBooleanTypeDefinitionSyntaxTree)) {
            throw new Exception('Expression of for loops must resolve into a boolean.', this);
        }

        // Variable musst be a let
        if(this.mInit && this.mInit.declarationType !== PgslDeclarationType.Let){
            throw new Exception('Initial of for loops must be a let declaration.', this);
        }
    }
}

type PgslForStatementSyntaxTreeStructureData = {
    init?: PgslVariableDeclarationStatementSyntaxTree;
    expression?: BasePgslExpressionSyntaxTree;
    update?: PgslAssignmentStatementSyntaxTree | PgslIncrementDecrementStatementSyntaxTree | PgslFunctionCallStatementSyntaxTree;
    block: PgslBlockStatementSyntaxTree;
};