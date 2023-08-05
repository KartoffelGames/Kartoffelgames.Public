import { InstructionExecuter } from '../../source/abstraction_layer/webgpu/execution/instruction-executer';
import { RenderInstruction } from '../../source/abstraction_layer/webgpu/execution/instruction/render-instruction';
import { RenderInstructionSet } from '../../source/abstraction_layer/webgpu/execution/instruction_set/render-instruction-set';
import { RenderParameter } from '../../source/abstraction_layer/webgpu/execution/parameter/render-parameter';
import { AttachmentType } from '../../source/abstraction_layer/webgpu/pass_descriptor/attachment-type.enum';
import { Attachments } from '../../source/abstraction_layer/webgpu/pass_descriptor/attachments';
import { RenderPassDescriptor } from '../../source/abstraction_layer/webgpu/pass_descriptor/render-pass-descriptor';
import { RenderPipeline } from '../../source/abstraction_layer/webgpu/pipeline/render-pipeline';
import { WebGpuShader } from '../../source/abstraction_layer/webgpu/shader/web-gpu-shader';
import { WebGpuTexture } from '../../source/abstraction_layer/webgpu/texture_resource/texture/web-gpu-texture';
import { WebGpuTextureUsage } from '../../source/abstraction_layer/webgpu/texture_resource/texture/web-gpu-texture-usage.enum';
import { WebGpuTextureSampler } from '../../source/abstraction_layer/webgpu/texture_resource/web-gpu-texture-sampler';
import { WebGpuDevice } from '../../source/abstraction_layer/webgpu/web-gpu-device';
import { AmbientLight } from '../../source/something_better/light/ambient-light';
import { Transform, TransformMatrix } from '../../source/something_better/transform';
import { OrthographicProjection } from '../../source/something_better/view_projection/projection/orthographic -projection';
import { PerspectiveProjection } from '../../source/something_better/view_projection/projection/perspective-projection';
import { CameraMatrix, ViewProjection } from '../../source/something_better/view_projection/view-projection';
import { CubeVertexIndices, CubeVertexNormalData, CubeVertexPositionData, CubeVertexUvData } from './cube/cube';
import shader from './shader.wgsl';

const gHeight: number = 10;
const gWidth: number = 10;
const gDepth: number = 10;

