import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core.data';
import { BindDataGroup } from '../binding/bind-data-group';
import { BindDataGroupLayout } from '../binding/bind-data-group-layout';
import { PipelineDataLayout } from '../binding/pipeline-data-layout';
import { GpuBuffer } from '../buffer/gpu-buffer';
import { GpuObject } from '../gpu/gpu-object';
import { RenderShader } from '../shader/render-shader';
import { CanvasTexture } from '../texture/canvas-texture';
import { FrameBufferTexture } from '../texture/frame-buffer-texture';
import { ImageTexture } from '../texture/image-texture';
import { TextureSampler } from '../texture/texture-sampler';
import { VideoTexture } from '../texture/video-texture';
import { BaseNativeBufferGenerator } from './base-native-buffer-generator';
import { BaseNativeGenerator } from './base-native-generator';
import { GpuDevice } from '../gpu/gpu-device';
import { ComputeShader } from '../shader/compute-shader';
import { VertexFragmentPipeline } from '../pipeline/vertex-fragment-pipeline';
import { RenderTargets } from '../pipeline/target/render-targets';

export abstract class BaseGeneratorFactory<TGeneratorMap extends GeneratorNativeMap = GeneratorNativeMap> {
    private mDevice: GpuDevice | null;
    private readonly mGeneratorConstructors: Dictionary<ConstructorOf<GenerateableGpuObject>, ConstructorOf<NativeGenerator<TGeneratorMap>>>;
    private readonly mGenerators: Dictionary<GenerateableGpuObject, NativeGenerator<TGeneratorMap>>;

    public get device(): GpuDevice {
        if (!this.mDevice) {
            throw new Exception('Generator factory not initialized.', this);
        }

        return this.mDevice;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mGeneratorConstructors = new Dictionary<ConstructorOf<GenerateableGpuObject>, ConstructorOf<NativeGenerator<TGeneratorMap>>>();
        this.mGenerators = new Dictionary<GenerateableGpuObject, NativeGenerator<TGeneratorMap>>();
        this.mDevice = null;
    }

    /**
     * Init factory with gpu device.
     * @param pDevice - Gpu device.
     */
    public async init(pDevice: GpuDevice): Promise<this> {
        // Set device.
        this.mDevice = pDevice;

        // Init internals.
        await this.initInternals();

        // Resolve with itself.
        return this;
    }

    /**
     * Generate native.
     * @param pType - Type name of base object.
     * @param pBaseObject - Base gpu object.
     */
    public request<TKey extends GeneratorObjectKeys>(pBaseObject: GenerateableGpuObjectOf<TKey>): NativeGeneratorOf<TGeneratorMap, TKey> {
        // Check for cached generator.
        if (this.mGenerators.has(pBaseObject)) {
            return <NativeGeneratorOf<TGeneratorMap, TKey>>this.mGenerators.get(pBaseObject)!;
        }

        // Get and validate generator function.
        const lGeneratorConstructor = <ConstructorOf<NativeGeneratorOf<TGeneratorMap, TKey>> | undefined>this.mGeneratorConstructors.get(<any>pBaseObject.constructor);
        if (!lGeneratorConstructor) {
            // Currently only for 'none' Gpu objects or unset generators.
            const lNullCache: null | any = null;

            // Cache null.
            this.mGenerators.set(pBaseObject, lNullCache);

            return lNullCache;
        }

        // Create and cache generator.
        const lGenerator: NativeGeneratorOf<TGeneratorMap, TKey> = new lGeneratorConstructor(pBaseObject);
        this.mGenerators.set(pBaseObject, lGenerator);

        return lGenerator;
    }

    /**
     * Register an generatpr for this type.
     * @param pType - Base gpu object type name.
     * @param pGenerator - Generator for this type.
     */
    protected registerGenerator<TKey extends GeneratorObjectKeys>(pType: ConstructorOf<GenerateableGpuObjectOf<TKey>>, pGenerator: ConstructorOf<NativeGeneratorOf<TGeneratorMap, TKey>>): void {
        if (this.mGeneratorConstructors.has(pType)) {
            throw new Exception(`Generator already registed for "${pType.name}"`, this);
        }

        this.mGeneratorConstructors.set(pType, <ConstructorOf<NativeGenerator<TGeneratorMap>>>pGenerator);
    }

