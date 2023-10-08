import { GeneratorObjectKeys } from '../native_generator/base-generator-factory';
import { GpuDevice } from './gpu-device';
import { UpdateReason } from './gpu-object-update-reason';

export abstract class GpuObject<TGpuObjectKey extends GeneratorObjectKeys = 'none'> {
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
    public update(pUpdateReason: UpdateReason): void {
        // Invalidate before calling parent listener. Only when a generator exists.
        const lGenerator = this.device.generator.request<TGpuObjectKey>(<any>this);
        if (lGenerator) {
            lGenerator.invalidate(pUpdateReason);
        }

        // Call parent update listerner.
        for (const lUpdateListener of this.mUpdateListenerList) {
            lUpdateListener();
        }
    }

    /**
     * Trigger auto update.
     * Does nothing on disabled auto update.
     */
    protected triggerAutoUpdate(pUpdateReason: UpdateReason): void {
        if (this.mAutoUpdate) {
            this.update(pUpdateReason);
        }
    }
}

export type GpuObjectUpdateListener = () => void;