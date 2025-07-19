import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuBuffer } from '../../buffer/gpu-buffer.ts';
import { GpuBufferView } from '../../buffer/gpu-buffer-view.ts';
import { BufferAlignmentType } from '../../constant/buffer-alignment-type.enum.ts';
import { BufferItemFormat } from '../../constant/buffer-item-format.enum.ts';
import { BufferItemMultiplier } from '../../constant/buffer-item-multiplier.enum.ts';
import { BufferUsage } from '../../constant/buffer-usage.enum.ts';
import { VertexParameterStepMode } from '../../constant/vertex-parameter-step-mode.enum.ts';
import { VertexParameterLayout, VertexParameterLayoutBuffer } from './vertex-parameter-layout.ts';
import { ArrayBufferMemoryLayout } from '../../buffer/memory_layout/array-buffer-memory-layout.ts';
import { PrimitiveBufferMemoryLayout } from '../../buffer/memory_layout/primitive-buffer-memory-layout.ts';
import { GpuDevice } from '../../device/gpu-device.ts';
import { GpuObject } from '../../gpu_object/gpu-object.ts';

/**
 * Vertex parameters used for a single render draw call.
 * Flats out parameters that are indexed when another vertex data is not indexed.
 */
export class VertexParameter extends GpuObject<null, VertexParameterInvalidationType> {
    private readonly mBuffer: Dictionary<string, GpuBuffer>;
    private readonly mIndexBufferView: GpuBufferView<Uint16Array | Uint32Array> | null;
    private readonly mIndices: Array<number>;
    private readonly mLayout: VertexParameterLayout;

    /**
     * Get index buffer.
     */
    public get indexBuffer(): GpuBufferView<Uint16Array | Uint32Array> | null {
        return this.mIndexBufferView;
    }

    /**
     * Get parameter layout.
     */
    public get layout(): VertexParameterLayout {
        return this.mLayout;
    }

    /**
     * Vertex count.
     */
    public get vertexCount(): number {
        return this.mIndices.length;
    }

    /**
     * Constructor.
     * @param pDevice - Device reference.
     * @param pVertexParameterLayout - Parameter layout.
     * @param pIndices - Index buffer data.
     */
    public constructor(pDevice: GpuDevice, pVertexParameterLayout: VertexParameterLayout, pIndices: Array<number>) {
        super(pDevice);

        // Set vertex parameter layout.
        this.mLayout = pVertexParameterLayout;
        this.mBuffer = new Dictionary<string, GpuBuffer>();

        // Save index information.
        this.mIndices = pIndices;

        // Create index buffer.
        this.mIndexBufferView = null;
        if (this.mLayout.indexable) {
            // Decide wich format to use.
            if (pIndices.length < Math.pow(2, 16)) {
                // Create index buffer layout.
                const lIndexBufferLayout: ArrayBufferMemoryLayout = new ArrayBufferMemoryLayout(this.device, {
                    arraySize: pIndices.length,
                    innerType: new PrimitiveBufferMemoryLayout(this.device, {
                        alignmentType: BufferAlignmentType.Packed,
                        primitiveFormat: BufferItemFormat.Uint16,
                        primitiveMultiplier: BufferItemMultiplier.Single,
                    })
                });

                // Create index buffer.
                const lIndexBuffer: GpuBuffer = new GpuBuffer(pDevice, pIndices.length * 2);
                lIndexBuffer.extendUsage(BufferUsage.Index);
                lIndexBuffer.initialData(new Uint16Array(pIndices).buffer);

                // Create view of buffer.
                this.mIndexBufferView = lIndexBuffer.view(lIndexBufferLayout, Uint16Array);
            } else {
                // Create index buffer layout.
                const lIndexBufferLayout: ArrayBufferMemoryLayout = new ArrayBufferMemoryLayout(this.device, {
                    arraySize: pIndices.length,
                    innerType: new PrimitiveBufferMemoryLayout(this.device, {
                        alignmentType: BufferAlignmentType.Packed,
                        primitiveFormat: BufferItemFormat.Uint32,
                        primitiveMultiplier: BufferItemMultiplier.Single,
                    })
                });

                // Create index buffer.
                const lIndexBuffer: GpuBuffer = new GpuBuffer(pDevice, pIndices.length * 4);
                lIndexBuffer.extendUsage(BufferUsage.Index);
                lIndexBuffer.initialData(new Uint32Array(pIndices).buffer);

                // Create view of buffer.
                this.mIndexBufferView = lIndexBuffer.view(lIndexBufferLayout, Uint32Array);
            }
        }
    }

