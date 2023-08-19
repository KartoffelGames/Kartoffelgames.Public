import { GpuDevice } from './gpu-device';

export abstract class GpuObject {
    private mAutoUpdate: boolean;
    private readonly mDevice: GpuDevice;
    private readonly mUpdateListenerList: Set<GpuObjectUpdateListener>;

    /**
     * Enable or disable auto update.
     */
    public get autoUpdate(): boolean {
        return this.mAutoUpdate;
    } set autoUpdate(pValue: boolean) {
        this.mAutoUpdate = pValue;
    }

    /**
     * Gpu Device.
     */
    protected get device(): GpuDevice {
        return this.mDevice;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu device.
     */
    public constructor(pDevice: GpuDevice) {
        this.mAutoUpdate = true;
        this.mDevice = pDevice;
        this.mUpdateListenerList = new Set<GpuObjectUpdateListener>();
    }

    /**
     * Add update listener.
     * @param pListener - Listener.
     */
    public addUpdateListener(pListener: GpuObjectUpdateListener): void {
        this.mUpdateListenerList.add(pListener);
    }

    /**
     * Add update listener.
     * @param pListener - Listener.
     */
    public removeUpdateListener(pListener: GpuObjectUpdateListener): void {
        this.mUpdateListenerList.delete(pListener);
    }

    /**
    * Update gpu object.
    */
    public update(): void {
        // Call parent update listerner.
        for (const lUpdateListener of this.mUpdateListenerList) {
            lUpdateListener();
        }

        this.device.generator.invalidate(this);
    }

    /**
     * Trigger auto update.
     * Does nothing on disabled auto update.
     */
    protected triggerAutoUpdate(): void {
        if (this.mAutoUpdate) {
            this.update();
        }
    }
}

export type GpuObjectUpdateListener = () => void;