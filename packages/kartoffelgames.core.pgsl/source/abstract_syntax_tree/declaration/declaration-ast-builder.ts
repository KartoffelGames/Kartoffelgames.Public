import { AliasDeclarationCst, DeclarationCst, EnumDeclarationCst, FunctionDeclarationCst, StructDeclarationCst, VariableDeclarationCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import { AliasDeclarationAst } from "./alias-declaration-ast.ts";
import { EnumDeclarationAst } from "./enum-declaration-ast.ts";
import { IDeclarationAst } from "./i-declaration-ast.interface.ts";
import { FunctionDeclarationAst } from "./pgsl-function-declaration.ts";
import { StructDeclarationAst } from "./struct-declaration-ast.ts";
import { VariableDeclarationAst } from "./variable-declaration-ast.ts";

export abstract class DeclarationAstBuilder {
    /**
     * Build a declaration AST node from a concrete syntax tree node.
     * 
     * @param pCst - Concreate sytax tree.
     * @param pContext - Abstract syntax tree build context.
     * 
     * @returns Declaration AST node or null if the type is not recognized.
     */
    public static build(pCst: DeclarationCst, pContext: AbstractSyntaxTreeContext): IDeclarationAst | null {
        switch (pCst.type) {
            case 'AliasDeclaration':
                return new AliasDeclarationAst(pCst as AliasDeclarationCst, pContext);
            case 'EnumDeclaration':
                return new EnumDeclarationAst(pCst as EnumDeclarationCst, pContext);
            case 'FunctionDeclaration':
                return new FunctionDeclarationAst(pCst as FunctionDeclarationCst, pContext);
            case 'VariableDeclaration':
                return new VariableDeclarationAst(pCst as VariableDeclarationCst, pContext);
            case 'StructDeclaration':
                return new StructDeclarationAst(pCst as StructDeclarationCst, pContext);
            default:
                return null;
        }
    }
}