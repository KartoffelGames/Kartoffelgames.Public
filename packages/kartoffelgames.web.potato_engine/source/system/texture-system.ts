import { GpuTexture, TextureDimension, TextureFormat, TextureUsage } from '@kartoffelgames/web-gpu';
import type { GpuTextureCopyOptions } from '../../../kartoffelgames.web.gpu/source/texture/gpu-texture.ts';
import { Texture } from '../component_item/texture.ts';
import type { GameEnvironment } from '../core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor, type GameSystemUpdateStateChanges } from '../core/game-system.ts';
import { GpuSystem } from './gpu-system.ts';

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
    private mDefaultTexture: GpuTexture | null;
    private mGpuSystem: GpuSystem | null;
    private readonly mTextureLookup: WeakMap<Texture, GpuTexture>;

    /**
     * Gets the default white texture used as a fallback when a texture is not yet loaded or fails to load.
     */
    public get defaultTexture(): GpuTexture {
        return this.mDefaultTexture!;
    }

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
        this.mTextureLookup = new WeakMap<Texture, GpuTexture>();

        // Empty default texture until created in onCreate.
        this.mDefaultTexture = null;
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
    public async getGpuTexture(pTexture: Texture): Promise<GpuTexture> {
        this.lockGate();

        // Return existing GPU texture if already uploaded.
        const lExisting: GpuTexture | undefined = this.mTextureLookup.get(pTexture);
        if (lExisting) {
            return lExisting;
        }

        // Start loading of textures.
        try {
            // Start loading texture.
            const lLoadedGpuTexture: GpuTexture = await this.generateGpuTexture(pTexture);

            // Track the texture.
            this.mTextureLookup.set(pTexture, lLoadedGpuTexture);

            return lLoadedGpuTexture;
        } catch (pError: unknown) {
            // eslint-disable-next-line no-console
            console.error('Failed to decode and upload texture:', pError);

            return this.mDefaultTexture!;
        }
    }

    /**
     * Initialize the texture system.
     */
    protected override async onCreate(): Promise<void> {
        this.mGpuSystem = this.environment.getSystem(GpuSystem);

        // TODO: Remove the defauklt texture.

        // texture data containing a 2x2 checkerboard pattern;
        const lTextureData: string = 'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdv' +
            'qGQAAAGHaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4b' +
            'Wxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOkRlc2NyaX' +
            'B0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjA' +
            'vIj48dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCjw/eHBhY2tldCBlbmQ9J3cn' +
            'Pz4slJgLAAAAFElEQVQYV2NkYGD4////fxjJ8B8ATNcI+UH3gegAAAAASUVORK5CYII=';

        // Convert the base64 string to binary data.
        const lTextureBinaryString: string = atob(lTextureData);
        const lTextureBinaryBytes: Uint8Array<ArrayBuffer> = new Uint8Array(lTextureBinaryString.length);
        for (let lByteIndex = 0; lByteIndex < lTextureBinaryString.length; lByteIndex++) {
            lTextureBinaryBytes[lByteIndex] = lTextureBinaryString.charCodeAt(lByteIndex);
        }

        // Load default texture (1x1 white pixel) to ensure a valid texture is always available.
        const lDefaultTexture: Texture = new Texture();
        lDefaultTexture.imageData = lTextureBinaryBytes.buffer;

        // Decode and upload the default texture to the GPU.
        this.mDefaultTexture = await this.generateGpuTexture(lDefaultTexture);
    }

    /**
     * Decode image data from a Texture component item and upload it to a GPU texture
     * with mipmaps generated.
     *
     * @param pTexture - The texture component item with raw image file data.
     *
     * @returns The created GPU texture with image data and mipmaps.
     */
    private async generateGpuTexture(pTexture: Texture): Promise<GpuTexture> {
        // Decode the raw file bytes (PNG, JPG, etc.) into an ImageBitmap.
        const lBlob: Blob = new Blob([pTexture.imageData]);
        const lImageBitmap: ImageBitmap = await globalThis.createImageBitmap(lBlob);

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
        const lMipMaps = await this.generateMipmaps(lImageBitmap, lWidth, lHeight, lMipCount);

        // Copy images into texture.
        lGpuTexture.copyFrom(...lMipMaps);

        // Close all bitmaps used for mip generation.
        for (const lOption of lMipMaps) {
            (<ImageBitmap>lOption.data).close();
        }

        // Close the original ImageBitmap to free memory.
        lImageBitmap.close();

        return lGpuTexture;
    }

    /**
     * Generate mipmaps for a GPU texture by progressively downscaling the source image using an OffscreenCanvas.
     *
     * @param pImage - The source image bitmap.
     * @param pGpuTexture - The GPU texture to write mipmaps to.
     * @param pWidth - The base width.
     * @param pHeight - The base height.
     * @param pMipCount - Total number of mip levels.
     */
    private async generateMipmaps(pImage: ImageBitmap, pWidth: number, pHeight: number, pMipCount: number): Promise<Array<GpuTextureCopyOptions>> {
        const lMipRenderWaiter: Array<Promise<GpuTextureCopyOptions>> = new Array<Promise<GpuTextureCopyOptions>>();

        // Generate each mip level by downscaling the previous level's image.
        for (let lMipLevel: number = 1; lMipLevel < pMipCount; lMipLevel++) {
            // Calculate dimensions for this mip level.
            const lMipWidth: number = Math.max(1, Math.floor(pWidth / Math.pow(2, lMipLevel)));
            const lMipHeight: number = Math.max(1, Math.floor(pHeight / Math.pow(2, lMipLevel)));

            // Create an OffscreenCanvas to draw the downscaled image for this mip level.
            const lCanvas: OffscreenCanvas = new OffscreenCanvas(
                Math.max(1, Math.floor(lMipWidth / Math.pow(2, lMipLevel))),
                Math.max(1, Math.floor(lMipHeight / Math.pow(2, lMipLevel)))
            );

            // Scale the source image down to the mip level dimensions.
            const lContext: OffscreenCanvasRenderingContext2D = lCanvas.getContext('2d')!;
            lContext.drawImage(pImage, 0, 0, pWidth, pHeight, 0, 0, lMipWidth, lMipHeight);

            // Queue the mip level copy operation and store the ImageBitmap promise for cleanup.
            lMipRenderWaiter.push(createImageBitmap(lCanvas).then((pBitmap) => {
                return {
                    data: pBitmap,
                    mipLevel: lMipLevel,
                    targetOrigin: { x: 0, y: 0, z: 0 }
                };
            }));
        }

        // Wait for all mip level renderings to complete and get their ImageBitmaps for cleanup.
        return Promise.all(lMipRenderWaiter);
    }
}

/**
 * Tracking entry for a GPU texture linked to a component texture via WeakRef.
 */
type TextureEntry = {
    weakRef: WeakRef<Texture>;
    gpuTexture: GpuTexture;
};
