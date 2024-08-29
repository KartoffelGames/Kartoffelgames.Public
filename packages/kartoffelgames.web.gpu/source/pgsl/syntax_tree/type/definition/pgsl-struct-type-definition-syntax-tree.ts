import { PgslStructDeclarationSyntaxTree } from '../../declaration/pgsl-struct-declaration-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';

export class PgslStructTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslStructTypeDefinitionSyntaxTreeStructureData> {
    private readonly mStruct: PgslStructDeclarationSyntaxTree;

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
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslStructTypeDefinitionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mStruct = pData.struct;
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
     * On equal check of type definitions.
     * 
     * @param pTarget - Target type definition.
     */
    protected override onEqual(pTarget: this): boolean {
        return this.mStruct === pTarget.struct;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void { }
}

export type PgslStructTypeDefinitionSyntaxTreeStructureData = {
    struct: PgslStructDeclarationSyntaxTree;
};