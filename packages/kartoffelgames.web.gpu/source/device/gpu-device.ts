import { EnumUtil, Exception, IDeconstructable, List } from '@kartoffelgames/core';
import type { GpuFeature } from '../constant/gpu-feature.enum.ts';
import { GpuLimit } from '../constant/gpu-limit.enum.ts';
import { GpuExecution, type GpuExecutionFunction } from '../execution/gpu-execution.ts';
import { RenderTargetsLayout } from '../pipeline/render_targets/render-targets-layout.ts';
import { Shader } from '../shader/shader.ts';
import { CanvasTexture } from '../texture/canvas-texture.ts';
import { GpuDeviceCapabilities } from './capabilities/gpu-device-capabilities.ts';
import { GpuTextureFormatCapabilities } from './capabilities/gpu-texture-format-capabilities.ts';
import { IGpuObjectNative } from "../gpu_object/interface/i-gpu-object-native.ts";
import { GpuObject } from "@kartoffelgames/web-gpu";

export class GpuDevice implements IDeconstructable {
    /**
     * Read gpu max limits for the specified performance level.
     * 
     * @param pPerformance - Performance level.
     * 
     * @returns gpu limits for the specified performance level.
     */
    public static async readDeviceLimits(pPerformance: GPUPowerPreference): Promise<Record<GpuLimit, number>> {
        // Try to load cached adapter. When not cached, request new one.
        const lAdapter: GPUAdapter | null = await globalThis.navigator.gpu.requestAdapter({ powerPreference: pPerformance });
        if (!lAdapter) {
            throw new Exception('Error requesting GPU adapter', GpuDevice);
        }

        // Convert gpu limits.
        const lLimits: Record<string, number> = {};
        for (const lLimitName of EnumUtil.valuesOf<GpuLimit>(GpuLimit)) {
            lLimits[lLimitName] = lAdapter.limits[lLimitName] ?? null;
        }

        return lLimits;
    }

    /**
     * Request new gpu device.
     * 
     * @param pGenerator - Native object generator.
     */
    public static async request(pPerformance: GPUPowerPreference, pOptions?: GpuDeviceLimitConfiguration): Promise<GpuDevice> {
        // Try to load cached adapter. When not cached, request new one.
        const lAdapter: GPUAdapter | null = await globalThis.navigator.gpu.requestAdapter({ powerPreference: pPerformance });
        if (!lAdapter) {
            throw new Exception('Error requesting GPU adapter', GpuDevice);
        }

        // Fill in required features and limits.
        const lFeatures: Array<GpuFeature> = new Array<GpuFeature>();
        const lLimits: Record<string, number> = {};
        if (pOptions) {
            // Setup gpu features.
            if (pOptions.features) {
                // Fill in required features.
                for (const lFeature of pOptions.features) {
                    // Exit when required feature is not available.
                    if (!lAdapter.features.has(lFeature.name)) {
                        // Exit when feature was not optional.
                        if (lFeature.required) {
                            throw new Exception(`No Gpu found with the required feature "${lFeature.name}"`, this);
                        }

                        // Skip optional features.
                        continue;
                    }

                    lFeatures.push(lFeature.name);
                }
            }

            // Setup gpu limits.
            if (pOptions.limits) {
                // Fill in required features.
                for (const lLimit of pOptions.limits) {
                    // Read available limit.
                    const lAdapterLimit: number | undefined = lAdapter.limits[lLimit.name] as number | undefined;
                    if (typeof lAdapterLimit === 'undefined') {
                        throw new Exception(`Gpu does not support any "${lLimit.name}" limit.`, this);
                    }

                    // Check for adapter available limit.
                    let lAvailableLimit: number = lLimit.value;
                    if (lAdapterLimit < lLimit.value) {
                        // Exit when required limit is not available.
                        if (lLimit.required) {
                            throw new Exception(`No Gpu found with the required limit "${lLimit.name}" (has: ${lAdapterLimit}, required: ${lLimit.value})`, this);
                        }

                        // When not required, use the highest available limit.
                        lAvailableLimit = lAdapterLimit;
                    }

                    lLimits[lLimit.name] = lAvailableLimit;
                }
            }
        }

        // Try to load cached device. When not cached, request new one.
        const lDevice: GPUDevice | null = await lAdapter.requestDevice({
            requiredFeatures: lFeatures as Array<GPUFeatureName>,
            requiredLimits: lLimits
        });
        if (!lDevice) {
            throw new Exception('Error requesting GPU device', GpuDevice);
        }

        return new GpuDevice(lDevice);
    }

    private readonly mCapabilities: GpuDeviceCapabilities;
    private readonly mFormatValidator: GpuTextureFormatCapabilities;
    private readonly mFrameChangeListener: List<GpuDeviceFrameChangeListener>;
    private readonly mGpuDevice: GPUDevice;

    private readonly mFreeableGpuObjects: Array<WeakRef<GpuObject>>;
    private mFreeableGpuObjectIndex: number;
    private readonly mFreeableGpuObjectResources: Map<WeakRef<GpuObject>, Set<GpuDeviceDestroyableObject>>;

    /**
     * Gpu capabilities.
     */
    public get capabilities(): GpuDeviceCapabilities {
        return this.mCapabilities;
    }

    /**
     * Texture format validator.
     */
    public get formatValidator(): GpuTextureFormatCapabilities {
        return this.mFormatValidator;
    }

