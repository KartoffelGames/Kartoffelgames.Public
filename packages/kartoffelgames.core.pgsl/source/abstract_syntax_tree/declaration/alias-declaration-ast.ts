import { AliasDeclarationCst } from "../../concrete_syntax_tree/declaration.type.ts";
import type { PgslType } from '../../type/pgsl-type.ts';
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import { TypeDeclarationAst } from '../general/type-declaration-ast.ts';
import { DeclarationAstData, IDeclarationAst } from './i-declaration-ast.interface.ts';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class AliasDeclarationAst extends AbstractSyntaxTree<AliasDeclarationCst, AliasDeclarationAstData> implements IDeclarationAst {
    /**
     * Constructor.
     * 
     * @param pName - Alias name.
     * @param pType - Aliased type.
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pCst: AliasDeclarationCst, pContext: AbstractSyntaxTreeContext) {
        super(pCst, pContext);
    }

    /**
     * Process the declaration.
     * 
     * @param pContext - Context.
     */
    protected override process(pContext: AbstractSyntaxTreeContext): AliasDeclarationAstData {
        // Create attribute list.
        const lAttributes: AttributeListAst = new AttributeListAst(this.cst.attributeList, this, pContext);

        // Read type of type declaration.
        const lTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(this.cst.typeDefinition, pContext);

        // Check if alias with same name already exists.
        if (pContext.getAlias(this.cst.name)) {
            pContext.pushIncident(`Alias with name "${this.cst.name}" already defined.`, this);
        }

        // Set alias in context.
        pContext.registerAlias(this);

        return {
            aliasName: this.cst.name,
            attributes: lAttributes,
            underlyingType: lTypeDeclaration.data.type
        };
    }
}

type AliasDeclarationAstData = {
    aliasName: string;
    underlyingType: PgslType;
} & DeclarationAstData;