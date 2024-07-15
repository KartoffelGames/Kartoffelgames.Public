import { InstructionExecuter } from '../../source/base/execution/instruction-executor';
import { GpuDevice } from '../../source/base/gpu/gpu-device';

import { ArrayBufferMemoryLayout } from '../../source/base/memory_layout/buffer/array-buffer-memory-layout';
import { LinearBufferMemoryLayout } from '../../source/base/memory_layout/buffer/linear-buffer-memory-layout';
import { StructBufferMemoryLayout } from '../../source/base/memory_layout/buffer/struct-buffer-memory-layout';
import { SamplerMemoryLayout } from '../../source/base/memory_layout/sampler-memory-layout';
import { TextureMemoryLayout } from '../../source/base/memory_layout/texture-memory-layout';
import { VertexParameter } from '../../source/base/pipeline/parameter/vertex-parameter';
import { RenderTargets } from '../../source/base/pipeline/target/render-targets';
import { TextureGroup } from '../../source/base/pipeline/target/texture-group';
import { VertexFragmentPipeline } from '../../source/base/pipeline/vertex-fragment-pipeline';
import { PrimitiveCullMode } from '../../source/constant/primitive-cullmode';
import { TextureOperation } from '../../source/constant/texture-operation';
import { WebGpuGeneratorFactory } from '../../source/web_gpu/web-gpu-generator-factory';
import { WebGpuShaderInterpreter } from '../../source/web_gpu/web-gpu-shader-interpreter';
import { CubeVertexIndices, CubeVertexNormalData, CubeVertexPositionData, CubeVertexUvData } from './cube/cube';
import shader from './shader.pgsl';
import { AmbientLight } from './something_better/light/ambient-light';
import { Transform, TransformMatrix } from './something_better/transform';
import { PerspectiveProjection } from './something_better/view_projection/projection/perspective-projection';
import { CameraMatrix, ViewProjection } from './something_better/view_projection/view-projection';

const gHeight: number = 10;
const gWidth: number = 10;
const gDepth: number = 10;

(async () => {
    // const lGpu: GpuDevice = await GpuDevice.request(new WebGpuGeneratorFactory('high-performance'), WebGpuShaderInterpreter);

    // const lInterpreter = new PgslInterpreter(lGpu);
    // // eslint-disable-next-line no-console
    // (<any>window).interpreter = lInterpreter;
})();

