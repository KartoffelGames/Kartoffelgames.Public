import { Dictionary, Exception } from '@kartoffelgames/core';
import { BindGroup, BindGroupInvalidationType } from '../../binding/bind-group';
import { PipelineLayout } from '../../binding/pipeline-layout';
import { GpuBuffer } from '../../buffer/gpu-buffer';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/object/gpu-object';
import { VertexParameter, VertexParameterInvalidationType } from '../../pipeline/parameter/vertex-parameter';
import { RenderTargets, RenderTargetsInvalidationType } from '../../pipeline/target/render-targets';
import { VertexFragmentPipeline, VertexFragmentPipelineInvalidationType } from '../../pipeline/vertex-fragment-pipeline';
import { GpuExecution } from '../gpu-execution';
import { GpuFeature } from '../../gpu/capabilities/gpu-feature.enum';
import { BufferUsage } from '../../constant/buffer-usage.enum';

export class RenderPass extends GpuObject {
    private readonly mBundleConfig: RenderBundleConfig;
    private readonly mInstructionList: Array<RenderInstruction>;
    private readonly mQueries: RenderPassQuery;
    private readonly mRenderTargets: RenderTargets;

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pRenderTargets - Render targets.
     * @param pStaticBundle - Bundle is static and does not update very often.
     */
    public constructor(pDevice: GpuDevice, pRenderTargets: RenderTargets, pStaticBundle: boolean) {
        super(pDevice);

        this.mQueries = {};
        this.mInstructionList = new Array<RenderInstruction>();
        this.mRenderTargets = pRenderTargets;
        this.mBundleConfig = {
            enabled: pStaticBundle,
            writeDepth: false,
            writeStencil: false,
            bundle: null
        };

        // Update bundle when render target has changed.
        pRenderTargets.addInvalidationListener(() => {
            this.mBundleConfig.bundle = null;
        }, RenderTargetsInvalidationType.NativeRebuild);
    }

