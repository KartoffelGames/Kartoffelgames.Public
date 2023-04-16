import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Gpu } from '../gpu';
import { CanvasTexture } from '../resource/texture/canvas-texture';
import { ITexture } from '../resource/texture/i-texture.interface';
import { Texture } from '../resource/texture/texture';
import { TextureUsage } from '../resource/texture/texture-usage.enum';
import { AttachmentType } from './attachment-type.enum';
import { ColorAttachment } from './type/color-attachment';
import { DepthStencilAttachment } from './type/depth-stencil-attachment';

export class Attachments {
    private readonly mAttachmentGroup: Dictionary<string, number>;
    private readonly mAttachments: Dictionary<string, AttachmentData>;
    private readonly mGpu: Gpu;
    private mRebuildRequested: boolean;
    private readonly mSize: TextureDimension;
    private readonly mTextureGroup: Dictionary<string, ITexture>;

    /**
     * Attachment height.
     */
    public get height(): number {
        return this.mSize.height;
    }

    /**
     * Attachment width.
     */
    public get width(): number {
        return this.mSize.width;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: Gpu,) {
        this.mAttachments = new Dictionary<string, AttachmentData>();
        this.mAttachmentGroup = new Dictionary<string, number>();
        this.mTextureGroup = new Dictionary<string, ITexture>();
        this.mGpu = pGpu;
        this.mRebuildRequested = false;
        this.mSize = { width: 1, height: 1 };
    }

    /**
     * Add attachment. Forces rebuild of some groups.
     * @param pAttachment - Attachment.
     */
    public addAttachment(pAttachment: CanvasAttachmentDescription | TextureAttachmentDescription): void {
        // Filter dublicates.
        if (this.mAttachments.has(pAttachment.name)) {
            throw new Exception(`Attachment "${pAttachment.name}" already exists.`, this);
        }

        // Validate canvas settings.
        if ('canvas' in pAttachment) {
            if (typeof pAttachment.layers !== 'undefined' && pAttachment.layers !== 1) {
                throw new Exception('Invalid layer count on canvas attachment. Only one layer allowed.', this);
            }
        }

        // Auto detect format.
        const lFormat: GPUTextureFormat = pAttachment.format ?? window.navigator.gpu.getPreferredCanvasFormat();

        // Special canvas treatment for fixed properties.
        let lType: AttachmentType = pAttachment.type;
        let lCanvas: HTMLCanvasElement | null = null;
        if ('canvas' in pAttachment) {
            lType |= AttachmentType.Canvas; // Inject canvas type.
            lCanvas = pAttachment.canvas;
        }

        // Force default for attachment
        const lAttachment: AttachmentData = {
            type: lType,
            frame: null,
            name: pAttachment.name,
            clearValue: pAttachment.clearValue,
            loadOp: pAttachment.loadOp ?? 'clear', // Apply default value.
            storeOp: pAttachment.storeOp ?? 'store', // Apply default value.
            format: lFormat,
            layers: pAttachment.layers ?? 1, // Apply default value.
            baseArrayLayer: null,
            canvas: lCanvas
        };

        // Set attachment.
        this.mAttachments.set(pAttachment.name, lAttachment);

        // Set refresh flag to refresh all textures on next load.
        this.mRebuildRequested = true;
    }

    /**
     * Get attachment by name.
     * @param pName - Attachment name.
     * @param pType - Type of attachment.
     */
    public getAttachment(pName: string, pType: AttachmentType.Color): ColorAttachment;
    public getAttachment(pName: string, pType: AttachmentType.Depth | AttachmentType.Stencil): DepthStencilAttachment;
    public getAttachment(pName: string, pType: AttachmentType): DepthStencilAttachment | ColorAttachment {
        // Rebuild textures.
        if (this.mRebuildRequested) {
            this.rebuildTetures();
        }

        // Try to get attachment
        const lAttachment = this.mAttachments.get(pName);
        if (!lAttachment) {
            throw new Exception(`No attachment "${pName}" found.`, this);
        }

        // Type match bitwise.
        if ((lAttachment.type & pType) === 0) {
            throw new Exception(`Attachment "${pName}" has invalid type.`, this);
        }

        switch (pType) {
            case AttachmentType.Color:
            case AttachmentType.Canvas: {
                return new ColorAttachment(this.mGpu, <ExportAttachmentData>lAttachment);
            }
            case AttachmentType.Depth:
            case AttachmentType.Stencil: {
                return new DepthStencilAttachment(this.mGpu, <ExportAttachmentData>lAttachment);
            }
        }
    }

    /**
     * Resize all attachments.
     * @param pWidth - New width.
     * @param pHeight - New height.
     */
    public resize(pWidth: number, pHeight: number): void {
        // Only resize on actual size change.
        if (this.mSize.width === pWidth && this.mSize.height === pHeight) {
            return;
        }

        // Set size.
        this.mSize.width = pWidth;
        this.mSize.height = pHeight;

        // Apply with to all created textures.
        for (const lAttachment of this.mAttachments.values()) {
            if (lAttachment.frame !== null) {
                lAttachment.frame.width = this.mSize.width;
                lAttachment.frame.height = this.mSize.height;
            }
        }
    }

