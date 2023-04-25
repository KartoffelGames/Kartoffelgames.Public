import { Camera } from '../../source/base/camera/camera';
import { OrthographicProjection } from '../../source/base/camera/projection/orthographic -projection';
import { PerspectiveProjection } from '../../source/base/camera/projection/perspective-projection';
import { Transform } from '../../source/base/transform';
import { AttachmentType } from '../../source/core/pass_descriptor/attachment-type.enum';
import { Attachments } from '../../source/core/pass_descriptor/attachments';
import { RenderMesh } from '../../source/core/execution/data/render-mesh';
import { InstructionExecuter } from '../../source/core/execution/instruction-executer';
import { RenderSingleInstruction } from '../../source/core/execution/instruction/render-single-instruction';
import { Gpu } from '../../source/core/gpu';
import { RenderPipeline } from '../../source/core/pipeline/render-pipeline';
import { SimpleBuffer } from '../../source/core/resource/buffer/simple-buffer';
import { Shader } from '../../source/core/shader/shader';
import shader from './shader.txt';
import { RenderPassDescriptor } from '../../source/core/pass_descriptor/render-pass-descriptor';
import { RenderInstructionSet } from '../../source/core/execution/instruction_set/render-instruction-set';
import { RingBuffer } from '../../source/core/resource/buffer/ring-buffer';

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
                lTransform.scaleDepth = 0.1;
                lTransform.scaleHeight = 0.1;
                lTransform.scaleWidth = 0.1;
                lTransform.translationX = lTransformation.x;
                lTransform.translationY = lTransformation.y;
                lTransform.translationZ = lTransformation.z;
                lTransform.absoluteRotation(0, 0, 0);

                lTransformationList.push({
                    transform: lTransform,
                    transformation: { x: lWidthIndex, y: lHeightIndex, z: lDepthIndex },
                    buffer: new RingBuffer(lGpu, GPUBufferUsage.UNIFORM, new Float32Array(lTransform.transformationMatrix.dataArray))
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
                    lTransformation.transform.translationX += lTransformation.transformation.x;
                }
            }
            if (lTransformationList[lTransformationList.length - 1].transform.translationY === lCurrentData) {
                for (const lTransformation of lTransformationList) {
                    lTransformation.transform.translationY += lTransformation.transformation.y;
                }
            }
            if (lTransformationList[lTransformationList.length - 1].transform.translationZ === lCurrentData) {
                for (const lTransformation of lTransformationList) {
                    lTransformation.transform.translationZ += lTransformation.transformation.z;
                }
            }

            // Update transformation buffer.
            for (const lTransformation of lTransformationList) {
                lTransformation.buffer.write(async (pBuffer) => { pBuffer.set(lTransformation.transform.transformationMatrix.dataArray); });
            }
        };

        lSlider.addEventListener('input', (pEvent) => { lSetData((<any>pEvent.target).value); });
        lInput.addEventListener('input', (pEvent) => { lSetData((<any>pEvent.target).value); });
    };

    // Scale handler.
    lRegisterObjectHandler('scaleHeight', (pTransform: Transform, pData) => { pTransform.scaleHeight = pData; }, (pTransform: Transform) => { return pTransform.scaleHeight; });
    lRegisterObjectHandler('scaleWidth', (pTransform: Transform, pData) => { pTransform.scaleWidth = pData; }, (pTransform: Transform) => { return pTransform.scaleWidth; });
    lRegisterObjectHandler('scaleDepth', (pTransform: Transform, pData) => { pTransform.scaleDepth = pData; }, (pTransform: Transform) => { return pTransform.scaleDepth; });

    // Translate.
    lRegisterObjectHandler('translateX', (pTransform: Transform, pData) => { pTransform.translationX = pData; }, (pTransform: Transform) => { return pTransform.translationX; });
    lRegisterObjectHandler('translateY', (pTransform: Transform, pData) => { pTransform.translationY = pData; }, (pTransform: Transform) => { return pTransform.translationY; });
    lRegisterObjectHandler('translateZ', (pTransform: Transform, pData) => { pTransform.translationZ = pData; }, (pTransform: Transform) => { return pTransform.translationZ; });

    // Rotate.
    lRegisterObjectHandler('rotatePitch', (pTransform: Transform, pData) => { pTransform.addRotation(pData, 0, 0); }, (pTransform: Transform) => { return pTransform.axisRotationAngleX; });
    lRegisterObjectHandler('rotateYaw', (pTransform: Transform, pData) => { pTransform.addRotation(0, pData, 0); }, (pTransform: Transform) => { return pTransform.axisRotationAngleY; });
    lRegisterObjectHandler('rotateRoll', (pTransform: Transform, pData) => { pTransform.addRotation(0, 0, pData); }, (pTransform: Transform) => { return pTransform.axisRotationAngleZ; });

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
    lRegisterCameraHandler('cameraTranslateX', (pData) => { lCamera.translationX = pData; }, () => { return lCamera.translationX; });
    lRegisterCameraHandler('cameraTranslateY', (pData) => { lCamera.translationY = pData; }, () => { return lCamera.translationY; });
    lRegisterCameraHandler('cameraTranslateZ', (pData) => { lCamera.translationZ = pData; }, () => { return lCamera.translationZ; });

    // Rotate.
    lRegisterCameraHandler('cameraRotatePitch', (pData) => { lCamera.rotate(pData, 0, 0); }, () => { return lCamera.rotation.x; });
    lRegisterCameraHandler('cameraRotateYaw', (pData) => { lCamera.rotate(0, pData, 0); }, () => { return lCamera.rotation.y; });
    lRegisterCameraHandler('cameraRotateRoll', (pData) => { lCamera.rotate(0, 0, pData); }, () => { return lCamera.rotation.z; });

    // Translate.
    lRegisterCameraHandler('cameraPivotX', (pData) => { lCamera.pivotX = pData; }, () => { return lCamera.pivotX; });
    lRegisterCameraHandler('cameraPivotY', (pData) => { lCamera.pivotY = pData; }, () => { return lCamera.pivotY; });
    lRegisterCameraHandler('cameraPivotZ', (pData) => { lCamera.pivotZ = pData; }, () => { return lCamera.pivotZ; });

    // Camera.
    lRegisterCameraHandler('cameraNear', (pData) => { lPerspectiveProjection.near = pData; }, () => { return lPerspectiveProjection.near; });
    lRegisterCameraHandler('cameraFar', (pData) => { lPerspectiveProjection.far = pData; }, () => { return lPerspectiveProjection.far; });
    lRegisterCameraHandler('cameraAngleOfView', (pData) => { lPerspectiveProjection.angleOfView = pData; }, () => { return lPerspectiveProjection.angleOfView; });

    // Create attributes data.
    const lVertexPositionData: Float32Array = new Float32Array([ // 4x Position
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
    ]);
    const lVertexPositionBuffer: SimpleBuffer<Float32Array> = new SimpleBuffer(lGpu, GPUBufferUsage.VERTEX, lVertexPositionData);
    const lVertexColorData: Float32Array = new Float32Array([ // 4x Color
        1.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.5, 0.0, 1.0, 1.0
    ]);
    const lVertexColorBuffer: SimpleBuffer<Float32Array> = new SimpleBuffer(lGpu, GPUBufferUsage.VERTEX, lVertexColorData);

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
    lMesh.setVertexBuffer('vertexposition', lVertexPositionBuffer);
    lMesh.setVertexBuffer('vertexcolor', lVertexColorBuffer);

    // Setup renderer.
    const lInstructionExecutioner: InstructionExecuter = new InstructionExecuter(lGpu);

    // Setup instruction set.
    const lInstructionSet: RenderInstructionSet = new RenderInstructionSet(lRenderPassDescription);
    lInstructionExecutioner.addInstructionSet(lInstructionSet);

    // Setup object render.
    for (const lCube of lTransformationList) {
        // Create bind group.
        const lBindGroup = lShader.bindGroups.getGroup(0).createBindGroup();
        lBindGroup.setData('color', lColorBuffer);
        lBindGroup.setData('transformationMatrix', lCube.buffer);
        lBindGroup.setData('viewProjectionMatrix', lCameraBuffer);

        const lObjectRenderInstruction: RenderSingleInstruction = new RenderSingleInstruction(lPipeline, lMesh);
        lObjectRenderInstruction.setBindGroup(0, lBindGroup);
        lInstructionSet.addInstruction(lObjectRenderInstruction);
    }

    let lLastTime: number = 0;
    const lRender = async (pTime: number) => {
        // Generate encoder and add render commands.
        await lInstructionExecutioner.execute();

        const lFps: number = 1000 / (pTime - lLastTime);
        lFpsCounter.textContent = lFps.toString();
        lLastTime = pTime;

        // Refresh canvas
        requestAnimationFrame(lRender);
    };
    requestAnimationFrame(lRender);
})();