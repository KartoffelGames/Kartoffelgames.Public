import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core.data';
import { Gpu } from '../../gpu';
import { BaseBuffer } from '../../resource/buffer/base-buffer';
import { SimpleBuffer } from '../../resource/buffer/simple-buffer';

export class RenderMesh {
    private readonly mIndexBuffer: SimpleBuffer<Uint16Array>;
    private readonly mVertexBuffer: Dictionary<string, BaseBuffer<TypedArray>>;

    /**
     * Vertex attributes count.
     */
    public get attributesCount(): number {
        return this.mVertexBuffer.size;
    }

    /**
     * Index buffer.
     */
    public get indexBuffer(): SimpleBuffer<Uint16Array> {
        return this.mIndexBuffer;
    }

    /**
     * Constructor.
     * 
     * @param pGpu - GPU.
     * @param pVertexIndices - Vertex indices.
     */
    public constructor(pGpu: Gpu, pVertexIndices: Array<number>) {
        this.mVertexBuffer = new Dictionary<string, BaseBuffer<TypedArray>>();

        // Init index buffer.
        const lIndexData: Uint16Array = new Uint16Array(pVertexIndices);
        this.mIndexBuffer = new SimpleBuffer(pGpu, GPUBufferUsage.INDEX, lIndexData);
    }

    /**
     * Get buffer by attribute name
     * @param pName - Vertex attribute name.
     */
    public getVertexBuffer(pName: string): BaseBuffer<TypedArray> {
        const lBuffer: BaseBuffer<TypedArray> | undefined = this.mVertexBuffer.get(pName);
        if (!lBuffer) {
            throw new Exception(`Vertex buffer for attribute "${pName}" not found`, this);
        }

        return lBuffer;
    }

    /**
     * Add vertex buffer for vertex attributes.
     * Order matters. Vaidates assigned buffer with vertex attributes. 
     * @param pName - Attribute name.
     * @param pVertexBuffer 
     */
    public setVertexBuffer(pName: string, pVertexBuffer: BaseBuffer<any>): void {
        this.mVertexBuffer.set(pName, pVertexBuffer);
    }
}