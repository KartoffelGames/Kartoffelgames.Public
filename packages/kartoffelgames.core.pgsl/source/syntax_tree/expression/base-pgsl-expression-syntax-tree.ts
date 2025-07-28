import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslTypeDefinitionSyntaxTree } from '../type/base-pgsl-type-definition-syntax-tree.ts';

/**
 * PGSL base expression.
 */
export abstract class BasePgslExpressionSyntaxTree extends BasePgslSyntaxTree<PgslExpressionSyntaxTreeValidationAttachment> {
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

export type PgslExpressionSyntaxTreeValidationAttachment = {
    /**
     * If expression is a constant expression.
     */
    fixedState: PgslValueFixedState;

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