(async () => {
    const lGpu: GpuDevice = await GpuDevice.request(new WebGpuGeneratorFactory('high-performance'), WebGpuShaderInterpreter);

    // Create and configure render targets.
    const lTextureGroup: TextureGroup = lGpu.textureGroup(640, 640, 2);
    lTextureGroup.addBuffer('color', 'Color');
    lTextureGroup.addBuffer('depth', 'Depth');
    lTextureGroup.addTarget('canvas');

    // Create shader.
    const lShader = lGpu.renderShader(shader, 'vertex_main', 'fragment_main');

    /*
     * Transformation and position group. 
     */
    const lTransformationGroupLayout = lShader.pipelineLayout.getGroupLayout(0);
    const lTransformationGroup = lTransformationGroupLayout.createGroup();

    // Create transformation.
    const lCubeTransform: Transform = new Transform();
    lCubeTransform.setScale(0.1, 0.1, 0.1);
    lTransformationGroup.setData('transformationMatrix', (<ArrayBufferMemoryLayout>lTransformationGroupLayout.getBind('transformationMatrix').layout).create(new Float32Array(lCubeTransform.getMatrix(TransformMatrix.Transformation).dataArray)));

    // Create instance positions.
    const lCubeInstanceTransformationData: Array<number> = new Array<number>();
    for (let lWidthIndex: number = 0; lWidthIndex < gWidth; lWidthIndex++) {
        for (let lHeightIndex: number = 0; lHeightIndex < gHeight; lHeightIndex++) {
            for (let lDepthIndex: number = 0; lDepthIndex < gDepth; lDepthIndex++) {
                lCubeInstanceTransformationData.push(lWidthIndex, lHeightIndex, lDepthIndex, 1);
            }
        }
    }
    lTransformationGroup.setData('transformationMatrix', (<ArrayBufferMemoryLayout>lTransformationGroupLayout.getBind('transformationMatrix').layout).create(new Float32Array(lCubeInstanceTransformationData)));

    /*
     * Camera and world group. 
     */
    const lWorldGroupLayout = lShader.pipelineLayout.getGroupLayout(1);
    const lWorldGroup = lWorldGroupLayout.createGroup();

    // Create camera perspective.
    const lPerspectiveProjection: PerspectiveProjection = new PerspectiveProjection();
    lPerspectiveProjection.aspectRatio = lTextureGroup.width / lTextureGroup.height;
    lPerspectiveProjection.angleOfView = 72;
    lPerspectiveProjection.near = 0.1;
    lPerspectiveProjection.far = 9999999;

    // Create camera.
    const lCamera: ViewProjection = new ViewProjection(lPerspectiveProjection);
    lCamera.transformation.setTranslation(0, 0, -4);
    lWorldGroup.setData('viewProjectionMatrix', (<LinearBufferMemoryLayout>lWorldGroupLayout.getBind('viewProjectionMatrix').layout).create(new Float32Array(lCamera.getMatrix(CameraMatrix.ViewProjection).dataArray)));

    // Create ambient light.
    const lAmbientLight: AmbientLight = new AmbientLight();
    lAmbientLight.setColor(0.1, 0.1, 0.1);
    lWorldGroup.setData('ambientLight', (<StructBufferMemoryLayout>lWorldGroupLayout.getBind('ambientLight').layout).create(new Float32Array(lCamera.getMatrix(CameraMatrix.ViewProjection).dataArray)));

    // Create point lights.
    lWorldGroup.setData('pointLights', (<StructBufferMemoryLayout>lWorldGroupLayout.getBind('pointLights').layout).create(new Float32Array([
        /* Position */1, 1, 1, 1, /* Color */1, 0, 0, 1,/* Range */ 200, 0, 0, 0,
        /* Position */10, 10, 10, 1, /* Color */0, 0, 1, 1,/* Range */ 200, 0, 0, 0
    ])));

    /*
     * User defined group.
     */
    const lUserGroupLayout = lShader.pipelineLayout.getGroupLayout(2);
    const lUserGroup = lUserGroupLayout.createGroup();

    // Setup cube texture.
    const lCubeTexture = await (<TextureMemoryLayout>lUserGroupLayout.getBind('cubeTexture').layout).createImageTexture('/source/cube_texture/cube-texture.png');
    lUserGroup.setData('cubeTexture', lCubeTexture);

    // Setup Sampler.
    const lCubeSampler = (<SamplerMemoryLayout>lUserGroupLayout.getBind('cubeTextureSampler').layout).create();
    lUserGroup.setData('cubeTextureSampler', lCubeSampler);

    // Generate render parameter from parameter layout.
    const lMesh: VertexParameter = lShader.parameterLayout.createData(CubeVertexIndices);
    lMesh.set('vertex.position', CubeVertexPositionData);
    lMesh.set('vertex.uv', CubeVertexUvData); // TODO: Convert to Indexbased parameter.
    lMesh.set('vertex.normal', CubeVertexNormalData); // TODO: Convert to Indexbased parameter.

    // Set render targets.
    const lRenderTargets: RenderTargets = lTextureGroup.create();
    lRenderTargets.addColorBuffer('color', 0xaaaaaa, TextureOperation.Clear, TextureOperation.Keep, 'canvas');
    lRenderTargets.setDepthStencilBuffer('depth', 0xff, TextureOperation.Clear, TextureOperation.Keep);

    // Create pipeline.
    const lPipeline: VertexFragmentPipeline = lShader.createPipeline(lRenderTargets);
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