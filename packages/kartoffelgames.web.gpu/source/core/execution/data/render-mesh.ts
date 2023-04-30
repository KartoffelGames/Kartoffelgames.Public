import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core.data';
import { Gpu } from '../../gpu';
import { BaseBuffer } from '../../resource/buffer/base-buffer';
import { SimpleBuffer } from '../../resource/buffer/simple-buffer';

export class RenderMesh {
    private readonly mGpu: Gpu;
    private readonly mIndexData: Array<number>;
    private readonly mMaxIndex: number;
    private readonly mVertexBuffer: Dictionary<string, BaseBuffer<TypedArray>>;

    /**
     * Vertex attributes count.
     */
    public get attributesCount(): number {
        return this.mVertexBuffer.size;
    }

    /**
     * Get index count.
     * Size of vertex data.
     */
    public get indexCount(): number {
        return this.mIndexData.length;
    }

    /**
     * Get index count.
     * Size of vertex data.
     */
    public get maxIndex(): number {
        return this.mMaxIndex;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pVertexIndices - Vertex indices.
     */
    public constructor(pGpu: Gpu, pVertexIndices: Array<number>) {
        this.mGpu = pGpu;
        this.mVertexBuffer = new Dictionary<string, BaseBuffer<TypedArray>>();
        this.mIndexData = pVertexIndices;
        this.mMaxIndex = Math.max(...pVertexIndices);
    }

    /**
     * Get buffer by attribute name
     * @param pName - Vertex attribute name.
     */
    public getBuffer(pName: string): BaseBuffer<TypedArray> {
        const lBuffer: BaseBuffer<TypedArray> | undefined = this.mVertexBuffer.get(pName);
        if (!lBuffer) {
            throw new Exception(`Vertex buffer for attribute "${pName}" not set`, this);
        }

        return lBuffer;
    }

    /**
     * Add data for each index.
     * @param pName - Attribute name.
     * @param pData - Data array.
     * @param pStrideLength - Data stride length for one value. 
     */
    public setIndexData(pName: string, pData: Array<number>, pStrideLength: number): void {
        // Validate.
        if (pData.length % pStrideLength !== 0) {
            throw new Exception('Vertex data length offset.', this);
        }

        this.mVertexBuffer.set(pName, new SimpleBuffer(this.mGpu, GPUBufferUsage.VERTEX, new Float32Array(pData)));
    }

    /**
     * Adds data for each vertex.
     * Converts vertex data into index data by dublicating vertex data for each index.
     * @param pName - Attribute name.
     * @param pData - Data array.
     * @param pStrideLength - Data stride length for one value. 
     */
    public setVertexData(pName: string, pData: Array<number>, pStrideLength: number): void {
        // Validate data strides.
        if (pData.length % pStrideLength !== 0) {
            throw new Exception(`Vertex data length offset: ${pName}(length: ${pData.length}, offset: ${pData.length % pStrideLength})`, this);
        }
        if ((this.mMaxIndex + 1) * pStrideLength !== pData.length) {
            throw new Exception(`Index data ${pName}(${pData.length}) does not meet needed data length of (max index: ${this.mMaxIndex}, needed length: ${(this.mMaxIndex + 1) * pStrideLength})`, this);
        }

        // Dublicate index data into vertex data.
        const lIndexData: Array<number> = new Array<number>();
        for (const lIndex of this.mIndexData) {
            // Copy data stride for index.
            lIndexData.push(...pData.slice(lIndex * pStrideLength, (lIndex + 1) * pStrideLength));
        }

        this.mVertexBuffer.set(pName, new SimpleBuffer(this.mGpu, GPUBufferUsage.VERTEX, new Float32Array(lIndexData)));
    }
}