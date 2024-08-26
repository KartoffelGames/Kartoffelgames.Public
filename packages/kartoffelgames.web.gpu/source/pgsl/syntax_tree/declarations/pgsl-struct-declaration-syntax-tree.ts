import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree';
import { PgslStructPropertyDeclarationSyntaxTree } from './pgsl-struct-property-declaration-syntax-tree';

/**
 * PGSL syntax tree for a struct declaration.
 */
export class PgslStructDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<PgslStructDeclarationSyntaxTreeStructureData> {
    private mIsConstructible: boolean | null;
    private readonly mName: string;
    private readonly mProperties: Array<PgslStructPropertyDeclarationSyntaxTree>;
    
    /**
     * Type is a constructible type.
     */
    public get isConstructible(): boolean {
        this.ensureValidity();

        // Determine if type is a construtable type.
        if (this.mIsConstructible === null) {
            this.mIsConstructible = this.determineConstructible();
        }

        return this.mIsConstructible;
    }

    /**
     * If struct has a fixed byte length.
     */
    public get isFixed(): boolean {
        if (this.mProperties.length === 0) {
            return true;
        }

        return this.mProperties.at(-1)!.type.isFixed;
    }

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Variable name.
     */
    public get properties(): Array<PgslStructPropertyDeclarationSyntaxTree> {
        return this.mProperties;
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
    public constructor(pData: PgslStructDeclarationSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pData.attributes, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mName = pData.name;
        this.mProperties = pData.properties;
        this.mIsConstructible = null;
    }

    /**
     * Determinate if declaration is a constant.
     */
    protected determinateIsConstant(): boolean {
        return true;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Scalar, Vector, Matrix, Atomic, Fixed arrays. Fixed structs

        // TODO: Only types with fixed footprints but allow it as last property but then the struct is no longer fixed.

        // TODO: 
    }

    private determineConstructible(): boolean {
        for (const lProperty of this.mProperties.values()) {
            if (!lProperty.type.isConstructible) {
                return false;
            }
        }

        return true;
    }
}

export type PgslStructDeclarationSyntaxTreeStructureData = {
    attributes: PgslAttributeListSyntaxTree;
    name: string;
    properties: Array<PgslStructPropertyDeclarationSyntaxTree>;
};