import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core.data';
import { RenderPassDescriptor } from '../../pass_descriptor/render-pass-descriptor';
import { RenderSingleInstruction } from '../instruction/render-single-instruction';
import { IInstructionSet } from './i-instruction-set';
import { RenderPipeline } from '../../pipeline/render-pipeline';
import { BaseBuffer } from '../../resource/buffer/base-buffer';
import { BindGroup } from '../../bind_group/bind-group';
import { SimpleBuffer } from '../../resource/buffer/simple-buffer';

export class RenderInstructionSet implements IInstructionSet {
    private readonly mInstructionList: Array<RenderInstruction>;
    private readonly mRenderPass: RenderPassDescriptor;

    // TODO: Set  GPURenderPassEncoder.setScissorRect

    /**
     * Constructor.
     * @param pRenderPass - Render pass.
     */
    public constructor(pRenderPass: RenderPassDescriptor) {
        this.mRenderPass = pRenderPass;
        this.mInstructionList = new Array<RenderInstruction>();
    }

    /**
     * Add render instruction.
     * @param pInstruction - Render instruction.
     */
    public addInstruction(pInstruction: RenderInstruction): void {
        // Validate instruction.
        if (pInstruction.pipeline.renderPass !== this.mRenderPass) {
            throw new Exception('Instruction render pass not valid for instruction set.', this);
        }

        // Add instruction.
        this.mInstructionList.push(pInstruction);
    }

    /**
     * Execute instruction set.
     * @param pCommandEncoder - Command encoder.
     */
    public execute(pCommandEncoder: GPUCommandEncoder): void {
        // Generate pass descriptor once per set pipeline.
        const lPassDescriptor: GPURenderPassDescriptor = this.mRenderPass.native();

        // Pass descriptor is set, when the pipeline ist set.
        const lRenderPassEncoder: GPURenderPassEncoder = pCommandEncoder.beginRenderPass(lPassDescriptor);

        // Instruction cache.
        let lPipeline: RenderPipeline | null = null;
        const lBindGroupList: Array<BindGroup | undefined> = new Array<BindGroup | undefined>();
        const lVertexBufferList: Dictionary<number, BaseBuffer<TypedArray>> = new Dictionary<number, BaseBuffer<TypedArray>>();
        let lIndexBuffer: SimpleBuffer<Uint16Array> | null = null;

        // Execute instructions.
        for (const lInstruction of this.mInstructionList) {
            // Use cached pipeline or use new.
            if (lInstruction.pipeline !== lPipeline) {
                lPipeline = lInstruction.pipeline;
                lRenderPassEncoder.setPipeline(lInstruction.pipeline.native()!);
            }

            // Add bind groups.
            for (const lIndex of lPipeline.shader.bindGroups.groups) {
                const lNewBindGroup: BindGroup | undefined = lInstruction.bindGroups[lIndex];
                const lCurrentBindGroup: BindGroup | undefined = lBindGroupList[lIndex];

                // Use cached bind group or use new.
                if (lNewBindGroup !== lCurrentBindGroup) {
                    lBindGroupList[lIndex] = lNewBindGroup;

                    if (lNewBindGroup) {
                        lRenderPassEncoder.setBindGroup(lIndex, lNewBindGroup.native());
                    }
                }
            }

            // Add vertex attribute buffer.
            for (const lAttribute of lInstruction.pipeline.shader.vertexEntryPoint!.attributes) {
                const lNewAttributeBuffer: BaseBuffer<TypedArray> = lInstruction.mesh.getVertexBuffer(lAttribute.name);
                const lCurrentAttributeBuffer: BaseBuffer<TypedArray> | undefined = lVertexBufferList.get(lAttribute.location);

                // Use cached vertex buffer or use new.
                if (lNewAttributeBuffer !== lCurrentAttributeBuffer) {
                    lVertexBufferList.set(lAttribute.location, lNewAttributeBuffer);
                    lRenderPassEncoder.setVertexBuffer(lAttribute.location, lNewAttributeBuffer.native());
                }
            }

            // Use cached index buffer or use new.
            if (lInstruction.mesh.indexBuffer !== lIndexBuffer) {
                lIndexBuffer = lInstruction.mesh.indexBuffer;
                lRenderPassEncoder.setIndexBuffer(lInstruction.mesh.indexBuffer.native(), 'uint16');
            }

            lRenderPassEncoder.drawIndexed(lInstruction.mesh.indexBuffer.length);
        }

        lRenderPassEncoder.end();
    }
}

type RenderInstruction = RenderSingleInstruction;