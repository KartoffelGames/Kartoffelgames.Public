import { AbstractSyntaxTreeContext } from "../abstract_syntax_tree/abstract-syntax-tree-context.ts";
import { IExpressionAst } from "../abstract_syntax_tree/expression/i-expression-ast.interface.ts";
import { TypeDeclarationAst } from '../abstract_syntax_tree/general/type-declaration-ast.ts';
import { PgslAccessMode, PgslAccessModeEnum } from "../buildin/pgsl-access-mode-enum.ts";
import { PgslTexelFormat, PgslTexelFormatEnum } from "../buildin/pgsl-texel-format-enum.ts";
import { PgslExpressionTrace } from "../trace/pgsl-expression-trace.ts";
import type { PgslTrace } from '../trace/pgsl-trace.ts';
import { PgslNumericType } from './pgsl-numeric-type.ts';
import { PgslStringType } from "./pgsl-string-type.ts";
import { PgslType, type PgslTypeProperties } from './pgsl-type.ts';

/**
 * Texture type definition.
 * Represents various texture types used in graphics shaders with their template parameters.
 * Supports regular textures, depth textures, and storage textures with appropriate validation.
 * 
 * @example
 * ```typescript
 * // Regular texture with sampled type
 * const texture2d = new PgslTextureType(trace, 'Texture2d', [numericType]);
 * 
 * // Storage texture with format and access mode
 * const storage2d = new PgslTextureType(trace, 'TextureStorage2d', [formatString, accessString]);
 * 
 * // Depth texture (no parameters)
 * const depth = new PgslTextureType(trace, 'TextureDepth2d', []);
 * ```
 */
export class PgslTextureType extends PgslType {
    /**
     * Static mapping of texture types to their expected template parameter types.
     * Used for validation during texture type construction.
     */
    private static readonly mTemplateMapping: Map<PgslTextureTypeName, Array<'type' | 'string'>> = (() => {
        // Create mapping for all texture types.
        const lMapping: Map<PgslTextureTypeName, Array<'type' | 'string'>> = new Map<PgslTextureTypeName, Array<'type' | 'string'>>();

        // Regular textures - require a sampled type parameter.
        lMapping.set(PgslTextureType.typeName.texture1d, ['type']);
        lMapping.set(PgslTextureType.typeName.texture2d, ['type']);
        lMapping.set(PgslTextureType.typeName.texture2dArray, ['type']);
        lMapping.set(PgslTextureType.typeName.texture3d, ['type']);
        lMapping.set(PgslTextureType.typeName.textureCube, ['type']);
        lMapping.set(PgslTextureType.typeName.textureCubeArray, ['type']);
        lMapping.set(PgslTextureType.typeName.textureMultisampled2d, ['type']);

        // External texture - no parameters.
        lMapping.set(PgslTextureType.typeName.textureExternal, []);

        // Depth textures - no parameters.
        lMapping.set(PgslTextureType.typeName.textureDepth2d, []);
        lMapping.set(PgslTextureType.typeName.textureDepth2dArray, []);
        lMapping.set(PgslTextureType.typeName.textureDepthCube, []);
        lMapping.set(PgslTextureType.typeName.textureDepthCubeArray, []);
        lMapping.set(PgslTextureType.typeName.textureDepthMultisampled2d, []);

        // Storage textures - require format and access mode string parameters.
        lMapping.set(PgslTextureType.typeName.textureStorage1d, ['string', 'string']);
        lMapping.set(PgslTextureType.typeName.textureStorage2d, ['string', 'string']);
        lMapping.set(PgslTextureType.typeName.textureStorage2dArray, ['string', 'string']);
        lMapping.set(PgslTextureType.typeName.textureStorage3d, ['string', 'string']);

        return lMapping;
    })();

    /**
     * Type names for different texture variants.
     * Maps texture type names to their string representations.
     */
    public static get typeName() {
        return {
            // Regular textures.
            texture1d: 'Texture1d',
            texture2d: 'Texture2d',
            texture2dArray: 'Texture2dArray',
            texture3d: 'Texture3d',
            textureCube: 'TextureCube',
            textureCubeArray: 'TextureCubeArray',
            textureMultisampled2d: 'TextureMultisampled2d',
            textureExternal: 'TextureExternal',

            // Depth textures.
            textureDepth2d: 'TextureDepth2d',
            textureDepth2dArray: 'TextureDepth2dArray',
            textureDepthCube: 'TextureDepthCube',
            textureDepthCubeArray: 'TextureDepthCubeArray',
            textureDepthMultisampled2d: 'TextureDepthMultisampled2d',

            // Storage textures.
            textureStorage1d: 'TextureStorage1d',
            textureStorage2d: 'TextureStorage2d',
            textureStorage2dArray: 'TextureStorage2dArray',
            textureStorage3d: 'TextureStorage3d'
        } as const;
    }

