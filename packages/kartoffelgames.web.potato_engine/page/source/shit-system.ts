import {
    type BindGroup,
    type CanvasTexture,
    type GpuBuffer,
    type GpuExecution,
    type PipelineData,
    PrimitiveCullMode,
    type RenderPass,
    type RenderTargets,
    type Shader,
    type ShaderRenderModule,
    TextureFormat,
    type VertexFragmentPipeline,
    type VertexParameter,
} from '@kartoffelgames/web-gpu';
import type { PgslParserResult } from '@kartoffelgames/core-pgsl';
import type { MeshRenderComponent } from '../../source/component/mesh-render-component.ts';
import { TransformationComponent } from '../../source/component/transformation-component.ts';
import type { Material } from '../../source/component_item/material.ts';
import type { Mesh } from '../../source/component_item/mesh.ts';
import type { GameComponentConstructor } from '../../source/core/component/game-component.ts';
import type { GameEnvironment } from '../../source/core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor, type GameSystemUpdateStateChanges } from '../../source/core/game-system.ts';
import { CullSystem, type ReadonlyCullSystemRenderTargetData } from '../../source/system/cull-system.ts';
import { GpuSystem } from '../../source/system/gpu-system.ts';
import { LightSystem } from '../../source/system/light-system.ts';
import { MaterialSystem, type LoadedMaterial } from '../../source/system/material-system.ts';
import { RenderTechnique } from '../../source/system/render-technique.enum.ts';
import { TransformationSystem } from '../../source/system/transformation-system.ts';

type MaterialMeshGroupData = {
    objectBindGroup: BindGroup;
    componentIndicesBuffer: GpuBuffer;
    userBindGroup: BindGroup | null;
    pipelineData: PipelineData;
    instanceCount: number;
};

/**
 * System that renders all mesh components using PGSL-compiled shaders with material support.
 * Uses MaterialSystem for shader compilation and CullSystem for frustum-culled visible mesh list.
 * Groups instances by material and mesh for efficient instanced rendering.
 */
export class ShitSystem extends GameSystem {
    // Canvas state.
    private mCanvas: HTMLCanvasElement | null;
    private mCanvasTexture: CanvasTexture | null;
    private mResizeObserver: ResizeObserver | null;
    private mRenderTargets: RenderTargets | null;

    // GPU rendering resources.
    private mDefaultRenderModule: ShaderRenderModule | null;
    private mDefaultPipeline: VertexFragmentPipeline | null;
    private mWorldGroup: BindGroup | null;
    private mWorldGroupIndex: number;
    private mObjectGroupIndex: number;
    private mUserGroupIndex: number;
    private mLightDataInitialized: boolean;
    private mLightCountBuffer: GpuBuffer | null;
    private mLightIndexListBuffer: GpuBuffer | null;
    private mExecutor: GpuExecution | null;
    private mRenderPass: RenderPass | null;
    private readonly mMaterialMeshGroups: Map<Material, Map<Mesh, MaterialMeshGroupData>>;
    private readonly mVertexParameterCache: Map<Mesh, Array<VertexParameter>>;

    // Dependencies.
    private mDependencyTransformationSystem: TransformationSystem | null;
    private mDependencyGpuSystem: GpuSystem | null;
    private mDependencyLightSystem: LightSystem | null;
    private mDependencyCullSystem: CullSystem | null;
    private mDependencyMaterialSystem: MaterialSystem | null;

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
     * Constructor.
     *
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super('ShitSystem', pEnvironment);

        // Canvas state.
        this.mCanvas = null;
        this.mCanvasTexture = null;
        this.mResizeObserver = null;
        this.mRenderTargets = null;

        // GPU rendering resources.
        this.mDefaultRenderModule = null;
        this.mDefaultPipeline = null;
        this.mWorldGroup = null;
        this.mWorldGroupIndex = 0;
        this.mObjectGroupIndex = 1;
        this.mUserGroupIndex = -1;
        this.mLightDataInitialized = false;
        this.mLightCountBuffer = null;
        this.mLightIndexListBuffer = null;
        this.mExecutor = null;
        this.mRenderPass = null;
        this.mMaterialMeshGroups = new Map();
        this.mVertexParameterCache = new Map();

