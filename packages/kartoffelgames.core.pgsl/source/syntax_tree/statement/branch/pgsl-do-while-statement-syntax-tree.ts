import { Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../../expression/base-pgsl-expression-syntax-tree.ts';
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree.ts';
import type { PgslBlockStatementSyntaxTree } from '../pgsl-block-statement-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition-syntax-tree.ts";

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
     * Transpile the current structure to a string representation.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        return `loop { ${this.mBlock.transpile()} if !(${this.mExpression.transpile()}) { break; } }`;
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

        // Read attachments of expression.
        const lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mExpression);

        // Read attachment of expression resolve type.
        const lExpressionResolveTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lExpressionAttachment.resolveType);

        // Expression must be a boolean.
        if (lExpressionResolveTypeAttachment.baseType !== PgslBaseTypeName.Boolean) {
            pValidationTrace.pushError('Expression of do-while loops must resolve into a boolean.', this.expression.meta, this);
        }
    }
}