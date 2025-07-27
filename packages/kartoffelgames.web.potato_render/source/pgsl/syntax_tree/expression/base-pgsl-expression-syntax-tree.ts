import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree.ts';

/**
 * PGSL base expression.
 */
export abstract class BasePgslExpressionSyntaxTree extends BasePgslSyntaxTree<PgslExpressionSyntaxTreeState> {
    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     * @param pState - Expression syntax tree state.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);
    }
}

export type PgslExpressionSyntaxTreeState = {
    /**
     * If expression is a constant expression.
     */
    fixedState: PgslExpressionSyntaxTreeFixedState;

    /**
     * If expression is a value storage.
     * This is used to determine if the expression can be used to assign a value.
     */
    isStorage: boolean;

    /**
     * Type the expression will resolve into.
     */
    resolveType: BasePgslTypeDefinitionSyntaxTree;
};

export const PgslExpressionSyntaxTreeFixedState = {
    /**
     * Allways variable.
     * This is used for variables that can be changed at runtime.
     */
    Variable: 0,

    /**
     * Fixed to the current scope.
     * This is used for variables that are fixed to the current scope and cannot be changed.
     * For example, a parameter of a function or a const variable in a function scope.
     */
    ScopeFixed: 1,

    /**
     * Fixed to the pipeline creation.
     * This is used for variables that are fixed at pipeline creation and can only be changed by creation of a new pipeline.
     */
    PipelineCreationFixed: 2,

    /**
     * Fixed to the shader creation.
     * This is used for variables that are fixed at shader creation and can only be changed by creation of a new shader module instance.
     */
    ShaderCreationFixed: 3,

    /**
     * Constant value.
     * This is used for variables that are constant and cannot be changed.
     * For example, a string literal or a number literal.
     */
    Constant: 4,
} as const;
type PgslExpressionSyntaxTreeFixedState = typeof PgslExpressionSyntaxTreeFixedState[keyof typeof PgslExpressionSyntaxTreeFixedState];
