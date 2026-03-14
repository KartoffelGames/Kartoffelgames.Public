import { Exception } from '@kartoffelgames/core';
import { GpuBuffer } from '../../buffer/gpu-buffer.ts';
import { GpuLimit } from '../../constant/gpu-limit.enum.ts';
import { StorageBindingType } from '../../constant/storage-binding-type.enum.ts';
import type { TextureDimension } from '../../constant/texture-dimension.ts';
import { GpuObjectChildSetup } from '../../gpu_object/gpu-object-child-setup.ts';
import type { GpuObjectSetupReferences } from '../../gpu_object/gpu-object.ts';
import type { GpuResourceObject } from '../../gpu_object/gpu-resource-object.ts';
import type { GpuTextureView } from '../../texture/gpu-texture-view.ts';
import { GpuTexture } from '../../texture/gpu-texture.ts';
import { TextureSampler } from '../../texture/texture-sampler.ts';
import type { BindGroupBindLayout, BindLayoutBufferBinding, BindLayoutTextureBinding } from '../bind_group_layout/bind-group-layout.ts';

/**
 * Setup child object for setup bind group gpu data resources.
 */
export class BindGroupDataSetup extends GpuObjectChildSetup<null, BindGroupDataCallback> {
    private readonly mBindLayout: Readonly<BindGroupBindLayout>;
    private readonly mCurrentData: GpuResourceObject | null;

    /**
     * Indicates whether this bind group data setup currently has data set.
     * When false, the bind group will not be able to be used for rendering until data is set.
     */
    public get hasData(): boolean {
        return this.mCurrentData !== null;
    }

    /**
     * Constructor.
     *
     * @param pLayout - Target layout.
     * @param pCurrentData - Current set data.
     * @param pSetupReference - Setup data references.
     * @param pDataCallback - Bind data callback.
     */
    public constructor(pLayout: Readonly<BindGroupBindLayout>, pCurrentData: GpuResourceObject | null, pSetupReference: GpuObjectSetupReferences<null>, pDataCallback: BindGroupDataCallback) {
        super(pSetupReference, pDataCallback);

        // Set initial data.
        this.mCurrentData = pCurrentData;
        this.mBindLayout = pLayout;
    }

    /**
     * Create a new buffer.
     *
     * @param pVariableSizeCount - Repeat count of variable parts of a layout or offset count when binding has dynamic offsets.
     *
     * @returns created buffer.
     */
    public createBuffer(pVariableSizeCount?: number): GpuBuffer {
        const lBuffer: GpuBuffer = this.createEmptyBuffer(pVariableSizeCount ?? null);

        // Send created data.
        this.sendData(lBuffer);

        return lBuffer;
    }

    /**
     * Create and init buffer with raw array buffer data.
     * Data needs to have the right alignment and size.
     *
     * @param pData - Raw data.
     *
     * @returns - Created buffer.
     */
    public createBufferWithRawData(pData: ArrayBufferLike): GpuBuffer {
        // Layout must be a buffer resource.
        if (this.mBindLayout.resource.type !== 'buffer') {
            throw new Exception(`Bind data layout is not suitable for buffers.`, this);
        }

        const lBindLayoutBuffer: BindLayoutBufferBinding = this.mBindLayout.resource;

        // Calculate variable item count from initial buffer data.
        const lVariableItemCount: number = (() => {
            // No need to calculate was it is allways zero.
            if (lBindLayoutBuffer.variableSize === 0) {
                return 0;
            }

            // Get initial buffer data byte length.
            const lBufferByteLength: number = pData.byteLength;

            // calculate item count and check if initial data meets requirments.
            const lItemCount: number = (lBufferByteLength - lBindLayoutBuffer.fixedSize) / lBindLayoutBuffer.variableSize;
            if (lItemCount % 1 > 0) {
                throw new Exception(`Raw bind group data buffer data "${this.mBindLayout.name}" does not meet alignment.`, this);
            }

            return lItemCount;
        })();

        // Calculate buffer size with correct alignment.
        let lByteSize: number = (lVariableItemCount ?? 0) * lBindLayoutBuffer.variableSize + lBindLayoutBuffer.fixedSize;
        if (this.mBindLayout.hasDynamicOffset) {
            // Read correct alignment limitations for storage type.
            const lOffsetAlignment: number = (() => {
                if (this.mBindLayout.storageType === StorageBindingType.None) {
                    return this.device.capabilities.getLimit(GpuLimit.MinUniformBufferOffsetAlignment);
                } else {
                    return this.device.capabilities.getLimit(GpuLimit.MinStorageBufferOffsetAlignment);
                }
            })();

            // Apply offset alignment to byte size.
            lByteSize = Math.ceil(lByteSize / lOffsetAlignment) * lOffsetAlignment;
            lByteSize *= Math.floor(pData.byteLength / lByteSize);
        }

        // Validate size.
        if (pData.byteLength !== lByteSize) {
            throw new Exception(`Raw bind group data buffer data "${this.mBindLayout.name}" does not meet data size (Should:${lByteSize} => Has:${pData.byteLength}) requirements.`, this);
        }

        // Create buffer.
        const lBuffer: GpuBuffer = new GpuBuffer(this.device, lByteSize).initialData(pData);

        // Send created data.
        this.sendData(lBuffer);

        return lBuffer;
    }

