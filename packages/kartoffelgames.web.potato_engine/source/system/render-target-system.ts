import { CameraComponent } from "../component/camera/camera-component.ts";
import { RenderTargetComponent } from '../component/render-target-component.ts';
import type { GameComponentConstructor } from '../core/component/game-component.ts';
import type { GameEnvironment, GameEnvironmentStateChange } from '../core/environment/game-environment.ts';
import { GameSystem, GameSystemUpdateStateChanges } from '../core/game-system.ts';

/**
 * System responsible for managing render targets in the environment.
 * Creates a color texture for each render target that can be referenced by other systems or components.
 * Handles the active camera assignment for each render target and updates camera aspect ratios when render target dimensions change.
 * 
 * Each system can register itself as a renderer for render targets.
 * Keeps a internal list for all render targets mapped to their renderer. When a render target is added without a explicit set renderer, it is assigned to the default renderer.
 */
export class RenderTargetSystem extends GameSystem {
    private readonly mRootRenderTarget: RenderTargetComponent;

    /**
     * Component types this system handles.
     */
    public override get handledComponentTypes(): Array<GameComponentConstructor> {
        return [RenderTargetComponent];
    }

    /**
     * The core render target component.
     * This standalone component represents the primary render target (typically canvas-backed).
     * External systems can update its width and height to trigger camera aspect ratio changes.
     */
    public get rootRenderTarget(): RenderTargetComponent {
        this.lockGate();
        return this.mRootRenderTarget!;
    }

    /**
     * Constructor.
     * 
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super('RenderTarget', pEnvironment);

        // Init root render target as early as possible.
        this.mRootRenderTarget = new CoreRenderTargetComponent(this.environment);
    }


    public registerRenderModel(pRendererIdentification: string, pDefault: boolean): void {

    }

    /**
     * Handle component state changes for render targets, cameras, and mesh renderers.
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
                        // Does nothing, as render target activation does not affect culling. Only camera activation/deactivation triggers culling changes.
                        break;
                    }
                    case 'activate':
                    case 'update': {
                        // Skip updating when render target is not active.
                        if (!lRenderTarget.enabled) {
                            break;
                        }

                        // Update camera aspect ratio when the render target dimensions change.
                        const lData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(lRenderTarget)!;
                        if (lData.camera) {
                            lData.camera.component.projection.aspectRatio = lRenderTarget.width / lRenderTarget.height;

                            // Update frustum to match the new projection.
                            this.updateFrustum(lData);
                        }
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
                        // Updating a camera does nothing.
                        break;
                    }
                }
            }
        }
    }
}

/**
 * Extended render target component for the core (canvas-backed) render target.
 * Unlike entity-attached RenderTargetComponents, this standalone component sends
 * update events directly to the GameEnvironment without requiring a parent GameEntity.
 */
class CoreRenderTargetComponent extends RenderTargetComponent {
    private readonly mEnvironment: GameEnvironment;

    /**
     * Constructor.
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