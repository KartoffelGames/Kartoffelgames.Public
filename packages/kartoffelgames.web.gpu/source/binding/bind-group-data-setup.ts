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
import { PrimitiveBufferMemoryLayout } from '../memory_layout/buffer/primitive-buffer-memory-layout';
import { ArrayBufferMemoryLayout } from '../memory_layout/buffer/array-buffer-memory-layout';
import { StructBufferMemoryLayout } from '../memory_layout/buffer/struct-buffer-memory-layout';

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
     * @param pData - Buffer data without right alignment.
     * 
     * @returns created buffer.
     */
    public createBuffer(pData: Array<number>): GpuBuffer {
        // Layout must be a buffer memory layout.
        if (!(this.mBindLayout.layout instanceof BaseBufferMemoryLayout)) {
            throw new Exception(`Bind data layout is not suitable for buffers.`, this);
        }

        // Unwrap layout.
        const lUnwrapedLayout: UnwrappedBufferLayout = this.unwrapLayouts(this.mBindLayout.layout);

        // Get variable data repetitions.
        let lVariableRepetitionCount: number = 0;
        if (lUnwrapedLayout.variableItemCount > 0) {
            lVariableRepetitionCount = (pData.length - lUnwrapedLayout.fixedItemCount) / lUnwrapedLayout.variableItemCount;
        }

        // TODO: Add dynamic offsets parameter to extend size by each item. Maybe limit dynamic offsets by static layouts or allow a variablesize parameter.

        // Create buffer with correct length.
        const lBufferData: ArrayBuffer = new ArrayBuffer(this.mBindLayout.layout.fixedSize + (this.mBindLayout.layout.variableSize * lVariableRepetitionCount));
        const lBufferDataView: DataView = new DataView(lBufferData);

        // Write data.
        let lDataIndex: number = 0;
        let lByteOffset: number = 0;
        const lWriteLayout = (pUnwrappedLayout: UnwrappedBufferLayout,) => {
            // Apply layout alignment to offset.
            lByteOffset = Math.ceil(lByteOffset / pUnwrappedLayout.alignment) * pUnwrappedLayout.alignment;

            // buffer layout is a layered format.
            if (Array.isArray(pUnwrappedLayout.format)) {
                // Set repetition count to variable count when layout repetition count is uncapped.
                const lRepetitionCount: number = (pUnwrappedLayout.count !== -1) ? pUnwrappedLayout.count : lVariableRepetitionCount;
                for (let lLayoutRepetionIndex: number = 0; lLayoutRepetionIndex < lRepetitionCount; lLayoutRepetionIndex++) {
                    // Add each inner format.
                    for (const lInnerFormat of pUnwrappedLayout.format) {
                        lWriteLayout(lInnerFormat);
                    }
                }

                return;
            }

            for (let lItemIndex: number = 0; lItemIndex < pUnwrappedLayout.count; lItemIndex++) {
                // Add and iterate data.
                this.setBufferData(lBufferDataView, lByteOffset, pUnwrappedLayout.format.itemFormat, pData[lDataIndex]);
                lDataIndex++;

                // Increase offset by format byte count.
                lByteOffset += pUnwrappedLayout.format.itemByteCount;
            }
        };
        lWriteLayout(lUnwrapedLayout);

        // Create buffer with initial data.
        const lBuffer: GpuBuffer = new GpuBuffer(this.device, lBufferData.byteLength).initialData(() => {
            return lBufferData;
        });

        // Send created data.
        this.sendData(lBuffer);

        return lBuffer;
    }

    /**
     * Create a empty buffer.
     * 
     * @param pVariableSizeCount - Variable item count.
     * 
     * @returns - Created buffer. 
     */
    public createBufferEmpty(pVariableSizeCount: number | null = null): GpuBuffer {
        // Layout must be a buffer memory layout.
        if (!(this.mBindLayout.layout instanceof BaseBufferMemoryLayout)) {
            throw new Exception(`Bind data layout is not suitable for buffers.`, this);
        }

        // TODO: Add dynamic offsets parameter to extend size by each item. Maybe limit dynamic offsets by static layouts or allow a variablesize parameter.

        // Calculate variable item count from initial buffer data.  
        const lVariableItemCount: number = (() => {
            // Use set variable count.
            if (pVariableSizeCount !== null) {
                return pVariableSizeCount;
            }

            // No need to calculate was it is allways zero.
            if (this.mBindLayout.layout.variableSize === 0) {
                return 0;
            }

            throw new Exception(`For bind group data buffer "${this.mBindLayout.name}" a variable item count must be set.`, this);
        })();

        // Calculate buffer size.
        const lByteSize: number = (lVariableItemCount ?? 0) * this.mBindLayout.layout.variableSize + this.mBindLayout.layout.fixedSize;

        // Create buffer.
        const lBuffer: GpuBuffer = new GpuBuffer(this.device, lByteSize);

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
        // Layout must be a buffer memory layout.
        if (!(this.mBindLayout.layout instanceof BaseBufferMemoryLayout)) {
            throw new Exception(`Bind data layout is not suitable for buffers.`, this);
        }

        // Calculate variable item count from initial buffer data.  
        const lVariableItemCount: number = (() => {
            // No need to calculate was it is allways zero.
            if (this.mBindLayout.layout.variableSize === 0) {
                return 0;
            }

            // Get initial buffer data byte length.
            const lBufferByteLength: number = pData.byteLength;

            // calculate item count and check if initial data meets requirments.
            const lItemCount: number = (lBufferByteLength - this.mBindLayout.layout.fixedSize) / this.mBindLayout.layout.variableSize;
            if (lItemCount % 1 > 0) {
                throw new Exception(`Raw bind group data buffer data "${this.mBindLayout.name}" does not meet alignment.`, this);
            }

            return lItemCount;
        })();

        // Calculate buffer size. // TODO: Extend bytecount when dynamic offsets are enabled.
        const lByteCount: number = (lVariableItemCount ?? 0) * this.mBindLayout.layout.variableSize + this.mBindLayout.layout.fixedSize;

        // Validate size.
        if (pData.byteLength !== lByteCount) {
            throw new Exception(`Raw bind group data buffer data "${this.mBindLayout.name}" does not meet data size (Should:${lByteCount} => Has:${pData.byteLength}) requirements.`, this);
        }

        // Create buffer.
        const lBuffer: GpuBuffer = new GpuBuffer(this.device, lByteCount).initialData(() => {
            return pData;
        });

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

    /**
     * Set data in little endian according to the set item format and offset. 
     * 
     * @param pBufferDataView - Data view of buffer.
     * @param pByteOffset - Byte offset in buffer.
     * @param pFormat - Format to write.
     * @param pData - Data to write.
     */
    private setBufferData(pBufferDataView: DataView, pByteOffset: number, pFormat: BufferItemFormat, pData: number): void {
        switch (pFormat) {
            case BufferItemFormat.Float32: { pBufferDataView.setFloat32(pByteOffset, pData, true); break; }
            case BufferItemFormat.Uint32: { pBufferDataView.setUint32(pByteOffset, pData, true); break; }
            case BufferItemFormat.Sint32: { pBufferDataView.setInt32(pByteOffset, pData, true); break; }

            // Unsupported
            case BufferItemFormat.Uint8:
            case BufferItemFormat.Sint8:
            case BufferItemFormat.Uint16:
            case BufferItemFormat.Sint16:
            case BufferItemFormat.Float16:
            case BufferItemFormat.Unorm16:
            case BufferItemFormat.Snorm16:
            case BufferItemFormat.Unorm8:
            case BufferItemFormat.Snorm8:
            default: {
                throw new Exception(`Currently "${pFormat}" is not supported for uniform parameter.`, this);
            }
        }
    }

    /**
     * Unwrap layout.
     * 
     * @param pLayout - Buffer layout.
     * 
     * @returns - unwrapped layout. 
     */
    private unwrapLayouts(pLayout: BaseBufferMemoryLayout): UnwrappedBufferLayout {
        // Recursion end condition. Primitives have no inner formats.
        if (pLayout instanceof PrimitiveBufferMemoryLayout) {
            // Read item count and format of parameter.
            const lParameterItemCount: number = PrimitiveBufferMemoryLayout.itemCountOfMultiplier(pLayout.itemMultiplier);
            const lParameterItemFormat: BufferItemFormat = pLayout.itemFormat;

            // Add formats for each item of parameter.
            return {
                // Global data.
                fixedItemCount: lParameterItemCount,
                variableItemCount: 0,

                // Local layout data.
                count: lParameterItemCount,
                alignment: pLayout.alignment,
                format: {
                    itemFormat: lParameterItemFormat,
                    itemByteCount: PrimitiveBufferMemoryLayout.itemFormatByteCount(lParameterItemFormat)
                }
            };
        }

        // Recursive array.
        if (pLayout instanceof ArrayBufferMemoryLayout) {
            // Unwrap inner format.
            const lInnerFormatUnwrapped: UnwrappedBufferLayout = this.unwrapLayouts(pLayout.innerType);

            // Add formats for each item of parameter.
            return {
                // Global data.
                fixedItemCount: Math.max(pLayout.arraySize, 0) * lInnerFormatUnwrapped.fixedItemCount,
                variableItemCount: (pLayout.variableSize > 0) ? lInnerFormatUnwrapped.fixedItemCount : 0,

                // Local layout data.
                count: pLayout.fixedSize || -1,
                alignment: pLayout.alignment,
                format: [lInnerFormatUnwrapped]
            };
        }

        // Recursive struct.
        if (pLayout instanceof StructBufferMemoryLayout) {
            let lFixedItemCount: number = 0;
            let lVariableItemCount: number = 0;

            // Create new unwrapped layout for each property.
            const lPropertyFormats: Array<UnwrappedBufferLayout> = new Array<UnwrappedBufferLayout>();
            for (const lProperty of pLayout.properties) {
                // Unwrap property format.
                const lPropertyFormatUnwrapped: UnwrappedBufferLayout = this.unwrapLayouts(lProperty.layout);

                // Count of fixed and variable item size.
                lFixedItemCount += lPropertyFormatUnwrapped.fixedItemCount;
                lVariableItemCount += lPropertyFormatUnwrapped.variableItemCount;

                lPropertyFormats.push(lPropertyFormatUnwrapped);
            }

            // Add formats for each item of parameter.
            return {
                // Global data.
                fixedItemCount: lFixedItemCount,
                variableItemCount: lVariableItemCount,

                // Local layout data.
                count: 1,
                alignment: pLayout.alignment,
                format: lPropertyFormats
            };
        }

        throw new Exception('Memory layout not suppored for bindings', this);
    }
}

type BindGroupDataCallback = (pData: GpuResourceObject<any, any, any, any>) => void;

type UnwrappedBufferLayout = {
    // Global data.
    fixedItemCount: number;
    variableItemCount: number;

    // Local layout data.
    count: number;
    alignment: number;
    format: Array<UnwrappedBufferLayout> | {
        itemFormat: BufferItemFormat,
        itemByteCount: number;
    };
};