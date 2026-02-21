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
import { RenderTargetSystem, type RenderTargetData } from '../../source/system/render-target-system.ts';
import { TransformationSystem } from '../../source/system/transformation-system.ts';
import shitShaderSource from './shit-system-shader.wgsl';

/**
 * System that renders all mesh components as colored geometry with dynamic lighting from LightSystem.
 * Uses RenderTargetSystem for render targets, camera assignment, and frustum-culled visible mesh list.
 */
export class ShitSystem extends GameSystem {
    private mCameraGroup: BindGroup | null;
    private mExecutor: GpuExecution | null;
    private mMeshes: Array<VertexParameter>;
    private mPipeline: VertexFragmentPipeline | null;
    private mPipelineData: PipelineData | null;
    private mRenderPass: RenderPass | null;
    private mShaderRenderModule: ShaderRenderModule | null;
    private mVisibleCount: number;

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
        this.mMeshes = [];
        this.mPipeline = null;
        this.mPipelineData = null;
        this.mRenderPass = null;
        this.mShaderRenderModule = null;
        this.mVisibleCount = 0;
    }

    /**
     * Initialize GPU resources, shader, pipeline, render pass, and executor.
     * Uses the core render targets from RenderTargetSystem.
     */
    protected override async onCreate(): Promise<void> {
        // Get GPU device from dependency.
        const lGpuSystem: GpuSystem = this.getDependency(GpuSystem);
        const lGpu = lGpuSystem.gpu;

        // Get core render targets from the render target system.
        const lRenderTargetSystem: RenderTargetSystem = this.getDependency(RenderTargetSystem);
        const lCoreData: RenderTargetData = lRenderTargetSystem.coreRenderTargetData;

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
            if (this.mPipelineData && this.mMeshes.length > 0 && this.mVisibleCount > 0) {
                for (const lMesh of this.mMeshes) {
                    pContext.drawDirect(this.mPipeline!, lMesh, this.mPipelineData, this.mVisibleCount);
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
        const lRenderTargetSystem: RenderTargetSystem = this.getDependency(RenderTargetSystem);
        const lCoreData: RenderTargetData = lRenderTargetSystem.coreRenderTargetData;

        // Skip rendering when no camera is assigned.
        if (!lCoreData.camera || !lCoreData.cameraTransformation) {
            return;
        }

        // Rebuild instance data from the frustum-culled visible list.
        this.rebuildInstanceData(lCoreData.visibleMeshRenderers);

        // Update camera view projection matrix every frame.
        // Invert the camera's transformation to get the view matrix, then multiply with projection.
        const lViewMatrix = lCoreData.cameraTransformation.matrix.inverse();
        const lViewProjectionMatrix = lCoreData.camera.matrix.mult(lViewMatrix);
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
     * Creates GPU vertex parameters for each submesh and builds transformation index array for instanced rendering.
     *
     * @param pVisibleRenderers - Frustum-culled list of visible mesh render components.
     */
    private rebuildInstanceData(pVisibleRenderers: Array<MeshRenderComponent>): void {
        this.mVisibleCount = pVisibleRenderers.length;

        // Skip when no renderers are visible or pipeline is not ready.
        if (pVisibleRenderers.length === 0 || !this.mShaderRenderModule || !this.mPipeline || !this.mCameraGroup) {
            this.mPipelineData = null;
            this.mMeshes = [];
            this.mVisibleCount = 0;
            return;
        }

        // Get mesh data from first visible mesh render component.
        const lFirstComponent: MeshRenderComponent = pVisibleRenderers[0];
        const lMesh: Mesh = lFirstComponent.mesh;

        // Create GPU vertex parameters for each submesh.
        this.mMeshes = lMesh.subMeshes.map((lSubMesh) => {
            const lVertexParameter: VertexParameter = this.mShaderRenderModule!.vertexParameter.create(lSubMesh.indices);
            lVertexParameter.create('position', lMesh.vertices);
            lVertexParameter.create('normal', lMesh.normals);
            return lVertexParameter;
        });

        // Get transformation system for buffer and index lookups.
        const lTransformationSystem: TransformationSystem = this.getDependency(TransformationSystem);

        // Build indices array mapping instance id to transformation buffer index.
        const lIndices: Uint32Array = new Uint32Array(pVisibleRenderers.length);
        for (let lIndex: number = 0; lIndex < pVisibleRenderers.length; lIndex++) {
            const lTransformation: TransformationComponent = pVisibleRenderers[lIndex].gameEntity.getComponent(TransformationComponent);
            lIndices[lIndex] = lTransformationSystem.indexOfTransformation(lTransformation);
        }

        // Create object bind group with transformation data and component indices.
        const lObjectGroup: BindGroup = this.mShaderRenderModule.layout.getGroupLayout('object').create();
        lObjectGroup.data('transformationData').set(lTransformationSystem.gpuBuffer);

        // For some reason create the buffer again and again.
        const lComponentIndicesBuffer: GpuBuffer = lObjectGroup.data('componentIndices').createBuffer(pVisibleRenderers.length);
        lComponentIndicesBuffer.write(new Uint32Array(lIndices).buffer);

        // Create lights bind group with light data buffer and light count uniform.
        const lLightSystem: LightSystem = this.getDependency(LightSystem);
        const lLightGroup: BindGroup = this.mShaderRenderModule.layout.getGroupLayout('lights').create();
        lLightGroup.data('lightData').set(lLightSystem.gpuBuffer);
        const lLightCountBuffer: GpuBuffer = lLightGroup.data('lightCount').createBuffer(1);
        lLightCountBuffer.write(new Uint32Array([lLightSystem.activeLightCount]).buffer);

        // Create pipeline data with object, camera, and lights groups.
        this.mPipelineData = this.mPipeline.layout.withData((pSetup) => {
            pSetup.addGroup(lObjectGroup);
            pSetup.addGroup(this.mCameraGroup!);
            pSetup.addGroup(lLightGroup);
        });
    }
}
