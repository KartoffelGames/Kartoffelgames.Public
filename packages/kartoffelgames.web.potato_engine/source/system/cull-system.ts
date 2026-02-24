import { Frustum, Vector, type Matrix } from '@kartoffelgames/core';
import { CameraComponent } from '../component/camera/camera-component.ts';
import { MeshRenderComponent } from '../component/mesh-render-component.ts';
import { RenderTargetComponent } from '../component/render-target-component.ts';
import { TransformationComponent } from '../component/transformation-component.ts';
import type { BoundingBox } from '../component_item/bounding-box.ts';
import type { GameComponentConstructor } from '../core/component/game-component.ts';
import type { GameEnvironment, GameEnvironmentStateChange } from '../core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor } from '../core/game-system.ts';
import type { GameEntity } from '../core/hierarchy/game-entity.ts';
import { TransformationSystem } from './transformation-system.ts';

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
    private readonly mActiveCameras: Set<CameraComponent>;
    private readonly mCameraToRenderTarget: WeakMap<CameraComponent, RenderTargetComponent>;
    private mDependencyTransformationSystem: TransformationSystem | null;
    private readonly mMeshRendererToRenderTargets: WeakMap<MeshRenderComponent, Array<RenderTargetComponent>>;
    private readonly mMeshRendererWorldBounds: WeakMap<MeshRenderComponent, CullSystemWorldBounds>;
    private readonly mRenderTargetDataMap: Map<RenderTargetComponent, CullSystemRenderTargetData>;
    private readonly mRootRenderTarget: RenderTargetComponent;

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
        super('Cull', pEnvironment);

        this.mRenderTargetDataMap = new Map<RenderTargetComponent, CullSystemRenderTargetData>();
        this.mMeshRendererToRenderTargets = new WeakMap<MeshRenderComponent, Array<RenderTargetComponent>>();
        this.mMeshRendererWorldBounds = new WeakMap<MeshRenderComponent, CullSystemWorldBounds>();
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
            lData.meshes.visible = this.executeCulling(lData);
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
                    case 'add': {
                        this.addRenderTarget(lRenderTarget);
                        break;
                    }
                    case 'remove':{
                        this.removeRenderTarget(lRenderTarget);
                        break;
                    }
                    case 'deactivate': {
                        // Does nothing, as render target activation does not affect culling. Only camera activation/deactivation triggers culling changes.
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

                        this.assignCamera(lCamera);
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
                    case 'add': {
                        // Add mesh renderer to the render target chain and compute its world bounding box.
                        this.assignMeshRenderer(lMeshRenderer);
                        break;
                    }
                    case 'remove': {
                        // Remove mesh renderer from all assigned render targets.
                        this.removeMeshRenderer(lMeshRenderer);
                        break;
                    }
                    case 'deactivate': {
                        // Does absolutly nothing, as disabled mesh renderers are ignored in culling and won't be visible regardless of bounds.
                    }
                    case 'activate':
                    case 'update': {
                        if (!lMeshRenderer.enabled) {
                            break;
                        }

                        // Invalidate world bounds cache for this mesh renderer since its local bounds may have changed.
                        this.mMeshRendererWorldBounds.delete(lMeshRenderer);
                        break;
                    }
                }
            }
        }
    }

    /**
     * Add a new render target to the system and assign all enabled mesh renderers under its hierarchy to it.
     * 
     * @param pRenderTarget - The render target component being added. 
     */
    private addRenderTarget(pRenderTarget: RenderTargetComponent): void {
        // Create new empty culling data for this render target and add it to the map.
        const lData: CullSystemRenderTargetData = this.createEmptyRenderTargetData();
        this.mRenderTargetDataMap.set(pRenderTarget, lData);

        // Read all mesh renderer entities under this render target and assign them to this render target.
        const lMeshEntities: Array<GameEntity> = pRenderTarget.gameEntity.getGameObjectsWithComponent(MeshRenderComponent);
        for (const lEntity of lMeshEntities) {
            const lMeshRenderer: MeshRenderComponent = lEntity.getComponent(MeshRenderComponent)!;

            // Remove and reassign mesh renderer to update its render target assignment based on the new render target in the hierarchy.
            this.removeMeshRenderer(lMeshRenderer);
            this.assignMeshRenderer(lMeshRenderer);
        }
    }

    /**
     * Assign a camera component to the next render target if it doesn't already have an active camera and update frustums.
     * If the camera is already active on another render target, it will be ignored.
     */
    private assignCamera(pCamera: CameraComponent): void {
        // If the camera is already assigned to a render target, skip assignment.
        if (this.mCameraToRenderTarget.has(pCamera)) {
            return;
        }

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
                transformation: pCamera.gameEntity.getComponent(TransformationComponent)!,
                frustum: new Frustum()
            };
            this.mCameraToRenderTarget.set(pCamera, lParentRenderTarget);

            // Set camera aspect ratio to match the render target dimensions.
            lRenderTargetData.camera.component.projection.aspectRatio = lParentRenderTarget.width / lParentRenderTarget.height;

            // Compute frustum for the newly assigned camera.
            this.updateFrustum(lRenderTargetData);
        }
    }

    /**
     * Add a mesh renderer to the render target chain based on its entity hierarchy.
     * 
     * @param pMeshRenderer - The mesh render component to add.
     */
    private assignMeshRenderer(pMeshRenderer: MeshRenderComponent): void {
        // List of all found mesh render targets.
        const lAssignedRenderTargets: Array<RenderTargetComponent> = new Array<RenderTargetComponent>();

        // Read last assigned render targets and create a set for quick lookup.
        // This is needed to avoid duplicate assignments when traversing the hierarchy and passthrough render targets.
        const lLastAssignedRenderTargets: Array<RenderTargetComponent> = this.mMeshRendererToRenderTargets.get(pMeshRenderer) ?? new Array<RenderTargetComponent>();
        const lLastAssignedRenderTargetSet: Set<RenderTargetComponent> = new Set<RenderTargetComponent>(lLastAssignedRenderTargets);

        // Find next parent render target as long as it exists.
        let lCurrentNode: GameEntity | null = pMeshRenderer.gameEntity;
        while (lCurrentNode) {
            // Find the nearest ancestor RenderTargetComponent.
            let lParentRenderTarget: RenderTargetComponent | null = lCurrentNode!.getParentComponent(RenderTargetComponent);
            if (!lParentRenderTarget) {
                lParentRenderTarget = this.mRootRenderTarget;
            }

            // Update current node for next iteration. Special behavior for root render target since its game entity is null.
            if (lParentRenderTarget === this.mRootRenderTarget) {
                lCurrentNode = null;
            } else {
                lCurrentNode = lParentRenderTarget.gameEntity.parent as GameEntity | null;
            }

            // Remove from last assigned set. When it was previously assigned,
            // it means we have already processed this render target and can skip to the next one in the hierarchy.
            if (lLastAssignedRenderTargetSet.delete(lParentRenderTarget)) {
                lAssignedRenderTargets.push(lParentRenderTarget);
                continue;
            }

            // Skip render target if it is not initialized.
            // Can happend when mesh renderers are added before their parent render target.
            if (!this.mRenderTargetDataMap.has(lParentRenderTarget)) {
                continue;
            }

            // Add render target to mesh renderer's target list.
            lAssignedRenderTargets.push(lParentRenderTarget);

            // Add mesh renderer to this render target's active list.
            const lData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(lParentRenderTarget)!;

            // Assign mesh renderer to this render target if not already assigned.
            // This happens when a render target is added and their child are reevaluated.
            if (!lData.meshes.indexMap.has(pMeshRenderer)) {
                // Call order matters set index before push to get length as next index.
                lData.meshes.indexMap.set(pMeshRenderer, lData.meshes.available.length);
                lData.meshes.available.push(pMeshRenderer);
            }

            // Stop if passthrough is not enabled.
            // Root target is never passthrough, so this loop will always end at the latest when reaching the root render target.
            if (!lParentRenderTarget.passthrough) {
                break;
            }
        }

        // Assign found render targets to mesh renderer.
        this.mMeshRendererToRenderTargets.set(pMeshRenderer, lAssignedRenderTargets);
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
     * Create an empty render target data object for culling.
     *
     * @returns A new culling data object with no camera assigned and empty mesh lists.
     */
    private createEmptyRenderTargetData(): CullSystemRenderTargetData {
        return {
            camera: null,
            meshes: {
                available: new Array<MeshRenderComponent>(),
                visible: new Array<MeshRenderComponent>(),
                indexMap: new Map<MeshRenderComponent, number>()
            }
        };
    }

    /**
     * Deactivate a camera component by clearing its render target assignment and updating frustums.
     * Searches for a replacement camera for the affected render target, and if found, assigns it and updates the frustum.
     * 
     * @param pCamera - The camera component to deactivate. 
     */
    private deactivateCamera(pCamera: CameraComponent): void {
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
                this.assignCamera(lCamera);
                return;
            }
        }
    }

    /**
     * Rebuild the visible mesh renderer list for a render target using its cached frustum and world bounding boxes.
     *
     * @param pData - The culling data to update.
     */
    private executeCulling(pData: CullSystemRenderTargetData): Array<MeshRenderComponent> {
        // Clear previous visible list.
        const lVisibleMeshRenderers: Array<MeshRenderComponent> = new Array<MeshRenderComponent>();

        // Skip render targets without an assigned camera.
        if (!pData.camera) {
            return lVisibleMeshRenderers;
        }

        // Iterate active mesh renderers and test their cached world bounds against the frustum.
        for (const lMeshRenderer of pData.meshes.available) {
            // Skip disabled mesh renderers. They won't be visible regardless of bounds.
            if (!lMeshRenderer.enabled) {
                continue;
            }

            // Try to read cached world bounds. If not found, calculate and cache them for future frames.
            let lWorldBounds: CullSystemWorldBounds | undefined = this.mMeshRendererWorldBounds.get(lMeshRenderer);
            if (!lWorldBounds) {
                // Recalculate world bounds if not cached.
                lWorldBounds = this.calculateWorldBounds(lMeshRenderer);

                // Cache the world bounds for future frames.
                this.mMeshRendererWorldBounds.set(lMeshRenderer, lWorldBounds);
            }

            // Test the cached world-space bounding box against the cached frustum.
            if (pData.camera.frustum.intersectsBoundingBox(lWorldBounds.minX, lWorldBounds.minY, lWorldBounds.minZ, lWorldBounds.maxX, lWorldBounds.maxY, lWorldBounds.maxZ)) {
                lVisibleMeshRenderers.push(lMeshRenderer);
            }
        }

        return lVisibleMeshRenderers;
    }

    /**
     * Remove a mesh renderer from all assigned render targets based on its entity hierarchy.
     * 
     * @param pMeshRenderer - The mesh render component to remove.
     */
    private removeMeshRenderer(pMeshRenderer: MeshRenderComponent): void {
        // Get all render targets this mesh renderer belongs to.
        const lRenderTargets: Array<RenderTargetComponent> = this.mMeshRendererToRenderTargets.get(pMeshRenderer)!;

        // Remove render target list, as it could clash when the mesh renderer is added again.
        this.mMeshRendererToRenderTargets.delete(pMeshRenderer);

        for (const lRenderTarget of lRenderTargets) {
            const lRenderTargetData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(lRenderTarget)!;

            // Get current index of the mesh renderer to remove.
            const lIndex: number = lRenderTargetData.meshes.indexMap.get(pMeshRenderer)!;

            // Swap the removed element with the last element. So we can pop the last element to remove without leaving holes in the list.
            const lLastMeshRenderer: MeshRenderComponent = lRenderTargetData.meshes.available[lRenderTargetData.meshes.available.length - 1];
            lRenderTargetData.meshes.available[lIndex] = lLastMeshRenderer;
            lRenderTargetData.meshes.indexMap.set(lLastMeshRenderer, lIndex);

            // Remove the last element which is now the removed mesh renderer.
            lRenderTargetData.meshes.available.pop();
            lRenderTargetData.meshes.indexMap.delete(pMeshRenderer);
        }
    }

    /**
     * Remove a render target and reassign its camera and mesh renderers to the next ancestor render target if possible.
     * 
     * @param pRenderTarget - The render target component being removed.
     */
    private removeRenderTarget(pRenderTarget: RenderTargetComponent): void {
        // Get current render target data and remove it from the map.
        const lData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(pRenderTarget)!;
        this.mRenderTargetDataMap.delete(pRenderTarget);

        // Read assigned camera and remove its assignment if it exists.
        if (lData.camera) {
            const lCammeraComponent: CameraComponent = lData.camera.component;

            // Remove camera assignment and reassign another render target if possible.
            this.mCameraToRenderTarget.delete(lCammeraComponent);
            this.assignCamera(lCammeraComponent);
        }

        // Reassign all mesh renderers that were under this render target to their next ancestor render target.
        for (const lMeshRenderer of lData.meshes.available) {
            // Here a mesh renderer can not be removed from a render taget, only assigned to another render target.
            // So we can directly call assign without removing first.
            this.assignMeshRenderer(lMeshRenderer);
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
        pData.camera.frustum.update(lViewProjectionMatrix);
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
        frustum: Frustum;
    } | null;
    meshes: {
        available: Array<MeshRenderComponent>;
        visible: Array<MeshRenderComponent>;
        indexMap: Map<MeshRenderComponent, number>;
    };
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
    readonly meshes: {
        readonly available: ReadonlyArray<MeshRenderComponent>;
        readonly visible: ReadonlyArray<MeshRenderComponent>;
    };
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
