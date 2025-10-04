import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslAttributeList } from '../general/pgsl-attribute-list.ts';

/**
 * PGSL base declaration. Every declaration has a optional attribute list.
 */
export abstract class PgslDeclaration extends BasePgslSyntaxTree {
    private readonly mAttributeList: PgslAttributeList;

    /**
     * Declaration attributes.
     */
    public get attributes(): PgslAttributeList {
        return this.mAttributeList;
    }

    /**
     * Constructor.
     * 
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pAttributeList: PgslAttributeList, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mAttributeList = pAttributeList;

        // Attach declaration to attribute list.
        this.mAttributeList.attachToDeclaration(this);

        // Add attributes as declaration child.
        this.appendChild(pAttributeList);
    }
}