    /**
     * Checks if a texture type is a storage texture.
     * 
     * @param pTextureType - Texture type.
     * 
     * @returns True if the texture type is a storage texture, false otherwise.
     */
    public static isStorageTextureType(pTextureType: PgslTextureTypeName): boolean {
        return pTextureType === PgslTextureType.typeName.textureStorage1d ||
            pTextureType === PgslTextureType.typeName.textureStorage2d ||
            pTextureType === PgslTextureType.typeName.textureStorage2dArray ||
            pTextureType === PgslTextureType.typeName.textureStorage3d;
    }

    private readonly mTemplateList: Array<IExpressionAst | TypeDeclarationAst>;
    private readonly mTextureType: PgslTextureTypeName;
    private readonly mAccess: PgslAccessMode;
    private readonly mFormat: PgslTexelFormat;
    private readonly mSampledType: PgslType;

    /**
     * Gets the texture type variant.
     * 
     * @returns The texture type name.
     */
    public get textureType(): PgslTextureTypeName {
        return this.mTextureType;
    }

    /**
     * Gets the texel format for storage textures.
     * 
     * @returns The texel format.
     */
    public get format(): PgslTexelFormat {
        return this.mFormat;
    }

    /**
     * Gets the sampled type for regular textures.
     * 
     * @returns The sampled type.
     */
    public get sampledType(): PgslType {
        return this.mSampledType;
    }

    /**
     * Gets the access mode for storage textures.
     * 
     * @returns The access mode.
     */
    public get access(): PgslAccessMode {
        return this.mAccess;
    }

    /**
     * Constructor for texture type.
     * 
     * @param pContext - The context for validation and error reporting.
     * @param pTextureType - The specific texture type variant.
     * @param pTemplateList - Template parameters for the texture (varies by texture type).
     */
    public constructor(pContext: AbstractSyntaxTreeContext, pTextureType: PgslTextureTypeName, pTemplateList: Array<IExpressionAst | TypeDeclarationAst>) {
        super(pContext);

        // Set data.
        this.mTextureType = pTextureType;
        this.mTemplateList = pTemplateList;

        // Parse template parameters and validate them.
        const lTextureParameter: PgslTextureTypeParameter = this.parseTextureParameter(pContext);
        this.mAccess = lTextureParameter.access;
        this.mFormat = lTextureParameter.format;
        this.mSampledType = lTextureParameter.sampledType;
    }

    /**
     * Compare this texture type with a target type for equality.
     * Two texture types are equal if they have the same texture variant,
     * access mode, format, and sampled type.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types describe the same texture type.
     */
    public override equals(pTarget: PgslType): boolean {
        // Must both be texture types.
        if (!(pTarget instanceof PgslTextureType)) {
            return false;
        }

        // Texture types must be the same.
        if (this.mTextureType !== pTarget.mTextureType) {
            return false;
        }

        // Access and format data must be equal.
        if (this.access !== pTarget.access || this.format !== pTarget.format) {
            return false;
        }

        // Sampled type must be set equal to null or both must be non-null.
        if (this.sampledType === null && pTarget.sampledType !== null || this.sampledType !== null && pTarget.sampledType === null) {
            return false;
        }

        // Sampled type must be equal if both are non-null.
        if (pTarget.sampledType !== null && !this.sampledType!.equals(pTarget.sampledType)) {
            return false;
        }

        return true;
    }

