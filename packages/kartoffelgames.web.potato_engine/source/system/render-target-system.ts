import { Exception } from '@kartoffelgames/core';
import { CanvasTexture, type IGpuTexture, type RenderTargets, type RenderTargetsLayout } from '@kartoffelgames/web-gpu';
import { CameraComponent } from '../component/camera/camera-component.ts';
import { RenderTargetComponent } from '../component/render-target-component.ts';
import type { GameComponentConstructor } from '../core/component/game-component.ts';
import type { GameEnvironment, GameEnvironmentStateChange } from '../core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor, type GameSystemUpdateStateChanges } from '../core/game-system.ts';
import { GpuSystem } from './gpu-system.ts';
import type { RenderTargetsSetup } from '../../../kartoffelgames.web.gpu/source/pipeline/render_targets/render-targets-setup.ts';
import { ReadonlyRenderTargetsColorTexture } from "../../../kartoffelgames.web.gpu/source/pipeline/render_targets/render-targets.ts";

/**
 * System responsible for managing render targets in the environment.
 * Creates a RenderTargets instance for each render target that can be referenced by other systems or components.
 * Handles the active camera assignment for each render target and updates camera aspect ratios when render target dimensions change.
 *
 * Each system can register itself as a renderer for render targets.
 * Keeps an internal list for all render targets mapped to their renderer.
 * When a render target is added without an explicit set renderer, it is assigned to the default renderer.
 */
export class RenderTargetSystem extends GameSystem {
    private readonly mActiveCameras: Set<CameraComponent>;
    private readonly mCameraToRenderTarget: WeakMap<CameraComponent, RenderTargetComponent>;
    private mCanvas: HTMLCanvasElement | null;
    private mDefaultRendererName: string | null;
    private readonly mRenderTargetToRenderer: Map<RenderTargetComponent, string>;
    private readonly mRenderTargets: WeakMap<RenderTargetComponent, RenderTargets>;
    private readonly mRenderers: Map<string, RenderTargetSystemRendererData>;
    private readonly mForcedRenderTargetTextures: WeakMap<RenderTargetComponent, IGpuTexture>;

    /**
     * Canvas element used for rendering.
     */
    public set canvas(pCanvas: HTMLCanvasElement) {
        this.mCanvas = pCanvas;
    }

    /**
     * Systems this system depends on.
     */
    public override get dependentSystemTypes(): Array<GameSystemConstructor<GameSystem>> {
        return [GpuSystem];
    }

    /**
     * Component types this system handles.
     */
    public override get handledComponentTypes(): Array<GameComponentConstructor> {
        return [RenderTargetComponent, CameraComponent];
    }

    /**
     * Constructor.
     *
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super('RenderTarget', pEnvironment);

        // Initialize renderer tracking.
        this.mRenderers = new Map<string, RenderTargetSystemRendererData>();
        this.mDefaultRendererName = null;

        // Initialize render targets and renderer assignment maps.
        this.mRenderTargets = new WeakMap<RenderTargetComponent, RenderTargets>();
        this.mRenderTargetToRenderer = new Map<RenderTargetComponent, string>();

        // Initialize camera tracking.
        this.mActiveCameras = new Set<CameraComponent>();
        this.mCameraToRenderTarget = new WeakMap<CameraComponent, RenderTargetComponent>();

        // Initialize forced render target texture tracking.
        this.mForcedRenderTargetTextures = new WeakMap<RenderTargetComponent, IGpuTexture>();

        // Initialize canvas to null.
        this.mCanvas = null;
    }

    /**
     * Force a specific texture to be used for a render target.
     * This overrides the default texture creation for the render target and can be used to provide custom textures (e.g. from a canvas) for render targets.
     * 
     * @param pRenderTarget - The render target component to force the texture for.
     * @param pTexture - The GPU texture to use for the render target.
     */
    public forceTexture(pRenderTarget: RenderTargetComponent, pTexture: IGpuTexture): void {
        this.lockGate();

        // Store the forced texture for this render target.
        this.mForcedRenderTargetTextures.set(pRenderTarget, pTexture);
    }

