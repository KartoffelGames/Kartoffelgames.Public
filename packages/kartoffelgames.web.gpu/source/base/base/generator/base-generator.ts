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

export abstract class BaseGenerator<TNativeMap extends NativeGpuObjects = NativeGpuObjects> {
    private readonly mDestructors: Dictionary<keyof TNativeMap, DestructorFunction<TNativeMap, any>>;
    private readonly mGenerators: Dictionary<keyof TNativeMap, GeneratorFunction<TNativeMap, any>>;
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
        this.mDestructors = new Dictionary<keyof TNativeMap, DestructorFunction<TNativeMap, any>>();
        this.mGenerators = new Dictionary<keyof TNativeMap, GeneratorFunction<TNativeMap, any>>();

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
        const lGenerator: GeneratorFunction<TNativeMap, TKey> | undefined = this.mGenerators.get(pType);
        if (!lGenerator) {
            throw new Exception(`No generator for type "${pBaseObject.constructor.name}" defined`, this);
        }

        // Use cached objects if they are still valid.
        if (this.mObjectCache.has(pBaseObject)) {
            return <TNativeMap[TKey]>this.mObjectCache.get(pBaseObject);
        }

        // Generate and cache new object.
        const lNativeObject: TNativeMap[TKey] = lGenerator(pBaseObject);
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

            // Get and validate destructor function.
            const lDestructor: DestructorFunction<TNativeMap, any> | undefined = this.mDestructors.get(lTypeName);
            if (!lDestructor) {
                throw new Exception(`No destructor for type "${pBaseObject.constructor.name}" defined`, this);
            }

            // Destructor.
            lDestructor(pBaseObject, lNative);

            // Delete cached value.
            this.mObjectCache.delete(pBaseObject);
        }
    }

    /**
     * Register an generatpr for this type.
     * @param pType - Base gpu object type name.
     * @param pGeneratorFunction - Generator for this type.
     */
    protected registerDestructor<TKey extends keyof TNativeMap & keyof BaseObjectMap>(pType: TKey, pDestructorFunction: DestructorFunction<TNativeMap, TKey>): void {
        this.mDestructors.set(pType, <any>pDestructorFunction);
    }

    /**
     * Register an generatpr for this type.
     * @param pType - Base gpu object type name.
     * @param pGeneratorFunction - Generator for this type.
     */
    protected registerGenerator<TKey extends keyof TNativeMap & keyof BaseObjectMap>(pType: TKey, pGeneratorFunction: GeneratorFunction<TNativeMap, TKey>): void {
        this.mGenerators.set(pType, <any>pGeneratorFunction);
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

// Generator and 
type GeneratorFunction<TNativeMap extends NativeGpuObjects, TKey extends keyof TNativeMap & keyof BaseObjectMap> = (pBaseObject: BaseObjectMap[TKey]) => TNativeMap[TKey];
type DestructorFunction<TNativeMap extends NativeGpuObjects, TKey extends keyof TNativeMap & keyof BaseObjectMap> = (pBaseObject: BaseObjectMap[TKey], pNativeObject: TNativeMap[TKey]) => void;

// Generator base gpu object to native object mapping.
type PropertyKeyCopy<TPropertyKeys, TPropertyValue> = {
    [Property in keyof TPropertyKeys]: TPropertyValue
};
type NativeGpuObjects = PropertyKeyCopy<BaseObjectMap, object>;

// Mapping of all base gpu objects.
type BaseObjectMap = {
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