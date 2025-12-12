import { DeclarationCst, VariableDeclarationCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { VariableDeclarationAst } from "./variable-declaration-ast.ts";

/**
 * PGSL base declaration. Every declaration has a optional attribute list.
 */
export abstract class DeclarationAst<TCst extends DeclarationCst = DeclarationCst, TData extends DeclarationAstData = DeclarationAstData> extends AbstractSyntaxTree<TCst, TData> {
    public static build<TCst extends DeclarationCst>(pCst: TCst, pContext: AbstractSyntaxTreeContext): DeclarationAst<TCst, DeclarationAstData> | null {
        switch (pCst.type) {
            case 'AliasDeclaration':
                return new PgslAliasDeclaration(pChild);
            case 'EnumDeclaration':
                return new PgslEnumDeclaration(pChild);
            case 'FunctionDeclaration':
                return new PgslFunctionDeclaration(pChild);
            case 'VariableDeclaration':
                return new VariableDeclarationAst(pCst as VariableDeclarationCst, pContext);
            case 'StructDeclaration':
                return new PgslStructDeclaration(pChild);
            default:
                return null;
        }
    }

    /**
     * Constructor.
     * 
     * @param pCst - Concrete syntax tree node.
     * @param pContext - Syntax tree context.
     */
    public constructor(pCst: TCst, pContext: AbstractSyntaxTreeContext) {
        super(pCst, pContext);
    }
}

export type DeclarationAstData = {
    /**
     * Declaration attributes.
     */
    attributes: PgslAttributeList;
};