    /**
     * Set parameter data.
     * @param pName - parameter buffer name.
     * @param pData - Parameter data with ignored alignments.
     */
    public create(pBufferName: string, pData: Array<number>): GpuBuffer {
        const lParameterLayout: VertexParameterLayoutBuffer = this.mLayout.parameterBuffer(pBufferName);

        // Get item count of layout. => Vec3<float> + int + Vex2<uint> => 6 Items
        const lStrideParameter: Array<{ format: BufferItemFormat, count: number, alignment: number; itemByteCount: number; }> = new Array<{ format: BufferItemFormat, count: number, alignment: number; itemByteCount: number; }>();
        let lStrideDataCount: number = 0;
        for (const lBufferParameter of lParameterLayout.layout.properties) {
            const lParameterLayout: PrimitiveBufferMemoryLayout = lBufferParameter.layout as PrimitiveBufferMemoryLayout;

            // Read item count and format of parameter.
            const lParameterItemCount: number = PrimitiveBufferMemoryLayout.itemCountOfMultiplier(lParameterLayout.itemMultiplier);
            const lParameterItemFormat: BufferItemFormat = lParameterLayout.itemFormat;

            // Add stride data count.
            lStrideDataCount += lParameterItemCount;

            // Add formats for each item of parameter.
            lStrideParameter.push({
                count: lParameterItemCount,
                format: lParameterItemFormat,
                alignment: lParameterLayout.alignment,
                itemByteCount: PrimitiveBufferMemoryLayout.itemFormatByteCount(lParameterItemFormat)
            });
        }

        // Buffer data must align with layout.
        if (pData.length % lStrideDataCount !== 0) {
            throw new Exception('Vertex parameter buffer data does not align with layout.', this);
        }

        // When parameter is indexed but vertex parameter are not indexed, extend data. Based on index data.
        let lData: Array<number> = pData;
        if (!this.mLayout.indexable && lParameterLayout.stepMode === VertexParameterStepMode.Index) {
            // Dublicate dependent on index information.
            lData = new Array<number>();
            for (const lIndex of this.mIndices) {
                const lDataStart: number = lIndex * lStrideDataCount;
                const lDataEnd: number = lDataStart + lStrideDataCount;

                // Copy vertex parameter data.
                lData.push(...pData.slice(lDataStart, lDataEnd));
            }
        }

        // Calculate struct count in buffer. Fallback to vertex mode when buffer is in index step mode but parameters cant be indexed.
        let lStrideCount: number = lData.length / lStrideDataCount;
        if (!this.mLayout.indexable && lParameterLayout.stepMode === VertexParameterStepMode.Index) {
            lStrideCount = this.mIndices.length;
        }

        // Create buffer data.
        const lBufferData: ArrayBuffer = new ArrayBuffer(lParameterLayout.layout.fixedSize * lStrideCount);
        const lBufferDataView: DataView = new DataView(lBufferData);

        // Set data in little endian according to the set item format and offset. 
        const lSetData = (pByteOffset: number, pFormat: BufferItemFormat, pData: number) => {
            switch (pFormat) {
                case BufferItemFormat.Float32: { lBufferDataView.setFloat32(pByteOffset, pData, true); break; }
                case BufferItemFormat.Uint32: { lBufferDataView.setUint32(pByteOffset, pData, true); break; }
                case BufferItemFormat.Sint32: { lBufferDataView.setInt32(pByteOffset, pData, true); break; }
                case BufferItemFormat.Uint8: { lBufferDataView.setUint8(pByteOffset, pData); break; }
                case BufferItemFormat.Sint8: { lBufferDataView.setInt8(pByteOffset, pData); break; }
                case BufferItemFormat.Uint16: { lBufferDataView.setUint16(pByteOffset, pData, true); break; }
                case BufferItemFormat.Sint16: { lBufferDataView.setInt16(pByteOffset, pData, true); break; }

                // Unsupported
                case BufferItemFormat.Float16:
                case BufferItemFormat.Unorm16:
                case BufferItemFormat.Snorm16:
                case BufferItemFormat.Unorm8:
                case BufferItemFormat.Snorm8:
                default: {
                    throw new Exception(`Currently "${pFormat}" is not supported for vertex parameter.`, this);
                }
            }
        };

        // Add data with correct alignment.
        let lDataIndex: number = 0;
        let lByteOffset: number = 0;
        for (let lStrideIndex: number = 0; lStrideIndex < lStrideCount; lStrideIndex++) {
            for (const lStrideItem of lStrideParameter) {
                // Apply stride item alignment to offset.
                lByteOffset = Math.ceil(lByteOffset / lStrideItem.alignment) * lStrideItem.alignment;

                // Add each parameter to buffer.
                for (let lStrideItemIndex: number = 0; lStrideItemIndex < lStrideItem.count; lStrideItemIndex++) {
                    // Add and iterate data.
                    lSetData(lByteOffset, lStrideItem.format, lData[lDataIndex]);
                    lDataIndex++;

                    // Increase offset by format byte count.
                    lByteOffset += lStrideItem.itemByteCount;
                }
            }

            // Apply stride alignment
            lByteOffset = Math.ceil(lByteOffset / lParameterLayout.layout.alignment) * lParameterLayout.layout.alignment;
        }

        // Load typed array from layout format.
        const lParameterBuffer: GpuBuffer = new GpuBuffer(this.device, lBufferData.byteLength).initialData(lBufferData);

        // Extend buffer to be a vertex buffer.
        lParameterBuffer.extendUsage(BufferUsage.Vertex);

        // Save gpu buffer in correct index.
        this.mBuffer.set(pBufferName, lParameterBuffer);

        // Invalidate on data set.
        this.invalidate(VertexParameterInvalidationType.Data);

        return lParameterBuffer;
    }

