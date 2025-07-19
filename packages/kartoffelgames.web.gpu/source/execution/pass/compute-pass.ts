import { GpuBuffer } from '../../buffer/gpu-buffer.ts';
import { BufferUsage } from '../../constant/buffer-usage.enum.ts';
import { GpuFeature } from '../../constant/gpu-feature.enum.ts';
import { GpuDevice } from '../../device/gpu-device.ts';
import { GpuObject } from '../../gpu_object/gpu-object.ts';
import { GpuExecutionContext } from '../gpu-execution.ts';
import { ComputePassContext } from './compute-pass-context.ts';

/**
 * Gpu compute pass.
 */
export class ComputePass extends GpuObject {
    private readonly mExecutionFunction: ComputePassExecutionFunction;
    private readonly mQueries: ComputePassQuery;

    /**
     * Constructor.
     * @param pDevice - Device reference.
     */
    public constructor(pDevice: GpuDevice, pExecution: ComputePassExecutionFunction) {
        super(pDevice);

        this.mExecutionFunction = pExecution;
        this.mQueries = {};
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

        // Direct execute function.
        this.mExecutionFunction(new ComputePassContext(lComputePassEncoder));

        // End compute pass.
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
}

export type ComputePassExecutionFunction = (pContext: ComputePassContext) => void;

type ComputePassQuery = {
    timestamp?: {
        query: GPURenderPassTimestampWrites;
        buffer: GpuBuffer;
        resolver: null | Promise<[bigint, bigint]>;
    };
};