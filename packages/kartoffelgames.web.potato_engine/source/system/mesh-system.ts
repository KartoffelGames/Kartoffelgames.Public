import { BufferItemFormat, BufferItemMultiplier, type GpuBuffer, type VertexParameter, VertexParameterLayout, VertexParameterStepMode } from '@kartoffelgames/web-gpu';
import type { Mesh } from '../component_item/mesh.ts';
import type { SubMesh } from '../component_item/sub-mesh.ts';
import type { GameEnvironment } from '../core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor, type GameSystemUpdateStateChanges } from '../core/game-system.ts';
import { GpuSystem } from './gpu-system.ts';

/**
 * System that manages GPU vertex resources for meshes.
 *
 * Creates and caches {@link VertexParameter} instances per (Mesh, SubMesh) pair.
 * All SubMeshes of the same Mesh share the same vertex data GPU buffers (position, normal, color, uv, uv2, uv3, uv4),
 * each SubMesh only differs by its index buffer.
 *
 * Listens for Mesh data changes and updates shared GPU buffers accordingly.
 * Exposes the hardcoded {@link VertexParameterLayout} for use by other systems (e.g. MaterialSystem).
 */
export class MeshSystem extends GameSystem {
    private readonly mCachedMeshes: WeakMap<Mesh, MeshSystemCachedMesh>;
    private mGpuSystem: GpuSystem | null;
    private mUpdatedMeshes: Array<Mesh>;
    private mVertexParameterLayout: VertexParameterLayout | null;

    /**
     * Gets the system types this system depends on.
     */
    public override get dependentSystemTypes(): Array<GameSystemConstructor<GameSystem>> {
        return [GpuSystem];
    }

    /**
     * Gets the hardcoded vertex parameter layout matching the core-parameter.pgsl GpuVertexInput struct.
     */
    public get vertexParameterLayout(): VertexParameterLayout {
        this.lockGate();

        return this.mVertexParameterLayout!;
    }

    /**
     * Constructor.
     *
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super('Mesh', pEnvironment);

        this.mCachedMeshes = new WeakMap<Mesh, MeshSystemCachedMesh>();
        this.mGpuSystem = null;
        this.mUpdatedMeshes = new Array<Mesh>();
        this.mVertexParameterLayout = null;
    }

    /**
     * Load or retrieve a cached {@link VertexParameter} for a specific SubMesh of a Mesh.
     *
     * On first call for a Mesh, creates shared GPU buffers for all vertex attributes.
     * On first call for a SubMesh, creates a VertexParameter with the SubMesh's indices,
     * sharing the Mesh's GPU buffers.
     *
     * @param pMesh - The mesh containing vertex data.
     * @param pSubMesh - The sub mesh containing index data.
     *
     * @returns The cached or newly created VertexParameter for this SubMesh.
     */
    public loadMesh(pMesh: Mesh, pSubMesh: SubMesh): VertexParameter {
        this.lockGate();

        // Get or create cached mesh data.
        if (!this.mCachedMeshes.has(pMesh)) {
            // Create new cached mesh entry with empty buffers and submesh map.
            this.mCachedMeshes.set(pMesh, {
                buffers: null,
                subMeshes: new WeakMap<SubMesh, VertexParameter>()
            });

            // Register change listener on the Mesh to detect vertex data updates.
            pMesh.addUpdateListener(() => {
                this.mUpdatedMeshes.push(pMesh);
            });
        }

        // Read cached mesh data for this mesh.
        const lCachedMesh: MeshSystemCachedMesh = this.mCachedMeshes.get(pMesh)!;

        // Create a new VertexParameter for this SubMesh and cache it when it doesn't exist.
        if (!lCachedMesh.subMeshes.has(pSubMesh)) {
            lCachedMesh.subMeshes.set(pSubMesh, this.createVertexParameter(pMesh, pSubMesh, lCachedMesh));
        }

        return lCachedMesh.subMeshes.get(pSubMesh)!;
    }

