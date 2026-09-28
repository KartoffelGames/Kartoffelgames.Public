import type { AliasDeclarationCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import { TypeDeclarationAst } from '../general/type-declaration-ast.ts';
import { BasePgslType } from "../type/definition/base-pgsl-type.ts";
import { BaseDeclarationAst, type DeclarationAstData } from './base-declaration-ast.ts';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class AliasDeclarationAst extends BaseDeclarationAst<AliasDeclarationCst, AliasDeclarationAstData> {
    /**
     * Alias name.
     */
    public get name(): string {
        return this.cst.name;
    }

    /**
     * Register alias without registering its content.
     * 
     * @param pContext - Processing context.
     */
    public override register(pContext: AbstractSyntaxTreeContext): this {
        // Check if alias with same name already exists.
        if (pContext.getAlias(this.cst.name)) {
            pContext.pushIncident(`Alias with name "${this.cst.name}" already defined.`, this);
        }

        // Set alias in context.
        pContext.registerAlias(this.cst.name, this);

        return this;
    }

    /**
     * Process the declaration.
     * 
     * @param pContext - Context.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): AliasDeclarationAstData {
        // Create attribute list.
        const lAttributes: AttributeListAst = new AttributeListAst(this.cst.attributeList, this).process(pContext);

        // Read type of type declaration.
        const lTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(this.cst.typeDefinition).process(pContext);

        return {
            aliasName: this.cst.name,
            attributes: lAttributes,
            underlyingType: lTypeDeclaration.data.type
        };
    }
}

type AliasDeclarationAstData = {
    aliasName: string;
    underlyingType: BasePgslType;
} & DeclarationAstData;