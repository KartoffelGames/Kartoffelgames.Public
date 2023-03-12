import { Exception, TypedArray } from '@kartoffelgames/core.data';
import { Gpu } from '../../gpu';
import { VertexAttributes } from '../../pipeline/vertex-attributes';
import { BaseBuffer } from '../../resource/buffer/base-buffer';
import { SimpleBuffer } from '../../resource/buffer/simple-buffer';

export class RenderMesh {
    private readonly mHighestVerticleIndex: number;
    private readonly mIndexBuffer: SimpleBuffer<Uint16Array>;
    private readonly mVertexAttributeList: Array<VertexAttributes<TypedArray>>;
    private readonly mVertexBufferList: Array<BaseBuffer<TypedArray>>;

    /**
     * Index buffer.
     */
    public get indexBuffer(): SimpleBuffer<Uint16Array> {
        return this.mIndexBuffer;
    }

    /**
     * Vertex attributes.
     */
    public get vertexAttributes(): Array<VertexAttributes<TypedArray>> {
        return this.mVertexAttributeList;
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
    public constructor(pGpu: Gpu, pVertexIndices: Array<number>, ...pVertexAttributes: Array<VertexAttributes<TypedArray>>) {
        this.mVertexAttributeList = pVertexAttributes;
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
        const lCurrentVertexIndex: number = this.mVertexBufferList.length;

        // Validate buffer for available attribute.
        if (lCurrentVertexIndex > this.mVertexAttributeList.length - 1) {
            throw new Exception(`Vertex buffer(Index: ${lCurrentVertexIndex}) has no vertex attributes(Count: ${this.mVertexAttributeList.length})`, this);
        }

        const lVertexAttribute: VertexAttributes<TypedArray> = this.mVertexAttributeList[lCurrentVertexIndex]!;

        // Validate vertex buffer with vertex attribute definition.
        if (pVertexBuffer.size < (this.mHighestVerticleIndex * lVertexAttribute.strideLength)) {
            throw new Exception(`Vertex buffer does not meet size(${pVertexBuffer.size}) of vertex attribute(${this.mHighestVerticleIndex * lVertexAttribute.strideLength})`, this);
        }

        // Validate buffertype to attibute type.
        if (pVertexBuffer.type !== lVertexAttribute.bufferDataType) {
            throw new Exception('Buffer can be assigned to attribute. Wrong underlying data type.', this);
        }

        this.mVertexBufferList.push(pVertexBuffer);
    }
}