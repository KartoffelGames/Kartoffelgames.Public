import { Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../../enum/pgsl-declaration-type.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree.ts';
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree.ts';
import { PgslAssignmentStatementSyntaxTree } from '../pgsl-assignment-statement-syntax-tree.ts';
import type { PgslBlockStatementSyntaxTree } from '../pgsl-block-statement-syntax-tree.ts';
import { PgslFunctionCallStatementSyntaxTree } from '../pgsl-function-call-statement-syntax-tree.ts';
import { PgslIncrementDecrementStatementSyntaxTree } from '../pgsl-increment-decrement-statement-syntax-tree.ts';
import type { PgslVariableDeclarationStatementSyntaxTree } from '../pgsl-variable-declaration-statement-syntax-tree.ts';

/**
 * PGSL structure for a if statement with optional else block.
 */
export class PgslForStatementSyntaxTree extends BasePgslStatementSyntaxTree {
    private readonly mBlock: PgslBlockStatementSyntaxTree;
    private readonly mExpression: BasePgslExpressionSyntaxTree | null;
    private readonly mInit: PgslVariableDeclarationStatementSyntaxTree | null;
    private readonly mUpdate: BasePgslStatementSyntaxTree | null;

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
    public get update(): BasePgslStatementSyntaxTree | null {
        return this.mUpdate;
    }

    /**
     * Constructor.
     * 
     * @param pParameter - Parameter.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pParameter: PgslForStatementSyntaxTreeConstructorParameter, pMeta: BasePgslSyntaxTreeMeta,) {
        super(pMeta, false);

        // Set data.
        this.mBlock = pParameter.block;
        this.mUpdate = pParameter.update;
        this.mExpression = pParameter.expression;
        this.mInit = pParameter.init;

        // TODO: Push init value to block scope.

        // Set child as tree data.
        this.appendChild(this.mBlock);
        if (this.mUpdate) {
            this.appendChild(this.mUpdate);
        }
        if (this.mExpression) {
            this.appendChild(this.mExpression);
        }
        if (this.mInit) {
            this.appendChild(this.mInit);
        }
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Expression must be a boolean.
        if (this.mExpression && this.mExpression.resolveType.baseType !== PgslBaseTypeName.Boolean) {
            throw new Exception('Expression of for loops must resolve into a boolean.', this);
        }

        // Variable musst be a let
        if (this.mInit && this.mInit.declarationType !== PgslDeclarationType.Let) {
            throw new Exception('Initial of for loops must be a let declaration.', this);
        }

        // Validate update statement.
        if (this.mUpdate !== null) {
            switch (true) {
                case this.mUpdate instanceof PgslAssignmentStatementSyntaxTree:
                case this.mUpdate instanceof PgslIncrementDecrementStatementSyntaxTree:
                case this.mUpdate instanceof PgslFunctionCallStatementSyntaxTree: {
                    break;
                }
                default: {
                    throw new Exception('For update statement must be eighter a assignment, increment or function statement.', this);
                }
            }
        }
    }
}

type PgslForStatementSyntaxTreeConstructorParameter = {
    init: PgslVariableDeclarationStatementSyntaxTree | null;
    expression: BasePgslExpressionSyntaxTree | null;
    update: BasePgslStatementSyntaxTree | null;
    block: PgslBlockStatementSyntaxTree;
};