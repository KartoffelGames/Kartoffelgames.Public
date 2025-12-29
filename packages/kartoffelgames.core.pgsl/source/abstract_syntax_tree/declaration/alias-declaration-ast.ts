import type { AliasDeclarationCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { IType } from '../type/i-type.interface.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import { TypeDeclarationAst } from '../general/type-declaration-ast.ts';
import type { DeclarationAstData, IDeclarationAst } from './i-declaration-ast.interface.ts';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class AliasDeclarationAst extends AbstractSyntaxTree<AliasDeclarationCst, AliasDeclarationAstData> implements IDeclarationAst {
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

        // Check if alias with same name already exists.
        if (pContext.getAlias(this.cst.name)) {
            pContext.pushIncident(`Alias with name "${this.cst.name}" already defined.`, this);
        }

        // Set alias in context.
        pContext.registerAlias(this.cst.name, this);

        return {
            aliasName: this.cst.name,
            attributes: lAttributes,
            underlyingType: lTypeDeclaration.data.type
        };
    }
}

type AliasDeclarationAstData = {
    aliasName: string;
    underlyingType: IType;
} & DeclarationAstData;