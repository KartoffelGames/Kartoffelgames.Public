import { GpuDevice } from './gpu-device';
import { GpuObjectUpdateListener } from './gpu-native-object';
import { GpuObjectUpdateReason, UpdateReason } from './gpu-object-update-reason';

export abstract class GpuObject {
    private mAutoUpdate: boolean;
    private readonly mDevice: GpuDevice;
    private readonly mInvalidationReasons: GpuObjectUpdateReason;
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
     * Current invalidation reasons.
     */
    protected get invalidationReasons(): GpuObjectUpdateReason {
        return this.mInvalidationReasons;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu device.
     */
    public constructor(pDevice: GpuDevice) {
        // Save static settings.
        this.mDevice = pDevice;

        // Init default settings and config.
        this.mAutoUpdate = true;

        // Init lists.
        this.mUpdateListenerList = new Set<GpuObjectUpdateListener>();
        this.mInvalidationReasons = new GpuObjectUpdateReason();
    }

    /**
     * Add invalidation listener.
     * @param pListener - Listener.
     */
    public addInvalidationListener(pListener: GpuObjectUpdateListener): void {
        this.mUpdateListenerList.add(pListener);
    }

    /**
     * Invalidate native gpu object so it will be created again.
     */
    public invalidate(pReason: UpdateReason): void {
        // Add invalidation reason.
        this.mInvalidationReasons.add(pReason);

        // Call parent update listerner.
        for (const lInvalidationListener of this.mUpdateListenerList) {
            lInvalidationListener();
        }
    }

    /**
     * Add invalidation listener.
     * @param pListener - Listener.
     */
    public removeInvalidationListener(pListener: GpuObjectUpdateListener): void {
        this.mUpdateListenerList.delete(pListener);
    }


    /**
     * Trigger auto update.
     * Does nothing on disabled auto update.
     */
    protected triggerAutoUpdate(pReason: UpdateReason): void {
        if (this.mAutoUpdate) {
            this.invalidate(pReason);
        }
    }
}