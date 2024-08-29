import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslStringValueExpressionSyntaxTree } from '../../expression/single_value/pgsl-string-value-expression-syntax-tree';
import { PgslTextureTypeName } from '../enum/pgsl-texture-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from './pgsl-numeric-type-definition-syntax-tree';

export class PgslTextureTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslTextureTypeDefinitionSyntaxTreeStructureData> {
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
    public constructor(pData: PgslTextureTypeDefinitionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Bundled types.
        lAddType(PgslBuildInTypeName.Array, PgslValueType.Array, [
            ['Type'], ['Type', 'Expression']
        ]);

        // Image textures.
        lAddType(PgslBuildInTypeName.Texture1d, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.Texture2d, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.Texture2dArray, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.Texture3d, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureCube, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureCubeArray, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureMultisampled2d, PgslValueType.Texture, [
            ['Type']
        ]);

        // External tetures.
        lAddType(PgslBuildInTypeName.TextureExternal, PgslValueType.Texture,);

        // Storage textures.
        lAddType(PgslBuildInTypeName.TextureStorage1d, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureStorage2d, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureStorage2dArray, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureStorage3d, PgslValueType.Texture, [
            ['Type']
        ]);

        // Depth Textures.
        lAddType(PgslBuildInTypeName.TextureDepth2d, PgslValueType.Texture,);
        lAddType(PgslBuildInTypeName.TextureDepth2dArray, PgslValueType.Texture,);
        lAddType(PgslBuildInTypeName.TextureDepthCube, PgslValueType.Texture,);
        lAddType(PgslBuildInTypeName.TextureDepthCubeArray, PgslValueType.Texture,);
        lAddType(PgslBuildInTypeName.TextureDepthMultisampled2d, PgslValueType.Texture,);
    }

    /**
     * Determinate if declaration is a constructable.
     */
    protected determinateIsConstructable(): boolean {
        return false;
    }

    /**
     * Determinate if declaration has a fixed byte length.
     */
    protected determinateIsFixed(): boolean {
    }

    /**
     * Determinate if composite value with properties that can be access by index.
     */
    protected override determinateIsIndexable(): boolean {
        return false;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void { 
        // format?: PgslNumericTypeDefinitionSyntaxTree | PgslStringValueExpressionSyntaxTree,
        // access?: PgslStringValueExpressionSyntaxTree;
    }
}

export type PgslTextureTypeDefinitionSyntaxTreeStructureData = {
    typeName: PgslTextureTypeName;
    format?: BasePgslExpressionSyntaxTree,
    access?: BasePgslExpressionSyntaxTree;
};