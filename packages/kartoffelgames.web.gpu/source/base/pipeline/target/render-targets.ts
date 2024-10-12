import { Dictionary, Exception } from '@kartoffelgames/core';
import { TextureAspect } from '../../../constant/texture-aspect.enum';
import { TextureOperation } from '../../../constant/texture-operation.enum';
import { TextureUsage } from '../../../constant/texture-usage.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject, GpuObjectSetupReferences } from '../../gpu/object/gpu-object';
import { GpuObjectInvalidationReasons } from '../../gpu/object/gpu-object-invalidation-reasons';
import { IGpuObjectNative } from '../../gpu/object/interface/i-gpu-object-native';
import { IGpuObjectSetup } from '../../gpu/object/interface/i-gpu-object-setup';
import { CanvasTexture, CanvasTextureInvalidationType } from '../../texture/canvas-texture';
import { FrameBufferTexture, FrameBufferTextureInvalidationType } from '../../texture/frame-buffer-texture';
import { TextureFormatCapability } from '../../texture/texture-format-capabilities';
import { RenderTargetSetupData, RenderTargetsSetup } from './render-targets-setup';

/**
 * Group of textures with the same size and multisample level.
 */
export class RenderTargets extends GpuObject<GPURenderPassDescriptor, RenderTargetsInvalidationType, RenderTargetsSetup> implements IGpuObjectSetup<RenderTargetsSetup>, IGpuObjectNative<GPURenderPassDescriptor> {
    private readonly mColorTextures: Dictionary<string, RenderTargetsColorTarget>; // TODO: Maybe use a ordered array for that.
    private mDepthStencilTexture: RenderTargetsDepthStencilTexture | null;
    private readonly mSize: TextureSize;

    /**
     * Color attachment names ordered by index.
     */
    public get colorTargetNames(): Array<string> {
        // Ensure setup was called.
        this.ensureSetup();

        // Create color attachment list in order.
        const lColorAttachmentNameList: Array<string> = new Array<string>();
        for (const lColorAttachment of this.mColorTextures.values()) {
            lColorAttachmentNameList[lColorAttachment.index] = lColorAttachment.name;
        }

        return lColorAttachmentNameList;
    }

    /**
     * Stencil attachment texture.
     */
    public get hasDepth(): boolean {
        // Ensure setup was called.
        this.ensureSetup();

        return !!this.mDepthStencilTexture?.depth;
    }

    /**
     * Stencil attachment texture.
     */
    public get hasStencil(): boolean {
        // Ensure setup was called.
        this.ensureSetup();

        return !!this.mDepthStencilTexture?.stencil;
    }

    /**
     * Render target height.
     */
    public get height(): number {
        return this.mSize.height;
    }

