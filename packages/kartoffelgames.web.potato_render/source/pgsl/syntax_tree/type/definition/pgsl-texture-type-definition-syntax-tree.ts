import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslAccessMode } from '../../../enum/pgsl-access-mode.enum';
import { PgslTexelFormat } from '../../../enum/pgsl-texel-format.enum';
import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslStringValueExpressionSyntaxTree } from '../../expression/single_value/pgsl-string-value-expression-syntax-tree';
import { PgslTextureTypeName } from '../enum/pgsl-texture-type-name.enum';
import { PgslTypeName } from '../enum/pgsl-type-name.enum';
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

    private mAccess!: PgslAccessMode | null;
    private mFormat!: PgslTexelFormat | null;
    private mSampledType!: PgslNumericTypeDefinitionSyntaxTree | null;
    private readonly mTemplateList!: Array<BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree>;

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
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslTextureTypeDefinitionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pData, pData.typeName as unknown as PgslTypeName, pMeta, pBuildIn);
        if (this.loadedFromCache) {
            return this;
        }

        // Set data.
        this.mTemplateList = pData.template ?? new Array<BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree>();

        // Set empty data.
        this.mSampledType = null;
        this.mFormat = null;
        this.mAccess = null;
    }

    /**
     * Determinate structures identifier.
     */
    protected determinateIdentifier(this: null, pData: PgslTextureTypeDefinitionSyntaxTreeStructureData): string {
        // Convert template list into identifier list.
        const lTemplateListIdentifier: string = pData.template?.map<string>((pParameter) => {
            if (pParameter instanceof PgslStringValueExpressionSyntaxTree) {
                return pParameter.value;
            }

            if (pParameter instanceof BasePgslTypeDefinitionSyntaxTree) {
                return pParameter.identifier;
            }

            return 'NULL';
        }).join(', ') ?? '';

        // Create identifier
        return `ID:TYPE-DEF_TEXTURE->${pData.typeName.toUpperCase()}->[${lTemplateListIdentifier}]`;
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
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        const lTextureTemplates: Array<typeof PgslNumericTypeDefinitionSyntaxTree | typeof PgslStringValueExpressionSyntaxTree> = PgslTextureTypeDefinitionSyntaxTree.mTemplateMapping.get(this.typeName as unknown as PgslTextureTypeName)!;

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