import { Camera } from '../../source/base/camera/camera';
import { OrthographicProjection } from '../../source/base/camera/projection/orthographic -projection';
import { PerspectiveProjection } from '../../source/base/camera/projection/perspective-projection';
import { Transform, TransformationMatrix } from '../../source/base/transform';
import { AttachmentType } from '../../source/core/pass_descriptor/attachment-type.enum';
import { Attachments } from '../../source/core/pass_descriptor/attachments';
import { RenderMesh } from '../../source/core/execution/data/render-mesh';
import { InstructionExecuter } from '../../source/core/execution/instruction-executer';
import { RenderSingleInstruction } from '../../source/core/execution/instruction/render-single-instruction';
import { Gpu } from '../../source/core/gpu';
import { RenderPipeline } from '../../source/core/pipeline/render-pipeline';
import { SimpleBuffer } from '../../source/core/resource/buffer/simple-buffer';
import { Shader } from '../../source/core/shader/shader';
import shader from './shader.wgsl';
import { RenderPassDescriptor } from '../../source/core/pass_descriptor/render-pass-descriptor';
import { RenderInstructionSet } from '../../source/core/execution/instruction_set/render-instruction-set';
import { RingBuffer } from '../../source/core/resource/buffer/ring-buffer';
import { Texture } from '../../source/core/resource/texture/texture';
import { TextureUsage } from '../../source/core/resource/texture/texture-usage.enum';
import { TextureSampler } from '../../source/core/resource/texture-sampler';
import { BaseInputDevice, DeviceConfiguration, InputConfiguration, InputDevices, KeyboardButton, MouseButton, MouseKeyboardConnector } from '@kartoffelgames/web.game-input';
import { Dictionary } from '@kartoffelgames/core.data';

const gHeight: number = 10;
const gWidth: number = 10;
const gDepth: number = 10;

