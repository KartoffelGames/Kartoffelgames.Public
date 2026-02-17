import {
    type BindGroup,
    BindGroupLayout,
    BufferItemFormat,
    BufferItemMultiplier,
    type CanvasTexture,
    ComputeStage,
    type GpuBuffer,
    type GpuExecution,
    type PipelineData,
    PrimitiveCullMode,
    type RenderPass,
    type RenderTargets,
    RenderTargetsInvalidationType,
    type ShaderRenderModule,
    StorageBindingType,
    TextureFormat,
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
import { PerspectiveProjection } from '../../source/something_better/view_projection/projection/perspective-projection.ts';
import { CameraMatrix, ViewProjection } from '../../source/something_better/view_projection/view-projection.ts';
import { GpuSystem } from '../../source/system/gpu-system.ts';
import { TransformationSystem } from '../../source/system/transformation-system.ts';
import shitShaderSource from './shit-system-shader.wgsl';

/**
 * System that renders all mesh components as colored geometry with a hardcoded light source.
 * Manages GPU resources for rendering and tracks component lifecycle through state changes.
 */
export class ShitSystem extends GameSystem {
    private readonly mActiveComponents: Set<MeshRenderComponent>;
    private mCamera: ViewProjection | null;
    private mCameraGroup: BindGroup | null;
    private mDirty: boolean;
    private mExecutor: GpuExecution | null;
    private mMeshes: Array<VertexParameter>;
    private mPipeline: VertexFragmentPipeline | null;
    private mPipelineData: PipelineData | null;
    private mRenderPass: RenderPass | null;
    private mRenderTargets: RenderTargets | null;
    private mShaderRenderModule: ShaderRenderModule | null;

    /**
     * Systems this system depends on.
     */
    public override get dependentSystemTypes(): Array<GameSystemConstructor<GameSystem>> {
        return [TransformationSystem, GpuSystem];
    }


    /**
     * Component types this system handles.
     */
    public override get handledComponentTypes(): Array<GameComponentConstructor> {
        return [MeshRenderComponent, TransformationComponent];
    }

    /**
     * Constructor of the shit system.
     */
    public constructor() {
        super();

        this.mActiveComponents = new Set<MeshRenderComponent>();
        this.mDirty = false;
        this.mCamera = null;
        this.mCameraGroup = null;
        this.mExecutor = null;
        this.mMeshes = [];
        this.mPipeline = null;
        this.mPipelineData = null;
        this.mRenderPass = null;
        this.mRenderTargets = null;
        this.mShaderRenderModule = null;
    }

    /**
     * Initialize GPU resources, shader, pipeline, camera, render pass, and executor.
     */
    protected override async onCreate(): Promise<void> {
        // Get GPU device from dependency.
        const lGpuSystem: GpuSystem = this.getDependency(GpuSystem);
        const lGpu = lGpuSystem.gpu;

        // Create canvas texture from the html canvas element.
        const lCanvasTexture: CanvasTexture = lGpu.canvas(document.getElementById('canvas') as HTMLCanvasElement);

        // Create and configure render targets.
        this.mRenderTargets = lGpu.renderTargets(true).setup((pSetup) => {
            // Add color render target.
            pSetup.addColor('color', 0, true, { r: 0.1, g: 0.1, b: 0.1, a: 1.0 })
                .new(TextureFormat.Bgra8unorm, lCanvasTexture);

            // Add depth texture.
            pSetup.addDepthStencil(true, 1)
                .new(TextureFormat.Depth24plus);
        });

        // Handle canvas resize. THAT SHIT ONLY RESIZES BECAUSE CSS VALUES ARE SET. NEVER!!!! USE THAT IN REAL CODE!!!.
        const lCanvasWrapper: HTMLElement | null = document.querySelector('.canvas-wrapper');
        if (lCanvasWrapper) {
            new ResizeObserver(() => {
                const lNewHeight: number = Math.max(0, lCanvasWrapper.clientHeight - 20);
                const lNewWidth: number = Math.max(lCanvasWrapper.clientWidth - 20, 0);
                this.mRenderTargets!.resize(lNewHeight, lNewWidth);
            }).observe(lCanvasWrapper);
        }

        // Setup camera perspective projection.
        const lPerspective: PerspectiveProjection = new PerspectiveProjection();
        lPerspective.aspectRatio = this.mRenderTargets.width / this.mRenderTargets.height;
        lPerspective.angleOfView = 72;
        lPerspective.near = 0.1;
        lPerspective.far = Number.MAX_SAFE_INTEGER;

        // Update aspect ratio on resize.
        this.mRenderTargets.addInvalidationListener(() => {
            lPerspective.aspectRatio = this.mRenderTargets!.width / this.mRenderTargets!.height;
        }, RenderTargetsInvalidationType.Resize);

        // Create camera with perspective projection.
        this.mCamera = new ViewProjection(lPerspective);
        this.mCamera.transformation.setTranslation(0, 0, -10);

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
                pBindGroupSetup.binding(0, 'transformationData', ComputeStage.Vertex, StorageBindingType.Read)
                    .asBuffer().withArray().withPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Single);

                pBindGroupSetup.binding(1, 'componentIndices', ComputeStage.Vertex, StorageBindingType.Read)
                    .asBuffer().withArray().withPrimitive(BufferItemFormat.Uint32, BufferItemMultiplier.Single);
            });

            // Camera bind group.
            pShaderSetup.group(1, this.mCameraGroup!.layout);
        });

        // Create render module from shader.
        this.mShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Create pipeline.
        this.mPipeline = this.mShaderRenderModule.create(this.mRenderTargets);
        this.mPipeline.primitiveCullMode = PrimitiveCullMode.Front;

        // Create render pass that draws all submeshes for all instances.
        this.mRenderPass = lGpu.renderPass(this.mRenderTargets, (pContext) => {
            if (this.mPipelineData && this.mMeshes.length > 0 && this.mActiveComponents.size > 0) {
                for (const lMesh of this.mMeshes) {
                    pContext.drawDirect(this.mPipeline!, lMesh, this.mPipelineData, this.mActiveComponents.size);
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
     * Updates camera view projection matrix and renders all active transformation components.
     */
    protected override async onFrame(): Promise<void> {
        // Skip rendering when not initialized.
        if (!this.mExecutor || !this.mCamera || !this.mCameraGroup) {
            return;
        }

        // Rebuild instance data when components changed.
        if (this.mDirty) {
            this.rebuildInstanceData();

            // Update camera view projection matrix.
            const lViewProjectionMatrix = this.mCamera.getMatrix(CameraMatrix.ViewProjection);
            this.mCameraGroup.data('viewProjection').asBufferView(Float32Array).write(lViewProjectionMatrix.dataArray);

            this.mDirty = false;
        }

        // Start new GPU frame and execute render pass.
        this.getDependency(GpuSystem).gpu.startNewFrame();
        this.mExecutor.execute();
    }

    /**
     * Process component state changes to track active mesh and transformation components.
     *
     * @param pStateChanges - Map of component types to state change events.
     */
    protected override async onUpdate(pStateChanges: Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>): Promise<void> {
        // Process state changes for MeshRenderComponent.
        const lMeshChanges: ReadonlyArray<GameEnvironmentStateChange> | undefined = pStateChanges.get(MeshRenderComponent);
        if (lMeshChanges) {
            for (const lStateChange of lMeshChanges) {
                const lComponent: MeshRenderComponent = lStateChange.component as MeshRenderComponent;

                switch (lStateChange.type) {
                    case 'add':
                    case 'activate': {
                        this.mActiveComponents.add(lComponent);
                        this.mDirty = true;
                        break;
                    }
                    case 'remove':
                    case 'deactivate': {
                        this.mActiveComponents.delete(lComponent);
                        this.mDirty = true;
                        break;
                    }
                    case 'update': {
                        this.mDirty = true;
                        break;
                    }
                }
            }
        }

        // Process state changes for TransformationComponent to track position updates.
        const lTransformChanges: ReadonlyArray<GameEnvironmentStateChange> | undefined = pStateChanges.get(TransformationComponent);
        if (lTransformChanges) {
            for (const lStateChange of lTransformChanges) {
                if (lStateChange.type === 'update') {
                    this.mDirty = true;
                }
            }
        }
    }

    /**
     * Rebuild instance data from all active mesh render components.
     * Creates GPU vertex parameters for each submesh and builds transformation index array for instanced rendering.
     */
    private rebuildInstanceData(): void {
        // Skip when no components are active or pipeline is not ready.
        if (this.mActiveComponents.size === 0 || !this.mShaderRenderModule || !this.mPipeline || !this.mCameraGroup) {
            this.mPipelineData = null;
            this.mMeshes = [];
            return;
        }

        // Get mesh data from first active mesh render component.
        const lFirstComponent: MeshRenderComponent = this.mActiveComponents.values().next().value!;
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
        const lIndices: Uint32Array = new Uint32Array(this.mActiveComponents.size);
        let lIndex: number = 0;
        for (const lComponent of this.mActiveComponents) {
            const lTransformation: TransformationComponent = lComponent.gameEntity.getComponent(TransformationComponent);
            lIndices[lIndex] = lTransformationSystem.indexOfTransformation(lTransformation);
            lIndex++;
        }

        // Create object bind group with transformation data and component indices.
        const lObjectGroup: BindGroup = this.mShaderRenderModule.layout.getGroupLayout('object').create();
        lObjectGroup.data('transformationData').set(lTransformationSystem.gpuBuffer);

        // For some reason create the buffer again and again.
        const lComponentIndicesBuffer: GpuBuffer = lObjectGroup.data('componentIndices').createBuffer(this.mActiveComponents.size);
        lComponentIndicesBuffer.write(new Uint32Array(lIndices).buffer);

        // Create pipeline data with object and camera groups.
        this.mPipelineData = this.mPipeline.layout.withData((pSetup) => {
            pSetup.addGroup(lObjectGroup);
            pSetup.addGroup(this.mCameraGroup!);
        });
    }
}
