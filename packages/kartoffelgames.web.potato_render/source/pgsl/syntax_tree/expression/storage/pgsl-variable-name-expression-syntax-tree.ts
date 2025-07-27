import { Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslVariableDeclarationSyntaxTree } from '../../declaration/pgsl-variable-declaration-syntax-tree.ts';
import { PgslVariableDeclarationStatementSyntaxTree } from '../../statement/pgsl-variable-declaration-statement-syntax-tree.ts';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeState } from '../base-pgsl-expression-syntax-tree.ts';
import type { PgslSyntaxTreeValidationTrace } from '../../pgsl-syntax-tree-validation-trace.ts';

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
     */
    protected override onValidateIntegrity(pScope: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeState {
        // Check if variable is defined.
        const lVariableDefinition: BasePgslSyntaxTree | undefined = pScope.getScopedValue(this.mName);
        if (!lVariableDefinition) {
            pScope.pushError(`Variable "${this.mName}" not defined.`, this.meta, this);
        }

        // Must be a variable.
        if (!(lVariableDefinition instanceof PgslVariableDeclarationSyntaxTree) && !(lVariableDefinition instanceof PgslVariableDeclarationStatementSyntaxTree)) {
            pScope.pushError(`Name "${this.mName}" does not refer to a variable.`, this.meta, this);
        }

        // Read variable definition attachment.
        const lVariableDefinitionAttachment: PgslExpressionSyntaxTreeState = pScope.getAttachment(lVariableDefinition);

        return {
            fixedState: lVariableDefinition.fixedState,
            isStorage: true,
            resolveType: lVariableDefinition.type,
        };
    }
}

type PgslVariableNameExpressionSyntaxTreeSetupData = {
    variable: PgslVariableDeclarationSyntaxTree | PgslVariableDeclarationStatementSyntaxTree;
};