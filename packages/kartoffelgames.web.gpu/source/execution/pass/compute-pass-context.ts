import { Exception } from '@kartoffelgames/core';
import { GpuBuffer } from '../../buffer/gpu-buffer.ts';
import { BufferUsage } from '../../constant/buffer-usage.enum.ts';
import { ComputePipeline } from '../../pipeline/compute-pipeline.ts';
import { PipelineData, PipelineDataGroup } from '../../pipeline/pipeline_data/pipeline-data.ts';

/**
 * Context for a compute pass.
 * Used to execute compute calles.
 */
export class ComputePassContext {
    private readonly mComputeResourceBuffer: ComputePassPassContextRenderBuffer;
    private readonly mEncoder: GPUComputePassEncoder;

    /**
     * Constructor.
     * 
     * @param pEncoder - Encoder.
     */
    public constructor(pEncoder: GPUComputePassEncoder) {
        this.mEncoder = pEncoder;

        this.mComputeResourceBuffer = {
            pipeline: null,
            pipelineDataGroupList: new Array<PipelineDataGroup>(),
            highestBindGroupListIndex: -1
        };
    }

    /**
     * Compute direct with set parameter.
     * 
     * @param pPipeline - Pipeline.
     * @param pPipelineData - Pipline bind data groups.
     * @param pX - Workgroup x dimension.
     * @param pY - Workgroup y dimension.
     * @param pZ - Workgroup z dimension.
     */
    public computeDirect(pPipeline: ComputePipeline, pPipelineData: PipelineData, pX: number = 1, pY: number = 1, pZ: number = 1): void {
        // Validate pipeline data matches pipeline layout of pipeline.
        if (pPipeline.layout !== pPipelineData.layout) {
            throw new Exception('Pipline data not valid for set pipeline.', this);
        }

        // Execute compute.
        if (this.setupEncoderData(pPipeline, pPipelineData)) {
            this.mEncoder.dispatchWorkgroups(pX, pY, pZ);
        }
    }

    /**
     * Compute indirect with parameters set in buffer.
     * 
     * @param pPipeline - Pipeline.
     * @param pPipelineData - Pipline bind data groups.
     * @param pIndirectBuffer - Buffer with indirect parameter data.
     */
    public computeIndirect(pPipeline: ComputePipeline, pPipelineData: PipelineData, pIndirectBuffer: GpuBuffer): void {
        // Validate pipeline data matches pipeline layout of pipeline.
        if (pPipeline.layout !== pPipelineData.layout) {
            throw new Exception('Pipline data not valid for set pipeline.', this);
        }

        // Extend usage.
        pIndirectBuffer.extendUsage(BufferUsage.Indirect);

        // Execute compute.
        if (this.setupEncoderData(pPipeline, pPipelineData)) {
            // Validate buffer length
            // 4 Byte * 3 => 12 Byte => Indexed draw 
            if (pIndirectBuffer.size === 20) {
                // Start indirect call.
                this.mEncoder.dispatchWorkgroupsIndirect(pIndirectBuffer.native, 0);
            } else {
                throw new Exception('Indirect compute calls can only be done with 20 or 16 byte long buffers', this);
            }
        }
    }

    /**
     * Set pipeline and any bind data.
     * 
     * @param pPipeline - Pipeline.
     * @param pPipelineData - Pipeline binding data.
     * 
     * @returns true when everything has been successfully set. 
     */
    public setupEncoderData(pPipeline: ComputePipeline, pPipelineData: PipelineData): boolean {
        // Skip pipelines that are currently loading.
        const lNativePipeline: GPUComputePipeline | null = pPipeline.native;
        if (lNativePipeline === null) {
            return false;
        }

        // Cache for bind group length of this instruction.
        let lLocalHighestBindGroupListIndex: number = -1;

        // Add bind groups.
        const lPipelineDataGroupList: Array<PipelineDataGroup> = pPipelineData.data;
        for (let lBindGroupIndex: number = 0; lBindGroupIndex < lPipelineDataGroupList.length; lBindGroupIndex++) {
            const lPipelineDataGroup: PipelineDataGroup | undefined = lPipelineDataGroupList[lBindGroupIndex];
            const lCurrentPipelineDataGroup: PipelineDataGroup | null = this.mComputeResourceBuffer.pipelineDataGroupList[lBindGroupIndex];

            // Extend group list length.
            if (lBindGroupIndex > lLocalHighestBindGroupListIndex) {
                lLocalHighestBindGroupListIndex = lBindGroupIndex;
            }

            // Use cached bind group or use new. Catches null bindings.
            if (!lCurrentPipelineDataGroup || lPipelineDataGroup.bindGroup !== lCurrentPipelineDataGroup.bindGroup || lPipelineDataGroup.offsetId !== lCurrentPipelineDataGroup.offsetId) {
                // Set bind group buffer to cache current set bind groups.
                this.mComputeResourceBuffer.pipelineDataGroupList[lBindGroupIndex] = lPipelineDataGroup;

                // Set bind group to gpu.
                if (lPipelineDataGroup.bindGroup.layout.hasDynamicOffset) {
                    this.mEncoder.setBindGroup(lBindGroupIndex, lPipelineDataGroup.bindGroup.native, lPipelineDataGroup.offsets);
                } else {
                    this.mEncoder.setBindGroup(lBindGroupIndex, lPipelineDataGroup.bindGroup.native);
                }
            }
        }

        // Use cached pipeline or use new.
        if (pPipeline !== this.mComputeResourceBuffer.pipeline) {
            this.mComputeResourceBuffer.pipeline = pPipeline;

            // Generate and set new pipeline.
            this.mEncoder.setPipeline(lNativePipeline);

            // Only clear bind buffer when a new pipeline is set.
            // Same pipelines must have set the same bind group layouts.
            if (this.mComputeResourceBuffer.highestBindGroupListIndex > lLocalHighestBindGroupListIndex) {
                for (let lBindGroupIndex: number = (lLocalHighestBindGroupListIndex + 1); lBindGroupIndex < (this.mComputeResourceBuffer.highestBindGroupListIndex + 1); lBindGroupIndex++) {
                    this.mEncoder.setBindGroup(lBindGroupIndex, null);
                }
            }

            // Update global bind group list length.
            this.mComputeResourceBuffer.highestBindGroupListIndex = lLocalHighestBindGroupListIndex;
        }

        return true;
    }
}

type ComputePassPassContextRenderBuffer = {
    pipeline: ComputePipeline | null;

    pipelineDataGroupList: Array<PipelineDataGroup>;
    highestBindGroupListIndex: number;
};