import {
    CanvasTexture,
    type BindGroup,
    type GpuBuffer,
    type PipelineData,
    type VertexFragmentPipeline,
} from '@kartoffelgames/web-gpu';
import type { MeshRenderComponent } from '../../source/component/mesh-render-component.ts';
import { TransformationComponent } from '../../source/component/transformation-component.ts';
import { Material } from '../../source/component_item/material.ts';
import type { Mesh } from '../../source/component_item/mesh.ts';
import type { GameComponentConstructor } from '../../source/core/component/game-component.ts';
import type { GameEnvironment } from '../../source/core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor, type GameSystemUpdateStateChanges } from '../../source/core/game-system.ts';
import { CullSystem, type ReadonlyCullSystemRenderTargetData } from '../../source/system/cull-system.ts';
import { GpuSystem } from '../../source/system/gpu-system.ts';
import { LightSystem } from '../../source/system/light-system.ts';
import { MaterialSystem, type MaterialSystemMaterial, type MaterialSystemRenderModeRegisterResult } from '../../source/system/material-system.ts';
import { MeshSystem } from '../../source/system/mesh-system.ts';
import { RenderTargetSystem } from '../../source/system/render-target-system.ts';
import { TransformationSystem } from '../../source/system/transformation-system.ts';
import FORWARD_ENTRY_POINTS from '../../source/shader/forward-entry-points.pgsl';
import FORWARD_IMPORT from '../../source/shader/forward-import.pgsl';
import SHARED_TYPES from '../../source/shader/shared-types.pgsl';
import FORWARD_OBJECT_GROUP from '../../source/shader/object-group-forward.pgsl';
import FORWARD_WORLD_GROUP from '../../source/shader/world-group-forward.pgsl';

type MaterialMeshGroupData = {
    objectBindGroup: BindGroup;
    componentIndicesBuffer: GpuBuffer;
    userBindGroup: BindGroup | null;
    pipelineData: PipelineData;
    pipeline: VertexFragmentPipeline;
    instanceCount: number;
};

/**
 * System that renders all mesh components using PGSL-compiled shaders with material support.
 * Uses MaterialSystem for shader compilation and CullSystem for frustum-culled visible mesh list.
 * Groups instances by material, mesh, and submesh index for efficient instanced rendering.
 * Each submesh of a mesh can have its own material from the MeshRenderComponent's materials array.
 */
export class ShitSystem extends GameSystem {
    private static readonly RENDER_MODE: string = 'ShitRenderMode';

    private mCanvas: HTMLCanvasElement | null;
    private mDependencyCullSystem: CullSystem | null;
    private mDependencyGpuSystem: GpuSystem | null;
    private mDependencyLightSystem: LightSystem | null;
    private mDependencyMaterialSystem: MaterialSystem | null;
    private mDependencyMeshSystem: MeshSystem | null;
    private mDependencyRenderTargetSystem: RenderTargetSystem | null;
    private mDependencyTransformationSystem: TransformationSystem | null;
    private mLightCountBuffer: GpuBuffer | null;
    private mLightDataInitialized: boolean;
    private mLightIndexListBuffer: GpuBuffer | null;
    // Maps: Material -> Mesh -> subMeshIndex -> group data.
    private readonly mMaterialMeshGroups: Map<Material, Map<Mesh, Map<number, MaterialMeshGroupData>>>;
    private mRenderModeResult: MaterialSystemRenderModeRegisterResult | null;
    private mResizeObserver: ResizeObserver | null;
    private mWorldGroup: BindGroup | null;

    /**
     * Canvas element used for rendering.
     */
    public get canvas(): HTMLCanvasElement {
        return this.mCanvas!;
    }

    /**
     * Set the canvas element before the system is created.
     */
    public set canvas(pCanvas: HTMLCanvasElement) {
        this.mCanvas = pCanvas;
    }

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

