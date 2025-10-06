import { PgslAccessModeEnumDeclaration } from "../syntax_tree/buildin/pgsl-access-mode-enum-declaration.ts";
import { PgslAccessMode } from "../syntax_tree/buildin/pgsl-access-mode.enum.ts";
import { PgslTexelFormatEnumDeclaration } from "../syntax_tree/buildin/pgsl-texel-format-enum-declaration.ts";
import { PgslTexelFormat } from "../syntax_tree/buildin/pgsl-texel-format.enum.ts";
import { PgslExpression } from "../syntax_tree/expression/pgsl-expression.ts";
import { PgslStringValueExpression } from "../syntax_tree/expression/single_value/pgsl-string-value-expression.ts";
import { PgslTypeDefinition } from "../syntax_tree/general/pgsl-type-definition.ts";
import { PgslTrace } from "../trace/pgsl-trace.ts";
import { PgslNumericType } from "./pgsl-numeric-type.ts";
import { PgslType, PgslTypeProperties } from "./pgsl-type.ts";

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
    private static readonly mTemplateMapping: Map<PgslTextureTypeName, Array<typeof PgslTypeDefinition | typeof PgslStringValueExpression>> = (() => {
        // Create mapping for all texture types.
        const lMapping: Map<PgslTextureTypeName, Array<typeof PgslTypeDefinition | typeof PgslStringValueExpression>> = new Map<PgslTextureTypeName, Array<typeof PgslTypeDefinition | typeof PgslStringValueExpression>>();

        // Regular textures - require a sampled type parameter.
        lMapping.set(PgslTextureType.typeName.Texture1d, [PgslTypeDefinition]);
        lMapping.set(PgslTextureType.typeName.Texture2d, [PgslTypeDefinition]);
        lMapping.set(PgslTextureType.typeName.Texture2dArray, [PgslTypeDefinition]);
        lMapping.set(PgslTextureType.typeName.Texture3d, [PgslTypeDefinition]);
        lMapping.set(PgslTextureType.typeName.TextureCube, [PgslTypeDefinition]);
        lMapping.set(PgslTextureType.typeName.TextureCubeArray, [PgslTypeDefinition]);
        lMapping.set(PgslTextureType.typeName.TextureMultisampled2d, [PgslTypeDefinition]);

        // External texture - no parameters.
        lMapping.set(PgslTextureType.typeName.TextureExternal, []);

        // Depth textures - no parameters.
        lMapping.set(PgslTextureType.typeName.TextureDepth2d, []);
        lMapping.set(PgslTextureType.typeName.TextureDepth2dArray, []);
        lMapping.set(PgslTextureType.typeName.TextureDepthCube, []);
        lMapping.set(PgslTextureType.typeName.TextureDepthCubeArray, []);
        lMapping.set(PgslTextureType.typeName.TextureDepthMultisampled2d, []);

        // Storage textures - require format and access mode string parameters.
        lMapping.set(PgslTextureType.typeName.TextureStorage1d, [PgslStringValueExpression, PgslStringValueExpression]);
        lMapping.set(PgslTextureType.typeName.TextureStorage2d, [PgslStringValueExpression, PgslStringValueExpression]);
        lMapping.set(PgslTextureType.typeName.TextureStorage2dArray, [PgslStringValueExpression, PgslStringValueExpression]);
        lMapping.set(PgslTextureType.typeName.TextureStorage3d, [PgslStringValueExpression, PgslStringValueExpression]);

        return lMapping;
    })();

    /**
     * Type names for different texture variants.
     * Maps texture type names to their string representations.
     */
    public static get typeName() {
        return {
            // Regular textures.
            Texture1d: 'Texture1d',
            Texture2d: 'Texture2d',
            Texture2dArray: 'Texture2dArray',
            Texture3d: 'Texture3d',
            TextureCube: 'TextureCube',
            TextureCubeArray: 'TextureCubeArray',
            TextureMultisampled2d: 'TextureMultisampled2d',
            TextureExternal: 'TextureExternal',

            // Depth textures.
            TextureDepth2d: 'TextureDepth2d',
            TextureDepth2dArray: 'TextureDepth2dArray',
            TextureDepthCube: 'TextureDepthCube',
            TextureDepthCubeArray: 'TextureDepthCubeArray',
            TextureDepthMultisampled2d: 'TextureDepthMultisampled2d',

            // Storage textures.
            TextureStorage1d: 'TextureStorage1d',
            TextureStorage2d: 'TextureStorage2d',
            TextureStorage2dArray: 'TextureStorage2dArray',
            TextureStorage3d: 'TextureStorage3d'
        } as const;
    }

    private readonly mTemplateList: Array<PgslExpression | PgslTypeDefinition>;
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
    public constructor(pTrace: PgslTrace, pTextureType: PgslTextureTypeName, pTemplateList: Array<PgslExpression | PgslTypeDefinition>) {
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
        const lTextureTemplates: Array<typeof PgslTypeDefinition | typeof PgslStringValueExpression> = PgslTextureType.mTemplateMapping.get(this.mTextureType)!;

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
            const lExpectedParameterType: typeof PgslTypeDefinition | typeof PgslStringValueExpression = lTextureTemplates[lTemplateIndex];
            const lActualParameterValue: PgslTypeDefinition | PgslExpression = this.mTemplateList[lTemplateIndex];

            // Validate parameter type matches expected type.
            if (!(lActualParameterValue instanceof lExpectedParameterType)) {
                pTrace.pushIncident(`Texture template parameter ${lTemplateIndex + 1} must be of type "${lExpectedParameterType.name}".`);
            }

            // Parse parameter based on expected count:
            // One parameter is always a type, two parameters are always strings.
            if (lTextureTemplates.length === 1) {
                // Single parameter: sampled type for regular textures.
                const lTypeDefinition: PgslTypeDefinition = lActualParameterValue as PgslTypeDefinition;
                lTypeParameter.sampledType = lTypeDefinition.type;
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