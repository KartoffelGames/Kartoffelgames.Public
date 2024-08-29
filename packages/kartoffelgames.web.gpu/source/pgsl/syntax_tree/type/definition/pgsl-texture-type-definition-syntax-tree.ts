import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslAccessMode } from '../../../enum/pgsl-access-mode.enum';
import { PgslTexelFormat } from '../../../enum/pgsl-texel-format.enum';
import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslStringValueExpressionSyntaxTree } from '../../expression/single_value/pgsl-string-value-expression-syntax-tree';
import { PgslTextureTypeName } from '../enum/pgsl-texture-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from './pgsl-numeric-type-definition-syntax-tree';

export class PgslTextureTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslTextureTypeDefinitionSyntaxTreeStructureData> {
    private static readonly mTemplateMapping: Dictionary<PgslTextureTypeName, Array<typeof PgslNumericTypeDefinitionSyntaxTree | typeof PgslStringValueExpressionSyntaxTree>> = (() => {
        // Create mapping for all texture types.
        const lMapping: Dictionary<PgslTextureTypeName, Array<typeof PgslNumericTypeDefinitionSyntaxTree | typeof PgslStringValueExpressionSyntaxTree>> = new Dictionary<PgslTextureTypeName, Array<typeof PgslNumericTypeDefinitionSyntaxTree | typeof PgslStringValueExpressionSyntaxTree>>();

        // Textures.
        lMapping.set(PgslTextureTypeName.Texture1d, [PgslNumericTypeDefinitionSyntaxTree]);
        lMapping.set(PgslTextureTypeName.Texture2d, [PgslNumericTypeDefinitionSyntaxTree]);
        lMapping.set(PgslTextureTypeName.Texture2dArray, [PgslNumericTypeDefinitionSyntaxTree]);
        lMapping.set(PgslTextureTypeName.Texture3d, [PgslNumericTypeDefinitionSyntaxTree]);
        lMapping.set(PgslTextureTypeName.TextureCube, [PgslNumericTypeDefinitionSyntaxTree]);
        lMapping.set(PgslTextureTypeName.TextureCubeArray, [PgslNumericTypeDefinitionSyntaxTree]);
        lMapping.set(PgslTextureTypeName.TextureMultisampled2d, [PgslNumericTypeDefinitionSyntaxTree]);

        // External
        lMapping.set(PgslTextureTypeName.TextureExternal, []);

        // Depth texture.
        lMapping.set(PgslTextureTypeName.TextureDepth2d, []);
        lMapping.set(PgslTextureTypeName.TextureDepth2dArray, []);
        lMapping.set(PgslTextureTypeName.TextureDepthCube, []);
        lMapping.set(PgslTextureTypeName.TextureDepthCubeArray, []);
        lMapping.set(PgslTextureTypeName.TextureDepthMultisampled2d, []);

        // Storage texture.
        lMapping.set(PgslTextureTypeName.TextureStorage1d, [PgslStringValueExpressionSyntaxTree, PgslStringValueExpressionSyntaxTree]);
        lMapping.set(PgslTextureTypeName.TextureStorage2d, [PgslStringValueExpressionSyntaxTree, PgslStringValueExpressionSyntaxTree]);
        lMapping.set(PgslTextureTypeName.TextureStorage2dArray, [PgslStringValueExpressionSyntaxTree, PgslStringValueExpressionSyntaxTree]);
        lMapping.set(PgslTextureTypeName.TextureStorage3d, [PgslStringValueExpressionSyntaxTree, PgslStringValueExpressionSyntaxTree]);

        return lMapping;
    })();

    private mAccess: PgslAccessMode | null;
    private mFormat: PgslTexelFormat | null;
    private mSampledType: PgslNumericTypeDefinitionSyntaxTree | null;
    private readonly mTemplateList: Array<BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree>;
    private readonly mTextureType: PgslTextureTypeName;

    /**
     * Storage access mode.
     */
    public get access(): PgslAccessMode | null {
        this.ensureValidity();

        return this.mAccess;
    }

