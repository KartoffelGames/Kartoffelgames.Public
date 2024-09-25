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

export class BindGroupDataSetup extends GpuObjectChildSetup<null, BindGroupDataCallback> {
    private readonly mCurrentData: BindData | null;
    private readonly mLayout: BaseMemoryLayout;

    /**
     * Constructor.
     * 
     * @param pLayout - Target layout.
     * @param pCurrentData - Current set data.
     * @param pSetupReference - Setup data references.
     * @param pDataCallback - Bind data callback.
     */
    public constructor(pLayout: BaseMemoryLayout, pCurrentData: BindData | null, pSetupReference: GpuObjectSetupReferences<null>, pDataCallback: BindGroupDataCallback) {
        super(pSetupReference, pDataCallback);

        // Set initial data.
        this.mCurrentData = pCurrentData;
        this.mLayout = pLayout;
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