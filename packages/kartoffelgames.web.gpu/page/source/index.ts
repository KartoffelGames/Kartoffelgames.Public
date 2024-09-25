import { BindGroupLayout } from '../../source/base/binding/bind-group-layout';
import { GpuDevice } from '../../source/base/gpu/gpu-device';
import { PrimitiveBufferFormat } from '../../source/base/memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../source/base/memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { VertexParameter } from '../../source/base/pipeline/parameter/vertex-parameter';
import { RenderTargets } from '../../source/base/pipeline/target/render-targets';
import { VertexFragmentPipeline } from '../../source/base/pipeline/vertex-fragment-pipeline';
import { AccessMode } from '../../source/constant/access-mode.enum';
import { BufferUsage } from '../../source/constant/buffer-usage.enum';
import { ComputeStage } from '../../source/constant/compute-stage.enum';
import { PrimitiveCullMode } from '../../source/constant/primitive-cullmode.enum';
import { SamplerType } from '../../source/constant/sampler-type.enum';
import { TextureBindType } from '../../source/constant/texture-bind-type.enum';
import { TextureDimension } from '../../source/constant/texture-dimension.enum';
import { TextureFormat } from '../../source/constant/texture-format.enum';
import { CubeVertexIndices, CubeVertexNormalData, CubeVertexPositionData, CubeVertexUvData } from './cube/cube';
import shader from './shader.wgsl';
import { AmbientLight } from './something_better/light/ambient-light';
import { Transform, TransformMatrix } from './something_better/transform';
import { PerspectiveProjection } from './something_better/view_projection/projection/perspective-projection';
import { CameraMatrix, ViewProjection } from './something_better/view_projection/view-projection';

const gHeight: number = 10;
const gWidth: number = 10;
const gDepth: number = 10;

