import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../../expression/base-pgsl-expression.ts';
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition.ts";
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslStatement } from '../base-pgsl-statement.ts';
import type { PgslBlockStatement } from '../pgsl-block-statement.ts';

/**
 * PGSL structure for a while statement.
 */
export class PgslWhileStatement extends BasePgslStatement {
    private readonly mBlock: PgslBlockStatement;
    private readonly mExpression: BasePgslExpression;

    /**
     * If block.
     */
    public get block(): PgslBlockStatement {
        return this.mBlock;
    }

    /**
     * If boolean expression reference.
     */
    public get expression(): BasePgslExpression {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pExpression - While expression.
     * @param pBlock - Branched
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pExpression: BasePgslExpression, pBlock: PgslBlockStatement, pMeta: BasePgslSyntaxTreeMeta) {
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
        return `loop { if !(${this.mExpression.transpile()}) { break; } ${this.mBlock.transpile()} }`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pValidationTrace - Validation trace.
     */
    protected onValidateIntegrity(pValidationTrace: PgslValidationTrace): void {
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
            pValidationTrace.pushError('Expression of while loops must resolve into a boolean.', this.expression.meta, this);
        }
    }
}