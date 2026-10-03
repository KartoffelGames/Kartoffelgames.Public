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
        return this.data.aliasName;
    }

    /**
     * Register alias without registering its content.
     * 
     * @param pContext - Processing context.
     */
    public override register(pContext: AbstractSyntaxTreeContext): this {
        // Check if alias with same name already exists.
        if (pContext.getAlias(this.name)) {
            pContext.pushIncident(`Alias with name "${this.name}" already defined.`, this);
        }

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
            aliasName: pCst.name,
            attributes: lAttributes,
            underlyingType: lTypeDeclaration.data.type
        };
    }
}

type AliasDeclarationAstData = {
    aliasName: string;
    underlyingType: BasePgslType;
} & DeclarationAstData;