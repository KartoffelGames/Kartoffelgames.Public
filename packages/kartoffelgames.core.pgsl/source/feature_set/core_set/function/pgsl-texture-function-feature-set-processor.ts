import type { BasePgslType } from '../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslNumericType, type PgslNumericTypeName } from '../../../abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslSamplerType } from '../../../abstract_syntax_tree/type/definition/pgsl-sampler-type.ts';
import { PgslTextureType, type PgslTextureTypeName } from '../../../abstract_syntax_tree/type/definition/pgsl-texture-type.ts';
import { PgslVectorType } from '../../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslVoidType } from '../../../abstract_syntax_tree/type/definition/pgsl-void-type.ts';
import { type PgslAccessMode, PgslAccessModeEnum } from '../../enum/pgsl-access-mode-enum.ts';
import { type PgslTexelFormat, PgslTexelFormatEnum } from '../../enum/pgsl-texel-format-enum.ts';
import { PgslFeatureSetProcessor } from '../../pgsl-feature-set-processor.ts';

/**
 * Texture functions.
 */
export class PgslTextureFunctionFeatureSetProcessor extends PgslFeatureSetProcessor {
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
        } as const;
    }

    /**
     * Process declaration creations.
     */
    protected override onProcess(): void {
        // Types used by the overloads.
        const lFloat32: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.float32);
        const lSignedInteger: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.signedInteger);
        const lUnsignedInteger: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger);
        const lSampler: BasePgslType = this.types.create(PgslSamplerType, false);
        const lSamplerComparison: BasePgslType = this.types.create(PgslSamplerType, true);
        const lVoid: BasePgslType = this.types.create(PgslVoidType);

        // Integer restrictions of coordinates, levels and indices.
        const lIntegerTypes: Array<BasePgslType> = [lSignedInteger, lUnsignedInteger];
        const lIntegerVector2Types: Array<BasePgslType> = [this.types.create(PgslVectorType, 2, lSignedInteger), this.types.create(PgslVectorType, 2, lUnsignedInteger)];
        const lIntegerVector3Types: Array<BasePgslType> = [this.types.create(PgslVectorType, 3, lSignedInteger), this.types.create(PgslVectorType, 3, lUnsignedInteger)];

        // textureDimensions
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureDimensions, {}, [
            // -- Default

            // 1D Textures.
            this.createOverload({ 'TTexture': this.textureTypes([PgslTextureType.typeName.texture1d, PgslTextureType.typeName.textureStorage1d]), }, { 'texture': 'TTexture' }, lUnsignedInteger),

            // 2D Textures.
            this.createOverload({
                'TTexture': this.textureTypes([
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
            }, { 'texture': 'TTexture' }, this.types.create(PgslVectorType, 2, lUnsignedInteger)),

            // 3D Textures.
            this.createOverload({ 'TTexture': this.textureTypes([PgslTextureType.typeName.texture3d, PgslTextureType.typeName.textureStorage3d]), }, { 'texture': 'TTexture' }, this.types.create(PgslVectorType, 3, lUnsignedInteger)),

            // -- Levels

            // 1D Textures.
            this.createOverload({ 'TTexture': this.textureTypes([PgslTextureType.typeName.texture1d]), 'TLevel': lIntegerTypes }, { 'texture': 'TTexture', 'level': 'TLevel' }, lUnsignedInteger),

            // 2D Textures.
            this.createOverload({
                'TTexture': this.textureTypes([
                    PgslTextureType.typeName.texture2d,
                    PgslTextureType.typeName.texture2dArray,
                    PgslTextureType.typeName.textureCube,
                    PgslTextureType.typeName.textureCubeArray,
                    PgslTextureType.typeName.textureDepth2d,
                    PgslTextureType.typeName.textureDepth2dArray,
                    PgslTextureType.typeName.textureDepthCube,
                    PgslTextureType.typeName.textureDepthCubeArray
                ]), 'TLevel': lIntegerTypes
            }, { 'texture': 'TTexture', 'level': 'TLevel' }, this.types.create(PgslVectorType, 2, lUnsignedInteger)),

            // 3D Textures.
            this.createOverload({ 'TTexture': this.textureTypes([PgslTextureType.typeName.texture3d]), 'TLevel': lIntegerTypes }, { 'texture': 'TTexture', 'level': 'TLevel' }, this.types.create(PgslVectorType, 3, lUnsignedInteger)),
        ]));

        // textureGather
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureGather, {}, [
            // texture_2d<ST>
            this.createOverload({ 'TComponent': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lFloat32, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            this.createOverload({ 'TComponent': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lSignedInteger, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32)
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),

            this.createOverload({ 'TComponent': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lUnsignedInteger, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32)
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger)),

            // texture_2d<ST> with offset
            this.createOverload({ 'TComponent': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lFloat32, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            this.createOverload({ 'TComponent': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lSignedInteger, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),

            this.createOverload({ 'TComponent': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lUnsignedInteger, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger)),

            // texture_2d_array<ST>
            this.createOverload({ 'TComponent': lIntegerTypes, 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lFloat32, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex'
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            this.createOverload({ 'TComponent': lIntegerTypes, 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lSignedInteger, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex'
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),

            this.createOverload({ 'TComponent': lIntegerTypes, 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lUnsignedInteger, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex'
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger)),

            // texture_2d_array<ST> with offset
            this.createOverload({ 'TComponent': lIntegerTypes, 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lFloat32, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            this.createOverload({ 'TComponent': lIntegerTypes, 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lSignedInteger, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),

            this.createOverload({ 'TComponent': lIntegerTypes, 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lUnsignedInteger, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger)),

            // texture_cube<ST>
            this.createOverload({ 'TComponent': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureCube, lFloat32, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            this.createOverload({ 'TComponent': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureCube, lSignedInteger, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32)
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),

            this.createOverload({ 'TComponent': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureCube, lUnsignedInteger, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32)
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger)),

            // texture_cube_array<ST>
            this.createOverload({ 'TComponent': lIntegerTypes, 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureCubeArray, lFloat32, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'arrayIndex': 'TIndex',
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            this.createOverload({ 'TComponent': lIntegerTypes, 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureCubeArray, lSignedInteger, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'arrayIndex': 'TIndex',
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),

            this.createOverload({ 'TComponent': lIntegerTypes, 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureCubeArray, lUnsignedInteger, null)] }, {
                'component': 'TComponent', 'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'arrayIndex': 'TIndex',
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger)),

            // texture_depth_2d
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_depth_2d with offset
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_depth_cube
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepthCube, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_depth_2d_array
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex'
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_depth_2d_array with offset
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_depth_cube_array
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepthCubeArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'arrayIndex': 'TIndex'
            }, this.types.create(PgslVectorType, 4, lFloat32)),
        ]));

        // textureGatherCompare
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureGatherCompare, {}, [
            // texture_depth_2d
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'depthReference': lFloat32
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_depth_2d with offset
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'depthReference': lFloat32,
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_depth_2d_array
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'depthReference': lFloat32
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_depth_2d_array with offset
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'depthReference': lFloat32,
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_depth_cube
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepthCube, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'depthReference': lFloat32
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_depth_cube_array
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepthCubeArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'arrayIndex': 'TIndex',
                'depthReference': lFloat32
            }, this.types.create(PgslVectorType, 4, lFloat32)),
        ]));

        // textureLoad
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureLoad, {}, [
            // texture_1d
            this.createOverload({
                'TCoords': lIntegerTypes,
                'TLevel': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture1d, lSignedInteger, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),
            this.createOverload({
                'TCoords': lIntegerTypes,
                'TLevel': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture1d, lUnsignedInteger, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger)),
            this.createOverload({
                'TCoords': lIntegerTypes,
                'TLevel': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture1d, lFloat32, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TLevel': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lSignedInteger, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TLevel': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lUnsignedInteger, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger)),
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TLevel': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lFloat32, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d_array
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TArrayIndex': lIntegerTypes,
                'TLevel': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lSignedInteger, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex', 'level': 'TLevel'
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TArrayIndex': lIntegerTypes,
                'TLevel': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lUnsignedInteger, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex', 'level': 'TLevel'
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger)),
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TArrayIndex': lIntegerTypes,
                'TLevel': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lFloat32, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex', 'level': 'TLevel'
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_3d<ST>
            this.createOverload({
                'TCoords': lIntegerVector3Types,
                'TLevel': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture3d, lSignedInteger, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),
            this.createOverload({
                'TCoords': lIntegerVector3Types,
                'TLevel': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture3d, lUnsignedInteger, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger)),
            this.createOverload({
                'TCoords': lIntegerVector3Types,
                'TLevel': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture3d, lFloat32, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_multisampled_2d
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TSampleIndex': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureMultisampled2d, lSignedInteger, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'sampleIndex': 'TSampleIndex'
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TSampleIndex': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureMultisampled2d, lUnsignedInteger, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'sampleIndex': 'TSampleIndex'
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger)),
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TSampleIndex': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureMultisampled2d, lFloat32, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'sampleIndex': 'TSampleIndex'
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_depth_2d
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TLevel': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2d, lFloat32, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'level': 'TLevel'
            }, lFloat32),

            // texture_depth_2d_array
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TLevel': lIntegerTypes,
                'TArrayIndex': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2dArray, lFloat32, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex', 'level': 'TLevel'
            }, lFloat32),

            // texture_depth_multisampled_2d
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TSampleIndex': lIntegerTypes,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepthMultisampled2d, lFloat32, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'sampleIndex': 'TSampleIndex'
            }, lFloat32),

            // texture_external
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureExternal, lFloat32, null)]
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_storage_1d
            this.createOverload({
                'TCoords': lIntegerTypes,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage1d, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, this.types.create(PgslVectorType, 4, lFloat32)),
            this.createOverload({
                'TCoords': lIntegerTypes,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage1d, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),
            this.createOverload({
                'TCoords': lIntegerTypes,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage1d, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger)),

            // texture_storage_2d
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage2d, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, this.types.create(PgslVectorType, 4, lFloat32)),
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage2d, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage2d, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger)),

            // texture_storage_2d_array
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TArrayIndex': lIntegerTypes,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage2dArray, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex'
            }, this.types.create(PgslVectorType, 4, lFloat32)),
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TArrayIndex': lIntegerTypes,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage2dArray, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex'
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TArrayIndex': lIntegerTypes,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage2dArray, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TArrayIndex'
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger)),

            // texture_storage_3d
            this.createOverload({
                'TCoords': lIntegerVector3Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage3d, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, this.types.create(PgslVectorType, 4, lFloat32)),
            this.createOverload({
                'TCoords': lIntegerVector3Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage3d, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, this.types.create(PgslVectorType, 4, lSignedInteger)),
            this.createOverload({
                'TCoords': lIntegerVector3Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage3d, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Read, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords'
            }, this.types.create(PgslVectorType, 4, lUnsignedInteger))
        ]));

        // textureNumLayers
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureNumLayers, {}, [
            this.createOverload({
                'TTexture': this.textureTypes([PgslTextureType.typeName.texture2dArray, PgslTextureType.typeName.textureCubeArray, PgslTextureType.typeName.textureDepth2dArray, PgslTextureType.typeName.textureDepthCubeArray, PgslTextureType.typeName.textureStorage2dArray])
            }, { 'texture': 'TTexture' }, lUnsignedInteger),
        ]));

        // textureNumLevels
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureNumLevels, {}, [
            this.createOverload({
                'TTexture': this.textureTypes([
                    PgslTextureType.typeName.texture1d, PgslTextureType.typeName.texture2d, PgslTextureType.typeName.texture2dArray, PgslTextureType.typeName.texture3d,
                    PgslTextureType.typeName.textureCube, PgslTextureType.typeName.textureCubeArray,
                    PgslTextureType.typeName.textureDepth2d, PgslTextureType.typeName.textureDepth2dArray,
                    PgslTextureType.typeName.textureDepthCube, PgslTextureType.typeName.textureDepthCubeArray
                ])
            }, { 'texture': 'TTexture' }, lUnsignedInteger),
        ]));

        // textureNumSamples
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureNumSamples, {}, [
            this.createOverload({
                'TTexture': this.textureTypes([PgslTextureType.typeName.textureMultisampled2d, PgslTextureType.typeName.textureDepthMultisampled2d])
            }, { 'texture': 'TTexture' }, lUnsignedInteger),
        ]));

        // textureSample
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureSample, {}, [
            // texture_1d<f32>
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture1d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': lFloat32
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d<f32>
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d<f32> with offset
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d_array<f32>
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex'
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d_array<f32> with offset
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_3d<f32>
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture3d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_3d<f32> with offset
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture3d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'offset': this.types.create(PgslVectorType, 3, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_cube<f32>
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureCube, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_cube_array<f32>
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureCubeArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'arrayIndex': 'TIndex'
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_depth_2d
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32)
            }, lFloat32),

            // texture_depth_2d with offset
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, lFloat32),

            // texture_depth_2d_array
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex'
            }, lFloat32),

            // texture_depth_2d_array with offset
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, lFloat32),

            // texture_depth_cube
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepthCube, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32)
            }, lFloat32),

            // texture_depth_cube_array
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepthCubeArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'arrayIndex': 'TIndex'
            }, lFloat32),
        ]));

        // textureSampleBias
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureSampleBias, {}, [
            // texture_2d<f32>
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'bias': lFloat32
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d<f32> with offset
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'bias': lFloat32,
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d_array<f32>
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'bias': lFloat32
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d_array<f32> with offset
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'bias': lFloat32,
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_3d<f32> & texture_cube<f32>
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture3d, lFloat32, null), this.types.create(PgslTextureType, PgslTextureType.typeName.textureCube, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'bias': lFloat32
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_3d<f32> with offset
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture3d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'bias': lFloat32,
                'offset': this.types.create(PgslVectorType, 3, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_cube_array<f32>
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureCubeArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'arrayIndex': 'TIndex',
                'bias': lFloat32
            }, this.types.create(PgslVectorType, 4, lFloat32)),
        ]));

        // textureSampleCompare
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureSampleCompare, {}, [
            // texture_depth_2d
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'depthRef': lFloat32
            }, lFloat32),

            // texture_depth_2d with offset
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'depthRef': lFloat32,
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, lFloat32),

            // texture_depth_2d_array
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'depthRef': lFloat32
            }, lFloat32),

            // texture_depth_2d_array with offset
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'depthRef': lFloat32,
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, lFloat32),

            // texture_depth_cube
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepthCube, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'depthRef': lFloat32
            }, lFloat32),

            // texture_depth_cube_array
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepthCubeArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'arrayIndex': 'TIndex',
                'depthRef': lFloat32
            }, lFloat32),
        ]));

        // textureSampleCompareLevel
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureSampleCompareLevel, {}, [
            // texture_depth_2d
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'depthRef': lFloat32
            }, lFloat32),

            // texture_depth_2d with offset
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'depthRef': lFloat32,
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, lFloat32),

            // texture_depth_2d_array
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'depthRef': lFloat32
            }, lFloat32),

            // texture_depth_2d_array with offset
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'depthRef': lFloat32,
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, lFloat32),

            // texture_depth_cube
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepthCube, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'depthRef': lFloat32
            }, lFloat32),

            // texture_depth_cube_array
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepthCubeArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSamplerComparison,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'arrayIndex': 'TIndex',
                'depthRef': lFloat32
            }, lFloat32),
        ]));

        // textureSampleGrad
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureSampleGrad, {}, [
            // texture_2d<f32>
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'ddx': this.types.create(PgslVectorType, 2, lFloat32),
                'ddy': this.types.create(PgslVectorType, 2, lFloat32)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d<f32> with offset
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'ddx': this.types.create(PgslVectorType, 2, lFloat32),
                'ddy': this.types.create(PgslVectorType, 2, lFloat32),
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d_array<f32>
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'ddx': this.types.create(PgslVectorType, 2, lFloat32),
                'ddy': this.types.create(PgslVectorType, 2, lFloat32)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d_array<f32> with offset
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'ddx': this.types.create(PgslVectorType, 2, lFloat32),
                'ddy': this.types.create(PgslVectorType, 2, lFloat32),
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_3d<f32> & texture_cube<f32>
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture3d, lFloat32, null), this.types.create(PgslTextureType, PgslTextureType.typeName.textureCube, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'ddx': this.types.create(PgslVectorType, 3, lFloat32),
                'ddy': this.types.create(PgslVectorType, 3, lFloat32)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_3d<f32> with offset
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture3d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'ddx': this.types.create(PgslVectorType, 3, lFloat32),
                'ddy': this.types.create(PgslVectorType, 3, lFloat32),
                'offset': this.types.create(PgslVectorType, 3, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_cube_array<f32>
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureCubeArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'arrayIndex': 'TIndex',
                'ddx': this.types.create(PgslVectorType, 3, lFloat32),
                'ddy': this.types.create(PgslVectorType, 3, lFloat32)
            }, this.types.create(PgslVectorType, 4, lFloat32)),
        ]));

        // textureSampleLevel
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureSampleLevel, {}, [
            // texture_1d<f32>
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture1d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': lFloat32,
                'level': lFloat32
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d<f32>
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'level': lFloat32
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d<f32> with offset
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'level': lFloat32,
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d_array<f32>
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'level': lFloat32
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_2d_array<f32> with offset
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'level': lFloat32,
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_3d<f32> & texture_cube<f32>
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture3d, lFloat32, null), this.types.create(PgslTextureType, PgslTextureType.typeName.textureCube, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'level': lFloat32
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_3d<f32> with offset
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture3d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'level': lFloat32,
                'offset': this.types.create(PgslVectorType, 3, lSignedInteger)
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_cube_array<f32>
            this.createOverload({ 'TIndex': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureCubeArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'arrayIndex': 'TIndex',
                'level': lFloat32
            }, this.types.create(PgslVectorType, 4, lFloat32)),

            // texture_depth_2d
            this.createOverload({ 'TLevel': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'level': 'TLevel'
            }, lFloat32),

            // texture_depth_2d with offset
            this.createOverload({ 'TLevel': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'level': 'TLevel',
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, lFloat32),

            // texture_depth_2d_array
            this.createOverload({ 'TIndex': lIntegerTypes, 'TLevel': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'level': 'TLevel'
            }, lFloat32),

            // texture_depth_2d_array with offset
            this.createOverload({ 'TIndex': lIntegerTypes, 'TLevel': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepth2dArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32),
                'arrayIndex': 'TIndex',
                'level': 'TLevel',
                'offset': this.types.create(PgslVectorType, 2, lSignedInteger)
            }, lFloat32),

            // texture_depth_cube
            this.createOverload({ 'TLevel': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepthCube, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'level': 'TLevel'
            }, lFloat32),

            // texture_depth_cube_array
            this.createOverload({ 'TIndex': lIntegerTypes, 'TLevel': lIntegerTypes, 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.textureDepthCubeArray, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 3, lFloat32),
                'arrayIndex': 'TIndex',
                'level': 'TLevel'
            }, lFloat32),
        ]));

        // textureSampleBaseClampToEdge
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureSampleBaseClampToEdge, {}, [
            this.createOverload({ 'TTexture': [this.types.create(PgslTextureType, PgslTextureType.typeName.texture2d, lFloat32, null)] }, {
                'texture': 'TTexture', 'sampler': lSampler,
                'coords': this.types.create(PgslVectorType, 2, lFloat32)
            }, this.types.create(PgslVectorType, 4, lFloat32)),
        ]));

        // textureStore
        this.registerDeclaration(this.createFunction(PgslTextureFunctionFeatureSetProcessor.names.textureStore, {}, [
            // texture_storage_1d
            this.createOverload({
                'TCoords': lIntegerTypes,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage1d, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': this.types.create(PgslVectorType, 4, lFloat32)
            }, lVoid),
            this.createOverload({
                'TCoords': lIntegerTypes,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage1d, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': this.types.create(PgslVectorType, 4, lSignedInteger)
            }, lVoid),
            this.createOverload({
                'TCoords': lIntegerTypes,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage1d, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': this.types.create(PgslVectorType, 4, lUnsignedInteger)
            }, lVoid),

            // texture_storage_2d
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage2d, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': this.types.create(PgslVectorType, 4, lFloat32)
            }, lVoid),
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage2d, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': this.types.create(PgslVectorType, 4, lSignedInteger)
            }, lVoid),
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage2d, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': this.types.create(PgslVectorType, 4, lUnsignedInteger)
            }, lVoid),

            // texture_storage_2d_array
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage2dArray, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite]),
                'TIndex': lIntegerTypes
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TIndex', 'value': this.types.create(PgslVectorType, 4, lFloat32)
            }, lVoid),
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage2dArray, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite]),
                'TIndex': lIntegerTypes
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TIndex', 'value': this.types.create(PgslVectorType, 4, lSignedInteger)
            }, lVoid),
            this.createOverload({
                'TCoords': lIntegerVector2Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage2dArray, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite]),
                'TIndex': lIntegerTypes
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'arrayIndex': 'TIndex', 'value': this.types.create(PgslVectorType, 4, lUnsignedInteger)
            }, lVoid),

            // texture_storage_3d
            this.createOverload({
                'TCoords': lIntegerVector3Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage3d, PgslNumericType.typeName.float32, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': this.types.create(PgslVectorType, 4, lFloat32)
            }, lVoid),
            this.createOverload({
                'TCoords': lIntegerVector3Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage3d, PgslNumericType.typeName.signedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': this.types.create(PgslVectorType, 4, lSignedInteger)
            }, lVoid),
            this.createOverload({
                'TCoords': lIntegerVector3Types,
                'TTexture': this.storageTextureTypes(PgslTextureType.typeName.textureStorage3d, PgslNumericType.typeName.unsignedInteger, [PgslAccessModeEnum.VALUES.Write, PgslAccessModeEnum.VALUES.ReadWrite])
            }, {
                'texture': 'TTexture', 'coords': 'TCoords', 'value': this.types.create(PgslVectorType, 4, lUnsignedInteger)
            }, lVoid)
        ]));
    }

    /**
     * Get storage texture types for every texel format of a channel type and every access mode.
     *
     * @param pTextureName - Storage texture type name.
     * @param pChannelType - Numeric channel type of the texel formats.
     * @param pAccessModes - Allowed access modes.
     *
     * @returns all matching storage texture types.
     */
    private storageTextureTypes(pTextureName: PgslTextureTypeName, pChannelType: PgslNumericTypeName, pAccessModes: Array<PgslAccessMode>): Array<BasePgslType> {
        return PgslTexelFormatEnum.formatByType(pChannelType).flatMap((pTexelFormat: PgslTexelFormat) => {
            // Storage textures sample the channel type of their texel format.
            const lSampledType: BasePgslType = this.types.create(PgslNumericType, PgslTexelFormatEnum.texelNumericType(pTexelFormat));

            return pAccessModes.map((pAccessMode: PgslAccessMode) => {
                return this.types.create(PgslTextureType, pTextureName, lSampledType, { format: pTexelFormat, access: pAccessMode });
            });
        });
    }

    /**
     * Get every declarable variant of the texture types.
     * Sampled textures are created for every sampled type and storage textures for every texel format and access mode.
     *
     * @param pTextureNames - Texture type names.
     *
     * @returns all texture variants.
     */
    private textureTypes(pTextureNames: Array<PgslTextureTypeName>): Array<BasePgslType> {
        const lChannelTypes: Array<PgslNumericTypeName> = [PgslNumericType.typeName.float32, PgslNumericType.typeName.signedInteger, PgslNumericType.typeName.unsignedInteger];

        return pTextureNames.flatMap((pTextureName: PgslTextureTypeName) => {
            // Sampled textures for every sampled type.
            if (PgslTextureType.isSampledTextureType(pTextureName)) {
                return lChannelTypes.map((pChannelType: PgslNumericTypeName) => {
                    return this.types.create(PgslTextureType, pTextureName, this.types.create(PgslNumericType, pChannelType), null);
                });
            }

            // Storage textures for every texel format and access mode.
            if (PgslTextureType.isStorageTextureType(pTextureName)) {
                return lChannelTypes.flatMap((pChannelType: PgslNumericTypeName) => {
                    return this.storageTextureTypes(pTextureName, pChannelType, Object.values(PgslAccessModeEnum.VALUES));
                });
            }

            // Depth and external textures have no templates and always sample floats.
            return [this.types.create(PgslTextureType, pTextureName, this.types.create(PgslNumericType, PgslNumericType.typeName.float32), null)];
        });
    }
}
