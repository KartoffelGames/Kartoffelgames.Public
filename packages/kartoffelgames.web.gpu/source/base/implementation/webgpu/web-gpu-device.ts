import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core.data';
import { GpuDevice, GpuTypes } from '../../base/gpu/gpu-device';
import { WebGpuBindGroup } from './bind_group/web-gpu-bind-group';
import { WebGpuBindGroupLayout } from './bind_group/web-gpu-bind-group-layout';
import { WebGpuPipelineLayout } from './bind_group/web-gpu-pipeline-layout';
import { WebGpuBuffer } from './buffer/web-gpu-buffer';
import { WebGpuArrayBufferMemoryLayout } from './memory_layout/buffer/web-gpu-array-buffer-memory-layout';
import { WebGpuLinearBufferMemoryLayout } from './memory_layout/buffer/web-gpu-linear-buffer-memory-layout';
import { WebGpuStructBufferMemoryLayout } from './memory_layout/buffer/web-gpu-struct-buffer-memory-layout';
import { WebGpuSamplerMemoryLayout } from './memory_layout/web-gpu-sampler-memory-layout';
import { WebGpuTextureMemoryLayout } from './memory_layout/web-gpu-texture-memory-layout';
import { WebGpuCanvasTexture } from './texture/texture/web-gpu-canvas-texture';
import { WebGpuFrameBufferTexture } from './texture/texture/web-gpu-frame-buffer-texture';
import { WebGpuImageTexture } from './texture/texture/web-gpu-image-texture';
import { WebGpuVideoTexture } from './texture/texture/web-gpu-video-texture';
import { WebGpuTextureSampler } from './texture/web-gpu-texture-sampler';
import { WebGpuShader } from './shader/web-gpu-shader';
import { WebGpuShaderInformation } from './shader/web-gpu-shader-information';

export class WebGpuDevice extends GpuDevice<WebGpuTypes> {
    private static readonly mAdapters: Dictionary<string, GPUAdapter> = new Dictionary<string, GPUAdapter>();
    private static readonly mDevices: Dictionary<GPUAdapter, GPUDevice> = new Dictionary<GPUAdapter, GPUDevice>();

    private mGpuAdapter: GPUAdapter | null;
    private mGpuDevice: GPUDevice | null;

    /**
     * GPU adapter.
     */
    public get adapter(): GPUAdapter {
        if (this.mGpuAdapter === null) {
            throw new Exception('Web GPU device not initialized.', this);
        }

        return this.mGpuAdapter;
    }

    /**
     * Preferred texture format.
     */
    public get preferredFormat(): GPUTextureFormat {
        return window.navigator.gpu.getPreferredCanvasFormat();
    }

    /**
     * Constructor.
     */
    private constructor() {
        super();

        this.mGpuAdapter = null;
        this.mGpuDevice = null;
    }

    /**
     * Generate empty bind group layout.
     */
    public override bindGroupLayout(): WebGpuBindGroupLayout {
        return new WebGpuBindGroupLayout(this);
    }

    /**
     * Init devices.
     */
    public async init(): Promise<this> {
        const lPerformance: GPUPowerPreference = 'high-performance';

        // Try to load cached adapter. When not cached, request new one.
        const lAdapter: GPUAdapter | null = WebGpuDevice.mAdapters.get(lPerformance) ?? await window.navigator.gpu.requestAdapter({ powerPreference: lPerformance });
        if (!lAdapter) {
            throw new Exception('Error requesting GPU adapter', WebGpuDevice);
        }

        WebGpuDevice.mAdapters.set(lPerformance, lAdapter);

        // Try to load cached device. When not cached, request new one.
        const lDevice: GPUDevice | null = WebGpuDevice.mDevices.get(lAdapter) ?? await lAdapter.requestDevice();
        if (!lDevice) {
            throw new Exception('Error requesting GPU device', WebGpuDevice);
        }

        WebGpuDevice.mDevices.set(lAdapter, lDevice);

        this.mGpuAdapter = lAdapter;
        this.mGpuDevice = lDevice;

        return this;
    }

    /**
     * Generate empty pipeline layout.
     */
    public override pipelineLayout(): WebGpuPipelineLayout {
        return new WebGpuPipelineLayout(this);
    }

    /**
     * Create shader.
     * @param pSource - Shader source.
     */
    public override shader(pSource: string): WebGpuShader {
        return new WebGpuShader(this, pSource);
    }
}

export interface WebGpuTypes extends GpuTypes {
    // Core
    gpuDevice: WebGpuDevice;

    // Texture Layouts.
    textureMemoryLayout: WebGpuTextureMemoryLayout;
    samplerMemoryLayout: WebGpuSamplerMemoryLayout;

    // Buffer Layouts.
    arrayBufferMemoryLayout: WebGpuArrayBufferMemoryLayout;
    linearBufferMemoryLayout: WebGpuLinearBufferMemoryLayout;
    structBufferMemoryLayout: WebGpuStructBufferMemoryLayout;

    // Texture.
    textureSampler: WebGpuTextureSampler;
    imageTexture: WebGpuImageTexture;
    frameBufferTexture: WebGpuFrameBufferTexture | WebGpuCanvasTexture;
    videoTexture: WebGpuVideoTexture;

    // Things with generics. :(
    buffer: WebGpuBuffer<TypedArray>;

    // Pipeline layouting.
    bindGroupLayout: WebGpuBindGroupLayout;
    pipelineLayout: WebGpuPipelineLayout;
    bindGroup: WebGpuBindGroup;

    // Shader.
    shader: WebGpuShader;
    shaderInformation: WebGpuShaderInformation;
}