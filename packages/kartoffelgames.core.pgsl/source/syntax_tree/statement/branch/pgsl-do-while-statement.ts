import { Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { PgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../../expression/pgsl-expression.ts';
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslStatement } from '../base-pgsl-statement.ts';
import type { PgslBlockStatement } from '../execution/pgsl-block-statement.ts';
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition.ts";
import { PgslFileMetaInformation } from "../../pgsl-build-result.ts";

/**
 * PGSL structure for a do while statement.
 */
export class PgslDoWhileStatement extends BasePgslStatement {
    private readonly mBlock: PgslBlockStatement;
    private readonly mExpression: PgslExpression;

    /**
     * If block.
     */
    public get block(): PgslBlockStatement {
        return this.mBlock;
    }

    /**
     * If boolean expression reference.
     */
    public get expression(): PgslExpression {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pExpression - Boolean expression.
     * @param pBlock - Looped block.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pExpression: PgslExpression, pBlock: PgslBlockStatement, pMeta: BasePgslSyntaxTreeMeta) {
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
     * @param pTrace - Transpilation trace.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
        return `loop { ${this.mBlock.transpile(pTrace)} if !(${this.mExpression.transpile(pTrace)}) { break; } }`;
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
            pValidationTrace.pushError('Expression of do-while loops must resolve into a boolean.', this.expression.meta, this);
        }
    }
}