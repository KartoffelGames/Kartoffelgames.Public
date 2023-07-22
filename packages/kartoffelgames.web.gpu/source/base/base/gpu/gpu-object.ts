import { Exception } from '@kartoffelgames/core.data';
import { GpuDependent } from './gpu-dependent';
import { GpuTypes } from './gpu-device';

export abstract class GpuObject<TGpuTypes extends GpuTypes, TNative> extends GpuDependent<TGpuTypes> {
    private mAutoUpdate: boolean;
    private mDestroyed: boolean;
    private mNativeObject: TNative | null;
    private readonly mUpdateListenerList: Set<GpuObjectUpdateListener>;
    private mUpdateRequested: boolean;

    /**
     * Enable or disable auto update.
     */
    public get autoUpdate(): boolean {
        return this.mAutoUpdate;
    } set autoUpdate(pValue: boolean) {
        this.mAutoUpdate = pValue;
    }

    /**
     * Get native gpu object.
     * Can be recreated.
     */
    public get native(): TNative {
        if (this.mDestroyed) {
            throw new Exception('Destoryed gpu objects cant be used again.', this);
        }

        if (!this.mUpdateRequested) {
            this.mNativeObject = this.generate();
            this.mUpdateRequested = false;
        }

        return this.nativeObject!;
    }

    /**
     * Inner native object.
     */
    protected get nativeObject(): TNative | null {
        return this.mNativeObject;
    } protected set nativeObject(pValue: TNative | null) {
        this.mNativeObject = pValue;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu device.
     */
    public constructor(pDevice: TGpuTypes['gpuDevice']) {
        super(pDevice);

        this.mNativeObject = null;
        this.mUpdateRequested = true;
        this.mAutoUpdate = true;
        this.mUpdateListenerList = new Set<GpuObjectUpdateListener>();
        this.mDestroyed = false;
    }

    /**
     * Add update listener.
     * @param pListener - Listener.
     */
    public addUpdateListener(pListener: GpuObjectUpdateListener): void {
        this.mUpdateListenerList.add(pListener);
    }

    /**
     * Destroy generated native object.
     */
    public destroy(): void {
        // Destroy old native object.
        if (this.mNativeObject) {
            this.destroyNative(this.mNativeObject);

            // Remove destroyed native.
            this.mNativeObject = null;
        }

        this.mDestroyed = true;
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
        this.mUpdateRequested = true;

        // Call parent update listerner.
        for (const lUpdateListener of this.mUpdateListenerList) {
            lUpdateListener();
        }
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

    /**
     * Destroy gpu object.
     */
    protected abstract destroyNative(_pNativeObject: TNative): void;

    /**
     * Generate native object.
     */
    protected abstract generate(): TNative;
}

export type GpuObjectUpdateListener = () => void;