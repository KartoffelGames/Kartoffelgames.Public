import { Exception, TypedArray } from '@kartoffelgames/core';
import { GpuBuffer } from '../buffer/gpu-buffer';
import { GpuObjectSetupReferences } from '../gpu/object/gpu-object';
import { GpuObjectChildSetup } from '../gpu/object/gpu-object-child-setup';
import { BaseMemoryLayout } from '../memory_layout/base-memory-layout';
import { CanvasTexture } from '../texture/canvas-texture';
import { FrameBufferTexture } from '../texture/frame-buffer-texture';
import { ImageTexture } from '../texture/image-texture';
import { TextureSampler } from '../texture/texture-sampler';
import { VideoTexture } from '../texture/video-texture';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { BindLayout } from './bind-group-layout';
import { MemoryCopyType } from '../../constant/memory-copy-type.enum';

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

    public createBuffer(pData?: TypedArray): void {
        // At this point
        if (!(this.mBindLayout.layout instanceof BaseBufferMemoryLayout)) {
            throw new Exception(`Bind data layout is not suitable for buffers.`, this);
        }

        const lBuffer: GpuBuffer<TypedArray> = new GpuBuffer(this.device, this.mBindLayout.layout, MemoryCopyType.None);

        // Add initial data.
        if (pData) {
            lBuffer.initialData(() => {
                return pData;
            });
        }

        // Send created data.
        this.sendData(lBuffer);
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
}

type BindData = GpuBuffer<TypedArray> | TextureSampler | ImageTexture | FrameBufferTexture | VideoTexture | CanvasTexture;
type BindGroupDataCallback = (pData: BindData) => void;