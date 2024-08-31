import { BasePgslSyntaxTree, PgslSyntaxTreeInitData, SyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';

/**
 * PGSL base declaration. Every declaration has a optional attribute list.
 */
export abstract class BasePgslDeclarationSyntaxTree<TData extends PgslSyntaxTreeInitData = PgslSyntaxTreeInitData> extends BasePgslSyntaxTree<TData> {
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
    public constructor(pData: TData, pAttributeList: PgslAttributeListSyntaxTree, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

        // Set data.
        this.mAttributeList = pAttributeList;
    }

    /**
     * Determinate structures identifier.
     */
    protected determinateIdentifier(this: null, _pData: TData): string {
        // Declarations should allways be unique.
        // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
        return `ID:DECLARATION::${(Math.random() * 0xffffffffffffff).toString(36)}`;
    }
}