import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core';
import { BindDataGroup } from '../../binding/bind-data-group';
import { GpuDevice } from '../../gpu/gpu-device';

import { PipelineLayout } from '../../binding/pipeline-layout';
import { GpuBuffer } from '../../buffer/gpu-buffer';
import { GpuObject } from '../../gpu/object/gpu-object';
import { VertexParameter } from '../../pipeline/parameter/vertex-parameter';
import { RenderTargets } from '../../pipeline/target/render-targets';
import { VertexFragmentPipeline } from '../../pipeline/vertex-fragment-pipeline';
import { GpuExecution } from '../gpu-execution';

export class RenderPass extends GpuObject {
    private readonly mInstructionList: Array<RenderInstruction>;
    private readonly mRenderTargets: RenderTargets;

    /**
     * Constructor.
     * @param pDevice - Device reference.
     * @param pRenderTargets - Render targets. 
     */
    public constructor(pDevice: GpuDevice, pRenderTargets: RenderTargets) {
        super(pDevice);

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
    public addStep(pPipeline: VertexFragmentPipeline, pParameter: VertexParameter, pBindData: Record<string, BindDataGroup>, pInstanceCount: number = 1): void {
        // Validate same render targets.
        if (this.mRenderTargets !== pPipeline.renderTargets) {
            throw new Exception('Instruction render pass not valid for instruction set.', this);
        }

        const lStep: RenderInstruction = {
            pipeline: pPipeline,
            parameter: pParameter,
            instanceCount: pInstanceCount,
            bindData: new Array<BindDataGroup>()
        };

        // Fill in data groups.
        const lPipelineLayout: PipelineLayout = pPipeline.module.shader.layout;
        for (const lGroupName of lPipelineLayout.groups) {
            // Get and validate existance of set bind group.
            const lBindDataGroup: BindDataGroup | undefined = pBindData[lGroupName];
            if (!lBindDataGroup) {
                throw new Exception(`Required bind group "${lGroupName}" not set.`, this);
            }

            // Validate same layout bind layout.
            const lBindGroupLayout = lPipelineLayout.getGroupLayout(lGroupName);
            if (lBindDataGroup.layout !== lBindGroupLayout) {
                throw new Exception('Source bind group layout does not match target layout.', this);
            }

            lStep.bindData[lPipelineLayout.groupIndex(lGroupName)] = pBindData[lGroupName];
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
        const lBindGroupList: Array<BindDataGroup | null> = new Array<BindDataGroup | null>();
        const lVertexBufferList: Dictionary<number, GpuBuffer<TypedArray>> = new Dictionary<number, GpuBuffer<TypedArray>>();

        // Execute instructions.
        for (const lInstruction of this.mInstructionList) {
            // Use cached pipeline or use new.
            if (lInstruction.pipeline !== lPipeline) {
                lPipeline = lInstruction.pipeline;

                // Generate and set new pipeline.
                lRenderPassEncoder.setPipeline(lPipeline.native);
            }

            // Add bind groups.
            const lPipelineLayout: PipelineLayout = lInstruction.pipeline.module.shader.layout;
            for (const lBindGroupName of lPipelineLayout.groups) {
                const lBindGroupLayout: number = lPipelineLayout.groupIndex(lBindGroupName);

                const lNewBindGroup: BindDataGroup | undefined = lInstruction.bindData[lBindGroupLayout];
                const lCurrentBindGroup: BindDataGroup | null = lBindGroupList[lBindGroupLayout];

                // Use cached bind group or use new.
                if (lNewBindGroup !== lCurrentBindGroup) {
                    lBindGroupList[lBindGroupLayout] = lNewBindGroup;

                    if (lNewBindGroup) {
                        lRenderPassEncoder.setBindGroup(lBindGroupLayout, lNewBindGroup.native);
                    }

                    // TODO: Unset bind group.
                    // lRenderPassEncoder.setBindGroup(1, null)
                }
            }

            // Add vertex attribute buffer.
            for (const lAttributeName of lInstruction.pipeline.module.vertexParameter.parameterNames) {
                const lNewAttributeBuffer: GpuBuffer<TypedArray> = lInstruction.parameter.get(lAttributeName);

                const lAttributeLocation: number = lInstruction.pipeline.module.vertexParameter.parameter(lAttributeName).location;
                const lCurrentAttributeBuffer: GpuBuffer<TypedArray> | undefined = lVertexBufferList.get(lAttributeLocation);

                // Use cached vertex buffer or use new.
                if (lNewAttributeBuffer !== lCurrentAttributeBuffer) {
                    lVertexBufferList.set(lAttributeLocation, lNewAttributeBuffer);
                    lRenderPassEncoder.setVertexBuffer(lAttributeLocation, lNewAttributeBuffer.native);
                }
            }

            // Set indexbuffer.
            lRenderPassEncoder.setIndexBuffer(lInstruction.parameter.indexBuffer.native, 'uint32');

            // Create draw call.
            lRenderPassEncoder.drawIndexed(lInstruction.parameter.indexBuffer.length, lInstruction.instanceCount);
        }

        lRenderPassEncoder.end();
    }
}

type RenderInstruction = {
    pipeline: VertexFragmentPipeline;
    parameter: VertexParameter;
    instanceCount: number;
    bindData: Array<BindDataGroup>;
};