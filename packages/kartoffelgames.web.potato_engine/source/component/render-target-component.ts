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
    private mAssignedCamera: CameraComponent | null;
    private readonly mCameraUpdateListener: (pUpdateName: string) => void;
    private mHeight: number;
    private mPassthrough: boolean;
    private mRenderer: string | null;
    private mWidth: number;

    /**
     * Get the currently assigned camera for this render target.
     * Returns null if no camera is assigned.
     */
    public get camera(): CameraComponent | null {
        return this.mAssignedCamera;
    } set camera(pCamera: CameraComponent | null) {
        // Remove listener from old camera if assigned.
        if (this.mAssignedCamera) {
            this.mAssignedCamera.removeUpdateListener(this.mCameraUpdateListener);
        }

        this.mAssignedCamera = pCamera;

        // Add listener to new camera to react to changes.
        if (this.mAssignedCamera) {
            this.mAssignedCamera.addUpdateListener(this.mCameraUpdateListener);
        }

        // Signal changes.
        this.update('RenderTargetComponent_camera');
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
        this.update('RenderTargetComponent_height');
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
        this.update('RenderTargetComponent_passthrough');
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
        this.update('RenderTargetComponent_renderer');
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

        // Create components camera update listener to react to changes in the assigned camera.
        this.mCameraUpdateListener = (pUpdateName) => {
            console.log(pUpdateName)
            this.update(`RenderTargetComponent_${pUpdateName}`);
        };
    }
}
