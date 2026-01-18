import { Exception } from '@kartoffelgames/core';
import { type PgslAccessMode, PgslAccessModeEnum } from '../../buildin/enum/pgsl-access-mode-enum.ts';
import { type PgslTexelFormat, PgslTexelFormatEnum } from '../../buildin/enum/pgsl-texel-format-enum.ts';
import type { TypeCst } from '../../concrete_syntax_tree/general.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { IExpressionAst } from '../expression/i-expression-ast.interface.ts';
import { TypeDeclarationAst } from '../general/type-declaration-ast.ts';
import type { IType, TypeProperties } from './i-type.interface.ts';
import { PgslNumericType } from './pgsl-numeric-type.ts';
import { PgslStringType } from './pgsl-string-type.ts';

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
export class PgslTextureType extends AbstractSyntaxTree<TypeCst, TypeProperties> implements IType {
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
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

    /**
     * Gets the texture dimension from the texture type name.
     * 
     * @param pTextureType - Texture type.
     * 
     * @returns The texture dimension as a string.
     */
    public static textureDimensionFromTypeName(pTextureType: PgslTextureTypeName): PgslTextureTypeNameDimension {
        switch (pTextureType) {
            // 1D textures
            case PgslTextureType.typeName.texture1d:
            case PgslTextureType.typeName.textureStorage1d: {
                return '1d';
            }

            // 2D textures
            case PgslTextureType.typeName.texture2d:
            case PgslTextureType.typeName.textureMultisampled2d:
            case PgslTextureType.typeName.textureExternal:
            case PgslTextureType.typeName.textureDepth2d:
            case PgslTextureType.typeName.textureDepthMultisampled2d:
            case PgslTextureType.typeName.textureStorage2d: {
                return '2d';
            }

            // 2D array textures
            case PgslTextureType.typeName.texture2dArray:
            case PgslTextureType.typeName.textureDepth2dArray:
            case PgslTextureType.typeName.textureStorage2dArray: {
                return '2d-array';
            }

            // 3D textures
            case PgslTextureType.typeName.texture3d:
            case PgslTextureType.typeName.textureStorage3d: {
                return '3d';
            }

            // Cube textures
            case PgslTextureType.typeName.textureCube:
            case PgslTextureType.typeName.textureDepthCube: {
                return 'cube';
            }

            // Cube array textures
            case PgslTextureType.typeName.textureCubeArray:
            case PgslTextureType.typeName.textureDepthCubeArray: {
                return 'cube-array';
            }
        }
    }

    private readonly mShadowedType: IType;
    private readonly mTemplateList: Array<IExpressionAst | TypeDeclarationAst>;
    private readonly mTextureType: PgslTextureTypeName;
    private mTextureTypeParameter: PgslTextureTypeParameter | null;

    /**
     * Gets the access mode for storage textures.
     * 
     * @returns The access mode.
     */
    public get access(): PgslAccessMode {
        if (!this.mTextureTypeParameter) {
            throw new Exception('Texture type parameter is not initialized.', this);
        }
        return this.mTextureTypeParameter.access;
    }

    /**
     * Gets the texel format for storage textures.
     * 
     * @returns The texel format.
     */
    public get format(): PgslTexelFormat {
        if (!this.mTextureTypeParameter) {
            throw new Exception('Texture type parameter is not initialized.', this);
        }
        return this.mTextureTypeParameter.format;
    }

    /**
     * Gets the sampled type for regular textures.
     * 
     * @returns The sampled type.
     */
    public get sampledType(): IType {
        if (!this.mTextureTypeParameter) {
            throw new Exception('Texture type parameter is not initialized.', this);
        }
        return this.mTextureTypeParameter.sampledType;
    }

    /**
     * The type that is being shadowed.
     * If it does not shadow another type, it is itself.
     */
    public get shadowedType(): IType {
        return this.mShadowedType;
    }

    /**
     * Gets the texture type variant.
     * 
     * @returns The texture type name.
     */
    public get textureType(): PgslTextureTypeName {
        return this.mTextureType;
    }

