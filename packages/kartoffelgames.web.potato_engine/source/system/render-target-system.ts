import { Frustum, Vector, type Matrix } from '@kartoffelgames/core';
import { TextureFormat, type CanvasTexture, type GpuDevice, type RenderTargets } from '@kartoffelgames/web-gpu';
import { CameraComponent } from '../component/camera/camera-component.ts';
import { MeshRenderComponent } from '../component/mesh-render-component.ts';
import { RenderTargetComponent } from '../component/render-target-component.ts';
import { TransformationComponent } from '../component/transformation-component.ts';
import type { BoundingBox } from '../component_item/bounding-box.ts';
import type { GameComponentConstructor } from '../core/component/game-component.ts';
import type { GameEnvironmentStateChange } from '../core/environment/game-environment-transmittion.ts';
import { GameSystem, type GameSystemConstructor } from '../core/game-system.ts';
import type { GameEntity } from '../core/hierarchy/game-entity.ts';
import { GpuSystem } from './gpu-system.ts';

/**
 * Bundled information for a render target.
 * Stores the camera, frustum, GPU render targets, and visible mesh renderers for a single render target.
 */
export type RenderTargetData = {
    camera: CameraComponent | null;
    cameraTransformation: TransformationComponent | null;
    frustum: Frustum;
    renderTargets: RenderTargets;
    visibleMeshRenderers: Array<MeshRenderComponent>;
};

/**
 * System that manages render targets, camera assignments, and per-frame frustum culling.
 *
 * Tracks RenderTargetComponent, CameraComponent, and MeshRenderComponent lifecycle events.
 * Creates GPU RenderTargets objects for each render target component and a core render target on initialization.
 * Maintains a per-render-target camera assignment and a visible mesh renderer list that is updated every frame.
 *
 * The core render target is created during onCreate and is backed by a canvas element.
 * A canvas can be provided before onCreate; if none is set, a new one is created automatically.
 * The core render target reacts to canvas size changes every frame.
 *
 * Camera assignment:
 * - Component render targets get the first camera found in their entity hierarchy (via depth-first traversal).
 * - The core render target gets the first active camera not claimed by any component render target.
 *
 * Mesh renderer tracking uses a swap-remove list for O(1) add/remove by index.
 */
export class RenderTargetSystem extends GameSystem {
    // Render target data storage.
    private mCoreRenderTargetData: RenderTargetData | null;
    private readonly mRenderTargetDataMap: Map<RenderTargetComponent, RenderTargetData>;

    // Canvas state.
    private mCanvas: HTMLCanvasElement | null;
    private mCanvasTexture: CanvasTexture | null;
    private mLastCanvasHeight: number;
    private mLastCanvasWidth: number;

    // Active mesh renderer tracking with swap-remove list.
    private readonly mActiveMeshRenderers: Array<MeshRenderComponent>;
    private readonly mMeshRendererIndexMap: Map<MeshRenderComponent, number>;

