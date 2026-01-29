import { Exception } from '@kartoffelgames/core';
import type { AliasDeclarationCst, DeclarationCst, EnumDeclarationCst, FunctionDeclarationCst, StructDeclarationCst, VariableDeclarationCst } from '../../concrete_syntax_tree/declaration.type.ts';
import { AliasDeclarationAst } from './alias-declaration-ast.ts';
import { EnumDeclarationAst } from './enum-declaration-ast.ts';
import { FunctionDeclarationAst } from './function-declaration-ast.ts';
import type { IDeclarationAst } from './i-declaration-ast.interface.ts';
import { StructDeclarationAst } from './struct-declaration-ast.ts';
import { VariableDeclarationAst } from './variable-declaration-ast.ts';

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
    public static build(pCst: DeclarationCst): IDeclarationAst {
        switch (pCst.type) {
            case 'AliasDeclaration':
                return new AliasDeclarationAst(pCst as AliasDeclarationCst);
            case 'EnumDeclaration':
                return new EnumDeclarationAst(pCst as EnumDeclarationCst);
            case 'FunctionDeclaration':
                return new FunctionDeclarationAst(pCst as FunctionDeclarationCst);
            case 'VariableDeclaration':
                return new VariableDeclarationAst(pCst as VariableDeclarationCst);
            case 'StructDeclaration':
                return new StructDeclarationAst(pCst as StructDeclarationCst);
        }

        throw new Exception(`Declaration AST Builder: Could not build declaration of type '${pCst.type}'.`, DeclarationAstBuilder);
    }
}