        this.mCanvas = null;
        this.mDependencyCullSystem = null;
        this.mDependencyGpuSystem = null;
        this.mDependencyLightSystem = null;
        this.mDependencyMaterialSystem = null;
        this.mDependencyMeshSystem = null;
        this.mDependencyRenderTargetSystem = null;
        this.mDependencyTransformationSystem = null;
        this.mLightCountBuffer = null;
        this.mLightDataInitialized = false;
        this.mLightIndexListBuffer = null;
        this.mMaterialMeshGroups = new Map();
        this.mRenderModeResult = null;
        this.mResizeObserver = null;
        this.mWorldGroup = null;
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
        this.mDependencyMaterialSystem.setGlobalImport('WorldGroupForward', FORWARD_WORLD_GROUP);
        this.mDependencyMaterialSystem.setGlobalImport('ObjectGroupForward', FORWARD_OBJECT_GROUP);

        // Create canvas if not set before system creation.
        if (!this.mCanvas) {
            this.mCanvas = document.createElement('canvas');
        }

        const lGpu = this.mDependencyGpuSystem.gpu;

        // Register the ShitRenderMode with the MaterialSystem using forward shaders.
        this.mRenderModeResult = this.mDependencyMaterialSystem.registerRenderMode(ShitSystem.RENDER_MODE, {
            entryPointImport: FORWARD_ENTRY_POINTS,
            functionalImports: [FORWARD_IMPORT],
            typeImports: [SHARED_TYPES]
        });

        // Create CanvasTexture for the setup callback.
        const lCanvasTexture: CanvasTexture = new CanvasTexture(lGpu, this.mCanvas);

        // Register renderer with RenderTargetSystem using the layout and canvas setup callback.
        this.mDependencyRenderTargetSystem.registerRenderer(ShitSystem.RENDER_MODE, this.mRenderModeResult.renderTargetsLayout, (pSetup) => {
            pSetup.setOwnColorTarget('color', lCanvasTexture);
        });

        // Get root render target from RenderTargetSystem and set initial dimensions.
        const lRootRenderTarget = this.mDependencyRenderTargetSystem.rootRenderTarget;
        const lCanvasWidth: number = Math.round(this.mCanvas.clientWidth * devicePixelRatio);
        const lCanvasHeight: number = Math.round(this.mCanvas.clientHeight * devicePixelRatio);
        lRootRenderTarget.width = lCanvasWidth;
        lRootRenderTarget.height = lCanvasHeight;

        // Observe canvas size changes via ResizeObserver.
        this.mResizeObserver = new ResizeObserver((pEntries: Array<ResizeObserverEntry>) => {
            const lEntry: ResizeObserverEntry = pEntries[0];
            const lNewWidth: number = Math.round(lEntry.contentBoxSize[0].inlineSize * devicePixelRatio);
            const lNewHeight: number = Math.round(lEntry.contentBoxSize[0].blockSize * devicePixelRatio);

            // Update root render target dimensions. RenderTargetSystem handles resizing the RenderTargets.
            lRootRenderTarget.width = lNewWidth;
            lRootRenderTarget.height = lNewHeight;
        });
        this.mResizeObserver.observe(this.mCanvas);

