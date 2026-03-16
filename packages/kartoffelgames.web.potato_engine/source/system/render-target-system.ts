import { Exception } from '@kartoffelgames/core';
import { type RenderTargets, type RenderTargetsLayout } from '@kartoffelgames/web-gpu';
import { CameraComponent } from '../component/camera/camera-component.ts';
import { RenderTargetComponent } from '../component/render-target-component.ts';
import type { GameComponentConstructor } from '../core/component/game-component.ts';
import type { GameEnvironment, GameEnvironmentStateChange } from '../core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor, type GameSystemUpdateStateChanges } from '../core/game-system.ts';
import { GpuSystem } from './gpu-system.ts';
import type { RenderTargetsSetup } from '../../../kartoffelgames.web.gpu/source/pipeline/render_targets/render-targets-setup.ts';

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
    private mDefaultRendererName: string | null;
    private readonly mRenderers: Map<string, RenderTargetSystemRendererData>;
    private readonly mRenderTargets: WeakMap<RenderTargetComponent, RenderTargets>;
    private readonly mRenderTargetToRenderer: Map<RenderTargetComponent, string>;
    private readonly mRootRenderTarget: RenderTargetComponent;

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
     * The core render target component.
     * This standalone component represents the primary render target (typically canvas-backed).
     * External systems can update its width and height to trigger camera aspect ratio changes.
     */
    public get rootRenderTarget(): RenderTargetComponent {
        this.lockGate();
        return this.mRootRenderTarget;
    }

    /**
     * Constructor.
     *
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super('RenderTarget', pEnvironment);

        // Init root render target as early as possible and connect it to ensure it receives updates even without a parent GameEntity.
        this.mRootRenderTarget = new CoreRenderTargetComponent(this.environment);

        // Initialize renderer tracking.
        this.mRenderers = new Map<string, RenderTargetSystemRendererData>();
        this.mDefaultRendererName = null;

        // Initialize render targets and renderer assignment maps.
        this.mRenderTargets = new WeakMap<RenderTargetComponent, RenderTargets>();
        this.mRenderTargetToRenderer = new Map<RenderTargetComponent, string>();

        // Initialize camera tracking.
        this.mActiveCameras = new Set<CameraComponent>();
        this.mCameraToRenderTarget = new WeakMap<CameraComponent, RenderTargetComponent>();
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
    public registerRenderer(pName: string, pLayout: RenderTargetsLayout, pSetupCallback?: (pSetup: RenderTargetsSetup) => void, pDefault?: boolean): void {
        // Throw on duplicate registration.
        if (this.mRenderers.has(pName)) {
            throw new Exception(`Renderer "${pName}" is already registered.`, this);
        }

        // Create renderer data entry.
        this.mRenderers.set(pName, {
            layout: pLayout,
            setupCallback: pSetupCallback,
            renderTargets: new Set<RenderTargetComponent>()
        });

        // Set as default renderer if this is the first registered renderer or explicitly requested.
        if (this.mDefaultRendererName === null || pDefault === true) {
            this.mDefaultRendererName = pName;

            // Create RenderTargets for the root render target if it has none yet.
            if (!this.mRenderTargets.has(this.mRootRenderTarget)) {
                this.assignRenderTargetToRenderer(this.mRootRenderTarget, pName);
            }
        }
    }

    /**
     * Initialize the system.
     * The root render target's RenderTargets will be created when a renderer is registered via registerRenderer.
     */
    protected override async onCreate(): Promise<void> {
        // Assign root render target to the default renderer if one was registered before onCreate.
        if (this.mDefaultRendererName !== null && !this.mRenderTargets.has(this.mRootRenderTarget)) {
            this.assignRenderTargetToRenderer(this.mRootRenderTarget, this.mDefaultRendererName);
        }
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
        // Determine which renderer this render target belongs to.
        const lRendererName: string | null = pRenderTarget.renderer ?? this.mDefaultRendererName;

        // Skip render targets that cannot be assigned to any renderer.
        if (lRendererName === null || !this.mRenderers.has(lRendererName)) {
            return;
        }

        this.assignRenderTargetToRenderer(pRenderTarget, lRendererName);
    }

    /**
     * Create a RenderTargets instance for a render target component and assign it to a renderer.
     *
     * @param pRenderTarget - The render target component to assign.
     * @param pRendererName - The renderer name to assign it to.
     */
    private assignRenderTargetToRenderer(pRenderTarget: RenderTargetComponent, pRendererName: string): void {
        const lRendererData: RenderTargetSystemRendererData = this.mRenderers.get(pRendererName)!;

        // Create a RenderTargets instance using the renderer's layout and optional setup callback.
        const lRenderTargets: RenderTargets = lRendererData.layout.create(lRendererData.setupCallback);

        // Resize to match the render target component dimensions.
        lRenderTargets.resize(pRenderTarget.height, pRenderTarget.width);

        // Store the RenderTargets instance.
        this.mRenderTargets.set(pRenderTarget, lRenderTargets);

        // Add render target to the renderer's set and track the assignment.
        lRendererData.renderTargets.add(pRenderTarget);
        this.mRenderTargetToRenderer.set(pRenderTarget, pRendererName);
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
        let lParentRenderTarget: RenderTargetComponent | null = pCamera.gameEntity.getParentComponent(RenderTargetComponent);
        if (!lParentRenderTarget) {
            // Fall back to the root render target when no parent render target is found.
            lParentRenderTarget = this.mRootRenderTarget;
        }

        // Assign camera only when the render target has no active camera.
        if (!lParentRenderTarget.camera) {
            // Set camera on the render target component.
            lParentRenderTarget.assignCamera(pCamera);

            // Track the camera-to-render-target assignment.
            this.mCameraToRenderTarget.set(pCamera, lParentRenderTarget);

            // Update camera aspect ratio to match the render target dimensions.
            pCamera.projection.aspectRatio = lParentRenderTarget.width / lParentRenderTarget.height;
        }
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
        lRenderTarget.assignCamera(null);

        // Remove camera-to-render-target tracking.
        this.mCameraToRenderTarget.delete(pCamera);

        // Search all active cameras for a replacement camera for the affected render target.
        for (const lCamera of this.mActiveCameras) {
            // Skip cameras that are already assigned to another render target.
            if (this.mCameraToRenderTarget.has(lCamera)) {
                continue;
            }

            // Find the render target this camera belongs to.
            let lParentRenderTarget: RenderTargetComponent | null = lCamera.gameEntity.getParentComponent(RenderTargetComponent);
            if (!lParentRenderTarget) {
                lParentRenderTarget = this.mRootRenderTarget;
            }

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
            pRenderTarget.assignCamera(null);

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
            lCamera.projection.aspectRatio = pRenderTarget.width / pRenderTarget.height;
        }
    }
}

/**
 * Internal renderer data for tracking a registered renderer.
 * Stores the render targets layout, optional setup callback, and the set of render targets assigned to this renderer.
 */
type RenderTargetSystemRendererData = {
    layout: RenderTargetsLayout;
    setupCallback: ((pSetup: RenderTargetsSetup) => void) | undefined;
    renderTargets: Set<RenderTargetComponent>;
};

/**
 * Extended render target component for the core (canvas-backed) render target.
 * Unlike entity-attached RenderTargetComponents, this standalone component sends
 * update events directly to the GameEnvironment without requiring a parent GameEntity.
 */
class CoreRenderTargetComponent extends RenderTargetComponent {
    private readonly mEnvironment: GameEnvironment;

    /**
     * Constructor.
     *
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super();

        this.mEnvironment = pEnvironment;
    }

    /**
     * Override update to send the state change directly to the environment
     * instead of going through a parent GameEntity.
     */
    public override update(): void {
        if (this.mEnvironment) {
            this.mEnvironment.queueComponentStateChange('update', this);
        }
    }
}