    /**
     * Render target multisample level.
     */
    public get multiSampleLevel(): number {
        return this.mSize.multisampleLevel;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPURenderPassDescriptor {
        return super.native;
    }

    /**
     * Render target height.
     */
    public get width(): number {
        return this.mSize.width;
    }

    /**
     * Constuctor.
     * @param pDevice - Gpu device reference.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);

        // Set "fixed" 
        this.mSize = { width: 1, height: 1, multisampleLevel: 1 };

        // Setup initial data.
        this.mDepthStencilTexture = null;
        this.mColorTextures = new Dictionary<string, RenderTargetsColorTarget>();
    }

    /**
     * Get color target by name.
     * 
     * @param pTargetName - Target name.
     *  
     * @returns target texture. 
     */
    public colorTarget(pTargetName: string): FrameBufferTexture | CanvasTexture {
        const lTarget: RenderTargetsColorTarget | undefined = this.mColorTextures.get(pTargetName);
        if (!lTarget) {
            throw new Exception(`Color target "${pTargetName}" does not exists.`, this);
        }

        return lTarget.texture.target;
    }

    /**
     * Get depth attachment texture.
     */
    public depthStencilTarget(): FrameBufferTexture {
        // Ensure setup was called.
        this.ensureSetup();

        // No depth texture setup.
        if (!this.mDepthStencilTexture || !this.mDepthStencilTexture.depth) {
            throw new Exception(`Depth or stencil target does not exists.`, this);
        }

        return this.mDepthStencilTexture.target;
    }

    /**
     * Check for color target existence.
     * 
     * @param pTargetName - Color target name.
     * 
     * @returns true when color target exists. 
     */
    public hasColorTarget(pTargetName: string): boolean {
        return this.mColorTextures.has(pTargetName);
    }

    /**
     * Resize all render targets.
     * 
     * @param pWidth - New texture width.
     * @param pHeight - New texture height.
     * @param pMultisampleLevel - New texture multisample level.
     *  
     * @returns this. 
     */
    public resize(pHeight: number, pWidth: number, pMultisampleLevel: number | null = null): this {
        // Set 2D size dimensions
        this.mSize.width = pWidth;
        this.mSize.height = pHeight;

        // Optional multisample level.
        if (pMultisampleLevel !== null) {
            if (pMultisampleLevel !== 1 && pMultisampleLevel % 4 !== 0) {
                throw new Exception(`Only multisample level 1 or 4 is supported.`, this);
            }

            this.mSize.multisampleLevel = pMultisampleLevel;
        }

        // Apply resize for all textures.
        this.applyResize();

        // Invalidation triggers through each texture.

        return this;
    }

    /**
     * Call setup.
     * Exposes internal setup.
     * 
     * @param pSetupCallback - Setup callback. 
     * 
     * @returns this. 
     */
    public override setup(pSetupCallback?: ((pSetup: RenderTargetsSetup) => void) | undefined): this {
        return super.setup(pSetupCallback);
    }

    /**
     * Generate native gpu bind data group.
     */
    protected override generateNative(): GPURenderPassDescriptor {
        // Invalidate bc. descriptor is rebuilding.
        this.invalidate(RenderTargetsInvalidationType.DescriptorRebuild);

        // Create color attachment list in order.
        const lColorAttachmentList: Array<RenderTargetsColorTarget> = new Array<RenderTargetsColorTarget>();
        for (const lColorAttachment of this.mColorTextures.values()) {
            lColorAttachmentList[lColorAttachment.index] = lColorAttachment;
        }

        // Create color attachments.
        const lColorAttachments: Array<GPURenderPassColorAttachment> = new Array<GPURenderPassColorAttachment>();
        for (const lColorAttachment of lColorAttachmentList) {
            // Convert Texture operation to load operations.
            const lStoreOperation: GPUStoreOp = lColorAttachment.storeOperation === TextureOperation.Keep ? 'store' : 'discard';

            // Create basic color attachment.
            const lPassColorAttachment: GPURenderPassColorAttachment = {
                view: lColorAttachment.texture!.target.native,
                storeOp: lStoreOperation,
                loadOp: 'clear' // Placeholder
            };

            // Set clear value 
            if (lColorAttachment.clearValue !== null) {
                lPassColorAttachment.clearValue = lColorAttachment.clearValue;
                lPassColorAttachment.loadOp = 'clear';
            } else {
                lPassColorAttachment.loadOp = 'load';
            }

            // Resolve optional resolve attachment but only when texture uses multisample.
            if (lColorAttachment.texture!.resolve) {
                lPassColorAttachment.resolveTarget = lColorAttachment.texture!.resolve.native;
            }

            lColorAttachments.push(lPassColorAttachment satisfies GPURenderPassColorAttachment);
        }

        // Create descriptor with color attachments.
        const lDescriptor: GPURenderPassDescriptor = {
            colorAttachments: lColorAttachments
        };

        // Set optional depth attachment.
        if (this.mDepthStencilTexture) {
            const lDepthStencilTexture: FrameBufferTexture = this.mDepthStencilTexture.target;

            // Add texture view for depth.
            lDescriptor.depthStencilAttachment = {
                view: lDepthStencilTexture.native,
            };

            // Add depth values when depth formats are used.
            if (this.mDepthStencilTexture.depth) {
                // Set clear value of depth texture.
                if (this.mDepthStencilTexture.depth.clearValue !== null) {
                    lDescriptor.depthStencilAttachment.depthClearValue = this.mDepthStencilTexture.depth.clearValue;
                    lDescriptor.depthStencilAttachment.depthLoadOp = 'clear';
                } else {
                    lDescriptor.depthStencilAttachment.depthLoadOp = 'load';
                }

                // Convert Texture operation to load operations.
                lDescriptor.depthStencilAttachment.depthStoreOp = this.mDepthStencilTexture.depth.storeOperation === TextureOperation.Keep ? 'store' : 'discard';
            }

            // Add stencil values when stencil formats are used.
            if (this.mDepthStencilTexture.stencil) {
                // Set clear value of stencil texture.
                if (this.mDepthStencilTexture.stencil.clearValue !== null) {
                    lDescriptor.depthStencilAttachment.stencilClearValue = this.mDepthStencilTexture.stencil.clearValue;
                    lDescriptor.depthStencilAttachment.stencilLoadOp = 'clear';
                } else {
                    lDescriptor.depthStencilAttachment.stencilLoadOp = 'load';
                }

                // Convert Texture operation to load operations.
                lDescriptor.depthStencilAttachment.stencilStoreOp = this.mDepthStencilTexture.stencil.storeOperation === TextureOperation.Keep ? 'store' : 'discard';
            }
        }

        return lDescriptor;
    }

    /**
     * Setup object based on setup data.
     * 
     * @param pReferenceData - Referenced setup data.
     */
    protected override onSetup(pReferenceData: RenderTargetSetupData): void {
        // Setup depth stencil targets.
        if (pReferenceData.depthStencil) {
            // Validate existence of depth stencil texture.
            if (!pReferenceData.depthStencil.texture) {
                throw new Exception(`Depth/ stencil attachment defined but no texture was assigned.`, this);
            }

            // Save setup texture.
            this.mDepthStencilTexture = {
                target: pReferenceData.depthStencil.texture
            };

            // Add render attachment texture usage to depth stencil texture.
            pReferenceData.depthStencil.texture.extendUsage(TextureUsage.RenderAttachment);

            // Passthrough depth stencil texture changes.
            this.setTextureInvalidationListener(pReferenceData.depthStencil.texture);

            // Read capability of used depth stencil texture format.
            const lFormatCapability: TextureFormatCapability = this.device.formatValidator.capabilityOf(pReferenceData.depthStencil.texture.layout.format);

            // Setup depth texture.
            if (pReferenceData.depthStencil.depth) {
                // Validate if depth texture
                if (!lFormatCapability.aspects.has(TextureAspect.Depth)) {
                    throw new Exception('Used texture for the depth texture attachment must have a depth aspect. ', this);
                }

                this.mDepthStencilTexture.depth = {
                    clearValue: pReferenceData.depthStencil.depth.clearValue,
                    storeOperation: pReferenceData.depthStencil.depth.storeOperation
                };
            }

            // Setup stencil texture.
            if (pReferenceData.depthStencil.stencil) {
                // Validate if depth texture
                if (!lFormatCapability.aspects.has(TextureAspect.Stencil)) {
                    throw new Exception('Used texture for the stencil texture attachment must have a depth aspect. ', this);
                }

                this.mDepthStencilTexture.stencil = {
                    clearValue: pReferenceData.depthStencil.stencil.clearValue,
                    storeOperation: pReferenceData.depthStencil.stencil.storeOperation
                };
            }
        }

        // Setup color targets.
        const lAttachmentLocations: Array<boolean> = new Array<boolean>();
        for (const lAttachment of pReferenceData.colorTargets.values()) {
            // Validate existence of color texture.
            if (!lAttachment.texture) {
                throw new Exception(`Color attachment "${lAttachment.name}" defined but no texture was assigned.`, this);
            }

            // No double names.
            if (this.mColorTextures.has(lAttachment.name)) {
                throw new Exception(`Color attachment name "${lAttachment.name}" can only be defined once.`, this);
            }

            // No double location indices.
            if (lAttachmentLocations[lAttachment.index] === true) {
                throw new Exception(`Color attachment location index "${lAttachment.index}" can only be defined once.`, this);
            }

            // Passthrough color texture changes. Any change.
            this.setTextureInvalidationListener(lAttachment.texture);

            // Add render attachment texture usage to color texture.
            lAttachment.texture.extendUsage(TextureUsage.RenderAttachment);

            // Buffer used location index.
            lAttachmentLocations[lAttachment.index] = true;

            // Convert setup into storage data.
            this.mColorTextures.set(lAttachment.name, {
                name: lAttachment.name,
                index: lAttachment.index,
                clearValue: lAttachment.clearValue,
                storeOperation: lAttachment.storeOperation,
                texture: {
                    target: lAttachment.texture
                }
            });
        }

        // Validate attachment list.
        if (lAttachmentLocations.length !== this.mColorTextures.size) {
            throw new Exception(`Color attachment locations must be in order.`, this);
        }
    }

    /**
     * On setup object creation. Create setup object.
     * 
     * @param pReferences - Setup references.
     * 
     * @returns build setup object. 
     */
    protected override onSetupObjectCreate(pReferences: GpuObjectSetupReferences<RenderTargetSetupData>): RenderTargetsSetup {
        return new RenderTargetsSetup(pReferences);
    }

    /**
     * Try to update views of pass descriptor.
     * 
     * @param pNative - Native pass descriptor.
     * @param pReasons - Update reason.
     * 
     * @returns true when native was updated.
     */
    protected override updateNative(pNative: GPURenderPassDescriptor, pReasons: GpuObjectInvalidationReasons<RenderTargetsInvalidationType>): boolean {
        // Native can not be updated on any config changes.
        if (pReasons.has(RenderTargetsInvalidationType.DescriptorRebuild)) {
            return false;
        }

        // TODO: Make it more performant.

        // Update only views of descriptor. 
        if (pNative.depthStencilAttachment) {
            pNative.depthStencilAttachment.view = this.mDepthStencilTexture!.target.native;
        }

        // Create color attachment list in order.
        const lColorAttachmentList: Array<RenderTargetsColorTarget> = new Array<RenderTargetsColorTarget>();
        for (const lColorAttachment of this.mColorTextures.values()) {
            lColorAttachmentList[lColorAttachment.index] = lColorAttachment;
        }

        // Create color attachments.
        for (let lColorAttachmentIndex: number = 0; lColorAttachmentIndex < lColorAttachmentList.length; lColorAttachmentIndex++) {
            // Read current attachment.
            const lCurrentAttachment: GPURenderPassColorAttachment | null = (<Array<GPURenderPassColorAttachment | null>>pNative.colorAttachments)[lColorAttachmentIndex];
            if (lCurrentAttachment === null) {
                continue;
            }

            // Read setup attachments.
            const lColorAttachment = lColorAttachmentList[lColorAttachmentIndex];

            // Update view.
            lCurrentAttachment.view = lColorAttachment.texture.target.native;

            // Update optional resolve target.
            if (lCurrentAttachment.resolveTarget && lColorAttachment.texture.resolve) {
                lCurrentAttachment.resolveTarget = lColorAttachment.texture.resolve.native;
            }
        }

        return true;
    }

    /**
     * Resize all textures.
     */
    private applyResize(): void {
        // Update buffer texture multisample level.
        for (const lAttachment of this.mColorTextures.values()) {
            // Check for removed or added multisample level.
            if (this.mSize.multisampleLevel === 1) {
                // When the multisample state is removed, use all canvas resolve textures into the actual target and clear the placeholder target buffer.
                if (lAttachment.texture.resolve) {
                    // Destroy buffering textures.
                    lAttachment.texture.target.deconstruct();

                    // Use resolve as target.
                    lAttachment.texture.target = lAttachment.texture.resolve;

                    // Update descriptor on texture changes.
                    this.invalidate(RenderTargetsInvalidationType.DescriptorRebuild);
                }
            } else {
                // When the multisample state is added, use all canvas targets as a resolve texture used after rendering and create a new target buffer texture with multisampling. 
                if (lAttachment.texture.target instanceof CanvasTexture) {
                    // Move target into resolve.
                    lAttachment.texture.resolve = lAttachment.texture.target;

                    // Create new texture from canvas texture.
                    lAttachment.texture.target = new FrameBufferTexture(this.device, lAttachment.texture.resolve.layout);
                    lAttachment.texture.target.extendUsage(TextureUsage.RenderAttachment);

                    // Update descriptor on texture changes.
                    this.invalidate(RenderTargetsInvalidationType.DescriptorRebuild);
                }
            }

            // Add multisample level only to frame buffers as canvas does not support any mutisampling.
            if (lAttachment.texture.target instanceof FrameBufferTexture) {
                lAttachment.texture.target.multiSampleLevel = this.mSize.multisampleLevel;
            }
        }

        // Update target texture multisample level.
        if (this.mDepthStencilTexture) {
            this.mDepthStencilTexture.target.multiSampleLevel = this.mSize.multisampleLevel;
        }

        // Update buffer texture sizes.
        for (const lAttachment of this.mColorTextures.values()) {
            lAttachment.texture.target.height = this.mSize.height;
            lAttachment.texture.target.width = this.mSize.width;

            if (lAttachment.texture.resolve) {
                lAttachment.texture.resolve.height = this.mSize.height;
                lAttachment.texture.resolve.width = this.mSize.width;
            }
        }

        // Update target texture sizes.
        if (this.mDepthStencilTexture) {
            this.mDepthStencilTexture.target.height = this.mSize.height;
            this.mDepthStencilTexture.target.width = this.mSize.width;
        }
    }

    /**
     * Add all needed texture invalidation listener for passthrow and descriptor invalidation. 
     * 
     * @param pTexture - Texture. 
     */
    private setTextureInvalidationListener(pTexture: FrameBufferTexture | CanvasTexture): void {
        // Frame buffer texture invalidation listener.
        if (pTexture instanceof FrameBufferTexture) {
            // Rebuild descriptor only on view changes.
            pTexture.addInvalidationListener(() => {
                this.invalidate(RenderTargetsInvalidationType.ViewRebuild);
            }, [FrameBufferTextureInvalidationType.ViewRebuild]);

            // Passthough other invalidations.
            pTexture.addInvalidationListener((pType: FrameBufferTextureInvalidationType) => {
                switch (pType) {
                    case FrameBufferTextureInvalidationType.Resize: {
                        this.invalidate(RenderTargetsInvalidationType.Resize);
                        break;
                    }
                    case FrameBufferTextureInvalidationType.MultisampleChange: {
                        this.invalidate(RenderTargetsInvalidationType.MultisampleChange);
                        break;
                    }
                    case FrameBufferTextureInvalidationType.FormatChange: {
                        this.invalidate(RenderTargetsInvalidationType.TextureFormatChange);
                        break;
                    }
                }

            }, [
                FrameBufferTextureInvalidationType.Resize,
                FrameBufferTextureInvalidationType.MultisampleChange,
                FrameBufferTextureInvalidationType.FormatChange
            ]);

            return;
        }

        // Frame buffer texture invalidation listener.
        if (pTexture instanceof CanvasTexture) {
            // Rebuild descriptor only on view changes.
            pTexture.addInvalidationListener(() => {
                this.invalidate(RenderTargetsInvalidationType.ViewRebuild);
            }, [CanvasTextureInvalidationType.ViewRebuild]);

            // Passthough other invalidations.
            pTexture.addInvalidationListener((pType: CanvasTextureInvalidationType) => {
                switch (pType) {
                    case CanvasTextureInvalidationType.Resize: {
                        this.invalidate(RenderTargetsInvalidationType.Resize);
                        break;
                    }
                    case CanvasTextureInvalidationType.FormatChange: {
                        this.invalidate(RenderTargetsInvalidationType.TextureFormatChange);
                        break;
                    }
                }

            }, [
                CanvasTextureInvalidationType.Resize,
                CanvasTextureInvalidationType.FormatChange
            ]);

            return;
        }
    }
}

type TextureSize = {
    width: number;
    height: number;
    multisampleLevel: number;
};

export type RenderTargetsDepthStencilTexture = {
    target: FrameBufferTexture;
    depth?: {
        clearValue: number | null;
        storeOperation: TextureOperation;
    };
    stencil?: {
        clearValue: number | null;
        storeOperation: TextureOperation;
    };
};

type RenderTargetsColorTexture = {
    resolve?: CanvasTexture;
    target: FrameBufferTexture | CanvasTexture;
};

export type RenderTargetsColorTarget = {
    name: string;
    index: number;
    clearValue: { r: number; g: number; b: number; a: number; } | null;
    storeOperation: TextureOperation;
    texture: RenderTargetsColorTexture;
};

export enum RenderTargetsInvalidationType {
    Resize = 'Resize',
    MultisampleChange = 'MultisampleChange',
    TextureFormatChange = 'LayoutChange',
    ViewRebuild = 'ViewRebuild',
    DescriptorRebuild = 'DescriptorRebuild'
}