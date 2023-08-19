import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core.data';
import { GpuBuffer } from '../buffer/gpu-buffer';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { FrameBufferTexture } from '../texture/frame-buffer-texture';
import { ImageTexture } from '../texture/image-texture';
import { TextureSampler } from '../texture/texture-sampler';
import { VideoTexture } from '../texture/video-texture';
import { BindDataGroupLayout } from './bind-data-group-layout';

export class BindDataGroup extends GpuObject {
    private readonly mBindData: Dictionary<string, BindData>;
    private readonly mLayout: BindDataGroupLayout;

    /**
     * Layout of bind group.
     */
    public get layout(): BindDataGroupLayout {
        return this.mLayout;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     */
    public constructor(pDevice: GpuDevice, pBindGroupLayout: BindDataGroupLayout) {
        super(pDevice);

        this.mLayout = pBindGroupLayout;
        this.mBindData = new Dictionary<string, BindData>();

        // Register change listener for layout changes.
        pBindGroupLayout.addUpdateListener(() => {
            this.triggerAutoUpdate();
        });
    }

    /**
     * Get data of layout binding.
     * @param pBindName - Bind layout entry name.
     */
    public getData(pBindName: string): BindData {
        const lData = this.mBindData.get(pBindName);
        if (!lData) {
            throw new Exception(`Cant get bind data "${pBindName}". No data set.`, this);
        }

        return lData;
    }

    /**
     * Set data to layout binding.
     * @param pBindName - Bind layout entry name.
     * @param pData - Bind data.
     */
    public setData(pBindName: string, pData: BindData): void {
        // TODO: Validate data type with value type.

        // Set bind type to Teture for TS type check shutup.
        this.mBindData.set(pBindName, pData);
    }
}

type BindData = GpuBuffer<TypedArray> | TextureSampler | ImageTexture | FrameBufferTexture | VideoTexture;