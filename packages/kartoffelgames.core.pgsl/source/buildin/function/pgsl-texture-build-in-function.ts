import { PgslBooleanType } from "../../abstract_syntax_tree/type/pgsl-boolean-type.ts";
import { PgslMatrixType } from "../../abstract_syntax_tree/type/pgsl-matrix-type.ts";
import { PgslNumericType, PgslNumericTypeName } from "../../abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { PgslSamplerType, PgslSamplerTypeName } from "../../abstract_syntax_tree/type/pgsl-sampler-type.ts";
import { PgslTextureType } from "../../abstract_syntax_tree/type/pgsl-texture-type.ts";
import { PgslVectorType } from "../../abstract_syntax_tree/type/pgsl-vector-type.ts";
import { FunctionDeclarationCst, FunctionDeclarationGenericCst, FunctionDeclarationHeaderCst, FunctionDeclarationParameterCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { AttributeListCst, TypeDeclarationCst } from "../../concrete_syntax_tree/general.type.ts";
import { BlockStatementCst } from "../../concrete_syntax_tree/statement.type.ts";

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
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureGather, true, false, [
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

        return lFunctions;
    }

    /**
     * Create a cst type declaration of a boolean type.
     * 
     * @returns cst type declaration of a boolean type.
     */
    private static booleanType(): TypeDeclarationCst {
        return {
            type: "TypeDeclaration",
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslBooleanType.typeName.boolean,
            template: []
        };
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
     * Create a cst type declaration of a struct type.
     * 
     * @param pName - Struct name.
     * 
     * @returns cst type declaration of struct type.
     */
    private static structType(pName: string): TypeDeclarationCst {
        return {
            type: "TypeDeclaration",
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: pName,
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
     * Create a cst type declaration of a matrix type.
     * 
     * @param pRows - Number of rows.
     * @param pColumns - Number of columns.
     * @param pInnerType - Inner type of matrix.
     * 
     * @returns cst type declaration of matrix type.
     */
    private static matrixType(pRows: number, pColumns: number, pInnerType: TypeDeclarationCst): TypeDeclarationCst {
        return {
            type: "TypeDeclaration",
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslMatrixType.typenameFromDimensions(pRows, pColumns),
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