    /**
     * Get parameter buffer.
     * @param pBufferName - Parameter buffer name.
     */
    public get(pBufferName: string): GpuBuffer {
        // Validate.
        if (!this.mBuffer.has(pBufferName)) {
            throw new Exception(`Vertex parameter buffer for "${pBufferName}" not set.`, this);
        }

        return this.mBuffer.get(pBufferName)!;
    }

    /**
     * Add raw buffer as vertex parameter.
     * 
     * @param pBufferName - Buffer name.
     * @param pBuffer - Buffer.
     */
    public set(pBufferName: string, pBuffer: GpuBuffer): GpuBuffer {
        const lParameterLayout: VertexParameterLayoutBuffer = this.mLayout.parameterBuffer(pBufferName);

        // Validate alignment.
        if (pBuffer.size % lParameterLayout.layout.fixedSize !== 0) {
            throw new Exception('Set vertex parameter buffer does not align with layout.', this);
        }

        // Calculate stride count.
        let lStrideCount: number = pBuffer.size / lParameterLayout.layout.fixedSize;
        if (!this.mLayout.indexable && lParameterLayout.stepMode === VertexParameterStepMode.Index) {
            lStrideCount = this.mIndices.length;
        }

        // Validate length.
        if (pBuffer.size !== (lParameterLayout.layout.fixedSize * lStrideCount)) {
            throw new Exception(`Set vertex parameter buffer does not fit needed buffer size (Has:${pBuffer.size} => Should:${lParameterLayout.layout.fixedSize * lStrideCount}).`, this);
        }

        // Extend usage.
        pBuffer.extendUsage(BufferUsage.Vertex);

        // Add buffer.
        this.mBuffer.set(pBufferName, pBuffer);

        // Invalidate on data set.
        this.invalidate(VertexParameterInvalidationType.Data);

        return pBuffer;
    }
}

export enum VertexParameterInvalidationType {
    Data = 'DataChange',
}