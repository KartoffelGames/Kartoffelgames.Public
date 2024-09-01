import { GpuDevice } from './gpu-device';
import { GpuObject } from './gpu-object';
import { GpuObjectUpdateReason, UpdateReason } from './gpu-object-update-reason';

/**
 * Gpu object with a native internal object.
 */
export abstract class GpuNativeObject<TNativeObject> extends GpuObject {
    private mLastGeneratedFrame: number;
    private readonly mNativeLifeTime: NativeObjectLifeTime;
    private mNativeObject: TNativeObject | null;
    
    /**
     * Native gpu object.
     */
    public get native(): TNativeObject {
        return this.readNative();
    }

    /**
     * Constructor.
     * @param pDevice - Gpu device.
     * @param pNativeLifeTime - Lifetime of native object.
     */
    public constructor(pDevice: GpuDevice, pNativeLifeTime: NativeObjectLifeTime) {
        super(pDevice);

        // Save static settings.
        this.mNativeLifeTime = pNativeLifeTime;

        // Init default settings and config.
        this.mNativeObject = null;
        this.mLastGeneratedFrame = 0;
    }

    /**
     * Read up to date native object.
     * Invalidates, destroys and generates the native object.
     * 
     * @returns native object.
     */
    private readNative(): TNativeObject {
        // Validate life time.
        switch (this.mNativeLifeTime) {
            case NativeObjectLifeTime.Persistent: {
                // Do nothing.
                break;
            }
            case NativeObjectLifeTime.Single: {
                // Invalidate every time.
                this.invalidate(UpdateReason.LifeTime);
                break;
            }
            case NativeObjectLifeTime.Frame: {
                // Invalidate on different frame till last generated.
                if (this.device.frameCount !== this.mLastGeneratedFrame) {
                    this.invalidate(UpdateReason.LifeTime);
                }
                break;
            }
        }

        // Clear and destroy old native when any update reason exists.
        if (this.mNativeObject !== null && this.invalidationReasons.any()) {
            this.destroy(this.mNativeObject, this.invalidationReasons);
            this.mNativeObject = null;
        }

        // Generate new native when not already generated.
        if (this.mNativeObject === null) {
            this.mNativeObject = this.generate();
            this.mLastGeneratedFrame = this.device.frameCount;

            // Reset all update reasons.
            this.invalidationReasons.clear();
        }

        return this.mNativeObject;
    }

    /**
     * Destroy native object.
     */
    protected abstract destroy(pNative: TNativeObject, pReasons: GpuObjectUpdateReason): void;

    /**
     * Generate new native object.
     */
    protected abstract generate(): TNativeObject;
}

export type GpuObjectUpdateListener = () => void;

// TODO: Move
export enum NativeObjectLifeTime {
    Persistent = 0,
    Frame = 1,
    Single = 2
}