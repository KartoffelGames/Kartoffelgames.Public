import { GpuTexture, TextureDimension, TextureFormat, TextureUsage } from '@kartoffelgames/web-gpu';
import type { Texture } from '../component_item/texture.ts';
import type { GameEnvironment } from '../core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor, type GameSystemUpdateStateChanges } from '../core/game-system.ts';
import { GpuSystem } from './gpu-system.ts';

/**
 * Tracking entry for a GPU texture linked to a component texture via WeakRef.
 */
type TextureEntry = {
    weakRef: WeakRef<Texture>;
    gpuTexture: GpuTexture;
};

/**
 * Texture system that manages the loading and unloading of textures.
 *
 * Decodes image data from Texture component items, creates GPU textures with mipmaps,
 * and provides an interface for other systems to access GPU textures.
 *
 * Uses WeakRef tracking to automatically dispose GPU textures when their
 * corresponding Texture component item is garbage collected.
 */
export class TextureSystem extends GameSystem {
    private mGpuSystem: GpuSystem | null;
    private mPendingTextures: Set<Texture>;
    private mTextureEntries: Array<TextureEntry>;
    private mTextureLookup: WeakMap<Texture, GpuTexture>;

    /**
     * Gets the system types this system depends on.
     */
    public override get dependentSystemTypes(): Array<GameSystemConstructor<GameSystem>> {
        return [GpuSystem];
    }

    /**
     * Constructor of the texture system.
     *
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super('Texture', pEnvironment);

        // Null dependencies.
        this.mGpuSystem = null;

        // Texture tracking.
        this.mTextureEntries = new Array<TextureEntry>();
        this.mTextureLookup = new WeakMap<Texture, GpuTexture>();
        this.mPendingTextures = new Set<Texture>();
    }

    /**
     * Get the GPU texture for a given texture component item.
     *
     * If the texture has already been decoded and uploaded, returns the GPU texture.
     * If not, queues the texture for processing and returns null.
     * The GPU texture will be available after the next update cycle.
     *
     * @param pTexture - The texture component item to get the GPU texture for.
     *
     * @returns The GPU texture, or null if the texture is not yet available.
     */
    public getGpuTexture(pTexture: Texture): GpuTexture | null {
        this.lockGate();

        // Return existing GPU texture if already uploaded.
        const lExisting: GpuTexture | undefined = this.mTextureLookup.get(pTexture);
        if (lExisting) {
            return lExisting;
        }

        // Queue for processing if not already pending.
        if (!this.mPendingTextures.has(pTexture)) {
            this.mPendingTextures.add(pTexture);
            this.update();
        }

        return null;
    }

    /**
     * Initialize the texture system.
     */
    protected override async onCreate(): Promise<void> {
        this.mGpuSystem = this.environment.getSystem(GpuSystem);
    }

    /**
     * Process pending textures and cleanup dead references.
     */
    protected override async onUpdate(_pStateChanges: GameSystemUpdateStateChanges): Promise<void> {
        // Process pending texture uploads.
        if (this.mPendingTextures.size > 0) {
            for (const lTexture of this.mPendingTextures) {
                // Skip textures with empty image data.
                if (lTexture.imageData.byteLength === 0) {
                    continue;
                }

                try {
                    const lGpuTexture: GpuTexture = await this.decodeAndUpload(lTexture);

                    // Track the texture.
                    this.mTextureEntries.push({
                        weakRef: new WeakRef<Texture>(lTexture),
                        gpuTexture: lGpuTexture
                    });
                    this.mTextureLookup.set(lTexture, lGpuTexture);
                } catch (pError: unknown) {
                    console.error('[TextureSystem] Failed to decode and upload texture:', pError);
                }
            }

            this.mPendingTextures.clear();
        }

        // Cleanup dead WeakRef entries.
        this.cleanupDeadReferences();
    }

    /**
     * Cleanup texture entries whose Texture component item has been garbage collected.
     * Iterates in reverse to safely splice during iteration.
     */
    private cleanupDeadReferences(): void {
        for (let lIndex: number = this.mTextureEntries.length - 1; lIndex >= 0; lIndex--) {
            const lEntry: TextureEntry = this.mTextureEntries[lIndex];

            // Check if the Texture reference is still alive.
            if (lEntry.weakRef.deref() === undefined) {
                // Texture was garbage collected, dispose the GPU texture.
                lEntry.gpuTexture.deconstruct();
                this.mTextureEntries.splice(lIndex, 1);
            }
        }
    }

    /**
     * Decode image data from a Texture component item and upload it to a GPU texture
     * with mipmaps generated.
     *
     * @param pTexture - The texture component item with raw image file data.
     *
     * @returns The created GPU texture with image data and mipmaps.
     */
    private async decodeAndUpload(pTexture: Texture): Promise<GpuTexture> {
        // Decode the raw file bytes (PNG, JPG, etc.) into an ImageBitmap.
        const lBlob: Blob = new Blob([pTexture.imageData]);
        const lImageBitmap: ImageBitmap = await createImageBitmap(lBlob);

        const lWidth: number = lImageBitmap.width;
        const lHeight: number = lImageBitmap.height;

        // Calculate mip level count.
        const lMipCount: number = 1 + Math.floor(Math.log2(Math.max(lWidth, lHeight)));

        // Create GPU texture.
        const lGpuTexture: GpuTexture = new GpuTexture(this.mGpuSystem!.gpu, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });

        lGpuTexture.width = lWidth;
        lGpuTexture.height = lHeight;
        lGpuTexture.depth = 1;
        lGpuTexture.mipCount = lMipCount;
        lGpuTexture.extendUsage(TextureUsage.TextureBinding | TextureUsage.RenderAttachment);

        // Copy base mip level (level 0) from the decoded image.
        lGpuTexture.copyFrom(lImageBitmap);

        // Generate mipmaps by progressively downscaling the image.
        await this.generateMipmaps(lImageBitmap, lGpuTexture, lWidth, lHeight, lMipCount);

        // Close the original ImageBitmap to free memory.
        lImageBitmap.close();

        return lGpuTexture;
    }

    /**
     * Generate mipmaps for a GPU texture by progressively downscaling the source image
     * using an OffscreenCanvas.
     *
     * @param pImage - The source image bitmap.
     * @param pGpuTexture - The GPU texture to write mipmaps to.
     * @param pWidth - The base width.
     * @param pHeight - The base height.
     * @param pMipCount - Total number of mip levels.
     */
    private async generateMipmaps(pImage: ImageBitmap, pGpuTexture: GpuTexture, pWidth: number, pHeight: number, pMipCount: number): Promise<void> {
        for (let lMipLevel: number = 1; lMipLevel < pMipCount; lMipLevel++) {
            const lMipWidth: number = Math.max(1, Math.floor(pWidth / Math.pow(2, lMipLevel)));
            const lMipHeight: number = Math.max(1, Math.floor(pHeight / Math.pow(2, lMipLevel)));

            // Scale the source image down to the mip level dimensions.
            const lCanvas: OffscreenCanvas = new OffscreenCanvas(lMipWidth, lMipHeight);
            const lContext: OffscreenCanvasRenderingContext2D = lCanvas.getContext('2d')!;
            lContext.drawImage(pImage, 0, 0, pWidth, pHeight, 0, 0, lMipWidth, lMipHeight);

            // Create an ImageBitmap from the canvas and copy to the GPU texture at this mip level.
            const lMipBitmap: ImageBitmap = await createImageBitmap(lCanvas);
            pGpuTexture.copyFrom({
                data: lMipBitmap,
                mipLevel: lMipLevel
            });

            lMipBitmap.close();
        }
    }
}
