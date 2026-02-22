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
import { TransformationSystem } from './transformation-system.ts';

/**
 * System that manages render targets, camera assignments, and per-frame frustum culling.
 *
 * Tracks RenderTargetComponent, CameraComponent, and MeshRenderComponent lifecycle events.
 * Creates GPU RenderTargets objects for each render target component and a core render target on initialization.
 * Maintains a per-render-target camera assignment and a visible mesh renderer list that is updated every frame.
 *
 * The core render target is created during onCreate and is backed by a canvas element.
 * A canvas can be provided before onCreate; if none is set, a new one is created automatically.
 * The core render target reacts to canvas size changes via a ResizeObserver.
 *
 * Camera assignment:
 * - Component render targets get the first enabled camera found in their entity hierarchy (via depth-first traversal).
 * - The core render target gets the first active enabled camera not claimed by any component render target.
 *
 * Mesh renderer tracking uses per-render-target swap-remove lists for O(1) add/remove by index.
 * Mesh renderers are assigned to the nearest ancestor RenderTargetComponent in the entity hierarchy.
 * When a render target has passthrough enabled, its mesh renderers are also added to the next ancestor render target.
 */
export class RenderTargetSystem extends GameSystem {
    // Dummy key used for the core render target in WeakMaps.
    private static readonly CORE_RT_KEY: RenderTargetComponent = {} as unknown as RenderTargetComponent;

    // Render target data storage.
    private mCoreRenderTargetData: RenderTargetData | null;
    private readonly mRenderTargetDataMap: Map<RenderTargetComponent, RenderTargetData>;

    // Canvas state.
    private mCanvas: HTMLCanvasElement | null;
    private mCanvasTexture: CanvasTexture | null;
    private mResizeObserver: ResizeObserver | null;

    // Per-render-target active mesh renderer tracking with swap-remove lists.
    private readonly mActiveMeshRenderers: WeakMap<RenderTargetComponent, RenderTargetSystemActiveMeshes>;

    // Tracks which render targets each mesh renderer belongs to (for passthrough cleanup).
    private readonly mMeshToRenderTargets: WeakMap<MeshRenderComponent, Array<RenderTargetComponent>>;

    // Cached world-space AABBs for mesh renderers. Updated in onUpdate, read in onFrame.
    private readonly mWorldAABBCache: WeakMap<MeshRenderComponent, WorldAABB>;

    // Active camera tracking for reevaluation.
    private readonly mActiveCameras: Set<CameraComponent>;

    // Tracks which render target each camera is assigned to.
    private readonly mCameraToRenderTarget: WeakMap<CameraComponent, RenderTargetComponent>;

