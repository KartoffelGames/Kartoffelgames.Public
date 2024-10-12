import { Dictionary, Exception } from '@kartoffelgames/core';
import { BindGroup } from '../../binding/bind-group';
import { PipelineLayout } from '../../binding/pipeline-layout';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/object/gpu-object';
import { ComputePipeline } from '../../pipeline/compute-pipeline';
import { GpuExecution } from '../gpu-execution';

export class ComputePass extends GpuObject {
    private readonly mInstructionList: Array<ComputeInstruction>;

    /**
     * Constructor.
     * @param pDevice - Device reference.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);

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

        // TODO: Enforce maxComputeInvocationsPerWorkgroup

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
            // Get and validate existence of set bind group.
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

        // Buffer for current set bind groups.
        const lBindGroupList: Array<BindGroup> = new Array<BindGroup>();
        let lHighestBindGroupListIndex: number = -1;

        // Execute instructions.
        for (const lInstruction of this.mInstructionList) {
            // Cache for bind group length of this instruction.
            let lLocalHighestBindGroupListIndex: number = -1;

            // Add bind groups.
            const lPipelineLayout: PipelineLayout = lInstruction.pipeline.module.shader.layout;
            for (const lBindGroupName of lPipelineLayout.groups) {
                const lBindGroupIndex: number = lPipelineLayout.groupIndex(lBindGroupName);

                const lNewBindGroup: BindGroup | undefined = lInstruction.bindData[lBindGroupIndex];
                const lCurrentBindGroup: BindGroup | null = lBindGroupList[lBindGroupIndex];

                // Extend group list length.
                if (lBindGroupIndex > lLocalHighestBindGroupListIndex) {
                    lLocalHighestBindGroupListIndex = lBindGroupIndex;
                }

                // Use cached bind group or use new.
                if (lNewBindGroup !== lCurrentBindGroup) {
                    // Set bind group buffer to cache current set bind groups.
                    lBindGroupList[lBindGroupIndex] = lNewBindGroup;

                    // Set bind group to gpu.
                    lComputePassEncoder.setBindGroup(lBindGroupIndex, lNewBindGroup.native);
                }
            }

            // Use cached pipeline or use new.
            if (lInstruction.pipeline !== lPipeline) {
                lPipeline = lInstruction.pipeline;

                // Generate and set new pipeline.
                lComputePassEncoder.setPipeline(lPipeline.native);

                // Only clear bind buffer when a new pipeline is set.
                // Same pipelines must have set the same bind group layouts.
                if (lHighestBindGroupListIndex > lLocalHighestBindGroupListIndex) {
                    for (let lBindGroupIndex: number = (lLocalHighestBindGroupListIndex + 1); lBindGroupIndex < (lHighestBindGroupListIndex + 1); lBindGroupIndex++) {
                        lComputePassEncoder.setBindGroup(lBindGroupIndex, null);
                    }
                }

                // Update global bind group list length.
                lHighestBindGroupListIndex = lLocalHighestBindGroupListIndex;
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