import {
    type BindGroup,
    BindGroupLayout,
    BufferItemFormat,
    BufferItemMultiplier,
    ComputeStage,
    type GpuBuffer,
    type GpuExecution,
    type PipelineData,
    PrimitiveCullMode,
    type RenderPass,
    type RenderTargets,
    type ShaderRenderModule,
    StorageBindingType,
    TextureFormat,
    type VertexFragmentPipeline,
    type VertexParameter,
    VertexParameterStepMode
} from '@kartoffelgames/web-gpu';
import type { MeshRenderComponent } from '../../source/component/mesh-render-component.ts';
import { TransformationComponent } from '../../source/component/transformation-component.ts';
import type { Mesh } from '../../source/component_item/mesh/mesh.ts';
import type { GameComponentConstructor } from '../../source/core/component/game-component.ts';
import type { GameEnvironment, GameEnvironmentStateChange } from '../../source/core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor } from '../../source/core/game-system.ts';
import { CullSystem, type CullSystemRenderTargetCulling } from '../../source/system/cull-system.ts';
import { GpuSystem } from '../../source/system/gpu-system.ts';
import { LightSystem } from '../../source/system/light-system.ts';
import { TransformationSystem } from '../../source/system/transformation-system.ts';
import shitShaderSource from './shit-system-shader.wgsl';

type MeshGroupData = {
    objectBindGroup: BindGroup;
    componentIndicesBuffer: GpuBuffer;
    pipelineData: PipelineData;
    instanceCount: number;
};

/**
 * System that renders all mesh components as colored geometry with dynamic lighting from LightSystem.
 * Uses CullSystem for camera assignment and frustum-culled visible mesh list.
 * Owns the canvas element and GPU render targets for the core render target.
 */
export class ShitSystem extends GameSystem {
    // Canvas state.
    private mCanvas: HTMLCanvasElement | null;
    private mResizeObserver: ResizeObserver | null;
    private mRenderTargets: RenderTargets | null;

    // GPU rendering resources.
    private mCameraGroup: BindGroup | null;
    private mExecutor: GpuExecution | null;
    private mLightCountBuffer: GpuBuffer | null;
    private mLightsGroup: BindGroup | null;
    private readonly mMeshGroups: Map<Mesh, MeshGroupData>;
    private mPipeline: VertexFragmentPipeline | null;
    private mRenderPass: RenderPass | null;
    private mShaderRenderModule: ShaderRenderModule | null;
    private readonly mVertexParameterCache: Map<Mesh, Array<VertexParameter>>;

    // Dependencies.
    private mDependencyTransformationSystem: TransformationSystem | null;
    private mDependencyGpuSystem: GpuSystem | null;
    private mDependencyLightSystem: LightSystem | null;
    private mDependencyCullSystem: CullSystem | null;

    /**
     * Systems this system depends on.
     */
    public override get dependentSystemTypes(): Array<GameSystemConstructor<GameSystem>> {
        return [TransformationSystem, GpuSystem, LightSystem, CullSystem];
    }

    /**
     * Component types this system handles.
     */
    public override get handledComponentTypes(): Array<GameComponentConstructor> {
        return [];
    }