        // Create World bind group from the registered render mode's layout and initialize VP buffer.
        this.mWorldGroup = this.mRenderModeResult.bindGroupLayouts.world.layout.create();
        this.mWorldGroup.data('viewProjection').createBuffer();
    }

    /**
     * Execute rendering every frame.
     */
    protected override async onFrame(): Promise<void> {
        if (!this.mRenderModeResult) {
            return;
        }

        // Get root render target and its camera from RenderTargetSystem.
        const lRootRenderTarget = this.mDependencyRenderTargetSystem!.rootRenderTarget;
        const lCamera = lRootRenderTarget.camera;
        if (!lCamera) {
            return;
        }

        // Get culling data for the root render target from CullSystem.
        const lCullingData: ReadonlyCullSystemRenderTargetData | undefined = this.mDependencyCullSystem!.getRenderTargetCulling(lRootRenderTarget);
        if (!lCullingData) {
            return;
        }

        // Rebuild instance data from the frustum-culled visible list.
        await this.rebuildInstanceData(lCullingData);

        // Get RenderTargets from RenderTargetSystem for the root render target.
        const lRenderTargets = this.mDependencyRenderTargetSystem!.getRenderTarget(lRootRenderTarget);

        // Create executor that runs the render pass and copies result to canvas.
        this.mDependencyGpuSystem!.gpu.execute((pExecutor) => {
            pExecutor.renderPass(lRenderTargets, (pContext) => {
                for (const [, lMeshGroups] of this.mMaterialMeshGroups) {
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
    private createMaterialMeshGroup(pLoadedMaterial: MaterialSystemMaterial, pInitialCount: number): MaterialMeshGroupData {
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
            lGroups[lWorldGroupIndex] = this.mWorldGroup!;
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
     * Rebuild instance data from the frustum-culled visible mesh list.
     * Groups renderers by material, mesh, and submesh index. Updates light data and camera VP.
     * Each submesh uses its corresponding material from the MeshRenderComponent's materials array.
     */
    private async rebuildInstanceData(pCullingData: ReadonlyCullSystemRenderTargetData): Promise<void> {
        if (!this.mRenderModeResult || !this.mWorldGroup) {
            return;
        }

        const lVisibleRenderers = pCullingData.meshes.visible;
        const lTransformationSystem: TransformationSystem = this.mDependencyTransformationSystem!;
        const lLightSystem: LightSystem = this.mDependencyLightSystem!;
        const lMaterialSystem: MaterialSystem = this.mDependencyMaterialSystem!;

        // Reset all instance counts.
        for (const [, lMeshGroups] of this.mMaterialMeshGroups) {
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

        // Lazily initialize light data in the World bind group.
        if (!this.mLightDataInitialized) {
            this.mWorldGroup.data('lightData').set(lLightSystem.lightBuffer);
            this.mLightCountBuffer = this.mWorldGroup.data('lightCount').createBuffer(1);
            this.mLightIndexListBuffer = this.mWorldGroup.data('lightIndexList').createBuffer(Math.max(lLightSystem.lights.length, 1));
            this.mLightDataInitialized = true;
        }

        // Update light data each frame.
        this.mWorldGroup.data('lightData').set(lLightSystem.lightBuffer);

        const lActiveLights = lLightSystem.lights;
        const lLightIndexList: Uint32Array = new Uint32Array(lActiveLights.length);
        for (let lIndex: number = 0; lIndex < lActiveLights.length; lIndex++) {
            lLightIndexList[lIndex] = lLightSystem.indexOfLight(lActiveLights[lIndex]);
        }

        this.mLightCountBuffer!.write(new Uint32Array([lActiveLights.length]).buffer);
        if (this.mLightIndexListBuffer!.size !== lActiveLights.length * Uint32Array.BYTES_PER_ELEMENT) {
            this.mLightIndexListBuffer!.size = lActiveLights.length * Uint32Array.BYTES_PER_ELEMENT;
        }
        this.mLightIndexListBuffer!.write(lLightIndexList.buffer);

        // Update camera view projection matrix from root render target's camera.
        const lRootRenderTarget = this.mDependencyRenderTargetSystem!.rootRenderTarget;
        const lCamera = lRootRenderTarget.camera!;
        const lCameraTransformation: TransformationComponent = lCamera.gameEntity.getComponent(TransformationComponent)!;
        const lWorldMatrix = lTransformationSystem.worldMatrixOfTransformation(lCameraTransformation);
        const lViewProjectionMatrix = lCamera.matrix.mult(lWorldMatrix.inverse());
        this.mWorldGroup.data('viewProjection').getRaw<GpuBuffer>().write(new Float32Array(lViewProjectionMatrix.dataArray).buffer);

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
                    let lMaterialGroups = this.mMaterialMeshGroups.get(lMaterial);
                    if (!lMaterialGroups) {
                        lMaterialGroups = new Map();
                        this.mMaterialMeshGroups.set(lMaterial, lMaterialGroups);
                    }

                    let lSubMeshGroups = lMaterialGroups.get(lMesh);
                    if (!lSubMeshGroups) {
                        lSubMeshGroups = new Map();
                        lMaterialGroups.set(lMesh, lSubMeshGroups);
                    }

                    let lGroupData = lSubMeshGroups.get(lSubIndex);
                    if (!lGroupData) {
                        lGroupData = this.createMaterialMeshGroup(lLoadedMaterial, lRenderers.length);
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
