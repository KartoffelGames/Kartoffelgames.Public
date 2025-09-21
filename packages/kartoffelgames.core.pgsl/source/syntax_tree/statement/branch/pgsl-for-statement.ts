import { PgslDeclarationType } from '../../../enum/pgsl-declaration-type.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../../expression/base-pgsl-expression.ts';
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition.ts";
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslStatement } from '../base-pgsl-statement.ts';
import { PgslAssignmentStatement } from '../pgsl-assignment-statement.ts';
import type { PgslBlockStatement } from '../pgsl-block-statement.ts';
import { PgslFunctionCallStatement } from '../pgsl-function-call-statement.ts';
import { PgslIncrementDecrementStatement } from '../pgsl-increment-decrement-statement.ts';
import type { PgslVariableDeclarationStatement, PgslVariableDeclarationStatementSyntaxTreeValidationAttachment } from '../pgsl-variable-declaration-statement.ts';

/**
 * PGSL structure for a if statement with optional else block.
 */
export class PgslForStatement extends BasePgslStatement {
    private readonly mBlock: PgslBlockStatement;
    private readonly mExpression: BasePgslExpression | null;
    private readonly mInit: PgslVariableDeclarationStatement | null;
    private readonly mUpdate: BasePgslStatement | null;

    /**
     * Block.
     */
    public get block(): PgslBlockStatement {
        return this.mBlock;
    }

    /**
     * Compare expression reference.
     */
    public get expression(): BasePgslExpression | null {
        return this.mExpression;
    }

    /**
     * Variable declaration statement reference.
     */
    public get init(): PgslVariableDeclarationStatement | null {
        return this.mInit;
    }

    /**
     * Assignment expression.
     */
    public get update(): BasePgslStatement | null {
        return this.mUpdate;
    }

    /**
     * Constructor.
     * 
     * @param pParameter - Parameter.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pParameter: PgslForStatementSyntaxTreeConstructorParameter, pMeta: BasePgslSyntaxTreeMeta,) {
        super(pMeta);

        // Set data.
        this.mBlock = pParameter.block;
        this.mUpdate = pParameter.update;
        this.mExpression = pParameter.expression;
        this.mInit = pParameter.init;

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
     * Transpile the current structure to a string representation.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        let lResult: string = '';

        // Transpile init value when set.
        if (this.mInit) {
            lResult += this.mInit.transpile();
        }

        // Create a loop.
        lResult += 'loop {';

        // When a expression is set define it as exit.
        if (this.mExpression) {
            lResult += `if !(${this.mExpression.transpile()}) { break; }`;
        }

        // Append the actual body.
        lResult += this.mBlock.transpile();

        // Set the update expression when defined.
        if (this.mUpdate) {
            lResult += `${this.mUpdate.transpile()};`;
        }

        // And close the loop.
        return lResult + '}';
    }

    /**
     * Validate data of current structure.
     * 
     * @param pValidationTrace - Validation trace.
     */
    protected onValidateIntegrity(pValidationTrace: PgslValidationTrace): void {
        // Validate init first to add value to block scope. 
        if (this.mInit) {
            // Validate init declaration.
            this.mInit.validate(pValidationTrace);

            // Push value to scope.
            pValidationTrace.pushScopedValue(this.mInit.name, this.mInit);

            // Read attachment of init declaration.
            const lInitAttachment: PgslVariableDeclarationStatementSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mInit);

            // Variable must be a let
            if (lInitAttachment.declarationType !== PgslDeclarationType.Let) {
                pValidationTrace.pushError('Initial of for loops must be a let declaration.', this.mInit.meta, this);
            }
        }

        // Validate block.
        this.mBlock.validate(pValidationTrace);

        // Validate expression.
        if (this.mExpression) {
            this.mExpression.validate(pValidationTrace);

            // Read attachments of expression.
            const lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mExpression);

            // Read attachment of expression resolve type.
            const lExpressionResolveTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lExpressionAttachment.resolveType);

            // Expression must be a boolean.
            if (lExpressionResolveTypeAttachment.baseType !== PgslBaseTypeName.Boolean) {
                pValidationTrace.pushError('Expression of while loops must resolve into a boolean.', this.mExpression.meta, this);
            }
        }

        // Validate update statement.
        if (this.mUpdate !== null) {
            switch (true) {
                case this.mUpdate instanceof PgslAssignmentStatement:
                case this.mUpdate instanceof PgslIncrementDecrementStatement:
                case this.mUpdate instanceof PgslFunctionCallStatement: {
                    break;
                }
                default: {
                    pValidationTrace.pushError('For update statement must be either an assignment, increment or function statement.', this.mUpdate.meta, this);
                }
            }
        }
    }
}

type PgslForStatementSyntaxTreeConstructorParameter = {
    init: PgslVariableDeclarationStatement | null;
    expression: BasePgslExpression | null;
    update: BasePgslStatement | null;
    block: PgslBlockStatement;
};