    /**
     * Get the RenderTargets instance associated with a render target component.
     *
     * @param pRenderTarget - The render target component to look up.
     *
     * @returns The RenderTargets for the render target.
     */
    public getRenderTarget(pRenderTarget: RenderTargetComponent): RenderTargets {
        this.lockGate();

        // There must always be a RenderTargets for an active render target.
        return this.mRenderTargets.get(pRenderTarget)!;
    }

    /**
     * Get all render target components assigned to a specific renderer.
     *
     * @param pRenderer - The renderer name to look up.
     *
     * @returns Array of render target components assigned to the renderer.
     */
    public getRenderTargetsOfRenderer(pRenderer: string): Array<RenderTargetComponent> {
        this.lockGate();

        // Look up the renderer data.
        const lRendererData: RenderTargetSystemRendererData | undefined = this.mRenderers.get(pRenderer);
        if (!lRendererData) {
            throw new Exception(`Renderer "${pRenderer}" is not registered.`, this);
        }

        return Array.from(lRendererData.renderTargets);
    }

    /**
     * Register a new renderer with a render targets layout and optional setup callback.
     * The first registered renderer automatically becomes the default renderer unless another renderer
     * explicitly sets itself as default.
     * Throws an error if a renderer with the same name is already registered.
     *
     * When this renderer becomes the default and the root render target has no RenderTargets yet,
     * a RenderTargets instance is created for the root render target.
     *
     * @param pName - Unique name identifying the renderer.
     * @param pLayout - The RenderTargetsLayout used to create RenderTargets for render targets of this renderer.
     * @param pSetupCallback - Optional callback for setting up the RenderTargets (e.g. providing custom textures).
     * @param pDefault - Whether this renderer should be set as the default renderer.
     */
    public registerRenderer(pName: string, pLayout: RenderTargetsLayout, pSetupCallback?: RenderTargetSystemRegisterRendererSetupCallback, pDefault?: boolean): void {
        // Throw on duplicate registration.
        if (this.mRenderers.has(pName)) {
            throw new Exception(`Renderer "${pName}" is already registered.`, this);
        }

        // Set as default renderer if this is the first registered renderer or explicitly requested.
        if (pDefault || this.mDefaultRendererName === null) {
            this.mDefaultRendererName = pName;
        }

        // Create new render data.
        const lRendererData: RenderTargetSystemRendererData = {
            layout: pLayout,
            setupCallback: pSetupCallback,
            renderTargets: new Set<RenderTargetComponent>()
        };

        // Map renderer name to its data.
        this.mRenderers.set(pName, lRendererData);

        // Get all render targets assigned to this renderer and add them to the renderer data and create RenderTargets for them.
        for (const [lRenderTarget, lRendererName] of this.mRenderTargetToRenderer.entries()) {
            // Skip render targets that are not assigned to this renderer.
            if (lRendererName !== pName) {
                continue;
            }

            // Read render data and add render target to the it.
            lRendererData.renderTargets.add(lRenderTarget);

            // Store the RenderTargets instance.
            this.mRenderTargets.set(lRenderTarget, this.createRenderTargets(lRenderTarget, lRendererData));
        }
    }

    /**
     * Override onCreate to initialize the root render target and create a canvas if not provided before system creation.
     */
    protected override async onCreate(): Promise<void> {
        // Create canvas if not set before system creation.
        if (!this.mCanvas) {
            this.mCanvas = document.createElement('canvas');
        }

        // Get GPU from dependency for setup callback.
        const lGpu = this.environment.getSystem(GpuSystem).gpu;

        // Create CanvasTexture for the setup callback.
        const lCanvasTexture: CanvasTexture = new CanvasTexture(lGpu, this.mCanvas);

        // Init root render target as early as possible and connect it to ensure it receives updates even without a parent GameEntity.
        const lRootRenderTarget = this.environment.addComponent(RenderTargetComponent);
        lRootRenderTarget.label = 'Root Render Target';

        // Force the canvas texture for the root render target so it can be used in the default renderer setup callback.
        this.forceTexture(lRootRenderTarget, lCanvasTexture);
    }

