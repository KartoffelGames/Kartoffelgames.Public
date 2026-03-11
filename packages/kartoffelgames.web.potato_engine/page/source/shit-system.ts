import {
CanvasTexture,
    type BindGroup,
    type GpuBuffer,
    type PipelineData,
    type RenderTargets,
    type VertexFragmentPipeline,
    type VertexParameter,
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
import { MaterialSystem, ShaderRenderMode, type MaterialSystemCompiledMaterial } from '../../source/system/material-system.ts';
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
 * System that renders all mesh components using PGSL-compiled shaders with material support.
 * Uses MaterialSystem for shader compilation and CullSystem for frustum-culled visible mesh list.
 * Groups instances by material, mesh, and submesh index for efficient instanced rendering.
 * Each submesh of a mesh can have its own material from the MeshRenderComponent's materials array.
 */
export class ShitSystem extends GameSystem {
    private mCanvas: HTMLCanvasElement | null;
    private mDefaultPipeline: VertexFragmentPipeline | null;
    private mDependencyCullSystem: CullSystem | null;
    private mDependencyGpuSystem: GpuSystem | null;
    private mDependencyLightSystem: LightSystem | null;
    private mDependencyMaterialSystem: MaterialSystem | null;
    private mDependencyTransformationSystem: TransformationSystem | null;
    private mLightCountBuffer: GpuBuffer | null;
    private mLightDataInitialized: boolean;
    private mLightIndexListBuffer: GpuBuffer | null;
    // Maps: Material -> Mesh -> subMeshIndex -> group data.
    private readonly mMaterialMeshGroups: Map<Material, Map<Mesh, Map<number, MaterialMeshGroupData>>>;
    private mObjectGroupIndex: number;
    private mRenderTargets: RenderTargets | null;
    private mResizeObserver: ResizeObserver | null;
    private readonly mVertexParameterCache: Map<Mesh, Array<VertexParameter>>;
    private mWorldGroup: BindGroup | null;
    private mWorldGroupIndex: number;

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
        return [TransformationSystem, GpuSystem, LightSystem, CullSystem, MaterialSystem];
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
        this.mDefaultPipeline = null;
        this.mDependencyCullSystem = null;
        this.mDependencyGpuSystem = null;
        this.mDependencyLightSystem = null;
        this.mDependencyMaterialSystem = null;
        this.mDependencyTransformationSystem = null;
        this.mLightCountBuffer = null;
        this.mLightDataInitialized = false;
        this.mLightIndexListBuffer = null;
        this.mMaterialMeshGroups = new Map();
        this.mObjectGroupIndex = 1;
        this.mRenderTargets = null;
        this.mResizeObserver = null;
        this.mVertexParameterCache = new Map();
        this.mWorldGroup = null;
        this.mWorldGroupIndex = 0;
    }

    /**
     * Initialize canvas, GPU render targets from MaterialSystem's layout, and bind groups.
     */
    protected override async onCreate(): Promise<void> {
        // Read dependencies.
        this.mDependencyTransformationSystem = this.environment.getSystem(TransformationSystem);
        this.mDependencyGpuSystem = this.environment.getSystem(GpuSystem);
        this.mDependencyLightSystem = this.environment.getSystem(LightSystem);
        this.mDependencyCullSystem = this.environment.getSystem(CullSystem);
        this.mDependencyMaterialSystem = this.environment.getSystem(MaterialSystem);

        // Create canvas if not set before system creation.
        if (!this.mCanvas) {
            this.mCanvas = document.createElement('canvas');
        }

        const lGpu = this.mDependencyGpuSystem.gpu;

        // Get canvas dimensions.
        const lCanvasWidth: number = Math.round(this.mCanvas.clientWidth * devicePixelRatio);
        const lCanvasHeight: number = Math.round(this.mCanvas.clientHeight * devicePixelRatio);
        const lCanvasTexture: CanvasTexture = new CanvasTexture(lGpu, this.mCanvas);
        lCanvasTexture.width = lCanvasWidth;
        lCanvasTexture.height = lCanvasHeight;

        // Create RenderTargets from MaterialSystem's RenderTargetsLayout.
        const lRenderTargetsLayout = this.mDependencyMaterialSystem.getRenderTargetsLayout(ShaderRenderMode.Forward);
        this.mRenderTargets = lRenderTargetsLayout.create();
        this.mRenderTargets.setResolveCanvas('color', lCanvasTexture);
        this.mRenderTargets.resize(lCanvasHeight, lCanvasWidth);

        // Update core render target component dimensions to match canvas.
        const lCoreRenderTarget = this.mDependencyCullSystem.rootRenderTarget;
        lCoreRenderTarget.width = lCanvasWidth;
        lCoreRenderTarget.height = lCanvasHeight;

        // Observe canvas size changes via ResizeObserver.
        this.mResizeObserver = new ResizeObserver((pEntries: Array<ResizeObserverEntry>) => {
            const lEntry: ResizeObserverEntry = pEntries[0];
            const lNewWidth: number = Math.round(lEntry.contentBoxSize[0].inlineSize * devicePixelRatio);
            const lNewHeight: number = Math.round(lEntry.contentBoxSize[0].blockSize * devicePixelRatio);

            if (this.mRenderTargets) {
                this.mRenderTargets.resize(lNewHeight, lNewWidth);
            }

            lCanvasTexture.width = lNewWidth;
            lCanvasTexture.height = lNewHeight;

            lCoreRenderTarget.width = lNewWidth;
            lCoreRenderTarget.height = lNewHeight;
        });
        this.mResizeObserver.observe(this.mCanvas);

        // Get group indices from MaterialSystem.
        this.mWorldGroupIndex = this.mDependencyMaterialSystem.getGroupIndex(ShaderRenderMode.Forward, 'World');
        this.mObjectGroupIndex = this.mDependencyMaterialSystem.getGroupIndex(ShaderRenderMode.Forward, 'Object');

        // Get default material and its pipeline.
        const lDefaultMaterial: MaterialSystemCompiledMaterial = this.mDependencyMaterialSystem.defaultMaterial;
        this.mDefaultPipeline = lDefaultMaterial.pipelines.get(ShaderRenderMode.Forward)!;

        // Create World bind group from MaterialSystem's layout and initialize VP buffer.
        const lWorldLayout = this.mDependencyMaterialSystem.getGroupLayout(ShaderRenderMode.Forward, 'World');
        this.mWorldGroup = lWorldLayout.create();
        this.mWorldGroup.data('viewProjection').createBuffer();
    }

    /**
     * Execute rendering every frame.
     */
    protected override async onFrame(): Promise<void> {
        if (!this.mDefaultPipeline) {
            return;
        }

        // Get culling data for the core render target from CullSystem.
        const lCullingData: ReadonlyCullSystemRenderTargetData | undefined = this.mDependencyCullSystem!.getRenderTargetCulling(this.mDependencyCullSystem!.rootRenderTarget);

        if (!lCullingData || !lCullingData.camera || !lCullingData.camera.transformation) {
            return;
        }

        // Rebuild instance data from the frustum-culled visible list.
        await this.rebuildInstanceData(lCullingData);

        // Create executor that runs the render pass and copies result to canvas.
        this.mDependencyGpuSystem!.gpu.execute((pExecutor) => {
            pExecutor.renderPass(this.mRenderTargets!, (pContext) => {
                for (const [, lMeshGroups] of this.mMaterialMeshGroups) {
                    for (const [lMesh, lSubMeshGroups] of lMeshGroups) {
                        for (const [lSubMeshIndex, lGroupData] of lSubMeshGroups) {
                            if (lGroupData.instanceCount > 0) {
                                const lVertexParam: VertexParameter = this.mVertexParameterCache.get(lMesh)![lSubMeshIndex];
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
    private createMaterialMeshGroup(pLoadedMaterial: MaterialSystemCompiledMaterial, pInitialCount: number): MaterialMeshGroupData {
        // Get pipeline for this material.
        const lPipeline: VertexFragmentPipeline = pLoadedMaterial.pipelines.get(ShaderRenderMode.Forward)!;

        // Create Object bind group from MaterialSystem's layout.
        const lObjectLayout = this.mDependencyMaterialSystem!.getGroupLayout(ShaderRenderMode.Forward, 'Object');
        const lObjectBindGroup: BindGroup = lObjectLayout.create();
        lObjectBindGroup.data('transformationData').set(this.mDependencyTransformationSystem!.gpuBuffer);
        const lComponentIndicesBuffer: GpuBuffer = lObjectBindGroup.data('componentIndices').createBuffer(pInitialCount);

        // Create pipeline data from material's pipeline layout.
        const lUserBindGroup: BindGroup | null = pLoadedMaterial.userBinding.group;
        const lUserGroupIndex: number = pLoadedMaterial.userBinding.index;

        const lPipelineData: PipelineData = lPipeline.layout.withData((pSetup) => {
            const lMaxIndex = Math.max(this.mWorldGroupIndex, this.mObjectGroupIndex, lUserGroupIndex);
            const lGroups: Array<BindGroup | null> = new Array(lMaxIndex + 1).fill(null);
            lGroups[this.mWorldGroupIndex] = this.mWorldGroup!;
            lGroups[this.mObjectGroupIndex] = lObjectBindGroup;

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
     * Create and cache vertex parameters for a mesh.
     * Creates buffers for all ForwardVertexIn attributes, defaulting missing optional attributes.
     */
    private createVertexParameters(pMesh: Mesh, pLoadedMaterial: MaterialSystemCompiledMaterial): void {
        const lVertexCount: number = pMesh.verticesData.length / 3;

        // Default arrays for optional attributes.
        const lDefaultColors: Array<number> = new Array(lVertexCount * 4).fill(1.0);
        const lDefaultUvs: Array<number> = new Array(lVertexCount * 2).fill(0);

        const lVertexParameters = pMesh.subMeshes.map((pSubMesh) => {
            const lVertexParam: VertexParameter = pLoadedMaterial.pipelines.get(ShaderRenderMode.Forward)!.module.vertexParameter.create(pSubMesh.indices);

            lVertexParam.create('position', pMesh.verticesData);
            lVertexParam.create('normal', pMesh.normals);
            lVertexParam.create('color', pMesh.colors.length > 0 ? pMesh.colors : lDefaultColors);
            lVertexParam.create('uv', pMesh.uv1.length > 0 ? pMesh.uv1 : lDefaultUvs);
            lVertexParam.create('uv2', pMesh.uv2.length > 0 ? pMesh.uv2 : lDefaultUvs);
            lVertexParam.create('uv3', pMesh.uv3.length > 0 ? pMesh.uv3 : lDefaultUvs);
            lVertexParam.create('uv4', pMesh.uv4.length > 0 ? pMesh.uv4 : lDefaultUvs);

            return lVertexParam;
        });

        this.mVertexParameterCache.set(pMesh, lVertexParameters);
    }

    /**
     * Rebuild instance data from the frustum-culled visible mesh list.
     * Groups renderers by material, mesh, and submesh index. Updates light data and camera VP.
     * Each submesh uses its corresponding material from the MeshRenderComponent's materials array.
     */
    private async rebuildInstanceData(pCullingData: ReadonlyCullSystemRenderTargetData): Promise<void> {
        if (!this.mDefaultPipeline || !this.mWorldGroup) {
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

        // Update camera view projection matrix.
        const lWorldMatrix = lTransformationSystem.worldMatrixOfTransformation(pCullingData.camera!.transformation!);
        const lViewProjectionMatrix = pCullingData.camera!.component.matrix.mult(lWorldMatrix.inverse());
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
            const lLoadedMaterial: MaterialSystemCompiledMaterial = await lMaterialSystem.loadMaterial(lMaterial, ShaderRenderMode.Forward);

            for (const [lMesh, lSubMeshMap] of lMeshMap) {
                // Get or create cached vertex parameters for this mesh.
                if (!this.mVertexParameterCache.has(lMesh)) {
                    this.createVertexParameters(lMesh, lLoadedMaterial);
                }

                for (const [lSubIndex, lRenderers] of lSubMeshMap) {
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
