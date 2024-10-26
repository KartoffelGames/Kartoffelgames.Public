import { Exception, TypedArray } from '@kartoffelgames/core';
import { GpuBuffer } from '../buffer/gpu-buffer';
import { GpuBufferView, GpuBufferViewFormat } from '../buffer/gpu-buffer-view';
import { BufferItemFormat } from '../constant/buffer-item-format.enum';
import { TextureDimension } from '../constant/texture-dimension.enum';
import { TextureViewDimension } from '../constant/texture-view-dimension.enum';
import { GpuObjectSetupReferences } from '../gpu/object/gpu-object';
import { GpuObjectChildSetup } from '../gpu/object/gpu-object-child-setup';
import { GpuResourceObject } from '../gpu/object/gpu-resource-object';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { SamplerMemoryLayout } from '../memory_layout/texture/sampler-memory-layout';
import { TextureViewMemoryLayout } from '../memory_layout/texture/texture-view-memory-layout';
import { GpuTexture } from '../texture/gpu-texture';
import { GpuTextureView } from '../texture/gpu-texture-view';
import { TextureSampler } from '../texture/texture-sampler';
import { BindLayout } from './bind-group-layout';

export class BindGroupDataSetup extends GpuObjectChildSetup<null, BindGroupDataCallback> {
    private readonly mBindLayout: Readonly<BindLayout>;
    private readonly mCurrentData: GpuResourceObject | null;

    /**
     * Constructor.
     * 
     * @param pLayout - Target layout.
     * @param pCurrentData - Current set data.
     * @param pSetupReference - Setup data references.
     * @param pDataCallback - Bind data callback.
     */
    public constructor(pLayout: Readonly<BindLayout>, pCurrentData: GpuResourceObject | null, pSetupReference: GpuObjectSetupReferences<null>, pDataCallback: BindGroupDataCallback) {
        super(pSetupReference, pDataCallback);

        // Set initial data.
        this.mCurrentData = pCurrentData;
        this.mBindLayout = pLayout;
    }

    /**
     * Create a view with the attached buffer and binding layout. 
     * 
     * @param pValueType - Number item type of view.
     * 
     * @returns view of buffer from bind group layout.
     */
    public asBufferView<T extends TypedArray>(pValueType: GpuBufferViewFormat<T>): GpuBufferView<T> {
        const lData: GpuResourceObject = this.getRaw();
        if (!(lData instanceof GpuBuffer)) {
            throw new Exception('Bind data can not be converted into a buffer view.', this);
        }

        // Read layout buffer.
        const lBufferLayout: BaseBufferMemoryLayout = this.mBindLayout.layout as BaseBufferMemoryLayout;

        // Create view.
        return new GpuBufferView<T>(lData, lBufferLayout, pValueType);
    }

    /**
     * Create na new buffer.
     * 
     * @param pDataOrType - Type or initial data.
     * @param pVariableSizeCount - Variable item count.
     * 
     * @returns created buffer.
     */
    public createBuffer(pData: ArrayBufferLike): GpuBuffer;
    public createBuffer(pType: BufferItemFormat, pVariableSizeCount?: number): GpuBuffer;
    public createBuffer(pDataOrType: ArrayBufferLike  | BufferItemFormat, pVariableSizeCount: number | null = null): GpuBuffer {
        // Layout must be a buffer memory layout.
        if (!(this.mBindLayout.layout instanceof BaseBufferMemoryLayout)) {
            throw new Exception(`Bind data layout is not suitable for buffers.`, this);
        }

        // TODO: Add dynamic offsets parameter to extend size by each item. Maybe limit dynamic offsets by static layouts or allow a variablesize parameter.

        // Calculate variable item count from initial buffer data.  
        const lVariableItemCount: number = pVariableSizeCount ?? (() => {
            // No need to calculate was it is allways zero.
            if (this.mBindLayout.layout.variableSize === 0) {
                return 0;
            }

            // A variable size count can only be calculated for data.
            if (typeof pDataOrType !== 'object') {
                throw new Exception(`For bind group data buffer "${this.mBindLayout.name}" a variable item count must be set.`, this);
            }

            // Get initial buffer data byte length.
            const lBufferByteLength: number = pDataOrType.byteLength;

            // calculate item count and check if initial data meets requirments.
            const lItemCount: number = (lBufferByteLength - this.mBindLayout.layout.fixedSize) / this.mBindLayout.layout.variableSize;
            if (lItemCount % 1 > 0) {
                throw new Exception('Initial bind group data buffer data "${this.mBindLayout.name}" does not meet alignment or data size requirements.', this);
            }

            return lItemCount;
        })();

        // Calculate buffer size.
        const lByteSize: number = (lVariableItemCount ?? 0) * this.mBindLayout.layout.variableSize + this.mBindLayout.layout.fixedSize;

        // Create buffer.
        const lBuffer: GpuBuffer = new GpuBuffer(this.device, lByteSize);

        // Add initial data.
        if (typeof pDataOrType === 'object') {
            lBuffer.initialData(() => {
                return pDataOrType;
            });
        }

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
        // Layout must be a sampler memory layout.
        if (!(this.mBindLayout.layout instanceof SamplerMemoryLayout)) {
            throw new Exception(`Bind data layout is not suitable for samplers.`, this);
        }

        // Create texture sampler.
        const lSampler: TextureSampler = new TextureSampler(this.device, this.mBindLayout.layout);

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
        // Layout must be a texture viw memory layout.
        if (!(this.mBindLayout.layout instanceof TextureViewMemoryLayout)) {
            throw new Exception(`Bind data layout is not suitable for image textures.`, this);
        }

        // Generate texture dimension from view dimensions.
        const lTextureDimension: TextureDimension = (() => {
            switch (this.mBindLayout.layout.dimension) {
                case TextureViewDimension.OneDimension: {
                    return TextureDimension.OneDimension;
                }
                case TextureViewDimension.TwoDimensionArray:
                case TextureViewDimension.Cube:
                case TextureViewDimension.CubeArray:
                case TextureViewDimension.TwoDimension: {
                    return TextureDimension.TwoDimension;
                }
                case TextureViewDimension.ThreeDimension: {
                    return TextureDimension.ThreeDimension;
                }
            }
        })();

        // Create texture.
        const lTexture: GpuTexture = new GpuTexture(this.device, {
            dimension: lTextureDimension,
            format: this.mBindLayout.layout.format,
            multisampled: this.mBindLayout.layout.multisampled
        });

        // Create view from texture.
        const lTextureView: GpuTextureView = lTexture.useAs(this.mBindLayout.layout.dimension);

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
    public set<T extends GpuResourceObject<any, any, any, any>>(pData: T): T {
        this.sendData(pData);

        // Return same data.
        return pData;
    }
}

type BindGroupDataCallback = (pData: GpuResourceObject<any, any, any, any>) => void;