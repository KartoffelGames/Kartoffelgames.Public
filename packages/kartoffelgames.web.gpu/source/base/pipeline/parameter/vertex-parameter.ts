import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core';
import { BufferUsage } from '../../../constant/buffer-usage.enum';
import { VertexParameterStepMode } from '../../../constant/vertex-parameter-step-mode.enum';
import { GpuBuffer } from '../../buffer/gpu-buffer';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/object/gpu-object';
import { ArrayBufferMemoryLayout } from '../../memory_layout/buffer/array-buffer-memory-layout';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { PrimitiveBufferMemoryLayout } from '../../memory_layout/buffer/primitive-buffer-memory-layout';
import { VertexParameterLayout, VertexParameterLayoutBuffer } from './vertex-parameter-layout';

export class VertexParameter extends GpuObject<null, VertexParameterInvalidationType> {
    private readonly mData: Dictionary<string, GpuBuffer<TypedArray>>;
    private readonly mIndexBuffer: GpuBuffer<Uint32Array> | null;
    private readonly mIndices: Array<number>;
    private readonly mLayout: VertexParameterLayout;

    /**
     * Get index buffer.
     */
    public get indexBuffer(): GpuBuffer<Uint32Array> | null {
        return this.mIndexBuffer;
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
        this.mData = new Dictionary<string, GpuBuffer<TypedArray>>();

        // Invalidate on layout change.
        this.mLayout.addInvalidationListener(() => {
            this.invalidate(VertexParameterInvalidationType.Data);
        });

        // Create index layout.
        const lIndexLayout: PrimitiveBufferMemoryLayout = new PrimitiveBufferMemoryLayout(this.device, {
            primitiveFormat: PrimitiveBufferFormat.Uint32,
            primitiveMultiplier: PrimitiveBufferMultiplier.Single,
        });

        // Create index buffer layout.
        const lIndexBufferLayout: ArrayBufferMemoryLayout = new ArrayBufferMemoryLayout(this.device, {
            arraySize: pIndices.length,
            innerType: lIndexLayout
        });

        // Create index buffer.
        this.mIndexBuffer = null;
        if (this.mLayout.indexable) {
            this.mIndexBuffer = new GpuBuffer<Uint32Array>(pDevice, lIndexBufferLayout, PrimitiveBufferFormat.Uint32).initialData(() => {
                return new Uint32Array(pIndices);
            }).extendUsage(BufferUsage.Index);
        }

        // Save index information.
        this.mIndices = pIndices;
    }

    /**
     * Get parameter buffer.
     * @param pName - Parameter name.
     */
    public get(pName: string): GpuBuffer<TypedArray> {
        // Validate.
        if (!this.mData.has(pName)) {
            throw new Exception(`Vertex parameter buffer for "${pName}" not set.`, this);
        }

        return this.mData.get(pName)!;
    }

    /**
     * Set parameter data.
     * @param pName - parameter buffer name.
     * @param pData - Parameter data.
     */
    public set(pBufferName: string, pData: Array<number>): GpuBuffer<TypedArray> {
        const lParameterLayout: VertexParameterLayoutBuffer = this.mLayout.parameterBuffer(pBufferName);

        // When parameter is indexed but vertex parameter are not indexed, extend data. Based on index data.
        let lData: Array<number> = pData;
        if (!this.mLayout.indexable && lParameterLayout.stepMode === VertexParameterStepMode.Index) {
            // Calculate how many items represent one parameter.
            const lStepCount: number = lParameterLayout.layout.variableSize / lParameterLayout.layout.formatByteCount;

            // Dublicate dependent on index information.
            lData = new Array<number>();
            for (const lIndex of this.mIndices) {
                const lDataStart: number = lIndex * lStepCount;
                const lDataEnd: number = lDataStart + lStepCount;

                // Copy vertex parameter data.
                lData.push(...pData.slice(lDataStart, lDataEnd));
            }
        }

        // Calculate vertex parameter count.
        const lVertexParameterItemCount: number = (lData.length * lParameterLayout.layout.formatByteCount) / (lParameterLayout.layout.variableSize);

        // Load typed array from layout format.
        const lParameterBuffer: GpuBuffer<TypedArray> = (() => {
            switch (lParameterLayout.format) { // TODO. Support all 8 16 and 32 formats. 
                case PrimitiveBufferFormat.Float32: {
                    return new GpuBuffer(this.device, lParameterLayout.layout, PrimitiveBufferFormat.Float32, lVertexParameterItemCount).initialData(() => {
                        return new Float32Array(lData);
                    });
                }
                case PrimitiveBufferFormat.Sint32: {
                    return new GpuBuffer(this.device, lParameterLayout.layout, PrimitiveBufferFormat.Sint32, lVertexParameterItemCount).initialData(() => {
                        return new Int32Array(lData);
                    });
                }
                case PrimitiveBufferFormat.Uint32: {
                    return new GpuBuffer(this.device, lParameterLayout.layout, PrimitiveBufferFormat.Uint32, lVertexParameterItemCount).initialData(() => {
                        return new Uint32Array(lData);
                    });
                }
                default: {
                    throw new Exception(`Format "${lParameterLayout.format}" not supported for vertex buffer.`, this);
                }
            }
        })();

        // Extend buffer to be a vertex buffer.
        lParameterBuffer.extendUsage(BufferUsage.Vertex);

        // Save gpu buffer in correct index.
        this.mData.set(pBufferName, lParameterBuffer);

        // Invalidate on data set.
        this.invalidate(VertexParameterInvalidationType.Data);

        return lParameterBuffer;
    }
}

export enum VertexParameterInvalidationType {
    Data = 'DataChange',
    Layout = 'LayoutChange'
}