        // Dependencies.
        this.mDependencyTransformationSystem = null;
        this.mDependencyGpuSystem = null;
        this.mDependencyLightSystem = null;
        this.mDependencyCullSystem = null;
        this.mDependencyMaterialSystem = null;
    }

    /**
     * Initialize canvas, GPU render targets, shader pipeline from MaterialSystem, render pass, and executor.
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

        // Create GPU render targets as standalone offscreen textures.
        const lCanvasWidth: number = Math.round(this.mCanvas.clientWidth * devicePixelRatio);
        const lCanvasHeight: number = Math.round(this.mCanvas.clientHeight * devicePixelRatio);
        this.mCanvasTexture = lGpu.canvas(this.mCanvas);
        this.mCanvasTexture.width = lCanvasWidth;
        this.mCanvasTexture.height = lCanvasHeight;
        this.mRenderTargets = this.createRenderTargets();
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

            if (this.mCanvasTexture) {
                this.mCanvasTexture.width = lNewWidth;
                this.mCanvasTexture.height = lNewHeight;
            }

            lCoreRenderTarget.width = lNewWidth;
            lCoreRenderTarget.height = lNewHeight;
        });
        this.mResizeObserver.observe(this.mCanvas);

        // Get default loaded material from MaterialSystem (shader is already configured).
        const lDefaultMaterial: LoadedMaterial = this.mDependencyMaterialSystem.defaultLoadedMaterial;
        const lDefaultShader: Shader = lDefaultMaterial.shader;
        const lParserResult: PgslParserResult = lDefaultMaterial.parserResult;

        // Determine bind group indices from parser result.
        for (const lBinding of lParserResult.bindings) {
            if (lBinding.bindGroupName === 'World') {
                this.mWorldGroupIndex = lBinding.bindGroupIndex;
            } else if (lBinding.bindGroupName === 'Object') {
                this.mObjectGroupIndex = lBinding.bindGroupIndex;
            } else if (lBinding.bindGroupName === 'User') {
                this.mUserGroupIndex = lBinding.bindGroupIndex;
            }
        }

        // Create render module and pipeline.
        this.mDefaultRenderModule = lDefaultShader.createRenderModule('vertex_main', 'fragment_main');
        this.mDefaultPipeline = this.mDefaultRenderModule.create(this.mRenderTargets);
        this.mDefaultPipeline.primitiveCullMode = PrimitiveCullMode.Front;

        // Create World bind group with VP buffer. Light data is lazily initialized.
        this.mWorldGroup = this.mDefaultRenderModule.layout.getGroupLayout('World').create();
        this.mWorldGroup.data('viewProjection').createBuffer();

        // Create render pass that draws all material+mesh groups.
        this.mRenderPass = lGpu.renderPass(this.mRenderTargets, (pContext) => {
            for (const [, lMeshGroups] of this.mMaterialMeshGroups) {
                for (const [lMesh, lGroupData] of lMeshGroups) {
                    if (lGroupData.instanceCount > 0) {
                        const lVertexParams = this.mVertexParameterCache.get(lMesh)!;
                        for (const lVertexParam of lVertexParams) {
                            pContext.drawDirect(this.mDefaultPipeline!, lVertexParam, lGroupData.pipelineData, lGroupData.instanceCount);
                        }
                    }
                }
            }
        }, false);

        // Create executor that runs the render pass and copies result to canvas.
        this.mExecutor = lGpu.executor((pExecutor) => {
            this.mRenderPass!.execute(pExecutor);

            // Copy render target texture to canvas.
            const lColorTarget = this.mRenderTargets!.colorTarget('color');
            pExecutor.commandEncoder.copyTextureToTexture(
                { texture: lColorTarget.texture.native, aspect: 'all', mipLevel: 0 },
                { texture: this.mCanvasTexture!.native, aspect: 'all', mipLevel: 0 },
                { width: this.mRenderTargets!.width, height: this.mRenderTargets!.height, depthOrArrayLayers: 1 }
            );
        });
    }

    /**
     * Execute rendering every frame.
     */
    protected override async onFrame(): Promise<void> {
        if (!this.mExecutor || !this.mDefaultRenderModule || !this.mDefaultPipeline) {
            return;
        }

        // Get culling data for the core render target from CullSystem.
        const lCullingData: ReadonlyCullSystemRenderTargetData | undefined = this.mDependencyCullSystem!.getRenderTargetCulling(this.mDependencyCullSystem!.rootRenderTarget);

        if (!lCullingData || !lCullingData.camera || !lCullingData.camera.transformation) {
            return;
        }

        // Rebuild instance data from the frustum-culled visible list.
        this.rebuildInstanceData(lCullingData);

        // Execute render pass.
        this.mExecutor.execute();
    }

    /**
     * No component event processing needed.
     */
    protected override async onUpdate(_pStateChanges: GameSystemUpdateStateChanges): Promise<void> {
        // Instance data is rebuilt every frame from the frustum-culled visible list.
    }

    /**
     * Create GPU render targets as standalone offscreen textures.
     */
    private createRenderTargets(): RenderTargets {
        return this.mDependencyGpuSystem!.gpu.renderTargets().setup((pSetup) => {
            pSetup.addColor('color', 0, true, { r: 0, g: 0, b: 0, a: 1 })
                .new(TextureFormat.Bgra8unorm);
            pSetup.addDepthStencil(true, 1).new(TextureFormat.Depth24plus);
        });
    }

    /**
     * Rebuild instance data from the frustum-culled visible mesh list.
     * Groups renderers by material and mesh, updates light data and camera VP.
     */
    private rebuildInstanceData(pCullingData: ReadonlyCullSystemRenderTargetData): void {
        if (!this.mDefaultRenderModule || !this.mDefaultPipeline || !this.mWorldGroup) {
            return;
        }

        const lVisibleRenderers = pCullingData.meshes.visible;
        const lTransformationSystem: TransformationSystem = this.mDependencyTransformationSystem!;
        const lLightSystem: LightSystem = this.mDependencyLightSystem!;
        const lMaterialSystem: MaterialSystem = this.mDependencyMaterialSystem!;

        // Reset all instance counts.
        for (const [, lMeshGroups] of this.mMaterialMeshGroups) {
            for (const [, lGroupData] of lMeshGroups) {
                lGroupData.instanceCount = 0;
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
            this.mWorldGroup.data('ambientLight').set(lLightSystem.ambientLightBuffer);
            this.mLightDataInitialized = true;
        }

        // Update light data each frame.
        this.mWorldGroup.data('lightData').set(lLightSystem.lightBuffer);
        this.mWorldGroup.data('ambientLight').set(lLightSystem.ambientLightBuffer);

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
        this.mWorldGroup.data('viewProjection').asBufferView(Float32Array).write(lViewProjectionMatrix.dataArray);

        // Group visible renderers by material + mesh.
        const lGroupMap: Map<Material, Map<Mesh, Array<MeshRenderComponent>>> = new Map();
        for (const lRenderer of lVisibleRenderers) {
            const lMaterial: Material = lRenderer.material;
            const lMesh: Mesh = lRenderer.mesh;

            let lMaterialMap = lGroupMap.get(lMaterial);
            if (!lMaterialMap) {
                lMaterialMap = new Map();
                lGroupMap.set(lMaterial, lMaterialMap);
            }

            let lRenderers = lMaterialMap.get(lMesh);
            if (!lRenderers) {
                lRenderers = [];
                lMaterialMap.set(lMesh, lRenderers);
            }

            lRenderers.push(lRenderer);
        }

        // Process each material+mesh group.
        for (const [lMaterial, lMeshMap] of lGroupMap) {
            // Load material from MaterialSystem (may return default while compiling).
            const lLoadedMaterial: LoadedMaterial = lMaterialSystem.loadMaterial(lMaterial, RenderTechnique.Forward);

            for (const [lMesh, lRenderers] of lMeshMap) {
                // Get or create cached vertex parameters for this mesh.
                if (!this.mVertexParameterCache.has(lMesh)) {
                    this.createVertexParameters(lMesh);
                }

                // Get or create material+mesh group data.
                let lMaterialGroups = this.mMaterialMeshGroups.get(lMaterial);
                if (!lMaterialGroups) {
                    lMaterialGroups = new Map();
                    this.mMaterialMeshGroups.set(lMaterial, lMaterialGroups);
                }

                let lGroupData = lMaterialGroups.get(lMesh);
                if (!lGroupData) {
                    lGroupData = this.createMaterialMeshGroup(lLoadedMaterial, lRenderers.length);
                    lMaterialGroups.set(lMesh, lGroupData);
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

    /**
     * Create a new material+mesh group with Object bind group, buffers, and pipeline data.
     */
    private createMaterialMeshGroup(pLoadedMaterial: LoadedMaterial, pInitialCount: number): MaterialMeshGroupData {
        const lObjectBindGroup: BindGroup = this.mDefaultRenderModule!.layout.getGroupLayout('Object').create();
        lObjectBindGroup.data('transformationData').set(this.mDependencyTransformationSystem!.gpuBuffer);
        const lComponentIndicesBuffer: GpuBuffer = lObjectBindGroup.data('componentIndices').createBuffer(pInitialCount);

        // Create pipeline data with groups in index order.
        const lUserBindGroup: BindGroup | null = pLoadedMaterial.userBindGroup;
        const lUserGroupIndex: number = pLoadedMaterial.userGroupIndex;

        const lPipelineData: PipelineData = this.mDefaultPipeline!.layout.withData((pSetup) => {
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
            instanceCount: 0
        };
    }

    /**
     * Create and cache vertex parameters for a mesh.
     * Creates buffers for all ForwardVertexIn attributes, defaulting missing optional attributes.
     */
    private createVertexParameters(pMesh: Mesh): void {
        const lVertexCount: number = pMesh.verticesData.length / 3;

        // Default arrays for optional attributes.
        const lDefaultColors: Array<number> = new Array(lVertexCount * 4).fill(1.0);
        const lDefaultUvs: Array<number> = new Array(lVertexCount * 2).fill(0);

        const lVertexParameters = pMesh.subMeshes.map((lSubMesh) => {
            const lVertexParam: VertexParameter = this.mDefaultRenderModule!.vertexParameter.create(lSubMesh.indices);

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
}
