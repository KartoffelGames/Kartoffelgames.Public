import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { MemoryCopyType } from '../../../constant/memory-copy-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureUsage } from '../../../constant/texture-usage.enum';
import { BindDataGroup } from '../../binding/bind-data-group';
import { BindDataGroupLayout } from '../../binding/bind-data-group-layout';
import { PipelineDataLayout } from '../../binding/pipeline-data-layout';
import { GpuBuffer } from '../../buffer/gpu-buffer';
import { BaseGeneratorFactory, GeneratorNativeMap } from '../../generator/base-generator-factory';
import { TextureMemoryLayout } from '../../memory_layout/texture-memory-layout';
import { RenderShader } from '../../shader/render-shader';
import { CanvasTexture } from '../../texture/canvas-texture';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';
import { ImageTexture } from '../../texture/image-texture';
import { TextureSampler } from '../../texture/texture-sampler';
import { VideoTexture } from '../../texture/video-texture';
import { WebGpuBindDataGroupGenerator } from './native-generator/web-gpu-bind-data-group-generator';
import { WebGpuBindDataGroupLayoutGenerator } from './native-generator/web-gpu-bind-data-group-layout-generator';
import { WebGpuCanvasTextureGenerator } from './native-generator/web-gpu-canvas-texture-generator';
import { WebGpuFramebufferTextureGenerator } from './native-generator/web-gpu-frame-buffer-texture-generator';
import { WebGpuGpuBufferGenerator } from './native-generator/web-gpu-gpu-buffer-generator';
import { WebGpuImageTextureGenerator } from './native-generator/web-gpu-image-texture-generator';
import { WebGpuPipelineDataLayoutGenerator } from './native-generator/web-gpu-pipeline-data-layout-generator';
import { WebGpuRenderShaderGenerator } from './native-generator/web-gpu-render-shader-generator';
import { WebGpuTextureSamplerGenerator } from './native-generator/web-gpu-texture-sampler-generator';
import { WebGpuVideoTextureGenerator } from './native-generator/web-gpu-video-texture-generator';

export class WebGpuGeneratorFactory extends BaseGeneratorFactory<NativeWebGpuMap> {
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

        // Data.
        this.registerGenerator<'gpuBuffer'>(GpuBuffer, WebGpuGpuBufferGenerator);

        // Data binding.
        this.registerGenerator<'bindDataGroupLayout'>(BindDataGroupLayout, WebGpuBindDataGroupLayoutGenerator);
        this.registerGenerator<'bindDataGroup'>(BindDataGroup, WebGpuBindDataGroupGenerator);
        this.registerGenerator<'pipelineDataLayout'>(PipelineDataLayout, WebGpuPipelineDataLayoutGenerator);

        // Textures.
        this.registerGenerator<'canvasTexture'>(CanvasTexture, WebGpuCanvasTextureGenerator);
        this.registerGenerator<'frameBufferTexture'>(FrameBufferTexture, WebGpuFramebufferTextureGenerator);
        this.registerGenerator<'videoTexture'>(VideoTexture, WebGpuVideoTextureGenerator);
        this.registerGenerator<'imageTexture'>(ImageTexture, WebGpuImageTextureGenerator);
        this.registerGenerator<'textureSampler'>(TextureSampler, WebGpuTextureSamplerGenerator);

        // Shader.
        this.registerGenerator<'renderShader'>(RenderShader, WebGpuRenderShaderGenerator);
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
    public override async initInternals(): Promise<void> {
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

export interface NativeWebGpuMap extends GeneratorNativeMap {
    factory: WebGpuGeneratorFactory;

    generators: {
        // Textures.
        textureSampler: { generator: WebGpuTextureSamplerGenerator; native: GPUSampler; };
        imageTexture: { generator: WebGpuImageTextureGenerator; native: GPUTextureView; };
        frameBufferTexture: { generator: WebGpuFramebufferTextureGenerator; native: GPUTextureView; };
        videoTexture: { generator: WebGpuVideoTextureGenerator; native: GPUExternalTexture; };
        canvasTexture: { generator: WebGpuCanvasTextureGenerator; native: GPUTextureView; };

        // Things with generics. :(
        gpuBuffer: { generator: WebGpuGpuBufferGenerator; native: GPUBuffer; };

        // Pipeline layouting.
        bindDataGroupLayout: { generator: WebGpuBindDataGroupLayoutGenerator; native: GPUBindGroupLayout; };
        bindDataGroup: { generator: WebGpuBindDataGroupGenerator; native: GPUBindGroup; };
        pipelineDataLayout: { generator: WebGpuPipelineDataLayoutGenerator; native: GPUPipelineLayoutDescriptor; };

        // Shader.
        renderShader: { generator: WebGpuRenderShaderGenerator; native: GPUShaderModule; };
    };
}