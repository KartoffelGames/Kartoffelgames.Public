import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import type { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { AttributeListAst } from '../general/attribute-list-ast.ts';

/**
 * PGSL base declaration. Every declaration has a optional attribute list.
 */
export interface IDeclarationAst extends AbstractSyntaxTree {
    /**
     * Declaration data.
     */
    readonly data: DeclarationAstData;

    /**
     * Register declaration without registering its content.
     * 
     * @param pContext - Processing context.
     */
    register(pContext: AbstractSyntaxTreeContext): this;
}

export type DeclarationAstData = {
    /**
     * Declaration attributes.
     */
    attributes: AttributeListAst;
};