    /**
     * Group attachments by texture format.
     * @param pAttachmentList - Attachments.
     */
    private groupAttachments(pAttachmentList: Array<AttachmentData>): Array<AttachmentGroup> {
        const lGroups: Dictionary<string, AttachmentGroup> = new Dictionary<string, AttachmentGroup>();

        for (const lAttachment of pAttachmentList) {
            // Get group name by format. 
            // Exclude canvas by setting unique group names as they should never be grouped.
            let lGroupName: string = lAttachment.format;
            let lCanvas: HTMLCanvasElement | null = null;
            if ((lAttachment.type & AttachmentType.Canvas) > 0) {
                lGroupName = `CANVAS--${lAttachment.name}--${lGroupName}`;
                lCanvas = lAttachment.canvas;
            }

            // Create new group when not already created.
            if (!lGroups.has(lGroupName)) {
                lGroups.set(lGroupName, {
                    name: lGroupName,
                    format: lAttachment.format,
                    attachments: new Array<AttachmentData>(),
                    updatedNeeded: false,
                    canvas: lCanvas
                });
            }

            // Get group and add attachment.
            const lGroup = lGroups.get(lGroupName)!;
            lGroup.attachments.push(lAttachment);

            // Check for group changes only when the group is not already set for an update.
            if (!lGroup.updatedNeeded && lAttachment.frame === null) {
                lGroup.updatedNeeded = true;
            }
        }

        // Check empty attachment groups.
        for (const lGroupName of this.mAttachmentGroup.keys()) {
            if (!lGroups.has(lGroupName)) {
                // Set empty default group.
                lGroups.set(lGroupName, {
                    name: lGroupName,
                    format: 'bgra8unorm',
                    attachments: new Array<AttachmentData>(),
                    updatedNeeded: true,
                    canvas: null
                });
            }
        }

        // Check attachment count difference since last grouping.
        for (const lGroup of lGroups.values()) {
            if (lGroup.attachments.length !== this.mAttachmentGroup.get(lGroup.name)) {
                lGroup.updatedNeeded = true;

                // Update group value.
                this.mAttachmentGroup.set(lGroup.name, lGroup.attachments.length);
            }
        }

        return [...lGroups.values()];
    }

    /**
     * Rebuild textures that are outdated.
     */
    private rebuildTetures(): void {
        // Group textures.
        for (const lGroup of this.groupAttachments([...this.mAttachments.values()])) {
            // Continue when group has not been updated.
            if (!lGroup.updatedNeeded) {
                continue;
            }

            // Destory old texture.
            this.mTextureGroup.get(lGroup.name)?.destroy();

            // Build new texture or clear old one.
            if (lGroup.attachments.length > 0) {
                // Count layers of group.
                const lTextureLayerCount: number = lGroup.attachments.reduce((pCurrent, pNext) => { return pCurrent + pNext.layers; }, 0);

                // Create texture and set size and concat debug label.
                let lTexture: ITexture;
                if (lGroup.canvas !== null) {
                    const lCanvasTexture: CanvasTexture = new CanvasTexture(this.mGpu, lGroup.canvas, lGroup.format, TextureUsage.RenderAttachment | TextureUsage.TextureBinding);
                    lCanvasTexture.label = lGroup.name;
                    lCanvasTexture.width = this.mSize.width;
                    lCanvasTexture.height = this.mSize.height;
                    lCanvasTexture.label = lGroup.name;

                    lTexture = lCanvasTexture;
                } else {
                    // Create fixed texture.
                    const lFixedTexture: Texture = new Texture(this.mGpu, lGroup.format, TextureUsage.RenderAttachment | TextureUsage.TextureBinding, '2d');
                    lFixedTexture.label = lGroup.name;
                    lFixedTexture.width = this.mSize.width;
                    lFixedTexture.height = this.mSize.height;
                    lFixedTexture.layer = lTextureLayerCount;
                    lFixedTexture.label = lGroup.attachments.reduce((pCurrent, pNext) => { return `${pCurrent}${pNext.name}-`; }, '-');

                    lTexture = lFixedTexture;
                }

                // Create views from same texture.
                let lCurrentLayer: number = 0;
                for (const lAttachment of lGroup.attachments) {
                    lAttachment.frame = lTexture;
                    lAttachment.baseArrayLayer = lCurrentLayer;

                    // Increment layer.
                    lCurrentLayer += lAttachment.layers;
                }

                // Update group texture.
                this.mTextureGroup.set(lGroup.name, lTexture);
            } else {
                // Remove group texture.
                this.mTextureGroup.delete(lGroup.name);
            }
        }
    }
}

type TextureDimension = { width: number; height: number; };
type AttachmentGroup = {
    format: GPUTextureFormat;
    attachments: Array<AttachmentData>;
    updatedNeeded: boolean;
    name: string;
    canvas: HTMLCanvasElement | null;
};

type AttachmentData = {
    type: AttachmentType,
    frame: ITexture | null;
    name: string,
    clearValue: GPUColor;
    loadOp: GPULoadOp;
    storeOp: GPUStoreOp;
    format: GPUTextureFormat;
    layers: GPUIntegerCoordinate;
    baseArrayLayer: number | null;
    canvas: HTMLCanvasElement | null;
};

// Exported attachment data has never any nullish frame or canvas information.
type ExportAttachmentData = Omit<Omit<Omit<AttachmentData, 'baseArrayLayer'>, 'canvas'>, 'frame'> & {
    frame: ITexture;
    baseArrayLayer: number;
};

// Descriptive data.
export type CanvasAttachmentDescription = {
    type: AttachmentType.Color | AttachmentType.Depth | AttachmentType.Stencil,
    canvas: HTMLCanvasElement;
    name: string,
    clearValue: GPUColor;
    loadOp?: GPULoadOp;
    storeOp?: GPUStoreOp;
    format?: GPUTextureFormat;
    layers?: GPUIntegerCoordinate;
};
export type TextureAttachmentDescription = {
    type: AttachmentType.Color | AttachmentType.Depth | AttachmentType.Stencil,
    name: string,
    clearValue: GPUColor;
    loadOp?: GPULoadOp;
    storeOp?: GPUStoreOp;
    format: GPUTextureFormat;
    layers?: GPUIntegerCoordinate;
    dimension?: GPUTextureViewDimension;
};