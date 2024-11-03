import { GpuBuffer } from '../../buffer/gpu-buffer';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { GpuFeature } from '../../constant/gpu-feature.enum';
import { GpuDevice } from '../../device/gpu-device';
import { GpuObject } from '../../gpu_object/gpu-object';
import { GpuResourceObjectInvalidationType } from '../../gpu_object/gpu-resource-object';
import { PipelineData, PipelineDataInvalidationType } from '../../pipeline/pipeline_data/pipeline-data';
import { RenderTargets } from '../../pipeline/render_targets/render-targets';
import { VertexFragmentPipeline, VertexFragmentPipelineInvalidationType } from '../../pipeline/vertex_fragment_pipeline/vertex-fragment-pipeline';
import { VertexParameter, VertexParameterInvalidationType } from '../../pipeline/vertex_parameter/vertex-parameter';
import { GpuExecutionContext } from '../gpu-execution';
import { RenderPassContext } from './render-pass-context';

/**
 * Gpu render pass. Has the ability to bundle render calls for static lists.
 */
export class RenderPass extends GpuObject {
    private readonly mBundleConfig: RenderBundleConfig;
    private readonly mExecutionFunction: RenderPassExecutionFunction;
    private readonly mQueries: RenderPassQuery;
    private readonly mRenderTargets: RenderTargets;

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pRenderTargets - Render targets.
     * @param pStaticBundle - Bundle is static and does not update very often.
     */
    public constructor(pDevice: GpuDevice, pRenderTargets: RenderTargets, pStaticBundle: boolean, pExecution: RenderPassExecutionFunction) {
        super(pDevice);

        // Set config.
        this.mExecutionFunction = pExecution;
        this.mQueries = {};
        this.mRenderTargets = pRenderTargets;
        this.mBundleConfig = {
            enabled: pStaticBundle,
            bundle: null,
            descriptor: null,
            usedResources: {
                parameter: new Set<VertexParameter>(),
                indirectBuffer: new Set<GpuBuffer>(),
                pipelines: new Set<VertexFragmentPipeline>(),
                pipelineData: new Set<PipelineData>(),
            },
            resourceInvalidator: () => {
                // Only invalidate bundle on resource changes.
                this.mBundleConfig.bundle = null;
            }
        };

        // RenderTargets cant change texture formats, so the bundle descriptor does not need to be rebuild.
        // When textures are resized, the new render descriptor with updated views gets applied automaticly on execute.
    }

