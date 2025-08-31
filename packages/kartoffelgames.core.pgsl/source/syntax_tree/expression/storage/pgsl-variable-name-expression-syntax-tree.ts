import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslVariableDeclarationSyntaxTree, PgslVariableDeclarationSyntaxTreeValidationAttachment } from '../../declaration/pgsl-variable-declaration-syntax-tree.ts';
import type { PgslSyntaxTreeValidationTrace } from '../../pgsl-syntax-tree-validation-trace.ts';
import { PgslVariableDeclarationStatementSyntaxTree, PgslVariableDeclarationStatementSyntaxTreeValidationAttachment } from '../../statement/pgsl-variable-declaration-statement-syntax-tree.ts';
import { PgslNumericTypeDefinitionSyntaxTree } from "../../type/pgsl-numeric-type-definition-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression-syntax-tree.ts';

/**
 * PGSL structure holding single variable name.
 */
export class PgslVariableNameExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
    private readonly mName: string;

    /**
     * Constructor.
     * 
     * @param pName - Variable name.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pName: string, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mName = pName;
    }

    /**
     * Transpile current expression to WGSL code.
     */
    protected override onTranspile(): string {
        return this.mName;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pScope - Validation scope.
     */
    protected override onValidateIntegrity(pScope: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Check if variable is defined.
        const lVariableDefinition: BasePgslSyntaxTree | undefined = pScope.getScopedValue(this.mName);
        if (!lVariableDefinition) {
            pScope.pushError(`Variable "${this.mName}" not defined.`, this.meta, this);
        }

        if (lVariableDefinition instanceof PgslVariableDeclarationSyntaxTree) {
            // Read variable definition attachment.
            const lVariableDeclarationAttachment: PgslVariableDeclarationSyntaxTreeValidationAttachment = pScope.getAttachment(lVariableDefinition);
            return {
                fixedState: lVariableDeclarationAttachment.fixedState,
                isStorage: true,
                resolveType: lVariableDeclarationAttachment.type
            };
        }

        // Must be a variable.
        if (lVariableDefinition instanceof PgslVariableDeclarationStatementSyntaxTree) {
            // Read variable definition attachment.
            const lVariableDeclarationAttachment: PgslVariableDeclarationStatementSyntaxTreeValidationAttachment = pScope.getAttachment(lVariableDefinition);
            return {
                fixedState: lVariableDeclarationAttachment.fixedState,
                isStorage: true,
                resolveType: lVariableDeclarationAttachment.type
            };
        }

        // Variable definition neither a declaration nor a statement.
        pScope.pushError(`Name "${this.mName}" does not refer to a variable.`, this.meta, this);

        return {
            fixedState: PgslValueFixedState.Variable,
            isStorage: false,
            resolveType: null as unknown as PgslNumericTypeDefinitionSyntaxTree // TODO: Maybe use a unknown type here?
        };
    }
}