    /**
     * Check if this texture type is explicitly castable into the target type.
     * Texture types are never castable to other types.
     * 
     * @param _pTarget - Target type to check castability to.
     * 
     * @returns Always false - textures cannot be cast.
     */
    public override isExplicitCastableInto(_pTarget: PgslType): boolean {
        // A texture is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if this texture type is implicitly castable into the target type.
     * Texture types are never castable to other types.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns Always false - textures cannot be cast.
     */
    public override isImplicitCastableInto(pTarget: PgslType): boolean {
        // A texture is never explicit nor implicit castable.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for texture types.
     * Textures are storable, concrete, but not constructible or hostShareable.
     * 
     * @param _pContext - Context (unused for texture properties).
     * 
     * @returns Type properties defining texture characteristics.
     */
    protected override process(_pContext: AbstractSyntaxTreeContext): PgslTypeProperties {
        return {
            composite: false,
            indexable: false,
            storable: true,
            hostShareable: false,
            constructible: false,
            fixedFootprint: false,
            concrete: true,
            scalar: false,
            plain: false,
        };
    }

    /**
     * Parses and validates texture template parameters based on the texture type.
     * Validates parameter count and types, then extracts the relevant information.
     * 
     * @param pContext - Trace context for error reporting.
     * 
     * @returns Parsed texture parameters with defaults for missing values.
     */
    private parseTextureParameter(pContext: AbstractSyntaxTreeContext): PgslTextureTypeParameter {
        const lTextureTemplates: Array<'type' | 'string'> = PgslTextureType.mTemplateMapping.get(this.mTextureType)!;

        // Ensure template parameter count matches expected count.
        if (lTextureTemplates.length !== this.mTemplateList.length) {
            pContext.pushIncident(`Texture type needs "${lTextureTemplates.length}" template parameter.`);
        }

        // Prepare type parameter with sensible defaults.
        const lTypeParameter: PgslTextureTypeParameter = {
            access: PgslAccessModeEnum.values.Read,
            format: PgslTexelFormatEnum.values.Bgra8unorm,
            sampledType: new PgslNumericType(pContext, PgslNumericType.typeName.float32)
        };

        // Validate and parse each template parameter.
        for (let lTemplateIndex: number = 0; lTemplateIndex < lTextureTemplates.length; lTemplateIndex++) {
            const lExpectedParameterType: 'type' | 'string' = lTextureTemplates[lTemplateIndex];
            const lActualParameterValue: TypeDeclarationAst | IExpressionAst = this.mTemplateList[lTemplateIndex];

            // Validate parameter type matches expected type.
            switch (lExpectedParameterType) {
                case 'type': {
                    if (!(lActualParameterValue instanceof TypeDeclarationAst)) {
                        pContext.pushIncident(`Texture template parameter ${lTemplateIndex + 1} must be a type declaration.`);
                        continue
                    }
                    break;
                }
                case 'string': {
                    if (!('resolveType' in lActualParameterValue.data)) {
                        pContext.pushIncident(`Texture template parameter ${lTemplateIndex + 1} must be a string value expression.`);
                        continue;
                    }
                
                    if (!(lActualParameterValue.data.resolveType instanceof PgslStringType)) {
                        pContext.pushIncident(`Texture template parameter ${lTemplateIndex + 1} must be a string value expression.`);
                        continue
                    }
                    break;
                }
            }

            // Parse parameter based on expected count:
            // One parameter is always a type, two parameters are always strings.
            if (lTextureTemplates.length === 1) {
                // Single parameter: sampled type for regular textures.
                const lTypeDefinition: TypeDeclarationAst = lActualParameterValue as TypeDeclarationAst;
                lTypeParameter.sampledType = lTypeDefinition.data.type;

                // TODO: Change format based on sampled type for regular textures.
            } else {
                // Two parameters: format and access mode strings for storage textures.
                const lStringValueExpression: IExpressionAst = lActualParameterValue as IExpressionAst;

                const lStringValue: string | number | null = lStringValueExpression.data.constantValue;
                if (typeof lStringValue !== 'string') {
                    pContext.pushIncident(`Texture template parameter ${lTemplateIndex + 1} must be a string value expression.`);
                    continue;
                }

                if (lTemplateIndex === 0) {
                    // First parameter: texel format.
                    if (PgslTexelFormatEnum.containsValue(lStringValue)) {
                        lTypeParameter.format = lStringValue;
                    } else {
                        pContext.pushIncident(`Unknown texel format: "${lStringValue}".`);
                    }
                } else {
                    // Second parameter: access mode.
                    if (PgslAccessModeEnum.containsValue(lStringValue)) {
                        lTypeParameter.access = lStringValue;
                    } else {
                        pContext.pushIncident(`Unknown access mode: "${lStringValue}".`);
                    }
                }

                // TODO: sampled Type based on format for storage textures.
            }
        }

        return lTypeParameter;
    }
}

/**
 * Parameters that define texture type characteristics.
 * Contains access mode, format, and sampled type information.
 */
type PgslTextureTypeParameter = {
    access: PgslAccessMode;
    format: PgslTexelFormat;
    sampledType: PgslType;
};

/**
 * Type representing all available texture type names.
 * Derived from the static typeName getter for type safety.
 */
export type PgslTextureTypeName = (typeof PgslTextureType.typeName)[keyof typeof PgslTextureType.typeName];