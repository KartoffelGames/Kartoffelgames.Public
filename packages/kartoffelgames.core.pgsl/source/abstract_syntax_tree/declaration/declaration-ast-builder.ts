import { Exception } from "@kartoffelgames/core";
import { AliasDeclarationCst, DeclarationCst, EnumDeclarationCst, FunctionDeclarationCst, StructDeclarationCst, VariableDeclarationCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import { AliasDeclarationAst } from "./alias-declaration-ast.ts";
import { EnumDeclarationAst } from "./enum-declaration-ast.ts";
import { FunctionDeclarationAst } from "./function-declaration-ast.ts";
import { IDeclarationAst } from "./i-declaration-ast.interface.ts";
import { StructDeclarationAst } from "./struct-declaration-ast.ts";
import { VariableDeclarationAst } from "./variable-declaration-ast.ts";

/**
 * Abstract syntax tree builder for Declaration AST nodes.
 */
export abstract class DeclarationAstBuilder {
    /**
     * Build a declaration AST node from a concrete syntax tree node.
     * 
     * @param pCst - Concreate sytax tree.
     * @param pContext - Abstract syntax tree build context.
     * 
     * @returns Declaration AST node or null if the type is not recognized.
     */
    public static build(pCst: DeclarationCst, pContext: AbstractSyntaxTreeContext): IDeclarationAst {
        switch (pCst.type) {
            case 'AliasDeclaration':
                return new AliasDeclarationAst(pCst as AliasDeclarationCst).process(pContext);
            case 'EnumDeclaration':
                return new EnumDeclarationAst(pCst as EnumDeclarationCst).process(pContext);
            case 'FunctionDeclaration':
                return new FunctionDeclarationAst(pCst as FunctionDeclarationCst).process(pContext);
            case 'VariableDeclaration':
                return new VariableDeclarationAst(pCst as VariableDeclarationCst).process(pContext);
            case 'StructDeclaration':
                return new StructDeclarationAst(pCst as StructDeclarationCst).process(pContext);
        }

        throw new Exception(`Declaration AST Builder: Could not build declaration of type '${pCst.type}'.`, DeclarationAstBuilder);
    }
}