    /**
     * Initialize the mesh system.
     * Creates the hardcoded vertex parameter layout.
     */
    protected override async onCreate(): Promise<void> {
        this.mGpuSystem = this.environment.getSystem(GpuSystem);

        // Create the hardcoded vertex parameter layout matching core-parameter.pgsl GpuVertexInput.
        this.mVertexParameterLayout = new VertexParameterLayout(this.mGpuSystem.gpu).setup((pSetup) => {
            pSetup.buffer('position', VertexParameterStepMode.Index).withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
            pSetup.buffer('normal', VertexParameterStepMode.Index).withParameter('normal', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
            pSetup.buffer('color', VertexParameterStepMode.Index).withParameter('color', 2, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            pSetup.buffer('uv', VertexParameterStepMode.Index).withParameter('uv', 3, BufferItemFormat.Float32, BufferItemMultiplier.Vector2);
            pSetup.buffer('uv2', VertexParameterStepMode.Index).withParameter('uv2', 4, BufferItemFormat.Float32, BufferItemMultiplier.Vector2);
            pSetup.buffer('uv3', VertexParameterStepMode.Index).withParameter('uv3', 5, BufferItemFormat.Float32, BufferItemMultiplier.Vector2);
            pSetup.buffer('uv4', VertexParameterStepMode.Index).withParameter('uv4', 6, BufferItemFormat.Float32, BufferItemMultiplier.Vector2);
        });
    }

    /**
     * Process queued mesh updates. Re-writes shared GPU buffers with current mesh data.
     * 
     * @param _pStateChanges - State changes since last update (not used).
     */
    protected override async onUpdate(_pStateChanges: GameSystemUpdateStateChanges): Promise<void> {
        // Skip update if no meshes have been updated since the last update.
        if (this.mUpdatedMeshes.length === 0) {
            return;
        }

        // Update each mesh that has been marked as updated since the last update.
        for (const lMesh of this.mUpdatedMeshes) {
            // Read cached mesh data for this mesh.
            const lCachedMesh: MeshSystemCachedMesh | undefined = this.mCachedMeshes.get(lMesh);
            if (!lCachedMesh) {
                continue;
            }

            // Update the meshes shared GPU buffers with current vertex data.
            await this.updateMeshBuffers(lMesh, lCachedMesh);
        }

        // Clear the updated meshes array after processing all updates.
        this.mUpdatedMeshes = new Array<Mesh>();
    }

    /**
     * Create a VertexParameter for a SubMesh.
     * On the first SubMesh of a Mesh, creates shared buffers via {@link VertexParameter.create}.
     * On subsequent SubMeshes, reuses shared buffers via {@link VertexParameter.set}.
     *
     * @param pMesh - The parent mesh with vertex data.
     * @param pSubMesh - The sub mesh with index data.
     * @param pCachedMesh - The cached mesh data with shared buffers.
     *
     * @returns The created VertexParameter.
     */
    private createVertexParameter(pMesh: Mesh, pSubMesh: SubMesh, pCachedMesh: MeshSystemCachedMesh): VertexParameter {
        // Create VertexParameter for this SubMesh with its indices.
        const lVertexParameter: VertexParameter = this.mVertexParameterLayout!.create(pSubMesh.indices);

        // If shared buffers already exist (not the first SubMesh), set them on the new VertexParameter.
        if (pCachedMesh.buffers) {
            // Set cached buffers for all vertex attributes as they are shared among all SubMeshes of this Mesh.
            lVertexParameter.set('position', pCachedMesh.buffers.get('position')!);
            lVertexParameter.set('normal', pCachedMesh.buffers.get('normal')!);
            lVertexParameter.set('color', pCachedMesh.buffers.get('color')!);
            lVertexParameter.set('uv', pCachedMesh.buffers.get('uv')!);
            lVertexParameter.set('uv2', pCachedMesh.buffers.get('uv2')!);
            lVertexParameter.set('uv3', pCachedMesh.buffers.get('uv3')!);
            lVertexParameter.set('uv4', pCachedMesh.buffers.get('uv4')!);

            return lVertexParameter;
        }

        // Create new buffer map.
        pCachedMesh.buffers = new Map<MeshSystemVertexParameterName, GpuBuffer>();

        // First SubMesh: create shared buffers and cache them.
        for (const lMeshBufferData of this.generateMeshBufferData(pMesh)) {
            // Create GPU buffer with initial data and cache it.
            pCachedMesh.buffers.set(lMeshBufferData.name, lVertexParameter.create(lMeshBufferData.name, lMeshBufferData.data));
        }

        return lVertexParameter;
    }

    /**
     * Generate mesh buffer data for all vertex attributes from the mesh's vertex data.
     * Fills in default data for optional attributes if they are missing, to ensure all buffers are created with the same vertex count.
     * 
     * @param pMesh - Mesh with mesh data.
     * 
     * @returns Array of mesh system vertex buffer data.
     */
    private generateMeshBufferData(pMesh: Mesh): Array<MeshSystemVertexBufferData> {
        // Default arrays for optional attributes.
        const lDefaultColors: Array<number> = new Array<number>(pMesh.verticesCount * 4).fill(1.0);
        const lDefaultUvs: Array<number> = new Array<number>(pMesh.verticesCount * 2).fill(0);

        // Write each buffer with current mesh data.
        const lBufferUpdates: Array<MeshSystemVertexBufferData> = [
            { name: 'position', data: pMesh.verticesData },
            { name: 'normal', data: pMesh.normals },
            { name: 'color', data: pMesh.colors.length > 0 ? pMesh.colors : lDefaultColors },
            { name: 'uv', data: pMesh.uv1.length > 0 ? pMesh.uv1 : lDefaultUvs },
            { name: 'uv2', data: pMesh.uv2.length > 0 ? pMesh.uv2 : lDefaultUvs },
            { name: 'uv3', data: pMesh.uv3.length > 0 ? pMesh.uv3 : lDefaultUvs },
            { name: 'uv4', data: pMesh.uv4.length > 0 ? pMesh.uv4 : lDefaultUvs },
        ];

        return lBufferUpdates;
    }

    /**
     * Update shared GPU buffers for a mesh with its current vertex data.
     * Resizes buffers if vertex count changed, then writes new data.
     *
     * @param pMesh - The mesh with updated data.
     * @param pCachedMesh - The cached mesh data containing the shared GPU buffers to update.
     */
    private async updateMeshBuffers(pMesh: Mesh, pCachedMesh: MeshSystemCachedMesh): Promise<void> {
        // Fast access buffer cache.
        const lBuffers: Map<MeshSystemVertexParameterName, GpuBuffer> = pCachedMesh.buffers!;

        // Update each buffer with current mesh data.
        for (const lMeshData of this.generateMeshBufferData(pMesh)) {
            // Read gpu buffer for this attribute from cache.
            const lGpuBuffer: GpuBuffer = lBuffers.get(lMeshData.name)!;

            // Create ArrayBuffer view for the new vertex data.
            const lBufferData: ArrayBuffer = new Float32Array(lMeshData.data).buffer;

            // Resize buffer if data size changed.
            if (lGpuBuffer.size !== lBufferData.byteLength) {
                lGpuBuffer.size = lBufferData.byteLength;
            }

            // Write new data into buffer.
            lGpuBuffer.write(lBufferData);
        }
    }
}

/**
 * Cached data for a loaded Mesh, containing shared GPU buffers and per-SubMesh VertexParameters.
 */
type MeshSystemCachedMesh = {
    buffers: Map<MeshSystemVertexParameterName, GpuBuffer> | null;
    subMeshes: WeakMap<SubMesh, VertexParameter>;
};

type MeshSystemVertexBufferData = {
    name: MeshSystemVertexParameterName;
    data: Array<number>;
};

type MeshSystemVertexParameterName = 'position' | 'normal' | 'color' | 'uv' | 'uv2' | 'uv3' | 'uv4';