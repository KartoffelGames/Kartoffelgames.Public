import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { PgslFunctionDeclarationSyntaxTree } from "../declaration/pgsl-function-declaration-syntax-tree.ts";
import type { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../expression/base-pgsl-expression-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree } from "../type/base-pgsl-type-definition-syntax-tree.ts";
import { PgslVoidTypeDefinitionSyntaxTree } from "../type/pgsl-void-type-definition-syntax-tree.ts";
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree.ts';

/**
 * PGSL structure holding a return statement with an optional expression.
 */
export class PgslReturnStatementSyntaxTree extends BasePgslStatementSyntaxTree {
    private readonly mExpression: BasePgslExpressionSyntaxTree | null;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree | null {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pExpression - Return expression.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pExpression: BasePgslExpressionSyntaxTree | null, pMeta: BasePgslSyntaxTreeMeta) {
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
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): void {
        // Validate child expression.
        if (this.mExpression) {
            this.mExpression.validate(pValidationTrace);
        }

        // Check that this expression is inside a function declaration scope.
        if (pValidationTrace.scope.hasScope(PgslFunctionDeclarationSyntaxTree)) {
            // Get the function declaration scope.
            const lFunctionDeclaration: PgslFunctionDeclarationSyntaxTree = pValidationTrace.scope.getScopeOf(PgslFunctionDeclarationSyntaxTree)!;

            let lReturnType: BasePgslTypeDefinitionSyntaxTree;
            if(this.mExpression) {
                // Read expression attachment to resolve the type.
                const lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mExpression);
                lReturnType = lExpressionAttachment.resolveType;
            } else {
                // Create a void type.
                lReturnType = new PgslVoidTypeDefinitionSyntaxTree({range: [0,0,0,0]});
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