    /**
     * Handle component state changes for render targets and cameras.
     *
     * @param pStateChanges - Map of component types to their state change events.
     */
    protected override async onUpdate(pStateChanges: GameSystemUpdateStateChanges): Promise<void> {
        // Process RenderTargetComponent changes.
        const lRenderTargetChanges: ReadonlyArray<GameEnvironmentStateChange> = pStateChanges.componentChanges.get(RenderTargetComponent)!;
        if (lRenderTargetChanges.length > 0) {
            for (const lChange of lRenderTargetChanges) {
                const lRenderTarget: RenderTargetComponent = lChange.component as RenderTargetComponent;

                switch (lChange.type) {
                    case 'add': {
                        this.addRenderTarget(lRenderTarget);
                        this.updateRenderTarget(lRenderTarget);
                        break;
                    }
                    case 'remove': {
                        this.removeRenderTarget(lRenderTarget);
                        break;
                    }
                    case 'deactivate': {
                        // Does nothing, as render target deactivation does not require special handling.
                        break;
                    }
                    case 'activate':
                    case 'update': {
                        // Skip updating when render target is not active.
                        if (!lRenderTarget.enabled) {
                            break;
                        }

                        this.updateRenderTarget(lRenderTarget);
                        break;
                    }
                }
            }
        }

        // Process CameraComponent changes.
        const lCameraChanges: ReadonlyArray<GameEnvironmentStateChange> = pStateChanges.componentChanges.get(CameraComponent)!;
        if (lCameraChanges.length > 0) {
            for (const lChange of lCameraChanges) {
                const lCamera: CameraComponent = lChange.component as CameraComponent;

                switch (lChange.type) {
                    case 'add':
                    case 'activate': {
                        // Skip disabled cameras.
                        if (!lCamera.enabled) {
                            break;
                        }

                        this.assignCamera(lCamera);
                        break;
                    }
                    case 'remove':
                    case 'deactivate': {
                        this.deactivateCamera(lCamera);
                        break;
                    }
                    case 'update': {
                        // Camera updates do not affect render target assignment.
                        break;
                    }
                }
            }
        }
    }

    /**
     * Add a new render target to the system.
     * Creates a RenderTargets instance for the render target and assigns it to the appropriate renderer.
     *
     * @param pRenderTarget - The render target component being added.
     */
    private addRenderTarget(pRenderTarget: RenderTargetComponent): void {
        // Check that a renderer is registered. If any renderer is registered, the default renderer is always set.
        if (!this.mDefaultRendererName) {
            throw new Exception(`No renderer is registered.`, this);
        }

        // Determine which renderer this render target belongs to and track the assignment.
        const lRendererName: string = pRenderTarget.renderer ?? this.mDefaultRendererName;
        this.mRenderTargetToRenderer.set(pRenderTarget, lRendererName);

        // Skip initializing render targets when the assigned renderer is not registered.
        // This allows render targets to be added before their renderer is registered.
        if (!this.mRenderers.has(lRendererName)) {
            return;
        }

        // Read render data and add render target to the it.
        const lRendererData: RenderTargetSystemRendererData = this.mRenderers.get(lRendererName)!;
        lRendererData.renderTargets.add(pRenderTarget);

        // Store the RenderTargets instance.
        this.mRenderTargets.set(pRenderTarget, this.createRenderTargets(pRenderTarget, lRendererData));
    }

