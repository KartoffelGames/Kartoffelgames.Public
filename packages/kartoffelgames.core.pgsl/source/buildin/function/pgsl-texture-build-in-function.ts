import { PgslBooleanType } from "../../abstract_syntax_tree/type/pgsl-boolean-type.ts";
import { PgslMatrixType } from "../../abstract_syntax_tree/type/pgsl-matrix-type.ts";
import { PgslNumericType, PgslNumericTypeName } from "../../abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { PgslSamplerType, PgslSamplerTypeName } from "../../abstract_syntax_tree/type/pgsl-sampler-type.ts";
import { PgslTextureType } from "../../abstract_syntax_tree/type/pgsl-texture-type.ts";
import { PgslVectorType } from "../../abstract_syntax_tree/type/pgsl-vector-type.ts";
import { PgslVoidType } from "../../abstract_syntax_tree/type/pgsl-void-type.ts";
import { FunctionDeclarationCst, FunctionDeclarationGenericCst, FunctionDeclarationHeaderCst, FunctionDeclarationParameterCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { AttributeListCst, TypeDeclarationCst } from "../../concrete_syntax_tree/general.type.ts";
import { BlockStatementCst } from "../../concrete_syntax_tree/statement.type.ts";
import { PgslTexelFormat, PgslTexelFormatEnum } from "../enum/pgsl-texel-format-enum.ts";

export class PgslTextureBuildInFunction {
    /**
     * All possible function names.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get names() {
        return {
            // Bit reinterpretation
            textureDimensions: 'textureDimensions',
            textureGather: 'textureGather',
            textureGatherCompare: 'textureGatherCompare',
            textureLoad: 'textureLoad',
            textureNumLayers: 'textureNumLayers',
            textureNumLevels: 'textureNumLevels',
            textureNumSamples: 'textureNumSamples',
            textureSample: 'textureSample',
            textureSampleBias: 'textureSampleBias',
            textureSampleCompare: 'textureSampleCompare',
            textureSampleCompareLevel: 'textureSampleCompareLevel',
            textureSampleGrad: 'textureSampleGrad',
            textureSampleLevel: 'textureSampleLevel',
            textureSampleBaseClampToEdge: 'textureSampleBaseClampToEdge',
            textureStore: 'textureStore'
        };
    }

    /**
     * Create array functions.
     * 
     * @returns list of cst function declarations for array functions. 
     */
    public static texture(): Array<FunctionDeclarationCst> {
        const lFunctions: Array<FunctionDeclarationCst> = new Array<FunctionDeclarationCst>();

        // textureDimensions
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureDimensions, true, false, [
            // -- Default

            // 1D Textures.
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureType.typeName.texture1d, PgslTextureType.typeName.textureStorage1d], }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),

            // 2D Textures.
            PgslTextureBuildInFunction.header({
                'TTexture': [
                    PgslTextureType.typeName.texture2d,
                    PgslTextureType.typeName.texture2dArray,
                    PgslTextureType.typeName.textureCube,
                    PgslTextureType.typeName.textureCubeArray,
                    PgslTextureType.typeName.textureMultisampled2d,
                    PgslTextureType.typeName.textureDepth2d,
                    PgslTextureType.typeName.textureDepth2dArray,
                    PgslTextureType.typeName.textureDepthCube,
                    PgslTextureType.typeName.textureDepthCubeArray,
                    PgslTextureType.typeName.textureDepthMultisampled2d,
                    PgslTextureType.typeName.textureStorage2d,
                    PgslTextureType.typeName.textureStorage2dArray,
                    PgslTextureType.typeName.textureExternal
                ],
            }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // 3D Textures.
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureType.typeName.texture3d, PgslTextureType.typeName.textureStorage3d], }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // -- Levels

            // 1D Textures.
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureType.typeName.texture1d], 'TLevel': ['numeric-integer'] }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),

            // 2D Textures.
            PgslTextureBuildInFunction.header({
                'TTexture': [
                    PgslTextureType.typeName.texture2d,
                    PgslTextureType.typeName.texture2dArray,
                    PgslTextureType.typeName.textureCube,
                    PgslTextureType.typeName.textureCubeArray,
                    PgslTextureType.typeName.textureDepth2d,
                    PgslTextureType.typeName.textureDepth2dArray,
                    PgslTextureType.typeName.textureDepthCube,
                    PgslTextureType.typeName.textureDepthCubeArray
                ], 'TLevel': ['numeric-integer']
            }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // 3D Textures.
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureType.typeName.texture3d], 'TLevel': ['numeric-integer'] }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),
        ]));

        // textureGather
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureGather, true, false, [
            // texture_2d<ST>
            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.signedInteger}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),

            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.unsignedInteger}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_2d<ST> with offset
            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.signedInteger}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),

            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.unsignedInteger}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_2d_array<ST>
            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.float32}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.signedInteger}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),

            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.unsignedInteger}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_2d_array<ST> with offset
            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.float32}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.signedInteger}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),

            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.unsignedInteger}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_cube<ST>
            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureCube}<${PgslNumericType.typeName.float32}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureCube}<${PgslNumericType.typeName.signedInteger}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),

            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureCube}<${PgslNumericType.typeName.unsignedInteger}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_cube_array<ST>
            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureCubeArray}<${PgslNumericType.typeName.float32}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureCubeArray}<${PgslNumericType.typeName.signedInteger}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),

            PgslTextureBuildInFunction.header({ 'TComponent': ['numeric-integer'], 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureCubeArray}<${PgslNumericType.typeName.unsignedInteger}>`] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_depth_2d
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepth2d}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepth2d}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_cube
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepthCube}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d_array
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepth2dArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d_array with offset
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepth2dArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_cube_array
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepthCubeArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
        ]));

        // textureGatherCompare
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureGatherCompare, true, false, [
            // texture_depth_2d
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepth2d}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthReference': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepth2d}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthReference': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d_array
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepth2dArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthReference': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d_array with offset
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepth2dArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthReference': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_cube
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepthCube}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthReference': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_cube_array
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepthCubeArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthReference': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
        ]));

        // textureLoad
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureLoad, true, false, [
            // texture_1d
            PgslTextureBuildInFunction.header({
                'TCoords': ['numeric-integer'],
                'TLevel': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.texture1d}<${PgslNumericType.typeName.signedInteger}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['numeric-integer'],
                'TLevel': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.texture1d}<${PgslNumericType.typeName.unsignedInteger}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['numeric-integer'],
                'TLevel': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.texture1d}<${PgslNumericType.typeName.float32}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TLevel': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.signedInteger}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TLevel': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.unsignedInteger}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TLevel': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TArrayIndex': ['numeric-integer'],
                'TLevel': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.signedInteger}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TArrayIndex': ['numeric-integer'],
                'TLevel': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.unsignedInteger}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TArrayIndex': ['numeric-integer'],
                'TLevel': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.float32}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<ST>
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector3<numeric-integer>'],
                'TLevel': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.signedInteger}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector3<numeric-integer>'],
                'TLevel': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.unsignedInteger}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector3<numeric-integer>'],
                'TLevel': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_multisampled_2d
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TSampleIndex': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.textureMultisampled2d}<${PgslNumericType.typeName.signedInteger}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'sampleIndex': 'TSampleIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TSampleIndex': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.textureMultisampled2d}<${PgslNumericType.typeName.unsignedInteger}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'sampleIndex': 'TSampleIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TSampleIndex': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.textureMultisampled2d}<${PgslNumericType.typeName.float32}>`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'sampleIndex': 'TSampleIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TLevel': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.textureDepth2d}`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TLevel': ['numeric-integer'],
                'TArrayIndex': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.textureDepth2dArray}`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_multisampled_2d
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TSampleIndex': ['numeric-integer'],
                'TTexture': [`${PgslTextureType.typeName.textureDepthMultisampled2d}`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'sampleIndex': 'TSampleIndex'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_external
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TTexture': [`${PgslTextureType.typeName.textureExternal}`]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_storage_1d
            PgslTextureBuildInFunction.header({
                'TCoords': ['numeric-integer'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.float32).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage1d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['numeric-integer'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.signedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage1d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['numeric-integer'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.unsignedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage1d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_storage_2d
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.float32).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage2d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.signedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage2d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.unsignedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage2d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_storage_2d_array
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TArrayIndex': ['numeric-integer'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.float32).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage2dArray}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TArrayIndex': ['numeric-integer'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.signedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage2dArray}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TArrayIndex': ['numeric-integer'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.unsignedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage2dArray}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_storage_3d
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector3<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.float32).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage3d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector3<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.signedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage3d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector3<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.unsignedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage3d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)))
        ]));

        // textureNumLayers
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureNumLayers, true, false, [
            PgslTextureBuildInFunction.header({
                'TTexture': [PgslTextureType.typeName.texture2dArray, PgslTextureType.typeName.textureCubeArray, PgslTextureType.typeName.textureDepth2dArray, PgslTextureType.typeName.textureDepthCubeArray, PgslTextureType.typeName.textureStorage2dArray]
            }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
        ]));

        // textureNumLevels
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureNumLevels, true, false, [
            PgslTextureBuildInFunction.header({
                'TTexture': [
                    PgslTextureType.typeName.texture1d, PgslTextureType.typeName.texture2d, PgslTextureType.typeName.texture2dArray, PgslTextureType.typeName.texture3d,
                    PgslTextureType.typeName.textureCube, PgslTextureType.typeName.textureCubeArray,
                    PgslTextureType.typeName.textureDepth2d, PgslTextureType.typeName.textureDepth2dArray,
                    PgslTextureType.typeName.textureDepthCube, PgslTextureType.typeName.textureDepthCubeArray
                ]
            }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
        ]));

        // textureNumSamples
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureNumSamples, true, false, [
            PgslTextureBuildInFunction.header({
                'TTexture': [PgslTextureType.typeName.textureMultisampled2d, PgslTextureType.typeName.textureDepthMultisampled2d]
            }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
        ]));

        // textureSample
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureSample, true, false, [
            // texture_1d<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture1d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32> with offset
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_cube<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureCube}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_cube_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureCubeArray}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepth2d}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepth2d}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepth2dArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array with offset
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepth2dArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepthCube}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube_array
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepthCubeArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
        ]));

        // textureSampleBias
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureSampleBias, true, false, [
            // texture_2d<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'bias': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'bias': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'bias': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32> with offset
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'bias': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32> & texture_cube<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>`, `${PgslTextureType.typeName.textureCube}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'bias': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'bias': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_cube_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureCubeArray}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'bias': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
        ]));

        // textureSampleCompare
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureSampleCompare, true, false, [
            // texture_depth_2d
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepth2d}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepth2d}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepth2dArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array with offset
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepth2dArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepthCube}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube_array
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepthCubeArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
        ]));

        // textureSampleCompareLevel
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureSampleCompareLevel, true, false, [
            // texture_depth_2d
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepth2d}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepth2d}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepth2dArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array with offset
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepth2dArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.textureDepthCube}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube_array
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepthCubeArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
        ]));

        // textureSampleGrad
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureSampleGrad, true, false, [
            // texture_2d<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddx': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddy': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddx': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddy': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'ddx': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddy': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32> with offset
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'ddx': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddy': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32> & texture_cube<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>`, `${PgslTextureType.typeName.textureCube}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddx': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddy': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddx': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddy': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_cube_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureCubeArray}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'ddx': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddy': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
        ]));

        // textureSampleLevel
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureSampleLevel, true, false, [
            // texture_1d<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture1d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32> with offset
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32> & texture_cube<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>`, `${PgslTextureType.typeName.textureCube}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_cube_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureCubeArray}<${PgslNumericType.typeName.float32}>`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d
            PgslTextureBuildInFunction.header({ 'TLevel': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepth2d}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'level': 'TLevel'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d with offset
            PgslTextureBuildInFunction.header({ 'TLevel': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepth2d}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'level': 'TLevel',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TLevel': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepth2dArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'level': 'TLevel'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array with offset
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TLevel': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepth2dArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'level': 'TLevel',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube
            PgslTextureBuildInFunction.header({ 'TLevel': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepthCube}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'level': 'TLevel'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube_array
            PgslTextureBuildInFunction.header({ 'TIndex': ['numeric-integer'], 'TLevel': ['numeric-integer'], 'TTexture': [`${PgslTextureType.typeName.textureDepthCubeArray}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'level': 'TLevel'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
        ]));

        // textureSampleBaseClampToEdge
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureSampleBaseClampToEdge, true, false, [
            PgslTextureBuildInFunction.header({ 'TTexture': [`${PgslTextureType.typeName.texture2d}`] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
        ]));

        // textureStore
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureStore, true, false, [
            // texture_storage_1d
            PgslTextureBuildInFunction.header({
                'TCoords': ['numeric-integer'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.float32).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage1d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': ['numeric-integer'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.signedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage1d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': ['numeric-integer'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.unsignedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage1d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
            }, PgslTextureBuildInFunction.voidType()),

            // texture_storage_2d
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.float32).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage2d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.signedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage2d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.unsignedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage2d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
            }, PgslTextureBuildInFunction.voidType()),

            // texture_storage_2d_array
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.float32).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage2dArray}<${pTexelFormat}>`),
                'TIndex': ['numeric-integer']
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TIndex', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.signedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage2dArray}<${pTexelFormat}>`),
                'TIndex': ['numeric-integer']
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TIndex', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector2<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.unsignedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage2dArray}<${pTexelFormat}>`),
                'TIndex': ['numeric-integer']
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TIndex', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
            }, PgslTextureBuildInFunction.voidType()),

            // texture_storage_3d
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector3<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.float32).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage3d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector3<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.signedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage3d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': ['Vector3<numeric-integer>'],
                'TTexture': PgslTexelFormatEnum.formatByType(PgslNumericType.typeName.unsignedInteger).map((pTexelFormat: PgslTexelFormat) => `${PgslTextureType.typeName.textureStorage3d}<${pTexelFormat}>`)
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
            }, PgslTextureBuildInFunction.voidType())
        ]));

        return lFunctions;
    }

    /**
     * Create a cst type declaration of a numeric type.
     * 
     * @param pTypeName - Numeric type name.
     * 
     * @returns cst type declaration of the numeric type. 
     */
    private static numericType(pTypeName: PgslNumericTypeName): TypeDeclarationCst {
        return {
            type: "TypeDeclaration",
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: pTypeName,
            template: []
        };
    }

    /**
     * Create a cst type declaration of a void type.
     * 
     * @returns cst type declaration of void type.
     */
    private static voidType(): TypeDeclarationCst {
        return {
            type: "TypeDeclaration",
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslVoidType.typeName.void,
            template: []
        };
    }

    /**
     * Create a cst type declaration of a sampler type.
     * 
     * @param pName - Struct name.
     * 
     * @returns cst type declaration of struct type.
     */
    private static sampler(pSampler: PgslSamplerTypeName): TypeDeclarationCst {
        return {
            type: "TypeDeclaration",
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: pSampler,
            template: []
        };
    }

    /**
     * Create a cst type declaration of a vector type.
     * 
     * @param pDimension - Vector dimension.
     * @param pInnerType - Inner type of vector.
     * 
     * @returns cst type declaration of vector type.
     */
    private static vectorType(pDimension: number, pInnerType: TypeDeclarationCst): TypeDeclarationCst {
        return {
            type: "TypeDeclaration",
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslVectorType.typeNameFromDimension(pDimension),
            template: [pInnerType]
        };
    }

    /**
     * Create a new cst function declaration.
     * 
     * @param pName - Function name.
     * @param pConstant - Function is constant.
     * @param pDeclarations - Function header declarations.
     * 
     * @returns cst function declaration.
     */
    private static create(pName: string, pImplicitGenerics: boolean, pConstant: boolean, pDeclarations: Array<FunctionDeclarationHeaderCst>): FunctionDeclarationCst {
        return {
            type: "FunctionDeclaration",
            isConstant: pConstant,
            buildIn: true,
            implicitGenerics: pImplicitGenerics,
            range: [0, 0, 0, 0],
            name: pName,
            declarations: pDeclarations
        };
    }

    /**
     * Create a cst function declaration header.
     * 
     * @param pGenerics - Function generics.
     * @param pParameter - Function parameters.
     * @param pReturnType - Function return type.
     * 
     * @returns cst function declaration header.
     */
    private static header(pGenerics: PgslTextureBuildInFunctionGenericList, pParameter: PgslTextureBuildInFunctionParameterList, pReturnType: TypeDeclarationCst | string): FunctionDeclarationHeaderCst {
        const lEmptyBlock: BlockStatementCst = {
            type: "BlockStatement",
            statements: [],
            range: [0, 0, 0, 0],
        };

        const lEmptyAttribteList: AttributeListCst = {
            type: "AttributeList",
            attributes: [],
            range: [0, 0, 0, 0],
        };

        // Convert parameters
        const lParameters: Array<FunctionDeclarationParameterCst> = new Array<FunctionDeclarationParameterCst>();
        for (const lParameterName in pParameter) {
            lParameters.push({
                type: "FunctionDeclarationParameter",
                buildIn: true,
                range: [0, 0, 0, 0],
                name: lParameterName,
                typeDeclaration: pParameter[lParameterName],
            });
        }

        // Convert generics
        const lGenerics: Array<FunctionDeclarationGenericCst> = new Array<FunctionDeclarationGenericCst>();
        for (const lGenericName in pGenerics) {
            lGenerics.push({
                type: "FunctionDeclarationGeneric",
                buildIn: true,
                range: [0, 0, 0, 0],
                name: lGenericName,
                restrictions: pGenerics[lGenericName].length === 0 ? null : pGenerics[lGenericName],
            });
        }

        return {
            type: "FunctionDeclarationHeader",
            buildIn: true,
            range: [0, 0, 0, 0],
            block: lEmptyBlock,
            attributeList: lEmptyAttribteList,
            parameters: lParameters,
            generics: lGenerics,
            returnType: pReturnType,
        };
    }
}

type PgslTextureBuildInFunctionParameterList = {
    [name: string]: TypeDeclarationCst | string;
};

type PgslTextureBuildInFunctionGenericList = {
    [name: string]: Array<string>;
};
