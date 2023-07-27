import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuDependent } from '../gpu/gpu-dependent';
import { GpuTypes } from '../gpu/gpu-device';

export abstract class RenderTargets<TGpuTypes extends GpuTypes> extends GpuDependent<TGpuTypes> {
    private readonly mMultiSampleLevel: number;
    private readonly mSize: TextureDimension;
    private readonly mTargetTextures: Dictionary<string, TGpuTypes['frameBufferTexture']>;
    private readonly mCanvas: Dictionary<string, HTMLCanvasElement>;

    /**
     * Render target height.
     */
    public get height(): number {
        return this.mSize.height;
    } set height(pValue: number) {
        this.resize(this.mSize.width, pValue);
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
        this.mMultiSampleLevel = pMultisampleLevel;

        // Saved.
        this.mTargetTextures = new Dictionary<string, TGpuTypes['frameBufferTexture']>();
        this.mCanvas = new Dictionary<string, HTMLCanvasElement>();
    }

    /**
     * Create frame buffer render target.
     * @param pName - Frame buffer name.
     * @param pMemoryLayout - Frame buffer memory layout.
     */
    public addFrameBuffer(pName: string, pMemoryLayout: TGpuTypes['textureMemoryLayout']): void {
        // Validate existing textures.
        if (this.mTargetTextures.has(pName)) {
            throw new Exception(`Texture "${pName}" already exists.`, this);
        }

        // Create new texture and assign multisample level.
        const lTexture: TGpuTypes['frameBufferTexture'] = pMemoryLayout.create(this.mSize.height, this.mSize.width, 1);
        lTexture.multiSampleLevel = this.mMultiSampleLevel;

        this.mTargetTextures.set(pName, lTexture);
    }

    /**
     * Create frame buffer from canvas.
     * @param pName - Canvas name.
     * @param pMemoryLayout - Canvas texture memory layout.
     */
    public addCanvas(pName: string, pMemoryLayout: TGpuTypes['textureMemoryLayout']): void {
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
        lTexture.multiSampleLevel = this.mMultiSampleLevel;

        this.mTargetTextures.set(pName, lTexture);
    }

    /**
     * Get canvas of texture.
     * @param pName - Canvas name.
     */
    public getCanvas(pName: string): HTMLCanvasElement {
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
    public getTargetTexture(pName: string): TGpuTypes['frameBufferTexture'] {
        // Validate existing canvas.
        if (this.mTargetTextures.has(pName)) {
            throw new Exception(`Canvas "${pName}" not found.`, this);
        }

        return this.mTargetTextures.get(pName)!;
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
}

type TextureDimension = { width: number; height: number; };