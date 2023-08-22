import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { MemoryCopyType } from '../../../constant/memory-copy-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureUsage } from '../../../constant/texture-usage.enum';
import { BaseGeneratorFactory } from '../../generator/base-generator-factory';
import { TextureMemoryLayout } from '../../memory_layout/texture-memory-layout';
import { WebGpuBindDataGroupLayoutGenerator } from './native-generator/web-gpu-bind-data-group-layout-generator';

export class WebGpuGeneratorFactory extends BaseGeneratorFactory<NativeWebGpuObjects> {
    private static readonly mAdapters: Dictionary<GPUPowerPreference, GPUAdapter> = new Dictionary<GPUPowerPreference, GPUAdapter>();
    private static readonly mDevices: Dictionary<GPUAdapter, GPUDevice> = new Dictionary<GPUAdapter, GPUDevice>();

    private mGpuAdapter: GPUAdapter | null;
    private mGpuDevice: GPUDevice | null;
    private readonly mPerformance: GPUPowerPreference;

    /**
     * GPU device.
     */
    public get gpu(): GPUDevice {
        if (this.mGpuDevice === null) {
            throw new Exception('Web GPU device not initialized.', this);
        }

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
     */
    public constructor(pMode: GPUPowerPreference) {
        super();

        this.mPerformance = pMode;
        this.mGpuAdapter = null;
        this.mGpuDevice = null;

        this.registerGenerator('bindDataGroupLayout', new WebGpuBindDataGroupLayoutGenerator(this));
    }

    /**
     * GPU Dimension from layout texture dimension.
     */
    public dimensionFromLayout(pLayout: TextureMemoryLayout): GPUTextureDimension {
        // "Calculate" texture dimension from texture size.
        switch (pLayout.dimension) {
            case TextureDimension.OneDimension: {
                return '1d';
            }

            case TextureDimension.TwoDimension: {
                return '2d';
            }

            case TextureDimension.Cube:
            case TextureDimension.CubeArray:
            case TextureDimension.ThreeDimension:
            case TextureDimension.TwoDimensionArray: {
                return '3d';
            }
        }
    }

    /**
     * Format from layout.
     */
    public formatFromLayout(pLayout: TextureMemoryLayout): GPUTextureFormat {
        // Convert base to web gpu texture format.
        switch (pLayout.format) {
            case TextureFormat.BlueRedGreenAlpha: {
                return 'bgra8unorm';
            }
            case TextureFormat.Depth: {
                return 'depth24plus';
            }
            case TextureFormat.DepthStencil: {
                return 'depth24plus-stencil8';
            }
            case TextureFormat.Red: {
                return 'r8unorm';
            }
            case TextureFormat.RedGreen: {
                return 'rg8unorm';
            }
            case TextureFormat.RedGreenBlueAlpha: {
                return 'rgba8unorm';
            }
            case TextureFormat.RedGreenBlueAlphaInteger: {
                return 'rgba8uint';
            }
            case TextureFormat.RedGreenInteger: {
                return 'rg8uint';
            }
            case TextureFormat.RedInteger: {
                return 'r8uint';
            }
            case TextureFormat.Stencil: {
                return 'stencil8';
            }
        }
    }

    /**
     * Init devices.
     */
    public override async init(): Promise<this> {
        // Try to load cached adapter. When not cached, request new one.
        const lAdapter: GPUAdapter | null = WebGpuGeneratorFactory.mAdapters.get(this.mPerformance) ?? await window.navigator.gpu.requestAdapter({ powerPreference: this.mPerformance });
        if (!lAdapter) {
            throw new Exception('Error requesting GPU adapter', WebGpuGeneratorFactory);
        }

        WebGpuGeneratorFactory.mAdapters.set(this.mPerformance, lAdapter);

        // Try to load cached device. When not cached, request new one.
        const lDevice: GPUDevice | null = WebGpuGeneratorFactory.mDevices.get(lAdapter) ?? await lAdapter.requestDevice();
        if (!lDevice) {
            throw new Exception('Error requesting GPU device', WebGpuGeneratorFactory);
        }

        WebGpuGeneratorFactory.mDevices.set(lAdapter, lDevice);

        this.mGpuAdapter = lAdapter;
        this.mGpuDevice = lDevice;

        return this;
    }

    /**
     * Get sample type from texture layout.
     */
    public sampleTypeFromLayout(pLayout: TextureMemoryLayout): GPUTextureSampleType {
        // Convert texture format to sampler values.
        switch (pLayout.format) {
            case TextureFormat.Depth:
            case TextureFormat.DepthStencil: {
                return 'depth';
            }

            case TextureFormat.Stencil:
            case TextureFormat.BlueRedGreenAlpha:
            case TextureFormat.Red:
            case TextureFormat.RedGreen:
            case TextureFormat.RedGreenBlueAlpha: {
                return 'float';
            }

            case TextureFormat.RedGreenBlueAlphaInteger:
            case TextureFormat.RedGreenInteger:
            case TextureFormat.RedInteger: {
                return 'uint';
            }
        }
    }

    /**
     * Usage from layout.
     */
    public usageFromLayout(pLayout: TextureMemoryLayout): number {
        // Parse base to web gpu usage.
        let lUsage: number = 0;
        if ((pLayout.memoryType & MemoryCopyType.CopyDestination) !== 0) {
            lUsage |= GPUTextureUsage.COPY_DST;
        }
        if ((pLayout.memoryType & MemoryCopyType.CopySource) !== 0) {
            lUsage |= GPUTextureUsage.COPY_SRC;
        }
        if ((pLayout.usage & TextureUsage.RenderAttachment) !== 0) {
            lUsage |= GPUTextureUsage.RENDER_ATTACHMENT;
        }
        if ((pLayout.usage & TextureUsage.StorageBinding) !== 0) {
            lUsage |= GPUTextureUsage.STORAGE_BINDING;
        }
        if ((pLayout.usage & TextureUsage.TextureBinding) !== 0) {
            lUsage |= GPUTextureUsage.TEXTURE_BINDING;
        }

        return lUsage;
    }
}

export type NativeWebGpuObjects = {
    // Textures.
    textureSampler: object;
    imageTexture: object;
    frameBufferTexture: object;
    videoTexture: object;
    canvasTexture: object;

    // Things with generics. :(
    buffer: GPUBuffer;

    // Pipeline layouting.
    bindDataGroupLayout: GPUBindGroupLayout;
    bindDataGroup: object;
    pipelineDataLayout: object;
    renderParameterLayout: object;

    // Shader.
    renderShader: object;
};