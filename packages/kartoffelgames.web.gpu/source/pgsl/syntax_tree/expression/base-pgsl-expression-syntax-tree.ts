import { BasePgslSyntaxTree, PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { PgslTypeDeclarationSyntaxTree } from '../general/pgsl-type-declaration-syntax-tree';

/**
 * PGSL base expression.
 */
export abstract class BasePgslExpressionSyntaxTree<TData extends PgslSyntaxTreeInitData = PgslSyntaxTreeInitData> extends BasePgslSyntaxTree<TData> {
    private mIsConstant: boolean | null;
    private mResolveType: PgslTypeDeclarationSyntaxTree | null;

    /**
     * If expression is a constant expression.
     */
    public get isConstant(): boolean {
        this.ensureValidity();

        // Constant was not set.
        if (this.mIsConstant === null) {
            this.mIsConstant = this.onConstantStateSet();
        }

        return this.mIsConstant;
    }

    /**
     * Type the expression will resolve into.
     */
    public get resolveType(): PgslTypeDeclarationSyntaxTree {
        this.ensureValidity();

        // Constant was not set.
        if (this.mResolveType === null) {
            this.mResolveType = this.onResolveType();
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
        this.mResolveType = null;
    }

    /**
     * On constant state request.
     */
    protected abstract onConstantStateSet(): boolean

    /**
     * On type resolve of expression
     */
    protected abstract onResolveType(): PgslTypeDeclarationSyntaxTree
}