import { TypedArray } from '@kartoffelgames/core.data';
import { Gpu } from '../../gpu';
import { BaseBuffer } from '../../resource/buffer/base-buffer';
import { SimpleBuffer } from '../../resource/buffer/simple-buffer';

export class RenderMesh {
    private readonly mHighestVerticleIndex: number;
    private readonly mIndexBuffer: SimpleBuffer<Uint16Array>;
    private readonly mVertexBufferList: Array<BaseBuffer<TypedArray>>;

    /**
     * Vertex attributes count.
     */
    public get attributesCount(): number {
        return this.mVertexBufferList.length;
    }

    /**
     * Index buffer.
     */
    public get indexBuffer(): SimpleBuffer<Uint16Array> {
        return this.mIndexBuffer;
    }

    /**
     * Vertex buffer.
     */
    public get vertexBuffer(): Array<BaseBuffer<TypedArray>> {
        return this.mVertexBufferList;
    }

    /**
     * Constructor.
     * 
     * @param pGpu - GPU.
     * @param pVertexAttribute - Vertex attribute. 
     * @param pVertexBuffer - Vertex buffer.
     * @param pVertexIndices - Vertex indices.
     */
    public constructor(pGpu: Gpu, pVertexIndices: Array<number>) {
        this.mVertexBufferList = new Array<BaseBuffer<TypedArray>>();

        // Get highest verticle index.
        this.mHighestVerticleIndex = Math.max(...pVertexIndices);

        // Init index buffer.
        const lIndexData: Uint16Array = new Uint16Array(pVertexIndices);
        this.mIndexBuffer = new SimpleBuffer(pGpu, GPUBufferUsage.INDEX, lIndexData);
    }

    /**
     * Add vertex buffer for vertex attributes.
     * Order matters. Vaidates assigned buffer with vertex attributes. 
     * @param pVertexBuffer 
     */
    public addVertexBuffer(pVertexBuffer: BaseBuffer<any>): void {
        this.mVertexBufferList.push(pVertexBuffer);
    }
}