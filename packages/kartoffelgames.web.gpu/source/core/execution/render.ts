import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core.data';
import { BindGroup } from '../bind_group/bind-group';
import { Gpu } from '../gpu';
import { RenderPipeline } from '../pipeline/render-pipeline';
import { VertexAttribute } from '../pipeline/vertex-attribute';
import { BaseBuffer } from '../resource/buffer/base-buffer';
import { RenderMesh } from './data/render-mesh';

export class Render {
    private readonly mBindGroups: Dictionary<number, BindGroup>;
    private readonly mGpu: Gpu;
    private mMesh: RenderMesh | null;
    private mPipeline: RenderPipeline | null;

    // TODO: Set  GPURenderPassEncoder.setScissorRect

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: Gpu) {
        this.mGpu = pGpu;

        this.mBindGroups = new Dictionary<number, BindGroup>();
        this.mMesh = null;
        this.mPipeline = null;
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

        // Create color attachments.
        const lColorAttachmentList: Array<GPURenderPassColorAttachment> = new Array<GPURenderPassColorAttachment>();
        for (const lAttachment of this.mPipeline.attachments) {
            lColorAttachmentList.push(await lAttachment.native());
        }
        // Generate pass descriptor once per set pipeline.
        const lPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: lColorAttachmentList
        };

        // Set optional depth attachmet.
        if (this.mPipeline.depthAttachment) {
            lPassDescriptor.depthStencilAttachment = await this.mPipeline.depthAttachment.native();
        }

        // Pass descriptor is set, when the pipeline ist set.
        const lEncoder: GPURenderPassEncoder = pEncoder.beginRenderPass(lPassDescriptor);
        lEncoder.setPipeline(await this.mPipeline.native());

        // Add bind groups.
        for (const lIndex of this.mPipeline.shader.bindGroups.groups) {
            const lBindGroup: BindGroup | undefined = this.mBindGroups.get(lIndex);
            if (!lBindGroup) {
                throw new Exception(`Missing bind group for pipeline bind group layout (index ${lIndex})`, this);
            }
            lEncoder.setBindGroup(lIndex, await lBindGroup.native());
        }

        // Add vertex attribute buffer.
        for (let lIndex: number = 0; lIndex < this.mMesh.attributesCount; lIndex++) {
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
        if (this.mPipeline.shader.bindGroups.getGroup(pIndex) !== pBindGroup.layout) {
            throw new Exception(`Bind data layout not matched with pipeline bind group layout.`, this);
        }

        this.mBindGroups.set(pIndex, pBindGroup);
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
        if (pMesh.attributesCount !== this.mPipeline.shader.vertexEntryPoint?.attributes.length) {
            throw new Exception(`Mesh attributes (length:${pMesh.attributesCount}) does not match pipeline attributes (length${this.mPipeline.shader.vertexEntryPoint?.attributes.length})`, this);
        }

        // Validate mesh and pipeline attributes content.
        for (let lAttributeIndex = 0; lAttributeIndex < pMesh.attributesCount; lAttributeIndex++) {
            const lMeshAttribute: BaseBuffer<TypedArray> = pMesh.vertexBuffer[lAttributeIndex];
            const lPipelineAttribute: VertexAttribute = this.mPipeline.shader.vertexEntryPoint.attributes[lAttributeIndex];
            if (lMeshAttribute.type !== lPipelineAttribute.bufferDataType) {
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
    }
} 