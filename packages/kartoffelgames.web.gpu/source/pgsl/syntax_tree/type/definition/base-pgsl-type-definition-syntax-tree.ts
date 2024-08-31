import { BasePgslSyntaxTree, PgslSyntaxTreeInitData, SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { PgslTypeName } from '../enum/pgsl-type-name.enum';

/**
 * PGSL base type definition.
 */
export abstract class BasePgslTypeDefinitionSyntaxTree<TData extends PgslSyntaxTreeInitData = PgslSyntaxTreeInitData> extends BasePgslSyntaxTree<TData> {
    private readonly mIdentifier: string;
    private mIsComposite!: boolean | null;
    private mIsConstructable!: boolean | null;
    private mIsFixed!: boolean | null;
    private mIsIndexable!: boolean | null;
    private mIsPlainType!: boolean | null;
    private mIsShareable!: boolean | null;
    private mIsStorable!: boolean | null;
    // eslint-disable-next-line @typescript-eslint/prefer-readonly
    private mLoadedFromCache!: boolean;
    private readonly mTypeName!: PgslTypeName;

    /**
     * Structure unique identifier.
     */
    public get identifier(): string {
        return this.mIdentifier;
    }

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
     * When element was loaded from cache and not newly created.
     */
    public get loadedFromCache(): boolean {
        return this.mLoadedFromCache;
    }

    /**
     * Type name of definition.
     */
    public get typeName(): PgslTypeName {
        return this.mTypeName;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pTypeName - Base type name of definition.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: TData, pTypeName: PgslTypeName, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        // Call super and prevent reasigning empty data to cached structures.
        super(pData, pMeta, pBuildIn);

        // Load idenifier and check if a cached structure exists.
        this.mIdentifier = this.determinateIdentifier.call(null, pData);
        if (BasePgslSyntaxTree.mStructureCache.has(this.mIdentifier)) {
            const lCachedStructure: this = BasePgslSyntaxTree.mStructureCache.get(this.mIdentifier)! as this;
            lCachedStructure.mLoadedFromCache = true;

            return lCachedStructure;
        }

        // Set type name.
        this.mTypeName = pTypeName;

        // Set data default
        this.mLoadedFromCache = false;
        this.mIsComposite = null;
        this.mIsConstructable = null;
        this.mIsFixed = null;
        this.mIsIndexable = null;
        this.mIsShareable = null;
        this.mIsStorable = null;
        this.mIsPlainType = null;
    }

    /**
     * Check if set structure is equal to this structure.
     * 
     * @param pTarget - Target structure.
     * 
     * @returns if both structures are equal.
     */
    public equals(pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        return pTarget.identifier === this.identifier;
    }

    /**
     * Determinate structures identifier.
     */
    protected abstract determinateIdentifier(this: null, pData: TData): string;

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
}