    /**
     * Assign a camera component to the nearest parent render target that has no camera assigned.
     * If the camera is already assigned to a render target, it will be skipped.
     *
     * @param pCamera - The camera component to assign.
     */
    private assignCamera(pCamera: CameraComponent): void {
        // If the camera is already assigned to a render target, skip assignment.
        if (this.mCameraToRenderTarget.has(pCamera)) {
            return;
        }

        // Add to active cameras set.
        this.mActiveCameras.add(pCamera);

        // Find the render target this camera belongs to by walking up the entity hierarchy.
        // Does allways find a render target component, as the root render target is added directly to the environment and thus is a parent of all entities.
        const lParentRenderTarget: RenderTargetComponent | null = pCamera.gameEntity.getParentComponent(RenderTargetComponent)!;

        // Assign camera only when the render target has no active camera.
        if (!lParentRenderTarget.camera) {
            // Set camera on the render target component.
            lParentRenderTarget.camera = pCamera;

            // Track the camera-to-render-target assignment.
            this.mCameraToRenderTarget.set(pCamera, lParentRenderTarget);

            // Update camera aspect ratio to match the render target dimensions.
            pCamera.projection.aspectRatio = lParentRenderTarget.width / lParentRenderTarget.height;
        }
    }

    /**
     * Create a RenderTargets instance for a render target component and assign it to a renderer.
     *
     * @param pRenderTarget - The render target component to assign.
     * @param pRendererData - The renderer data to use for creating the RenderTargets instance.
     */
    private createRenderTargets(pRenderTarget: RenderTargetComponent, pRendererData: RenderTargetSystemRendererData): RenderTargets {
        // Read forced render target texture for this render target if it exists.
        const lForcedTexture: IGpuTexture | null = this.mForcedRenderTargetTextures.get(pRenderTarget) ?? null;

        // Create a RenderTargets instance using the renderer's layout and optional setup callback.
        const lRenderTargets: RenderTargets = pRendererData.layout.create((pSetup: RenderTargetsSetup) => {
            if (pRendererData.setupCallback) {
                pRendererData.setupCallback(pSetup, lForcedTexture);
            }
        });

        // Iterate all color targets to search for canvas textures.
        for (const lColorTargetName of lRenderTargets.layout.colorTargetNames) {
            // Read the color texture of the target.
            const lColorTexture: ReadonlyRenderTargetsColorTexture = lRenderTargets.colorTarget(lColorTargetName);

            // Read canvas texture from eighter the render or resolve view, as the canvas texture can be used as either depending on the multisample flag of the layout.
            const lCanvasTexture: CanvasTexture | null = (() => {
                if (lColorTexture.renderView.texture instanceof CanvasTexture) {
                    return lColorTexture.renderView.texture;
                }
                if (lColorTexture.resolveView?.texture instanceof CanvasTexture) {
                    return lColorTexture.resolveView.texture;
                }

                return null;
            })();

            // We are not interested in any non-canvas textures.
            if (!lCanvasTexture) {
                continue;
            }

            // Observe canvas size changes via ResizeObserver.
            const lResizeObserver = new ResizeObserver((pEntries: Array<ResizeObserverEntry>) => {
                const lEntry: ResizeObserverEntry = pEntries[0];

                // Update root render target dimensions. RenderTargetSystem handles resizing the RenderTargets.
                pRenderTarget.width = Math.round(lEntry.contentBoxSize[0].inlineSize * devicePixelRatio);
                pRenderTarget.height = Math.round(lEntry.contentBoxSize[0].blockSize * devicePixelRatio);
            });
            lResizeObserver.observe(lCanvasTexture.canvas);

            // Only support one canvas. Otherwise, when multiple canvases are updated, they end up in a feedback loop of updating each other's size.
            break;
        }


        return lRenderTargets;
    }

