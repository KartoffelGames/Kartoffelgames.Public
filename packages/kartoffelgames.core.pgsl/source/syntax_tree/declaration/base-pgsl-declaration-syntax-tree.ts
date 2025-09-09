import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree.ts';

/**
 * PGSL base declaration. Every declaration has a optional attribute list.
 */
export abstract class BasePgslDeclarationSyntaxTree<TValidationAttachment extends object | void = void> extends BasePgslSyntaxTree<TValidationAttachment> {
    private readonly mAttributeList: PgslAttributeListSyntaxTree;

    /**
     * Declaration attributes.
     */
    public get attributes(): PgslAttributeListSyntaxTree {
        return this.mAttributeList;
    }

    /**
     * Constructor.
     * 
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pAttributeList: PgslAttributeListSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mAttributeList = pAttributeList;

        // Attach declaration to attribute list.
        this.mAttributeList.attachToDeclaration(this);

        // Add attributes as declaration child.
        this.appendChild(pAttributeList);
    }
}