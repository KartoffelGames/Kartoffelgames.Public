import { BasePgslSyntaxTree, PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../type/base-pgsl-type-definition-syntax-tree';

/**
 * PGSL base expression.
 */
export abstract class BasePgslExpressionSyntaxTree<TData extends PgslSyntaxTreeInitData = PgslSyntaxTreeInitData> extends BasePgslSyntaxTree<TData> {
    private mIsConstant: boolean | null;
    private mIsStorage: boolean | null;
    private mResolveType: BasePgslTypeDefinitionSyntaxTree | null;

    /**
     * If expression is a constant expression.
     */
    public get isConstant(): boolean {
        this.ensureValidity();

        // Constant was not set.
        if (this.mIsConstant === null) {
            this.mIsConstant = this.determinateIsConstant();
        }

        return this.mIsConstant;
    }

    /**
     * If expression is value storage.
     */
    public get isStorage(): boolean {
        this.ensureValidity();

        // Constant was not set.
        if (this.mIsStorage === null) {
            this.mIsStorage = this.determinateIsStorage();
        }

        return this.mIsStorage;
    }

    /**
     * Type the expression will resolve into.
     */
    public get resolveType(): BasePgslTypeDefinitionSyntaxTree {
        this.ensureValidity();

        // Constant was not set.
        if (this.mResolveType === null) {
            this.mResolveType = this.determinateResolveType();
        }

        return this.mResolveType;
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
    public constructor(pData: TData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number, pBuildIn: boolean = false) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine, pBuildIn);

        this.mIsConstant = null;
        this.mIsStorage = null;
        this.mResolveType = null;
    }

    /**
     * On constant state request.
     */
    protected abstract determinateIsConstant(): boolean

    /**
     * On is storage set..
     */
    protected abstract determinateIsStorage(): boolean

    /**
     * On type resolve of expression
     */
    protected abstract determinateResolveType(): BasePgslTypeDefinitionSyntaxTree
}