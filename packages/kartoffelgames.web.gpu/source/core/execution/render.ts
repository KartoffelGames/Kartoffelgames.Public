import { Exception, List, TypedArray } from '@kartoffelgames/core.data';
import { BindGroup } from '../bind_group/bind-group';
import { Gpu } from '../gpu';
import { RenderPipeline } from '../pipeline/render-pipeline';
import { VertexAttributes } from '../pipeline/vertex-attributes';
import { BaseBuffer } from '../resource/buffer/base-buffer';
import { RenderMesh } from './data/render-mesh';

export class Render {
    private readonly mBindGroups: List<BindGroup>;
    private readonly mGpu: Gpu;
    private mMesh: RenderMesh | null;
    private mPassDescriptor: GPURenderPassDescriptor | null;
    private mPipeline: RenderPipeline | null;

    // TODO: Set  GPURenderPassEncoder.setScissorRect

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: Gpu) {
        this.mGpu = pGpu;

        this.mBindGroups = new List<BindGroup>();
        this.mMesh = null;
        this.mPipeline = null;
        this.mPassDescriptor = null;
    }

    /**
     * Render set mesh with set pipeline.
     * @param pEncoder - Encoder.
     */
    public async render(pEncoder: GPUCommandEncoder): Promise<void> {
        if (!this.mMesh) {
            throw new Exception('Mesh not set', this);
        }

        if (!this.mPipeline) {
            throw new Exception('Pipeline not set', this);
        }

        // Pass descriptor is set, when the pipeline ist set.
        const lEncoder: GPURenderPassEncoder = pEncoder.beginRenderPass(this.mPassDescriptor!);
        lEncoder.setPipeline(await this.mPipeline.native());

        // Add bind groups.
        for (let lIndex: number = 0; lIndex < this.mPipeline.bindGoups.length; lIndex++) {
            const lBindGroup: BindGroup = this.mBindGroups[lIndex];
            if (!lBindGroup) {
                throw new Exception(`Missing bind group for pipeline bind group layout (index ${lIndex})`, this);
            }
            lEncoder.setBindGroup(lIndex, await lBindGroup.native());
        }

        // Add vertex attribute buffer.
        for (let lIndex: number = 0; lIndex < this.mMesh.vertexAttributes.length; lIndex++) {
            const lAttributeBuffer: BaseBuffer<TypedArray> | null = this.mMesh.vertexBuffer[lIndex];

            if (!lAttributeBuffer) {
                throw new Exception(`Vertext attribute buffer (index${lIndex}) not set.`, this);
            }

            lEncoder.setVertexBuffer(lIndex, await lAttributeBuffer.native());
        }

        lEncoder.setIndexBuffer(await this.mMesh.indexBuffer.native(), 'uint16');
        lEncoder.drawIndexed(this.mMesh.indexBuffer.length);
        lEncoder.end();
    }

    /**
     * Set bind group of pipeline.
     * @param pBindGroup - Bind group.
     */
    public async setBindGroup(pIndex: number, pBindGroup: BindGroup): Promise<void> {
        // Validate pipeline existance.
        if (!this.mPipeline) {
            throw new Exception(`Can't set bind group without set pipeline.`, this);
        }

        // Validate bind group layout.
        if (this.mPipeline.bindGoups[pIndex] !== pBindGroup.layout) {
            throw new Exception(`Bind data layout not matched with pipeline bind group layout.`, this);
        }

        this.mBindGroups[pIndex] = pBindGroup;
    }

    /**
     * Set mesh to render.
     * @param pMesh - Mesh to render.
     */
    public async setMesh(pMesh: RenderMesh): Promise<void> {
        // Validate pipeline existance.
        if (!this.mPipeline) {
            throw new Exception(`Can't set mesh without set pipeline.`, this);
        }

        // Validate mesh and pipeline attributes length.
        if (pMesh.vertexAttributes.length !== this.mPipeline.vertexAttributes.length) {
            throw new Exception(`Mesh attributes (length:${pMesh.vertexAttributes.length}) does not match pipeline attributes (length${this.mPipeline.vertexAttributes.length})`, this);
        }

        // Validate mesh and pipeline attributes content.
        for (let lAttributeIndex = 0; lAttributeIndex < pMesh.vertexAttributes.length; lAttributeIndex++) {
            const lMeshAttribute: VertexAttributes<TypedArray> = pMesh.vertexAttributes[lAttributeIndex];
            const lPipelineAttribute: VertexAttributes<TypedArray> = this.mPipeline.vertexAttributes[lAttributeIndex];
            if (lMeshAttribute !== lPipelineAttribute) {
                throw new Exception(`Mesh attributes does not match pipeline attributes`, this);
            }
        }

        this.mMesh = pMesh;
    }

    /**
     * Set render pipeline. Clears group binds.
     * @param pPipeline - Render pipeline.
     */
    public async setPipeline(pPipeline: RenderPipeline): Promise<void> {
        this.mPipeline = pPipeline;

        // Clear binds.
        this.mBindGroups.clear();

        // Create color attachments.
        const lColorAttachmentList: Array<GPURenderPassColorAttachment> = new Array<GPURenderPassColorAttachment>();
        for (const lAttachment of this.mPipeline.attachments) {
            lColorAttachmentList.push(await lAttachment.native());
        }
        // Generate pass descriptor once per set pipeline.
        this.mPassDescriptor = {
            colorAttachments: lColorAttachmentList
        };

        // Set optional depth attachmet.
        if (this.mPipeline.depthAttachment) {
            this.mPassDescriptor.depthStencilAttachment = await this.mPipeline.depthAttachment.native();
        }
    }
} 