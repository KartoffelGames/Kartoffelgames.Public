import { Dictionary, Exception } from '@kartoffelgames/core';
import { BindGroup } from '../../binding/bind-group';
import { PipelineData } from '../../binding/pipeline-data';
import { GpuBuffer } from '../../buffer/gpu-buffer';
import { VertexParameter } from '../../pipeline/parameter/vertex-parameter';
import { RenderTargets } from '../../pipeline/target/render-targets';
import { VertexFragmentPipeline } from '../../pipeline/vertex-fragment-pipeline';

export class RenderPassContext {
    private readonly mEncoder: GPURenderPassEncoder | GPURenderBundleEncoder;
    private readonly mRecordResources: boolean;
    private readonly mRenderResourceBuffer: RenderPassContextRenderBuffer;
    private readonly mRenderTargets: RenderTargets;
    private readonly mUsedResources: RenderPassContextUsedResource;

    /**
     * Used resource.
     * Only filled when recording is enabled. 
     */
    public get usedResources(): RenderPassContextUsedResource {
        return this.mUsedResources;
    }

    /**
     * Constructor.
     * 
     * @param pEncoder - Encoder.
     * @param pRenderTargets - Render targets.
     * @param pRecordResources - Records used resources on render. 
     */
    public constructor(pEncoder: GPURenderPassEncoder | GPURenderBundleEncoder, pRenderTargets: RenderTargets, pRecordResources: boolean) {
        this.mEncoder = pEncoder;
        this.mRenderTargets = pRenderTargets;
        this.mRecordResources = pRecordResources;
        this.mUsedResources = {
            parameter: new Set<VertexParameter>(),
            indirectBuffer: new Set<GpuBuffer>(),
            pipelines: new Set<VertexFragmentPipeline>(),
            pipelineData: new Set<PipelineData>()
        };
        this.mRenderResourceBuffer = {
            pipeline: null,
            vertexBuffer: new Dictionary<number, GpuBuffer>(),
            highestVertexParameterIndex: -1,
            bindGroupList: new Array<BindGroup>(),
            highestBindGroupListIndex: -1
        };
    }

    /**
     * Draw direct with set parameter.
     * 
     * @param pPipeline - Pipeline.
     * @param pParameter - Pipeline parameter.
     * @param pBindData - Pipline bind data groups.
     * @param pInstanceCount - Instance count.
     */
    public drawDirect(pPipeline: VertexFragmentPipeline, pParameter: VertexParameter, pPipelineData: PipelineData, pInstanceCount: number = 1, _pInstanceOffset?: GPUSize32): void { // TODO: INstanceOffset
        // Validate same render targets.
        if (this.mRenderTargets !== pPipeline.renderTargets) {
            throw new Exception('Pipelines render targets not valid for this render pass.', this);
        }

        // Validate parameter.
        if (pParameter.layout !== pPipeline.module.vertexParameter) {
            throw new Exception('Vertex parameter not valid for set pipeline.', this);
        }

        // Record resource when config is set.
        if (this.mRecordResources) {
            // Pipelines.
            if (!this.mUsedResources.pipelines.has(pPipeline)) {
                this.mUsedResources.pipelines.add(pPipeline);
            }

            // Parameter
            if (!this.mUsedResources.parameter.has(pParameter)) {
                this.mUsedResources.parameter.add(pParameter);
            }

            // Pipeline data.
            if (!this.mUsedResources.pipelineData.has(pPipelineData)) {
                this.mUsedResources.pipelineData.add(pPipelineData);
            }
        }

        this.setRenderQueue(pPipeline, pParameter, pInstanceCount, pPipelineData);
    }

    public drawIndirect(_pPipeline: VertexFragmentPipeline, _pParameter: VertexParameter, _pPipelineData: PipelineData): void {
        // TODO:
    }



