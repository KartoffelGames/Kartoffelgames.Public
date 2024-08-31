import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { PgslStructDeclarationSyntaxTree } from '../../declaration/pgsl-struct-declaration-syntax-tree';
import { PgslTypeName } from '../enum/pgsl-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';

export class PgslStructTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslStructTypeDefinitionSyntaxTreeStructureData> {
    private readonly mStruct!: PgslStructDeclarationSyntaxTree;

    /**
     * Struct declaration of type.
     */
    public get struct(): PgslStructDeclarationSyntaxTree {
        return this.mStruct;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslStructTypeDefinitionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pData, PgslTypeName.Struct, pMeta, pBuildIn);
        if (this.loadedFromCache) {
            return this;
        }

        // Set data.
        this.mStruct = pData.struct;
    }

    /**
     * Determinate structures identifier.
     */
    protected determinateIdentifier(this: null, pData: PgslStructTypeDefinitionSyntaxTreeStructureData): string {
        return `ID:TYPE-DEF_STRUCT->${pData.struct.name.toUpperCase()}`;
    }

    /**
     * Determinate if declaration is a composite type.
     */
    protected override determinateIsComposite(): boolean {
        return true;
    }

    /**
     * Determinate if declaration is a constructable.
     */
    protected determinateIsConstructable(): boolean {
        // Only when all members are constructable
        for (const lProperty of this.mStruct.properties) {
            if (!lProperty.type.isConstructable) {
                return false;
            }
        }

        return true;
    }

    /**
     * Determinate if declaration has a fixed byte length.
     */
    protected determinateIsFixed(): boolean {
        // Only when all members are fixed.
        if (this.mStruct.properties.length === 0) {
            return true;
        }

        // Only the last member can be a variable size.
        return this.mStruct.properties.at(-1)!.type.isFixed;
    }

    /**
     * Determinate if composite value with properties that can be access by index.
     */
    protected override determinateIsIndexable(): boolean {
        return false;
    }

    /**
     * Determinate if declaration is a plain type.
     */
    protected override determinateIsPlain(): boolean {
        return true;
    }

    /**
     * Determinate if is sharable with the host.
     */
    protected override determinateIsShareable(): boolean {
        // Only when all members are sharable.
        for (const lProperty of this.mStruct.properties) {
            if (!lProperty.type.isShareable) {
                return false;
            }
        }

        return true;
    }

    /**
     * Determinate if value is storable in a variable.
     */
    protected override determinateIsStorable(): boolean {
        return true;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void { }
}

export type PgslStructTypeDefinitionSyntaxTreeStructureData = {
    struct: PgslStructDeclarationSyntaxTree;
};