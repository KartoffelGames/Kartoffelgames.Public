import { Frustum, Vector, type Matrix } from '@kartoffelgames/core';
import { CameraComponent } from '../component/camera/camera-component.ts';
import { MeshRenderComponent } from '../component/mesh-render-component.ts';
import { RenderTargetComponent } from '../component/render-target-component.ts';
import { TransformationComponent } from '../component/transformation-component.ts';
import type { BoundingBox } from '../component_item/bounding-box.ts';
import type { GameComponentConstructor } from '../core/component/game-component.ts';
import { GameSystem, type GameSystemConstructor } from '../core/game-system.ts';
import type { GameEntity } from '../core/hierarchy/game-entity.ts';
import { TransformationSystem } from './transformation-system.ts';
import type { GameEnvironment, GameEnvironmentStateChange } from '../core/environment/game-environment.ts';

/**
 * System that manages camera assignments and per-frame frustum culling for render targets.
 *
 * Tracks RenderTargetComponent, CameraComponent, and MeshRenderComponent lifecycle events.
 * Maintains a per-render-target camera assignment and both active and visible mesh renderer lists.
 *
 * A standalone CoreRenderTargetComponent is created during onCreate for the core render target.
 * External systems (e.g. a rendering system) can update its dimensions to trigger camera aspect ratio changes.
 *
 * Camera assignment:
 * - Component render targets get the first enabled camera found in their entity hierarchy (via depth-first traversal).
 * - The core render target gets the first active enabled camera not claimed by any component render target.
 *
 * Mesh renderer tracking uses per-render-target swap-remove lists for O(1) add/remove by index.
 * Mesh renderers are assigned to the nearest ancestor RenderTargetComponent in the entity hierarchy.
 * When a render target has passthrough enabled, its mesh renderers are also added to the next ancestor render target.
 */
export class CullSystem extends GameSystem {
    // Root render target component (standalone, not attached to any entity).
    private readonly mRootRenderTarget: RenderTargetComponent;

    // Culling data for core and component render targets.
    private readonly mRenderTargetDataMap: Map<RenderTargetComponent, CullSystemRenderTargetData>;

    // Tracks which render targets each mesh renderer belongs to (for passthrough cleanup).
    private readonly mMeshRendererToRenderTargets: WeakMap<MeshRenderComponent, Array<RenderTargetComponent>>;

    // Cached world-space bounding boxes for mesh renderers. Updated in onUpdate, read in onFrame.
    private readonly mWorldBoundsCache: WeakMap<MeshRenderComponent, CullSystemWorldBounds>;

    // Active camera tracking for reevaluation.
    private readonly mActiveCameras: Set<CameraComponent>;

    // Tracks which render target each camera is assigned to.
    private readonly mCameraToRenderTarget: WeakMap<CameraComponent, RenderTargetComponent>;

    // Dependencies.
    private mDependencyTransformationSystem: TransformationSystem | null;

    /**
     * Systems this system depends on.
     */
    public override get dependentSystemTypes(): Array<GameSystemConstructor<GameSystem>> {
        return [TransformationSystem];
    }

    /**
     * Component types this system handles.
     */
    public override get handledComponentTypes(): Array<GameComponentConstructor> {
        return [RenderTargetComponent, CameraComponent, MeshRenderComponent];
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
        super(pEnvironment);

        this.mRenderTargetDataMap = new Map<RenderTargetComponent, CullSystemRenderTargetData>();
        this.mMeshRendererToRenderTargets = new WeakMap<MeshRenderComponent, Array<RenderTargetComponent>>();
        this.mWorldBoundsCache = new WeakMap<MeshRenderComponent, CullSystemWorldBounds>();
        this.mCameraToRenderTarget = new WeakMap<CameraComponent, RenderTargetComponent>();
        this.mActiveCameras = new Set<CameraComponent>();

        // Set dependencies to null.
        this.mDependencyTransformationSystem = null;

        // Init root render target as early as possible.
        this.mRootRenderTarget = new CoreRenderTargetComponent(this.environment);
        this.mRenderTargetDataMap.set(this.mRootRenderTarget, this.createEmptyRenderTargetData());
    }

