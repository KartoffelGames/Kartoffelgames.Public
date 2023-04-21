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

(async () => {
    const lColorPicker: HTMLInputElement = <HTMLInputElement>document.querySelector('#color');

    // Create gpu.
    const lGpu: Gpu = await Gpu.create('high-performance');

    // Init canvas.
    const lCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');

    // Init shader.
    const lShader: Shader = new Shader(lGpu, shader);

    // Create depth and color attachments.
    const lAttachments: Attachments = new Attachments(lGpu);
    lAttachments.resize(1200, 640);
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
    lRenderPassDescription.setColorAttachment(0, 'Canvas', { r: 0.5, g: 0.5, b: 0.5, a: 1 });

    // Init pipeline.
    const lPipeline: RenderPipeline = new RenderPipeline(lGpu, lRenderPassDescription);
    lPipeline.setShader(lShader);
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

    // Transformation.
    const lTransformation: Transform = new Transform();
    lTransformation.scaleDepth = 0.1;
    lTransformation.scaleHeight = 0.1;
    lTransformation.scaleWidth = 0.1;
    //lTransformation.translationZ = 0.18;
    lTransformation.absoluteRotation(0, 0, 0);

    // Transformation buffer.
    const lTransformationBuffer = new SimpleBuffer(lGpu, GPUBufferUsage.UNIFORM, new Float32Array(lTransformation.transformationMatrix.dataArray));
    const lUpdaterFunctions: Array<() => void> = new Array<() => void>();
    const lRegisterObjectHandler = (pId: string, pSet: (pData: number) => void, pGet: () => number) => {
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
            lTransformationBuffer.write(async (pBuffer) => { pBuffer.set(lTransformation.transformationMatrix.dataArray); });
        };

        lSlider.addEventListener('input', (pEvent) => { lSetData((<any>pEvent.target).value); });
        lInput.addEventListener('input', (pEvent) => { lSetData((<any>pEvent.target).value); });
    };

    // Scale handler.
    lRegisterObjectHandler('scaleHeight', (pData) => { lTransformation.scaleHeight = pData; }, () => { return lTransformation.scaleHeight; });
    lRegisterObjectHandler('scaleWidth', (pData) => { lTransformation.scaleWidth = pData; }, () => { return lTransformation.scaleWidth; });
    lRegisterObjectHandler('scaleDepth', (pData) => { lTransformation.scaleDepth = pData; }, () => { return lTransformation.scaleDepth; });

    // Translate.
    lRegisterObjectHandler('translateX', (pData) => { lTransformation.translationX = pData; }, () => { return lTransformation.translationX; });
    lRegisterObjectHandler('translateY', (pData) => { lTransformation.translationY = pData; }, () => { return lTransformation.translationY; });
    lRegisterObjectHandler('translateZ', (pData) => { lTransformation.translationZ = pData; }, () => { return lTransformation.translationZ; });

    // Rotate.
    lRegisterObjectHandler('rotatePitch', (pData) => { lTransformation.addRotation(pData, 0, 0); }, () => { return lTransformation.axisRotationAngleX; });
    lRegisterObjectHandler('rotateYaw', (pData) => { lTransformation.addRotation(0, pData, 0); }, () => { return lTransformation.axisRotationAngleY; });
    lRegisterObjectHandler('rotateRoll', (pData) => { lTransformation.addRotation(0, 0, pData); }, () => { return lTransformation.axisRotationAngleZ; });

    // Translate.
    lRegisterObjectHandler('pivotX', (pData) => { lTransformation.pivotX = pData; }, () => { return lTransformation.pivotX; });
    lRegisterObjectHandler('pivotY', (pData) => { lTransformation.pivotY = pData; }, () => { return lTransformation.pivotY; });
    lRegisterObjectHandler('pivotZ', (pData) => { lTransformation.pivotZ = pData; }, () => { return lTransformation.pivotZ; });

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

    // Create bind group.
    const lBindGroup = lShader.bindGroups.getGroup(0).createBindGroup();
    lBindGroup.setData('color', lColorBuffer);
    lBindGroup.setData('transformationMatrix', lTransformationBuffer);
    lBindGroup.setData('viewProjectionMatrix', lCameraBuffer);

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


    // Setup object render.
    const lObjectRenderInstruction: RenderSingleInstruction = new RenderSingleInstruction(lPipeline, lMesh);
    lObjectRenderInstruction.setBindGroup(0, lBindGroup);

    lInstructionExecutioner.addInstruction(lObjectRenderInstruction);

    const lRender = async () => {
        // Generate encoder and add render commands.
        await lInstructionExecutioner.execute();

        // Refresh canvas
        requestAnimationFrame(lRender);
    };
    requestAnimationFrame(lRender);
})();