    /**
     * Execute steps in a row.
     * 
     * @param pExecutor - Executor context.
     */
    public execute(pExecutionContext: GpuExecutionContext): void {
        // Read render pass descriptor and inject timestamp query when it is setup.
        const lRenderPassDescriptor: GPURenderPassDescriptor = this.mRenderTargets.native;
        if (this.mQueries.timestamp) {
            lRenderPassDescriptor.timestampWrites = this.mQueries.timestamp.query;
        }

        // Pass descriptor is set, when the pipeline is set.
        const lRenderPassEncoder: GPURenderPassEncoder = pExecutionContext.commandEncoder.beginRenderPass(lRenderPassDescriptor);

        // Execute cached or execute direct based on static or variable bundles.
        if (this.mBundleConfig.enabled) {
            this.cachedExecute(lRenderPassEncoder);
        } else {
            // Directly execute nothing gets cached.
            this.mExecutionFunction(new RenderPassContext(lRenderPassEncoder, this.mRenderTargets, false));
        }

        // End render queue.
        lRenderPassEncoder.end();

        // Resolve query.
        if (this.mQueries.timestamp) {
            pExecutionContext.commandEncoder.resolveQuerySet(this.mQueries.timestamp.query.querySet, 0, 2, this.mQueries.timestamp.buffer.native, 0);
        }

        // Execute optional resolve targets.
        this.resolveCanvasTargets(pExecutionContext);
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
        if (!this.mBundleConfig.descriptor) {
            // Generate GPURenderBundleEncoderDescriptor from GPURenderPassDescriptor.
            const lRenderBundleEncoderDescriptor: GPURenderBundleEncoderDescriptor = {
                colorFormats: this.mRenderTargets.colorTargetNames.map<GPUTextureFormat>((pColorTargetName) => {
                    return this.mRenderTargets.colorTarget(pColorTargetName).layout.format as GPUTextureFormat;
                }),

                // Render target multisample level.
                sampleCount: this.mRenderTargets.multisampled ? 4 : 1,

                // Enable depth or stencil write.
                depthReadOnly: false,
                stencilReadOnly: false
            };

            // Optional depth stencil.
            if (this.mRenderTargets.hasDepth || this.mRenderTargets.hasStencil) {
                lRenderBundleEncoderDescriptor.depthStencilFormat = this.mRenderTargets.depthStencilTarget().layout.format as GPUTextureFormat;
            }

            // Save descriptor.
            this.mBundleConfig.descriptor = lRenderBundleEncoderDescriptor;
        }

        // Generate new bundle when not already cached or render target got changed.
        if (!this.mBundleConfig.bundle) {
            // Clear old invalidation listener on old bundles.
            for (const lParameter of this.mBundleConfig.usedResources.parameter) {
                lParameter.removeInvalidationListener(this.mBundleConfig.resourceInvalidator);
            }
            for (const lBuffer of this.mBundleConfig.usedResources.indirectBuffer) {
                lBuffer.removeInvalidationListener(this.mBundleConfig.resourceInvalidator);
            }
            for (const lBindgroup of this.mBundleConfig.usedResources.pipelineData) {
                lBindgroup.removeInvalidationListener(this.mBundleConfig.resourceInvalidator);
            }
            for (const lPipeline of this.mBundleConfig.usedResources.pipelines) {
                lPipeline.removeInvalidationListener(this.mBundleConfig.resourceInvalidator);
            }

            // Clear used resources.
            this.mBundleConfig.usedResources.indirectBuffer.clear();
            this.mBundleConfig.usedResources.pipelineData.clear();
            this.mBundleConfig.usedResources.pipelines.clear();

            // Create render bundle.
            const lRenderBundleEncoder: GPURenderBundleEncoder = this.device.gpu.createRenderBundleEncoder(this.mBundleConfig.descriptor);

            // Create context.
            const lRenderPassContext: RenderPassContext = new RenderPassContext(lRenderBundleEncoder, this.mRenderTargets, true);

            // Fill render queue.
            this.mExecutionFunction(lRenderPassContext);

            // Save render bundle.
            this.mBundleConfig.bundle = lRenderBundleEncoder.finish();

            // Save and track used resources.
            for (const lParameter of this.mBundleConfig.usedResources.parameter) {
                lParameter.addInvalidationListener(this.mBundleConfig.resourceInvalidator, VertexParameterInvalidationType.Data);
            }
            for (const lBuffer of lRenderPassContext.usedResources.indirectBuffer) {
                this.mBundleConfig.usedResources.indirectBuffer.add(lBuffer);
                lBuffer.addInvalidationListener(this.mBundleConfig.resourceInvalidator, GpuResourceObjectInvalidationType.ResourceRebuild);
            }
            for (const lBindgroup of lRenderPassContext.usedResources.pipelineData) {
                this.mBundleConfig.usedResources.pipelineData.add(lBindgroup);
                lBindgroup.addInvalidationListener(this.mBundleConfig.resourceInvalidator, PipelineDataInvalidationType.Data);
            }
            for (const lPipeline of lRenderPassContext.usedResources.pipelines) {
                this.mBundleConfig.usedResources.pipelines.add(lPipeline);
                lPipeline.addInvalidationListener(this.mBundleConfig.resourceInvalidator, VertexFragmentPipelineInvalidationType.NativeRebuild);
            }
        }

        // Add cached render bundle.
        pRenderPassEncoder.executeBundles([this.mBundleConfig.bundle]);
    }

    /**
     * Resolve gpu textures into canvas textures.
     * 
     * @param pExecutionContext - Executor context.
     */
    private resolveCanvasTargets(pExecutionContext: GpuExecutionContext): void {
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
            pExecutionContext.commandEncoder.beginRenderPass({
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

                pExecutionContext.commandEncoder.copyTextureToTexture(lSource, lDestination, lCopySize);
            }
        }
    }
}

export type RenderPassExecutionFunction = (pContext: RenderPassContext) => void;

type RenderPassQuery = {
    timestamp?: {
        query: GPURenderPassTimestampWrites;
        buffer: GpuBuffer;
        resolver: null | Promise<[bigint, bigint]>;
    };
};

type RenderBundleConfig = {
    enabled: boolean;
    bundle: GPURenderBundle | null;
    descriptor: GPURenderBundleEncoderDescriptor | null;
    usedResources: {
        parameter: Set<VertexParameter>;
        indirectBuffer: Set<GpuBuffer>;
        pipelines: Set<VertexFragmentPipeline>;
        pipelineData: Set<PipelineData>;
    };
    resourceInvalidator: () => void;
};