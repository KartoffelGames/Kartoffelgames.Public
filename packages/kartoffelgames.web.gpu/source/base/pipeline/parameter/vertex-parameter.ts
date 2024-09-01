import { Dictionary, Exception } from '@kartoffelgames/core';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BufferUsage } from '../../../constant/buffer-usage.enum';
import { BufferPrimitiveFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { GpuBuffer } from '../../buffer/gpu-buffer';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/gpu-native-object';
import { ArrayBufferMemoryLayout } from '../../memory_layout/buffer/array-buffer-memory-layout';
import { PrimitiveBufferMemoryLayout } from '../../memory_layout/buffer/primitive-buffer-memory-layout';
import { VertexParameterLayout } from './vertex-parameter-layout';

export class VertexParameter extends GpuObject {
    private readonly mData: Dictionary<string, GpuBuffer<Float32Array>>;
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
        super(pDevice);

        // Set vertex parameter layout.
        this.mLayout = pVertexParameterLayout;
        this.mData = new Dictionary<string, GpuBuffer<Float32Array>>();

        // Create index layout.
        const lIndexLayout: PrimitiveBufferMemoryLayout = new PrimitiveBufferMemoryLayout(pDevice, {
            primitiveFormat: BufferPrimitiveFormat.Uint,
            bindType: BufferUsage.Index,
            size: 4,
            alignment: 4,
            locationIndex: null,
            access: AccessMode.Read,
            bindingIndex: null,
            name: '',
            visibility: ComputeStage.Vertex
        });

        // Create index buffer layout.
        const lIndexBufferLayout: ArrayBufferMemoryLayout = new ArrayBufferMemoryLayout(pDevice, {
            innerType: lIndexLayout,
            arraySize: pIndices.length,
            bindType: BufferUsage.Index,
            access: AccessMode.Read,
            bindingIndex: null,
            name: '',
            visibility: ComputeStage.Vertex
        });

        // Create index buffer.
        this.mIndexBuffer = lIndexBufferLayout.create(new Uint32Array(pIndices));
    }

    /**
     * Get parameter buffer.
     * @param pName - Parameter name.
     */
    public get(pName: string): GpuBuffer<Float32Array> {
        // Validate.
        if(!this.mData.has(pName)){
            throw new Exception(`Vertex parameter "${pName}" not found.`, this);
        }

        return this.mData.get(pName)!;
    }

    /**
     * Set parameter data.
     * @param pName - Parameter name.
     * @param pData - Parameter data.
     */
    public set(pName: string, pData: Array<number>): void {
        const lBufferLayout: PrimitiveBufferMemoryLayout = this.mLayout.getLayoutOf(pName);

        // TODO: Load typed array from layout format.
        const lParameterBuffer: GpuBuffer<Float32Array> = lBufferLayout.create(new Float32Array(pData));

        // Save gpu buffer in correct index.
        this.mData.set(pName, lParameterBuffer);
    }
}