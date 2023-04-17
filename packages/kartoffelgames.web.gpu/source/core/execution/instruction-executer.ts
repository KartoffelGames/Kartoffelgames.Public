import { Exception, List, TypedArray } from '@kartoffelgames/core.data';
import { Gpu } from '../gpu';
import { IInstruction } from './instruction/i-instruction.interface';
import { RenderSingleInstruction } from './instruction/render-single-instruction';
import { BindGroup } from '../bind_group/bind-group';
import { BaseBuffer } from '../resource/buffer/base-buffer';

export class InstructionExecuter {
    private readonly mGpu: Gpu;

    private readonly mRenderInstructionList: List<RenderSingleInstruction>;

    /**
     * Constructor.
     * @param pGpu - Gpu.
     */
    public constructor(pGpu: Gpu) {
        this.mGpu = pGpu;

        // Instruction sets.
        this.mRenderInstructionList = new List<RenderSingleInstruction>();
    }

    public addInstruction(pInstruction: IInstruction): void {
        if (pInstruction instanceof RenderSingleInstruction) {
            this.mRenderInstructionList.push(pInstruction);
        }
    }

    public clearInstructions(): void {
        this.mRenderInstructionList.clear();
    }

    public async execute(): Promise<void> {
        // Generate encoder and add render commands.
        const lEncoder = this.mGpu.device.createCommandEncoder();

        // TODO: DOSTUFFF...
        for (const lRenderInstruction of this.mRenderInstructionList) {
            await this.render(lEncoder, lRenderInstruction);
        }


        this.mGpu.device.queue.submit([lEncoder.finish()]);
    }

    /**
     * Render set mesh with set pipeline.
     * @param lRenderPassEncoder - Encoder.
     */
    private async render(pEncoder: GPUCommandEncoder, pRenderInstruction: RenderSingleInstruction): Promise<void> {
        // TODO: pRenderInstruction.validate()

        // Create color attachments.
        const lColorAttachmentList: Array<GPURenderPassColorAttachment> = new Array<GPURenderPassColorAttachment>();
        for (const lAttachment of pRenderInstruction.pipeline.attachments) {
            lColorAttachmentList.push(await lAttachment.native());
        }
        // Generate pass descriptor once per set pipeline.
        const lPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: lColorAttachmentList
        };

        // Set optional depth attachmet.
        if (pRenderInstruction.pipeline.depthAttachment) {
            lPassDescriptor.depthStencilAttachment = await pRenderInstruction.pipeline.depthAttachment.native();
        }

        // Pass descriptor is set, when the pipeline ist set.
        const lRenderPassEncoder: GPURenderPassEncoder = pEncoder.beginRenderPass(lPassDescriptor);
        lRenderPassEncoder.setPipeline(await pRenderInstruction.pipeline.native());

        // Add bind groups.
        for (const lIndex of pRenderInstruction.pipeline.shader.bindGroups.groups) {
            const lBindGroup: BindGroup | undefined = pRenderInstruction.bindGroups[lIndex];
            if (!lBindGroup) {
                throw new Exception(`Missing bind group for pipeline bind group layout (index ${lIndex})`, this);
            }
            lRenderPassEncoder.setBindGroup(lIndex, await lBindGroup.native());
        }

        // Add vertex attribute buffer.
        for (const lAttribute of pRenderInstruction.pipeline.shader.vertexEntryPoint!.attributes) {
            const lAttributeBuffer: BaseBuffer<TypedArray> = pRenderInstruction.mesh.getVertexBuffer(lAttribute.name);

            lRenderPassEncoder.setVertexBuffer(lAttribute.location, await lAttributeBuffer.native());
        }

        lRenderPassEncoder.setIndexBuffer(await pRenderInstruction.mesh.indexBuffer.native(), 'uint16');
        lRenderPassEncoder.drawIndexed(pRenderInstruction.mesh.indexBuffer.length);
        lRenderPassEncoder.end();
    }

}