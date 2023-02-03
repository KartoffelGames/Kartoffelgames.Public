import { Dictionary } from '@kartoffelgames/core.data';
import { Gpu } from '../gpu';

export abstract class BaseAttachment<TAttachment extends GPURenderPassColorAttachment | GPURenderPassDepthStencilAttachment> {
    protected readonly mAttachments: Dictionary<string, AttachmentTexture>;

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height
     * @param pAttachmentDescriptions - Attachments.
     */
    public constructor(pGpu: Gpu, pWidth: number, pHeight: number, pAttachmentDescriptions: Array<AttachmentDescription>) {
        this.mAttachments = new Dictionary<string, AttachmentTexture>();

        // Fill in defaults.
        const lDefaultFilledAttachmentList: Array<AttachmentDescriptionWithDefault> = this.forceAttachmentDefault(pAttachmentDescriptions);

        // Group attachments by GPUTextureFormat.
        for (const [lFormat, lAttachmentList] of this.groupAttachments(lDefaultFilledAttachmentList)) {
            // Count layers.
            const lLayerCount: number = lAttachmentList.reduce((pCurrent, pNext) => { return pCurrent + pNext.layerCount; }, 0);

            // Create texture.
            const lTexture: GPUTexture = pGpu.device.createTexture({
                size: [pWidth, pHeight, lLayerCount],
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
                format: lFormat,
            });

            // Create views from same texture.
            let lCurrentLayer: number = 0;
            for (const lAttachment of lAttachmentList) {
                // Create view from texture.
                const lView: GPUTextureView = lTexture.createView({
                    dimension: lAttachment.dimension,
                    baseArrayLayer: lCurrentLayer,
                    arrayLayerCount: lAttachment.layerCount,
                });

                // Create attachment information.
                this.mAttachments.set(lAttachment.name, {
                    texture: lTexture,
                    view: lView,
                    clearValue: lAttachment.clearValue,
                    loadOp: lAttachment.loadOp,
                    storeOp: lAttachment.storeOp,
                    format: lFormat,
                    dimension: lAttachment.dimension,
                    arrayLayerCount: lAttachment.layerCount,
                    baseArrayLayer: lCurrentLayer
                });

                // Increment layer.
                lCurrentLayer += lAttachment.layerCount;
            }
        }
    }

    /**
     * Fill in defaults for attachments.
     * @param pAttachmentList - Attachments.
     */
    private forceAttachmentDefault(pAttachmentList: Array<AttachmentDescription>): Array<AttachmentDescriptionWithDefault> {
        const lFilledDefaultList: Array<AttachmentDescriptionWithDefault> = new Array<AttachmentDescriptionWithDefault>();

        for (const lAttachment of pAttachmentList) {
            lFilledDefaultList.push({
                name: lAttachment.name,
                clearValue: lAttachment.clearValue,
                loadOp: lAttachment.loadOp || 'clear',
                storeOp: lAttachment.storeOp || 'store',
                format: lAttachment.format,
                layerCount: lAttachment.layerCount || 1,
                dimension: lAttachment.dimension || '2d'
            });
        }

        return lFilledDefaultList;
    }

    /**
     * Group attachments by texture format.
     * @param pAttachmentList - Attachments.
     */
    private groupAttachments(pAttachmentList: Array<AttachmentDescriptionWithDefault>): Dictionary<GPUTextureFormat, Array<AttachmentDescriptionWithDefault>> {
        const lGroups: Dictionary<GPUTextureFormat, Array<AttachmentDescriptionWithDefault>> = new Dictionary<GPUTextureFormat, Array<AttachmentDescriptionWithDefault>>();

        for (const lAttachment of pAttachmentList) {
            // Create new group.
            if (!lGroups.has(lAttachment.format)) {
                lGroups.set(lAttachment.format, new Array<AttachmentDescriptionWithDefault>());
            }

            // Add attachment to group.
            lGroups.get(lAttachment.format)?.push(lAttachment);
        }

        return lGroups;
    }

    /**
     * Get attachment as render pass attachment.
     * @param pName - Attachment name.
     */
    public abstract asAttachment(pName: string): TAttachment | undefined;
}

export type AttachmentDescription = {
    name: string,
    clearValue: GPUColor | number;
    loadOp?: GPULoadOp;
    storeOp?: GPUStoreOp;
    format: GPUTextureFormat;
    layerCount?: GPUIntegerCoordinate;
    dimension?: GPUTextureViewDimension;
};

type AttachmentDescriptionWithDefault = Required<AttachmentDescription>;

type AttachmentTexture = {
    texture: GPUTexture;
    view: GPUTextureView;
    clearValue: GPUColor | number;
    loadOp: GPULoadOp;
    storeOp: GPUStoreOp;

    format: GPUTextureFormat;
    dimension: GPUTextureViewDimension;
    arrayLayerCount: GPUIntegerCoordinate;
    baseArrayLayer: number,
}

