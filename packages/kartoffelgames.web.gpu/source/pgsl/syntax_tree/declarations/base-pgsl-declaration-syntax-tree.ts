import { BasePgslSyntaxTree, PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';

/**
 * PGSL base declaration. Every declaration has a optional attribute list.
 */
export abstract class BasePgslDeclarationSyntaxTree<TData extends PgslSyntaxTreeInitData = PgslSyntaxTreeInitData> extends BasePgslSyntaxTree<TData> {
    private readonly mAttributeList: PgslAttributeListSyntaxTree;
    private readonly mIsConstant: boolean;

    /**
     * Declaration attributes.
     */
    public get attributes(): PgslAttributeListSyntaxTree {
        return this.mAttributeList;
    }

    /**
     * If expression is a constant expression.
     */
    public get isConstant(): boolean {
        return this.mIsConstant;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: TData, pAttributeList: PgslAttributeListSyntaxTree, pIsConstant: boolean, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number, pBuildIn: boolean = false) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine, pBuildIn);

        // Set data.
        this.mAttributeList = pAttributeList;
        this.mIsConstant = pIsConstant;
    }
}