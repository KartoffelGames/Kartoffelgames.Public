import type {
    BindGroup,
    GpuBuffer,
    PipelineData,
    RenderTargets,
    VertexFragmentPipeline
} from '@kartoffelgames/web-gpu';
import type { MeshRenderComponent } from '../../source/component/mesh-render-component.ts';
import type { RenderTargetComponent } from '../../source/component/render-target-component.ts';
import { TransformationComponent } from '../../source/component/transformation-component.ts';
import { Material } from '../../source/component_item/material.ts';
import type { Mesh } from '../../source/component_item/mesh.ts';
import type { GameComponentConstructor } from '../../source/core/component/game-component.ts';
import type { GameEnvironment } from '../../source/core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor, type GameSystemUpdateStateChanges } from '../../source/core/game-system.ts';
import forwardEntryPoints from '../../source/shader/forward-entry-points.pgsl';
import forwardImport from '../../source/shader/forward-import.pgsl';
import forwardObjectGroup from '../../source/shader/object-group-forward.pgsl';
import sharedTypes from '../../source/shader/shared-types.pgsl';
import forwardWorldGroup from '../../source/shader/world-group-forward.pgsl';
import { CullSystem, type ReadonlyCullSystemRenderTargetData } from '../../source/system/cull-system.ts';
import { GpuSystem } from '../../source/system/gpu-system.ts';
import { LightSystem } from '../../source/system/light-system.ts';
import { MaterialSystem, type MaterialSystemMaterial, type MaterialSystemRenderModeRegisterResult } from '../../source/system/material-system.ts';
import { MeshSystem } from '../../source/system/mesh-system.ts';
import { RenderTargetSystem } from '../../source/system/render-target-system.ts';
import { TransformationSystem } from '../../source/system/transformation-system.ts';

type MaterialMeshGroupData = {
    objectBindGroup: BindGroup;
    componentIndicesBuffer: GpuBuffer;
    userBindGroup: BindGroup | null;
    pipelineData: PipelineData;
    pipeline: VertexFragmentPipeline;
    instanceCount: number;
};

/**
 * Per-render-target data. Each render target gets its own world bind group and material/mesh instance groups.
 */
type RenderTargetFrameData = {
    worldGroup: BindGroup;
    lightDataInitialized: boolean;
    lightCountBuffer: GpuBuffer | null;
    lightIndexListBuffer: GpuBuffer | null;
    // Maps: Material -> Mesh -> subMeshIndex -> group data.
    materialMeshGroups: Map<Material, Map<Mesh, Map<number, MaterialMeshGroupData>>>;
};

/**
 * System that renders all mesh components using PGSL-compiled shaders with material support.
 * Uses MaterialSystem for shader compilation and CullSystem for frustum-culled visible mesh list.
 * Groups instances by material, mesh, and submesh index for efficient instanced rendering.
 * Each submesh of a mesh can have its own material from the MeshRenderComponent's materials array.
 *
 * Renders all render targets assigned to this renderer, not just the root render target.
 */
export class ShitSystem extends GameSystem {
    private static readonly RENDER_MODE: string = 'ShitRenderMode';

    private mDependencyCullSystem: CullSystem | null;
    private mDependencyGpuSystem: GpuSystem | null;
    private mDependencyLightSystem: LightSystem | null;
    private mDependencyMaterialSystem: MaterialSystem | null;
    private mDependencyMeshSystem: MeshSystem | null;
    private mDependencyRenderTargetSystem: RenderTargetSystem | null;
    private mDependencyTransformationSystem: TransformationSystem | null;
    private mRenderModeResult: MaterialSystemRenderModeRegisterResult | null;
    private readonly mRenderTargetData: Map<RenderTargetComponent, RenderTargetFrameData>;

   

    /**
     * Systems this system depends on.
     */
    public override get dependentSystemTypes(): Array<GameSystemConstructor<GameSystem>> {
        return [TransformationSystem, GpuSystem, LightSystem, CullSystem, MaterialSystem, MeshSystem, RenderTargetSystem];
    }

