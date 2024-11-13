import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslAccessMode } from '../../../enum/pgsl-access-mode.enum';
import { PgslTexelFormat } from '../../../enum/pgsl-texel-format.enum';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslStringValueExpressionSyntaxTree } from '../../expression/single_value/pgsl-string-value-expression-syntax-tree';
import { PgslBaseType } from '../enum/pgsl-base-type.enum';
import { PgslTextureTypeName } from '../enum/pgsl-texture-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree, PgslTypeDefinitionAttributes } from './base-pgsl-type-definition-syntax-tree';
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

    private readonly mTemplateList: Array<BasePgslExpressionSyntaxTree | BasePgslTypeDefinitionSyntaxTree>;
    private readonly mTextureType: PgslTextureTypeName;

    /**
     * Storage access mode.
     */
    public get access(): PgslAccessMode | null {
        this.ensureSetup();

        return this.setupData.data.access;
    }

    /**
     * Textel format.
     */
    public get format(): PgslTexelFormat | null {
        this.ensureSetup();

        return this.setupData.data.format;
    }

    /**
     * Sampled type.
     */
    public get sampledType(): PgslNumericTypeDefinitionSyntaxTree | null {
        this.ensureSetup();

        return this.setupData.data.sampledType;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pTextureType: PgslTextureTypeName, pTemplateList: Array<BasePgslExpressionSyntaxTree | BasePgslTypeDefinitionSyntaxTree>, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mTextureType = pTextureType;
        this.mTemplateList = pTemplateList;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    protected override isExplicitCastable(_pTarget: this): boolean {
        // A texture is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    protected override isImplicitCastable(_pTarget: this): boolean {
        // A texture is never explicit nor implicit castable.
        return false;
    }

    /**
     * Setup syntax tree.
     * 
     * @returns setup data.
     */
    protected override onSetup(): PgslTypeDefinitionAttributes<PgslTextureTypeDefinitionSyntaxTreeStructureData> {
        const lTextureTemplates: Array<typeof PgslNumericTypeDefinitionSyntaxTree | typeof PgslStringValueExpressionSyntaxTree> = PgslTextureTypeDefinitionSyntaxTree.mTemplateMapping.get(this.mTextureType)!;

        // Ensure same length.
        if (lTextureTemplates.length !== this.mTemplateList.length) {
            throw new Exception(`Texture type needs "${lTextureTemplates.length}" template parameter.`, this);
        }

        const lSetupData: PgslTextureTypeDefinitionSyntaxTreeStructureData = {
            access: null,
            format: null,
            sampledType: null,
        };

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
                lSetupData.sampledType = lActualParameterValue as unknown as PgslNumericTypeDefinitionSyntaxTree;
            } else {
                if (lTemplateIndex === 0) {
                    const lFormatString: PgslTexelFormat | undefined = EnumUtil.cast<PgslTexelFormat>(PgslTexelFormat, (<PgslStringValueExpressionSyntaxTree>lActualParameterValue).value);
                    if (!lFormatString) {
                        throw new Exception(`Unknown texel format.`, this);
                    }

                    lSetupData.format = lFormatString;
                } else {
                    const lAccessModeString: PgslAccessMode | undefined = EnumUtil.cast<PgslAccessMode>(PgslAccessMode, (<PgslStringValueExpressionSyntaxTree>lActualParameterValue).value);
                    if (!lAccessModeString) {
                        throw new Exception(`Unknown access mode.`, this);
                    }

                    lSetupData.access = lAccessModeString;
                }
            }
        }

        return {
            aliased: false,
            baseType: PgslBaseType.Texture,
            data: lSetupData,
            typeAttributes: {
                composite: false,
                constructable: true,
                fixed: false,
                indexable: false,
                plain: true,
                hostSharable: false,
                storable: true
            }
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: How can we move the validation out of 
    }
}

export type PgslTextureTypeDefinitionSyntaxTreeStructureData = {
    access: PgslAccessMode | null;
    format: PgslTexelFormat | null;
    sampledType: PgslNumericTypeDefinitionSyntaxTree | null;
};