(async () => {
    const lColorPicker: HTMLInputElement = <HTMLInputElement>document.querySelector('#color');
    const lFpsCounter: HTMLSpanElement = <HTMLInputElement>document.querySelector('#fpsCounter');

    // Create gpu.
    const lGpu: WebGpuDevice = await WebGpuDevice.create('high-performance');

    // Init canvas.
    const lCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');

    // Init shader.
    const lShader: WebGpuShader = new WebGpuShader(lGpu, shader);

    // Create depth and color attachments.
    const lAttachments: Attachments = new Attachments(lGpu, 4);
    lAttachments.resize(1200, 640);
    lAttachments.addAttachment({
        type: AttachmentType.Color,
        name: 'MultisampleTarget',
        format: lGpu.preferredFormat
    });
    lAttachments.addAttachment({
        canvas: lCanvas,
        type: AttachmentType.Color,
        name: 'Canvas'
    });
    lAttachments.addAttachment({
        type: AttachmentType.Depth,
        name: 'Depth',
        format: 'depth24plus'
    });

    // Setup render pass.
    const lRenderPassDescription: RenderPassDescriptor = new RenderPassDescriptor(lGpu, lAttachments);
    lRenderPassDescription.setDepthAttachment('Depth', 1);
    lRenderPassDescription.setColorAttachment(0, 'MultisampleTarget', { r: 0.5, g: 0.5, b: 0.5, a: 1 }, 'clear', 'store', 'Canvas');

    // Init pipeline.
    const lPipeline: RenderPipeline = new RenderPipeline(lGpu, lShader, lRenderPassDescription);
    lPipeline.primitiveCullMode = 'back';

    // Ambient light buffer.
    const lAmbientLight: AmbientLight = new AmbientLight();
    lAmbientLight.setColor(0.1, 0.1, 0.1);

    const lAmbientLightBuffer = new SimpleBuffer(lGpu, GPUBufferUsage.UNIFORM, new Float32Array(lAmbientLight.data));
    lColorPicker.addEventListener('input', (pEvent) => {
        const lBigint = parseInt((<any>pEvent.target).value.replace('#', ''), 16);
        const lRed = ((lBigint >> 16) & 255) / 255;
        const lGreen = ((lBigint >> 8) & 255) / 255;
        const lBlue = (lBigint & 255) / 255;

        // Set color to ambient light and update buffer.
        lAmbientLight.setColor(lRed, lGreen, lBlue);
        lAmbientLightBuffer.write(async (pBuffer) => { pBuffer.set(lAmbientLight.data); });
    });

    const lPointLightBuffer = new SimpleBuffer(lGpu, GPUBufferUsage.STORAGE, new Float32Array([
        /* Position */1, 1, 1, 1, /* Color */1, 0, 0, 1,/* Range */ 200, 0, 0, 0,
        /* Position */10, 10, 10, 1, /* Color */0, 0, 1, 1,/* Range */ 200, 0, 0, 0
    ]));

    // Transformation.
    const lCubeTransform: Transform = new Transform();
    lCubeTransform.setScale(0.1, 0.1, 0.1);
    const lCubeTransformationBuffer = new RingBuffer(lGpu, GPUBufferUsage.UNIFORM, new Float32Array(lCubeTransform.getMatrix(TransformMatrix.Transformation).dataArray));

    // Create instanced transformation buffer.
    const lCubeInstanceTransformationData: Array<number> = new Array<number>();
    for (let lWidthIndex: number = 0; lWidthIndex < gWidth; lWidthIndex++) {
        for (let lHeightIndex: number = 0; lHeightIndex < gHeight; lHeightIndex++) {
            for (let lDepthIndex: number = 0; lDepthIndex < gDepth; lDepthIndex++) {
                lCubeInstanceTransformationData.push(lWidthIndex, lHeightIndex, lDepthIndex, 1);
            }
        }
    }
    const lCubeInstanceTransformationBuffer = new SimpleBuffer(lGpu, GPUBufferUsage.STORAGE, new Float32Array(lCubeInstanceTransformationData));

    // Transformation.
    const lPerspectiveProjection: PerspectiveProjection = new PerspectiveProjection();
    lPerspectiveProjection.aspectRatio = lAttachments.width / lAttachments.height;
    lPerspectiveProjection.angleOfView = 72;
    lPerspectiveProjection.near = 0.1;
    lPerspectiveProjection.far = 9999999;

    const lOrtoProjection: OrthographicProjection = new OrthographicProjection();
    lOrtoProjection.aspectRatio = lAttachments.width / lAttachments.height;
    lOrtoProjection.width = 2;
    lOrtoProjection.near = 0;
    lOrtoProjection.far = 999999;

    const lCamera: ViewProjection = new ViewProjection(lPerspectiveProjection);
    lCamera.transformation.setTranslation(0, 0, -4);

    // Transformation buffer.
    const lCameraBuffer = new SimpleBuffer(lGpu, GPUBufferUsage.UNIFORM, new Float32Array(lCamera.getMatrix(CameraMatrix.ViewProjection).dataArray));

    // Setup Texture.
    const lCubeTexture: WebGpuTexture = new WebGpuTexture(lGpu, lGpu.preferredFormat, WebGpuTextureUsage.TextureBinding | WebGpuTextureUsage.RenderAttachment | WebGpuTextureUsage.CopyDestination);
    lCubeTexture.label = 'Cube Texture';
    await lCubeTexture.load(['/source/cube_texture/cube-texture.png']);

    // Setup Sampler.
    const lCubeSampler: WebGpuTextureSampler = new WebGpuTextureSampler(lGpu);

    // Create mesh.
    const lMesh = new RenderParameter(lGpu, CubeVertexIndices);
    lMesh.setVertexData('vertex.position', CubeVertexPositionData, 4);
    lMesh.setIndexData('vertex.uv', CubeVertexUvData, 2);
    lMesh.setIndexData('vertex.normal', CubeVertexNormalData, 4);

    // Setup renderer.
    const lInstructionExecutioner: InstructionExecuter = new InstructionExecuter(lGpu);

    // Setup instruction set.
    const lInstructionSet: RenderInstructionSet = new RenderInstructionSet(lRenderPassDescription);
    lInstructionExecutioner.addInstructionSet(lInstructionSet);

    // Create camera bind group.
    const lWorldValueBindGroup = lShader.bindGroups.getGroup(1).createBindGroup();
    lWorldValueBindGroup.setData('viewProjectionMatrix', lCameraBuffer);
    lWorldValueBindGroup.setData('ambientLight', lAmbientLightBuffer);
    lWorldValueBindGroup.setData('pointLights', lPointLightBuffer);

    const lUserInputBindGroup = lShader.bindGroups.getGroup(2).createBindGroup();
    lUserInputBindGroup.setData('cubetextureSampler', lCubeSampler);
    lUserInputBindGroup.setData('cubeTexture', lCubeTexture.view());

    const lObjectBindGroup = lShader.bindGroups.getGroup(0).createBindGroup();
    lObjectBindGroup.setData('transformationMatrix', lCubeTransformationBuffer);
    lObjectBindGroup.setData('instancePositions', lCubeInstanceTransformationBuffer);

    const lObjectRenderInstruction: RenderInstruction = new RenderInstruction(lPipeline, lMesh, gWidth * gHeight * gDepth);
    lObjectRenderInstruction.setBindGroup(0, lObjectBindGroup);
    lObjectRenderInstruction.setBindGroup(1, lWorldValueBindGroup);
    lObjectRenderInstruction.setBindGroup(2, lUserInputBindGroup);

    lInstructionSet.addInstruction(lObjectRenderInstruction);

    let lLastTime: number = 0;
    const lRender = (pTime: number) => {
        // Generate encoder and add render commands.
        lInstructionExecutioner.execute();

        const lFps: number = 1000 / (pTime - lLastTime);
        lFpsCounter.textContent = lFps.toString();
        lLastTime = pTime;

        // Refresh canvas
        requestAnimationFrame(lRender);
    };
    requestAnimationFrame(lRender);
})();