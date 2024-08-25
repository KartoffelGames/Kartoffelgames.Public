import { BasePgslSyntaxTree, PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';

/**
 * PGSL base declaration. Every declaration has a optional attribute list.
 */
export abstract class BasePgslDeclarationSyntaxTree<TData extends PgslSyntaxTreeInitData = PgslSyntaxTreeInitData> extends BasePgslSyntaxTree<TData> {
    private readonly mAttributeList: PgslAttributeListSyntaxTree;

    private mIsConstant: boolean | null;
    private mIsConstructable: boolean | null;
    private mIsFixed: boolean | null;

    /**
     * Declaration attributes.
     */
    public get attributes(): PgslAttributeListSyntaxTree {
        return this.mAttributeList;
    }

    /**
     * If declaration is a constant expression.
     */
    public get isConstant(): boolean {
        this.ensureValidity();

        // Init value.
        if (this.mIsConstant === null) {
            this.mIsConstant = this.determinateIsConstant();
        }

        return this.mIsConstant;
    }

    /**
     * If declaration has a fixed byte length.
     */
    public get isConstructable(): boolean {
        this.ensureValidity();

        // Init value.
        if (this.mIsConstructable === null) {
            this.mIsConstructable = this.determinateIsConstructable();
        }

        return this.mIsConstructable;
    }

    /**
     * If declaration has a fixed byte length.
     */
    public get isFixed(): boolean {
        this.ensureValidity();

        // Init value.
        if (this.mIsFixed === null) {
            this.mIsFixed = this.determinateIsConstant();
        }

        return this.mIsFixed;
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
    public constructor(pData: TData, pAttributeList: PgslAttributeListSyntaxTree, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number, pBuildIn: boolean = false) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine, pBuildIn);

        // Set data.
        this.mAttributeList = pAttributeList;

        // Set empty values.
        this.mIsConstant = null;
        this.mIsConstructable = null;
        this.mIsFixed = null;
    }

    /**
     * Determinate if declaration is a constant.
     */
    protected abstract determinateIsConstant(): boolean;

    /**
     * Determinate if declaration is a constructable.
     */
    protected abstract determinateIsConstructable(): boolean;

    /**
     * Determinate if declaration has a fixed byte length.
     */
    protected abstract determinateIsFixed(): boolean;
}