    /**
     * Component types this system handles.
     */
    public override get handledComponentTypes(): Array<GameComponentConstructor> {
        return [];
    }

    /**
     * Constructor.
     *
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super('ShitSystem', pEnvironment);

        this.mDependencyCullSystem = null;
        this.mDependencyGpuSystem = null;
        this.mDependencyLightSystem = null;
        this.mDependencyMaterialSystem = null;
        this.mDependencyMeshSystem = null;
        this.mDependencyRenderTargetSystem = null;
        this.mDependencyTransformationSystem = null;
        this.mRenderModeResult = null;
        this.mRenderTargetData = new Map();
    }

    /**
     * Initialize canvas, register renderer with RenderTargetSystem, and set up bind groups.
     */
    protected override async onCreate(): Promise<void> {
        // Read dependencies.
        this.mDependencyTransformationSystem = this.environment.getSystem(TransformationSystem);
        this.mDependencyGpuSystem = this.environment.getSystem(GpuSystem);
        this.mDependencyLightSystem = this.environment.getSystem(LightSystem);
        this.mDependencyCullSystem = this.environment.getSystem(CullSystem);
        this.mDependencyMaterialSystem = this.environment.getSystem(MaterialSystem);
        this.mDependencyMeshSystem = this.environment.getSystem(MeshSystem);
        this.mDependencyRenderTargetSystem = this.environment.getSystem(RenderTargetSystem);

        // Set global shader import for shared types.
        this.mDependencyMaterialSystem.setGlobalImport('WorldGroupForward', forwardWorldGroup);
        this.mDependencyMaterialSystem.setGlobalImport('ObjectGroupForward', forwardObjectGroup);

        // Register the ShitRenderMode with the MaterialSystem using forward shaders.
        this.mRenderModeResult = this.mDependencyMaterialSystem.registerRenderMode(ShitSystem.RENDER_MODE, {
            entryPointImport: forwardEntryPoints,
            functionalImports: [forwardImport],
            typeImports: [sharedTypes]
        });
       
        // Register renderer with RenderTargetSystem using the layout and canvas setup callback.
        this.mDependencyRenderTargetSystem.registerRenderer(ShitSystem.RENDER_MODE, this.mRenderModeResult.renderTargetsLayout, (pSetup, pForcedTexture) => {
            pSetup.setOwnColorTarget('color', pForcedTexture!);
        });
    }

