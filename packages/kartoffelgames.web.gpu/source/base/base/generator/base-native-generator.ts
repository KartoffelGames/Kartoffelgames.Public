import { GpuObjectUpdateReason, UpdateReason } from '../gpu/gpu-object-update-reason';
import { GeneratorFactoryMap, GeneratorNativeMap } from './base-generator-factory';

export abstract class BaseNativeGenerator<TMap extends GeneratorNativeMap, TGeneratorKey extends keyof GeneratorFactoryMap> {
    private readonly mFactory: TMap['factory'];
    private readonly mGpuObject: GeneratorFactoryMap[TGeneratorKey]['gpuObject'];
    private mLastGeneratedFrame: number;
    private mNative: TMap['generators'][TGeneratorKey]['native'] | null;
    private readonly mUpdateReasons: GpuObjectUpdateReason;

    /**
     * Life time of native object.
     */
    protected abstract nativeLifeTime: NativeObjectLifeTime;

    /**
     * Generator factory.
     */
    protected get factory(): TMap['factory'] {
        return this.mFactory;
    }

    /**
     * Get base object of generator.
     */
    protected get gpuObject(): GeneratorFactoryMap[TGeneratorKey]['gpuObject'] {
        return this.mGpuObject;
    }

    /**
     * Get generator update reasons.
     */
    protected get updateReasons(): GpuObjectUpdateReason {
        return this.mUpdateReasons;
    }

    /**
     * Constructor.
     * @param pBaseObject - Base object containing all values.
     * @param pGeneratorFactory - Generator factory.
     */
    public constructor(pFactory: TMap['factory'], pBaseObject: TGeneratorKey extends keyof GeneratorFactoryMap ? GeneratorFactoryMap[TGeneratorKey]['gpuObject'] : never) {
        this.mFactory = pFactory;
        this.mGpuObject = pBaseObject;
        this.mNative = null;
        this.mLastGeneratedFrame = 0;
        this.mUpdateReasons = new GpuObjectUpdateReason();
    }

    /**
     * Generate native gpu object from base.
     */
    public create(): TMap['generators'][TGeneratorKey]['native'] {
        // Validate life time.
        switch (this.nativeLifeTime) {
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
                if (this.factory.device.frameCount !== this.mLastGeneratedFrame) {
                    this.invalidate(UpdateReason.LifeTime);
                }
                break;
            }
        }

        // Clear and destroy old native when any update reason exists.
        if (this.mNative !== null && this.mUpdateReasons.any()) {
            this.destroy(this.mNative);
            this.mNative = null;
        }

        // Generate new native when not already generated.
        if (this.mNative === null) {
            this.mNative = this.generate();
            this.mLastGeneratedFrame = this.factory.device.frameCount;

            // Reset all update reasons.
            this.mUpdateReasons.clear();
        }

        return this.mNative;
    }

    /**
     * Invalidate and destroy generated native.
     */
    public invalidate(pDestroyReason: UpdateReason): void {
        // Add update reason.
        this.mUpdateReasons.add(pDestroyReason);
    }

    /**
     * Destroy generated native.
     * @param _pNative - Generated native.
     * @param _pDestroyReason - Reason why the native should be destroyed.
     */
    protected destroy(_pNative: TMap['generators'][TGeneratorKey]['native']): void {
        return;
    }

    /**
     * Generate native gpu object.
     * @param pUpdateReason - Reason why the native should be updated.
     */
    protected abstract generate(): TMap['generators'][TGeneratorKey]['native'];
}

export enum NativeObjectLifeTime {
    Persistent = 0,
    Frame = 1,
    Single = 2
}