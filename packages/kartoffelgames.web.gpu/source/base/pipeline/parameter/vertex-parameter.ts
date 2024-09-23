import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core';
import { BufferUsage } from '../../../constant/buffer-usage.enum';
import { MemoryCopyType } from '../../../constant/memory-copy-type.enum';
import { GpuBuffer } from '../../buffer/gpu-buffer';
import { GpuDevice } from '../../gpu/gpu-device';
import { ArrayBufferMemoryLayout } from '../../memory_layout/buffer/array-buffer-memory-layout';
import { PrimitiveBufferMultiplier } from '../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { PrimitiveBufferMemoryLayout } from '../../memory_layout/buffer/primitive-buffer-memory-layout';
import { VertexParameterLayout, VertexParameterLayoutDefinition } from './vertex-parameter-layout';
import { GpuObject, NativeObjectLifeTime } from '../../gpu/object/gpu-object';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';

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
        const lIndexLayout: PrimitiveBufferMemoryLayout = new PrimitiveBufferMemoryLayout({
            primitiveFormat: PrimitiveBufferFormat.Uint32,
            usage: BufferUsage.Index,
            primitiveMultiplier: PrimitiveBufferMultiplier.Single,
            name: ''
        });

        // Create index buffer layout.
        const lIndexBufferLayout: ArrayBufferMemoryLayout = new ArrayBufferMemoryLayout({
            arraySize: pIndices.length,
            innerType: lIndexLayout,
            usage: BufferUsage.Index,
            name: '',
        });

        // Create index buffer.
        this.mIndexBuffer = new GpuBuffer(pDevice, lIndexBufferLayout, MemoryCopyType.None, new Uint32Array(pIndices), 0);
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
        const lBufferLayout: PrimitiveBufferMemoryLayout = new PrimitiveBufferMemoryLayout({
            primitiveFormat: lParameterLayout.format,
            usage: BufferUsage.Vertex,
            primitiveMultiplier: lParameterLayout.multiplier,
            name: lParameterLayout.name
        });

        // Load typed array from layout format.
        let lParameterBuffer: GpuBuffer<TypedArray>;
        switch (lParameterLayout.format) {
            case PrimitiveBufferFormat.Float32: {
                lParameterBuffer = new GpuBuffer(this.device, lBufferLayout, MemoryCopyType.None, new Float32Array(pData), 0);
                break;
            }
            case PrimitiveBufferFormat.Sint32: {
                lParameterBuffer = new GpuBuffer(this.device, lBufferLayout, MemoryCopyType.None, new Int32Array(pData), 0);
                break;
            }
            case PrimitiveBufferFormat.Uint32: {
                lParameterBuffer = new GpuBuffer(this.device, lBufferLayout, MemoryCopyType.None, new Uint32Array(pData), 0);
                break;
            }
            default: {
                throw new Exception(`Format "${lParameterLayout.format}" not supported for vertex buffer.`, this);
            }
        }
        
        // Save gpu buffer in correct index.
        this.mData.set(pName, lParameterBuffer);

        return lParameterBuffer;
    }
}