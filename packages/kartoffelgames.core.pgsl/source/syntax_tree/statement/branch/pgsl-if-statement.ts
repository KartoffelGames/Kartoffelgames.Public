import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../../expression/base-pgsl-expression.ts';
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition.ts";
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslStatement } from '../base-pgsl-statement.ts';
import type { PgslBlockStatement } from '../pgsl-block-statement.ts';

/**
 * PGSL structure for a if statement with optional else block.
 */
export class PgslIfStatement extends BasePgslStatement {
    private readonly mBlock: PgslBlockStatement;
    private readonly mElse: PgslIfStatement | PgslBlockStatement | null;
    private readonly mExpression: BasePgslExpression;

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
    public get expression(): BasePgslExpression {
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
    protected onValidateIntegrity(pValidationTrace: PgslValidationTrace): void {
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
    expression: BasePgslExpression,
    block: PgslBlockStatement;
    else: PgslBlockStatement | PgslIfStatement | null;
};