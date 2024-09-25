import { Exception, TypedArray } from '@kartoffelgames/core';
import { MemoryCopyType } from '../../constant/memory-copy-type.enum';
import { GpuBuffer } from '../buffer/gpu-buffer';
import { GpuObjectSetupReferences } from '../gpu/object/gpu-object';
import { GpuObjectChildSetup } from '../gpu/object/gpu-object-child-setup';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { PrimitiveBufferFormat } from '../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { SamplerMemoryLayout } from '../memory_layout/texture/sampler-memory-layout';
import { TextureMemoryLayout } from '../memory_layout/texture/texture-memory-layout';
import { CanvasTexture } from '../texture/canvas-texture';
import { FrameBufferTexture } from '../texture/frame-buffer-texture';
import { ImageTexture } from '../texture/image-texture';
import { TextureSampler } from '../texture/texture-sampler';
import { VideoTexture } from '../texture/video-texture';
import { BindLayout } from './bind-group-layout';

export class BindGroupDataSetup extends GpuObjectChildSetup<null, BindGroupDataCallback> {
    private readonly mBindLayout: Readonly<BindLayout>;
    private readonly mCurrentData: BindData | null;

    /**
     * Constructor.
     * 
     * @param pLayout - Target layout.
     * @param pCurrentData - Current set data.
     * @param pSetupReference - Setup data references.
     * @param pDataCallback - Bind data callback.
     */
    public constructor(pLayout: Readonly<BindLayout>, pCurrentData: BindData | null, pSetupReference: GpuObjectSetupReferences<null>, pDataCallback: BindGroupDataCallback) {
        super(pSetupReference, pDataCallback);

        // Set initial data.
        this.mCurrentData = pCurrentData;
        this.mBindLayout = pLayout;
    }

    /**
     * Create na new buffer.
     * 
     * @param pDataOrType - Type or initial data.
     */
    public createBuffer(pDataOrType: TypedArray | PrimitiveBufferFormat): void {
        // Layout must be a buffer memory layout.
        if (!(this.mBindLayout.layout instanceof BaseBufferMemoryLayout)) {
            throw new Exception(`Bind data layout is not suitable for buffers.`, this);
        }

        // Read buffer type from parameter.
        const lBufferFormat: PrimitiveBufferFormat = (() => {
            // Parameter is type.
            if (typeof pDataOrType === 'string') {
                return pDataOrType;
            }

            // Get buffer type from typed array.
            switch (true) {
                case pDataOrType instanceof Float32Array: {
                    return PrimitiveBufferFormat.Float32;
                }
                case pDataOrType instanceof Uint32Array: {
                    return PrimitiveBufferFormat.Uint32;
                }
                case pDataOrType instanceof Int32Array: {
                    return PrimitiveBufferFormat.Sint32;
                }
                default: {
                    throw new Exception(`Buffer data is not suitable for binding buffer creation`, this);
                }
            }
        })();

        // Create buffer.
        const lBuffer: GpuBuffer<TypedArray> = new GpuBuffer(this.device, this.mBindLayout.layout, MemoryCopyType.None, lBufferFormat); // TODO: Must set variable buffer sizes.

        // Add initial data.
        if (typeof pDataOrType === 'object') {
            lBuffer.initialData(() => {
                return pDataOrType;
            });
        }

        // Send created data.
        this.sendData(lBuffer);
    }

    /**
     * Create new image texture with loaded images.
     * 
     * @param pSourceList - Image source list.
     * 
     * @returns promise that resolves when all images are loaded. 
     */
    public async createImage(...pSourceList: Array<string>): Promise<void> {
        // Layout must be a texture memory layout.
        if (!(this.mBindLayout.layout instanceof TextureMemoryLayout)) {
            throw new Exception(`Bind data layout is not suitable for image textures.`, this);
        }

        // Create image texture.
        const lTexture: ImageTexture = new ImageTexture(this.device, this.mBindLayout.layout);

        // Load images async.
        const lImageLoading: Promise<void> = lTexture.load(...pSourceList);

        // Send created texture to parent bind group.
        this.sendData(lTexture);

        return lImageLoading;
    }

    /**
     * Create new sampler.
     */
    public createSampler(): void {
        // Layout must be a sampler memory layout.
        if (!(this.mBindLayout.layout instanceof SamplerMemoryLayout)) {
            throw new Exception(`Bind data layout is not suitable for samplers.`, this);
        }

        // Send created data.
        this.sendData(new TextureSampler(this.device, this.mBindLayout.layout));
    }

    /**
     * Create new video texture.
     * 
     * @param pSource - Video source.
     */
    public createVideo(pSource: string): void {
        // Layout must be a sampler memory layout.
        if (!(this.mBindLayout.layout instanceof TextureMemoryLayout)) {
            throw new Exception(`Bind data layout is not suitable for samplers.`, this);
        }

        // Create video texture with initial source.
        const lVideoTexture: VideoTexture = new VideoTexture(this.device, this.mBindLayout.layout);
        lVideoTexture.source = pSource;

        // Send created data.
        this.sendData(lVideoTexture);
    }

    /**
     * Get current binded data.
     * 
     * @returns current set bind data.
     * 
     * @throws {@link Exception}
     * When no data was set.
     */
    public get(): BindData {
        // Validate existance.
        if (!this.mCurrentData) {
            throw new Exception('No binding data was set.', this);
        }

        // Return current set data.
        return this.mCurrentData;
    }

    /**
     * Set already created bind data.
     * 
     * @param pData - Created data.
     */
    public set(pData: BindData): void {
        this.sendData(pData);
    }
}

type BindData = GpuBuffer<TypedArray> | TextureSampler | ImageTexture | FrameBufferTexture | VideoTexture | CanvasTexture;
type BindGroupDataCallback = (pData: BindData) => void;