    /**
     * Get readonly culling data for a render target component.
     * Works for both the core render target and entity-attached render target components.
     *
     * @param pRenderTarget - The render target component to look up.
     *
     * @returns Readonly culling data, or undefined if the component is not tracked.
     */
    public getRenderTargetCulling(pRenderTarget: RenderTargetComponent): ReadonlyCullSystemRenderTargetData {
        this.lockGate();

        return this.mRenderTargetDataMap.get(pRenderTarget)!;
    }

    /**
     * Initialize the core render target component.
     */
    protected override async onCreate(): Promise<void> {
        // Get dependencies.
        this.mDependencyTransformationSystem = this.environment.getSystem(TransformationSystem);
    }

    /**
     * Per-frame update: rebuild visible mesh renderer lists using cached frustums and world bounding boxes.
     */
    protected override async onFrame(): Promise<void> {
        // Rebuild visible mesh list for each component render target.
        for (const lData of this.mRenderTargetDataMap.values()) {
            this.rebuildVisibleMeshList(lData);
        }
    }

    /**
     * Handle component state changes for render targets, cameras, and mesh renderers.
     *
     * @param pStateChanges - Map of component types to their state change events.
     */
    protected override async onUpdate(pStateChanges: Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>): Promise<void> {
        // Process RenderTargetComponent changes.
        const lRenderTargetChanges: ReadonlyArray<GameEnvironmentStateChange> = pStateChanges.get(RenderTargetComponent)!;
        if (lRenderTargetChanges.length > 0) {
            for (const lChange of lRenderTargetChanges) {
                const lRenderTarget: RenderTargetComponent = lChange.component as RenderTargetComponent;

                switch (lChange.type) {
                    case 'add':
                    case 'activate': {
                        const lData: CullSystemRenderTargetData = this.createEmptyRenderTargetData();
                        this.mRenderTargetDataMap.set(lRenderTarget, lData);

                        // Assign enabled mesh renderers under this render target.
                        this.assignMeshRenderersToRenderTarget(lRenderTarget);

                        break;
                    }
                    case 'remove':
                    case 'deactivate': {
                        // Reassign mesh renderers that were under this render target.
                        this.reassignMeshRenderersFromRenderTarget(lRenderTarget);

                        // Remove camera assignment tracking for this render target's camera.
                        const lData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(lRenderTarget)!;
                        if (lData.camera) {
                            this.mCameraToRenderTarget.delete(lData.camera.component);
                        }

                        this.mRenderTargetDataMap.delete(lRenderTarget);

                        break;
                    }
                    case 'update': {
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
        const lCameraChanges: ReadonlyArray<GameEnvironmentStateChange> = pStateChanges.get(CameraComponent)!;
        if (lCameraChanges.length > 0) {
            for (const lChange of lCameraChanges) {
                const lCamera: CameraComponent = lChange.component as CameraComponent;

                switch (lChange.type) {
                    case 'add':
                    case 'activate': {
                        if (!lCamera.enabled) {
                            break;
                        }

                        this.activateCamera(lCamera);
                        break;
                    }
                    case 'remove':
                    case 'deactivate': {
                        this.deactivateCamera(lCamera);
                        break;
                    }
                    case 'update': {
                        // Recompute frustum for the render target this camera is assigned to.
                        const lAssignedRenderTarget: RenderTargetComponent | undefined = this.mCameraToRenderTarget.get(lCamera);
                        if (lAssignedRenderTarget) {
                            this.updateFrustum(this.mRenderTargetDataMap.get(lAssignedRenderTarget)!);
                        }
                        break;
                    }
                }
            }
        }

        // Process MeshRenderComponent changes.
        const lMeshChanges: ReadonlyArray<GameEnvironmentStateChange> = pStateChanges.get(MeshRenderComponent)!;
        if (lMeshChanges.length > 0) {
            for (const lChange of lMeshChanges) {
                const lMeshRenderer: MeshRenderComponent = lChange.component as MeshRenderComponent;

                switch (lChange.type) {
                    case 'add':
                    case 'activate': {
                        if (!lMeshRenderer.enabled) {
                            break;
                        }

                        // Add mesh renderer to the render target chain and compute its world bounding box.
                        this.addMeshRendererToRenderTargetChain(lMeshRenderer);

                        break;
                    }
                    case 'remove':
                    case 'deactivate': {
                        // Remove mesh renderer from all assigned render targets.
                        this.removeMeshRendererFromAllRenderTargets(lMeshRenderer);
                        break;
                    }
                    case 'update': {
                        if (!lMeshRenderer.enabled) {
                            break;
                        }

                        // Invalidate world bounds cache for this mesh renderer since its local bounds may have changed.
                        this.mWorldBoundsCache.delete(lMeshRenderer);
                        break;
                    }
                }
            }
        }
    }

    /**
     * Create an empty render target data object for culling.
     *
     * @returns A new culling data object with no camera assigned and empty mesh lists.
     */
    private createEmptyRenderTargetData(): CullSystemRenderTargetData {
        return {
            camera: null,
            frustum: new Frustum(),
            activeMeshRenderers: [],
            meshRendererIndexMap: new Map(),
            visibleMeshRenderers: []
        };
    }

    /**
     * Activate a camera component by assigning it to the appropriate render target and updating frustums.
     * If the camera is already active on another render target, it will be ignored.
     */
    public activateCamera(pCamera: CameraComponent): void {
        // Add to active cameras set.
        this.mActiveCameras.add(pCamera);

        // Find the render target this camera belongs to and reevaluate its camera assignment.
        let lParentRenderTarget: RenderTargetComponent | null = pCamera.gameEntity.getParentComponent(RenderTargetComponent);
        if (!lParentRenderTarget) {
            lParentRenderTarget = this.mRootRenderTarget;
        }

        // Set camera as active when render target has no active camera set.
        const lRenderTargetData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(lParentRenderTarget)!;

        if (!lRenderTargetData.camera) {
            // Set camera assignment and track it.
            lRenderTargetData.camera = {
                component: pCamera,
                transformation: pCamera.gameEntity.getComponent(TransformationComponent)!
            };
            this.mCameraToRenderTarget.set(pCamera, lParentRenderTarget);

            // Set camera aspect ratio to match the render target dimensions.
            lRenderTargetData.camera.component.projection.aspectRatio = lParentRenderTarget.width / lParentRenderTarget.height;

            // Compute frustum for the newly assigned camera.
            this.updateFrustum(lRenderTargetData);
        }
    }

    /**
     * Deactivate a camera component by clearing its render target assignment and updating frustums.
     * Searches for a replacement camera for the affected render target, and if found, assigns it and updates the frustum.
     * 
     * @param pCamera - The camera component to deactivate. 
     */
    public deactivateCamera(pCamera: CameraComponent): void {
        // Remove from active cameras set.
        this.mActiveCameras.delete(pCamera);

        // When the camera is not active on any target. Skip.
        if (!this.mCameraToRenderTarget.has(pCamera)) {
            return;
        }

        const lRenderTarget: RenderTargetComponent = this.mCameraToRenderTarget.get(pCamera)!;
        const lRenderTargetData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(lRenderTarget)!;

        // Clear camera assignment.
        lRenderTargetData.camera = null;
        this.mCameraToRenderTarget.delete(pCamera);

        // Iterate all active cameras to find a new camera for the render target.
        for (const lCamera of this.mActiveCameras) {
            // When camera is already assigned to another render target. Skip.
            if (this.mCameraToRenderTarget.has(lCamera)) {
                continue;
            }

            // Find the render target this camera belongs to and reevaluate its camera assignment.
            let lParentRenderTarget: RenderTargetComponent | null = lCamera.gameEntity.getParentComponent(RenderTargetComponent);
            if (!lParentRenderTarget) {
                lParentRenderTarget = this.mRootRenderTarget;
            }

            // When the camera belongs to this render target, set it as the new active camera.
            if (lParentRenderTarget === lRenderTarget) {
                this.activateCamera(lCamera);
                return;
            }
        }
    }

    /**
     * Update the frustum for a render target using its assigned camera's world transformation.
     *
     * @param pData - The culling data whose frustum to update.
     */
    private updateFrustum(pData: CullSystemRenderTargetData): void {
        if (!pData.camera) {
            return;
        }

        // Read world matrix of camera and compute view-projection matrix to update the frustum.
        const lWorldMatrix: Matrix = this.mDependencyTransformationSystem!.worldMatrixOfTransformation(pData.camera.transformation);
        const lViewProjectionMatrix: Matrix = pData.camera.component.matrix.mult(lWorldMatrix.inverse());

        // Update the frustum with the new view-projection matrix.
        pData.frustum.update(lViewProjectionMatrix);
    }

    /**
     * Add a mesh renderer to its render target chain, following passthrough rules.
     * Walks up the entity hierarchy to find the nearest RenderTargetComponent.
     * If the render target has passthrough enabled, also adds the mesh renderer to the next ancestor render target.
     *
     * @param pMeshRenderer - The mesh render component to add.
     */
    private addMeshRendererToRenderTargetChain(pMeshRenderer: MeshRenderComponent): void {
        const lTargets: Array<RenderTargetComponent> = [];

        // Find the nearest ancestor RenderTargetComponent.
        const lParentRenderTarget: RenderTargetComponent | null = pMeshRenderer.gameEntity.getParentComponent(RenderTargetComponent);
        let lCurrentRenderTarget: RenderTargetComponent = this.mRootRenderTarget!;
        if (lParentRenderTarget && this.mRenderTargetDataMap.has(lParentRenderTarget)) {
            lCurrentRenderTarget = lParentRenderTarget;
        }

        // Walk up the render target chain, following passthrough.
        while (true) {
            this.addMeshRendererToSingleRenderTarget(pMeshRenderer, lCurrentRenderTarget);
            lTargets.push(lCurrentRenderTarget);

            // Stop at the core render target.
            if (lCurrentRenderTarget === this.mRootRenderTarget) {
                break;
            }

            // Stop if passthrough is not enabled.
            if (!lCurrentRenderTarget.passthrough) {
                break;
            }

            // Find the next ancestor render target.
            const lParentEntity: GameEntity | null = lCurrentRenderTarget.gameEntity.parent as GameEntity | null;
            if (lParentEntity) {
                const lNextRenderTarget: RenderTargetComponent | null = lParentEntity.getParentComponent(RenderTargetComponent);
                lCurrentRenderTarget = lNextRenderTarget && this.mRenderTargetDataMap.has(lNextRenderTarget) ? lNextRenderTarget : this.mRootRenderTarget!;
            } else {
                lCurrentRenderTarget = this.mRootRenderTarget!;
            }
        }

        this.mMeshRendererToRenderTargets.set(pMeshRenderer, lTargets);
    }

    /**
     * Add a mesh renderer to a single render target's active list using swap-add.
     *
     * @param pMeshRenderer - The mesh render component to add.
     * @param pRenderTarget - The render target component.
     */
    private addMeshRendererToSingleRenderTarget(pMeshRenderer: MeshRenderComponent, pRenderTarget: RenderTargetComponent): void {
        const lData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(pRenderTarget)!;

        // Avoid duplicate entries.
        if (lData.meshRendererIndexMap.has(pMeshRenderer)) {
            return;
        }

        const lIndex: number = lData.activeMeshRenderers.length;
        lData.activeMeshRenderers.push(pMeshRenderer);
        lData.meshRendererIndexMap.set(pMeshRenderer, lIndex);
    }

    /**
     * Remove a mesh renderer from all render targets it belongs to.
     *
     * @param pMeshRenderer - The mesh render component to remove.
     */
    private removeMeshRendererFromAllRenderTargets(pMeshRenderer: MeshRenderComponent): void {
        const lTargets: Array<RenderTargetComponent> | undefined = this.mMeshRendererToRenderTargets.get(pMeshRenderer);
        if (!lTargets) {
            return;
        }

        for (const lRenderTarget of lTargets) {
            const lData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(lRenderTarget)!;

            const lIndex: number | undefined = lData.meshRendererIndexMap.get(pMeshRenderer);
            if (lIndex === undefined) {
                continue;
            }

            const lLastIndex: number = lData.activeMeshRenderers.length - 1;

            // Swap the removed element with the last element to avoid shifting.
            if (lIndex !== lLastIndex) {
                const lLastMeshRenderer: MeshRenderComponent = lData.activeMeshRenderers[lLastIndex];
                lData.activeMeshRenderers[lIndex] = lLastMeshRenderer;
                lData.meshRendererIndexMap.set(lLastMeshRenderer, lIndex);
            }

            // Remove the last element.
            lData.activeMeshRenderers.pop();
            lData.meshRendererIndexMap.delete(pMeshRenderer);
        }

        this.mMeshRendererToRenderTargets.delete(pMeshRenderer);
    }

    /**
     * Assign all enabled mesh renderers under a render target's entity hierarchy.
     * Called when a new render target is added. Walks the hierarchy and reassigns
     * mesh renderers from their current render target (or core) to this one.
     *
     * @param pRenderTarget - The newly added render target component.
     */
    private assignMeshRenderersToRenderTarget(pRenderTarget: RenderTargetComponent): void {
        const lMeshEntities: Array<GameEntity> = pRenderTarget.gameEntity.getGameObjectsWithComponent(MeshRenderComponent);

        for (const lEntity of lMeshEntities) {
            const lMeshRenderer: MeshRenderComponent = lEntity.getComponent(MeshRenderComponent)!;

            if (!lMeshRenderer.enabled) {
                continue;
            }

            // Remove from current assignments and reassign.
            this.removeMeshRendererFromAllRenderTargets(lMeshRenderer);
            this.addMeshRendererToRenderTargetChain(lMeshRenderer);
        }
    }

    /**
     * Reassign mesh renderers from a removed render target to their next ancestor render target.
     *
     * @param pRenderTarget - The render target component being removed.
     */
    private reassignMeshRenderersFromRenderTarget(pRenderTarget: RenderTargetComponent): void {
        const lData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(pRenderTarget)!;

        // Copy the list since we'll modify it during iteration.
        const lMeshRenderers: Array<MeshRenderComponent> = [...lData.activeMeshRenderers];

        for (const lMeshRenderer of lMeshRenderers) {
            if (!lMeshRenderer.enabled) {
                continue;
            }

            // Remove from all current assignments and reassign.
            this.removeMeshRendererFromAllRenderTargets(lMeshRenderer);
            this.addMeshRendererToRenderTargetChain(lMeshRenderer);
        }
    }

    /**
     * Update the cached world bounding box for a mesh render component.
     *
     * Transforms all 8 corners of the local-space bounding box by the world matrix
     * and computes new axis-aligned min/max coordinates.
     *
     * @param pMeshRenderer - The mesh render component to update.
     */
    private calculateWorldBounds(pMeshRenderer: MeshRenderComponent): CullSystemWorldBounds {
        // Read transformation of mesh.
        const lTransformation: TransformationComponent = pMeshRenderer.gameEntity.getComponent(TransformationComponent)!;

        // Read the world matrix and bounds of mesh.
        const lWorldMatrix: Matrix = this.mDependencyTransformationSystem!.worldMatrixOfTransformation(lTransformation);
        const lBounds: BoundingBox = pMeshRenderer.mesh.bounds;

        let lMinX: number = Infinity;
        let lMinY: number = Infinity;
        let lMinZ: number = Infinity;
        let lMaxX: number = -Infinity;
        let lMaxY: number = -Infinity;
        let lMaxZ: number = -Infinity;

        // Iterate all 8 corners of the bounding box using bit flags for min/max selection.
        for (let lCornerIndex = 0; lCornerIndex < 8; lCornerIndex++) {
            const lX: number = (lCornerIndex & 1) ? lBounds.maxX : lBounds.minX;
            const lY: number = (lCornerIndex & 2) ? lBounds.maxY : lBounds.minY;
            const lZ: number = (lCornerIndex & 4) ? lBounds.maxZ : lBounds.minZ;

            // Transform corner to world space (homogeneous coordinate w=1).
            const lTransformed: Vector = lWorldMatrix.vectorMult(new Vector([lX, lY, lZ, 1]));

            // Update world-space min/max.
            lMinX = Math.min(lMinX, lTransformed.x);
            lMinY = Math.min(lMinY, lTransformed.y);
            lMinZ = Math.min(lMinZ, lTransformed.z);
            lMaxX = Math.max(lMaxX, lTransformed.x);
            lMaxY = Math.max(lMaxY, lTransformed.y);
            lMaxZ = Math.max(lMaxZ, lTransformed.z);
        }

        // Return the world-space bounding box.
        return {
            minX: lMinX,
            minY: lMinY,
            minZ: lMinZ,

            maxX: lMaxX,
            maxY: lMaxY,
            maxZ: lMaxZ
        };
    }

    /**
     * Rebuild the visible mesh renderer list for a render target using its cached frustum and world bounding boxes.
     *
     * @param pData - The culling data to update.
     */
    private rebuildVisibleMeshList(pData: CullSystemRenderTargetData): void {
        // Clear previous visible list.
        pData.visibleMeshRenderers = new Array<MeshRenderComponent>();
        
        // Skip render targets without an assigned camera.
        if (!pData.camera) {
            return;
        }

        // Iterate active mesh renderers and test their cached world bounds against the frustum.
        for (const lMeshRenderer of pData.activeMeshRenderers) {
            // Try to read cached world bounds. If not found, calculate and cache them for future frames.
            let lWorldBounds: CullSystemWorldBounds | undefined = this.mWorldBoundsCache.get(lMeshRenderer);
            if (!lWorldBounds) {
                // Recalculate world bounds if not cached.
                lWorldBounds = this.calculateWorldBounds(lMeshRenderer);

                // Cache the world bounds for future frames.
                this.mWorldBoundsCache.set(lMeshRenderer, lWorldBounds);
            }

            // Test the cached world-space bounding box against the cached frustum.
            if (pData.frustum.intersectsBoundingBox(lWorldBounds.minX, lWorldBounds.minY, lWorldBounds.minZ, lWorldBounds.maxX, lWorldBounds.maxY, lWorldBounds.maxZ)) {
                pData.visibleMeshRenderers.push(lMeshRenderer);
            }
        }
    }
}

/**
 * Internal mutable culling data for a render target.
 * Stores camera, frustum, and both active (all) and visible (after culling) mesh renderer lists.
 * Includes the swap-remove index map for O(1) mesh renderer add/remove.
 */
type CullSystemRenderTargetData = {
    camera: {
        component: CameraComponent;
        transformation: TransformationComponent;
    } | null;
    frustum: Frustum;
    activeMeshRenderers: Array<MeshRenderComponent>;
    meshRendererIndexMap: Map<MeshRenderComponent, number>;
    visibleMeshRenderers: Array<MeshRenderComponent>;
};

/**
 * Readonly culling data for a render target.
 * Exposed to external systems via getRenderTargetCulling.
 */
export type ReadonlyCullSystemRenderTargetData = {
    readonly camera: {
        readonly component: CameraComponent;
        readonly transformation: TransformationComponent;
    } | null;
    readonly frustum: Frustum;
    readonly activeMeshRenderers: ReadonlyArray<MeshRenderComponent>;
    readonly visibleMeshRenderers: ReadonlyArray<MeshRenderComponent>;
};

/**
 * Axis-aligned bounding box in world space defined by min/max coordinates.
 */
type CullSystemWorldBounds = {
    minX: number;
    minY: number;
    minZ: number;
    maxX: number;
    maxY: number;
    maxZ: number;
};

/**
 * Extended render target component for the core (canvas-backed) render target.
 * Unlike entity-attached RenderTargetComponents, this standalone component sends
 * update events directly to the GameEnvironment without requiring a parent GameEntity.
 */
export class CoreRenderTargetComponent extends RenderTargetComponent {
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
            this.mEnvironment.queueStateChange('update', this);
        }
    }
}
