import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import { PgslType } from "../../type/pgsl-type.ts";
import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';


/**
 * PGSL base expression.
 */
export abstract class PgslExpression extends BasePgslSyntaxTree {
    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     * @param pState - Expression syntax tree state.
     */
    public constructor(pMeta?: BasePgslSyntaxTreeMeta) {
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
    resolveType: PgslType;
};