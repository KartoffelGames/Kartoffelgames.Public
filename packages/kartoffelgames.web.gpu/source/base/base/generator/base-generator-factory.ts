import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core.data';
import { BindDataGroup } from '../binding/bind-data-group';
import { BindDataGroupLayout } from '../binding/bind-data-group-layout';
import { PipelineDataLayout } from '../binding/pipeline-data-layout';
import { GpuBuffer } from '../buffer/gpu-buffer';
import { GpuObject } from '../gpu/gpu-object';
import { BaseShaderInterpreter } from '../shader/interpreter/base-shader-interpreter';
import { RenderShader } from '../shader/render-shader';
import { CanvasTexture } from '../texture/canvas-texture';
import { FrameBufferTexture } from '../texture/frame-buffer-texture';
import { ImageTexture } from '../texture/image-texture';
import { TextureSampler } from '../texture/texture-sampler';
import { VideoTexture } from '../texture/video-texture';
import { BaseNativeGenerator } from './base-native-generator';

export abstract class BaseGeneratorFactory<TNativeMap extends NativeGpuObjects = NativeGpuObjects> {
    private readonly mGenerators: Dictionary<keyof TNativeMap, BaseNativeGenerator<BaseGeneratorFactory<TNativeMap>, TNativeMap, any>>;
    private readonly mNativeType: WeakMap<TNativeMap[keyof TNativeMap], keyof TNativeMap>;
    private readonly mObjectCache: WeakMap<GpuObject, TNativeMap[keyof TNativeMap]>;
    private readonly mShaderInterpreter: BaseShaderInterpreter;

    /**
     * Shader interpreter.
     */
    public get shaderInterpreter(): BaseShaderInterpreter {
        return this.mShaderInterpreter;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mNativeType = new WeakMap<TNativeMap[keyof TNativeMap], keyof TNativeMap>();
        this.mObjectCache = new WeakMap<GpuObject, TNativeMap[keyof TNativeMap]>();
        this.mGenerators = new Dictionary<keyof TNativeMap, BaseNativeGenerator<this, TNativeMap, any>>();

        // Create interpreter.
        this.mShaderInterpreter = this.createShaderInterpreter();
    }

    /**
     * Generate native.
     * @param pType - Type name of base object.
     * @param pBaseObject - Base gpu object.
     */
    public generate<TKey extends keyof TNativeMap & keyof BaseObjectMap>(pType: TKey, pBaseObject: BaseObjectMap[TKey]): TNativeMap[TKey] {
        // Get and validate generator function.
        const lGenerator: BaseNativeGenerator<BaseGeneratorFactory<TNativeMap>, TNativeMap, TKey> | undefined = this.mGenerators.get(pType);
        if (!lGenerator) {
            throw new Exception(`No generator for type "${pBaseObject.constructor.name}" defined`, this);
        }

        // Use cached objects if they are still valid.
        if (this.mObjectCache.has(pBaseObject)) {
            return <TNativeMap[TKey]>this.mObjectCache.get(pBaseObject);
        }

        // Generate and cache new object.
        const lNativeObject: TNativeMap[TKey] = lGenerator.generate(pBaseObject);
        this.mObjectCache.set(pBaseObject, lNativeObject);
        this.mNativeType.set(lNativeObject, pType);

        return lNativeObject;
    }

    /**
     * Invalidate object.
     * @param pBaseObject 
     */
    public invalidate(pBaseObject: GpuObject): void {
        // Deconstruct native object.
        if (this.mObjectCache.has(pBaseObject)) {
            const lNative = this.mObjectCache.get(pBaseObject)!;

            // Get native object type name.
            const lTypeName: keyof TNativeMap | undefined = this.mNativeType.get(lNative);
            if (!lTypeName) {
                throw new Exception('Typename for a native gpu object was not set.', this);
            }

            // Get and validate generator function.
            const lGenerator: BaseNativeGenerator<BaseGeneratorFactory<TNativeMap>, TNativeMap, any> | undefined = this.mGenerators.get(lTypeName);
            if (!lGenerator) {
                throw new Exception(`No generator for type "${pBaseObject.constructor.name}" defined`, this);
            }

            // Destructor.
            lGenerator.destroy(pBaseObject, lNative);

            // No need to clear natives as it is stored inside a weakmap. GC makes the job.
        }
    }

    /**
     * Register an generatpr for this type.
     * @param pType - Base gpu object type name.
     * @param pGenerator - Generator for this type.
     */
    protected registerGenerator<TKey extends keyof TNativeMap & keyof BaseObjectMap>(pType: TKey, pGenerator: BaseNativeGenerator<BaseGeneratorFactory<TNativeMap>, TNativeMap, TKey>): void {
        this.mGenerators.set(pType, pGenerator);
    }

    /**
     * Init gpu device.
     */
    public abstract init(): Promise<this>;

    /**
     * Create generator for interpreting shaders.
     */
    protected abstract createShaderInterpreter(): BaseShaderInterpreter;
}

// Generator base gpu object to native object mapping.
type PropertyKeyCopy<TPropertyKeys, TPropertyValue> = {
    [Property in keyof TPropertyKeys]: TPropertyValue
};
export type NativeGpuObjects = PropertyKeyCopy<BaseObjectMap, object>;

// Mapping of all base gpu objects.
export type BaseObjectMap = {
    // Textures.
    textureSampler: TextureSampler;
    imageTexture: ImageTexture;
    frameBufferTexture: FrameBufferTexture;
    videoTexture: VideoTexture;
    canvasTexture: CanvasTexture;

    // Things with generics. :(
    buffer: GpuBuffer<TypedArray>;

    // Pipeline layouting.
    bindDataGroupLayout: BindDataGroupLayout;
    bindDataGroup: BindDataGroup;
    pipelineDataLayout: PipelineDataLayout;

    // Shader.
    renderShader: RenderShader;
};