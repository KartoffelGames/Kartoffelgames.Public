import { BasePgslSyntaxTree, PgslSyntaxTreeInitData } from '../../base-pgsl-syntax-tree';

/**
 * PGSL base type definition.
 */
export abstract class BasePgslTypeDefinitionSyntaxTree<TData extends PgslSyntaxTreeInitData = PgslSyntaxTreeInitData> extends BasePgslSyntaxTree<TData> {
    private mIsComposite: boolean | null;
    private mIsConstructable: boolean | null;
    private mIsFixed: boolean | null;
    private mIsIndexable: boolean | null;
    private mIsPlainType: boolean | null;
    private mIsShareable: boolean | null;
    private mIsStorable: boolean | null;

    /**
     * If declaration is a composite type.
     */
    public get isComposite(): boolean {
        this.ensureValidity();

        // Init value.
        if (this.mIsComposite === null) {
            this.mIsComposite = this.determinateIsComposite();
        }

        return this.mIsComposite;
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
            this.mIsFixed = this.determinateIsFixed();
        }

        return this.mIsFixed;
    }

    /**
     * Composite value with properties that can be access by index.
     */
    public get isIndexable(): boolean {
        this.ensureValidity();

        // Init value.
        if (this.mIsIndexable === null) {
            this.mIsIndexable = this.determinateIsIndexable();
        }

        return this.mIsIndexable;
    }

    /**
     * If is a plain type.
     */
    public get isPlainType(): boolean {
        this.ensureValidity();

        // Init value.
        if (this.mIsPlainType === null) {
            this.mIsPlainType = this.determinateIsPlain();
        }

        return this.mIsPlainType;
    }

    /**
     * If is sharable with the host.
     */
    public get isShareable(): boolean {
        this.ensureValidity();

        // Init value.
        if (this.mIsShareable === null) {
            this.mIsShareable = this.determinateIsShareable();
        }

        return this.mIsShareable;
    }

    /**
     * If value is storable in a variable.
     */
    public get isStorable(): boolean {
        this.ensureValidity();

        // Init value.
        if (this.mIsStorable === null) {
            this.mIsStorable = this.determinateIsStorable();
        }

        return this.mIsStorable;
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

        // Set data default
        this.mIsComposite = null;
        this.mIsConstructable = null;
        this.mIsFixed = null;
        this.mIsIndexable = null;
        this.mIsShareable = null;
        this.mIsStorable = null;
        this.mIsPlainType = null;

        // TODO: A constructible type has a creation-fixed footprint.
    }

    /**
     * Check if set type is equal to this type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns if both declarations are equal.
     */
    public equals(pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Need to be same type.
        if (!(pTarget instanceof this.constructor)) {
            return false;
        }

        return this.onEqual(pTarget as this);
    }

    /**
     * Determinate if declaration is a composite type.
     */
    protected abstract determinateIsComposite(): boolean;

    /**
     * Determinate if declaration is a constructable.
     */
    protected abstract determinateIsConstructable(): boolean;

    /**
     * Determinate if declaration has a fixed byte length.
     */
    protected abstract determinateIsFixed(): boolean;

    /**
     * Determinate if composite value with properties that can be access by index
     */
    protected abstract determinateIsIndexable(): boolean;

    /**
     * Determinate if declaration is a plain type.
     */
    protected abstract determinateIsPlain(): boolean;

    /**
     * Determinate if is sharable with the host.
     */
    protected abstract determinateIsShareable(): boolean;

    /**
     * Determinate if value is storable in a variable.
     */
    protected abstract determinateIsStorable(): boolean;

    /**
     * On equal check of type definitions.
     * 
     * @param pTarget - Target type definition.
     */
    protected abstract onEqual(pTarget: this): boolean;
}