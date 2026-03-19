import { FileSystemReferenceType, FileSystem } from '@kartoffelgames/web-file-system';
import { GameComponent } from '../core/component/game-component.ts';
import type { CameraComponent } from './camera/camera-component.ts';

/**
 * Component representing a render target in the environment.
 * Render targets can be attached to game entities or used as standalone components for core render targets.
 * They define properties such as size, passthrough behavior, and render type that influence how rendering is performed for the associated game entities.
 */
@FileSystem.fileClass('567596b5-8f19-4710-8f55-99f493be2f47', FileSystemReferenceType.Instanced)
export class RenderTargetComponent extends GameComponent {
    private mHeight: number;
    private mPassthrough: boolean;
    private mRenderer: string | null;
    private mWidth: number;
    private mAssignedCamera: CameraComponent | null;

    /**
     * Get the currently assigned camera for this render target.
     * Returns null if no camera is assigned.
     */
    public get camera(): CameraComponent | null {
        return this.mAssignedCamera;
    }

    /**
     * Height of the render target in pixels.
     */
    @FileSystem.fileProperty()
    public get height(): number {
        return this.mHeight;
    } set height(pValue: number) {
        this.mHeight = pValue;

        // Signal parent component of the change.
        this.update();
    }

    /**
     * Whether the render target should passthrough game entities to the next render target in the chain.
     */
    @FileSystem.fileProperty()
    public get passthrough(): boolean {
        return this.mPassthrough;
    } set passthrough(pValue: boolean) {
        this.mPassthrough = pValue;

        // Signal parent component of the change.
        this.update();
    }

    /**
     * Render type of the render target, determining which rendering pipeline it participates in.
     */
    @FileSystem.fileProperty()
    public get renderer(): string | null {
        return this.mRenderer;
    } set renderer(pValue: string | null) {
        this.mRenderer = pValue;

        // Signal parent component of the change.
        this.update();
    }

    /**
     * Width of the render target in pixels.
     */
    @FileSystem.fileProperty()
    public get width(): number {
        return this.mWidth;
    } set width(pValue: number) {
        this.mWidth = pValue;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Render target');

        // Default values.
        this.mWidth = 512;
        this.mHeight = 512;
        this.mPassthrough = false;
        this.mRenderer = null;
        this.mAssignedCamera = null;
    }

    /**
     * Set or clear the active camera for this render target.
     * Pass null to unassign the current camera.
     *
     * @param pCamera - The camera component to assign, or null to clear the assignment.
     */
    public assignCamera(pCamera: CameraComponent | null): void {
        this.mAssignedCamera = pCamera;

        // Signal changes.
        this.update();
    }
}
