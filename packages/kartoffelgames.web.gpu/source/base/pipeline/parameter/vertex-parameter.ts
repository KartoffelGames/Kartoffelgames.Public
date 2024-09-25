import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core';
import { BufferUsage } from '../../../constant/buffer-usage.enum';
import { MemoryCopyType } from '../../../constant/memory-copy-type.enum';
import { GpuBuffer } from '../../buffer/gpu-buffer';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject, NativeObjectLifeTime } from '../../gpu/object/gpu-object';
import { ArrayBufferMemoryLayout } from '../../memory_layout/buffer/array-buffer-memory-layout';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { PrimitiveBufferMemoryLayout } from '../../memory_layout/buffer/primitive-buffer-memory-layout';
import { VertexParameterLayout, VertexParameterLayoutDefinition } from './vertex-parameter-layout';

export class VertexParameter extends GpuObject {
    private readonly mData: Dictionary<string, GpuBuffer<TypedArray>>;
    private readonly mIndexBuffer: GpuBuffer<Uint32Array>;
    private readonly mLayout: VertexParameterLayout;

    /**
     * Get index buffer.
     */
    public get indexBuffer(): GpuBuffer<Uint32Array> {
        return this.mIndexBuffer;
    }

    /**
     * Get parameter layout.
     */
    public get layout(): VertexParameterLayout {
        return this.mLayout;
    }

    /**
     * Constructor.
     * @param pDevice - Device reference.
     * @param pVertexParameterLayout - Parameter layout.
     * @param pIndices - Index buffer data.
     */
    public constructor(pDevice: GpuDevice, pVertexParameterLayout: VertexParameterLayout, pIndices: Array<number>) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        // Set vertex parameter layout.
        this.mLayout = pVertexParameterLayout;
        this.mData = new Dictionary<string, GpuBuffer<TypedArray>>();

        // Create index layout.
        const lIndexLayout: PrimitiveBufferMemoryLayout = new PrimitiveBufferMemoryLayout(this.device, {
            primitiveFormat: PrimitiveBufferFormat.Uint32,
            usage: BufferUsage.Index,
            primitiveMultiplier: PrimitiveBufferMultiplier.Single,
        });

        // Create index buffer layout.
        const lIndexBufferLayout: ArrayBufferMemoryLayout = new ArrayBufferMemoryLayout(this.device, {
            arraySize: pIndices.length,
            innerType: lIndexLayout,
            usage: BufferUsage.Index,
        });

        // Create index buffer.
        this.mIndexBuffer = new GpuBuffer<Uint32Array>(pDevice, lIndexBufferLayout, MemoryCopyType.None, PrimitiveBufferFormat.Uint32).initialData(() => {
            return new Uint32Array(pIndices);
        });
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
     * @param pName - Parameter name.
     * @param pData - Parameter data.
     */
    public set(pName: string, pData: Array<number>): GpuBuffer<TypedArray> {
        const lParameterLayout: VertexParameterLayoutDefinition = this.mLayout.parameter(pName);

        // Create buffer layout.
        const lBufferLayout: PrimitiveBufferMemoryLayout = new PrimitiveBufferMemoryLayout(this.device, {
            primitiveFormat: lParameterLayout.format,
            usage: BufferUsage.Vertex,
            primitiveMultiplier: lParameterLayout.multiplier,
        });

        // Load typed array from layout format.
        const lParameterBuffer: GpuBuffer<TypedArray> = (() => {
            switch (lParameterLayout.format) {
                case PrimitiveBufferFormat.Float32: {
                    return new GpuBuffer(this.device, lBufferLayout, MemoryCopyType.None, PrimitiveBufferFormat.Float32).initialData(() => {
                        return new Float32Array(pData);
                    });
                }
                case PrimitiveBufferFormat.Sint32: {
                    return new GpuBuffer(this.device, lBufferLayout, MemoryCopyType.None, PrimitiveBufferFormat.Sint32).initialData(() => {
                        return new Int32Array(pData);
                    });
                }
                case PrimitiveBufferFormat.Uint32: {
                    return new GpuBuffer(this.device, lBufferLayout, MemoryCopyType.None, PrimitiveBufferFormat.Uint32).initialData(() => {
                        return new Uint32Array(pData);
                    });
                }
                default: {
                    throw new Exception(`Format "${lParameterLayout.format}" not supported for vertex buffer.`, this);
                }
            }
        })();

        // Save gpu buffer in correct index.
        this.mData.set(pName, lParameterBuffer);

        return lParameterBuffer;
    }
}