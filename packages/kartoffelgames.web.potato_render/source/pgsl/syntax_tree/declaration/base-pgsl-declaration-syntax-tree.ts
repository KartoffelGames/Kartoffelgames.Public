import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';

/**
 * PGSL base declaration. Every declaration has a optional attribute list.
 */
export abstract class BasePgslDeclarationSyntaxTree<TSetupData = unknown> extends BasePgslSyntaxTree<TSetupData> {
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
     * @param pData - Initial data.
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pAttributeList: PgslAttributeListSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mAttributeList = pAttributeList;

        // Add attributes as declaration child.
        this.appendChild(pAttributeList);
    }
}