    /**
     * Deactivate a camera component by clearing its render target assignment.
     * Searches for a replacement camera for the affected render target among all remaining active cameras.
     *
     * @param pCamera - The camera component to deactivate.
     */
    private deactivateCamera(pCamera: CameraComponent): void {
        // Remove from active cameras set.
        this.mActiveCameras.delete(pCamera);

        // Skip if the camera is not assigned to any render target.
        if (!this.mCameraToRenderTarget.has(pCamera)) {
            return;
        }

        // Get the render target this camera was assigned to.
        const lRenderTarget: RenderTargetComponent = this.mCameraToRenderTarget.get(pCamera)!;

        // Clear camera assignment on the render target.
        lRenderTarget.camera = null;

        // Remove camera-to-render-target tracking.
        this.mCameraToRenderTarget.delete(pCamera);

        // Search all active cameras for a replacement camera for the affected render target.
        for (const lCamera of this.mActiveCameras) {
            // Skip cameras that are already assigned to another render target.
            if (this.mCameraToRenderTarget.has(lCamera)) {
                continue;
            }

            // Find the render target this camera belongs to.
            const lParentRenderTarget: RenderTargetComponent = lCamera.gameEntity.getParentComponent(RenderTargetComponent)!;

            // When the camera belongs to the affected render target, assign it as the new camera.
            if (lParentRenderTarget === lRenderTarget) {
                this.assignCamera(lCamera);
                return;
            }
        }
    }

    /**
     * Remove a render target from the system.
     * Clears the camera assignment, removes it from the renderer's set, and deletes the RenderTargets instance.
     *
     * @param pRenderTarget - The render target component being removed.
     */
    private removeRenderTarget(pRenderTarget: RenderTargetComponent): void {
        // Clear camera assignment on the render target and handle reassignment.
        const lCamera: CameraComponent | null = pRenderTarget.camera;
        if (lCamera) {
            // Remove camera tracking.
            this.mCameraToRenderTarget.delete(lCamera);
            pRenderTarget.camera = null;

            // Try to reassign the camera to its new parent render target.
            this.assignCamera(lCamera);
        }

        // Remove from renderer's render target set.
        const lRendererName: string | undefined = this.mRenderTargetToRenderer.get(pRenderTarget);
        if (lRendererName) {
            const lRendererData: RenderTargetSystemRendererData | undefined = this.mRenderers.get(lRendererName);
            if (lRendererData) {
                lRendererData.renderTargets.delete(pRenderTarget);
            }
        }

        // Remove from tracking maps.
        this.mRenderTargetToRenderer.delete(pRenderTarget);

        // Delete the RenderTargets instance. WeakMap will handle garbage collection.
        this.mRenderTargets.delete(pRenderTarget);
    }

    /**
     * Update a render target's RenderTargets dimensions and camera aspect ratio when its properties change.
     *
     * @param pRenderTarget - The render target component that was updated.
     */
    private updateRenderTarget(pRenderTarget: RenderTargetComponent): void {
        // Resize the RenderTargets instance to match the updated component dimensions.
        const lRenderTargets: RenderTargets | undefined = this.mRenderTargets.get(pRenderTarget);
        if (lRenderTargets) {
            lRenderTargets.resize(pRenderTarget.height, pRenderTarget.width);
        }

        // Update camera aspect ratio when the render target has an assigned camera.
        const lCamera: CameraComponent | null = pRenderTarget.camera;
        if (lCamera) {
            // Only update aspect ratio when it actually changed to avoid unnecessary updates.
            const lNewAspectRatio: number = pRenderTarget.width / pRenderTarget.height;
            if (lCamera.projection.aspectRatio !== lNewAspectRatio) {
                lCamera.projection.aspectRatio = pRenderTarget.width / pRenderTarget.height;
            }
        }
    }
}

/**
 * Internal renderer data for tracking a registered renderer.
 * Stores the render targets layout, optional setup callback, and the set of render targets assigned to this renderer.
 */
type RenderTargetSystemRendererData = {
    layout: RenderTargetsLayout;
    setupCallback: RenderTargetSystemRegisterRendererSetupCallback | undefined;
    renderTargets: Set<RenderTargetComponent>;
};

export type RenderTargetSystemRegisterRendererSetupCallback = (pSetup: RenderTargetsSetup, pForcedColorTexture: IGpuTexture | null) => void;