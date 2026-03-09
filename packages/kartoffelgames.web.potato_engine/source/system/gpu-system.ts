import { GpuDevice, GpuFeature, type GpuLimit } from '@kartoffelgames/web-gpu';
import type { GameEnvironment } from '../core/environment/game-environment.ts';
import { GameSystem } from '../core/game-system.ts';

/**
 * Gpu system that manages the GPU device, its features, and limits.
 */
export class GpuSystem extends GameSystem {
    private mGpu: GpuDevice | null;

    /**
     * Get the gpu device.
     */
    public get gpu(): GpuDevice {
        this.lockGate();
        return this.mGpu!;
    }

    /**
     * Constructor of the gpu system.
     * 
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super('Gpu', pEnvironment);
        this.mGpu = null;
    }

    /**
     * Get the gpu limits.
     * 
     * @param pLimit - The gpu limit to query.
     * 
     * @return The value of the queried gpu limit.
     */
    public gpuLimit(pLimit: GpuLimit): number {
        this.lockGate();

        return this.mGpu!.capabilities.getLimit(pLimit);
    }

    /**
     * Initialize the gpu system.
     */
    protected override async onCreate(): Promise<void> {
        type GpuLimitDefinition = {
            name: GpuLimit;
            value: number;
            required?: boolean;
        };

        // Always request full limits.
        const lLimits: Array<GpuLimitDefinition> = Object.entries(await GpuDevice.readDeviceLimits('high-performance')).map(([pLimitName, pLimitValue]) => {
            return {
                name: pLimitName as GpuLimit,
                value: pLimitValue,
                required: false
            };
        });

        // Request gpu device with required features and limits.
        this.mGpu = await GpuDevice.request('high-performance', {
            features: [
                { name: GpuFeature.TimestampQuery, required: true }
            ],
            limits: lLimits
        });
    }

    /**
     * Start a new frame on the gpu device at the beginning of each frame to reset internal states and prepare for rendering.
     */
    protected override async onFrame(): Promise<void> {
        this.mGpu!.processTick();
    }
}