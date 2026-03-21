import { BoundVolumeHierarchy, Frustum, Vector, type IBoundable, type Matrix } from '@kartoffelgames/core';
import { MeshRenderComponent } from '../component/mesh-render-component.ts';
import { RenderTargetComponent } from '../component/render-target-component.ts';
import { TransformationComponent } from '../component/transformation-component.ts';
import type { BoundingBox } from '../component_item/bounding-box.ts';
import type { GameComponentConstructor } from '../core/component/game-component.ts';
import type { GameEnvironment, GameEnvironmentStateChange } from '../core/environment/game-environment.ts';
import { GameSystem, type GameSystemUpdateStateChanges, type GameSystemConstructor } from '../core/game-system.ts';
import type { GameObject } from '../core/hierarchy/game-object.ts';
import { RenderTargetSystem } from './render-target-system.ts';
import { TransformationSystem } from './transformation-system.ts';

/**
 * System that manages per-frame frustum culling for render targets.
 *
 * Tracks RenderTargetComponent and MeshRenderComponent lifecycle events.
 * Maintains per-render-target mesh renderer lists (both active and visible after culling).
 *
 * Camera assignment is handled by {@link RenderTargetSystem}. This system reads the assigned camera
 * from each {@link RenderTargetComponent} directly at culling time.
 *
 * Mesh renderer tracking uses per-render-target swap-remove lists for O(1) add/remove by index.
 * Mesh renderers are assigned to the nearest ancestor RenderTargetComponent in the entity hierarchy.
 * When a render target has passthrough enabled, its mesh renderers are also added to the next ancestor render target.
 */
