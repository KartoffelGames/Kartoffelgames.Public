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
    type ShaderRenderModule,
    StorageBindingType,
    type VertexFragmentPipeline,
    type VertexParameter,
    VertexParameterStepMode
} from '@kartoffelgames/web-gpu';
import { MeshRenderComponent } from '../../source/component/mesh-render-component.ts';
import { TransformationComponent } from '../../source/component/transformation-component.ts';
import type { Mesh } from '../../source/component_item/mesh/mesh.ts';
import type { GameComponentConstructor } from '../../source/core/component/game-component.ts';
import type { GameEnvironmentStateChange } from '../../source/core/environment/game-environment-transmittion.ts';
import { GameSystem, type GameSystemConstructor } from '../../source/core/game-system.ts';
import { GpuSystem } from '../../source/system/gpu-system.ts';
import { LightSystem } from '../../source/system/light-system.ts';
import { RenderTargetSystem, type RenderTargetSystemRenderTargetContextData } from '../../source/system/render-target-system.ts';
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
 * Uses RenderTargetSystem for render targets, camera assignment, and frustum-culled visible mesh list.
 */
export class ShitSystem extends GameSystem {
    private mCameraGroup: BindGroup | null;
    private mExecutor: GpuExecution | null;
    private mLightCountBuffer: GpuBuffer | null;
    private mLightsGroup: BindGroup | null;
    private mMeshGroups: Map<Mesh, MeshGroupData>;
    private mPipeline: VertexFragmentPipeline | null;
    private mRenderPass: RenderPass | null;
    private mShaderRenderModule: ShaderRenderModule | null;
    private mVertexParamCache: Map<Mesh, Array<VertexParameter>>;
    private mDependencyTransformationSystem: TransformationSystem | null;
    private mDependencyGpuSystem: GpuSystem | null;
    private mDependencyLightSystem: LightSystem | null;
    private mDependencyRenderTargetSystem: RenderTargetSystem | null;

    /**
     * Systems this system depends on.
     */
    public override get dependentSystemTypes(): Array<GameSystemConstructor<GameSystem>> {
        return [TransformationSystem, GpuSystem, LightSystem, RenderTargetSystem];
    }

    /**
     * Component types this system handles.
     */
    public override get handledComponentTypes(): Array<GameComponentConstructor> {
        return [];
    }

    /**
     * Constructor of the shit system.
     */
    public constructor() {
        super();

        this.mCameraGroup = null;
        this.mExecutor = null;
        this.mLightCountBuffer = null;
        this.mLightsGroup = null;
        this.mMeshGroups = new Map();
        this.mPipeline = null;
        this.mRenderPass = null;
        this.mShaderRenderModule = null;
        this.mVertexParamCache = new Map();

        // Null any dependecy.
        this.mDependencyTransformationSystem = null;
        this.mDependencyGpuSystem = null;
        this.mDependencyLightSystem = null;
        this.mDependencyRenderTargetSystem = null;
    }

    /**
     * Initialize GPU resources, shader, pipeline, render pass, and executor.
     * Uses the core render targets from RenderTargetSystem.
     */
    protected override async onCreate(): Promise<void> {
        // Read dependencies.
        this.mDependencyTransformationSystem = this.getDependency(TransformationSystem);
        this.mDependencyGpuSystem = this.getDependency(GpuSystem);
        this.mDependencyLightSystem = this.getDependency(LightSystem);
        this.mDependencyRenderTargetSystem = this.getDependency(RenderTargetSystem);

        // Get GPU device from dependency.
        const lGpu = this.mDependencyGpuSystem!.gpu;

        // Get core render targets from the render target system.
        const lCoreData: RenderTargetSystemRenderTargetContextData = this.mDependencyRenderTargetSystem!.coreRenderTargetData;

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

        // Create pipeline using the core render targets for compatibility.
        this.mPipeline = this.mShaderRenderModule.create(lCoreData.renderTargets);
        this.mPipeline.primitiveCullMode = PrimitiveCullMode.Front;

        // Create render pass that draws all submeshes for all visible instances.
        this.mRenderPass = lGpu.renderPass(lCoreData.renderTargets, (pContext) => {
            for (const [lMesh, lGroupData] of this.mMeshGroups) {
                if (lGroupData.instanceCount > 0) {
                    const lVertexParams = this.mVertexParamCache.get(lMesh)!;
                    for (const lVertexParam of lVertexParams) {
                        pContext.drawDirect(this.mPipeline!, lVertexParam, lGroupData.pipelineData, lGroupData.instanceCount);
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
     * Uses the frustum-culled visible mesh list from RenderTargetSystem.
     */
    protected override async onFrame(): Promise<void> {
        // Skip rendering when not initialized.
        if (!this.mExecutor || !this.mCameraGroup || !this.mShaderRenderModule || !this.mPipeline) {
            return;
        }

        // Get camera and visible mesh list from the core render target.
        const lCoreData: RenderTargetSystemRenderTargetContextData = this.mDependencyRenderTargetSystem!.coreRenderTargetData;

        // Skip rendering when no camera is assigned.
        if (!lCoreData.camera || !lCoreData.cameraTransformation) {
            return;
        }

        // Rebuild instance data from the frustum-culled visible list.
        this.rebuildInstanceData(lCoreData.visibleMeshRenderers);

        // Update camera view projection matrix every frame.
        // Use the world matrix from TransformationSystem and invert it to get the view matrix.
        const lWorldMatrix = this.mDependencyTransformationSystem!.worldMatrixOfTransformation(lCoreData.cameraTransformation);
        const lViewProjectionMatrix = lCoreData.camera.matrix.mult(lWorldMatrix.inverse());
        this.mCameraGroup.data('viewProjection').asBufferView(Float32Array).write(lViewProjectionMatrix.dataArray);

        // Start new GPU frame and execute render pass.
        this.mExecutor.execute();
    }

    /**
     * Process component state changes.
     * All component tracking is handled by RenderTargetSystem; this system rebuilds per frame from the visible list.
     */
    protected override async onUpdate(_pStateChanges: Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>): Promise<void> {
        // No component event processing needed.
        // Camera and mesh renderer tracking is handled by RenderTargetSystem.
        // Instance data is rebuilt every frame from the frustum-culled visible list.
    }

    /**
     * Rebuild instance data from the visible mesh render components.
     * Groups renderers by mesh, caches GPU resources per mesh group, and reuses buffers.
     *
     * @param pVisibleRenderers - Frustum-culled list of visible mesh render components.
     */
    private rebuildInstanceData(pVisibleRenderers: Array<MeshRenderComponent>): void {
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
            if (!this.mVertexParamCache.has(lMesh)) {
                const lVertexParams = lMesh.subMeshes.map((lSubMesh) => {
                    const lVertexParameter: VertexParameter = this.mShaderRenderModule!.vertexParameter.create(lSubMesh.indices);
                    lVertexParameter.create('position', lMesh.verticesData);
                    lVertexParameter.create('normal', lMesh.normals);
                    return lVertexParameter;
                });
                this.mVertexParamCache.set(lMesh, lVertexParams);
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
