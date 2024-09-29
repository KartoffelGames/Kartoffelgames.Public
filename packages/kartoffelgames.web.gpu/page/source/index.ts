import { Dictionary } from '@kartoffelgames/core';
import { BaseInputDevice, DeviceConfiguration, InputConfiguration, InputDevices, KeyboardButton, MouseButton, MouseKeyboardConnector } from '@kartoffelgames/web.game-input';
import { BindGroupLayout } from '../../source/base/binding/bind-group-layout';
import { GpuBuffer } from '../../source/base/buffer/gpu-buffer';
import { GpuExecution } from '../../source/base/execution/gpu-execution';
import { RenderPass } from '../../source/base/execution/pass/render-pass';
import { GpuDevice } from '../../source/base/gpu/gpu-device';
import { PrimitiveBufferFormat } from '../../source/base/memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../source/base/memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { VertexParameter } from '../../source/base/pipeline/parameter/vertex-parameter';
import { RenderTargets } from '../../source/base/pipeline/target/render-targets';
import { VertexFragmentPipeline } from '../../source/base/pipeline/vertex-fragment-pipeline';
import { ShaderRenderModule } from '../../source/base/shader/shader-render-module';
import { CanvasTexture } from '../../source/base/texture/canvas-texture';
import { ComputeStage } from '../../source/constant/compute-stage.enum';
import { PrimitiveCullMode } from '../../source/constant/primitive-cullmode.enum';
import { SamplerType } from '../../source/constant/sampler-type.enum';
import { StorageBindingType } from '../../source/constant/storage-binding-type.enum';
import { TextureDimension } from '../../source/constant/texture-dimension.enum';
import { TextureFormat } from '../../source/constant/texture-format.enum';
import { VertexParameterStepMode } from '../../source/constant/vertex-parameter-step-mode.enum';
import { CubeVertexIndices, CubeVertexNormalData, CubeVertexPositionData, CubeVertexUvData } from './cube/cube';
import shader from './shader.wgsl';
import { AmbientLight } from './something_better/light/ambient-light';
import { Transform, TransformMatrix } from './something_better/transform';
import { PerspectiveProjection } from './something_better/view_projection/projection/perspective-projection';
import { CameraMatrix, ViewProjection } from './something_better/view_projection/view-projection';

const gHeight: number = 100;
const gWidth: number = 100;
const gDepth: number = 100;

const gInitCameraControls = (pCanvas: HTMLCanvasElement, pCamera: ViewProjection, pCameraBuffer: GpuBuffer<Float32Array>) => {
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
            pCamera.transformation.translateInDirection((lCurrentActionValue.get('Forward')! / 50) * lSpeed, 0, 0);
        }
        if (lCurrentActionValue.get('Back')! > 0) {
            pCamera.transformation.translateInDirection(-(lCurrentActionValue.get('Back')! / 50) * lSpeed, 0, 0);
        }

        // X Axis
        if (lCurrentActionValue.get('Right')! > 0) {
            pCamera.transformation.translateInDirection(0, (lCurrentActionValue.get('Right')! / 50) * lSpeed, 0);
        }
        if (lCurrentActionValue.get('Left')! > 0) {
            pCamera.transformation.translateInDirection(0, -(lCurrentActionValue.get('Left')! / 50) * lSpeed, 0);
        }

        // Y Axis
        if (lCurrentActionValue.get('Up')! > 0) {
            pCamera.transformation.translateInDirection(0, 0, (lCurrentActionValue.get('Up')! / 50) * lSpeed);
        }
        if (lCurrentActionValue.get('Down')! > 0) {
            pCamera.transformation.translateInDirection(0, 0, -(lCurrentActionValue.get('Down')! / 50) * lSpeed);
        }

        // Rotation.
        if (lCurrentActionValue.get('Yaw')! > 0 || lCurrentActionValue.get('Yaw')! < 0) {
            pCamera.transformation.addEulerRotation(0, lCurrentActionValue.get('Yaw')! * lSpeed, 0);
        }
        if (lCurrentActionValue.get('Pitch')! > 0 || lCurrentActionValue.get('Pitch')! < 0) {
            pCamera.transformation.addEulerRotation(lCurrentActionValue.get('Pitch')! * lSpeed, 0, 0);
        }
        if (lCurrentActionValue.get('RotateLeft')! > 0) {
            pCamera.transformation.addEulerRotation(0, 0, lCurrentActionValue.get('RotateLeft')! * lSpeed);
        }
        if (lCurrentActionValue.get('RotateRight')! > 0) {
            pCamera.transformation.addEulerRotation(0, 0, -lCurrentActionValue.get('RotateRight')! * lSpeed);
        }

        // Update transformation buffer.
        pCameraBuffer.writeRaw(pCamera.getMatrix(CameraMatrix.ViewProjection).dataArray);
    }, 8);
    pCanvas.addEventListener('click', () => {
        pCanvas.requestPointerLock();
    });
};