    /**
     * Constructor for texture type.
     * 
     * @param pTextureType - The specific texture type variant.
     * @param pTemplateList - List of template arguments (types or strings).
     * @param pShadowedType - Type that is the actual type of this.
     */
    public constructor(pTextureType: PgslTextureTypeName, pTemplateList: Array<IExpressionAst | TypeDeclarationAst>, pShadowedType?: IType) {
        super({ type: 'Type', range: [0, 0, 0, 0] });

        // Set data.
        this.mShadowedType = pShadowedType ?? this;
        this.mTextureType = pTextureType;
        this.mTemplateList = pTemplateList;

        // Initialize empty texture type parameters.
        this.mTextureTypeParameter = null;
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
    public equals(pTarget: IType): boolean {
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
    public isExplicitCastableInto(_pTarget: IType): boolean {
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
    public isImplicitCastableInto(pTarget: IType): boolean {
        // A texture is never explicit nor implicit castable.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for texture types.
     * Textures are storable, concrete, but not constructible or hostShareable.
     * 
     * @param pContext - Context.
     * 
     * @returns Type properties defining texture characteristics.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): TypeProperties {
        // Parse template parameters and validate them.
        this.mTextureTypeParameter = this.parseTextureParameter(pContext);

        // access: PgslAccessMode;
        // format: PgslTexelFormat;
        // sampledType: IType;

        // Build meta types.
        const lMetaTypeList: Array<string> = new Array<string>();
        for (const lMetaType of this.mTextureTypeParameter.sampledType.data.metaTypes) {
            lMetaTypeList.push(`Texture<${lMetaType}>`);
            lMetaTypeList.push(`Texture<${lMetaType},${this.mTextureTypeParameter.access}>`);
            lMetaTypeList.push(`Texture<${lMetaType},${this.mTextureTypeParameter.format}>`);
            lMetaTypeList.push(`Texture<${lMetaType},${this.mTextureTypeParameter.access},${this.mTextureTypeParameter.format}>`);

            lMetaTypeList.push(`${this.mTextureType}<${lMetaType}>`);
            lMetaTypeList.push(`${this.mTextureType}<${lMetaType},${this.mTextureTypeParameter.access}>`);
            lMetaTypeList.push(`${this.mTextureType}<${lMetaType},${this.mTextureTypeParameter.format}>`);
            lMetaTypeList.push(`${this.mTextureType}<${lMetaType},${this.mTextureTypeParameter.access},${this.mTextureTypeParameter.format}>`);
        }

        lMetaTypeList.push('Texture');
        lMetaTypeList.push(`Texture<${this.mTextureTypeParameter.access}>`);
        lMetaTypeList.push(`Texture<${this.mTextureTypeParameter.format}>`);
        lMetaTypeList.push(`Texture<${this.mTextureTypeParameter.access},${this.mTextureTypeParameter.format}>`);

        lMetaTypeList.push(`${this.mTextureType}`);
        lMetaTypeList.push(`${this.mTextureType}<${this.mTextureTypeParameter.access}>`);
        lMetaTypeList.push(`${this.mTextureType}<${this.mTextureTypeParameter.format}>`);
        lMetaTypeList.push(`${this.mTextureType}<${this.mTextureTypeParameter.access},${this.mTextureTypeParameter.format}>`);


        return {
            // Meta information.
            metaTypes: lMetaTypeList,

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
            access: PgslAccessModeEnum.VALUES.Read,
            format: PgslTexelFormatEnum.VALUES.Bgra8unorm,
            sampledType: new PgslNumericType(PgslNumericType.typeName.float32).process(pContext)
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
                        continue;
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
                        continue;
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
    sampledType: IType;
};

/**
 * Texture dimension types supported in WGSL.
 */
export type PgslTextureTypeNameDimension = '1d' | '2d' | '2d-array' | '3d' | 'cube' | 'cube-array';

/**
 * Type representing all available texture type names.
 * Derived from the static typeName getter for type safety.
 */
export type PgslTextureTypeName = (typeof PgslTextureType.typeName)[keyof typeof PgslTextureType.typeName];