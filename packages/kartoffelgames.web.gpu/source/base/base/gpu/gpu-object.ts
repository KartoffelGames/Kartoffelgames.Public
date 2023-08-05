import { Exception } from '@kartoffelgames/core.data';
import { GpuDependent } from './gpu-dependent';
import { GpuTypes } from './gpu-device';

export abstract class GpuObject<TGpuTypes extends GpuTypes, TNative> extends GpuDependent<TGpuTypes> {
    private mDestroyed: boolean;
    private mNativeObject: TNative | null;
    private mUpdateRequested: boolean;

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
        this.mDestroyed = false;
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
     * Update gpu object.
     */
    public override update(): void {
        this.mUpdateRequested = true;

        // Call parent update method.
        super.update();
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
