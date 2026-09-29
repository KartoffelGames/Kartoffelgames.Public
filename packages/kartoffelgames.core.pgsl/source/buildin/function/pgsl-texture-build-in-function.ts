import { PgslNumericType, type PgslNumericTypeName } from '../../abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslSamplerType, type PgslSamplerTypeName } from '../../abstract_syntax_tree/type/definition/pgsl-sampler-type.ts';
import { PgslTextureType, type PgslTextureTypeName } from '../../abstract_syntax_tree/type/definition/pgsl-texture-type.ts';
import { PgslVectorType } from '../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslVoidType } from '../../abstract_syntax_tree/type/definition/pgsl-void-type.ts';
import type { FunctionDeclarationCst, FunctionDeclarationGenericCst, FunctionOverloadDeclarationCst, FunctionDeclarationParameterCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { AttributeListCst, TypeDeclarationCst } from '../../concrete_syntax_tree/general.type.ts';
import type { ExpressionCst, StringValueExpressionCst } from '../../concrete_syntax_tree/expression.type.ts';
import type { BlockStatementCst } from '../../concrete_syntax_tree/statement.type.ts';
import { type PgslAccessMode, PgslAccessModeEnum } from '../enum/pgsl-access-mode-enum.ts';
import { type PgslTexelFormat, PgslTexelFormatEnum } from '../enum/pgsl-texel-format-enum.ts';

export class PgslTextureBuildInFunction {
    /**
     * All possible function names.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get names() {
        return {
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
     * Create texture functions.
     * 
     * @returns list of cst function declarations for texture functions. 
     */
    public static texture(): Array<FunctionDeclarationCst> {
        const lFunctions: Array<FunctionDeclarationCst> = new Array<FunctionDeclarationCst>();

        // textureDimensions
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureDimensions, true, false, [
            // -- Default

            // 1D Textures.
            PgslTextureBuildInFunction.header({ 'TTexture': PgslTextureBuildInFunction.textureTypes([PgslTextureType.typeName.texture1d, PgslTextureType.typeName.textureStorage1d]), }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),

            // 2D Textures.
            PgslTextureBuildInFunction.header({
                'TTexture': PgslTextureBuildInFunction.textureTypes([
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
                ]),
            }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // 3D Textures.
            PgslTextureBuildInFunction.header({ 'TTexture': PgslTextureBuildInFunction.textureTypes([PgslTextureType.typeName.texture3d, PgslTextureType.typeName.textureStorage3d]), }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // -- Levels

            // 1D Textures.
            PgslTextureBuildInFunction.header({ 'TTexture': PgslTextureBuildInFunction.textureTypes([PgslTextureType.typeName.texture1d]), 'TLevel': PgslTextureBuildInFunction.integerTypes() }, { 'texture': 'TTexture', 'level': 'TLevel' }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),

            // 2D Textures.
            PgslTextureBuildInFunction.header({
                'TTexture': PgslTextureBuildInFunction.textureTypes([
                    PgslTextureType.typeName.texture2d,
                    PgslTextureType.typeName.texture2dArray,
                    PgslTextureType.typeName.textureCube,
                    PgslTextureType.typeName.textureCubeArray,
                    PgslTextureType.typeName.textureDepth2d,
                    PgslTextureType.typeName.textureDepth2dArray,
                    PgslTextureType.typeName.textureDepthCube,
                    PgslTextureType.typeName.textureDepthCubeArray
                ]), 'TLevel': PgslTextureBuildInFunction.integerTypes()
            }, { 'texture': 'TTexture', 'level': 'TLevel' }, PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // 3D Textures.
            PgslTextureBuildInFunction.header({ 'TTexture': PgslTextureBuildInFunction.textureTypes([PgslTextureType.typeName.texture3d]), 'TLevel': PgslTextureBuildInFunction.integerTypes() }, { 'texture': 'TTexture', 'level': 'TLevel' }, PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),
        ]));

        // textureGather
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureGather, true, false, [
            // texture_2d<ST>
            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),

            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_2d<ST> with offset
            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),

            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_2d_array<ST>
            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),

            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_2d_array<ST> with offset
            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),

            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_cube<ST>
            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureCube, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureCube, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),

            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureCube, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_cube_array<ST>
            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureCubeArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureCubeArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),

            PgslTextureBuildInFunction.header({ 'TComponent': PgslTextureBuildInFunction.integerTypes(), 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureCubeArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)])] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_depth_2d
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2d, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2d, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_cube
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepthCube, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d_array
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2dArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d_array with offset
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2dArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_cube_array
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepthCubeArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
        ]));

        // textureGatherCompare
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureGatherCompare, true, false, [
            // texture_depth_2d
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2d, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthReference': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2d, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthReference': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d_array
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2dArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthReference': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d_array with offset
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2dArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthReference': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_cube
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepthCube, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthReference': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_cube_array
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepthCubeArray, [])] }, {
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
                'TCoords': PgslTextureBuildInFunction.integerTypes(),
                'TLevel': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture1d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.integerTypes(),
                'TLevel': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture1d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.integerTypes(),
                'TLevel': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture1d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TLevel': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TLevel': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TLevel': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TArrayIndex': PgslTextureBuildInFunction.integerTypes(),
                'TLevel': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TArrayIndex': PgslTextureBuildInFunction.integerTypes(),
                'TLevel': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TArrayIndex': PgslTextureBuildInFunction.integerTypes(),
                'TLevel': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<ST>
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [3]),
                'TLevel': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture3d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [3]),
                'TLevel': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture3d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [3]),
                'TLevel': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture3d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_multisampled_2d
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TSampleIndex': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureMultisampled2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'sampleIndex': 'TSampleIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TSampleIndex': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureMultisampled2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'sampleIndex': 'TSampleIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TSampleIndex': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureMultisampled2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'sampleIndex': 'TSampleIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TLevel': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2d, [])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TLevel': PgslTextureBuildInFunction.integerTypes(),
                'TArrayIndex': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2dArray, [])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex', 'level': 'TLevel'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_multisampled_2d
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TSampleIndex': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepthMultisampled2d, [])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'sampleIndex': 'TSampleIndex'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_external
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureExternal, [])]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_storage_1d
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage1d, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage1d, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage1d, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_storage_2d
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage2d, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage2d, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage2d, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_storage_2d_array
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TArrayIndex': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage2dArray, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TArrayIndex': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage2dArray, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TArrayIndex': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage2dArray, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))),

            // texture_storage_3d
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [3]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage3d, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [3]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage3d, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [3]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage3d, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)))
        ]));

        // textureNumLayers
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureNumLayers, true, false, [
            PgslTextureBuildInFunction.header({
                'TTexture': PgslTextureBuildInFunction.textureTypes([PgslTextureType.typeName.texture2dArray, PgslTextureType.typeName.textureCubeArray, PgslTextureType.typeName.textureDepth2dArray, PgslTextureType.typeName.textureDepthCubeArray, PgslTextureType.typeName.textureStorage2dArray])
            }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
        ]));

        // textureNumLevels
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureNumLevels, true, false, [
            PgslTextureBuildInFunction.header({
                'TTexture': PgslTextureBuildInFunction.textureTypes([
                    PgslTextureType.typeName.texture1d, PgslTextureType.typeName.texture2d, PgslTextureType.typeName.texture2dArray, PgslTextureType.typeName.texture3d,
                    PgslTextureType.typeName.textureCube, PgslTextureType.typeName.textureCubeArray,
                    PgslTextureType.typeName.textureDepth2d, PgslTextureType.typeName.textureDepth2dArray,
                    PgslTextureType.typeName.textureDepthCube, PgslTextureType.typeName.textureDepthCubeArray
                ])
            }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
        ]));

        // textureNumSamples
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureNumSamples, true, false, [
            PgslTextureBuildInFunction.header({
                'TTexture': PgslTextureBuildInFunction.textureTypes([PgslTextureType.typeName.textureMultisampled2d, PgslTextureType.typeName.textureDepthMultisampled2d])
            }, { 'texture': 'TTexture' }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
        ]));

        // textureSample
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureSample, true, false, [
            // texture_1d<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture1d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32> with offset
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture3d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture3d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_cube<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureCube, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_cube_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureCubeArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2d, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2d, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2dArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array with offset
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2dArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepthCube, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube_array
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepthCubeArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
        ]));

        // textureSampleBias
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureSampleBias, true, false, [
            // texture_2d<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'bias': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'bias': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'bias': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32> with offset
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'bias': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32> & texture_cube<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture3d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)]), PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureCube, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'bias': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture3d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'bias': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_cube_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureCubeArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'bias': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
        ]));

        // textureSampleCompare
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureSampleCompare, true, false, [
            // texture_depth_2d
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2d, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2d, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2dArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array with offset
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2dArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepthCube, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube_array
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepthCubeArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
        ]));

        // textureSampleCompareLevel
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureSampleCompareLevel, true, false, [
            // texture_depth_2d
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2d, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2d, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2dArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array with offset
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2dArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepthCube, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube_array
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepthCubeArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.samplerComparison),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'depthRef': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
        ]));

        // textureSampleGrad
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureSampleGrad, true, false, [
            // texture_2d<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddx': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddy': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddx': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddy': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'ddx': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddy': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32> with offset
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'ddx': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddy': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32> & texture_cube<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture3d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)]), PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureCube, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddx': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddy': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture3d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddx': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'ddy': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'offset': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_cube_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureCubeArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
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
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture1d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_2d_array<f32> with offset
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2dArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32> & texture_cube<f32>
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture3d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)]), PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureCube, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_3d<f32> with offset
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture3d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32),
                'offset': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_cube_array<f32>
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureCubeArray, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'level': PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),

            // texture_depth_2d
            PgslTextureBuildInFunction.header({ 'TLevel': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2d, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'level': 'TLevel'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d with offset
            PgslTextureBuildInFunction.header({ 'TLevel': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2d, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'level': 'TLevel',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TLevel': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2dArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'level': 'TLevel'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_2d_array with offset
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TLevel': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepth2dArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'level': 'TLevel',
                'offset': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube
            PgslTextureBuildInFunction.header({ 'TLevel': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepthCube, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'level': 'TLevel'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),

            // texture_depth_cube_array
            PgslTextureBuildInFunction.header({ 'TIndex': PgslTextureBuildInFunction.integerTypes(), 'TLevel': PgslTextureBuildInFunction.integerTypes(), 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.textureDepthCubeArray, [])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(3, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
                'arrayIndex': 'TIndex',
                'level': 'TLevel'
            }, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)),
        ]));

        // textureSampleBaseClampToEdge
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureSampleBaseClampToEdge, true, false, [
            PgslTextureBuildInFunction.header({ 'TTexture': [PgslTextureBuildInFunction.textureType(PgslTextureType.typeName.texture2d, [PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32)])] }, {
                'texture': 'TTexture', 'sampler': PgslTextureBuildInFunction.sampler(PgslSamplerType.typeName.sampler),
                'coords': PgslTextureBuildInFunction.vectorType(2, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))),
        ]));

        // textureStore
        lFunctions.push(PgslTextureBuildInFunction.create(PgslTextureBuildInFunction.names.textureStore, true, false, [
            // texture_storage_1d
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage1d, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage1d, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.integerTypes(),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage1d, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
            }, PgslTextureBuildInFunction.voidType()),

            // texture_storage_2d
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage2d, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage2d, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage2d, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
            }, PgslTextureBuildInFunction.voidType()),

            // texture_storage_2d_array
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage2dArray, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite]),
                'TIndex': PgslTextureBuildInFunction.integerTypes()
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TIndex', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage2dArray, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite]),
                'TIndex': PgslTextureBuildInFunction.integerTypes()
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TIndex', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [2]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage2dArray, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite]),
                'TIndex': PgslTextureBuildInFunction.integerTypes()
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TIndex', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
            }, PgslTextureBuildInFunction.voidType()),

            // texture_storage_3d
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [3]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage3d, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.float32))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [3]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage3d, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
            }, PgslTextureBuildInFunction.voidType()),
            PgslTextureBuildInFunction.header({
                'TCoords': PgslTextureBuildInFunction.vectorTypes(PgslTextureBuildInFunction.integerTypes(), [3]),
                'TTexture': PgslTextureBuildInFunction.storageTextureTypes(PgslTextureType.typeName.textureStorage3d, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': PgslTextureBuildInFunction.vectorType(4, PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
            }, PgslTextureBuildInFunction.voidType())
        ]));

        return lFunctions;
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
    private static create(pName: string, pImplicitGenerics: boolean, pConstant: boolean, pDeclarations: Array<FunctionOverloadDeclarationCst>): FunctionDeclarationCst {
        return {
            type: 'FunctionDeclaration',
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
    private static header(pGenerics: PgslTextureBuildInFunctionGenericList, pParameter: PgslTextureBuildInFunctionParameterList, pReturnType: TypeDeclarationCst | string): FunctionOverloadDeclarationCst {
        const lEmptyBlock: BlockStatementCst = {
            type: 'BlockStatement',
            statements: [],
            range: [0, 0, 0, 0],
        };

        const lEmptyAttribteList: AttributeListCst = {
            type: 'AttributeList',
            attributes: [],
            range: [0, 0, 0, 0],
        };

        // Convert parameters
        const lParameters: Array<FunctionDeclarationParameterCst> = new Array<FunctionDeclarationParameterCst>();
        for (const lParameterName in pParameter) {
            lParameters.push({
                type: 'FunctionDeclarationParameter',
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
                type: 'FunctionDeclarationGeneric',
                buildIn: true,
                range: [0, 0, 0, 0],
                name: lGenericName,
                restrictions: pGenerics[lGenericName],
            });
        }

        return {
            type: 'FunctionOverloadDeclaration',
            buildIn: true,
            range: [0, 0, 0, 0],
            block: lEmptyBlock,
            attributeList: lEmptyAttribteList,
            parameters: lParameters,
            generics: lGenerics,
            returnType: pReturnType,
        };
    }

    /**
     * Create cst type declarations of all concrete integer types.
     * Abstract integers are accepted by converting into them.
     *
     * @returns cst type declarations of all concrete integer types.
     */
    private static integerTypes(): Array<TypeDeclarationCst> {
        return [
            PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.signedInteger),
            PgslTextureBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)
        ];
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
            type: 'TypeDeclaration',
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: pTypeName,
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
            type: 'TypeDeclaration',
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: pSampler,
            template: []
        };
    }

    /**
     * Create cst type declarations of a storage texture for every texel format of a channel type and every access mode.
     *
     * @param pTextureName - Storage texture type name.
     * @param pChannelType - Numeric channel type of the texel formats.
     * @param pAccessModes - Allowed access modes.
     *
     * @returns cst type declarations of all matching storage textures.
     */
    private static storageTextureTypes(pTextureName: PgslTextureTypeName, pChannelType: PgslNumericTypeName, pAccessModes: Array<PgslAccessMode>): Array<TypeDeclarationCst> {
        return PgslTexelFormatEnum.formatByType(pChannelType).flatMap((pTexelFormat: PgslTexelFormat) => {
            return pAccessModes.map((pAccessMode: PgslAccessMode) => {
                // Storage textures are declared with string templates for format and access mode.
                const lFormatTemplate: StringValueExpressionCst = { type: 'StringValueExpression', range: [0, 0, 0, 0], textValue: pTexelFormat };
                const lAccessTemplate: StringValueExpressionCst = { type: 'StringValueExpression', range: [0, 0, 0, 0], textValue: pAccessMode };

                return PgslTextureBuildInFunction.textureType(pTextureName, [lFormatTemplate, lAccessTemplate]);
            });
        });
    }

    /**
     * Create a cst type declaration of a texture type.
     *
     * @param pTextureName - Texture type name.
     * @param pTemplate - Texture templates.
     *
     * @returns cst type declaration of the texture type.
     */
    private static textureType(pTextureName: PgslTextureTypeName, pTemplate: Array<ExpressionCst | TypeDeclarationCst>): TypeDeclarationCst {
        return {
            type: 'TypeDeclaration',
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: pTextureName,
            template: pTemplate
        };
    }

    /**
     * Create cst type declarations of every declarable variant of the texture types.
     * Sampled textures are created for every sampled type and storage textures for every texel format and access mode.
     *
     * @param pTextureNames - Texture type names.
     *
     * @returns cst type declarations of all texture variants.
     */
    private static textureTypes(pTextureNames: Array<PgslTextureTypeName>): Array<TypeDeclarationCst> {
        const lChannelTypes: Array<PgslNumericTypeName> = [PgslNumericType.typeName.float32, PgslNumericType.typeName.signedInteger, PgslNumericType.typeName.unsignedInteger];

        return pTextureNames.flatMap((pTextureName: PgslTextureTypeName) => {
            // Sampled textures for every sampled type.
            if (PgslTextureType.isSampledTextureType(pTextureName)) {
                return lChannelTypes.map((pChannelType: PgslNumericTypeName) => {
                    return PgslTextureBuildInFunction.textureType(pTextureName, [PgslTextureBuildInFunction.numericType(pChannelType)]);
                });
            }

            // Storage textures for every texel format and access mode.
            if (PgslTextureType.isStorageTextureType(pTextureName)) {
                return lChannelTypes.flatMap((pChannelType: PgslNumericTypeName) => {
                    return PgslTextureBuildInFunction.storageTextureTypes(pTextureName, pChannelType, Object.values(PgslAccessModeEnum.VALUES));
                });
            }

            // Depth and external textures have no templates.
            return [PgslTextureBuildInFunction.textureType(pTextureName, [])];
        });
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
            type: 'TypeDeclaration',
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslVectorType.typeNameFromDimension(pDimension),
            template: [pInnerType]
        };
    }

    /**
     * Create cst type declarations of vectors for every inner type and dimension.
     *
     * @param pInnerTypes - Inner types of the vectors.
     * @param pDimensions - Vector dimensions. Defaults to all dimensions.
     *
     * @returns cst type declarations of all vector types.
     */
    private static vectorTypes(pInnerTypes: Array<TypeDeclarationCst>, pDimensions: Array<number> = [2, 3, 4]): Array<TypeDeclarationCst> {
        return pDimensions.flatMap((pDimension: number) => {
            return pInnerTypes.map((pInnerType: TypeDeclarationCst) => {
                return PgslTextureBuildInFunction.vectorType(pDimension, pInnerType);
            });
        });
    }

    /**
     * Create a cst type declaration of a void type.
     * 
     * @returns cst type declaration of void type.
     */
    private static voidType(): TypeDeclarationCst {
        return {
            type: 'TypeDeclaration',
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslVoidType.typeName.void,
            template: []
        };
    }
}

type PgslTextureBuildInFunctionParameterList = {
    [name: string]: TypeDeclarationCst | string;
};

type PgslTextureBuildInFunctionGenericList = {
    [name: string]: Array<TypeDeclarationCst>;
};
