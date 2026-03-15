import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuLimit } from '../../constant/gpu-limit.enum.ts';
import type { GpuDevice } from '../../device/gpu-device.ts';
import { GpuObject, type GpuObjectSetupReferences } from '../../gpu_object/gpu-object.ts';
import type { IGpuObjectSetup } from '../../gpu_object/interface/i-gpu-object-setup.ts';
import { RenderTargetsLayoutSetup, type RenderTargetsLayoutSetupData } from './render-targets-layout-setup.ts';
import { RenderTargets } from './render-targets.ts';
import type { TextureFormat } from '../../constant/texture-format.type.ts';
import type { RenderTargetsSetup } from './render-targets-setup.ts';

/**
 * Layout metadata for render targets.
 * Stores format information without actual GPU textures.
 * Used by VertexFragmentPipeline to create pipelines without needing textures.
 */
export class RenderTargetsLayout extends GpuObject<null, '', RenderTargetsLayoutSetup> implements IGpuObjectSetup<RenderTargetsLayoutSetup> {
    private readonly mColorTargetFormats: Dictionary<string, RenderTargetsLayoutColorTarget>;
    private readonly mColorTargetOrder: Array<string>;
    private mDepthStencilConfig: RenderTargetsLayoutDepthStencil | null;
    private readonly mMultisampled: boolean;

    /**
     * Color attachment names ordered by index.
     */
    public get colorTargetNames(): Array<string> {
        // Ensure setup was called.
        this.ensureSetup();

        return [...this.mColorTargetOrder];
    }

    /**
     * Depth stencil format.
     */
    public get depthStencilFormat(): TextureFormat | null {
        // Ensure setup was called.
        this.ensureSetup();

        return this.mDepthStencilConfig?.format ?? null;
    }

    /**
     * Has depth attachment.
     */
    public get hasDepth(): boolean {
        // Ensure setup was called.
        this.ensureSetup();

        return !!this.mDepthStencilConfig?.depth;
    }

    /**
     * Has stencil attachment.
     */
    public get hasStencil(): boolean {
        // Ensure setup was called.
        this.ensureSetup();

        return !!this.mDepthStencilConfig?.stencil;
    }

    /**
     * Render target multisample level.
     */
    public get multisampled(): boolean {
        return this.mMultisampled;
    }

    /**
     * Constructor.
     *
     * @param pDevice - Gpu device reference.
     * @param pMultisampled - Whether render targets are multisampled.
     */
    public constructor(pDevice: GpuDevice, pMultisampled: boolean) {
        super(pDevice);

        // Set statics.
        this.mMultisampled = pMultisampled;

        // Init storage.
        this.mColorTargetFormats = new Dictionary<string, RenderTargetsLayoutColorTarget>();
        this.mColorTargetOrder = new Array<string>();
        this.mDepthStencilConfig = null;
    }

    /**
     * Get color target configuration by name.
     *
     * @param pTargetName - Target name.
     *
     * @returns color target layout configuration.
     */
    public colorTarget(pTargetName: string): RenderTargetsLayoutColorTarget {
        // Ensure setup was called.
        this.ensureSetup();

        const lTarget: RenderTargetsLayoutColorTarget | undefined = this.mColorTargetFormats.get(pTargetName);
        if (!lTarget) {
            throw new Exception(`Color target "${pTargetName}" does not exists.`, this);
        }

        return lTarget;
    }

    /**
     * Create render targets from this layout.
     * Textures are created lazily when first needed.
     *
     * @param pSetupCallback - Optional callback to configure render targets setup before creation.
     * 
     * @returns new render targets.
     */
    public create(pSetupCallback?: ((pSetup: RenderTargetsSetup) => void) | undefined): RenderTargets {
        // Ensure layout is setup.
        this.ensureSetup();

        return new RenderTargets(this.device, this).setup(pSetupCallback);
    }

