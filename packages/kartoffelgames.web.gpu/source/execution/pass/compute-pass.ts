import { Dictionary, Exception } from '@kartoffelgames/core';
import { BindGroup } from '../../binding/bind-group';
import { PipelineLayout } from '../../binding/pipeline-layout';
import { GpuBuffer } from '../../buffer/gpu-buffer';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { GpuFeature } from '../../gpu/capabilities/gpu-feature.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/object/gpu-object';
import { ComputePipeline } from '../../pipeline/compute-pipeline';
import { GpuExecutionContext } from '../gpu-execution';

export class ComputePass extends GpuObject {
    private readonly mInstructionList: Array<ComputeInstruction>;
    private readonly mQueries: ComputePassQuery;

    /**
     * Constructor.
     * @param pDevice - Device reference.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);

        this.mQueries = {};
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
     * @param pExecutionContext - Executor context.
     */
    public execute(pExecutionContext: GpuExecutionContext): void {
        // Read render pass descriptor and inject timestamp query when it is setup.
        const lComputePassDescriptor: GPUComputePassDescriptor = {};
        if (this.mQueries.timestamp) {
            lComputePassDescriptor.timestampWrites = this.mQueries.timestamp.query;
        }

        // Pass descriptor is set, when the pipeline ist set.
        const lComputePassEncoder: GPUComputePassEncoder = pExecutionContext.commandEncoder.beginComputePass(lComputePassDescriptor);

        // Instruction cache.
        let lPipeline: ComputePipeline | null = null;

        // Buffer for current set bind groups.
        const lBindGroupList: Array<BindGroup> = new Array<BindGroup>();
        let lHighestBindGroupListIndex: number = -1;

        // Execute instructions.
        for (const lInstruction of this.mInstructionList) {
            // Skip pipelines that are currently loading.
            const lNativePipeline: GPUComputePipeline | null = lInstruction.pipeline.native;
            if (lNativePipeline === null) {
                continue;
            }

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
                lComputePassEncoder.setPipeline(lNativePipeline);

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

        // Resolve query.
        if (this.mQueries.timestamp) {
            pExecutionContext.commandEncoder.resolveQuerySet(this.mQueries.timestamp.query.querySet, 0, 2, this.mQueries.timestamp.buffer.native, 0);
        }
    }

    /**
     * Probe timestamp data from render pass.
     * Resolves into two big ints with start and end time in nanoseconds.
     * 
     * @returns Promise that resolves with the latest timestamp data.
     */
    public async probeTimestamp(): Promise<[bigint, bigint]> {
        // Skip when not enabled.
        if (!this.device.capabilities.hasFeature(GpuFeature.TimestampQuery)) {
            return [0n, 0n];
        }

        // Init timestamp query when not already set.
        if (!this.mQueries.timestamp) {
            // Create timestamp query.
            const lTimestampQuerySet: GPUQuerySet = this.device.gpu.createQuerySet({
                type: 'timestamp',
                count: 2
            });

            // Create timestamp buffer.
            const lTimestampBuffer: GpuBuffer = new GpuBuffer(this.device, 16);
            lTimestampBuffer.extendUsage(GPUBufferUsage.QUERY_RESOLVE);
            lTimestampBuffer.extendUsage(BufferUsage.CopySource);

            // Create query.
            this.mQueries.timestamp = {
                query: {
                    querySet: lTimestampQuerySet,
                    beginningOfPassWriteIndex: 0,
                    endOfPassWriteIndex: 1
                },
                buffer: lTimestampBuffer,
                resolver: null
            };
        }

        // Use existing resolver.
        if (this.mQueries.timestamp.resolver) {
            return this.mQueries.timestamp.resolver;
        }

        this.mQueries.timestamp.resolver = this.mQueries.timestamp.buffer.read(0, 16).then((pData: ArrayBuffer) => {
            // Reset resolver.
            this.mQueries.timestamp!.resolver = null;

            // Read and resolve timestamp data.
            const lTimedata: BigUint64Array = new BigUint64Array(pData);
            return [lTimedata[0], lTimedata[1]];
        });

        return this.mQueries.timestamp.resolver;
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

type ComputePassQuery = {
    timestamp?: {
        query: GPURenderPassTimestampWrites;
        buffer: GpuBuffer;
        resolver: null | Promise<[bigint, bigint]>;
    };
};