    /**
     * Canvas element used for rendering.
     * Can be read after onCreate to access the canvas.
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
     * Constructor.
     * 
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super(pEnvironment);

        // Canvas state.
        this.mCanvas = null;
        this.mResizeObserver = null;
        this.mRenderTargets = null;

        // GPU rendering resources.
        this.mCameraGroup = null;
        this.mExecutor = null;
        this.mLightCountBuffer = null;
        this.mLightsGroup = null;
        this.mMeshGroups = new Map();
        this.mPipeline = null;
        this.mRenderPass = null;
        this.mShaderRenderModule = null;
        this.mVertexParameterCache = new Map();

        // Dependencies.
        this.mDependencyTransformationSystem = null;
        this.mDependencyGpuSystem = null;
        this.mDependencyLightSystem = null;
        this.mDependencyCullSystem = null;
    }

    /**
     * Initialize canvas, GPU render targets, shader, pipeline, render pass, and executor.
     * Creates GPU render targets backed by the canvas and sets up a ResizeObserver.
     */
    protected override async onCreate(): Promise<void> {
        // Read dependencies.
        this.mDependencyTransformationSystem = this.environment.getSystem(TransformationSystem);
        this.mDependencyGpuSystem = this.environment.getSystem(GpuSystem);
        this.mDependencyLightSystem = this.environment.getSystem(LightSystem);
        this.mDependencyCullSystem = this.environment.getSystem(CullSystem);

        // Create canvas if not set before system creation.
        if (!this.mCanvas) {
            this.mCanvas = document.createElement('canvas');
        }

        // Get GPU device from dependency.
        const lGpu = this.mDependencyGpuSystem.gpu;

        // Create GPU render targets backed by the canvas.
        const lCanvasWidth: number = Math.round(this.mCanvas.clientWidth * devicePixelRatio);
        const lCanvasHeight: number = Math.round(this.mCanvas.clientHeight * devicePixelRatio);
        this.mRenderTargets = this.createRenderTargets(this.mCanvas);
        this.mRenderTargets.resize(lCanvasHeight, lCanvasWidth);

        // Update core render target component dimensions to match canvas.
        const lCoreRenderTarget = this.mDependencyCullSystem.coreRenderTarget;
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

            // Update core render target component dimensions so CullSystem updates camera aspect ratio.
            lCoreRenderTarget.width = lNewWidth;
            lCoreRenderTarget.height = lNewHeight;
        });
        this.mResizeObserver.observe(this.mCanvas);

        // Create camera bind group layout and group.
        const lCameraGroupLayout: BindGroupLayout = new BindGroupLayout(lGpu, 'camera').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'viewProjection', ComputeStage.Vertex)
                .asBuffer().withPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Matrix44);
        });
        this.mCameraGroup = lCameraGroupLayout.create();
        this.mCameraGroup.data('viewProjection').createBuffer();

        // Create shader and configure pipeline layout.
        const lShader = lGpu.shader(shitShaderSource).setup((pShaderSetup) => {
            // Vertex entry point with position and normal buffers.
            pShaderSetup.vertexEntryPoint('vertex_main', (pVertexParameterSetup) => {
                pVertexParameterSetup.buffer('position', VertexParameterStepMode.Index)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector3);

                pVertexParameterSetup.buffer('normal', VertexParameterStepMode.Index)
                    .withParameter('normal', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
            });

            // Fragment entry point with single color render target.
            pShaderSetup.fragmentEntryPoint('fragment_main')
                .addRenderTarget('main', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

            // Object bind group with transformation data and component indices storage buffers.
            pShaderSetup.group(0, 'object', (pBindGroupSetup) => {
                pBindGroupSetup.binding(0, 'transformationData', ComputeStage.Vertex | ComputeStage.Fragment, StorageBindingType.Read)
                    .asBuffer().withArray().withPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Matrix44);

                pBindGroupSetup.binding(1, 'componentIndices', ComputeStage.Vertex, StorageBindingType.Read)
                    .asBuffer().withArray().withPrimitive(BufferItemFormat.Uint32, BufferItemMultiplier.Single);
            });

            // Camera bind group.
            pShaderSetup.group(1, this.mCameraGroup!.layout);

            // Lights bind group with light data storage buffer and light count uniform.
            pShaderSetup.group(2, 'lights', (pBindGroupSetup) => {
                pBindGroupSetup.binding(0, 'lightData', ComputeStage.Fragment, StorageBindingType.Read)
                    .asBuffer().withArray().withPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Single);

                pBindGroupSetup.binding(1, 'lightCount', ComputeStage.Fragment)
                    .asBuffer().withPrimitive(BufferItemFormat.Uint32, BufferItemMultiplier.Single);
            });
        });

        // Create render module from shader.
        this.mShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Create pipeline using the render targets for compatibility.
        this.mPipeline = this.mShaderRenderModule.create(this.mRenderTargets);
        this.mPipeline.primitiveCullMode = PrimitiveCullMode.Front;

        // Create render pass that draws all submeshes for all visible instances.
        this.mRenderPass = lGpu.renderPass(this.mRenderTargets, (pContext) => {
            for (const [lMesh, lGroupData] of this.mMeshGroups) {
                if (lGroupData.instanceCount > 0) {
                    const lVertexParameters = this.mVertexParameterCache.get(lMesh)!;
                    for (const lVertexParameter of lVertexParameters) {
                        pContext.drawDirect(this.mPipeline!, lVertexParameter, lGroupData.pipelineData, lGroupData.instanceCount);
                    }
                }
            }
        }, false);

        // Create executor that runs the render pass.
        this.mExecutor = lGpu.executor((pExecutor) => {
            this.mRenderPass!.execute(pExecutor);
        });
    }

    /**
     * Execute rendering every frame.
     * Uses the frustum-culled visible mesh list from CullSystem.
     */
    protected override async onFrame(): Promise<void> {
        // Skip rendering when not initialized.
        if (!this.mExecutor || !this.mCameraGroup || !this.mShaderRenderModule || !this.mPipeline) {
            return;
        }

        // Get culling data for the core render target from CullSystem.
        const lCullingData: CullSystemRenderTargetCulling | undefined = this.mDependencyCullSystem!.getRenderTargetCulling(this.mDependencyCullSystem!.coreRenderTarget);

        // Skip rendering when no culling data or no camera is assigned.
        if (!lCullingData || !lCullingData.camera || !lCullingData.cameraTransformation) {
            return;
        }

        // Rebuild instance data from the frustum-culled visible list.
        this.rebuildInstanceData(lCullingData.visibleMeshRenderers);

        // Update camera view projection matrix every frame.
        // Use the world matrix from TransformationSystem and invert it to get the view matrix.
        const lWorldMatrix = this.mDependencyTransformationSystem!.worldMatrixOfTransformation(lCullingData.cameraTransformation);
        const lViewProjectionMatrix = lCullingData.camera.matrix.mult(lWorldMatrix.inverse());
        this.mCameraGroup.data('viewProjection').asBufferView(Float32Array).write(lViewProjectionMatrix.dataArray);

        // Execute render pass.
        this.mExecutor.execute();
    }

    /**
     * Process component state changes.
     * All component tracking is handled by CullSystem; this system rebuilds per frame from the visible list.
     */
    protected override async onUpdate(_pStateChanges: Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>): Promise<void> {
        // No component event processing needed.
        // Camera and mesh renderer tracking is handled by CullSystem.
        // Instance data is rebuilt every frame from the frustum-culled visible list.
    }

    /**
     * Create GPU render targets backed by a canvas element.
     * Configures a multisampled color render target resolving to the canvas texture,
     * plus a depth-stencil attachment.
     *
     * @param pCanvas - The canvas element to render to.
     *
     * @returns A new RenderTargets object.
     */
    private createRenderTargets(pCanvas: HTMLCanvasElement): RenderTargets {
        return this.mDependencyGpuSystem!.gpu.renderTargets().setup((pSetup) => {
            // Add color render target with canvas texture as resolve target.
            pSetup.addColor('color', 0, true, { r: 0, g: 0, b: 0, a: 1 })
                .new(TextureFormat.Bgra8unorm, this.mDependencyGpuSystem!.gpu.canvas(pCanvas));

            // Add depth texture.
            pSetup.addDepthStencil(true, 1).new(TextureFormat.Depth24plus);
        });
    }

    /**
     * Rebuild instance data from the visible mesh render components.
     * Groups renderers by mesh, caches GPU resources per mesh group, and reuses buffers.
     *
     * @param pVisibleRenderers - Frustum-culled list of visible mesh render components.
     */
    private rebuildInstanceData(pVisibleRenderers: ReadonlyArray<MeshRenderComponent>): void {
        // Skip when pipeline is not ready.
        if (!this.mShaderRenderModule || !this.mPipeline || !this.mCameraGroup) {
            return;
        }

        // Reset all instance counts.
        for (const lGroupData of this.mMeshGroups.values()) {
            lGroupData.instanceCount = 0;
        }

        // Skip when no renderers are visible.
        if (pVisibleRenderers.length === 0) {
            return;
        }

        // Group visible renderers by mesh.
        const lMeshGroupMap: Map<Mesh, Array<MeshRenderComponent>> = new Map();
        for (const lRenderer of pVisibleRenderers) {
            const lMesh: Mesh = lRenderer.mesh;
            let lGroup = lMeshGroupMap.get(lMesh);
            if (!lGroup) {
                lGroup = [];
                lMeshGroupMap.set(lMesh, lGroup);
            }
            lGroup.push(lRenderer);
        }

        // Get dependencies.
        const lTransformationSystem: TransformationSystem = this.mDependencyTransformationSystem!;
        const lLightSystem: LightSystem = this.mDependencyLightSystem!;

        // Lazily create lights bind group and buffer.
        if (!this.mLightsGroup) {
            this.mLightsGroup = this.mShaderRenderModule.layout.getGroupLayout('lights').create();
            this.mLightsGroup.data('lightData').set(lLightSystem.gpuBuffer);
            this.mLightCountBuffer = this.mLightsGroup.data('lightCount').createBuffer(1);
        }

        // Update lights data each frame.
        this.mLightsGroup.data('lightData').set(lLightSystem.gpuBuffer);
        this.mLightCountBuffer!.write(new Uint32Array([lLightSystem.activeLightCount]).buffer);

        // Process each mesh group.
        for (const [lMesh, lRenderers] of lMeshGroupMap) {
            // Get or create cached vertex parameters for this mesh.
            if (!this.mVertexParameterCache.has(lMesh)) {
                const lVertexParameters = lMesh.subMeshes.map((lSubMesh) => {
                    const lVertexParameter: VertexParameter = this.mShaderRenderModule!.vertexParameter.create(lSubMesh.indices);
                    lVertexParameter.create('position', lMesh.verticesData);
                    lVertexParameter.create('normal', lMesh.normals);
                    return lVertexParameter;
                });
                this.mVertexParameterCache.set(lMesh, lVertexParameters);
            }

            // Get or create cached mesh group rendering data.
            let lGroupData = this.mMeshGroups.get(lMesh);
            if (!lGroupData) {
                const lObjectBindGroup: BindGroup = this.mShaderRenderModule.layout.getGroupLayout('object').create();
                lObjectBindGroup.data('transformationData').set(lTransformationSystem.gpuBuffer);
                const lComponentIndicesBuffer: GpuBuffer = lObjectBindGroup.data('componentIndices').createBuffer(lRenderers.length);

                const lPipelineData: PipelineData = this.mPipeline.layout.withData((pSetup) => {
                    pSetup.addGroup(lObjectBindGroup);
                    pSetup.addGroup(this.mCameraGroup!);
                    pSetup.addGroup(this.mLightsGroup!);
                });

                lGroupData = {
                    objectBindGroup: lObjectBindGroup,
                    componentIndicesBuffer: lComponentIndicesBuffer,
                    pipelineData: lPipelineData,
                    instanceCount: 0
                };
                this.mMeshGroups.set(lMesh, lGroupData);
            }

            // Update transformation data reference each frame.
            lGroupData.objectBindGroup.data('transformationData').set(lTransformationSystem.gpuBuffer);

            // Build indices array mapping instance id to transformation buffer index.
            const lIndices: Uint32Array = new Uint32Array(lRenderers.length);
            for (let lIndex: number = 0; lIndex < lRenderers.length; lIndex++) {
                const lTransformation: TransformationComponent = lRenderers[lIndex].gameEntity.getComponent(TransformationComponent);
                lIndices[lIndex] = lTransformationSystem.indexOfTransformation(lTransformation);
            }

            // Resize buffer if needed and write indices.
            lGroupData.componentIndicesBuffer.size = lRenderers.length * Uint32Array.BYTES_PER_ELEMENT;
            lGroupData.componentIndicesBuffer.write(lIndices.buffer);

            // Update instance count.
            lGroupData.instanceCount = lRenderers.length;
        }
    }
}
