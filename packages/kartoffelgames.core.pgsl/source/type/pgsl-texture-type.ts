import { PgslAccessModeEnumDeclaration } from '../syntax_tree/buildin/pgsl-access-mode-enum-declaration.ts';
import { PgslAccessMode } from '../syntax_tree/buildin/pgsl-access-mode.enum.ts';
import { PgslTexelFormatEnumDeclaration } from '../syntax_tree/buildin/pgsl-texel-format-enum-declaration.ts';
import { PgslTexelFormat } from '../syntax_tree/buildin/pgsl-texel-format.enum.ts';
import type { PgslExpression } from '../syntax_tree/expression/pgsl-expression.ts';
import { PgslStringValueExpression } from '../syntax_tree/expression/single_value/pgsl-string-value-expression.ts';
import { PgslTypeDeclaration } from '../syntax_tree/general/pgsl-type-declaration.ts';
import type { PgslTrace } from '../trace/pgsl-trace.ts';
import { PgslNumericType } from './pgsl-numeric-type.ts';
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
    private static readonly mTemplateMapping: Map<PgslTextureTypeName, Array<typeof PgslTypeDeclaration | typeof PgslStringValueExpression>> = (() => {
        // Create mapping for all texture types.
        const lMapping: Map<PgslTextureTypeName, Array<typeof PgslTypeDeclaration | typeof PgslStringValueExpression>> = new Map<PgslTextureTypeName, Array<typeof PgslTypeDeclaration | typeof PgslStringValueExpression>>();

        // Regular textures - require a sampled type parameter.
        lMapping.set(PgslTextureType.typeName.texture1d, [PgslTypeDeclaration]);
        lMapping.set(PgslTextureType.typeName.texture2d, [PgslTypeDeclaration]);
        lMapping.set(PgslTextureType.typeName.texture2dArray, [PgslTypeDeclaration]);
        lMapping.set(PgslTextureType.typeName.texture3d, [PgslTypeDeclaration]);
        lMapping.set(PgslTextureType.typeName.textureCube, [PgslTypeDeclaration]);
        lMapping.set(PgslTextureType.typeName.textureCubeArray, [PgslTypeDeclaration]);
        lMapping.set(PgslTextureType.typeName.textureMultisampled2d, [PgslTypeDeclaration]);

        // External texture - no parameters.
        lMapping.set(PgslTextureType.typeName.textureExternal, []);

        // Depth textures - no parameters.
        lMapping.set(PgslTextureType.typeName.textureDepth2d, []);
        lMapping.set(PgslTextureType.typeName.textureDepth2dArray, []);
        lMapping.set(PgslTextureType.typeName.textureDepthCube, []);
        lMapping.set(PgslTextureType.typeName.textureDepthCubeArray, []);
        lMapping.set(PgslTextureType.typeName.textureDepthMultisampled2d, []);

        // Storage textures - require format and access mode string parameters.
        lMapping.set(PgslTextureType.typeName.textureStorage1d, [PgslStringValueExpression, PgslStringValueExpression]);
        lMapping.set(PgslTextureType.typeName.textureStorage2d, [PgslStringValueExpression, PgslStringValueExpression]);
        lMapping.set(PgslTextureType.typeName.textureStorage2dArray, [PgslStringValueExpression, PgslStringValueExpression]);
        lMapping.set(PgslTextureType.typeName.textureStorage3d, [PgslStringValueExpression, PgslStringValueExpression]);

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

    private readonly mTemplateList: Array<PgslExpression | PgslTypeDeclaration>;
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
     * @param pTrace - The trace context for validation and error reporting.
     * @param pTextureType - The specific texture type variant.
     * @param pTemplateList - Template parameters for the texture (varies by texture type).
     */
    public constructor(pTrace: PgslTrace, pTextureType: PgslTextureTypeName, pTemplateList: Array<PgslExpression | PgslTypeDeclaration>) {
        super(pTrace);

        // Set data.
        this.mTextureType = pTextureType;
        this.mTemplateList = pTemplateList;

        // Parse template parameters and validate them.
        const lTextureParameter: PgslTextureTypeParameter = this.parseTextureParameter(pTrace);
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
     * @param _pTrace - Trace context (unused for texture properties).
     * 
     * @returns Type properties defining texture characteristics.
     */
    protected override onTypePropertyCollection(_pTrace: PgslTrace): PgslTypeProperties {
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
     * @param pTrace - Trace context for error reporting.
     * 
     * @returns Parsed texture parameters with defaults for missing values.
     */
    private parseTextureParameter(pTrace: PgslTrace): PgslTextureTypeParameter {
        const lTextureTemplates: Array<typeof PgslTypeDeclaration | typeof PgslStringValueExpression> = PgslTextureType.mTemplateMapping.get(this.mTextureType)!;

        // Ensure template parameter count matches expected count.
        if (lTextureTemplates.length !== this.mTemplateList.length) {
            pTrace.pushIncident(`Texture type needs "${lTextureTemplates.length}" template parameter.`);
        }

        // Prepare type parameter with sensible defaults.
        const lTypeParameter: PgslTextureTypeParameter = {
            access: PgslAccessMode.Read,
            format: PgslTexelFormat.Bgra8unorm,
            sampledType: new PgslNumericType(pTrace, PgslNumericType.typeName.float32)
        };

        // Validate and parse each template parameter.
        for (let lTemplateIndex: number = 0; lTemplateIndex < lTextureTemplates.length; lTemplateIndex++) {
            const lExpectedParameterType: typeof PgslTypeDeclaration | typeof PgslStringValueExpression = lTextureTemplates[lTemplateIndex];
            const lActualParameterValue: PgslTypeDeclaration | PgslExpression = this.mTemplateList[lTemplateIndex];

            // Validate parameter type matches expected type.
            if (!(lActualParameterValue instanceof lExpectedParameterType)) {
                pTrace.pushIncident(`Texture template parameter ${lTemplateIndex + 1} must be of type "${lExpectedParameterType.name}".`);
                continue;
            }

            // Parse parameter based on expected count:
            // One parameter is always a type, two parameters are always strings.
            if (lTextureTemplates.length === 1) {
                // Single parameter: sampled type for regular textures.
                const lTypeDefinition: PgslTypeDeclaration = lActualParameterValue as PgslTypeDeclaration;
                lTypeParameter.sampledType = lTypeDefinition.type;

                // TODO: Change format based on sampled type for regular textures.
            } else {
                // Two parameters: format and access mode strings for storage textures.
                const lStringValueExpression: PgslStringValueExpression = lActualParameterValue as PgslStringValueExpression;

                if (lTemplateIndex === 0) {
                    // First parameter: texel format.
                    const lFormatString: string = lStringValueExpression.value;
                    if (PgslTexelFormatEnumDeclaration.containsValue(lFormatString)) {
                        lTypeParameter.format = lFormatString;
                    } else {
                        pTrace.pushIncident(`Unknown texel format: "${lFormatString}".`);
                    }
                } else {
                    // Second parameter: access mode.
                    if (PgslAccessModeEnumDeclaration.containsValue(lStringValueExpression.value)) {
                        lTypeParameter.access = lStringValueExpression.value;
                    } else {
                        pTrace.pushIncident(`Unknown access mode: "${lStringValueExpression.value}".`);
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