export class CullSystem extends GameSystem {
    private mDependencyTransformationSystem: TransformationSystem | null;
    private readonly mMeshRendererToRenderTargets: WeakMap<MeshRenderComponent, Set<RenderTargetComponent>>;
    private readonly mRenderTargetDataMap: Map<RenderTargetComponent, CullSystemRenderTargetData>;

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
        return [RenderTargetComponent, MeshRenderComponent];
    }

    /**
     * Constructor.
     *
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super('Cull', pEnvironment);

        // Initialize render target data and mesh assignment maps.
        this.mRenderTargetDataMap = new Map<RenderTargetComponent, CullSystemRenderTargetData>();
        this.mMeshRendererToRenderTargets = new WeakMap<MeshRenderComponent, Set<RenderTargetComponent>>();

        // Set dependencies to null. Resolved during onCreate.
        this.mDependencyTransformationSystem = null;
    }

    /**
     * Get readonly culling data for a render target component.
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
     * Initialize dependencies.
     */
    protected override async onCreate(): Promise<void> {
        // Resolve system dependencies.
        this.mDependencyTransformationSystem = this.environment.getSystem(TransformationSystem);
    }

    /**
     * Per-frame update: rebuild frustums from camera state and cull visible mesh renderers.
     */
    protected override async onFrame(): Promise<void> {
        // Update frustums and rebuild visible mesh lists for each tracked render target.
        for (const [lRenderTarget, lData] of this.mRenderTargetDataMap) {
            // Update the frustum from the render target's current camera.
            this.updateFrustum(lRenderTarget);

            // Rebuild visible mesh list using BVH-accelerated frustum culling.
            lData.meshes.visible = this.executeCulling(lRenderTarget, lData);
        }
    }

    /**
     * Handle component state changes for render targets, mesh renderers, and transformations.
     *
     * @param pStateChanges - Map of component types to their state change events.
     */
    protected override async onUpdate(pStateChanges: GameSystemUpdateStateChanges): Promise<void> {
        const lUpdatedRenderTargets: Set<RenderTargetComponent> = new Set<RenderTargetComponent>();

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
                        // Does nothing, as render target deactivation does not affect mesh assignment.
                        break;
                    }
                    case 'activate':
                    case 'update': {
                        // No action needed. Camera aspect ratio updates are handled by RenderTargetSystem.
                        break;
                    }
                }
            }
        }

        // Process MeshRenderComponent changes.
        const lMeshChanges: ReadonlyArray<GameEnvironmentStateChange> = pStateChanges.componentChanges.get(MeshRenderComponent)!;
        if (lMeshChanges.length > 0) {
            for (const lChange of lMeshChanges) {
                const lMeshRenderer: MeshRenderComponent = lChange.component as MeshRenderComponent;

                switch (lChange.type) {
                    case 'add': {
                        this.assignMeshRenderer(lMeshRenderer);
                        break;
                    }
                    case 'remove': {
                        this.removeMeshRenderer(lMeshRenderer);
                        break;
                    }
                    case 'deactivate': {
                        // Does absolutely nothing, as disabled mesh renderers are ignored in culling and won't be visible regardless of bounds.
                        break;
                    }
                    case 'activate':
                    case 'update': {
                        // Skip disabled mesh renderers.
                        if (!lMeshRenderer.enabled) {
                            break;
                        }

                        // Update BVH in all render targets this mesh renderer belongs to.
                        this.updateMeshRendererInBvh(lMeshRenderer);
                        break;
                    }
                }
            }
        }

        // Rebuild BVH if quality has degraded beyond threshold.
        for (const lRenderTarget of lUpdatedRenderTargets) {
            const lRenderTargetData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(lRenderTarget)!;

            if (lRenderTargetData.bvh.quality > 2.0) {
                lRenderTargetData.bvh.rebuild();
            }
        }

    }

    /**
     * Add a new render target to the system and assign all enabled mesh renderers under its hierarchy to it.
     *
     * @param pRenderTarget - The render target component being added.
     */
    private addRenderTarget(pRenderTarget: RenderTargetComponent): void {
        // Create BVH with world-bounds callback for this render target.
        const lBvh: BoundVolumeHierarchy<MeshRenderComponent> = new BoundVolumeHierarchy<MeshRenderComponent>((pMeshRenderer: MeshRenderComponent) => {
            return this.calculateWorldBounds(pMeshRenderer);
        });

        // Create new empty culling data for this render target.
        this.mRenderTargetDataMap.set(pRenderTarget, {
            frustum: new Frustum(),
            bvh: lBvh,
            meshes: {
                available: new Array<MeshRenderComponent>(),
                visible: new Array<MeshRenderComponent>(),
                indexMap: new Map<MeshRenderComponent, number>()
            }
        });

        // Read all mesh renderer entities under this render target and reassign them.
        const lMeshEntities: Array<MeshRenderComponent> = pRenderTarget.gameEntity.getParentComponents(MeshRenderComponent);
        for (const lMeshRenderer of lMeshEntities) {
            // Remove and reassign mesh renderer to update its render target assignment based on the new render target in the hierarchy.
            this.removeMeshRenderer(lMeshRenderer);
            this.assignMeshRenderer(lMeshRenderer);
        }
    }

    /**
     * Add a mesh renderer to the render target chain based on its entity hierarchy.
     * Walks up the hierarchy to find the nearest ancestor render target and assigns the mesh renderer to it.
     * Continues up the hierarchy through passthrough render targets.
     *
     * @param pMeshRenderer - The mesh render component to add.
     */
    private assignMeshRenderer(pMeshRenderer: MeshRenderComponent): void {
        // List of all found mesh render targets.
        const lAssignedRenderTargets: Set<RenderTargetComponent> = new Set<RenderTargetComponent>();

        // Read last assigned render targets and create a set for quick lookup.
        // This is needed to avoid duplicate assignments when traversing the hierarchy and passthrough render targets.
        const lLastAssignedRenderTargets: Set<RenderTargetComponent> = this.mMeshRendererToRenderTargets.get(pMeshRenderer) ?? new Set<RenderTargetComponent>();

        // Find next parent render target as long as it exists.
        let lCurrentNode: GameObject | null = pMeshRenderer.gameEntity;
        while (lCurrentNode) {
            // Find the nearest ancestor RenderTargetComponent.
            const lParentRenderTarget: RenderTargetComponent = lCurrentNode!.getParentComponent(RenderTargetComponent)!;

            // Update current node for next iteration.
            lCurrentNode = lParentRenderTarget.gameEntity.parent;

            // Remove from last assigned set. When it was previously assigned,
            // it means we have already processed this render target and can skip to the next one in the hierarchy.
            if (lLastAssignedRenderTargets.delete(lParentRenderTarget)) {
                lAssignedRenderTargets.add(lParentRenderTarget);
                continue;
            }

            // Skip render target if it is not initialized in the culling data map.
            // Can happen when mesh renderers are added before their parent render target.
            if (!this.mRenderTargetDataMap.has(lParentRenderTarget)) {
                continue;
            }

            // Add render target to mesh renderer's target list.
            lAssignedRenderTargets.add(lParentRenderTarget);

            // Add mesh renderer to this render target's active list.
            const lData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(lParentRenderTarget)!;

            // Assign mesh renderer to this render target if not already assigned.
            // This happens when a render target is added and their children are reevaluated.
            if (!lData.meshes.indexMap.has(pMeshRenderer)) {
                // Call order matters: set index before push to get length as next index.
                lData.meshes.indexMap.set(pMeshRenderer, lData.meshes.available.length);
                lData.meshes.available.push(pMeshRenderer);
                lData.bvh.insert(pMeshRenderer);
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
     * Transforms all 8 corners of the local-space bounding box by the world matrix
     * and computes new axis-aligned min/max coordinates.
     *
     * @param pMeshRenderer - The mesh render component to update.
     *
     * @returns The world-space bounding box.
     */
    private calculateWorldBounds(pMeshRenderer: MeshRenderComponent): IBoundable {
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
     * Rebuild the visible mesh renderer list for a render target using BVH-accelerated frustum culling.
     * Reads the camera from the render target component directly.
     *
     * @param pRenderTarget - The render target component to cull for.
     * @param pData - The culling data containing the BVH and frustum.
     *
     * @returns Array of visible mesh render components that passed the frustum test.
     */
    private executeCulling(pRenderTarget: RenderTargetComponent, pData: CullSystemRenderTargetData): Array<MeshRenderComponent> {
        // Skip render targets without an assigned camera.
        if (!pRenderTarget.camera) {
            return new Array<MeshRenderComponent>();
        }

        // Use BVH to find all mesh renderers whose world-space AABB intersects the frustum.
        // The BVH prunes entire subtrees when their AABB does not intersect.
        const lFrustum: Frustum = pData.frustum;
        const lResults: Array<MeshRenderComponent> = pData.bvh.find((pBounds: IBoundable) => {
            return lFrustum.intersectsBoundingBox(pBounds);
        });

        // Filter out disabled mesh renderers. The BVH contains all mesh renderers regardless of enabled state.
        return lResults.filter((pMeshRenderer: MeshRenderComponent) => pMeshRenderer.enabled);
    }

    /**
     * Remove a mesh renderer from all assigned render targets based on its entity hierarchy.
     * Uses swap-remove for O(1) removal from the active list.
     *
     * @param pMeshRenderer - The mesh render component to remove.
     */
    private removeMeshRenderer(pMeshRenderer: MeshRenderComponent): void {
        // Get all render targets this mesh renderer belongs to.
        const lRenderTargets: Set<RenderTargetComponent> = this.mMeshRendererToRenderTargets.get(pMeshRenderer)!;

        // Remove render target list, as it could clash when the mesh renderer is added again.
        this.mMeshRendererToRenderTargets.delete(pMeshRenderer);

        for (const lRenderTarget of lRenderTargets) {
            const lRenderTargetData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(lRenderTarget)!;

            // Remove from BVH.
            lRenderTargetData.bvh.remove(pMeshRenderer);

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
     * Remove a render target and reassign its mesh renderers to the next ancestor render target if possible.
     *
     * @param pRenderTarget - The render target component being removed.
     */
    private removeRenderTarget(pRenderTarget: RenderTargetComponent): void {
        // First get current render target data and then remove it from tracking maps.
        const lData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(pRenderTarget)!;
        this.mRenderTargetDataMap.delete(pRenderTarget);

        // Reassign all mesh renderers that were under this render target to their next ancestor render target.
        for (const lMeshRenderer of lData.meshes.available) {
            // Here a mesh renderer can not be removed from a render target, only assigned to another render target.
            // So we can directly call assign without removing first.
            this.assignMeshRenderer(lMeshRenderer);
        }
    }

    /**
     * Update a mesh renderer's BVH leaf AABB in all render targets it belongs to.
     *
     * @param pMeshRenderer - The mesh render component whose bounds changed.
     */
    private updateMeshRendererInBvh(pMeshRenderer: MeshRenderComponent): Array<RenderTargetComponent> {
        const lUpdatedRenderTargets: Array<RenderTargetComponent> = new Array<RenderTargetComponent>();

        // Read render targets of this mesh renderer.
        const lRenderTargets: Set<RenderTargetComponent> = this.mMeshRendererToRenderTargets.get(pMeshRenderer)!;

        // Update BVH for each render target this mesh renderer belongs to.
        for (const lRenderTarget of lRenderTargets) {
            const lData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(lRenderTarget)!;
            lData.bvh.update(pMeshRenderer);

            // Add render target to updated list for return value.
            lUpdatedRenderTargets.push(lRenderTarget);
        }

        return lUpdatedRenderTargets;
    }

    /**
     * Update the cached frustum for a render target using its assigned camera's world transformation.
     * Reads the camera directly from the render target component.
     *
     * @param pRenderTarget - The render target component whose frustum to update.
     */
    private updateFrustum(pRenderTarget: RenderTargetComponent): void {
        // Skip render targets without an assigned camera.
        const lCamera = pRenderTarget.camera;
        if (!lCamera) {
            return;
        }

        // Read the camera's transformation component.
        const lTransformation: TransformationComponent = lCamera.gameEntity.getComponent(TransformationComponent)!;

        // Read world matrix of camera and compute view-projection matrix to update the frustum.
        const lWorldMatrix: Matrix = this.mDependencyTransformationSystem!.worldMatrixOfTransformation(lTransformation);
        const lViewProjectionMatrix: Matrix = lCamera.matrix.mult(lWorldMatrix.inverse());

        // Get culling data for this render target and update its frustum.
        const lRenderTargetData: CullSystemRenderTargetData = this.mRenderTargetDataMap.get(pRenderTarget)!;

        // Update the frustum with the new view-projection matrix.
        lRenderTargetData.frustum.update(lViewProjectionMatrix);
    }
}

/**
 * Internal mutable culling data for a render target.
 * Stores both active (all) and visible (after culling) mesh renderer lists.
 * Includes the swap-remove index map for O(1) mesh renderer add/remove.
 */
type CullSystemRenderTargetData = {
    frustum: Frustum;
    bvh: BoundVolumeHierarchy<MeshRenderComponent>;
    meshes: {
        available: Array<MeshRenderComponent>;
        visible: Array<MeshRenderComponent>;
        indexMap: Map<MeshRenderComponent, number>;
    };
};

/**
 * Readonly culling data for a render target.
 * Exposed to external systems via {@link CullSystem.getRenderTargetCulling}.
 */
export type ReadonlyCullSystemRenderTargetData = {
    readonly meshes: {
        readonly available: ReadonlyArray<MeshRenderComponent>;
        readonly visible: ReadonlyArray<MeshRenderComponent>;
    };
};
