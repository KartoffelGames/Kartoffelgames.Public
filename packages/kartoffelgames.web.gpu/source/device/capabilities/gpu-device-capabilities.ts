import { Dictionary, EnumUtil } from '@kartoffelgames/core';
import { GpuFeature } from '../../constant/gpu-feature.enum.ts';
import { GpuLimit } from '../../constant/gpu-limit.enum.ts';

/**
 * Gpu limits and features.
 */
export class GpuDeviceCapabilities {
    private readonly mFeatures: Set<GpuFeature>;
    private readonly mLimits: Dictionary<GpuLimit, number>;

    /**
     * Constructor.
     * 
     * @param pDevice - Gpu adapter.
     */
    public constructor(pDevice: GPUDevice) {
        // Convert all gpu features.
        this.mFeatures = new Set<GpuFeature>();
        for (const lFeature of pDevice.features) {
            const lGpuFeature: GpuFeature | undefined = EnumUtil.cast<GpuFeature>(GpuFeature, lFeature);
            if (lGpuFeature) {
                this.mFeatures.add(lGpuFeature);
            }
        }

        // Convert gpu limits.
        this.mLimits = new Dictionary<GpuLimit, number>();
        for (const lLimitName of EnumUtil.valuesOf<GpuLimit>(GpuLimit)) {
            this.mLimits.set(lLimitName, pDevice.limits[lLimitName] ?? null);
        }
    }

    /**
     * Get limit value.
     * 
     * @param pLimit - Limit name.
     * 
     * @returns limitation value. 
     */
    public getLimit(pLimit: GpuLimit): number {
        return this.mLimits.get(pLimit)!;
    }

    /**
     * Check if gpu has the specified feature.
     * 
     * @param pFeature - Feature name.
     * 
     * @returns true when gpu has the feature. 
     */
    public hasFeature(pFeature: GpuFeature): boolean {
        return this.mFeatures.has(pFeature);
    }
}