(async () => {
    const lColorPicker: HTMLInputElement = <HTMLInputElement>document.querySelector('#color');
    const lFpsCounter: HTMLSpanElement = <HTMLInputElement>document.querySelector('#fpsCounter');

    // Create gpu.
    const lGpu: Gpu = await Gpu.create('high-performance');

    // Init canvas.
    const lCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');

    // Init shader.
    const lShader: Shader = new Shader(lGpu, shader);

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

    // Color buffer.
    const lColorBuffer = new SimpleBuffer(lGpu, GPUBufferUsage.UNIFORM, new Float32Array([1, 1, 1, 1]));
    lColorPicker.addEventListener('input', (pEvent) => {
        const lBigint = parseInt((<any>pEvent.target).value.replace('#', ''), 16);
        const lRed = (lBigint >> 16) & 255;
        const lGreen = (lBigint >> 8) & 255;
        const lBlue = lBigint & 255;

        lColorBuffer.write(async (pBuffer) => {
            pBuffer[0] = lRed / 255;
            pBuffer[1] = lGreen / 255;
            pBuffer[2] = lBlue / 255;
        });
    });

    type CubeInstance = {
        transformation: { x: number, y: number, z: number; },
        transform: Transform,
        buffer: SimpleBuffer<Float32Array>;
    };

    const lTransformationList: Array<CubeInstance> = new Array<CubeInstance>();
    for (let lWidthIndex: number = 0; lWidthIndex < gWidth; lWidthIndex++) {
        for (let lHeightIndex: number = 0; lHeightIndex < gHeight; lHeightIndex++) {
            for (let lDepthIndex: number = 0; lDepthIndex < gDepth; lDepthIndex++) {
                const lTransformation = { x: lWidthIndex, y: lHeightIndex, z: lDepthIndex };

                // Transformation.
                const lTransform: Transform = new Transform();
                lTransform.setScale(0.1, 0.1, 0.1);
                lTransform.setTranslation(lTransformation.x, lTransformation.y, lTransformation.z);
                lTransform.setRotation(0, 0, 0);

                lTransformationList.push({
                    transform: lTransform,
                    transformation: { x: lWidthIndex, y: lHeightIndex, z: lDepthIndex },
                    buffer: new RingBuffer(lGpu, GPUBufferUsage.UNIFORM, new Float32Array(lTransform.getMatrix(TransformationMatrix.Transformation).dataArray))
                });
            }
        }
    }

    // Transformation buffer.
    const lUpdaterFunctions: Array<() => void> = new Array<() => void>();
    const lRegisterObjectHandler = (pId: string, pSet: (pTransform: Transform, pData: number) => void, pGet: (pTransform: Transform) => number) => {
        const lSlider: HTMLInputElement = <HTMLInputElement>document.getElementById(pId);
        const lInput: HTMLInputElement = <HTMLInputElement>document.getElementById(pId + 'Display');

        const lUpdater = () => {
            lInput.value = <any>pGet(lTransformationList[0].transform);
        };
        lUpdaterFunctions.push(lUpdater);
        lUpdater();

        let lCurrentData: number = 0;

        const lSetData = (pStringData: string) => {
            const lNumberData: number = parseFloat(pStringData) || 1;
            lCurrentData += lNumberData;

            for (const lTransformation of lTransformationList) {
                pSet(lTransformation.transform, lCurrentData);
            }

            // Reset slider.
            lSlider.value = <any>0;

            // Set real data.
            for (const lUpdater of lUpdaterFunctions) {
                lUpdater();
            }

            // Update translation if it is all the same.
            if (lTransformationList[lTransformationList.length - 1].transform.translationX === lCurrentData) {
                for (const lTransformation of lTransformationList) {
                    lTransformation.transform.addTranslation(lTransformation.transformation.x, 0, 0);
                }
            }
            if (lTransformationList[lTransformationList.length - 1].transform.translationY === lCurrentData) {
                for (const lTransformation of lTransformationList) {
                    lTransformation.transform.addTranslation(0, lTransformation.transformation.y, 0);
                }
            }
            if (lTransformationList[lTransformationList.length - 1].transform.translationZ === lCurrentData) {
                for (const lTransformation of lTransformationList) {
                    lTransformation.transform.addTranslation(0, 0, lTransformation.transformation.z);
                }
            }

            // Update transformation buffer.
            for (const lTransformation of lTransformationList) {
                lTransformation.buffer.write(async (pBuffer) => { pBuffer.set(lTransformation.transform.getMatrix(TransformationMatrix.Transformation).dataArray); });
            }
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

    const lCamera: Camera = new Camera(lPerspectiveProjection);
    lCamera.translationZ = -4;

    // Transformation buffer.
    const lCameraBuffer = new SimpleBuffer(lGpu, GPUBufferUsage.UNIFORM, new Float32Array(lCamera.viewProjectionMatrix.dataArray));
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
            lCameraBuffer.write(async (pBuffer) => { pBuffer.set(lCamera.viewProjectionMatrix.dataArray); });
        };

        lSlider.addEventListener('input', (pEvent) => { lSetData((<any>pEvent.target).value); });
        lInput.addEventListener('input', (pEvent) => { lSetData((<any>pEvent.target).value); });
    };
    // Translate.
    lRegisterCameraHandler('cameraPivotX', (pData) => { lCamera.pivotX = pData; }, () => { return lCamera.pivotX; });
    lRegisterCameraHandler('cameraPivotY', (pData) => { lCamera.pivotY = pData; }, () => { return lCamera.pivotY; });
    lRegisterCameraHandler('cameraPivotZ', (pData) => { lCamera.pivotZ = pData; }, () => { return lCamera.pivotZ; });

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
        // Z Axis
        if (lCurrentActionValue.get('Forward')! > 0) {
            lCamera.translationZ += (lCurrentActionValue.get('Forward')! / 50);
        }
        if (lCurrentActionValue.get('Back')! > 0) {
            lCamera.translationZ -= (lCurrentActionValue.get('Back')! / 50);
        }

        // X Axis
        if (lCurrentActionValue.get('Right')! > 0) {
            lCamera.translationX += (lCurrentActionValue.get('Right')! / 50);
        }
        if (lCurrentActionValue.get('Left')! > 0) {
            lCamera.translationX -= (lCurrentActionValue.get('Left')! / 50);
        }

        // Y Axis
        if (lCurrentActionValue.get('Up')! > 0) {
            lCamera.translationY += (lCurrentActionValue.get('Up')! / 50);
        }
        if (lCurrentActionValue.get('Down')! > 0) {
            lCamera.translationY -= (lCurrentActionValue.get('Down')! / 50);
        }

        // Rotation.
        if (lCurrentActionValue.get('Yaw')! > 0 || lCurrentActionValue.get('Yaw')! < 0) {
            lCamera.rotate(0, lCurrentActionValue.get('Yaw')!, 0);
        }
        if (lCurrentActionValue.get('Pitch')! > 0 || lCurrentActionValue.get('Pitch')! < 0) {
            lCamera.rotate(lCurrentActionValue.get('Pitch')!, 0, 0);
        }
        if (lCurrentActionValue.get('RotateLeft')! > 0) {
            lCamera.rotate(0, 0, -lCurrentActionValue.get('RotateLeft')!);
        }
        if (lCurrentActionValue.get('RotateRight')! > 0) {
            lCamera.rotate(0, 0, lCurrentActionValue.get('RotateRight')!);
        }

        // Update transformation buffer.
        lCameraBuffer.write(async (pBuffer) => { pBuffer.set(lCamera.viewProjectionMatrix.dataArray); });
    }, 50);
    lCanvas.addEventListener('click', () => {
        lCanvas.requestPointerLock();
    });

    // Setup Texture.
    const lCubeTexture: Texture = new Texture(lGpu, lGpu.preferredFormat, TextureUsage.TextureBinding | TextureUsage.RenderAttachment | TextureUsage.CopyDestination);
    lCubeTexture.height = 2048;
    lCubeTexture.width = 1536;
    lCubeTexture.label = 'Cube Texture';
    await lCubeTexture.load(['/source/cube_texture/cube-texture.png']);

    // Setup Sampler.
    const lCubeSampler: TextureSampler = new TextureSampler(lGpu);

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
    const lVertexColorData: Array<number> = [ // 4x Color
        1.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.5, 0.0, 1.0, 1.0
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

    // Create mesh.
    const lMesh = new RenderMesh(lGpu, [
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
    lMesh.setVertexData('vertexposition', lVertexPositionData, 4);
    lMesh.setVertexData('vertexcolor', lVertexColorData, 4);
    lMesh.setIndexData('vertexuv', lVertexUvData, 2);



    // Setup renderer.
    const lInstructionExecutioner: InstructionExecuter = new InstructionExecuter(lGpu);

    // Setup instruction set.
    const lInstructionSet: RenderInstructionSet = new RenderInstructionSet(lRenderPassDescription);
    lInstructionExecutioner.addInstructionSet(lInstructionSet);

    // Create camera bind group.
    const lCameraAndColorBindGroup = lShader.bindGroups.getGroup(1).createBindGroup();
    lCameraAndColorBindGroup.setData('color', lColorBuffer);
    lCameraAndColorBindGroup.setData('viewProjectionMatrix', lCameraBuffer);

    const lTextureBindGroup = lShader.bindGroups.getGroup(2).createBindGroup();
    lTextureBindGroup.setData('cubetextureSampler', lCubeSampler);
    lTextureBindGroup.setData('cubeTexture', lCubeTexture.view());

    // Setup object render.
    for (const lCube of lTransformationList) {
        // Create
        const lTransformationBindGroup = lShader.bindGroups.getGroup(0).createBindGroup();
        lTransformationBindGroup.setData('transformationMatrix', lCube.buffer);

        const lObjectRenderInstruction: RenderSingleInstruction = new RenderSingleInstruction(lPipeline, lMesh);
        lObjectRenderInstruction.setBindGroup(0, lTransformationBindGroup);
        lObjectRenderInstruction.setBindGroup(1, lCameraAndColorBindGroup);
        lObjectRenderInstruction.setBindGroup(2, lTextureBindGroup);

        lInstructionSet.addInstruction(lObjectRenderInstruction);
    }

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