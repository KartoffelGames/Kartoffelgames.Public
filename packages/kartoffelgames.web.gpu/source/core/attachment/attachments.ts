import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Gpu } from '../gpu';
import { Texture } from '../resource/texture/texture';
import { TextureUsage } from '../resource/texture/texture-usage.enum';
import { AttachmentType } from './attachment-type.enum';
import { ColorAttachment } from './type/color-attachment';
import { DepthStencilAttachment } from './type/depth-stencil-attachment';

export class Attachments {
    private readonly mAttachments: Dictionary<string, AttachmentData>;
    private readonly mGpu: Gpu;
    private mRebuildRequested: boolean;
    private readonly mSize: TextureDimension;

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: Gpu,) {
        this.mAttachments = new Dictionary<string, AttachmentData>();
        this.mGpu = pGpu;
        this.mRebuildRequested = false;
        this.mSize = { width: 1, height: 1 };
    }

    /**
     * Add attachment. Forces rebuild of some groups.
     * @param pAttachment - Attachment.
     */
    public addAttachment(pAttachment: CanvasAttachmentDescription | TextureAttachmentDescription): void {
        // Auto detect format.
        const lFormat: GPUTextureFormat = pAttachment.format ?? window.navigator.gpu.getPreferredCanvasFormat();

        // Init canvas context.
        let lFrame: GPUCanvasContext | null = null;
        if ('canvas' in pAttachment) {
            lFrame = pAttachment.canvas.getContext('webgpu')!;
            lFrame.configure({
                device: this.mGpu.device,
                format: lFormat,
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
                alphaMode: 'opaque'
            });
        }

        // Auto detect type.
        const lType: AttachmentType = ('canvas' in pAttachment) ? AttachmentType.Canvas : pAttachment.type;

        // Auto detect layer.
        const lLayer: number = ('canvas' in pAttachment) ? 1 : pAttachment.layers ?? 1;

        // Auto detect dimension.
        const lDimension: GPUTextureViewDimension = ('canvas' in pAttachment) ? '2d' : pAttachment.dimension ?? '2d';

        // Force default for attachment
        const lAttachment: AttachmentData = {
            type: lType,
            frame: <any>lFrame,
            name: pAttachment.name,
            clearValue: pAttachment.clearValue,
            loadOp: pAttachment.loadOp ?? 'clear',
            storeOp: pAttachment.storeOp ?? 'store',
            format: lFormat,
            layers: lLayer,
            dimension: lDimension,
            baseArrayLayer: -1
        };

        // Filter dublicates.
        if (this.mAttachments.has(pAttachment.name)) {
            throw new Exception(`Attachment "${pAttachment.name}" already exists.`, this);
        }

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
    public getAttachment(pName: string, pType: AttachmentType.Color | AttachmentType.Canvas): ColorAttachment;
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
        // Set size.
        this.mSize.width = pWidth;
        this.mSize.height = pHeight;

        // Apply with to all created textures.
        for (const lAttachment of this.mAttachments.values()) {
            if (lAttachment.frame !== null) {
                // Difference between texture and context.
                if (lAttachment.type === AttachmentType.Canvas) {
                    const lCanvas: HTMLCanvasElement = <HTMLCanvasElement>(<GPUCanvasContext>lAttachment.frame).canvas;
                    lCanvas.width = this.mSize.width;
                    lCanvas.height = this.mSize.height;
                } else {
                    const lTexture: Texture = lAttachment.frame;
                    lTexture.width = this.mSize.width;
                    lTexture.height = this.mSize.height;
                }
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
            if (lAttachment.type === AttachmentType.Canvas) {
                lGroupName = `CANVAS--${lAttachment.name}--${lGroupName}`;
            }

            // Create new group when not already created.
            if (!lGroups.has(lGroupName)) {
                lGroups.set(lGroupName, { format: lAttachment.format, attachments: new Array<AttachmentData>(), updatedNeeded: false });
            }

            // Get group and add attachment.
            const lGroup = lGroups.get(lGroupName)!;
            lGroup.attachments.push(lAttachment);

            // Check for group changes only when the group is not already set for an update.
            if (!lGroup.updatedNeeded && lAttachment.frame === null) {
                lGroup.updatedNeeded = true;
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
            if (lGroup.updatedNeeded) {
                // Count layers of group.
                const lTextureLayerCount: number = lGroup.attachments.reduce((pCurrent, pNext) => { return pCurrent + pNext.layers; }, 0);

                // Create texture and set size and concat debug label.
                const lTexture: Texture = new Texture(this.mGpu, lGroup.format, TextureUsage.RenderAttachment | TextureUsage.TextureBinding, '3d');
                lTexture.width = this.mSize.width;
                lTexture.height = this.mSize.height;
                lTexture.layer = lTextureLayerCount;
                lTexture.label = lGroup.attachments.reduce((pCurrent, pNext) => { return `${pCurrent}${pNext.name}-`; }, '-');

                let lOldTexture: Texture | null = null;

                // Create views from same texture.
                let lCurrentLayer: number = 0;
                for (const lAttachment of lGroup.attachments) {
                    if (lAttachment.frame !== null) {
                        lOldTexture = <Texture>lAttachment.frame;
                    }

                    lAttachment.frame = lTexture;
                    lAttachment.baseArrayLayer = lCurrentLayer;

                    // Increment layer.
                    lCurrentLayer += lAttachment.layers;
                }

                // Destory old texture.
                if(lOldTexture){
                    // Async but not needed sync.
                    lOldTexture.destroy();
                }
            }
        }
    }
}

type TextureDimension = { width: number; height: number; };
type AttachmentGroup = { format: GPUTextureFormat; attachments: Array<AttachmentData>; updatedNeeded: boolean; };

// Attachment data.
type CanvasAttachmentData = Omit<Omit<GeneralAttachmentData, 'frame'>, 'type'> & { type: AttachmentType.Canvas, frame: GPUCanvasContext; };
type TextureAttachmentData = Omit<Omit<GeneralAttachmentData, 'frame'>, 'type'> & { type: AttachmentType.Color | AttachmentType.Depth | AttachmentType.Stencil; frame: Texture | null; };
type AttachmentData = CanvasAttachmentData | TextureAttachmentData;
type GeneralAttachmentData = {
    type: AttachmentType,
    frame: Texture | GPUCanvasContext | null;
    name: string,
    clearValue: GPUColor;
    loadOp: GPULoadOp;
    storeOp: GPUStoreOp;
    format: GPUTextureFormat;
    layers: GPUIntegerCoordinate;
    dimension: GPUTextureViewDimension;
    baseArrayLayer: number;
};

// Exported attachment data has never any nullish frame.
type ExportAttachmentData = Omit<GeneralAttachmentData, 'frame'> & {
    frame: Texture | GPUCanvasContext;
};

// Descriptive data.
export type CanvasAttachmentDescription = {
    canvas: HTMLCanvasElement;
    name: string,
    clearValue: GPUColor;
    loadOp?: GPULoadOp;
    storeOp?: GPUStoreOp;
    format?: GPUTextureFormat;
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