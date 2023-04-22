import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Gpu } from '../gpu';
import { CanvasTexture } from '../resource/texture/canvas-texture';
import { ITexture } from '../resource/texture/i-texture.interface';
import { Texture } from '../resource/texture/texture';
import { TextureUsage } from '../resource/texture/texture-usage.enum';
import { AttachmentType } from './attachment-type.enum';
import { Attachment } from './type/attachment';

export class Attachments {
    private readonly mAttachmentGroup: Dictionary<string, number>;
    private readonly mAttachments: Dictionary<string, AttachmentData>;
    private readonly mGpu: Gpu;
    private readonly mMultiSampleLevel: number;
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
    public constructor(pGpu: Gpu, pMultiSampleLevel: number = 1) {
        this.mAttachments = new Dictionary<string, AttachmentData>();
        this.mAttachmentGroup = new Dictionary<string, number>();
        this.mTextureGroup = new Dictionary<string, ITexture>();
        this.mGpu = pGpu;
        this.mRebuildRequested = false;
        this.mSize = { width: 1, height: 1 };
        this.mMultiSampleLevel = pMultiSampleLevel;
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

        // Auto detect format.
        const lFormat: GPUTextureFormat = pAttachment.format ?? window.navigator.gpu.getPreferredCanvasFormat();

        // Special canvas treatment for fixed properties.
        let lType: AttachmentType = pAttachment.type;
        let lCanvas: HTMLCanvasElement | null = null;
        if ('canvas' in pAttachment) {
            lType |= AttachmentType.Canvas; // Inject canvas type.
            lCanvas = pAttachment.canvas;
        }

        // Apply default value for layer count.
        const lLayerCount: number = (<TextureAttachmentDescription>pAttachment).layers ?? 1;

        // Force default for attachment
        const lAttachment: AttachmentData = {
            type: lType,
            name: pAttachment.name,
            format: lFormat,
            layers: lLayerCount,
            canvas: lCanvas,
            attachment: new Attachment(this.mGpu, lFormat, lLayerCount)
        };

        // Set attachment.
        this.mAttachments.set(pAttachment.name, lAttachment);

        // Set refresh flag to refresh all textures on next load.
        this.mRebuildRequested = true;
    }

    /**
     * Get attachment by name.
     * @param pName - Attachment name.
     */
    public getAttachment(pName: string): Attachment {
        // Rebuild textures.
        if (this.mRebuildRequested) {
            this.rebuildTetures();
        }

        // Try to get attachment
        const lAttachment = this.mAttachments.get(pName);
        if (!lAttachment) {
            throw new Exception(`No attachment "${pName}" found.`, this);
        }

        // Read cached attachments.
        return lAttachment.attachment;
    }

    /**
     * Check attachment by name.
     * @param pName - Attachment name.
     */
    public hasAttachment(pName: string): boolean {
        return this.mAttachments.has(pName);
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
        for (const lTexture of this.mTextureGroup.values()) {
            lTexture.width = this.mSize.width;
            lTexture.height = this.mSize.height;
        }
    }

    /**
     * Group attachments by texture format.
     * @param pAttachmentList - Attachments.
     */
    private groupAttachments(pAttachmentList: Array<AttachmentData>): Array<AttachmentGroup> {
        const lGroups: Dictionary<string, AttachmentGroup> = new Dictionary<string, AttachmentGroup>();

        for (const lAttachment of pAttachmentList) {
            // Get group name by format and multisamples.         
            let lGroupName: string = `Format: ${lAttachment.format}`;

            // Exclude canvas by setting unique group names as they should never be grouped.
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
            lGroups.get(lGroupName)!.attachments.push(lAttachment);
        }

        // Groups cant be empty, as there is no detele attachment.

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
                    lFixedTexture.multiSampleLevel = this.mMultiSampleLevel;

                    lTexture = lFixedTexture;
                }

                // Create views from same texture.
                let lCurrentLayer: number = 0;
                for (const lAttachment of lGroup.attachments) {
                    // Update attachment texture.
                    lAttachment.attachment.updateTexture(lTexture, lCurrentLayer);

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

        this.mRebuildRequested = false;
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
    name: string,
    format: GPUTextureFormat;
    layers: GPUIntegerCoordinate;
    canvas: HTMLCanvasElement | null;
    attachment: Attachment;
};

// Descriptive data.
export type CanvasAttachmentDescription = {
    type: AttachmentType.Color | AttachmentType.Depth | AttachmentType.Stencil,
    canvas: HTMLCanvasElement;
    name: string,
    format?: GPUTextureFormat;
};
export type TextureAttachmentDescription = {
    type: AttachmentType.Color | AttachmentType.Depth | AttachmentType.Stencil,
    name: string,
    format: GPUTextureFormat;
    layers?: GPUIntegerCoordinate;
    dimension?: GPUTextureViewDimension;
};