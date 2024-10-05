import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core';
import { BindGroup } from '../../binding/bind-group';
import { GpuDevice } from '../../gpu/gpu-device';

import { PipelineLayout } from '../../binding/pipeline-layout';
import { GpuBuffer } from '../../buffer/gpu-buffer';
import { GpuObject } from '../../gpu/object/gpu-object';
import { VertexParameter } from '../../pipeline/parameter/vertex-parameter';
import { RenderTargets } from '../../pipeline/target/render-targets';
import { VertexFragmentPipeline } from '../../pipeline/vertex-fragment-pipeline';
import { GpuExecution } from '../gpu-execution';
import { GpuObjectLifeTime } from '../../gpu/object/gpu-object-life-time.enum';

export class RenderPass extends GpuObject {
    private readonly mInstructionList: Array<RenderInstruction>;
    private readonly mRenderTargets: RenderTargets;

    /**
     * Constructor.
     * @param pDevice - Device reference.
     * @param pRenderTargets - Render targets. 
     */
    public constructor(pDevice: GpuDevice, pRenderTargets: RenderTargets) {
        super(pDevice, GpuObjectLifeTime.Persistent);

        // TODO: Cache with a render bundle.

        this.mInstructionList = new Array<RenderInstruction>();
        this.mRenderTargets = pRenderTargets;
    }

    /**
     * Add instruction step.
     * @param pPipeline - Pipeline.
     * @param pParameter - Pipeline parameter.
     * @param pBindData - Pipline bind data groups.
     * @param pInstanceCount - Instance count.
     */
    public addStep(pPipeline: VertexFragmentPipeline, pParameter: VertexParameter, pBindData: Array<BindGroup>, pInstanceCount: number = 1): void {
        // Validate same render targets.
        if (this.mRenderTargets !== pPipeline.renderTargets) {
            throw new Exception('Instruction render pass not valid for instruction set.', this);
        }

        const lStep: RenderInstruction = {
            pipeline: pPipeline,
            parameter: pParameter,
            instanceCount: pInstanceCount,
            bindData: new Array<BindGroup>()
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
                throw new Exception(`Source bind group layout for "${lGroupName}" does not match target layout.`, this);
            }

            lStep.bindData[lPipelineLayout.groupIndex(lGroupName)] = lBindDataGroup;
        }

        this.mInstructionList.push(lStep);
    }

    /**
     * Execute steps in a row.
     * @param pExecutor - Executor context.
     */
    public execute(pExecution: GpuExecution): void {
        // Pass descriptor is set, when the pipeline ist set.
        const lRenderPassEncoder: GPURenderPassEncoder = pExecution.encoder.beginRenderPass(this.mRenderTargets.native);

        // Instruction cache.
        let lPipeline: VertexFragmentPipeline | null = null;

        const lVertexBufferList: Dictionary<number, GpuBuffer<TypedArray>> = new Dictionary<number, GpuBuffer<TypedArray>>();

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
                    lRenderPassEncoder.setBindGroup(lBindGroupIndex, lNewBindGroup.native);
                }
            }

            // Add vertex attribute buffer.
            const lBufferNames: Array<string> = lInstruction.pipeline.module.vertexParameter.bufferNames;
            for (let lBufferIndex: number = 0; lBufferIndex < lBufferNames.length; lBufferIndex++) {
                // Read buffer information.
                const lAttributeBufferName: string = lBufferNames[lBufferIndex];
                const lNewAttributeBuffer: GpuBuffer<TypedArray> = lInstruction.parameter.get(lAttributeBufferName);

                // Use cached vertex buffer or use new.
                if (lNewAttributeBuffer !== lVertexBufferList.get(lBufferIndex)) {
                    lVertexBufferList.set(lBufferIndex, lNewAttributeBuffer);
                    lRenderPassEncoder.setVertexBuffer(lBufferIndex, lNewAttributeBuffer.native);
                }

                // TODO: Clear unset buffer.
            }

            // Use cached pipeline or use new.
            if (lInstruction.pipeline !== lPipeline) {
                lPipeline = lInstruction.pipeline;

                // Generate and set new pipeline.
                lRenderPassEncoder.setPipeline(lPipeline.native);

                // Only clear bind buffer when a new pipeline is set.
                // Same pipelines must have set the same bind group layouts.
                if (lHighestBindGroupListIndex > lLocalHighestBindGroupListIndex) {
                    for (let lBindGroupIndex: number = (lLocalHighestBindGroupListIndex + 1); lBindGroupIndex < (lHighestBindGroupListIndex + 1); lBindGroupIndex++) {
                        lRenderPassEncoder.setBindGroup(lBindGroupIndex, null);
                    }
                }

                // Update global bind group list length.
                lHighestBindGroupListIndex = lLocalHighestBindGroupListIndex;

                // Only clear vertex buffer when a new pipeline is set.
                // Same pipeline must have the same vertex parameter layout.
                // TODO: Clear vertex buffer,
                // lRenderPassEncoder.setVertexBuffer(1, null);
            }

            // Draw indexed when parameters are indexable.
            if (lInstruction.parameter.layout.indexable) {
                // Set indexbuffer.
                lRenderPassEncoder.setIndexBuffer(lInstruction.parameter.indexBuffer!.native, 'uint32'); // TODO: Dynamicly switch between 32 and 16 bit based on length.

                // Create draw call.
                lRenderPassEncoder.drawIndexed(lInstruction.parameter.indexBuffer!.length, lInstruction.instanceCount);
            } else {
                // Create draw call.
                lRenderPassEncoder.draw(lInstruction.parameter.vertexCount, lInstruction.instanceCount);
            }

            // TODO: Indirect dispatch.
        }

        lRenderPassEncoder.end();
    }
}

type RenderInstruction = {
    pipeline: VertexFragmentPipeline;
    parameter: VertexParameter;
    instanceCount: number;
    bindData: Array<BindGroup>;
};