    /**
     * Systems this system depends on.
     */
    public override get dependentSystemTypes(): Array<GameSystemConstructor<GameSystem>> {
        return [GpuSystem, TransformationSystem];
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
     * The canvas can be resized externally; the core render target will react to size changes via ResizeObserver.
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
     * Constructor.
     */
    public constructor() {
        super();

        this.mRenderTargetDataMap = new Map<RenderTargetComponent, RenderTargetData>();
        this.mCoreRenderTargetData = null;
        this.mCanvas = null;
        this.mCanvasTexture = null;
        this.mResizeObserver = null;
        this.mActiveMeshRenderers = new WeakMap<RenderTargetComponent, RenderTargetSystemActiveMeshes>();
        this.mMeshToRenderTargets = new WeakMap<MeshRenderComponent, Array<RenderTargetComponent>>();
        this.mWorldAABBCache = new WeakMap<MeshRenderComponent, WorldAABB>();
        this.mActiveCameras = new Set<CameraComponent>();
        this.mCameraToRenderTarget = new WeakMap<CameraComponent, RenderTargetComponent>();
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
     * Initialize the canvas, canvas texture, and core render target.
     * If no canvas was set before this call, a new canvas element is created.
     * Sets up a ResizeObserver to react to canvas size changes.
     */
    protected override async onCreate(): Promise<void> {
        const lGpu: GpuDevice = this.getDependency(GpuSystem).gpu;

        // Create canvas if not set before system creation.
        if (!this.mCanvas) {
            this.mCanvas = document.createElement('canvas');
        }

        // Create canvas texture from the canvas element.
        this.mCanvasTexture = lGpu.canvas(this.mCanvas);

        // Create the core render target backed by the canvas.
        const lWidth: number = Math.round(this.mCanvas.clientWidth * devicePixelRatio);
        const lHeight: number = Math.round(this.mCanvas.clientHeight * devicePixelRatio);
        this.mCoreRenderTargetData = this.setupRenderTarget(lWidth, lHeight, this.mCanvasTexture);

        // Initialize the core render target's active mesh list.
        this.mActiveMeshRenderers.set(RenderTargetSystem.CORE_RT_KEY, { activeList: [], indexMap: new Map() });

        // Observe canvas size changes via ResizeObserver.
        this.mResizeObserver = new ResizeObserver((pEntries: Array<ResizeObserverEntry>) => {
            const lEntry: ResizeObserverEntry = pEntries[0];
            const lNewWidth: number = Math.round(lEntry.contentBoxSize[0].inlineSize * devicePixelRatio);
            const lNewHeight: number = Math.round(lEntry.contentBoxSize[0].blockSize * devicePixelRatio);

            if (this.mCoreRenderTargetData) {
                this.mCoreRenderTargetData.renderTargets.resize(lNewHeight, lNewWidth);

                // Update camera aspect ratio to match the new canvas dimensions.
                if (this.mCoreRenderTargetData.camera) {
                    const lRenderTargets: RenderTargets = this.mCoreRenderTargetData.renderTargets;
                    this.mCoreRenderTargetData.camera.projection.aspectRatio = lRenderTargets.width / lRenderTargets.height;
                }
            }
        });
        this.mResizeObserver.observe(this.mCanvas);
    }

    /**
     * Per-frame update: rebuild visible mesh renderer lists using cached frustums and world AABBs.
     */
    protected override async onFrame(): Promise<void> {
        // Rebuild visible mesh list for each component render target.
        for (const [lComponent, lData] of this.mRenderTargetDataMap) {
            this.rebuildVisibleMeshList(lComponent, lData);
        }

        // Rebuild visible mesh list for the core render target.
        if (this.mCoreRenderTargetData) {
            this.rebuildVisibleMeshList(RenderTargetSystem.CORE_RT_KEY, this.mCoreRenderTargetData);
        }
    }

    /**
     * Handle component state changes for render targets, cameras, and mesh renderers.
     *
     * @param pStateChanges - Map of component types to their state change events.
     */
    protected override async onUpdate(pStateChanges: Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>): Promise<void> {
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

                        // Initialize the active mesh list for this render target.
                        this.mActiveMeshRenderers.set(lComponent, { activeList: [], indexMap: new Map() });

                        // Assign enabled mesh renderers under this render target.
                        this.assignMeshRenderersToRenderTarget(lComponent);

                        // Reevaluate camera for this render target and the core render target.
                        this.reevaluateRenderTargetCamera(lComponent, lData);
                        this.reevaluateCoreCamera();
                        break;
                    }
                    case 'remove':
                    case 'deactivate': {
                        // Reassign mesh renderers that were under this render target.
                        this.reassignMeshRenderersFromRenderTarget(lComponent);

                        // Remove camera assignment tracking for this render target's camera.
                        const lData: RenderTargetData | undefined = this.mRenderTargetDataMap.get(lComponent);
                        if (lData?.camera) {
                            this.mCameraToRenderTarget.delete(lData.camera);
                        }

                        this.mRenderTargetDataMap.delete(lComponent);

                        // Reevaluate core camera in case a camera was freed.
                        this.reevaluateCoreCamera();
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
                        if (!lCamera.enabled) {
                            break;
                        }

                        this.mActiveCameras.add(lCamera);

                        // Find the render target this camera belongs to and reevaluate its camera assignment.
                        const lParentRT: RenderTargetComponent | null = lCamera.gameEntity.getParentComponent(RenderTargetComponent);
                        if (lParentRT && this.mRenderTargetDataMap.has(lParentRT)) {
                            this.reevaluateRenderTargetCamera(lParentRT, this.mRenderTargetDataMap.get(lParentRT)!);
                        }

                        // Always reevaluate core camera as unclaimed cameras may have changed.
                        this.reevaluateCoreCamera();
                        break;
                    }
                    case 'remove':
                    case 'deactivate': {
                        this.mActiveCameras.delete(lCamera);

                        // Find which render target this camera was assigned to.
                        const lAssignedRT: RenderTargetComponent | undefined = this.mCameraToRenderTarget.get(lCamera);
                        this.mCameraToRenderTarget.delete(lCamera);

                        if (lAssignedRT && lAssignedRT !== RenderTargetSystem.CORE_RT_KEY) {
                            // Reevaluate the component render target to find a replacement camera.
                            const lData: RenderTargetData | undefined = this.mRenderTargetDataMap.get(lAssignedRT);
                            if (lData) {
                                this.reevaluateRenderTargetCamera(lAssignedRT, lData);
                            }
                        }

                        // Reevaluate core camera.
                        this.reevaluateCoreCamera();
                        break;
                    }
                    case 'update': {
                        if (!lCamera.enabled) {
                            break;
                        }

                        // Recompute frustum for the render target this camera is assigned to.
                        const lAssignedRT: RenderTargetComponent | undefined = this.mCameraToRenderTarget.get(lCamera);
                        if (lAssignedRT) {
                            const lData: RenderTargetData | undefined = (lAssignedRT === RenderTargetSystem.CORE_RT_KEY)
                                ? this.mCoreRenderTargetData ?? undefined
                                : this.mRenderTargetDataMap.get(lAssignedRT);

                            if (lData) {
                                this.updateFrustum(lData);
                            }
                        }
                        break;
                    }
                }
            }
        }

        // Process MeshRenderComponent changes.
        const lMeshChanges: ReadonlyArray<GameEnvironmentStateChange> | undefined = pStateChanges.get(MeshRenderComponent);
        if (lMeshChanges) {
            for (const lChange of lMeshChanges) {
                const lComponent: MeshRenderComponent = lChange.component as MeshRenderComponent;

                switch (lChange.type) {
                    case 'add':
                    case 'activate': {
                        if (!lComponent.enabled) {
                            break;
                        }

                        // Add mesh renderer to the render target chain and compute its world AABB.
                        this.addMeshToRenderTargetChain(lComponent);
                        this.updateWorldAABB(lComponent);
                        break;
                    }
                    case 'remove':
                    case 'deactivate': {
                        // Remove mesh renderer from all assigned render targets.
                        this.removeMeshFromAllRenderTargets(lComponent);
                        this.mWorldAABBCache.delete(lComponent);
                        break;
                    }
                    case 'update': {
                        if (!lComponent.enabled) {
                            break;
                        }

                        // Recompute the cached world AABB.
                        this.updateWorldAABB(lComponent);
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
     * Reevaluate camera assignment for a specific component render target.
     * Searches the render target's entity hierarchy for the first enabled camera.
     *
     * @param pRTComponent - The render target component to reevaluate.
     * @param pRTData - The render target data to update.
     */
    private reevaluateRenderTargetCamera(pRTComponent: RenderTargetComponent, pRTData: RenderTargetData): void {
        // Clear previous camera assignment tracking.
        if (pRTData.camera) {
            this.mCameraToRenderTarget.delete(pRTData.camera);
        }

        // Search entity hierarchy for cameras.
        const lCameraEntities: Array<GameEntity> = pRTComponent.gameEntity.getGameObjectsWithComponent(CameraComponent);

        for (const lEntity of lCameraEntities) {
            const lCamera: CameraComponent = lEntity.getComponent(CameraComponent)!;

            if (lCamera.enabled) {
                pRTData.camera = lCamera;
                pRTData.cameraTransformation = lCamera.gameEntity.getComponent(TransformationComponent)!;
                this.mCameraToRenderTarget.set(lCamera, pRTComponent);

                // Set camera aspect ratio to match the render target dimensions.
                lCamera.projection.aspectRatio = pRTData.renderTargets.width / pRTData.renderTargets.height;

                // Compute frustum for the newly assigned camera.
                this.updateFrustum(pRTData);
                return;
            }
        }

        // No enabled camera found.
        pRTData.camera = null;
        pRTData.cameraTransformation = null;
    }

    /**
     * Reevaluate camera assignment for the core render target.
     * Assigns the first active enabled camera not claimed by any component render target.
     */
    private reevaluateCoreCamera(): void {
        if (!this.mCoreRenderTargetData) {
            return;
        }

        // Clear previous core camera assignment tracking.
        if (this.mCoreRenderTargetData.camera) {
            this.mCameraToRenderTarget.delete(this.mCoreRenderTargetData.camera);
        }

        this.mCoreRenderTargetData.camera = null;
        this.mCoreRenderTargetData.cameraTransformation = null;

        // Collect all cameras claimed by component render targets.
        const lClaimedCameras: Set<CameraComponent> = new Set<CameraComponent>();
        for (const lData of this.mRenderTargetDataMap.values()) {
            if (lData.camera) {
                lClaimedCameras.add(lData.camera);
            }
        }

        // Find the first unclaimed enabled active camera.
        for (const lCamera of this.mActiveCameras) {
            if (!lClaimedCameras.has(lCamera) && lCamera.enabled) {
                this.mCoreRenderTargetData.camera = lCamera;
                this.mCoreRenderTargetData.cameraTransformation = lCamera.gameEntity.getComponent(TransformationComponent)!;
                this.mCameraToRenderTarget.set(lCamera, RenderTargetSystem.CORE_RT_KEY);

                // Set camera aspect ratio to match the core render target dimensions.
                lCamera.projection.aspectRatio = this.mCoreRenderTargetData.renderTargets.width / this.mCoreRenderTargetData.renderTargets.height;

                // Compute frustum for the newly assigned camera.
                this.updateFrustum(this.mCoreRenderTargetData);
                break;
            }
        }
    }

    /**
     * Update the frustum for a render target using its assigned camera's world transformation.
     *
     * @param pRTData - The render target data whose frustum to update.
     */
    private updateFrustum(pRTData: RenderTargetData): void {
        if (!pRTData.camera || !pRTData.cameraTransformation) {
            return;
        }

        const lTransformSystem: TransformationSystem = this.getDependency(TransformationSystem);
        const lWorldMatrix: Matrix = lTransformSystem.worldMatrixOfTransformation(pRTData.cameraTransformation);
        const lViewMatrix: Matrix = lWorldMatrix.inverse();
        const lViewProjectionMatrix: Matrix = pRTData.camera.matrix.mult(lViewMatrix);
        pRTData.frustum.update(lViewProjectionMatrix);
    }

    /**
     * Add a mesh renderer to its render target chain, following passthrough rules.
     * Walks up the entity hierarchy to find the nearest RenderTargetComponent.
     * If the render target has passthrough enabled, also adds the mesh to the next ancestor render target.
     *
     * @param pMesh - The mesh render component to add.
     */
    private addMeshToRenderTargetChain(pMesh: MeshRenderComponent): void {
        const lTargets: Array<RenderTargetComponent> = [];

        // Find the nearest ancestor RenderTargetComponent.
        const lParentRT: RenderTargetComponent | null = pMesh.gameEntity.getParentComponent(RenderTargetComponent);
        let lCurrentRT: RenderTargetComponent = lParentRT && this.mRenderTargetDataMap.has(lParentRT)
            ? lParentRT
            : RenderTargetSystem.CORE_RT_KEY;

        // Walk up the render target chain, following passthrough.
        while (true) {
            this.addMeshToSingleRenderTarget(pMesh, lCurrentRT);
            lTargets.push(lCurrentRT);

            // Stop at the core render target.
            if (lCurrentRT === RenderTargetSystem.CORE_RT_KEY) {
                break;
            }

            // Stop if passthrough is not enabled.
            if (!lCurrentRT.passthrough) {
                break;
            }

            // Find the next ancestor render target.
            const lParentEntity: GameEntity | null = lCurrentRT.gameEntity.parent as GameEntity | null;
            if (lParentEntity) {
                const lNextRT: RenderTargetComponent | null = lParentEntity.getParentComponent(RenderTargetComponent);
                lCurrentRT = lNextRT && this.mRenderTargetDataMap.has(lNextRT) ? lNextRT : RenderTargetSystem.CORE_RT_KEY;
            } else {
                lCurrentRT = RenderTargetSystem.CORE_RT_KEY;
            }
        }

        this.mMeshToRenderTargets.set(pMesh, lTargets);
    }

    /**
     * Add a mesh renderer to a single render target's active list using swap-add.
     *
     * @param pMesh - The mesh render component to add.
     * @param pRTKey - The render target component key (or CORE_RT_KEY).
     */
    private addMeshToSingleRenderTarget(pMesh: MeshRenderComponent, pRTKey: RenderTargetComponent): void {
        const lMeshData: RenderTargetSystemActiveMeshes | undefined = this.mActiveMeshRenderers.get(pRTKey);
        if (!lMeshData) {
            return;
        }

        // Avoid duplicate entries.
        if (lMeshData.indexMap.has(pMesh)) {
            return;
        }

        const lIndex: number = lMeshData.activeList.length;
        lMeshData.activeList.push(pMesh);
        lMeshData.indexMap.set(pMesh, lIndex);
    }

    /**
     * Remove a mesh renderer from all render targets it belongs to.
     *
     * @param pMesh - The mesh render component to remove.
     */
    private removeMeshFromAllRenderTargets(pMesh: MeshRenderComponent): void {
        const lTargets: Array<RenderTargetComponent> | undefined = this.mMeshToRenderTargets.get(pMesh);
        if (!lTargets) {
            return;
        }

        for (const lRTKey of lTargets) {
            this.removeMeshFromSingleRenderTarget(pMesh, lRTKey);
        }

        this.mMeshToRenderTargets.delete(pMesh);
    }

    /**
     * Remove a mesh renderer from a single render target's active list using swap-remove.
     *
     * @param pMesh - The mesh render component to remove.
     * @param pRTKey - The render target component key (or CORE_RT_KEY).
     */
    private removeMeshFromSingleRenderTarget(pMesh: MeshRenderComponent, pRTKey: RenderTargetComponent): void {
        const lMeshData: RenderTargetSystemActiveMeshes | undefined = this.mActiveMeshRenderers.get(pRTKey);
        if (!lMeshData) {
            return;
        }

        const lIndex: number | undefined = lMeshData.indexMap.get(pMesh);
        if (lIndex === undefined) {
            return;
        }

        const lLastIndex: number = lMeshData.activeList.length - 1;

        // Swap the removed element with the last element to avoid shifting.
        if (lIndex !== lLastIndex) {
            const lLastComponent: MeshRenderComponent = lMeshData.activeList[lLastIndex];
            lMeshData.activeList[lIndex] = lLastComponent;
            lMeshData.indexMap.set(lLastComponent, lIndex);
        }

        // Remove the last element.
        lMeshData.activeList.pop();
        lMeshData.indexMap.delete(pMesh);
    }

    /**
     * Assign all enabled mesh renderers under a render target's entity hierarchy.
     * Called when a new render target is added. Walks the hierarchy and reassigns
     * mesh renderers from their current render target (or core) to this one.
     *
     * @param pRTComponent - The newly added render target component.
     */
    private assignMeshRenderersToRenderTarget(pRTComponent: RenderTargetComponent): void {
        const lMeshEntities: Array<GameEntity> = pRTComponent.gameEntity.getGameObjectsWithComponent(MeshRenderComponent);

        for (const lEntity of lMeshEntities) {
            const lMesh: MeshRenderComponent = lEntity.getComponent(MeshRenderComponent)!;

            if (!lMesh.enabled) {
                continue;
            }

            // Remove from current assignments and reassign.
            this.removeMeshFromAllRenderTargets(lMesh);
            this.addMeshToRenderTargetChain(lMesh);
        }
    }

    /**
     * Reassign mesh renderers from a removed render target to their next ancestor render target.
     *
     * @param pRTComponent - The render target component being removed.
     */
    private reassignMeshRenderersFromRenderTarget(pRTComponent: RenderTargetComponent): void {
        const lMeshData: RenderTargetSystemActiveMeshes | undefined = this.mActiveMeshRenderers.get(pRTComponent);
        if (!lMeshData) {
            return;
        }

        // Copy the list since we'll modify it during iteration.
        const lMeshRenderers: Array<MeshRenderComponent> = [...lMeshData.activeList];

        for (const lMesh of lMeshRenderers) {
            if (!lMesh.enabled) {
                continue;
            }

            // Remove from all current assignments and reassign.
            this.removeMeshFromAllRenderTargets(lMesh);
            this.addMeshToRenderTargetChain(lMesh);
        }
    }

    /**
     * Update the cached world AABB for a mesh render component.
     *
     * @param pMesh - The mesh render component to update.
     */
    private updateWorldAABB(pMesh: MeshRenderComponent): void {
        const lTransformSystem: TransformationSystem = this.getDependency(TransformationSystem);
        const lTransformation: TransformationComponent = pMesh.gameEntity.getComponent(TransformationComponent)!;
        const lWorldMatrix: Matrix = lTransformSystem.worldMatrixOfTransformation(lTransformation);
        const lBounds: BoundingBox = pMesh.mesh.bounds;
        const lWorldAABB: WorldAABB = this.computeWorldAABB(lBounds, lWorldMatrix);
        this.mWorldAABBCache.set(pMesh, lWorldAABB);
    }

    /**
     * Rebuild the visible mesh renderer list for a render target using cached frustum and world AABBs.
     *
     * @param pRTKey - The render target component key (or CORE_RT_KEY).
     * @param pRTData - The render target data to update.
     */
    private rebuildVisibleMeshList(pRTKey: RenderTargetComponent, pRTData: RenderTargetData): void {
        pRTData.visibleMeshRenderers.length = 0;

        // Skip render targets without an assigned camera.
        if (!pRTData.camera || !pRTData.cameraTransformation) {
            return;
        }

        const lMeshData: RenderTargetSystemActiveMeshes | undefined = this.mActiveMeshRenderers.get(pRTKey);
        if (!lMeshData) {
            return;
        }

        for (const lMeshRenderer of lMeshData.activeList) {
            const lWorldAABB: WorldAABB | undefined = this.mWorldAABBCache.get(lMeshRenderer);
            if (!lWorldAABB) {
                continue;
            }

            // Test the cached world-space AABB against the cached frustum.
            if (pRTData.frustum.intersectsAABB(lWorldAABB.minX, lWorldAABB.minY, lWorldAABB.minZ, lWorldAABB.maxX, lWorldAABB.maxY, lWorldAABB.maxZ)) {
                pRTData.visibleMeshRenderers.push(lMeshRenderer);
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
 * Per-render-target active mesh renderer tracking data.
 * Uses a swap-remove pattern for O(1) add/remove operations.
 */
type RenderTargetSystemActiveMeshes = {
    activeList: Array<MeshRenderComponent>;
    indexMap: Map<MeshRenderComponent, number>;
};

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
