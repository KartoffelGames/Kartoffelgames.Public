import type { Cst } from '../../concrete_syntax_tree/general.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { AttributeListAst } from '../general/attribute-list-ast.ts';

/**
 * PGSL base declaration. Every declaration has a optional attribute list.
 */
export abstract class BaseDeclarationAst<TCst extends Cst<string> = Cst<string>, TData extends DeclarationAstData = DeclarationAstData> extends AbstractSyntaxTree<TCst, TData> {
    /**
     * Declaration name.
     */
    public abstract readonly name: string;

    /**
     * Register declaration without registering its content.
     *
     * @param pContext - Processing context.
     */
    public abstract register(pContext: AbstractSyntaxTreeContext): this;
}

export type DeclarationAstData = {
    /**
     * Declaration attributes.
     */
    attributes: AttributeListAst;
};