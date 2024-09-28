import { Dictionary, Exception } from '@kartoffelgames/core';
import { BindGroup } from '../../binding/bind-group';
import { PipelineLayout } from '../../binding/pipeline-layout';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/object/gpu-object';
import { ComputePipeline } from '../../pipeline/compute-pipeline';
import { GpuExecution } from '../gpu-execution';
import { GpuObjectLifeTime } from '../../gpu/object/gpu-object-life-time.enum';

export class ComputePass extends GpuObject {
    private readonly mInstructionList: Array<ComputeInstruction>;

    /**
     * Constructor.
     * @param pDevice - Device reference.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice, GpuObjectLifeTime.Persistent);

        this.mInstructionList = new Array<ComputeInstruction>();
    }

    /**
     * Add instruction step.
     * @param pPipeline - Pipeline.
     * @param pBindData -  Pipeline bind data.
     */
    public addStep(pPipeline: ComputePipeline, pWorkGroupSizes: [number, number, number], pBindData: Array<BindGroup>): symbol {
        const lStep: ComputeInstruction = {
            id: Symbol('ComuteStep'),
            pipeline: pPipeline,
            bindData: new Array<BindGroup>(),
            workGroupSizes: pWorkGroupSizes
        };

        // Write bind groups into searchable structure.
        const lBindGroups: Dictionary<string, BindGroup> = new Dictionary<string, BindGroup>();
        for (const lBindGroup of pBindData) {
            // Only distinct bind group names.
            if (lBindGroups.has(lBindGroup.layout.name)) {
                throw new Exception(`Bind group "${lBindGroup.layout.name}" was added multiple times to render pass step.`, this);
            }

            // Add bind group by name.
            lBindGroups.set(lBindGroup.layout.name, lBindGroup);
        }

        // Fill in data groups.
        const lPipelineLayout: PipelineLayout = pPipeline.module.shader.layout;
        for (const lGroupName of lPipelineLayout.groups) {
            // Get and validate existance of set bind group.
            const lBindDataGroup: BindGroup | undefined = lBindGroups.get(lGroupName);
            if (!lBindDataGroup) {
                throw new Exception(`Required bind group "${lGroupName}" not set.`, this);
            }

            // Validate same layout bind layout.
            const lBindGroupLayout = lPipelineLayout.getGroupLayout(lGroupName);
            if (lBindDataGroup.layout !== lBindGroupLayout) {
                throw new Exception('Source bind group layout does not match target layout.', this);
            }

            lStep.bindData[lPipelineLayout.groupIndex(lGroupName)] = lBindDataGroup;
        }

        this.mInstructionList.push(lStep);

        return lStep.id;
    }

    /**
     * Execute steps in a row.
     * @param pExecutor - Executor context.
     */
    public execute(pExecution: GpuExecution): void {
        // Pass descriptor is set, when the pipeline ist set.
        const lComputePassEncoder: GPUComputePassEncoder = pExecution.encoder.beginComputePass();

        // Instruction cache.
        let lPipeline: ComputePipeline | null = null;
        const lBindGroupList: Array<BindGroup | null> = new Array<BindGroup | null>();

        // Execute instructions.
        for (const lInstruction of this.mInstructionList) {
            // Use cached pipeline or use new.
            if (lInstruction.pipeline !== lPipeline) {
                lPipeline = lInstruction.pipeline;

                // Generate and set new pipeline.
                lComputePassEncoder.setPipeline(lPipeline.native);
            }

            // Add bind groups.
            const lPipelineLayout: PipelineLayout = lInstruction.pipeline.module.shader.layout;
            for (const lBindGroupName of lPipelineLayout.groups) {
                const lBindGroupLayout: number = lPipelineLayout.groupIndex(lBindGroupName);

                const lNewBindGroup: BindGroup | undefined = lInstruction.bindData[lBindGroupLayout];
                const lCurrentBindGroup: BindGroup | null = lBindGroupList[lBindGroupLayout];

                // Use cached bind group or use new.
                if (lNewBindGroup !== lCurrentBindGroup) {
                    lBindGroupList[lBindGroupLayout] = lNewBindGroup;

                    if (lNewBindGroup) {
                        lComputePassEncoder.setBindGroup(lBindGroupLayout, lNewBindGroup.native);
                    }

                    // TODO: Unset bind group.
                    // lComputePassEncoder.setBindGroup(1, null)
                }
            }

            // Start compute groups.
            lComputePassEncoder.dispatchWorkgroups(...lInstruction.workGroupSizes);

            // TODO: Indirect dispatch.
        }

        lComputePassEncoder.end();
    }

    /**
     * Remove instruction from instruction list.
     * 
     * @param pInstructionId - Instruction id.
     * 
     * @returns true when instruction was removed, false when it was not found. 
     */
    public removeStep(pInstructionId: symbol): boolean {
        // Find instruction index.
        const lInstructionIndex: number = this.mInstructionList.findIndex((pInstruction: ComputeInstruction) => {
            return pInstruction.id === pInstructionId;
        });

        // Remove instruction by index.
        if (lInstructionIndex !== -1) {
            this.mInstructionList.splice(lInstructionIndex, 1);
            return true;
        }

        return false;
    }
}

type ComputeInstruction = {
    id: symbol;
    pipeline: ComputePipeline;
    bindData: Array<BindGroup>;
    workGroupSizes: [number, number, number];
};