    /**
     * Gpu device.
     */
    public get gpu(): GPUDevice {
        return this.mGpuDevice;
    }

    /**
     * Constructor.
     * 
     * @param pGenerator - Native GPU-Object Generator.
     */
    private constructor(pDevice: GPUDevice) {
        this.mGpuDevice = pDevice;

        // Setup capabilities.
        this.mCapabilities = new GpuDeviceCapabilities(pDevice);

        // Init form validator.
        this.mFormatValidator = new GpuTextureFormatCapabilities(this);

        // Frame change listener.
        this.mFrameChangeListener = new List<GpuDeviceFrameChangeListener>();

        // Freeable resources.
        this.mFreeableGpuObjects = new Array<WeakRef<GpuObject>>();
        this.mFreeableGpuObjectIndex = 0;
        this.mFreeableGpuObjectResources = new Map<WeakRef<GpuObject>, Set<GpuDeviceDestroyableObject>>();
    }

    /**
     * Add listener called on frame change.
     * 
     * @param pListener - Listener.
     */
    public addTickListener(pListener: GpuDeviceFrameChangeListener): void {
        this.mFrameChangeListener.push(pListener);
    }

    /**
     * Deconstruct gpu device and release resources.
     */
    public deconstruct(): void {
        // Go over each freeable resource and try to free it.
        for (const lResourceReference of this.mFreeableGpuObjects) {
            // Skip resources without native object references.
            if (!this.mFreeableGpuObjectResources.has(lResourceReference)) {
                continue;
            }

            // Free all resources of the reference.
            for (const lResource of this.mFreeableGpuObjectResources.get(lResourceReference)!) {
                lResource.destroy();
            }

            // And finally remove the reference from the mapping.
            this.mFreeableGpuObjectResources.delete(lResourceReference);
        }

        // Clear freeable resources list.
        this.mFreeableGpuObjects.splice(0, this.mFreeableGpuObjects.length);

        // And finally destroy the gpu device.
        this.mGpuDevice.destroy();
    }

    /**
     * Create pass executor.
     * 
     * @param pOnExecute - On executor execute.
     */
    public execute(pOnExecute: GpuExecutionFunction): void {
        new GpuExecution(this).execute(pOnExecute);
    }

    /**
     * Remove listener called on frame change.
     * 
     * @param pListener - Listener.
     */
    public removeTickListener(pListener: GpuDeviceFrameChangeListener): void {
        this.mFrameChangeListener.remove(pListener);
    }

    /**
     * Register freeable resource for the specified gpu object reference.
     * When the gpu object reference is garbage collected, all registered resources will be automatically freed.
     * 
     * @param pReference - Gpu object reference.
     * @param pResource - Resource to be freed when the reference is garbage collected.
     */
    public registerFreeableResource(pReference: GpuObject<any, any, any>, pResourceListReference: Set<GpuDeviceDestroyableObject>): void {
        // Create weak reference for the resource reference.
        const lResourceReference: WeakRef<GpuObject> = new WeakRef<GpuObject>(pReference);

        // Add weak reference to the list of freeable resources.
        this.mFreeableGpuObjects.push(lResourceReference);

        // Link resource reference to the resource list reference for later resource freeing when the gpu object reference is garbage collected.
        // This list should persist after the gpu object reference is garbage collected to be able to free the resources of the reference.
        this.mFreeableGpuObjectResources.set(lResourceReference, pResourceListReference);
    }

    /**
     * Start new frame.
     */
    public processTick(): void {
        // Call all frame change listener.
        for (const lListener of this.mFrameChangeListener) {
            lListener();
        }

        // Try to free ten resources per frame to avoid performance spikes.
        const lMaxFreeIterations: number = Math.min(10, this.mFreeableGpuObjects.length);
        for (let lIterationIndex = 0; lIterationIndex < lMaxFreeIterations; lIterationIndex++) {
            // Get resource reference and try to dereference it.
            const lGpuObjectReference: WeakRef<GpuObject> = this.mFreeableGpuObjects[this.mFreeableGpuObjectIndex];
            const lGpuObject: GpuObject | undefined = lGpuObjectReference.deref();

            // When reference is already garbage collected, remove it from the mapping and free all resources of the reference.
            if (!lGpuObject) {
                // Free all resources of the reference.
                if (this.mFreeableGpuObjectResources.has(lGpuObjectReference)) {
                    for (const lResource of this.mFreeableGpuObjectResources.get(lGpuObjectReference)!) {
                        lResource.destroy();
                    }

                    // And finally remove the reference from the mapping.
                    this.mFreeableGpuObjectResources.delete(lGpuObjectReference);
                }

                // Remove reference from the list.
                this.mFreeableGpuObjects.splice(this.mFreeableGpuObjectIndex, 1);
            }

            // Process next resource in the next iteration and loop back index when it reaches the end of the list.
            if (++this.mFreeableGpuObjectIndex >= this.mFreeableGpuObjects.length) {
                this.mFreeableGpuObjectIndex = 0;
            }
        }
    }
}

export type GpuDeviceFrameChangeListener = () => void;

type GpuDeviceLimitConfiguration = {
    features?: Array<{
        name: GpuFeature,
        required?: boolean;
    }>;
    limits?: Array<{
        name: GpuLimit,
        value: number,
        required?: boolean;
    }>;
};

export type GpuDeviceDestroyableObject = {
    destroy: () => any;
};