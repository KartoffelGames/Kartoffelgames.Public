import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { PgslFunctionDeclaration } from "../declaration/pgsl-function-declaration.ts";
import type { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../expression/base-pgsl-expression.ts';
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition } from "../type/base-pgsl-type-definition.ts";
import { PgslVoidTypeDefinition } from "../type/pgsl-void-type-definition.ts";
import { BasePgslStatement } from './base-pgsl-statement.ts';

/**
 * PGSL structure holding a return statement with an optional expression.
 */
export class PgslReturnStatement extends BasePgslStatement {
    private readonly mExpression: BasePgslExpression | null;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpression | null {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pExpression - Return expression.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pExpression: BasePgslExpression | null, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mExpression = pExpression;

        // Add child trees.
        if (this.mExpression) {
            this.appendChild(this.mExpression);
        }
    }

    /**
     * Transpile current return statement into a string.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        if (!this.mExpression) {
            return `return;`;
        }

        return `return ${this.mExpression.transpile()};`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): void {
        // Validate child expression.
        if (this.mExpression) {
            this.mExpression.validate(pValidationTrace);
        }

        // Check that this expression is inside a function declaration scope.
        if (pValidationTrace.scope.hasScope(PgslFunctionDeclaration)) {
            // Get the function declaration scope.
            const lFunctionDeclaration: PgslFunctionDeclaration = pValidationTrace.scope.getScopeOf(PgslFunctionDeclaration)!;

            let lReturnType: BasePgslTypeDefinition;
            if(this.mExpression) {
                // Read expression attachment to resolve the type.
                const lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mExpression);
                lReturnType = lExpressionAttachment.resolveType;
            } else {
                // Create a void type.
                lReturnType = new PgslVoidTypeDefinition({range: [0,0,0,0]});
                lReturnType.validate(pValidationTrace)
            }

            // Validate that the return type matches the function declaration.
            if(!lReturnType.isImplicitCastableInto(pValidationTrace, lFunctionDeclaration.returnType)) {
                pValidationTrace.pushError(`Return type does not match function declaration.`, this.meta, this);
            }
        } else {
            pValidationTrace.pushError(`Return statement is not inside a function declaration.`, this.meta, this);
        }
    }
}