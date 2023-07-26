import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core.data';
import { GpuDevice, GpuTypes } from '../../base/gpu/gpu-device';
import { ArrayBufferMemoryLayoutParameter } from '../../base/memory_layout/buffer/array-buffer-memory-layout';
import { LinearBufferMemoryLayoutParameter } from '../../base/memory_layout/buffer/linear-buffer-memory-layout';
import { StructBufferMemoryLayoutParameter } from '../../base/memory_layout/buffer/struct-buffer-memory-layout';
import { SamplerMemoryLayoutParameter } from '../../base/memory_layout/sampler-memory-layout';
import { TextureMemoryLayoutParameter } from '../../base/memory_layout/texture-memory-layout';
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

export class WebGpuDevice extends GpuDevice<WebGpuTypes> {
    private static readonly mAdapters: Dictionary<string, GPUAdapter> = new Dictionary<string, GPUAdapter>();
    private static readonly mDevices: Dictionary<GPUAdapter, GPUDevice> = new Dictionary<GPUAdapter, GPUDevice>();

    /**
     * Create GPU device.
     * @param pMode - Prefered device mode.
     */
    public static async create(pMode: GPUPowerPreference): Promise<WebGpuDevice> {
        // Try to load cached adapter. When not cached, request new one.
        const lAdapter: GPUAdapter | null = WebGpuDevice.mAdapters.get(pMode) ?? await window.navigator.gpu.requestAdapter({ powerPreference: pMode });
        if (!lAdapter) {
            throw new Exception('Error requesting GPU adapter', WebGpuDevice);
        }

        WebGpuDevice.mAdapters.set(pMode, lAdapter);

        // Try to load cached device. When not cached, request new one.
        const lDevice: GPUDevice | null = WebGpuDevice.mDevices.get(lAdapter) ?? await lAdapter.requestDevice();
        if (!lDevice) {
            throw new Exception('Error requesting GPU device', WebGpuDevice);
        }

        WebGpuDevice.mDevices.set(lAdapter, lDevice);

        return new WebGpuDevice(lAdapter, lDevice);
    }

    private readonly mGpuAdapter: GPUAdapter;
    private readonly mGpuDevice: GPUDevice;

    /**
     * GPU adapter.
     */
    public get adapter(): GPUAdapter {
        return this.mGpuAdapter;
    }

    /**
     * GPU device.
     */
    public get device(): GPUDevice {
        return this.mGpuDevice;
    }

    /**
     * Preferred texture format.
     */
    public get preferredFormat(): GPUTextureFormat {
        return window.navigator.gpu.getPreferredCanvasFormat();
    }

    /**
     * Constructor.
     * @param pGpuAdapter - Gpu adapter. 
     * @param pGpuDevice - Gpu device.
     */
    private constructor(pGpuAdapter: GPUAdapter, pGpuDevice: GPUDevice) {
        super();

        this.mGpuAdapter = pGpuAdapter;
        this.mGpuDevice = pGpuDevice;
    }

    /**
     * Create array buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public arrayMemoryLayout(pParameter: ArrayBufferMemoryLayoutParameter<WebGpuTypes>): WebGpuTypes['arrayBufferMemoryLayout'] {
        return new WebGpuArrayBufferMemoryLayout(this, pParameter);
    }

    /**
     * Create array buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public linearMemoryLayout(pParameter: LinearBufferMemoryLayoutParameter<WebGpuTypes>): WebGpuTypes['linearBufferMemoryLayout'] {
        return new WebGpuLinearBufferMemoryLayout(this, pParameter);
    }

    /**
     * Create sampler memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public samplerMemoryLayout(pParameter: SamplerMemoryLayoutParameter): WebGpuTypes['samplerMemoryLayout'] {
        return new WebGpuSamplerMemoryLayout(this, pParameter);
    }

    /**
     * Create struct buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public structMemoryLayout(pParameter: StructBufferMemoryLayoutParameter<WebGpuTypes>): WebGpuTypes['structBufferMemoryLayout'] {
        return new WebGpuStructBufferMemoryLayout(this, pParameter);
    }

    /**
     * Create texture memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public textureMemoryLayout(pParameter: TextureMemoryLayoutParameter): WebGpuTypes['textureMemoryLayout'] {
        return new WebGpuTextureMemoryLayout(this, pParameter);
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

    // Texture
    textureSampler: WebGpuTextureSampler;
    imageTexture: WebGpuImageTexture;
    frameBufferTexture: WebGpuFrameBufferTexture | WebGpuCanvasTexture;
    videoTexture: WebGpuVideoTexture;

    // Things with generics. :(
    buffer: WebGpuBuffer<TypedArray>;
}