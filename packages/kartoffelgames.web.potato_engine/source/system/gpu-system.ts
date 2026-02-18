import { GpuDevice, GpuFeature } from '@kartoffelgames/web-gpu';
import { GameSystem } from '../core/game-system.ts';

// TODO: Reading limits.

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
     */
    public constructor() {
        super();
        this.mGpu = null;
    }

    /**
     * Initialize the gpu system.
     */
    protected override async onCreate(): Promise<void> {
        this.mGpu = await GpuDevice.request('high-performance', {
            features: [
                { name: GpuFeature.TimestampQuery, required: true }
            ]
        });
    }

    /**
     * Start a new frame on the gpu device at the beginning of each frame to reset internal states and prepare for rendering.
     */
    protected override async onFrame():  Promise<void> {
        this.mGpu!.startNewFrame();
    }
}