(async () => {
    const lGpu: GpuDevice = await GpuDevice.request('high-performance');

    // Create canvas.
    const lCanvasTexture: CanvasTexture = lGpu.canvas(document.getElementById('canvas') as HTMLCanvasElement);

    // Create and configure render targets.
    const lRenderTargets: RenderTargets = lGpu.renderTargets().setup((pSetup) => {
        // Add "color" target and init new texture.
        pSetup.addColor('color', 0, true, { r: 1, g: 0.5, b: 0.5, a: 0 })
            .use(lCanvasTexture);

        // Add depth texture and init new texture.    
        pSetup.addDepthStencil(true, 1)
            .new(TextureFormat.Depth24plus);
    }).resize(1200, 1800, 4);

    // Create shader.
    const lShader = lGpu.shader(shader).setup((pShaderSetup) => {
        pShaderSetup.vertexEntryPoint('vertex_main')
            .addParameter('position', 0, PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4, VertexParameterStepMode.Index)
            .addParameter('uv', 1, PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector2, VertexParameterStepMode.Vertex)
            .addParameter('normal', 2, PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4, VertexParameterStepMode.Vertex);

        pShaderSetup.fragmentEntryPoint('fragment_main')
            .addRenderTarget('main', 0, PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);

        // Object bind group.
        pShaderSetup.group(0, new BindGroupLayout(lGpu, 'object').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .withPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);

            pBindGroupSetup.binding(1, 'instancePositions', ComputeStage.Vertex, StorageBindingType.Read)
                .withArray().withPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);
        }));

        // World bind group.
        pShaderSetup.group(1, new BindGroupLayout(lGpu, 'world').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'viewProjectionMatrix', ComputeStage.Vertex)
                .withPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);

            pBindGroupSetup.binding(1, 'ambientLight', ComputeStage.Fragment)
                .withStruct((pStruct) => {
                    pStruct.property('color').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);
                });

            pBindGroupSetup.binding(2, 'pointLights', ComputeStage.Fragment, StorageBindingType.Read)
                .withArray().withStruct((pStruct) => {
                    pStruct.property('position').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);
                    pStruct.property('color').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);
                    pStruct.property('range').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Single);
                });
        }));

        // User bind group
        pShaderSetup.group(2, new BindGroupLayout(lGpu, 'user').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'cubeTextureSampler', ComputeStage.Fragment)
                .withSampler(SamplerType.Filter);

            pBindGroupSetup.binding(1, 'cubeTexture', ComputeStage.Fragment)
                .withTexture(TextureDimension.TwoDimension, TextureFormat.Rgba8unorm, false);
        }));
    });

    // Create render module from shader.
    const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

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
    lTransformationGroup.data('instancePositions').createBuffer(new Float32Array(lCubeInstanceTransformationData));

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
    lAmbientLight.setColor(0.3, 0.3, 0.3);
    lWorldGroup.data('ambientLight').createBuffer(new Float32Array(lAmbientLight.data));

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
    await lUserGroup.data('cubeTexture').createImage('/source/cube/cube-texture.png');

    // Setup Sampler.
    lUserGroup.data('cubeTextureSampler').createSampler();

    // Generate render parameter from parameter layout.
    const lMesh: VertexParameter = lRenderModule.vertexParameter.create(CubeVertexIndices);
    lMesh.set('position', CubeVertexPositionData);
    lMesh.set('uv', CubeVertexUvData); // TODO: Convert to Indexbased parameter.
    lMesh.set('normal', CubeVertexNormalData); // TODO: Convert to Indexbased parameter.

    // Create pipeline.
    const lPipeline: VertexFragmentPipeline = lRenderModule.create(lRenderTargets);
    lPipeline.primitiveCullMode = PrimitiveCullMode.Front;

    // Create instruction.
    const lRenderPass: RenderPass = lGpu.renderPass(lRenderTargets);
    lRenderPass.addStep(lPipeline, lMesh, [lTransformationGroup, lWorldGroup, lUserGroup], gWidth * gHeight * gDepth);

    /**
     * Controls
     */
    gInitCameraControls(lCanvasTexture.canvas, lCamera, lWorldGroup.data('viewProjectionMatrix').get());

    /*
     * Execution 
     */
    const lRenderExecutor: GpuExecution = lGpu.executor((pExecutor) => {
        lRenderPass.execute(pExecutor);
    });

    const lFpsLabel = document.getElementById('fpsCounter')!;

    // Actual execute.
    let lLastTime: number = 0;
    const lRender = (pTime: number) => {
        // Start new frame.
        lGpu.startNewFrame();

        // Generate encoder and add render commands.
        lRenderExecutor.execute();

        const lFps: number = 1000 / (pTime - lLastTime);
        (<any>window).currentFps = lFps;
        lLastTime = pTime;

        // Update FPS counter.
        lFpsLabel.textContent = lFps.toString();

        // Refresh canvas
        requestAnimationFrame(lRender);
    };
    requestAnimationFrame(lRender);
})();