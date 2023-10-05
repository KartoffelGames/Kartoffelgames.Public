import { Dictionary, TypedArray } from '@kartoffelgames/core.data';
import { BindDataGroup } from '../../../binding/bind-data-group';
import { InstructionExecuter } from '../../../execution/instruction-executor';
import { NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { BaseNativeInstructionGenerator } from '../../../generator/base-native-instruction-generator';
import { VertexFragmentPipeline } from '../../../pipeline/vertex-fragment-pipeline';
import { NativeWebGpuMap } from '../web-gpu-generator-factory';
import { GpuBuffer } from '../../../buffer/gpu-buffer';

export class WebGpuVertexFragmentInstructionGenerator extends BaseNativeInstructionGenerator<NativeWebGpuMap, 'vertexFragmentInstruction'>{
    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
    }

    /**
     * Execute steps in a row.
     * @param pExecutor - Executor context.
     */
    public override execute(pExecutor: InstructionExecuter): void {
        // Generate pass descriptor once per set pipeline.
        const lPassDescriptor: GPURenderPassDescriptor = this.factory.request<'renderTargets'>(this.gpuObject.renderTargets).create();

        // Pass descriptor is set, when the pipeline ist set.
        const lRenderPassEncoder: GPURenderPassEncoder = this.factory.request<'instructionExecutor'>(pExecutor).commandEncoder.beginRenderPass(lPassDescriptor);

        // Instruction cache.
        let lPipeline: VertexFragmentPipeline | null = null;
        const lBindGroupList: Array<BindDataGroup | null> = new Array<BindDataGroup | null>();
        const lVertexBufferList: Dictionary<number, GpuBuffer<TypedArray>> = new Dictionary<number, GpuBuffer<TypedArray>>();

        // Execute instructions.
        for (const lInstruction of this.gpuObject.steps) {
            // Use cached pipeline or use new.
            if (lInstruction.pipeline !== lPipeline) {
                lPipeline = lInstruction.pipeline;

                // Generate and set new pipeline.
                const lNativePipeline = this.factory.request<'vertexFragmentPipeline'>(lPipeline).create();
                lRenderPassEncoder.setPipeline(lNativePipeline);
            }

            // Add bind groups.
            for (const lIndex of lInstruction.pipeline.shader.pipelineLayout.groups) {
                const lNewBindGroup: BindDataGroup | null = lInstruction.bindData[lIndex];
                const lCurrentBindGroup: BindDataGroup | null = lBindGroupList[lIndex];

                // Use cached bind group or use new.
                if (lNewBindGroup !== lCurrentBindGroup) {
                    lBindGroupList[lIndex] = lNewBindGroup;

                    if (lNewBindGroup) {
                        const lNativeBindGroup = this.factory.request<'bindDataGroup'>(lNewBindGroup).create();
                        lRenderPassEncoder.setBindGroup(lIndex, lNativeBindGroup);
                    }
                }
            }

            // Add vertex attribute buffer.
            for (const lAttributeName of lInstruction.pipeline.shader.parameterLayout.parameter) {
                const lNewAttributeBuffer: GpuBuffer<TypedArray> = lInstruction.parameter.get(lAttributeName);

                const lAttributeLocation: number = lInstruction.pipeline.shader.parameterLayout.getIndexOf(lAttributeName);
                const lCurrentAttributeBuffer: GpuBuffer<TypedArray> | undefined = lVertexBufferList.get(lAttributeLocation);

                // Use cached vertex buffer or use new.
                if (lNewAttributeBuffer !== lCurrentAttributeBuffer) {
                    const lAttributeBuffer = this.factory.request<'gpuBuffer'>(lNewAttributeBuffer).create();

                    lVertexBufferList.set(lAttributeLocation, lNewAttributeBuffer);
                    lRenderPassEncoder.setVertexBuffer(lAttributeLocation, lAttributeBuffer);
                }
            }

            // Set indexbuffer.
            const lIndexBuffer = this.factory.request<'gpuBuffer'>(lInstruction.parameter.indexBuffer).create();
            lRenderPassEncoder.setIndexBuffer(lIndexBuffer, 'uint32');

            // Create draw call.
            lRenderPassEncoder.drawIndexed(lInstruction.parameter.indexBuffer.length, lInstruction.instanceCount);
        }

        lRenderPassEncoder.end();
    }

    /**
     * Generate native instruction.
     */
    protected override generate(): null {
        return null;
    }
}