import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuDependent } from '../gpu/gpu-dependent';
import { GpuTypes } from '../gpu/gpu-device';

export abstract class RenderTargets<TGpuTypes extends GpuTypes = GpuTypes> extends GpuDependent<TGpuTypes> {
    private readonly mCanvas: Dictionary<string, HTMLCanvasElement>;
    private readonly mMultisampleLevel: number;
    private readonly mSize: TextureDimension;
    private readonly mTargetTextures: Dictionary<string, TGpuTypes['frameBufferTexture']>;

    /**
     * Render target height.
     */
    public get height(): number {
        return this.mSize.height;
    } set height(pValue: number) {
        this.resize(this.mSize.width, pValue);
    }

    /**
     * Render target multisample level.
     */
    public get multiSampleLevel(): number {
        return this.mMultisampleLevel;
    }

    /**
     * Render target height.
     */
    public get width(): number {
        return this.mSize.width;
    } set width(pValue: number) {
        this.resize(pValue, this.mSize.height);
    }

    /**
     * Constuctor.
     * @param pDevice - Gpu device reference.
     * @param pWidth - Textures width.
     * @param pHeight - Textures height.
     * @param pMultisampleLevel - Multisample level of  all textures.
     */
    public constructor(pDevice: TGpuTypes['gpuDevice'], pWidth: number, pHeight: number, pMultisampleLevel: number) {
        super(pDevice);

        // Set "fixed" 
        this.mSize = { width: pWidth, height: pHeight };
        this.mMultisampleLevel = pMultisampleLevel;

        // Saved.
        this.mTargetTextures = new Dictionary<string, TGpuTypes['frameBufferTexture']>();
        this.mCanvas = new Dictionary<string, HTMLCanvasElement>();
    }

    /**
     * Add and create render target texture.
     * @param pName - Target name.
     * @param pType - Type of target.
     */
    public add(pName: string, pType: RenderTargetType): TGpuTypes['frameBufferTexture'] {
        switch (pType) {
            case 'Canvas': {
                const lCanvasTextureLayout: TGpuTypes['textureMemoryLayout'] = this.createCanvasMemoryLayout();
                return this.addCanvasTexture(pName, lCanvasTextureLayout);
            }
            case 'Color': {
                const lColorTextureLayout: TGpuTypes['textureMemoryLayout'] = this.createColorMemoryLayout();
                return this.addFrameBufferTexture(pName, lColorTextureLayout);
            }
            case 'Depth': {
                const lColorTextureLayout: TGpuTypes['textureMemoryLayout'] = this.createDepthMemoryLayout();
                return this.addFrameBufferTexture(pName, lColorTextureLayout);
            }
        }
    }

    /**
     * Get canvas of texture.
     * @param pName - Canvas name.
     */
    public getCanvasOf(pName: string): HTMLCanvasElement {
        // Validate existing canvas.
        if (this.mCanvas.has(pName)) {
            throw new Exception(`Canvas "${pName}" not found.`, this);
        }

        return this.mCanvas.get(pName)!;
    }

    /**
     * Get texture.
     * @param pName - texture name.
     */
    public getTextureOf(pName: string): TGpuTypes['frameBufferTexture'] {
        // Validate existing canvas.
        if (this.mTargetTextures.has(pName)) {
            throw new Exception(`Canvas "${pName}" not found.`, this);
        }

        return this.mTargetTextures.get(pName)!;
    }

    /**
     * Create frame buffer from canvas.
     * @param pName - Canvas name.
     * @param pMemoryLayout - Canvas texture memory layout.
     */
    private addCanvasTexture(pName: string, pMemoryLayout: TGpuTypes['textureMemoryLayout']): TGpuTypes['frameBufferTexture'] {
        // Validate existing textures.
        if (this.mTargetTextures.has(pName)) {
            throw new Exception(`Texture "${pName}" already exists.`, this);
        }

        // Create sized canvas.
        const lCanvas: HTMLCanvasElement = document.createElement('canvas');
        lCanvas.width = this.mSize.width;
        lCanvas.height = this.mSize.height;

        // Save canvas.
        this.mCanvas.set(pName, lCanvas);

        // Create new canvas texture.
        const lTexture: TGpuTypes['frameBufferTexture'] = pMemoryLayout.create(lCanvas);
        lTexture.multiSampleLevel = this.mMultisampleLevel;

        this.mTargetTextures.set(pName, lTexture);

        return lTexture;
    }

    /**
     * Create frame buffer render target.
     * @param pName - Frame buffer name.
     * @param pMemoryLayout - Frame buffer memory layout.
     */
    private addFrameBufferTexture(pName: string, pMemoryLayout: TGpuTypes['textureMemoryLayout']): TGpuTypes['frameBufferTexture'] {
        // Validate existing textures.
        if (this.mTargetTextures.has(pName)) {
            throw new Exception(`Texture "${pName}" already exists.`, this);
        }

        // Create new texture and assign multisample level.
        const lTexture: TGpuTypes['frameBufferTexture'] = pMemoryLayout.create(this.mSize.height, this.mSize.width, 1);
        lTexture.multiSampleLevel = this.mMultisampleLevel;

        this.mTargetTextures.set(pName, lTexture);

        return lTexture;
    }

    /**
     * Resize all textures.
     * @param pWidth - Textures width.
     * @param pHeight - Textures height.
     */
    private resize(pWidth: number, pHeight: number): void {
        // Update size.
        this.mSize.width = pWidth;
        this.mSize.width = pHeight;

        // Update frame buffer sizes.
        for (const lTexture of this.mTargetTextures.values()) {
            lTexture.height = pHeight;
            lTexture.height = pWidth;
        }
    }

    /**
     * Create layout for a canvas texture.
     */
    protected abstract createCanvasMemoryLayout(): TGpuTypes['textureMemoryLayout'];

    /**
     * Create layout for a color texture.
     */
    protected abstract createColorMemoryLayout(): TGpuTypes['textureMemoryLayout'];

    /**
     * Create layout for a depth texture.
     */
    protected abstract createDepthMemoryLayout(): TGpuTypes['textureMemoryLayout'];
}

type TextureDimension = { width: number; height: number; };

type RenderTargetType = 'Canvas' | 'Color' | 'Depth';