    /**
     * Create new sampler.
     *
     * @returns created texture sampler.
     */
    public createSampler(): TextureSampler {
        // Layout must be a sampler resource.
        if (this.mBindLayout.resource.type !== 'sampler') {
            throw new Exception(`Bind data layout is not setup for samplers.`, this);
        }

        // Create texture sampler.
        const lSampler: TextureSampler = new TextureSampler(this.device, this.mBindLayout.resource.samplerType);

        // Send created data.
        this.sendData(lSampler);

        return lSampler;
    }

    /**
     * Create texture view.
     * Generates a new texture.
     *
      * @returns created texture view.
     */
    public createTexture(): GpuTextureView {
        // Layout must be a texture resource.
        if (this.mBindLayout.resource.type !== 'texture') {
            throw new Exception(`Bind data layout is not setup for textures.`, this);
        }

        const lBindLayoutTexture: BindLayoutTextureBinding = this.mBindLayout.resource;

        // Generate texture dimension from view dimensions.
        const lTextureDimension: TextureDimension = (() => {
            switch (lBindLayoutTexture.dimension) {
                case '1d': {
                    return '1d';
                }
                case '2d-array':
                case 'cube':
                case 'cube-array':
                case '2d': {
                    return '2d';
                }
                case '3d': {
                    return '3d';
                }
            }
        })();

        // Create texture.
        const lTexture: GpuTexture = new GpuTexture(this.device, {
            dimension: lTextureDimension,
            format: lBindLayoutTexture.format,
            multisampled: lBindLayoutTexture.multisampled
        });

        // Create view from texture.
        const lTextureView: GpuTextureView = lTexture.useAs(lBindLayoutTexture.dimension);

        // Send created texture to parent bind group.
        this.sendData(lTextureView);

        return lTextureView;
    }

    /**
     * Get current binded data.
     *
     * @returns current set bind data.
     *
     * @throws {@link Exception}
     * When no data was set.
     */
    public getRaw<T extends GpuResourceObject<any, any, any, any>>(): T {
        // Validate existence.
        if (!this.mCurrentData) {
            throw new Exception('No binding data was set.', this);
        }

        // Return current set data.
        return this.mCurrentData as T;
    }

    /**
     * Set already created bind data.
     *
     * @param pData - Created data.
     *
     * @returns set data.
     */
    public set<T extends GpuBuffer | TextureSampler | GpuTextureView>(pData: T): T {
        this.sendData(pData);

        // Return same data.
        return pData;
    }

    /**
     * Create an empty buffer.
     *
     * @param pVariableSizeCount - Variable item count.
     *
     * @returns - Created buffer.
     */
    private createEmptyBuffer(pVariableSizeCount: number | null = null): GpuBuffer {
        // Layout must be a buffer resource.
        if (this.mBindLayout.resource.type !== 'buffer') {
            throw new Exception(`Bind data layout is not setup for buffers.`, this);
        }

        const lBindLayoutBuffer: BindLayoutBufferBinding = this.mBindLayout.resource;

        // Calculate variable item count from initial buffer data.
        const lVariableItemCount: number = (() => {
            // When layout has variable size but no variable count was set, throw an error.
            if (lBindLayoutBuffer.variableSize > 0 && pVariableSizeCount === null) {
                throw new Exception(`For bind group data buffer "${this.mBindLayout.name}" a variable item count must be set.`, this);
            }

            // Use set variable count or zero if layout does not have variable size.
            return pVariableSizeCount ?? 0;
        })();

        // Calculate buffer size with correct alignment.
        let lByteSize: number = (lVariableItemCount ?? 0) * lBindLayoutBuffer.variableSize + lBindLayoutBuffer.fixedSize;
        if (this.mBindLayout.hasDynamicOffset) {
            // Read correct alignment limitations for storage type.
            const lOffsetAlignment: number = (() => {
                if (this.mBindLayout.storageType === StorageBindingType.None) {
                    return this.device.capabilities.getLimit(GpuLimit.MinUniformBufferOffsetAlignment);
                } else {
                    return this.device.capabilities.getLimit(GpuLimit.MinStorageBufferOffsetAlignment);
                }
            })();

            // Apply offset alignment to byte size.
            lByteSize = Math.ceil(lByteSize / lOffsetAlignment) * lOffsetAlignment;
            lByteSize *= pVariableSizeCount ?? 1;
        }

        // Create buffer.
        const lBuffer: GpuBuffer = new GpuBuffer(this.device, lByteSize);

        return lBuffer;
    }
}

type BindGroupDataCallback = (pData: GpuBuffer | TextureSampler | GpuTextureView) => void;