    /**
     * Textel format.
     */
    public get format(): PgslTexelFormat | null {
        this.ensureValidity();

        return this.mFormat;
    }

    /**
     * Sampled type.
     */
    public get sampledType(): PgslNumericTypeDefinitionSyntaxTree | null {
        this.ensureValidity();

        return this.mSampledType;
    }

    /**
     * Storage access mode.
     */
    public get textureType(): PgslTextureTypeName {
        return this.mTextureType;
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
    public constructor(pData: PgslTextureTypeDefinitionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mTextureType = pData.typeName;
        this.mTemplateList = pData.template ?? new Array<BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree>();

        // Set empty data.
        this.mSampledType = null;
        this.mFormat = null;
        this.mAccess = null;
    }

    /**
     * Determinate if declaration is a composite type.
     */
    protected override determinateIsComposite(): boolean {
        return false;
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
        return false;
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
        return false;
    }

    /**
     * Determinate if is sharable with the host.
     */
    protected override determinateIsShareable(): boolean {
        return false;
    }

    /**
     * Determinate if declaration is a storable type.
     */
    protected override determinateIsStorable(): boolean {
        return false;
    }

    /**
     * On equal check of type definitions.
     *
     * @param pTarget - Target type definition.
     */
    protected override onEqual(pTarget: this): boolean {
        // Same texture type.
        if (this.mTextureType !== pTarget.mTextureType) {
            return false;
        }

        // Same access mode.
        if (this.mAccess !== pTarget.access) {
            return false;
        }

        // Same format.
        if (this.mFormat !== pTarget.format) {
            return false;
        }

        // Same sampled type.
        if (this.mSampledType?.typeName !== pTarget.sampledType?.typeName) {
            return false;
        }

        return false;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        const lTextureTemplates: Array<typeof PgslNumericTypeDefinitionSyntaxTree | typeof PgslStringValueExpressionSyntaxTree> = PgslTextureTypeDefinitionSyntaxTree.mTemplateMapping.get(this.mTextureType)!;

        // Ensure same length.
        if (lTextureTemplates.length !== this.mTemplateList.length) {
            throw new Exception(`Texture type needs "${lTextureTemplates.length}" template parameter.`, this);
        }

        // Validate templates.
        for (let lTemplateIndex: number = 0; lTemplateIndex < lTextureTemplates.length; lTemplateIndex++) {
            const lExpectedParameterType: typeof PgslNumericTypeDefinitionSyntaxTree | typeof PgslStringValueExpressionSyntaxTree = lTextureTemplates[lTemplateIndex];
            const lActualParameterValue: BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree = this.mTemplateList[lTemplateIndex];

            // Validate parameter type.
            if (!(lActualParameterValue instanceof lExpectedParameterType)) {
                throw new Exception(`Wrong texture template parameter type.`, this);
            }

            // One parameter is allways a type, two parameters allways a string.
            if (lTextureTemplates.length === 1) {
                this.mSampledType = lActualParameterValue as PgslNumericTypeDefinitionSyntaxTree;
            } else {
                if (lTemplateIndex === 0) {
                    const lFormatString: PgslTexelFormat | undefined = EnumUtil.cast<PgslTexelFormat>(PgslTexelFormat, (<PgslStringValueExpressionSyntaxTree>lActualParameterValue).value);
                    if (!lFormatString) {
                        throw new Exception(`Unknown texel format.`, this);
                    }

                    this.mFormat = lFormatString;
                } else {
                    const lAccessModeString: PgslAccessMode | undefined = EnumUtil.cast<PgslAccessMode>(PgslAccessMode, (<PgslStringValueExpressionSyntaxTree>lActualParameterValue).value);
                    if (!lAccessModeString) {
                        throw new Exception(`Unknown access mode.`, this);
                    }

                    this.mAccess = lAccessModeString;
                }
            }
        }
    }
}

export type PgslTextureTypeDefinitionSyntaxTreeStructureData = {
    typeName: PgslTextureTypeName;
    template?: Array<BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree>;
};