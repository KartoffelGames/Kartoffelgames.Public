import { Dictionary } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeInitData } from '../../base-pgsl-syntax-tree';
import { PgslTypeName } from '../enum/pgsl-type-name.enum';

/**
 * PGSL base type definition.
 */
export abstract class BasePgslTypeDefinitionSyntaxTree<TData extends PgslSyntaxTreeInitData = PgslSyntaxTreeInitData> extends BasePgslSyntaxTree<TData> {
    protected static readonly mTypeCache: Dictionary<string, BasePgslTypeDefinitionSyntaxTree> = new Dictionary<string, BasePgslTypeDefinitionSyntaxTree>();

    private readonly mIdentifier: string;
    private mIsComposite: boolean | null;
    private mIsConstructable: boolean | null;
    private mIsFixed: boolean | null;
    private mIsIndexable: boolean | null;
    private mIsPlainType: boolean | null;
    private mIsShareable: boolean | null;
    private mIsStorable: boolean | null;
    private readonly mTypeName: PgslTypeName;

    // TODO: Add some type of caching.

    /**
     * Type identifier.
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
     * Type name of definition.
     */
    public get typeName(): PgslTypeName {
        return this.mTypeName;
    }

    /**
     * Constructor.
     * 
     * @param pTypeName - Typename.
     * @param pIdentifier - Unique identifier of type.
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pTypeName: PgslTypeName, pIdentifier: string, pData: TData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number, pBuildIn: boolean = false) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine, pBuildIn);

        // Set type name.
        this.mTypeName = pTypeName;
        this.mIdentifier = pIdentifier;

        // Set data default
        this.mIsComposite = null;
        this.mIsConstructable = null;
        this.mIsFixed = null;
        this.mIsIndexable = null;
        this.mIsShareable = null;
        this.mIsStorable = null;
        this.mIsPlainType = null;
    }

    /**
     * Check if set type is equal to this type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns if both declarations are equal.
     */
    public equals(pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        return pTarget.identifier === this.identifier;
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
}