    /**
     * Get depth stencil configuration.
     *
     * @returns depth stencil config.
     */
    public depthStencilTarget(): RenderTargetsLayoutDepthStencil {
        // Ensure setup was called.
        this.ensureSetup();

        if (!this.mDepthStencilConfig) {
            throw new Exception(`Depth or stencil target does not exists.`, this);
        }

        return this.mDepthStencilConfig;
    }

    /**
     * Check for color target existence.
     *
     * @param pTargetName - Color target name.
     *
     * @returns true when color target exists.
     */
    public hasColorTarget(pTargetName: string): boolean {
        return this.mColorTargetFormats.has(pTargetName);
    }

    /**
     * Generate native gpu object. Returns null as this is metadata only.
     */
    protected override generateNative(): null {
        return null;
    }

    /**
     * Setup object based on setup data.
     *
     * @param pReferenceData - Referenced setup data.
     */
    protected override onSetup(pReferenceData: RenderTargetsLayoutSetupData): void {
        // Enforce gpu color attachment limits.
        const lMaxRenderTargets: number = this.device.capabilities.getLimit(GpuLimit.MaxColorAttachments);
        if (pReferenceData.colorTargets.length > (lMaxRenderTargets - 1)) {
            throw new Exception(`Max color targets count exeeced.`, this);
        }

        // Setup color targets.
        for (const lColorTarget of pReferenceData.colorTargets) {
            // No double names.
            if (this.mColorTargetFormats.has(lColorTarget.name)) {
                throw new Exception(`Color attachment name "${lColorTarget.name}" can only be defined once.`, this);
            }

            // No double location indices.
            if (this.mColorTargetOrder[lColorTarget.index] !== undefined) {
                throw new Exception(`Color attachment location index "${lColorTarget.index}" can only be defined once.`, this);
            }

            // Store color target format data.
            const lLayoutTarget: RenderTargetsLayoutColorTarget = {
                index: lColorTarget.index,
                format: lColorTarget.format,
                keepOnEnd: lColorTarget.keepOnEnd,
                clearValue: lColorTarget.clearValue
            };

            this.mColorTargetFormats.set(lColorTarget.name, lLayoutTarget);
            this.mColorTargetOrder[lColorTarget.index] = lColorTarget.name;
        }

        // Validate attachment list is contiguous.
        if (this.mColorTargetFormats.size !== this.mColorTargetOrder.length) {
            throw new Exception(`Color attachment locations must be in order.`, this);
        }

        // Setup depth stencil.
        if (pReferenceData.depthStencil) {
            this.mDepthStencilConfig = {
                format: pReferenceData.depthStencil.format
            };

            // Setup depth when values where set.
            if (pReferenceData.depthStencil.depth) {
                this.mDepthStencilConfig.depth = {
                    keepOnEnd: pReferenceData.depthStencil.depth.keepOnEnd,
                    clearValue: pReferenceData.depthStencil.depth.clearValue
                };
            }

            // Setup stencil when values where set.
            if (pReferenceData.depthStencil.stencil) {
                this.mDepthStencilConfig.stencil = {
                    keepOnEnd: pReferenceData.depthStencil.stencil.keepOnEnd,
                    clearValue: pReferenceData.depthStencil.stencil.clearValue
                };
            }
        }
    }

    /**
     * On setup object creation. Create setup object.
     *
     * @param pReferences - Setup references.
     *
     * @returns build setup object.
     */
    protected override onSetupObjectCreate(pReferences: GpuObjectSetupReferences<RenderTargetsLayoutSetupData>): RenderTargetsLayoutSetup {
        return new RenderTargetsLayoutSetup(pReferences);
    }
}

export type RenderTargetsLayoutColorTarget = {
    index: number;
    format: TextureFormat;
    keepOnEnd: boolean;
    clearValue: { r: number; g: number; b: number; a: number; };
};

export type RenderTargetsLayoutDepthStencil = {
    format: TextureFormat;
    depth?: {
        keepOnEnd: boolean;
        clearValue: number;
    };
    stencil?: {
        keepOnEnd: boolean;
        clearValue: number;
    };
};