    // Active camera tracking for reevaluation.
    private readonly mActiveCameras: Set<CameraComponent>;

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
        return [RenderTargetComponent, CameraComponent, MeshRenderComponent];
    }

    /**
     * Canvas element used by the core render target.
     * Can be read after onCreate to access the canvas from other systems.
     * The canvas can be resized externally; the core render target will react to size changes each frame.
     */
    public get canvas(): HTMLCanvasElement {

        return this.mCanvas!;
    }

    /**
     * Set the canvas element before the system is created.
     * Must be called before onCreate. If not set, a new canvas is created automatically.
     */
    public set canvas(pCanvas: HTMLCanvasElement) {
        this.mCanvas = pCanvas;
    }

    /**
     * Core render target data created during system initialization.
     * This is the primary render target backed by the canvas.
     */
    public get coreRenderTargetData(): RenderTargetData {
        this.lockGate();
        return this.mCoreRenderTargetData!;
    }

    /**
     * All render target data entries for component render targets.
     * Keyed by their RenderTargetComponent for easy lookup by other systems.
     */
    public get renderTargetDataMap(): ReadonlyMap<RenderTargetComponent, RenderTargetData> {
        return this.mRenderTargetDataMap;
    }

    /**
     * Number of currently active mesh renderers.
     */
    public get activeMeshRendererCount(): number {
        return this.mActiveMeshRenderers.length;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mRenderTargetDataMap = new Map<RenderTargetComponent, RenderTargetData>();
        this.mCoreRenderTargetData = null;
        this.mCanvas = null;
        this.mCanvasTexture = null;
        this.mLastCanvasWidth = 0;
        this.mLastCanvasHeight = 0;
        this.mActiveMeshRenderers = new Array<MeshRenderComponent>();
        this.mMeshRendererIndexMap = new Map<MeshRenderComponent, number>();
        this.mActiveCameras = new Set<CameraComponent>();
    }

    /**
     * Get render target data for a specific render target component.
     *
     * @param pComponent - The render target component to look up.
     *
     * @returns The render target data, or undefined if the component is not tracked.
     */
    public getRenderTargetData(pComponent: RenderTargetComponent): RenderTargetData | undefined {
        return this.mRenderTargetDataMap.get(pComponent);
    }

    /**
     * Get an active mesh renderer by its index in the list.
     *
     * @param pIndex - Index of the mesh renderer.
     *
     * @returns The mesh render component at the given index.
     */
    public getMeshRenderer(pIndex: number): MeshRenderComponent {
        return this.mActiveMeshRenderers[pIndex];
    }

    /**
     * Initialize the canvas, canvas texture, and core render target.
     * If no canvas was set before this call, a new canvas element is created.
     */
    protected override async onCreate(): Promise<void> {
        const lGpu: GpuDevice = this.getDependency(GpuSystem).gpu;

        // Create canvas if not set before system creation.
        if (!this.mCanvas) {
            this.mCanvas = document.createElement('canvas');
        }

        // Create canvas texture from the canvas element.
        this.mCanvasTexture = lGpu.canvas(this.mCanvas);

        // Store initial canvas dimensions for resize detection.
        this.mLastCanvasWidth = this.mCanvas.width;
        this.mLastCanvasHeight = this.mCanvas.height;

        // Create the core render target backed by the canvas.
        this.mCoreRenderTargetData = this.setupRenderTarget(this.mCanvas.width, this.mCanvas.height, this.mCanvasTexture);
    }

    /**
     * Per-frame update: detect canvas resize, update frustums, and rebuild visible mesh renderer lists.
     */
    protected override async onFrame(): Promise<void> {
        // Detect canvas size changes and resize the core render target.
        if (this.mCanvas && this.mCoreRenderTargetData) {
            if (this.mCanvas.width !== this.mLastCanvasWidth || this.mCanvas.height !== this.mLastCanvasHeight) {
                this.mLastCanvasWidth = this.mCanvas.width;
                this.mLastCanvasHeight = this.mCanvas.height;
                this.mCoreRenderTargetData.renderTargets.resize(this.mCanvas.height, this.mCanvas.width);

                // Update camera aspect ratio to match the new canvas dimensions.
                if (this.mCoreRenderTargetData.camera) {
                    const lRenderTargets: RenderTargets = this.mCoreRenderTargetData.renderTargets;
                    this.mCoreRenderTargetData.camera.projection.aspectRatio = lRenderTargets.width / lRenderTargets.height;
                }
            }
        }

        // Collect all render target data entries (core + component-based).
        const lAllRenderTargetData: Array<RenderTargetData> = [...this.mRenderTargetDataMap.values()];
        if (this.mCoreRenderTargetData) {
            lAllRenderTargetData.push(this.mCoreRenderTargetData);
        }

        // Update frustum and visible mesh list for each render target.
        for (const lData of lAllRenderTargetData) {
            // Skip render targets without an assigned camera.
            if (!lData.camera || !lData.cameraTransformation) {
                lData.visibleMeshRenderers.length = 0;
                continue;
            }

            // Compute view-projection matrix and update the frustum.
            const lViewMatrix: Matrix = lData.cameraTransformation.matrix.inverse();
            const lViewProjectionMatrix: Matrix = lData.camera.matrix.mult(lViewMatrix);
            lData.frustum.update(lViewProjectionMatrix);

            // Rebuild the visible mesh renderer list via frustum culling.
            lData.visibleMeshRenderers.length = 0;

            for (const lMeshRenderer of this.mActiveMeshRenderers) {
                // Transform the mesh's local AABB to world space.
                const lBounds: BoundingBox = lMeshRenderer.mesh.bounds;
                const lTransformation: TransformationComponent = lMeshRenderer.gameEntity.getComponent(TransformationComponent)!;
                const lWorldAABB: WorldAABB = this.computeWorldAABB(lBounds, lTransformation.matrix);

                // Test the world-space AABB against the frustum.
                if (lData.frustum.intersectsAABB(lWorldAABB.minX, lWorldAABB.minY, lWorldAABB.minZ, lWorldAABB.maxX, lWorldAABB.maxY, lWorldAABB.maxZ)) {
                    lData.visibleMeshRenderers.push(lMeshRenderer);
                }
            }
        }
    }

    /**
     * Handle component state changes for render targets, cameras, and mesh renderers.
     *
     * @param pStateChanges - Map of component types to their state change events.
     */
    protected override async onUpdate(pStateChanges: Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>): Promise<void> {
        let lCamerasChanged: boolean = false;

        // Process RenderTargetComponent changes.
        const lRenderTargetChanges: ReadonlyArray<GameEnvironmentStateChange> | undefined = pStateChanges.get(RenderTargetComponent);
        if (lRenderTargetChanges) {
            for (const lChange of lRenderTargetChanges) {
                const lComponent: RenderTargetComponent = lChange.component as RenderTargetComponent;

                switch (lChange.type) {
                    case 'add':
                    case 'activate': {
                        const lData: RenderTargetData = this.setupRenderTarget(lComponent.width, lComponent.height);
                        this.mRenderTargetDataMap.set(lComponent, lData);
                        lCamerasChanged = true;
                        break;
                    }
                    case 'remove':
                    case 'deactivate': {
                        this.mRenderTargetDataMap.delete(lComponent);
                        lCamerasChanged = true;
                        break;
                    }
                    case 'update': {
                        // Resize the render target when the component dimensions change.
                        const lData: RenderTargetData | undefined = this.mRenderTargetDataMap.get(lComponent);
                        if (lData) {
                            lData.renderTargets.resize(lComponent.height, lComponent.width);

                            // Update camera aspect ratio after resize.
                            if (lData.camera) {
                                lData.camera.projection.aspectRatio = lData.renderTargets.width / lData.renderTargets.height;
                            }
                        }
                        break;
                    }
                }
            }
        }

        // Process CameraComponent changes.
        const lCameraChanges: ReadonlyArray<GameEnvironmentStateChange> | undefined = pStateChanges.get(CameraComponent);
        if (lCameraChanges) {
            for (const lChange of lCameraChanges) {
                const lCamera: CameraComponent = lChange.component as CameraComponent;

                switch (lChange.type) {
                    case 'add':
                    case 'activate': {
                        this.mActiveCameras.add(lCamera);
                        lCamerasChanged = true;
                        break;
                    }
                    case 'remove':
                    case 'deactivate': {
                        this.mActiveCameras.delete(lCamera);
                        lCamerasChanged = true;
                        break;
                    }
                }
            }
        }

        // Reevaluate camera assignments when cameras or render targets changed.
        if (lCamerasChanged) {
            this.reevaluateCameras();
        }

        // Process MeshRenderComponent changes.
        const lMeshChanges: ReadonlyArray<GameEnvironmentStateChange> | undefined = pStateChanges.get(MeshRenderComponent);
        if (lMeshChanges) {
            for (const lChange of lMeshChanges) {
                const lComponent: MeshRenderComponent = lChange.component as MeshRenderComponent;

                switch (lChange.type) {
                    case 'add':
                    case 'activate': {
                        // Append to end and record its index.
                        const lIndex: number = this.mActiveMeshRenderers.length;
                        this.mActiveMeshRenderers.push(lComponent);
                        this.mMeshRendererIndexMap.set(lComponent, lIndex);
                        break;
                    }
                    case 'remove':
                    case 'deactivate': {
                        const lIndex: number | undefined = this.mMeshRendererIndexMap.get(lComponent);
                        if (lIndex !== undefined) {
                            const lLastIndex: number = this.mActiveMeshRenderers.length - 1;

                            // Swap the removed element with the last element to avoid shifting.
                            if (lIndex !== lLastIndex) {
                                const lLastComponent: MeshRenderComponent = this.mActiveMeshRenderers[lLastIndex];
                                this.mActiveMeshRenderers[lIndex] = lLastComponent;
                                this.mMeshRendererIndexMap.set(lLastComponent, lIndex);
                            }

                            // Remove the last element.
                            this.mActiveMeshRenderers.pop();
                            this.mMeshRendererIndexMap.delete(lComponent);
                        }
                        break;
                    }
                }
            }
        }
    }

    /**
     * Create a RenderTargets object with a color and depth texture.
     * Optionally uses a canvas texture as the color resolve target for canvas-backed render targets.
     *
     * @param pWidth - Width of the render target in pixels.
     * @param pHeight - Height of the render target in pixels.
     * @param pCanvasTexture - Optional canvas texture for the core render target.
     *
     * @returns A new RenderTargetData bundle with no camera assigned.
     */
    private setupRenderTarget(pWidth: number, pHeight: number, pCanvasTexture?: CanvasTexture): RenderTargetData {
        const lGpu: GpuDevice = this.getDependency(GpuSystem).gpu;
        const lMultisampled: boolean = pCanvasTexture !== undefined;

        // Create render targets with color and depth attachments.
        const lRenderTargets: RenderTargets = lGpu.renderTargets(lMultisampled).setup((pSetup) => {
            // Add color render target. When canvas-backed, use the canvas texture as resolve target.
            const lColorSetup = pSetup.addColor('color', 0, true, { r: 0, g: 0, b: 0, a: 1 });
            if (pCanvasTexture) {
                lColorSetup.new(TextureFormat.Bgra8unorm, pCanvasTexture);
            } else {
                lColorSetup.new(TextureFormat.Bgra8unorm);
            }

            // Add depth texture.
            pSetup.addDepthStencil(true, 1).new(TextureFormat.Depth24plus);
        });

        // Resize to the specified dimensions.
        lRenderTargets.resize(pHeight, pWidth);

        return {
            camera: null,
            cameraTransformation: null,
            frustum: new Frustum(),
            renderTargets: lRenderTargets,
            visibleMeshRenderers: []
        };
    }

    /**
     * Reevaluate camera assignments for all render targets.
     * Component render targets get the first camera found in their entity hierarchy (depth-first).
     * The core render target gets the first active camera not claimed by any component render target.
     */
    private reevaluateCameras(): void {
        const lClaimedCameras: Set<CameraComponent> = new Set<CameraComponent>();

        // Assign cameras to component render targets from their entity hierarchy.
        for (const [lComponent, lData] of this.mRenderTargetDataMap) {
            const lCameraEntities: Array<GameEntity> = lComponent.gameEntity.getGameObjectsWithComponent(CameraComponent);

            if (lCameraEntities.length > 0) {
                const lCamera: CameraComponent = lCameraEntities[0].getComponent(CameraComponent)!;
                lData.camera = lCamera;
                lData.cameraTransformation = lCamera.gameEntity.getComponent(TransformationComponent)!;
                lClaimedCameras.add(lCamera);

                // Set camera aspect ratio to match the render target dimensions.
                lCamera.projection.aspectRatio = lData.renderTargets.width / lData.renderTargets.height;
            } else {
                lData.camera = null;
                lData.cameraTransformation = null;
            }
        }

        // Assign the first unclaimed camera to the core render target.
        if (this.mCoreRenderTargetData) {
            this.mCoreRenderTargetData.camera = null;
            this.mCoreRenderTargetData.cameraTransformation = null;

            for (const lCamera of this.mActiveCameras) {
                if (!lClaimedCameras.has(lCamera)) {
                    this.mCoreRenderTargetData.camera = lCamera;
                    this.mCoreRenderTargetData.cameraTransformation = lCamera.gameEntity.getComponent(TransformationComponent)!;

                    // Set camera aspect ratio to match the core render target dimensions.
                    lCamera.projection.aspectRatio = this.mCoreRenderTargetData.renderTargets.width / this.mCoreRenderTargetData.renderTargets.height;
                    break;
                }
            }
        }
    }

    /**
     * Transform a local-space AABB by a transformation matrix to compute a world-space AABB.
     * Transforms all 8 corners of the bounding box and computes new axis-aligned min/max coordinates.
     *
     * @param pBounds - The local-space bounding box.
     * @param pTransformMatrix - The transformation matrix (model to world).
     *
     * @returns The world-space axis-aligned bounding box.
     */
    private computeWorldAABB(pBounds: BoundingBox, pTransformMatrix: Matrix): WorldAABB {
        let lMinX: number = Infinity;
        let lMinY: number = Infinity;
        let lMinZ: number = Infinity;
        let lMaxX: number = -Infinity;
        let lMaxY: number = -Infinity;
        let lMaxZ: number = -Infinity;

        // Iterate all 8 corners of the AABB using bit flags for min/max selection.
        for (let lCornerIndex = 0; lCornerIndex < 8; lCornerIndex++) {
            const lX: number = (lCornerIndex & 1) ? pBounds.maxX : pBounds.minX;
            const lY: number = (lCornerIndex & 2) ? pBounds.maxY : pBounds.minY;
            const lZ: number = (lCornerIndex & 4) ? pBounds.maxZ : pBounds.minZ;

            // Transform corner to world space (homogeneous coordinate w=1).
            const lTransformed: Vector = pTransformMatrix.vectorMult(new Vector([lX, lY, lZ, 1]));

            // Update world-space min/max.
            lMinX = Math.min(lMinX, lTransformed.x);
            lMinY = Math.min(lMinY, lTransformed.y);
            lMinZ = Math.min(lMinZ, lTransformed.z);
            lMaxX = Math.max(lMaxX, lTransformed.x);
            lMaxY = Math.max(lMaxY, lTransformed.y);
            lMaxZ = Math.max(lMaxZ, lTransformed.z);
        }

        return { minX: lMinX, minY: lMinY, minZ: lMinZ, maxX: lMaxX, maxY: lMaxY, maxZ: lMaxZ };
    }
}

/**
 * Axis-aligned bounding box in world space defined by min/max coordinates.
 */
type WorldAABB = {
    minX: number;
    minY: number;
    minZ: number;
    maxX: number;
    maxY: number;
    maxZ: number;
};