    /**
     * Init factory internals.
     */
    protected abstract initInternals(): Promise<void>;
}

// Generator keys with optional 'none'
export type GeneratorObjectKeys = keyof GeneratorFactoryMap | 'none';
type GenerateableGpuObjectOf<TKey extends GeneratorObjectKeys> = TKey extends keyof GeneratorFactoryMap ? GeneratorFactoryMap[TKey]['gpuObject'] : GpuObject<'none'>;
type GenerateableGpuObject = GenerateableGpuObjectOf<GeneratorObjectKeys>;
type NativeGeneratorOf<TMap extends GeneratorNativeMap, TKey extends GeneratorObjectKeys> = TKey extends keyof GeneratorFactoryMap ? TMap['generators'][TKey]['generator'] : null;
type NativeGenerator<TMap extends GeneratorNativeMap> = NativeGeneratorOf<TMap, GeneratorObjectKeys>;

// Constructor type.
type ConstructorOf<T> = new (...pArgs: Array<any>) => T;

// Mapping of all base gpu objects.
export interface GeneratorFactoryMap {
    // Textures.
    textureSampler: {
        gpuObject: TextureSampler;
        generator: BaseNativeGenerator<GeneratorNativeMap, 'textureSampler'>;
    };
    imageTexture: {
        gpuObject: ImageTexture;
        generator: BaseNativeGenerator<GeneratorNativeMap, 'imageTexture'>;
    };
    frameBufferTexture: {
        gpuObject: FrameBufferTexture;
        generator: BaseNativeGenerator<GeneratorNativeMap, 'frameBufferTexture'>;
    };
    videoTexture: {
        gpuObject: VideoTexture;
        generator: BaseNativeGenerator<GeneratorNativeMap, 'videoTexture'>;
    };
    canvasTexture: {
        gpuObject: CanvasTexture;
        generator: BaseNativeGenerator<GeneratorNativeMap, 'canvasTexture'>;
    };

    // Things with generics. :(
    gpuBuffer: {
        gpuObject: GpuBuffer<TypedArray>;
        generator: BaseNativeBufferGenerator<GeneratorNativeMap, 'gpuBuffer'>;
    };

    // Pipeline layouting.
    bindDataGroupLayout: {
        gpuObject: BindDataGroupLayout;
        generator: BaseNativeGenerator<GeneratorNativeMap, 'bindDataGroupLayout'>;
    };
    bindDataGroup: {
        gpuObject: BindDataGroup;
        generator: BaseNativeGenerator<GeneratorNativeMap, 'bindDataGroup'>;
    };
    pipelineDataLayout: {
        gpuObject: PipelineDataLayout;
        generator: BaseNativeGenerator<GeneratorNativeMap, 'pipelineDataLayout'>;
    };
    renderTargets: {
        gpuObject: RenderTargets;
        generator: BaseNativeGenerator<GeneratorNativeMap, 'renderTargets'>;
    }

    // Pipelines.
    vertexFragmentPipeline: {
        gpuObject: VertexFragmentPipeline;
        generator: BaseNativeGenerator<GeneratorNativeMap, 'vertexFragmentPipeline'>;
    }

    // Shader.
    renderShader: {
        gpuObject: RenderShader;
        generator: BaseNativeGenerator<GeneratorNativeMap, 'renderShader'>;
    };
    computeShader: {
        gpuObject: ComputeShader;
        generator: BaseNativeGenerator<GeneratorNativeMap, 'computeShader'>;
    };
}

// Same type but without undefined behavior.
export interface GeneratorNativeMap {
    factory: BaseGeneratorFactory<GeneratorNativeMap>;
    generators: {
        [Property in keyof GeneratorFactoryMap]: {
            generator: GeneratorFactoryMap[Property]['generator'];
            native: any;
        }
    };
}