(async () => {
    const lGpu: GpuDevice = await GpuDevice.request('high-performance');

    // Create and configure render targets.
    const lRenderTargets: RenderTargets = lGpu.renderTargets().setup((pSetup) => {
        // Add "color" target and init new texture.
        pSetup.addColor('color', 0, true, { r: 0, g: 0, b: 0, a: 0 })
            .new(TextureFormat.Rgba8unorm);

        // Add depth texture and init new texture.    
        pSetup.addDepthStencil(true, 0xff)
            .new(TextureFormat.Depth24plus);
    }).resize(640, 640, 2);

    // Create shader.
    const lShader = lGpu.shader(shader).setup((pShaderSetup) => {
        pShaderSetup.vertexEntryPoint('vertex_main')
            .addParameter('position', 0, PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4)
            .addParameter('uv', 1, PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector2)
            .addParameter('normal', 2, PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);

        pShaderSetup.fragmentEntryPoint('fragment_main')
            .addRenderTarget('main', 0, PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);

        // Object bind group.
        pShaderSetup.group(0, new BindGroupLayout(lGpu, 'object').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', BufferUsage.Uniform, ComputeStage.Vertex, AccessMode.Read)
                .withPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);

            pBindGroupSetup.binding(1, 'instancePositions', BufferUsage.Storage, ComputeStage.Vertex, AccessMode.Read)
                .withArray().withPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);
        }));

        // World bind group.
        pShaderSetup.group(1, new BindGroupLayout(lGpu, 'world').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'viewProjectionMatrix', BufferUsage.Uniform, ComputeStage.Vertex, AccessMode.Read)
                .withPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);

            pBindGroupSetup.binding(1, 'ambientLight', BufferUsage.Uniform, ComputeStage.Fragment, AccessMode.Read)
                .withStruct((pStruct) => {
                    pStruct.property('color').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);
                });

            pBindGroupSetup.binding(2, 'pointLights', BufferUsage.Storage, ComputeStage.Fragment, AccessMode.Read)
                .withArray().withStruct((pStruct) => {
                    pStruct.property('position').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);
                    pStruct.property('color').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);
                    pStruct.property('range').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Single);
                });
        }));

        // User bind group
        pShaderSetup.group(2, new BindGroupLayout(lGpu, 'user').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'cubeTextureSampler', BufferUsage.Uniform, ComputeStage.Fragment, AccessMode.Read)
                .withSampler(SamplerType.Filter);

            pBindGroupSetup.binding(1, 'cubeTexture', BufferUsage.Uniform, ComputeStage.Fragment, AccessMode.Read)
                .withTexture(TextureDimension.TwoDimension, TextureFormat.Rgba8snorm, TextureBindType.Image, false);
        }));
    });


    // Create render module from shader.
    const lRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

    /*
     * Transformation and position group. 
     */
    const lTransformationGroup = lRenderModule.layout.getGroupLayout('object').create();

    // Create transformation.
    const lCubeTransform: Transform = new Transform();
    lCubeTransform.setScale(0.1, 0.1, 0.1);
    lTransformationGroup.data('transformationMatrix').createBuffer(new Float32Array(lCubeTransform.getMatrix(TransformMatrix.Transformation).dataArray));

    // Create instance positions.
    const lCubeInstanceTransformationData: Array<number> = new Array<number>();
    for (let lWidthIndex: number = 0; lWidthIndex < gWidth; lWidthIndex++) {
        for (let lHeightIndex: number = 0; lHeightIndex < gHeight; lHeightIndex++) {
            for (let lDepthIndex: number = 0; lDepthIndex < gDepth; lDepthIndex++) {
                lCubeInstanceTransformationData.push(lWidthIndex, lHeightIndex, lDepthIndex, 1);
            }
        }
    }
    lTransformationGroup.data('transformationMatrix').createBuffer(new Float32Array(lCubeInstanceTransformationData));

    /*
     * Camera and world group. 
     */
    const lWorldGroup = lRenderModule.layout.getGroupLayout('world').create();

    // Create camera perspective.
    const lPerspectiveProjection: PerspectiveProjection = new PerspectiveProjection();
    lPerspectiveProjection.aspectRatio = lRenderTargets.width / lRenderTargets.height;
    lPerspectiveProjection.angleOfView = 72;
    lPerspectiveProjection.near = 0.1;
    lPerspectiveProjection.far = 9999999;

    // Create camera.
    const lCamera: ViewProjection = new ViewProjection(lPerspectiveProjection);
    lCamera.transformation.setTranslation(0, 0, -4);
    lWorldGroup.data('viewProjectionMatrix').createBuffer(new Float32Array(lCamera.getMatrix(CameraMatrix.ViewProjection).dataArray));

    // Create ambient light.
    const lAmbientLight: AmbientLight = new AmbientLight();
    lAmbientLight.setColor(0.1, 0.1, 0.1);
    lWorldGroup.data('ambientLight').createBuffer(new Float32Array(lCamera.getMatrix(CameraMatrix.ViewProjection).dataArray));

    // Create point lights.
    lWorldGroup.data('pointLights').createBuffer(new Float32Array([
        /* Position */1, 1, 1, 1, /* Color */1, 0, 0, 1,/* Range */ 200, 0, 0, 0,
        /* Position */10, 10, 10, 1, /* Color */0, 0, 1, 1,/* Range */ 200, 0, 0, 0
    ]));

    /*
     * User defined group.
     */
    const lUserGroup = lRenderModule.layout.getGroupLayout('user').create();

    // Setup cube texture.
    await lUserGroup.data('cubeTexture').createImage('/source/cube_texture/cube-texture.png');

    // Setup Sampler.
    lUserGroup.data('cubeTextureSampler').createSampler();

    // Generate render parameter from parameter layout.
    const lMesh: VertexParameter = lRenderModule.parameterLayout.createData(CubeVertexIndices);
    lMesh.set('vertex.position', CubeVertexPositionData);
    lMesh.set('vertex.uv', CubeVertexUvData); // TODO: Convert to Indexbased parameter.
    lMesh.set('vertex.normal', CubeVertexNormalData); // TODO: Convert to Indexbased parameter.

    // Create pipeline.
    const lPipeline: VertexFragmentPipeline = lRenderModule.createPipeline(lRenderTargets);
    lPipeline.primitiveCullMode = PrimitiveCullMode.Back;

    // Create executor.
    const lInstructionExecutor: InstructionExecuter = lGpu.instructionExecutor();

    // Create instruction.
    const lRenderInstruction = lInstructionExecutor.createVertexFragmentInstruction(lRenderTargets);
    lRenderInstruction.addStep(lPipeline, lMesh, {
        0: lTransformationGroup,
        1: lWorldGroup,
        2: lUserGroup
    });

    // TODO: Instruction set execution.
    let lLastTime: number = 0;
    const lRender = (pTime: number) => {
        // Start new frame.
        lGpu.startNewFrame();

        // Generate encoder and add render commands.
        lInstructionExecutor.execute();

        const lFps: number = 1000 / (pTime - lLastTime);
        (<any>window).currentFps = lFps;
        lLastTime = pTime;

        // Refresh canvas
        requestAnimationFrame(lRender);
    };
    requestAnimationFrame(lRender);
});