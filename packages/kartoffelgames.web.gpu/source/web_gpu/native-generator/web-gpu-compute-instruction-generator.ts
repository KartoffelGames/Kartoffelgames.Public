import { BindDataGroup } from '../../base/binding/bind-data-group';
import { NativeObjectLifeTime } from '../../base/native_generator/base-native-generator';
import { BaseNativeInstructionGenerator } from '../../base/native_generator/base-native-instruction-generator';
import { ComputePipeline } from '../../base/pipeline/compute-pipeline';
import { NativeWebGpuMap } from '../web-gpu-generator-factory';

export class WebGpuComputeInstructionGenerator extends BaseNativeInstructionGenerator<NativeWebGpuMap, 'computeInstruction'>{
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
    public override execute(): void {
        // Pass descriptor is set, when the pipeline ist set.
        const lComputePassEncoder: GPUComputePassEncoder = this.factory.request<'instructionExecutor'>(this.gpuObject.executor).commandEncoder.beginComputePass();

        // Instruction cache.
        let lPipeline: ComputePipeline | null = null;
        const lBindGroupList: Array<BindDataGroup | null> = new Array<BindDataGroup | null>();

        // Execute instructions.
        for (const lInstruction of this.gpuObject.steps) {
            // Use cached pipeline or use new.
            if (lInstruction.pipeline !== lPipeline) {
                lPipeline = lInstruction.pipeline;

                // Generate and set new pipeline.
                const lNativePipeline = this.factory.request<'computePipeline'>(lPipeline).create();
                lComputePassEncoder.setPipeline(lNativePipeline);
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
                        lComputePassEncoder.setBindGroup(lIndex, lNativeBindGroup);
                    }
                }
            }

            // Start compute groups.
            const lWorkGroupSizes = lInstruction.pipeline.shader.workGroupSizes;
            lComputePassEncoder.dispatchWorkgroups(lWorkGroupSizes.x, lWorkGroupSizes.y, lWorkGroupSizes.z);
        }

        lComputePassEncoder.end();
    }

    /**
     * Generate native instruction.
     */
    protected override generate(): null {
        // Literaly nothing to cache or compute.
        return null;
    }
}