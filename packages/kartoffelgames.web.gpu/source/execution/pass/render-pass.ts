import { GpuBuffer } from '../../buffer/gpu-buffer.ts';
import { BufferUsage } from '../../constant/buffer-usage.enum.ts';
import { GpuFeature } from '../../constant/gpu-feature.enum.ts';
import type { GpuDevice } from '../../device/gpu-device.ts';
import { GpuObject } from '../../gpu_object/gpu-object.ts';
import type { RenderTargets } from '../../pipeline/render_targets/render-targets.ts';
import type { GpuExecutionContext } from '../gpu-execution-context.ts';
import { RenderPassContext } from './render-pass-context.ts';

/**
 * Gpu render pass. Has the ability to bundle render calls for static lists.
 */
export class RenderPass extends GpuObject {
    private readonly mExecutionContext: GpuExecutionContext;
    private readonly mQueries: RenderPassQuery;
    private readonly mRenderTargets: RenderTargets;

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pRenderTargets - Render targets.
     * @param pExecution - Execution function.
     */
    public constructor(pDevice: GpuDevice, pRenderTargets: RenderTargets, pExecutionContext: GpuExecutionContext) {
        super(pDevice);

        // Set config.
        this.mQueries = {};
        this.mRenderTargets = pRenderTargets;
        this.mExecutionContext = pExecutionContext;
    }

    /**
     * Execute steps in a row.
     * 
     * @param pExecutor - Executor context.
     * @param pExecution - Execution function.
     */
    public execute(pExecution: RenderPassExecutionFunction): void {
        // Read render pass descriptor and inject timestamp query when it is setup.
        const lRenderPassDescriptor: GPURenderPassDescriptor = this.mRenderTargets.native;
        if (this.mQueries.timestamp) {
            lRenderPassDescriptor.timestampWrites = this.mQueries.timestamp.query;
        }

        // Pass descriptor is set, when the pipeline is set.
        const lRenderPassEncoder: GPURenderPassEncoder = this.mExecutionContext.commandEncoder.beginRenderPass(lRenderPassDescriptor);

        // Directly execute nothing gets cached.
        pExecution(new RenderPassContext(lRenderPassEncoder, this.mRenderTargets, false));

        // End render queue.
        lRenderPassEncoder.end();

        // Resolve query.
        if (this.mQueries.timestamp) {
            this.mExecutionContext.commandEncoder.resolveQuerySet(this.mQueries.timestamp.query.querySet, 0, 2, this.mQueries.timestamp.buffer.native, 0);
        }

        // Clear query set.
        if (this.mQueries.timestamp) {
            this.mQueries.timestamp.query.querySet.destroy();
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
}

export type RenderPassExecutionFunction = (pContext: RenderPassContext) => void;

type RenderPassQuery = {
    timestamp?: {
        query: GPURenderPassTimestampWrites;
        buffer: GpuBuffer;
        resolver: null | Promise<[bigint, bigint]>;
    };
};