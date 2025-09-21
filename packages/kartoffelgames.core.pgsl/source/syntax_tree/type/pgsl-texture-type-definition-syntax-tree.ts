import { Dictionary, EnumUtil } from '@kartoffelgames/core';
import { PgslAccessMode, PgslAccessModeEnumDeclaration } from "../../buildin/pgsl-access-mode-enum-declaration.ts";
import { PgslTexelFormat } from "../../enum/pgsl-texel-format.enum.ts";
import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree } from "../expression/base-pgsl-expression-syntax-tree.ts";
import { PgslStringValueExpressionSyntaxTree } from "../expression/single_value/pgsl-string-value-expression-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";
import { PgslTextureTypeName } from "./enum/pgsl-texture-type-name.enum.ts";
import { PgslNumericTypeDefinitionSyntaxTree } from './pgsl-numeric-type-definition-syntax-tree.ts';

// TODO: Texture template validation is broken when using enums.

export class PgslTextureTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslTextureTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
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

        // Add any template syntax tree as child.
        for (const lTemplate of this.mTemplateList) {
            this.appendChild(lTemplate);
        }
    }

    /**
     * Transpile the texture type to its string representation.
     * 
     * @returns Transpiled wgsl code.
     */
    protected override onTranspile(): string {
        const lTextureTypeName: string = (() => {
            switch (this.mTextureType) {
                case PgslTextureTypeName.Texture1d:
                    return 'texture_1d';
                case PgslTextureTypeName.Texture2d:
                    return 'texture_2d';
                case PgslTextureTypeName.Texture2dArray:
                    return 'texture_2d_array';
                case PgslTextureTypeName.Texture3d:
                    return 'texture_3d';
                case PgslTextureTypeName.TextureCube:
                    return 'texture_cube';
                case PgslTextureTypeName.TextureCubeArray:
                    return 'texture_cube_array';
                case PgslTextureTypeName.TextureMultisampled2d:
                    return 'texture_multisampled_2d';
                case PgslTextureTypeName.TextureExternal:
                    return 'texture_external';
                case PgslTextureTypeName.TextureDepth2d:
                    return 'texture_depth_2d';
                case PgslTextureTypeName.TextureDepth2dArray:
                    return 'texture_depth_2d_array';
                case PgslTextureTypeName.TextureDepthCube:
                    return 'texture_depth_cube';
                case PgslTextureTypeName.TextureDepthCubeArray:
                    return 'texture_depth_cube_array';
                case PgslTextureTypeName.TextureDepthMultisampled2d:
                    return 'texture_depth_multisampled_2d';
                case PgslTextureTypeName.TextureStorage1d:
                    return 'texture_storage_1d';
                case PgslTextureTypeName.TextureStorage2d:
                    return 'texture_storage_2d';
                case PgslTextureTypeName.TextureStorage2dArray:
                    return 'texture_storage_2d_array';
                case PgslTextureTypeName.TextureStorage3d:
                    return 'texture_storage_3d';
            }
        })();

        // Transpile template parameters.
        const lTemplateParameters: string = this.mTemplateList.map((pTemplate: BasePgslExpressionSyntaxTree | BasePgslTypeDefinitionSyntaxTree) => {
            return pTemplate.transpile();
        }).join(', ');

        // Add template parameters when available.
        if (lTemplateParameters.length > 0) {
            return `${lTextureTypeName}<${lTemplateParameters}>`;
        }

        return lTextureTypeName;
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both types describes the same type.
     */
    public override equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Read attachments from this and target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);

        // Must both be a sampler.
        if (lTargetAttachment.baseType !== PgslBaseTypeName.Texture) {
            return false;
        }

        const lThisTextureTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslTextureTypeDefinitionSyntaxTreeAdditionalAttachmentData> = pValidationTrace.getAttachment(this);
        const lTargetTextureTypeAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslTextureTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        // Access and format data must be equal.
        if (lThisTextureTypeAttachment.access !== lTargetTextureTypeAttachment.access || lThisTextureTypeAttachment.format !== lTargetTextureTypeAttachment.format) {
            return false;
        }

        // Sampled type must be set equal to null.
        if (lThisTextureTypeAttachment.sampledType === null && lTargetTextureTypeAttachment.sampledType !== null || lThisTextureTypeAttachment.sampledType !== null && lTargetTextureTypeAttachment.sampledType === null) {
            return false;
        }

        // Sampled type must be equal.
        if (lTargetTextureTypeAttachment.sampledType !== null && !lThisTextureTypeAttachment.sampledType!.equals(pValidationTrace, lTargetTextureTypeAttachment.sampledType)) {
            return false;
        }

        return true;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    public override isExplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // A texture is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    public override isImplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // A texture is never explicit nor implicit castable.
        return false;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pValidationTrace - Validation trace to use.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslTextureTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
        // Validate template parameters.
        for (const lTemplate of this.mTemplateList) {
            lTemplate.validate(pValidationTrace);
        }

        const lTextureTemplates: Array<typeof PgslNumericTypeDefinitionSyntaxTree | typeof PgslStringValueExpressionSyntaxTree> = PgslTextureTypeDefinitionSyntaxTree.mTemplateMapping.get(this.mTextureType)!;

        // Ensure same length.
        if (lTextureTemplates.length !== this.mTemplateList.length) {
            pValidationTrace.pushError(`Texture type needs "${lTextureTemplates.length}" template parameter.`, this.meta, this);
        }

        const lAdditionalAttachmentData: PgslTextureTypeDefinitionSyntaxTreeAdditionalAttachmentData = {
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
                pValidationTrace.pushError(`Texture template parameter ${lTemplateIndex + 1} must be of type "${lExpectedParameterType.name}".`, this.meta, this);
            }

            // One parameter is allways a type, two parameters allways a string.
            if (lTextureTemplates.length === 1) {
                lAdditionalAttachmentData.sampledType = lActualParameterValue as unknown as PgslNumericTypeDefinitionSyntaxTree;
            } else {
                // We asume that is a string so we can read its value.
                const lStringValueExpression: PgslStringValueExpressionSyntaxTree = lActualParameterValue as unknown as PgslStringValueExpressionSyntaxTree;

                if (lTemplateIndex === 0) {
                    const lFormatString: PgslTexelFormat | undefined = EnumUtil.cast<PgslTexelFormat>(PgslTexelFormat, lStringValueExpression.value);
                    if (!lFormatString) {
                        pValidationTrace.pushError(`Unknown texel format.`, this.meta, this);
                    }

                    lAdditionalAttachmentData.format = lFormatString ?? PgslTexelFormat.Bgra8unorm;
                } else {
                    if (PgslAccessModeEnumDeclaration.containsValue(lStringValueExpression.value)) {
                        lAdditionalAttachmentData.access = lStringValueExpression.value;
                        
                    } else {
                        // Add error and default to read access.
                        pValidationTrace.pushError(`Unknown access mode.`, this.meta, this);
                        lAdditionalAttachmentData.access = PgslAccessMode.Read;
                    }
                }
            }
        }

        return {
            baseType: PgslBaseTypeName.Texture,
            composite: false,
            indexable: false,
            storable: true,
            hostShareable: false,
            constructible: false,
            fixedFootprint: false,
            concrete: true,
            scalar: false,
            plain: false,

            // Merge additional data.
            ...lAdditionalAttachmentData,
        };
    }
}

export type PgslTextureTypeDefinitionSyntaxTreeAdditionalAttachmentData = {
    access: PgslAccessMode | null;
    format: PgslTexelFormat | null;
    sampledType: PgslNumericTypeDefinitionSyntaxTree | null;
};