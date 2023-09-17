import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { GpuObjectReason } from '../gpu/gpu-object-reason';
import { TextureMemoryLayout } from '../memory_layout/texture-memory-layout';

export class CanvasTexture extends GpuObject<'canvasTexture'> {
    private readonly mCanvas: HTMLCanvasElement;
    private readonly mMemoryLayout: TextureMemoryLayout;

    /**
     * HTML canvas element.
     */
    public get canvas(): HTMLCanvasElement {
        return this.mCanvas;
    }

    /**
     * Texture height.
     */
    public get height(): number {
        return this.mCanvas.height;
    } set height(pValue: number) {
        this.mCanvas.height = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate(GpuObjectReason.Setting);
    }

    /**
     * Textures memory layout.
     */
    public get memoryLayout(): TextureMemoryLayout {
        return this.mMemoryLayout;
    }

    /**
     * Texture width.
     */
    public get width(): number {
        return this.mCanvas.width;
    } set width(pValue: number) {
        this.mCanvas.width = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate(GpuObjectReason.Setting);
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pCanvas - Canvas of texture.
     * @param pLayout - Texture layout.
     * @param pDepth - Depth of texture. Can only be set to one.
     */
    public constructor(pDevice: GpuDevice, pLayout: TextureMemoryLayout) {
        super(pDevice);

        // Set canvas reference.
        this.mCanvas = document.createElement('canvas');
        this.mMemoryLayout = pLayout;

        // Set defaults.
        this.height = 1;
        this.width = 1;

        // Register change listener for layout changes.
        pLayout.addUpdateListener(() => {
            this.triggerAutoUpdate(GpuObjectReason.ChildData);
        });
    }
}