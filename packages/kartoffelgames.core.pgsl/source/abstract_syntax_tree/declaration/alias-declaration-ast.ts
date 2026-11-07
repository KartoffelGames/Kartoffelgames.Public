import type { AliasDeclarationCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import { TypeDeclarationAst } from '../general/type-declaration-ast.ts';
import type { BasePgslType } from '../type/definition/base-pgsl-type.ts';
import { BaseDeclarationAst, type DeclarationAstData } from './base-declaration-ast.ts';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class AliasDeclarationAst extends BaseDeclarationAst<AliasDeclarationCst, AliasDeclarationAstData> {
    /**
     * Alias name.
     */
    public get name(): string {
        return this.data.name;
    }

    /**
     * Register alias without registering its content.
     * 
     * @param pContext - Processing context.
     */
    public override register(pContext: AbstractSyntaxTreeContext): this {
        // Set alias in context.
        pContext.registerAlias(this.name, this);

        return this;
    }

    /**
     * Process the declaration.
     * 
     * @param pContext - Context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: AliasDeclarationCst): AliasDeclarationAstData {
        // Create attribute list.
        const lAttributes: AttributeListAst = new AttributeListAst(pCst.attributeList, this).process(pContext);

        // Read type of type declaration.
        const lTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(pCst.typeDefinition).process(pContext);

        return {
            name: pCst.name,
            attributes: new AttributeListAst(pCst.attributeList, this).process(pContext),
            typeDeclaration: new TypeDeclarationAst(pCst.typeDefinition).process(pContext)
        };
    }
}

export type AliasDeclarationAstData = {
    name: string;
    typeDeclaration: TypeDeclarationAst;
} & DeclarationAstData;