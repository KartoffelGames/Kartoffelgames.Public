import { Dictionary, Exception } from '@kartoffelgames/core';
import { AccessMode } from '../../../constant/access-mode.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { TextureBindType } from '../../../constant/texture-bind-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/gpu-object';
import { TextureMemoryLayout } from '../../memory_layout/texture/texture-memory-layout';
import { CanvasTexture } from '../../texture/canvas-texture';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';
import { RenderTargets } from './render-targets';

/**
 * Group of textures with the same size and multisample level.
 */
export class TextureGroup extends GpuObject {
    private readonly mBufferTextures: Dictionary<string, FrameBufferTexture>;
    private readonly mMultisampleLevel: number;
    private readonly mSize: TextureSize;
    private readonly mTargetTextures: Dictionary<string, CanvasTexture>;

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
     * @param pMultisampleLevel - Multisample level of all buffer textures.
     */
    public constructor(pDevice: GpuDevice, pWidth: number, pHeight: number, pMultisampleLevel: number) {
        super(pDevice);

        // Set "fixed" 
        this.mSize = { width: pWidth, height: pHeight };
        this.mMultisampleLevel = pMultisampleLevel;

        // Saved.
        this.mBufferTextures = new Dictionary<string, FrameBufferTexture>();
        this.mTargetTextures = new Dictionary<string, CanvasTexture>();
    }

    /**
     * Add buffer texture to group.
     * Uses multisample values.
     * @param pName - Texture name.
     * @param pType - Texture type.
     */
    public addBuffer(pName: string, pType: RenderBufferType): FrameBufferTexture {
        // Validate existing buffer textures.
        if (this.mBufferTextures.has(pName)) {
            throw new Exception(`Buffer texture "${pName}" already exists.`, this);
        }

        // Create correct memory layout for texture type.
        let lMemoryLayout: TextureMemoryLayout;
        switch (pType) {
            case 'Color': {
                lMemoryLayout = this.createColorMemoryLayout(this.mMultisampleLevel > 1);
                break;
            }
            case 'Depth': {
                lMemoryLayout = this.createDepthMemoryLayout(this.mMultisampleLevel > 1);
                break;
            }
        }

        // Create new texture and assign multisample level.
        const lTexture: FrameBufferTexture = lMemoryLayout.createFrameBufferTexture(this.mSize.height, this.mSize.width, 1);
        lTexture.multiSampleLevel = this.mMultisampleLevel;

        // Set buffer texture.
        this.mBufferTextures.set(pName, lTexture);

        return lTexture;
    }

    /**
     * Add target texture to group.
     * Ignores multisample values.
     * @param pName - Texture name.
     * @param pType - Texture type.
     */
    public addTarget(pName: string): CanvasTexture {
        // Validate existing target textures.
        if (this.mTargetTextures.has(pName)) {
            throw new Exception(`Target texture "${pName}" already exists.`, this);
        }

        // Create correct memory layout for texture type.
        const lMemoryLayout: TextureMemoryLayout = this.createCanvasMemoryLayout();
        const lTexture: CanvasTexture = lMemoryLayout.createCanvasTexture(this.mSize.height, this.mSize.width);

        // Set target texture.
        this.mTargetTextures.set(pName, lTexture);

        return lTexture;
    }

    /**
     * Create render targets.
     */
    public create(): RenderTargets {
        return new RenderTargets(this.device, this);
    }

    /**
     * Get buffer texture.
     * @param pName - texture name.
     */
    public getBufferTextureOf(pName: string): FrameBufferTexture {
        // Validate existing canvas.
        if (this.mBufferTextures.has(pName)) {
            throw new Exception(`Buffer texture "${pName}" not found.`, this);
        }

        return this.mBufferTextures.get(pName)!;
    }

    /**
     * Get target texture.
     * @param pName - texture name.
     */
    public getTargetTextureOf(pName: string): CanvasTexture {
        // Validate existing canvas.
        if (this.mTargetTextures.has(pName)) {
            throw new Exception(`Target texture "${pName}" not found.`, this);
        }

        return this.mTargetTextures.get(pName)!;
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
            bindingIndex: null,
            name: '',
            visibility: ComputeStage.Fragment
        });
    }

    /**
     * Create layout for a color texture.
     */
    private createColorMemoryLayout(pMultisampled: boolean): TextureMemoryLayout {
        return new TextureMemoryLayout(this.device, {
            dimension: TextureDimension.TwoDimension,
            format: TextureFormat.RedGreenBlueAlpha,
            bindType: TextureBindType.RenderTarget,
            multisampled: pMultisampled,
            access: AccessMode.Write | AccessMode.Read,
            bindingIndex: null,
            name: '',
            visibility: ComputeStage.Fragment
        });
    }

    /**
     * Create layout for a depth texture.
     */
    private createDepthMemoryLayout(pMultisampled: boolean): TextureMemoryLayout {
        return new TextureMemoryLayout(this.device, {
            dimension: TextureDimension.TwoDimension,
            format: TextureFormat.Depth,
            bindType: TextureBindType.RenderTarget,
            multisampled: pMultisampled,
            access: AccessMode.Write | AccessMode.Read,
            bindingIndex: null,
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

        // Update buffer texture sizes.
        for (const lTexture of this.mBufferTextures.values()) {
            lTexture.height = pHeight;
            lTexture.height = pWidth;
        }

        // Update target texture sizes.
        for (const lTexture of this.mTargetTextures.values()) {
            lTexture.height = pHeight;
            lTexture.height = pWidth;
        }
    }
}

type TextureSize = { width: number; height: number; };

type RenderBufferType = 'Color' | 'Depth';