    /**
     * Execute rendering every frame for all render targets assigned to this renderer.
     * First rebuilds instance data for all render targets, then executes all render passes.
     */
    protected override async onFrame(): Promise<void> {
        if (!this.mRenderModeResult) {
            return;
        }

        // Get all render targets assigned to this renderer.
        const lRenderTargetComponents: Array<RenderTargetComponent> = this.mDependencyRenderTargetSystem!.getRenderTargetsOfRenderer(ShitSystem.RENDER_MODE);

        // Clean up data for render targets that are no longer assigned to this renderer.
        for (const lTrackedTarget of this.mRenderTargetData.keys()) {
            if (!lRenderTargetComponents.includes(lTrackedTarget)) {
                this.mRenderTargetData.delete(lTrackedTarget);
            }
        }

        // Collect render targets that have valid cameras and culling data.
        const lActiveRenderTargets: Array<{ component: RenderTargetComponent; cullingData: ReadonlyCullSystemRenderTargetData; frameData: RenderTargetFrameData; renderTargets: RenderTargets }> = [];

        for (const lRenderTargetComponent of lRenderTargetComponents) {
            // Skip render targets without a camera.
            if (!lRenderTargetComponent.camera) {
                continue;
            }

            // Get culling data for this render target from CullSystem.
            const lCullingData: ReadonlyCullSystemRenderTargetData | undefined = this.mDependencyCullSystem!.getRenderTargetCulling(lRenderTargetComponent);
            if (!lCullingData) {
                continue;
            }

            // Get or create per-render-target frame data.
            let lFrameData: RenderTargetFrameData | undefined = this.mRenderTargetData.get(lRenderTargetComponent);
            if (!lFrameData) {
                lFrameData = this.createRenderTargetFrameData();
                this.mRenderTargetData.set(lRenderTargetComponent, lFrameData);
            }

            // Get RenderTargets from RenderTargetSystem.
            const lRenderTargets: RenderTargets = this.mDependencyRenderTargetSystem!.getRenderTarget(lRenderTargetComponent);

            lActiveRenderTargets.push({
                component: lRenderTargetComponent,
                cullingData: lCullingData,
                frameData: lFrameData,
                renderTargets: lRenderTargets
            });
        }

        // Phase 1: Rebuild all instance data for all active render targets.
        for (const lTarget of lActiveRenderTargets) {
            await this.rebuildInstanceData(lTarget.component, lTarget.cullingData, lTarget.frameData);
        }

        // Phase 2: Execute all render passes.
        this.mDependencyGpuSystem!.gpu.execute((pExecutor) => {
            for (const lTarget of lActiveRenderTargets) {
                pExecutor.renderPass(lTarget.renderTargets, (pContext) => {
                    for (const [, lMeshGroups] of lTarget.frameData.materialMeshGroups) {
                        for (const [lMesh, lSubMeshGroups] of lMeshGroups) {
                            for (const [lSubMeshIndex, lGroupData] of lSubMeshGroups) {
                                if (lGroupData.instanceCount > 0) {
                                    const lVertexParam = this.mDependencyMeshSystem!.loadMesh(lMesh, lMesh.subMeshes[lSubMeshIndex]);
                                    pContext.drawDirect(lGroupData.pipeline, lVertexParam, lGroupData.pipelineData, lGroupData.instanceCount);
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    /**
     * No component event processing needed.
     */
    protected override async onUpdate(_pStateChanges: GameSystemUpdateStateChanges): Promise<void> {
        // Instance data is rebuilt every frame from the frustum-culled visible list.
    }

    /**
     * Create a new material+mesh group with Object bind group, buffers, and pipeline data.
     */
    private createMaterialMeshGroup(pLoadedMaterial: MaterialSystemMaterial, pWorldGroup: BindGroup, pInitialCount: number): MaterialMeshGroupData {
        // Get pipeline for this material.
        const lPipeline: VertexFragmentPipeline = pLoadedMaterial.pipeline;

        // Create Object bind group from the registered render mode's layout.
        const lObjectBindGroup: BindGroup = this.mRenderModeResult!.bindGroupLayouts.object.layout.create();
        lObjectBindGroup.data('transformationData').set(this.mDependencyTransformationSystem!.gpuBuffer);
        const lComponentIndicesBuffer: GpuBuffer = lObjectBindGroup.data('componentIndices').createBuffer(pInitialCount);

        // Create pipeline data from material's pipeline layout.
        const lUserBindGroup: BindGroup | null = pLoadedMaterial.userBinding?.group ?? null;
        const lUserGroupIndex: number = pLoadedMaterial.userBinding?.index ?? -1;
        const lWorldGroupIndex: number = this.mRenderModeResult!.bindGroupLayouts.world.index;
        const lObjectGroupIndex: number = this.mRenderModeResult!.bindGroupLayouts.object.index;

        const lPipelineData: PipelineData = lPipeline.layout.withData((pSetup) => {
            const lMaxIndex = Math.max(lWorldGroupIndex, lObjectGroupIndex, lUserGroupIndex);
            const lGroups: Array<BindGroup | null> = new Array(lMaxIndex + 1).fill(null);
            lGroups[lWorldGroupIndex] = pWorldGroup;
            lGroups[lObjectGroupIndex] = lObjectBindGroup;

            if (lUserBindGroup && lUserGroupIndex >= 0) {
                lGroups[lUserGroupIndex] = lUserBindGroup;
            }

            for (const lGroup of lGroups) {
                if (lGroup) {
                    pSetup.addGroup(lGroup);
                }
            }
        });

        return {
            objectBindGroup: lObjectBindGroup,
            componentIndicesBuffer: lComponentIndicesBuffer,
            userBindGroup: lUserBindGroup,
            pipelineData: lPipelineData,
            pipeline: lPipeline,
            instanceCount: 0
        };
    }

    /**
     * Create per-render-target frame data with its own world bind group.
     */
    private createRenderTargetFrameData(): RenderTargetFrameData {
        const lWorldGroup: BindGroup = this.mRenderModeResult!.bindGroupLayouts.world.layout.create();
        lWorldGroup.data('viewProjection').createBuffer();

        return {
            worldGroup: lWorldGroup,
            lightDataInitialized: false,
            lightCountBuffer: null,
            lightIndexListBuffer: null,
            materialMeshGroups: new Map()
        };
    }

    /**
     * Rebuild instance data from the frustum-culled visible mesh list for a specific render target.
     * Groups renderers by material, mesh, and submesh index. Updates light data and camera VP.
     * Each submesh uses its corresponding material from the MeshRenderComponent's materials array.
     */
    private async rebuildInstanceData(pRenderTarget: RenderTargetComponent, pCullingData: ReadonlyCullSystemRenderTargetData, pFrameData: RenderTargetFrameData): Promise<void> {
        if (!this.mRenderModeResult) {
            return;
        }

        const lVisibleRenderers = pCullingData.meshes.visible;
        const lTransformationSystem: TransformationSystem = this.mDependencyTransformationSystem!;
        const lLightSystem: LightSystem = this.mDependencyLightSystem!;
        const lMaterialSystem: MaterialSystem = this.mDependencyMaterialSystem!;
        const lWorldGroup: BindGroup = pFrameData.worldGroup;

        // Reset all instance counts.
        for (const [, lMeshGroups] of pFrameData.materialMeshGroups) {
            for (const [, lSubMeshGroups] of lMeshGroups) {
                for (const [, lGroupData] of lSubMeshGroups) {
                    lGroupData.instanceCount = 0;
                }
            }
        }

        // Skip when no renderers are visible.
        if (lVisibleRenderers.length === 0) {
            return;
        }

        // Lazily initialize light data in the world bind group.
        if (!pFrameData.lightDataInitialized) {
            lWorldGroup.data('lightData').set(lLightSystem.lightBuffer);
            pFrameData.lightCountBuffer = lWorldGroup.data('lightCount').createBuffer(1);
            pFrameData.lightIndexListBuffer = lWorldGroup.data('lightIndexList').createBuffer(Math.max(lLightSystem.lights.length, 1));
            pFrameData.lightDataInitialized = true;
        }

        // Update light data each frame (shared global light buffer).
        lWorldGroup.data('lightData').set(lLightSystem.lightBuffer);

        const lActiveLights = lLightSystem.lights;
        const lLightIndexList: Uint32Array = new Uint32Array(lActiveLights.length);
        for (let lIndex: number = 0; lIndex < lActiveLights.length; lIndex++) {
            lLightIndexList[lIndex] = lLightSystem.indexOfLight(lActiveLights[lIndex]);
        }

        pFrameData.lightCountBuffer!.write(new Uint32Array([lActiveLights.length]).buffer);
        if (pFrameData.lightIndexListBuffer!.size !== lActiveLights.length * Uint32Array.BYTES_PER_ELEMENT) {
            pFrameData.lightIndexListBuffer!.size = lActiveLights.length * Uint32Array.BYTES_PER_ELEMENT;
        }
        pFrameData.lightIndexListBuffer!.write(lLightIndexList.buffer);

        // Update camera view projection matrix from this render target's camera.
        const lCamera = pRenderTarget.camera!;
        const lCameraTransformation: TransformationComponent = lCamera.gameEntity.getComponent(TransformationComponent)!;
        const lWorldMatrix = lTransformationSystem.worldMatrixOfTransformation(lCameraTransformation);
        const lViewProjectionMatrix = lCamera.matrix.mult(lWorldMatrix.inverse());
        lWorldGroup.data('viewProjection').getRaw<GpuBuffer>().write(new Float32Array(lViewProjectionMatrix.dataArray).buffer);

        // Group visible renderers by material + mesh + submesh index.
        // Key: Material -> Mesh -> subMeshIndex -> Array<MeshRenderComponent>.
        const lGroupMap: Map<Material, Map<Mesh, Map<number, Array<MeshRenderComponent>>>> = new Map();
        for (const lRenderer of lVisibleRenderers) {
            const lMesh: Mesh = lRenderer.mesh;
            const lMaterials: ReadonlyArray<Material> = lRenderer.materials;

            for (let lSubIndex: number = 0; lSubIndex < lMesh.subMeshes.length; lSubIndex++) {
                // Resolve material for this submesh: use indexed material, fall back to last material, then system default.
                const lMaterial: Material = lSubIndex < lMaterials.length
                    ? lMaterials[lSubIndex]
                    : (lMaterials.length > 0 ? lMaterials[lMaterials.length - 1] : Material.SYSTEM_INSTANCE);

                let lMaterialMap = lGroupMap.get(lMaterial);
                if (!lMaterialMap) {
                    lMaterialMap = new Map();
                    lGroupMap.set(lMaterial, lMaterialMap);
                }

                let lMeshMap = lMaterialMap.get(lMesh);
                if (!lMeshMap) {
                    lMeshMap = new Map();
                    lMaterialMap.set(lMesh, lMeshMap);
                }

                let lRenderers = lMeshMap.get(lSubIndex);
                if (!lRenderers) {
                    lRenderers = [];
                    lMeshMap.set(lSubIndex, lRenderers);
                }

                lRenderers.push(lRenderer);
            }
        }

        // Process each material+mesh+submesh group.
        for (const [lMaterial, lMeshMap] of lGroupMap) {
            // Load material from MaterialSystem (returns compiled material with pipeline).
            const lLoadedMaterial: MaterialSystemMaterial = await lMaterialSystem.loadMaterial(ShitSystem.RENDER_MODE, lMaterial);

            for (const [lMesh, lSubMeshMap] of lMeshMap) {
                for (const [lSubIndex, lRenderers] of lSubMeshMap) {
                    // Ensure vertex parameters are created and cached in MeshSystem.
                    this.mDependencyMeshSystem!.loadMesh(lMesh, lMesh.subMeshes[lSubIndex]);

                    // Get or create material+mesh+submesh group data.
                    let lMaterialGroups = pFrameData.materialMeshGroups.get(lMaterial);
                    if (!lMaterialGroups) {
                        lMaterialGroups = new Map();
                        pFrameData.materialMeshGroups.set(lMaterial, lMaterialGroups);
                    }

                    let lSubMeshGroups = lMaterialGroups.get(lMesh);
                    if (!lSubMeshGroups) {
                        lSubMeshGroups = new Map();
                        lMaterialGroups.set(lMesh, lSubMeshGroups);
                    }

                    let lGroupData = lSubMeshGroups.get(lSubIndex);
                    if (!lGroupData) {
                        lGroupData = this.createMaterialMeshGroup(lLoadedMaterial, lWorldGroup, lRenderers.length);
                        lSubMeshGroups.set(lSubIndex, lGroupData);
                    }

                    // Update transformation data reference each frame.
                    lGroupData.objectBindGroup.data('transformationData').set(lTransformationSystem.gpuBuffer);

                    // Build component indices array.
                    const lIndices: Uint32Array = new Uint32Array(lRenderers.length);
                    for (let lIndex: number = 0; lIndex < lRenderers.length; lIndex++) {
                        const lTransformation: TransformationComponent = lRenderers[lIndex].gameEntity.getComponent(TransformationComponent);
                        lIndices[lIndex] = lTransformationSystem.indexOfTransformation(lTransformation);
                    }

                    // Resize buffer if needed and write indices.
                    if (lGroupData.componentIndicesBuffer.size !== lRenderers.length * Uint32Array.BYTES_PER_ELEMENT) {
                        lGroupData.componentIndicesBuffer.size = lRenderers.length * Uint32Array.BYTES_PER_ELEMENT;
                    }
                    lGroupData.componentIndicesBuffer.write(lIndices.buffer);

                    // Update instance count.
                    lGroupData.instanceCount = lRenderers.length;
                }
            }
        }
    }
}
