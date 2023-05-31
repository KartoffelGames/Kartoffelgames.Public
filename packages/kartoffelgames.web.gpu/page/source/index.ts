import { ViewProjection, CameraMatrix } from '../../source/something_better/view_projection/view-projection';
import { OrthographicProjection } from '../../source/something_better/view_projection/projection/orthographic -projection';
import { PerspectiveProjection } from '../../source/something_better/view_projection/projection/perspective-projection';
import { Transform, TransformMatrix } from '../../source/something_better/transform';
import { AttachmentType } from '../../source/abstraction_layer/webgpu/pass_descriptor/attachment-type.enum';
import { Attachments } from '../../source/abstraction_layer/webgpu/pass_descriptor/attachments';
import { RenderParameter } from '../../source/abstraction_layer/webgpu/execution/parameter/render-parameter';
import { InstructionExecuter } from '../../source/abstraction_layer/webgpu/execution/instruction-executer';
import { RenderInstruction } from '../../source/abstraction_layer/webgpu/execution/instruction/render-instruction';
import { WebGpuDevice } from '../../source/abstraction_layer/webgpu/web-gpu-device';
import { RenderPipeline } from '../../source/abstraction_layer/webgpu/pipeline/render-pipeline';
import { SimpleBuffer } from '../../source/abstraction_layer/webgpu/buffer/simple-buffer';
import { WebGpuShader } from '../../source/abstraction_layer/webgpu/shader/web-gpu-shader';
import shader from './shader.wgsl';
import { RenderPassDescriptor } from '../../source/abstraction_layer/webgpu/pass_descriptor/render-pass-descriptor';
import { RenderInstructionSet } from '../../source/abstraction_layer/webgpu/execution/instruction_set/render-instruction-set';
import { RingBuffer } from '../../source/abstraction_layer/webgpu/buffer/ring-buffer';
import { WebGpuTexture } from '../../source/abstraction_layer/webgpu/texture_resource/texture/web-gpu-texture';
import { WebGpuTextureUsage } from '../../source/abstraction_layer/webgpu/texture_resource/texture/web-gpu-texture-usage.enum';
import { WebGpuTextureSampler } from '../../source/abstraction_layer/webgpu/texture_resource/web-gpu-texture-sampler';
import { BaseInputDevice, DeviceConfiguration, InputConfiguration, InputDevices, KeyboardButton, MouseButton, MouseKeyboardConnector } from '@kartoffelgames/web.game-input';
import { Dictionary } from '@kartoffelgames/core.data';
import { AmbientLight } from '../../source/something_better/light/ambient-light';

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

    // Transformation buffer.
    const lUpdaterFunctions: Array<() => void> = new Array<() => void>();
    const lRegisterObjectHandler = (pId: string, pSet: (pTransform: Transform, pData: number) => void, pGet: (pTransform: Transform) => number) => {
        const lSlider: HTMLInputElement = <HTMLInputElement>document.getElementById(pId);
        const lInput: HTMLInputElement = <HTMLInputElement>document.getElementById(pId + 'Display');

        const lUpdater = () => {
            lInput.value = <any>pGet(lCubeTransform);
        };
        lUpdaterFunctions.push(lUpdater);
        lUpdater();

        let lCurrentData: number = 0;

        const lSetData = (pStringData: string) => {
            const lNumberData: number = parseFloat(pStringData) || 1;
            lCurrentData += lNumberData;

            pSet(lCubeTransform, lCurrentData);

            // Reset slider.
            lSlider.value = <any>0;

            // Set real data.
            for (const lUpdater of lUpdaterFunctions) {
                lUpdater();
            }

            // Update transformation buffer.
            lCubeTransformationBuffer.write(async (pBuffer) => { pBuffer.set(lCubeTransform.getMatrix(TransformMatrix.Transformation).dataArray); });
        };

        lSlider.addEventListener('input', (pEvent) => { lSetData((<any>pEvent.target).value); });
        lInput.addEventListener('input', (pEvent) => { lSetData((<any>pEvent.target).value); });
    };

    // Scale handler.
    lRegisterObjectHandler('scaleWidth', (pTransform: Transform, pData) => { pTransform.setScale(pData, null, null); }, (pTransform: Transform) => { return pTransform.scaleWidth; });
    lRegisterObjectHandler('scaleHeight', (pTransform: Transform, pData) => { pTransform.setScale(null, pData, null); }, (pTransform: Transform) => { return pTransform.scaleHeight; });
    lRegisterObjectHandler('scaleDepth', (pTransform: Transform, pData) => { pTransform.setScale(null, null, pData); }, (pTransform: Transform) => { return pTransform.scaleDepth; });

    // Translate.
    lRegisterObjectHandler('translateX', (pTransform: Transform, pData) => { pTransform.setTranslation(pData, null, null); }, (pTransform: Transform) => { return pTransform.translationX; });
    lRegisterObjectHandler('translateY', (pTransform: Transform, pData) => { pTransform.setTranslation(null, pData, null); }, (pTransform: Transform) => { return pTransform.translationY; });
    lRegisterObjectHandler('translateZ', (pTransform: Transform, pData) => { pTransform.setTranslation(null, null, pData); }, (pTransform: Transform) => { return pTransform.translationZ; });

    // Rotate.
    lRegisterObjectHandler('rotatePitch', (pTransform: Transform, pData) => { pTransform.setRotation(pData, null, null); }, (pTransform: Transform) => { return pTransform.rotationPitch; });
    lRegisterObjectHandler('rotateYaw', (pTransform: Transform, pData) => { pTransform.setRotation(null, pData, null); }, (pTransform: Transform) => { return pTransform.rotationYaw; });
    lRegisterObjectHandler('rotateRoll', (pTransform: Transform, pData) => { pTransform.setRotation(null, null, pData); }, (pTransform: Transform) => { return pTransform.rotationRoll; });

    // Translate.
    lRegisterObjectHandler('pivotX', (pTransform: Transform, pData) => { pTransform.pivotX = pData; }, (pTransform: Transform) => { return pTransform.pivotX; });
    lRegisterObjectHandler('pivotY', (pTransform: Transform, pData) => { pTransform.pivotY = pData; }, (pTransform: Transform) => { return pTransform.pivotY; });
    lRegisterObjectHandler('pivotZ', (pTransform: Transform, pData) => { pTransform.pivotZ = pData; }, (pTransform: Transform) => { return pTransform.pivotZ; });

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
    const lRegisterCameraHandler = (pId: string, pSet: (pData: number) => void, pGet: () => number) => {
        const lSlider: HTMLInputElement = <HTMLInputElement>document.getElementById(pId);
        const lInput: HTMLInputElement = <HTMLInputElement>document.getElementById(pId + 'Display');

        const lUpdater = () => {
            lInput.value = <any>pGet();
        };
        lUpdaterFunctions.push(lUpdater);
        lUpdater();

        const lSetData = (pData: any) => {
            pSet(parseFloat(pData) || 1);

            // Reset slider.
            lSlider.value = <any>0;

            // Set real data.
            for (const lUpdater of lUpdaterFunctions) {
                lUpdater();
            }

            // Update transformation buffer.
            lCameraBuffer.write(async (pBuffer) => { pBuffer.set(lCamera.getMatrix(CameraMatrix.ViewProjection).dataArray); });
        };

        lSlider.addEventListener('input', (pEvent) => { lSetData((<any>pEvent.target).value); });
        lInput.addEventListener('input', (pEvent) => { lSetData((<any>pEvent.target).value); });
    };
    // Translate.
    lRegisterCameraHandler('cameraPivotX', (pData) => { lCamera.transformation.pivotX = pData; }, () => { return lCamera.transformation.pivotX; });
    lRegisterCameraHandler('cameraPivotY', (pData) => { lCamera.transformation.pivotY = pData; }, () => { return lCamera.transformation.pivotY; });
    lRegisterCameraHandler('cameraPivotZ', (pData) => { lCamera.transformation.pivotZ = pData; }, () => { return lCamera.transformation.pivotZ; });

    // Camera.
    lRegisterCameraHandler('cameraNear', (pData) => { lPerspectiveProjection.near = pData; }, () => { return lPerspectiveProjection.near; });
    lRegisterCameraHandler('cameraFar', (pData) => { lPerspectiveProjection.far = pData; }, () => { return lPerspectiveProjection.far; });
    lRegisterCameraHandler('cameraAngleOfView', (pData) => { lPerspectiveProjection.angleOfView = pData; }, () => { return lPerspectiveProjection.angleOfView; });

    // Register keyboard mouse movements.
    const lDefaultConfiguaration: DeviceConfiguration = new DeviceConfiguration();
    lDefaultConfiguaration.addAction('Forward', [KeyboardButton.KeyW]);
    lDefaultConfiguaration.addAction('Back', [KeyboardButton.KeyS]);
    lDefaultConfiguaration.addAction('Left', [KeyboardButton.KeyA]);
    lDefaultConfiguaration.addAction('Right', [KeyboardButton.KeyD]);
    lDefaultConfiguaration.addAction('Up', [KeyboardButton.ShiftLeft]);
    lDefaultConfiguaration.addAction('Down', [KeyboardButton.ControlLeft]);
    lDefaultConfiguaration.addAction('RotateLeft', [KeyboardButton.KeyQ]);
    lDefaultConfiguaration.addAction('RotateRight', [KeyboardButton.KeyE]);
    lDefaultConfiguaration.addAction('Yaw', [MouseButton.Xaxis]);
    lDefaultConfiguaration.addAction('Pitch', [MouseButton.Yaxis]);
    lDefaultConfiguaration.triggerTolerance = 0.2;
    const lInputConfiguration: InputConfiguration = new InputConfiguration(lDefaultConfiguaration);
    const lInputDevices: InputDevices = new InputDevices(lInputConfiguration);
    lInputDevices.registerConnector(new MouseKeyboardConnector());

    const lCurrentActionValue: Dictionary<string, number> = new Dictionary<string, number>();
    const lKeyboard: BaseInputDevice = lInputDevices.devices[0];
    lKeyboard.addEventListener('actionstatechange', (pEvent) => {
        lCurrentActionValue.set(pEvent.action, pEvent.state);
    });
    window.setInterval(() => {
        const lSpeed = 1;

        // Z Axis
        if (lCurrentActionValue.get('Forward')! > 0) {
            lCamera.transformation.translateInDirection((lCurrentActionValue.get('Forward')! / 50) * lSpeed, 0, 0);
        }
        if (lCurrentActionValue.get('Back')! > 0) {
            lCamera.transformation.translateInDirection(-(lCurrentActionValue.get('Back')! / 50) * lSpeed, 0, 0);
        }

        // X Axis
        if (lCurrentActionValue.get('Right')! > 0) {
            lCamera.transformation.translateInDirection(0, (lCurrentActionValue.get('Right')! / 50) * lSpeed, 0);
        }
        if (lCurrentActionValue.get('Left')! > 0) {
            lCamera.transformation.translateInDirection(0, -(lCurrentActionValue.get('Left')! / 50) * lSpeed, 0);
        }

        // Y Axis
        if (lCurrentActionValue.get('Up')! > 0) {
            lCamera.transformation.translateInDirection(0, 0, (lCurrentActionValue.get('Up')! / 50) * lSpeed);
        }
        if (lCurrentActionValue.get('Down')! > 0) {
            lCamera.transformation.translateInDirection(0, 0, -(lCurrentActionValue.get('Down')! / 50) * lSpeed);
        }

        // Rotation.
        if (lCurrentActionValue.get('Yaw')! > 0 || lCurrentActionValue.get('Yaw')! < 0) {
            lCamera.transformation.addEulerRotation(0, lCurrentActionValue.get('Yaw')! * lSpeed, 0);
        }
        if (lCurrentActionValue.get('Pitch')! > 0 || lCurrentActionValue.get('Pitch')! < 0) {
            lCamera.transformation.addEulerRotation(lCurrentActionValue.get('Pitch')! * lSpeed, 0, 0);
        }
        if (lCurrentActionValue.get('RotateLeft')! > 0) {
            lCamera.transformation.addEulerRotation(0, 0, lCurrentActionValue.get('RotateLeft')! * lSpeed);
        }
        if (lCurrentActionValue.get('RotateRight')! > 0) {
            lCamera.transformation.addEulerRotation(0, 0, -lCurrentActionValue.get('RotateRight')! * lSpeed);
        }

        // Update transformation buffer.
        lCameraBuffer.write(async (pBuffer) => { pBuffer.set(lCamera.getMatrix(CameraMatrix.ViewProjection).dataArray); });
    }, 8);
    lCanvas.addEventListener('click', () => {
        lCanvas.requestPointerLock();
    });

    // Setup Texture.
    const lCubeTexture: WebGpuTexture = new WebGpuTexture(lGpu, lGpu.preferredFormat, WebGpuTextureUsage.TextureBinding | WebGpuTextureUsage.RenderAttachment | WebGpuTextureUsage.CopyDestination);
    lCubeTexture.label = 'Cube Texture';
    await lCubeTexture.load(['/source/cube_texture/cube-texture.png']);

    // Setup Sampler.
    const lCubeSampler: WebGpuTextureSampler = new WebGpuTextureSampler(lGpu);

    // Create attributes data.
    const lVertexPositionData: Array<number> = [ // 4x Position
        // Back
        -1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, -1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0, 1.0,

        // Front
        -1.0, 1.0, -1.0, 1.0,
        1.0, 1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0, 1.0
    ];
    const lVertexUvData: Array<number> = [ // 4x Position
        // Front 4,5,6
        0.33333, 0.25,
        0.66666, 0.25,
        0.66666, 0.50,
        // Front 4,6,7
        0.33333, 0.25,
        0.66666, 0.50,
        0.33333, 0.50,

        // Back 1,0,3
        0.66666, 1,
        0.33333, 1,
        0.33333, 0.75,
        // Back 1,3,2
        0.66666, 1,
        0.33333, 0.75,
        0.66666, 0.75,

        // Left 0,4,7
        0, 0.25,
        0.33333, 0.25,
        0.33333, 0.50,
        // Left 0,7,3
        0, 0.25,
        0.33333, 0.50,
        0, 0.50,

        // Right 5,1,2
        0.66666, 0.25,
        1, 0.25,
        1, 0.50,
        // Right 5,2,6
        0.66666, 0.25,
        1, 0.50,
        0.66666, 0.50,

        // Top 0,1,5
        0.33333, 0,
        0.66666, 0,
        0.66666, 0.25,
        // Top 0,5,4
        0.33333, 0,
        0.66666, 0.25,
        0.33333, 0.25,

        // Bottom 7,6,2
        0.33333, 0.50,
        0.66666, 0.50,
        0.66666, 0.75,
        // Bottom 7,2,3
        0.33333, 0.50,
        0.66666, 0.75,
        0.33333, 0.75,
    ];
    const lVertexNormalData: Array<number> = [ // 4x Position
        // Front
        0, 0, -1, 0,
        0, 0, -1, 0,
        0, 0, -1, 0,
        0, 0, -1, 0,
        0, 0, -1, 0,
        0, 0, -1, 0,

        // Back 1,0,3
        0, 0, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 0,

        // Left 0,4,7
        -1, 0, 0, 0,
        -1, 0, 0, 0,
        -1, 0, 0, 0,
        -1, 0, 0, 0,
        -1, 0, 0, 0,
        -1, 0, 0, 0,

        // Right 5,1,2
        1, 0, 0, 0,
        1, 0, 0, 0,
        1, 0, 0, 0,
        1, 0, 0, 0,
        1, 0, 0, 0,
        1, 0, 0, 0,

        // Top 0,1,5
        0, 1, 0, 0,
        0, 1, 0, 0,
        0, 1, 0, 0,
        0, 1, 0, 0,
        0, 1, 0, 0,
        0, 1, 0, 0,

        // Bottom 7,6,2
        0, -1, 0, 0,
        0, -1, 0, 0,
        0, -1, 0, 0,
        0, -1, 0, 0,
        0, -1, 0, 0,
        0, -1, 0, 0,
    ];

    // Create mesh.
    const lMesh = new RenderParameter(lGpu, [
        // Front
        4, 5, 6,
        4, 6, 7,
        // Back
        1, 0, 3,
        1, 3, 2,
        // Left
        0, 4, 7,
        0, 7, 3,
        // Right
        5, 1, 2,
        5, 2, 6,
        // Top
        0, 1, 5,
        0, 5, 4,
        // Bottom
        7, 6, 2,
        7, 2, 3
    ]);
    lMesh.setVertexData('vertex.position', lVertexPositionData, 4);
    lMesh.setIndexData('vertex.uv', lVertexUvData, 2);
    lMesh.setIndexData('vertex.normal', lVertexNormalData, 4);

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