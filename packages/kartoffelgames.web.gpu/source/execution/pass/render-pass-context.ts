import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuBuffer } from '../../buffer/gpu-buffer';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { PipelineData, PipelineDataGroup } from '../../pipeline/pipeline_data/pipeline-data';
import { RenderTargets } from '../../pipeline/render_targets/render-targets';
import { VertexFragmentPipeline } from '../../pipeline/vertex_fragment_pipeline/vertex-fragment-pipeline';
import { VertexParameter } from '../../pipeline/vertex_parameter/vertex-parameter';

/**
 * Context for a render pass.
 * Used to execute draw calles.
 */
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
            pipelineDataGroupList: new Array<PipelineDataGroup>(),
            highestBindGroupListIndex: -1
        };
    }

    /**
     * Draw direct with set parameter.
     * 
     * @param pPipeline - Pipeline.
     * @param pParameter - Vertex parameter.
     * @param pPipelineData - Pipline bind data groups.
     * @param pInstanceCount - Instance count.
     * @param pInstanceOffset - Instance offset. 
     */
    public drawDirect(pPipeline: VertexFragmentPipeline, pParameter: VertexParameter, pPipelineData: PipelineData, pInstanceCount: number = 1, pInstanceOffset: number = 0): void {
        // Validate same render targets.
        if (this.mRenderTargets !== pPipeline.renderTargets) {
            throw new Exception('Pipelines render targets not valid for this render pass.', this);
        }

        // Validate parameter.
        if (pParameter.layout !== pPipeline.module.vertexParameter) {
            throw new Exception('Vertex parameter not valid for set pipeline.', this);
        }

        // Validate pipeline data matches pipeline layout of pipeline.
        if (pPipeline.layout !== pPipelineData.layout) {
            throw new Exception('Pipline data not valid for set pipeline.', this);
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

        // Execute draw.
        if (this.setupEncoderData(pPipeline, pParameter, pPipelineData)) {
            this.executeDirectDraw(pParameter, pInstanceCount, pInstanceOffset);
        }
    }

    /**
     * Draw indirect with parameters set in buffer.
     * 
     * @param pPipeline - Pipeline.
     * @param pParameter - Vertex parameter.
     * @param pPipelineData - Pipline bind data groups.
     * @param pIndirectBuffer - Buffer with indirect parameter data.
     */
    public drawIndirect(pPipeline: VertexFragmentPipeline, pParameter: VertexParameter, pPipelineData: PipelineData, pIndirectBuffer: GpuBuffer): void {
        // Extend usage.
        pIndirectBuffer.extendUsage(BufferUsage.Indirect);

        // Validate same render targets.
        if (this.mRenderTargets !== pPipeline.renderTargets) {
            throw new Exception('Pipelines render targets not valid for this render pass.', this);
        }

        // Validate parameter.
        if (pParameter.layout !== pPipeline.module.vertexParameter) {
            throw new Exception('Vertex parameter not valid for set pipeline.', this);
        }

        // Validate pipeline data matches pipeline layout of pipeline.
        if (pPipeline.layout !== pPipelineData.layout) {
            throw new Exception('Pipline data not valid for set pipeline.', this);
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

        // Execute draw.
        if (this.setupEncoderData(pPipeline, pParameter, pPipelineData)) {
            this.executeIndirectDraw(pParameter, pIndirectBuffer);
        }
    }

    /**
     * Set pipeline and any bind and vertex data.
     * 
     * @param pPipeline - Pipeline.
     * @param pParameter  - Pipeline vertex parameter.
     * @param pPipelineData - Pipeline binding data.
     * 
     * @returns true when everything has been successfully set. 
     */
    public setupEncoderData(pPipeline: VertexFragmentPipeline, pParameter: VertexParameter, pPipelineData: PipelineData): boolean {
        // Skip pipelines that are currently loading.
        const lNativePipeline: GPURenderPipeline | null = pPipeline.native;
        if (lNativePipeline === null) {
            return false;
        }

        // Cache for bind group length of this instruction.
        let lLocalHighestBindGroupListIndex: number = -1;

        // Add bind groups.
        const lPipelineDataGroupList: Array<PipelineDataGroup> = pPipelineData.data;
        for (let lBindGroupIndex: number = 0; lBindGroupIndex < lPipelineDataGroupList.length; lBindGroupIndex++) {
            const lPipelineDataGroup: PipelineDataGroup | undefined = lPipelineDataGroupList[lBindGroupIndex];
            const lCurrentPipelineDataGroup: PipelineDataGroup | null = this.mRenderResourceBuffer.pipelineDataGroupList[lBindGroupIndex];

            // Extend group list length.
            if (lBindGroupIndex > lLocalHighestBindGroupListIndex) {
                lLocalHighestBindGroupListIndex = lBindGroupIndex;
            }

            // Use cached bind group or use new.
            if (!lCurrentPipelineDataGroup || lPipelineDataGroup.bindGroup !== lCurrentPipelineDataGroup.bindGroup || lPipelineDataGroup.offsetId !== lCurrentPipelineDataGroup.offsetId) {
                // Set bind group buffer to cache current set bind groups.
                this.mRenderResourceBuffer.pipelineDataGroupList[lBindGroupIndex] = lPipelineDataGroup;

                // Set bind group to gpu.
                if (lPipelineDataGroup.bindGroup.layout.hasDynamicOffset) {
                    this.mEncoder.setBindGroup(lBindGroupIndex, lPipelineDataGroup.bindGroup.native, lPipelineDataGroup.offsets);
                } else {
                    this.mEncoder.setBindGroup(lBindGroupIndex, lPipelineDataGroup.bindGroup.native);
                }
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

        return true;
    }

    /**
     * Execute direct draw call.
     * 
     * @param pParameter - Vertex parameter.
     * @param pInstanceCount - Index count.
     * @param pInstanceOffset - Instance offset. 
     */
    private executeDirectDraw(pParameter: VertexParameter, pInstanceCount: number, pInstanceOffset: number): void {
        // Draw indexed when parameters are indexable.
        if (pParameter.layout.indexable) {
            // Set indexbuffer. Dynamicly switch between 32 and 16 bit based on length.
            if (pParameter.indexBuffer!.format === Uint16Array) {
                this.mEncoder.setIndexBuffer(pParameter.indexBuffer!.buffer.native, 'uint16');
            } else {
                this.mEncoder.setIndexBuffer(pParameter.indexBuffer!.buffer.native, 'uint32');
            }

            // Create draw call.
            this.mEncoder.drawIndexed(pParameter.indexBuffer!.length, pInstanceCount, 0, 0, pInstanceOffset);
        } else {
            // Create draw call.
            this.mEncoder.draw(pParameter.vertexCount, pInstanceCount, 0, pInstanceOffset);
        }
    }

    /**
     * Execute a indirect draw call.
     * If indexed or normal indirect calls are used is defined by the buffer length.
     * 
     * @param pParameter - Vertex parameter.
     * @param pBuffer - Indirect buffer.
     */
    private executeIndirectDraw(pParameter: VertexParameter, pBuffer: GpuBuffer): void {
        // 4 Byte * 5 => 20 Byte => Indexed draw 
        // 4 Byte * 4 => 16 Byte => Normal draw 
        if (pBuffer.size === 20) {
            // Buffer does not match when parameters are not indexable.
            if (!pParameter.layout.indexable) {
                throw new Exception('Indirect indexed draw call failed, because parameter are not indexable', this);
            }

            // Set indexbuffer. Dynamicly switch between 32 and 16 bit based on length.
            if (pParameter.indexBuffer!.format === Uint16Array) {
                this.mEncoder.setIndexBuffer(pParameter.indexBuffer!.buffer.native, 'uint16');
            } else {
                this.mEncoder.setIndexBuffer(pParameter.indexBuffer!.buffer.native, 'uint32');
            }

            // Start indirect indexed call.
            this.mEncoder.drawIndexedIndirect(pBuffer.native, 0);
        } else if (pBuffer.size === 16) {
            // Start indirect call.
            this.mEncoder.drawIndirect(pBuffer.native, 0);
        } else {
            throw new Exception('Indirect draw calls can only be done with 20 or 16 byte long buffers', this);
        }
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

    pipelineDataGroupList: Array<PipelineDataGroup>;
    highestBindGroupListIndex: number;
};