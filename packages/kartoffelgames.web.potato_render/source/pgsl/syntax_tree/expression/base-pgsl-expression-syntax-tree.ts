import { BasePgslSyntaxTree, PgslSyntaxTreeInitData, SyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree';

/**
 * PGSL base expression.
 */
export abstract class BasePgslExpressionSyntaxTree<TData extends PgslSyntaxTreeInitData = PgslSyntaxTreeInitData> extends BasePgslSyntaxTree<TData> {
    private mIsConstant: boolean | null;
    private mIsCreationFixed: boolean | null;
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
     * If expression is a constant expression.
     */
    public get isCreationFixed(): boolean {
        this.ensureValidity();

        // Constant was not set.
        if (this.mIsCreationFixed === null) {
            this.mIsCreationFixed = this.determinateIsCreationFixed();
        }

        return this.mIsCreationFixed;
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
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: TData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

        this.mIsConstant = null;
        this.mIsCreationFixed = null;
        this.mIsStorage = null;
        this.mResolveType = null;
    }

    /**
     * On constant state request.
     */
    protected abstract determinateIsConstant(): boolean;

    /**
     * On creation fixed state request.
     */
    protected abstract determinateIsCreationFixed(): boolean;

    /**
     * On is storage set.
     */
    protected abstract determinateIsStorage(): boolean;

    /**
     * On type resolve of expression
     */
    protected abstract determinateResolveType(): BasePgslTypeDefinitionSyntaxTree;
}