    /**
     * Fill encoder with each render step.
     * 
     * @param pEncoder - Render encoder.
     */
    private setRenderQueue(pPipeline: VertexFragmentPipeline, pParameter: VertexParameter, pInstanceCount: number, pPipelineData: PipelineData): void {
        // Skip pipelines that are currently loading.
        const lNativePipeline: GPURenderPipeline | null = pPipeline.native;
        if (lNativePipeline === null) {
            return;
        }

        // Cache for bind group length of this instruction.
        let lLocalHighestBindGroupListIndex: number = -1;

        // Add bind groups.
        const lBindGroupList: Array<BindGroup> = pPipelineData.data;
        for (let lBindGroupIndex: number = 0; lBindGroupIndex < lBindGroupList.length; lBindGroupIndex++) {
            const lNewBindGroup: BindGroup | undefined = lBindGroupList[lBindGroupIndex];
            const lCurrentBindGroup: BindGroup | null = this.mRenderResourceBuffer.bindGroupList[lBindGroupIndex];

            // Extend group list length.
            if (lBindGroupIndex > lLocalHighestBindGroupListIndex) {
                lLocalHighestBindGroupListIndex = lBindGroupIndex;
            }

            // Use cached bind group or use new.
            if (lNewBindGroup !== lCurrentBindGroup) {
                // Set bind group buffer to cache current set bind groups.
                this.mRenderResourceBuffer.bindGroupList[lBindGroupIndex] = lNewBindGroup;

                // Set bind group to gpu.
                this.mEncoder.setBindGroup(lBindGroupIndex, lNewBindGroup.native);
            }
        }

        // Cache for bind group length of this instruction.
        let lLocalHighestVertexParameterListIndex: number = -1;

        // Add vertex attribute buffer.
        const lBufferNames: Array<string> = pPipeline.module.vertexParameter.bufferNames;
        for (let lBufferIndex: number = 0; lBufferIndex < lBufferNames.length; lBufferIndex++) {
            // Read buffer information.
            const lAttributeBufferName: string = lBufferNames[lBufferIndex];
            const lNewAttributeBuffer: GpuBuffer = pParameter.get(lAttributeBufferName);

            // Extend group list length.
            if (lBufferIndex > lLocalHighestVertexParameterListIndex) {
                lLocalHighestVertexParameterListIndex = lBufferIndex;
            }

            // Use cached vertex buffer or use new.
            if (lNewAttributeBuffer !== this.mRenderResourceBuffer.vertexBuffer.get(lBufferIndex)) {
                this.mRenderResourceBuffer.vertexBuffer.set(lBufferIndex, lNewAttributeBuffer);
                this.mEncoder.setVertexBuffer(lBufferIndex, lNewAttributeBuffer.native);
            }
        }

        // Use cached pipeline or use new.
        if (pPipeline !== this.mRenderResourceBuffer.pipeline) {
            this.mRenderResourceBuffer.pipeline = pPipeline;

            // Generate and set new pipeline.
            this.mEncoder.setPipeline(lNativePipeline);

            // Only clear bind buffer when a new pipeline is set.
            // Same pipelines must have set the same bind group layouts.
            if (this.mRenderResourceBuffer.highestBindGroupListIndex > lLocalHighestBindGroupListIndex) {
                for (let lBindGroupIndex: number = (lLocalHighestBindGroupListIndex + 1); lBindGroupIndex < (this.mRenderResourceBuffer.highestBindGroupListIndex + 1); lBindGroupIndex++) {
                    this.mEncoder.setBindGroup(lBindGroupIndex, null);
                }
            }

            // Update global bind group list length.
            this.mRenderResourceBuffer.highestBindGroupListIndex = lLocalHighestBindGroupListIndex;

            // Only clear vertex buffer when a new pipeline is set.
            // Same pipeline must have the same vertex parameter layout.
            if (this.mRenderResourceBuffer.highestVertexParameterIndex > lLocalHighestVertexParameterListIndex) {
                for (let lVertexParameterBufferIndex: number = (lLocalHighestVertexParameterListIndex + 1); lVertexParameterBufferIndex < (this.mRenderResourceBuffer.highestVertexParameterIndex + 1); lVertexParameterBufferIndex++) {
                    this.mEncoder.setVertexBuffer(lVertexParameterBufferIndex, null);
                }
            }

            // Update global bind group list length.
            this.mRenderResourceBuffer.highestVertexParameterIndex = lLocalHighestVertexParameterListIndex;
        }

        // Draw indexed when parameters are indexable.
        if (pParameter.layout.indexable) {
            // Set indexbuffer. Dynamicly switch between 32 and 16 bit based on length.
            if (pParameter.indexBuffer!.format === Uint16Array) {
                this.mEncoder.setIndexBuffer(pParameter.indexBuffer!.buffer.native, 'uint16');
            } else {
                this.mEncoder.setIndexBuffer(pParameter.indexBuffer!.buffer.native, 'uint32');
            }

            // Create draw call.
            this.mEncoder.drawIndexed(pParameter.indexBuffer!.length, pInstanceCount);
        } else {
            // Create draw call.
            this.mEncoder.draw(pParameter.vertexCount, pInstanceCount);
        }

        // TODO: Indirect dispatch.
    }
}
type RenderPassContextUsedResource = {
    readonly parameter: Set<VertexParameter>;
    readonly indirectBuffer: Set<GpuBuffer>;
    readonly pipelines: Set<VertexFragmentPipeline>;
    readonly pipelineData: Set<PipelineData>;
};

type RenderPassContextRenderBuffer = {
    pipeline: VertexFragmentPipeline | null;

    // Vertex buffer.
    vertexBuffer: Dictionary<number, GpuBuffer>;
    highestVertexParameterIndex: number;

    bindGroupList: Array<BindGroup>;
    highestBindGroupListIndex: number;
};