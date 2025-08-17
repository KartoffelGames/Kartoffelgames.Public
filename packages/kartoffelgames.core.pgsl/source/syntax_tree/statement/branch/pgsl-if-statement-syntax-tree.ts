import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../../expression/base-pgsl-expression-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition-syntax-tree.ts";
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree.ts';
import type { PgslBlockStatementSyntaxTree } from '../pgsl-block-statement-syntax-tree.ts';

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
     * Transpile the current structure to a string representation.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        if (!this.mElse) {
            return `if (${this.mExpression.transpile()}) ${this.mBlock.transpile()}`;
        } else {
            return `if (${this.mExpression.transpile()}) ${this.mBlock.transpile()} else ${this.mElse.transpile()}`;
        }
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
     * @param pValidationTrace - Validation trace.
     */
    protected onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): void {
        // Validate expression.
        this.mExpression.validate(pValidationTrace);

        // Validate block.
        this.mBlock.validate(pValidationTrace);

        // Validate else block.
        if (this.mElse) {
            this.mElse.validate(pValidationTrace);
        }

        // Read attachments of expression.
        const lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mExpression);

        // Read attachment of expression resolve type.
        const lExpressionResolveTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lExpressionAttachment.resolveType);

        // Expression must be a boolean.
        if (lExpressionResolveTypeAttachment.baseType !== PgslBaseTypeName.Boolean) {
            pValidationTrace.pushError('Expression of if must resolve into a boolean.', this.expression.meta, this);
        }
    }
}

type PgslIfStatementSyntaxTreeConstructorParameter = {
    expression: BasePgslExpressionSyntaxTree,
    block: PgslBlockStatementSyntaxTree;
    else: PgslBlockStatementSyntaxTree | PgslIfStatementSyntaxTree | null;
};