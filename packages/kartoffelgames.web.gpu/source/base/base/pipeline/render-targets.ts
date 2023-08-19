import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { AccessMode } from '../../constant/access-mode.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { TextureBindType } from '../../constant/texture-bind-type.enum';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { TextureMemoryLayout } from '../memory_layout/texture-memory-layout';
import { CanvasTexture } from '../texture/canvas-texture';
import { FrameBufferTexture } from '../texture/frame-buffer-texture';

export class RenderTargets extends GpuObject {
    private readonly mMultisampleLevel: number;
    private readonly mSize: TextureSize;
    private readonly mTargetTextures: Dictionary<string, FrameBufferTexture | CanvasTexture>;

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
    public constructor(pDevice: GpuDevice, pWidth: number, pHeight: number, pMultisampleLevel: number) {
        super(pDevice);

        // Set "fixed" 
        this.mSize = { width: pWidth, height: pHeight };
        this.mMultisampleLevel = pMultisampleLevel;

        // Saved.
        this.mTargetTextures = new Dictionary<string, FrameBufferTexture | CanvasTexture>();
    }

    /**
     * Add and create render target texture.
     * @param pName - Target name.
     * @param pType - Type of target.
     */
    public add(pName: string, pType: RenderTargetType): FrameBufferTexture | CanvasTexture {
        switch (pType) {
            case 'Canvas': {
                const lCanvasTextureLayout: TextureMemoryLayout = this.createCanvasMemoryLayout();
                return this.addCanvasTexture(pName, lCanvasTextureLayout);
            }
            case 'Color': {
                const lColorTextureLayout: TextureMemoryLayout = this.createColorMemoryLayout();
                return this.addFrameBufferTexture(pName, lColorTextureLayout);
            }
            case 'Depth': {
                const lColorTextureLayout: TextureMemoryLayout = this.createDepthMemoryLayout();
                return this.addFrameBufferTexture(pName, lColorTextureLayout);
            }
        }
    }

    /**
     * Get texture.
     * @param pName - texture name.
     */
    public getTextureOf(pName: string): FrameBufferTexture | CanvasTexture {
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
    private addCanvasTexture(pName: string, pMemoryLayout: TextureMemoryLayout): CanvasTexture {
        // Validate existing textures.
        if (this.mTargetTextures.has(pName)) {
            throw new Exception(`Texture "${pName}" already exists.`, this);
        }

        // Create new canvas texture.
        const lTexture: CanvasTexture = pMemoryLayout.createCanvasTexture(this.mSize.width, this.mSize.height);

        // Save canvas.
        this.mTargetTextures.set(pName, lTexture);

        return lTexture;
    }

    /**
     * Create frame buffer render target.
     * @param pName - Frame buffer name.
     * @param pMemoryLayout - Frame buffer memory layout.
     */
    private addFrameBufferTexture(pName: string, pMemoryLayout: TextureMemoryLayout): FrameBufferTexture {
        // Validate existing textures.
        if (this.mTargetTextures.has(pName)) {
            throw new Exception(`Texture "${pName}" already exists.`, this);
        }

        // Create new texture and assign multisample level.
        const lTexture: FrameBufferTexture = pMemoryLayout.createFrameBufferTexture(this.mSize.height, this.mSize.width, 1);
        lTexture.multiSampleLevel = this.mMultisampleLevel;

        this.mTargetTextures.set(pName, lTexture);

        return lTexture;
    }

    /**
     * Create layout for a canvas texture.
     */
    private createCanvasMemoryLayout(): TextureMemoryLayout {
        return new TextureMemoryLayout(this.device, {
            dimension: TextureDimension.TwoDimension,
            format: TextureFormat.RedGreenBlueAlpha,
            bindType: TextureBindType.RenderTarget,
            multisampled: false,
            access: AccessMode.Write | AccessMode.Read,
            memoryIndex: null,
            name: '',
            visibility: ComputeStage.Fragment
        });
    }

    /**
     * Create layout for a color texture.
     */
    private createColorMemoryLayout(): TextureMemoryLayout {
        return new TextureMemoryLayout(this.device, {
            dimension: TextureDimension.TwoDimension,
            format: TextureFormat.RedGreenBlueAlpha,
            bindType: TextureBindType.RenderTarget,
            multisampled: this.mMultisampleLevel > 1,
            access: AccessMode.Write | AccessMode.Read,
            memoryIndex: null,
            name: '',
            visibility: ComputeStage.Fragment
        });
    }

    /**
     * Create layout for a depth texture.
     */
    private createDepthMemoryLayout(): TextureMemoryLayout {
        return new TextureMemoryLayout(this.device, {
            dimension: TextureDimension.TwoDimension,
            format: TextureFormat.Depth,
            bindType: TextureBindType.RenderTarget,
            multisampled: this.mMultisampleLevel > 1,
            access: AccessMode.Write | AccessMode.Read,
            memoryIndex: null,
            name: '',
            visibility: ComputeStage.Fragment
        });
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

type TextureSize = { width: number; height: number; };

type RenderTargetType = 'Canvas' | 'Color' | 'Depth';