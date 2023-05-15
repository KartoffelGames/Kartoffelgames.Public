import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core.data';
import { BindType } from './bind-type.enum';
import { Gpu } from '../gpu';
import { GpuNativeObject } from '../gpu-native-object';
import { BaseBuffer } from '../buffer/base-buffer';
import { ExternalTexture } from '../texture_resource/external-texture';
import { TextureSampler } from '../texture_resource/texture-sampler';
import { TextureView } from '../texture_resource/texture/texture-view';
import { BindGroupLayout } from './bind-group-layout';

export class BindGroup extends GpuNativeObject<GPUBindGroup>{
    private readonly mBindData: Dictionary<string, Bind>;
    private readonly mLayout: BindGroupLayout;
    private readonly mNativeData: WeakMap<object, string>;

    /**
     * Layout of bind group.
     */
    public get layout(): BindGroupLayout {
        return this.mLayout;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pLayout - Bind group layout.
     */
    public constructor(pGpu: Gpu, pLayout: BindGroupLayout) {
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
    public setData(pBindName: string, pData: BindData, pForcedType?: BindType): void {
        const lLayout = this.mLayout.getBind(pBindName);
        const lDataBindType: BindType = pForcedType ?? this.bindTypeOfData(pData);

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
        this.mBindData.set(pBindName, { type: <BindType.Texture>lDataBindType, name: pBindName, data: <TextureView>pData });
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
                case BindType.Buffer: {
                    lGroupEntry.resource = { buffer: lBindData.data.native() };
                    break;
                }
                case BindType.ExternalTexture: {
                    lGroupEntry.resource = lBindData.data.native();
                    break;
                }
                case BindType.Sampler: {
                    lGroupEntry.resource = lBindData.data.native();
                    break;
                }
                case BindType.StorageTexture: {
                    lGroupEntry.resource = lBindData.data.native();
                    break;
                }
                case BindType.Texture: {
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
    private bindTypeOfData(pData: BindData): BindType {
        if (pData instanceof TextureView) {
            return BindType.Texture;
        } else if (pData instanceof BaseBuffer) {
            return BindType.Buffer;
        } else if (pData instanceof ExternalTexture) {
            return BindType.ExternalTexture;
        } if (pData instanceof TextureSampler) {
            return BindType.Sampler;
        }

        throw new Exception(`Bind data "${(<any>pData).name}" not supported`, this);
    }
}

type BindData = TextureView | BaseBuffer<TypedArray> | ExternalTexture | TextureSampler;

type Bind = {
    type: BindType.Buffer,
    name: string,
    data: BaseBuffer<TypedArray>;
} | {
    type: BindType.ExternalTexture,
    name: string,
    data: ExternalTexture;
} | {
    type: BindType.Sampler,
    name: string,
    data: TextureSampler;
} | {
    type: BindType.StorageTexture,
    name: string,
    data: TextureView;
} | {
    type: BindType.Texture,
    name: string,
    data: TextureView;
};