    /**
     * Add instruction step.
     * 
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
            // Get and validate existence of set bind group.
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

        // Update bundle write depth config.
        if (pPipeline.writeDepth) {
            this.mBundleConfig.writeDepth = true;
        }

        // Clear bundle when adding new steps.
        this.mBundleConfig.bundle = null;

        // Clear bundle when anything has changes.
        pPipeline.addInvalidationListener(() => {
            this.mBundleConfig.bundle = null;
        }, VertexFragmentPipelineInvalidationType.NativeRebuild, VertexFragmentPipelineInvalidationType.NativeLoaded);
        pParameter.addInvalidationListener(() => {
            this.mBundleConfig.bundle = null;
        }, VertexParameterInvalidationType.Data);

        // Clear bundle on any bindgroup change.
        for (const lGroupName of lPipelineLayout.groups) {
            lBindGroups.get(lGroupName)!.addInvalidationListener(() => {
                this.mBundleConfig.bundle = null;
            }, BindGroupInvalidationType.NativeRebuild);
        }
    }

    /**
     * Execute steps in a row.
     * 
     * @param pExecutor - Executor context.
     */
    public execute(pExecution: GpuExecution): void {
        // Read render pass descriptor and inject timestamp query when it is setup.
        const lRenderPassDescriptor: GPURenderPassDescriptor = this.mRenderTargets.native;
        if (this.mQueries.timestamp) {
            lRenderPassDescriptor.timestampWrites = this.mQueries.timestamp.query;
        }

        // Pass descriptor is set, when the pipeline is set.
        const lRenderPassEncoder: GPURenderPassEncoder = pExecution.encoder.beginRenderPass(lRenderPassDescriptor);

        // Execute cached or execute direct based on static or variable bundles.
        if (this.mBundleConfig.enabled) {
            this.cachedExecute(lRenderPassEncoder);
        } else {
            this.directExecute(lRenderPassEncoder);
        }

        // End render queue.
        lRenderPassEncoder.end();

        // Resolve query.
        if (this.mQueries.timestamp) {
            pExecution.encoder.resolveQuerySet(this.mQueries.timestamp.query.querySet, 0, 2, this.mQueries.timestamp.buffer.native, 0);
        }

        // Execute optional resolve targets.
        this.resolveCanvasTargets(pExecution);
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
     * Execute render pass as cached bundle.
     * 
     * @param pExecutor - Executor context.
     */
    private cachedExecute(pRenderPassEncoder: GPURenderPassEncoder): void {
        // Generate new bundle when not already cached or render target got changed.
        if (!this.mBundleConfig.bundle) {
            // Generate GPURenderBundleEncoderDescriptor from GPURenderPassDescriptor.
            const lRenderBundleEncoderDescriptor: GPURenderBundleEncoderDescriptor = {
                colorFormats: this.mRenderTargets.colorTargetNames.map<GPUTextureFormat>((pColorTargetName) => {
                    return this.mRenderTargets.colorTarget(pColorTargetName).layout.format as GPUTextureFormat;
                }),

                // Render target multisample level.
                sampleCount: this.mRenderTargets.multisampled ? 4 : 1,

                // Enable depth or stencil write.
                depthReadOnly: !this.mBundleConfig.writeDepth,
                stencilReadOnly: !this.mBundleConfig.writeStencil
            };

            // Optional depth stencil.
            if (this.mRenderTargets.hasDepth || this.mRenderTargets.hasStencil) {
                lRenderBundleEncoderDescriptor.depthStencilFormat = this.mRenderTargets.depthStencilTarget().layout.format as GPUTextureFormat;
            }

            // Create render bundle.
            const lRenderBundleEncoder: GPURenderBundleEncoder = this.device.gpu.createRenderBundleEncoder(lRenderBundleEncoderDescriptor);

            // Fill render queue.
            this.setRenderQueue(lRenderBundleEncoder);

            // Save render bundle.
            this.mBundleConfig.bundle = {
                bundle: lRenderBundleEncoder.finish(),
                descriptor: this.mRenderTargets.native
            };
        }

        // Add cached render bundle.
        pRenderPassEncoder.executeBundles([this.mBundleConfig.bundle?.bundle]);
    }

    /**
     * Execute steps in a row without caching.
     * 
     * @param pExecutor - Executor context.
     */
    private directExecute(pRenderPassEncoder: GPURenderPassEncoder): void {
        // Fill render queue.
        this.setRenderQueue(pRenderPassEncoder);
    }

    /**
     * Resolve gpu textures into canvas textures.
     * 
     * @param pExecution - Executor context.
     */
    private resolveCanvasTargets(pExecution: GpuExecution): void {
        // Skip when nothing to be resolved.
        if (this.mRenderTargets.resolveCanvasList.length === 0) {
            return;
        }

        if (this.mRenderTargets.multisampled) {
            // Generate resolve target descriptor with operation that does nothing.
            const lColorTargetList: Array<GPURenderPassColorAttachment> = this.mRenderTargets.resolveCanvasList.map((pResolveTexture) => {
                return {
                    view: pResolveTexture.source.native,
                    resolveTarget: pResolveTexture.canvas.native.createView(),
                    loadOp: 'load',
                    storeOp: 'store'
                };
            });

            // Begin and end render pass. Render pass does only resolve targets.
            pExecution.encoder.beginRenderPass({
                colorAttachments: lColorTargetList
            }).end();
        } else {
            // Copy targets into canvas.
            for (const lResolveTexture of this.mRenderTargets.resolveCanvasList) {
                // Create External source.
                const lSource: GPUImageCopyTexture = {
                    texture: lResolveTexture.source.texture.native,
                    aspect: 'all',
                    mipLevel: lResolveTexture.source.mipLevelStart,
                };

                // Generate native texture.
                const lDestination: GPUImageCopyTexture = {
                    texture: lResolveTexture.canvas.native,
                    aspect: 'all',
                    mipLevel: 0,
                };

                // Clamp copy sizes to lowest.
                const lCopySize: GPUExtent3DStrict = {
                    width: this.mRenderTargets.width,
                    height: this.mRenderTargets.height,
                    depthOrArrayLayers: lResolveTexture.source.arrayLayerStart + 1
                };

                pExecution.encoder.copyTextureToTexture(lSource, lDestination, lCopySize);
            }
        }
    }

    /**
     * Fill encoder with each render step.
     * 
     * @param pEncoder - Render encoder.
     */
    private setRenderQueue(pEncoder: GPURenderPassEncoder | GPURenderBundleEncoder): void {
        // Instruction cache.
        let lPipeline: VertexFragmentPipeline | null = null;

        // Buffer for current set vertex buffer.
        const lVertexBufferList: Dictionary<number, GpuBuffer> = new Dictionary<number, GpuBuffer>();
        let lHighestVertexParameterListIndex: number = -1;

        // Buffer for current set bind groups.
        const lBindGroupList: Array<BindGroup> = new Array<BindGroup>();
        let lHighestBindGroupListIndex: number = -1;

        // Execute instructions.
        for (const lInstruction of this.mInstructionList) {
            // Skip pipelines that are currently loading.
            const lNativePipeline: GPURenderPipeline | null = lInstruction.pipeline.native;
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
                    pEncoder.setBindGroup(lBindGroupIndex, lNewBindGroup.native);
                }
            }

            // Cache for bind group length of this instruction.
            let lLocalHighestVertexParameterListIndex: number = -1;

            // Add vertex attribute buffer.
            const lBufferNames: Array<string> = lInstruction.pipeline.module.vertexParameter.bufferNames;
            for (let lBufferIndex: number = 0; lBufferIndex < lBufferNames.length; lBufferIndex++) {
                // Read buffer information.
                const lAttributeBufferName: string = lBufferNames[lBufferIndex];
                const lNewAttributeBuffer: GpuBuffer = lInstruction.parameter.get(lAttributeBufferName);

                // Extend group list length.
                if (lBufferIndex > lLocalHighestVertexParameterListIndex) {
                    lLocalHighestVertexParameterListIndex = lBufferIndex;
                }

                // Use cached vertex buffer or use new.
                if (lNewAttributeBuffer !== lVertexBufferList.get(lBufferIndex)) {
                    lVertexBufferList.set(lBufferIndex, lNewAttributeBuffer);
                    pEncoder.setVertexBuffer(lBufferIndex, lNewAttributeBuffer.native);
                }
            }

            // Use cached pipeline or use new.
            if (lInstruction.pipeline !== lPipeline) {
                lPipeline = lInstruction.pipeline;

                // Generate and set new pipeline.
                pEncoder.setPipeline(lNativePipeline);

                // Only clear bind buffer when a new pipeline is set.
                // Same pipelines must have set the same bind group layouts.
                if (lHighestBindGroupListIndex > lLocalHighestBindGroupListIndex) {
                    for (let lBindGroupIndex: number = (lLocalHighestBindGroupListIndex + 1); lBindGroupIndex < (lHighestBindGroupListIndex + 1); lBindGroupIndex++) {
                        pEncoder.setBindGroup(lBindGroupIndex, null);
                    }
                }

                // Update global bind group list length.
                lHighestBindGroupListIndex = lLocalHighestBindGroupListIndex;

                // Only clear vertex buffer when a new pipeline is set.
                // Same pipeline must have the same vertex parameter layout.
                if (lHighestVertexParameterListIndex > lLocalHighestVertexParameterListIndex) {
                    for (let lVertexParameterBufferIndex: number = (lLocalHighestVertexParameterListIndex + 1); lVertexParameterBufferIndex < (lHighestVertexParameterListIndex + 1); lVertexParameterBufferIndex++) {
                        pEncoder.setVertexBuffer(lVertexParameterBufferIndex, null);
                    }
                }

                // Update global bind group list length.
                lHighestVertexParameterListIndex = lLocalHighestVertexParameterListIndex;
            }

            // Draw indexed when parameters are indexable.
            if (lInstruction.parameter.layout.indexable) {
                // Set indexbuffer. Dynamicly switch between 32 and 16 bit based on length.
                if (lInstruction.parameter.indexBuffer!.format === Uint16Array) {
                    pEncoder.setIndexBuffer(lInstruction.parameter.indexBuffer!.buffer.native, 'uint16');
                } else {
                    pEncoder.setIndexBuffer(lInstruction.parameter.indexBuffer!.buffer.native, 'uint32');
                }

                // Create draw call.
                pEncoder.drawIndexed(lInstruction.parameter.indexBuffer!.length, lInstruction.instanceCount);
            } else {
                // Create draw call.
                pEncoder.draw(lInstruction.parameter.vertexCount, lInstruction.instanceCount);
            }

            // TODO: Indirect dispatch.
        }
    }
}

type RenderPassQuery = {
    timestamp?: {
        query: GPURenderPassTimestampWrites;
        buffer: GpuBuffer;
        resolver: null | Promise<[bigint, bigint]>;
    };
};

type RenderInstruction = {
    pipeline: VertexFragmentPipeline;
    parameter: VertexParameter;
    instanceCount: number;
    bindData: Array<BindGroup>;
};

type RenderBundleConfig = {
    enabled: boolean;
    writeStencil: boolean;
    writeDepth: boolean;
    bundle: {
        bundle: GPURenderBundle;
        descriptor: GPURenderPassDescriptor;
    } | null;
};