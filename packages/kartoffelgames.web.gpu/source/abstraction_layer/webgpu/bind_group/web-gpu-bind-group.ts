import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core.data';
import { WebGpuBindType } from './web-gpu-bind-type.enum';
import { WebGpuDevice } from '../web-gpu-device';
import { GpuNativeObject } from '../gpu-native-object';
import { WebGpuBuffer } from '../buffer/web-gpu-buffer';
import { ExternalTexture } from '../texture_resource/external-texture';
import { WebGpuTextureSampler } from '../texture_resource/web-gpu-texture-sampler';
import { TextureView } from '../texture_resource/texture/texture-view';
import { WebGpuBindGroupLayout } from './web-gpu-bind-group-layout';

export class WebGpuBindGroup extends GpuNativeObject<GPUBindGroup>{
    private readonly mBindData: Dictionary<string, Bind>;
    private readonly mLayout: WebGpuBindGroupLayout;
    private readonly mNativeData: WeakMap<object, string>;

    /**
     * Layout of bind group.
     */
    public get layout(): WebGpuBindGroupLayout {
        return this.mLayout;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pLayout - Bind group layout.
     */
    public constructor(pGpu: WebGpuDevice, pLayout: WebGpuBindGroupLayout) {
        super(pGpu, 'BIND_GROUP');

        this.mLayout = pLayout;
        this.mBindData = new Dictionary<string, Bind>();
        this.mNativeData = new WeakMap<object, string>();

        // Register layout as internal.
        this.registerInternalNative(pLayout);
    }

    /**
     * Set data to layout binding.
     * @param pBindName - Bind layout entry name.
     * @param pData - Bind data.
     * @param pForcedType - Forced type. Can be used to differ for Texture and StorageTexture.
     */
    public setData(pBindName: string, pData: BindData, pForcedType?: WebGpuBindType): void {
        const lLayout = this.mLayout.getBind(pBindName);
        const lDataBindType: WebGpuBindType = pForcedType ?? this.bindTypeOfData(pData);

        // Validate bind type with data type.
        if (lLayout.bindType !== lDataBindType) {
            throw new Exception(`Bind data "${pBindName}" has wrong type`, this);
        }

        // Unregister possible old data and register new.
        if (this.mBindData.has(pBindName)) {
            this.unregisterInternalNative(this.mBindData.get(pBindName)!.data);
        }
        this.registerInternalNative(pData);

        // Set bind type to Teture for TS type check shutup.
        this.mBindData.set(pBindName, { type: <WebGpuBindType.Texture>lDataBindType, name: pBindName, data: <TextureView>pData });
    }

    /**
     * Generate native bind group.
     */
    protected generate(): GPUBindGroup {
        const lEntryList: Array<GPUBindGroupEntry> = new Array<GPUBindGroupEntry>();

        for (const lBindLayout of this.mLayout.binds) {
            const lBindData: Bind | undefined = this.mBindData.get(lBindLayout.name);

            // Check for 
            if (!lBindData) {
                throw new Exception(`Bind data "${lBindLayout.name}" not set.`, this);
            }

            // Check for type change.
            if (lBindData.type !== lBindLayout.type) {
                throw new Exception(`Bind data "${lBindLayout.name}" has wrong type. The Layout might has been changed.`, this);
            }

            // Set resource to group entry for each 
            const lGroupEntry: GPUBindGroupEntry = { binding: lBindLayout.index, resource: <any>null };
            switch (lBindData.type) {
                case WebGpuBindType.Buffer: {
                    lGroupEntry.resource = { buffer: lBindData.data.native() };
                    break;
                }
                case WebGpuBindType.ExternalTexture: {
                    lGroupEntry.resource = lBindData.data.native();
                    break;
                }
                case WebGpuBindType.Sampler: {
                    lGroupEntry.resource = lBindData.data.native();
                    break;
                }
                case WebGpuBindType.StorageTexture: {
                    lGroupEntry.resource = lBindData.data.native();
                    break;
                }
                case WebGpuBindType.Texture: {
                    lGroupEntry.resource = lBindData.data.native();
                    break;
                }
                default: {
                    throw new Exception(`Type "${(<Bind>lBindData).type}" not supported on bind group`, this);
                }
            }

            // Save generated native for validation state.
            this.mNativeData.set(lBindData.data.native(), lBindLayout.name);

            lEntryList.push(lGroupEntry);
        }

        return this.gpu.device.createBindGroup({
            label: this.label,
            layout: this.mLayout.native(),
            entries: lEntryList
        });
    }

    /**
     * Get type of bind data.
     * @param pData - Data object.
     */
    private bindTypeOfData(pData: BindData): WebGpuBindType {
        if (pData instanceof TextureView) {
            return WebGpuBindType.Texture;
        } else if (pData instanceof WebGpuBuffer) {
            return WebGpuBindType.Buffer;
        } else if (pData instanceof ExternalTexture) {
            return WebGpuBindType.ExternalTexture;
        } if (pData instanceof WebGpuTextureSampler) {
            return WebGpuBindType.Sampler;
        }

        throw new Exception(`Bind data "${(<any>pData).name}" not supported`, this);
    }
}

type BindData = TextureView | WebGpuBuffer<TypedArray> | ExternalTexture | WebGpuTextureSampler;

type Bind = {
    type: WebGpuBindType.Buffer,
    name: string,
    data: WebGpuBuffer<TypedArray>;
} | {
    type: WebGpuBindType.ExternalTexture,
    name: string,
    data: ExternalTexture;
} | {
    type: WebGpuBindType.Sampler,
    name: string,
    data: WebGpuTextureSampler;
} | {
    type: WebGpuBindType.StorageTexture,
    name: string,
    data: TextureView;
} | {
    type: WebGpuBindType.Texture,
    name: string,
    data: TextureView;
};