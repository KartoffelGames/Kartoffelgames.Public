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
import { RenderTargets, RenderTargetsInvalidationType } from '../../source/base/pipeline/target/render-targets';
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
import lightBoxShader from './light-box-shader.wgsl';
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
        const lSpeed = 10;

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
            pCamera.transformation.addEulerRotation(0, lCurrentActionValue.get('Yaw')!, 0);
        }
        if (lCurrentActionValue.get('Pitch')! > 0 || lCurrentActionValue.get('Pitch')! < 0) {
            pCamera.transformation.addEulerRotation(lCurrentActionValue.get('Pitch')!, 0, 0);
        }
        if (lCurrentActionValue.get('RotateLeft')! > 0) {
            pCamera.transformation.addEulerRotation(0, 0, lCurrentActionValue.get('RotateLeft')!);
        }
        if (lCurrentActionValue.get('RotateRight')! > 0) {
            pCamera.transformation.addEulerRotation(0, 0, -lCurrentActionValue.get('RotateRight')!);
        }

        // Update transformation buffer.
        pCameraBuffer.writeRaw(pCamera.getMatrix(CameraMatrix.ViewProjection).dataArray);
    }, 8);
    pCanvas.addEventListener('click', () => {
        pCanvas.requestPointerLock();
    });
};


const gUpdateFpsDisplay = (() => {
    let lMaxFps: number = 0;

    return (pFps: number, pWidth: number): void => {

        const lCanvas: HTMLCanvasElement = document.getElementById('fps-display') as HTMLCanvasElement;
        const lCanvasContext: CanvasRenderingContext2D = lCanvas.getContext('2d', { willReadFrequently: true })!;

        // Update canvas width.
        if (pWidth !== lCanvas.width) {
            lCanvas.width = pWidth;
            lCanvas.height = 30;
        }

        // Get current fps image data except the first pixel column.
        const lLastFpsData: ImageData = lCanvasContext.getImageData(1, 0, lCanvas.width - 1, lCanvas.height);

        // Adjust to new fps scaling.
        let lScaling: number = 1;
        if (lMaxFps < pFps) {
            lScaling = lMaxFps / pFps;
            lMaxFps = pFps;
        }

        // now clear the right-most pixels:
        if (lScaling === 1) {
            lCanvasContext.clearRect(lCanvas.width - 1, 0, 1, lCanvas.height);
        } else {
            lCanvasContext.clearRect(0, 0, lCanvas.width, lCanvas.height);
        }

        // Put image data to left.
        const lScalingSize: number = Math.floor(lCanvas.height * lScaling);
        lCanvasContext.putImageData(lLastFpsData, 0, lCanvas.height - (lScalingSize), 0, 0, lCanvas.width - 1, lScalingSize);

        // Calculate heigt of rect.
        const lRectHeight: number = (pFps / lMaxFps) * lCanvas.height;

        // Draw current fps.
        lCanvasContext.fillStyle = '#87beee';
        lCanvasContext.fillRect(lCanvas.width - 1, lCanvas.height - lRectHeight, 1, lRectHeight);
    };
})();

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
    });

    // Resize canvas.
    (() => {
        const lCanvasWrapper: HTMLDivElement = document.querySelector('.canvas-wrapper') as HTMLDivElement;
        new ResizeObserver(() => {
            const lNewCanvasHeight: number = Math.max(0, lCanvasWrapper.clientHeight - 20);
            const lNewCanvasWidth: number = Math.max(lCanvasWrapper.clientWidth - 20, 0);

            // Resize displayed render targets.
            lRenderTargets.resize(lNewCanvasHeight, lNewCanvasWidth, 4);
        }).observe(lCanvasWrapper);
    })();

    // Create shader.
    const lWoodBoxShader = lGpu.shader(shader).setup((pShaderSetup) => {
        // Set parameter.
        pShaderSetup.parameter('animationSeconds', ComputeStage.Vertex);

        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', (pVertexParameterSetup) => {
            pVertexParameterSetup.buffer('position', PrimitiveBufferFormat.Float32, VertexParameterStepMode.Index)
                .withParameter('position', 0, PrimitiveBufferMultiplier.Vector4);

            pVertexParameterSetup.buffer('uv', PrimitiveBufferFormat.Float32, VertexParameterStepMode.Vertex)
                .withParameter('uv', 1, PrimitiveBufferMultiplier.Vector2);

            pVertexParameterSetup.buffer('normal', PrimitiveBufferFormat.Float32, VertexParameterStepMode.Vertex)
                .withParameter('normal', 2, PrimitiveBufferMultiplier.Vector4);
        });

        // Fragment entry.
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

            pBindGroupSetup.binding(1, 'timestamp', ComputeStage.Vertex)
                .withPrimitive(PrimitiveBufferFormat.Uint32, PrimitiveBufferMultiplier.Single);

            pBindGroupSetup.binding(2, 'ambientLight', ComputeStage.Fragment)
                .withStruct((pStruct) => {
                    pStruct.property('color').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);
                });

            pBindGroupSetup.binding(3, 'pointLights', ComputeStage.Fragment | ComputeStage.Vertex, StorageBindingType.Read)
                .withArray().withStruct((pStruct) => {
                    pStruct.property('position').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);
                    pStruct.property('color').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);
                    pStruct.property('range').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Single);
                });

            pBindGroupSetup.binding(4, 'debugValue', ComputeStage.Fragment, StorageBindingType.ReadWrite)
                .withPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Single);

        }));

        // User bind group
        pShaderSetup.group(2, new BindGroupLayout(lGpu, 'user').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'cubeTextureSampler', ComputeStage.Fragment)
                .withSampler(SamplerType.Filter);

            pBindGroupSetup.binding(1, 'cubeTexture', ComputeStage.Fragment)
                .withTexture(TextureDimension.TwoDimension, TextureFormat.Rgba8unorm, false);
        }));
    });

    // Create shader.
    const lLightBoxShader = lGpu.shader(lightBoxShader).setup((pShaderSetup) => {
        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', (pVertexParameterSetup) => {
            pVertexParameterSetup.buffer('position', PrimitiveBufferFormat.Float32, VertexParameterStepMode.Index)
                .withParameter('position', 0, PrimitiveBufferMultiplier.Vector4);

            pVertexParameterSetup.buffer('uv', PrimitiveBufferFormat.Float32, VertexParameterStepMode.Vertex)
                .withParameter('uv', 1, PrimitiveBufferMultiplier.Vector2);

            pVertexParameterSetup.buffer('normal', PrimitiveBufferFormat.Float32, VertexParameterStepMode.Vertex)
                .withParameter('normal', 2, PrimitiveBufferMultiplier.Vector4);
        });

        // Fragment entry.
        pShaderSetup.fragmentEntryPoint('fragment_main')
            .addRenderTarget('main', 0, PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);

        // Object bind group.
        pShaderSetup.group(0, new BindGroupLayout(lGpu, 'object').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .withPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);
        }));

        // World bind group.
        pShaderSetup.group(1, lWoodBoxShader.layout.getGroupLayout('world'));
    });

    // Create render module from shader.
    const lWoodBoxRenderModule: ShaderRenderModule = lWoodBoxShader.createRenderModule('vertex_main', 'fragment_main');
    const lLightBoxRenderModule = lLightBoxShader.createRenderModule('vertex_main', 'fragment_main');

    /*
     * Transformation and position group. 
     */
    const lWoodBoxTransformationGroup = lWoodBoxRenderModule.layout.getGroupLayout('object').create();

    // Create transformation.
    const lWoodBoxTransform: Transform = new Transform();
    lWoodBoxTransform.setScale(1, 1, 1);
    lWoodBoxTransformationGroup.data('transformationMatrix').createBuffer(new Float32Array(lWoodBoxTransform.getMatrix(TransformMatrix.Transformation).dataArray));

    // Create instance positions.
    const lCubeInstanceTransformationData: Array<number> = new Array<number>();
    for (let lWidthIndex: number = 0; lWidthIndex < gWidth; lWidthIndex++) {
        for (let lHeightIndex: number = 0; lHeightIndex < gHeight; lHeightIndex++) {
            for (let lDepthIndex: number = 0; lDepthIndex < gDepth; lDepthIndex++) {
                lCubeInstanceTransformationData.push(lWidthIndex * 3, lHeightIndex * 3, lDepthIndex * 3, 1);
            }
        }
    }
    lWoodBoxTransformationGroup.data('instancePositions').createBuffer(new Float32Array(lCubeInstanceTransformationData));

    /*
     * Transformation and position group. 
     */
    const lLightBoxTransformationGroup = lLightBoxShader.layout.getGroupLayout('object').create();

    // Create transformation.
    const lLightBoxTransform: Transform = new Transform();
    lLightBoxTransform.setScale(1, 1, 1);
    lLightBoxTransformationGroup.data('transformationMatrix').createBuffer(new Float32Array(lLightBoxTransform.getMatrix(TransformMatrix.Transformation).dataArray));

    /*
     * Camera and world group. 
     */
    const lWorldGroup = lWoodBoxRenderModule.layout.getGroupLayout('world').create();

    // Create camera perspective.
    const lPerspectiveProjection: PerspectiveProjection = new PerspectiveProjection();
    lPerspectiveProjection.aspectRatio = lRenderTargets.width / lRenderTargets.height;
    lPerspectiveProjection.angleOfView = 72;
    lPerspectiveProjection.near = 0.1;
    lPerspectiveProjection.far = 9999999;
    lRenderTargets.addInvalidationListener(() => {
        lPerspectiveProjection.aspectRatio = lRenderTargets.width / lRenderTargets.height;
    }, [RenderTargetsInvalidationType.Resize]);

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

    // Create timestamp.
    lWorldGroup.data('timestamp').createBuffer(new Uint32Array(1));
    const lTimestampBuffer: GpuBuffer<Uint32Array> = lWorldGroup.data('timestamp').get();

    // Create debug value.
    lWorldGroup.data('debugValue').createBuffer(new Float32Array(1));
    const lDebugBuffer: GpuBuffer<Uint32Array> = lWorldGroup.data('debugValue').get();
    (<any>window).debugBuffer = () => {
        lDebugBuffer.readRaw(0, 4).then((pResulto) => {
            // eslint-disable-next-line no-console
            console.log(pResulto);
        });
    };

    /*
     * User defined group.
     */
    const lWoodBoxUserGroup = lWoodBoxRenderModule.layout.getGroupLayout('user').create();

    // Setup cube texture.
    await lWoodBoxUserGroup.data('cubeTexture').createImage('/source/cube/cube-texture.png');

    // Setup Sampler.
    lWoodBoxUserGroup.data('cubeTextureSampler').createSampler();

    // Generate render parameter from parameter layout.
    const lMesh: VertexParameter = lWoodBoxRenderModule.vertexParameter.create(CubeVertexIndices);
    lMesh.set('position', CubeVertexPositionData);
    lMesh.set('uv', CubeVertexUvData);
    lMesh.set('normal', CubeVertexNormalData);

    // Create pipeline.
    const lWoodBoxPipeline: VertexFragmentPipeline = lWoodBoxRenderModule.create(lRenderTargets);
    lWoodBoxPipeline.primitiveCullMode = PrimitiveCullMode.Front;
    lWoodBoxPipeline.setParameter('animationSeconds', 3);
    (<any>window).animationSpeed = (pSeconds: number) => {
        lWoodBoxPipeline.setParameter('animationSeconds', pSeconds);
    };

    const lLightBoxPipeline: VertexFragmentPipeline = lLightBoxRenderModule.create(lRenderTargets);
    lLightBoxPipeline.primitiveCullMode = PrimitiveCullMode.Front;

    // Create instruction.
    const lRenderPass: RenderPass = lGpu.renderPass(lRenderTargets);
    lRenderPass.addStep(lWoodBoxPipeline, lMesh, [lWoodBoxTransformationGroup, lWorldGroup, lWoodBoxUserGroup], gWidth * gHeight * gDepth);
    lRenderPass.addStep(lLightBoxPipeline, lMesh, [lLightBoxTransformationGroup, lWorldGroup], lWorldGroup.data('pointLights').get<GpuBuffer>().length / 12);

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
    let lCurrentFps: number = 0;
    const lRender = (pTime: number) => {
        // Start new frame.
        lGpu.startNewFrame();

        // Update time stamp data.
        lTimestampBuffer.write([pTime], []);

        // Generate encoder and add render commands.
        lRenderExecutor.execute();

        // Generate fps and smooth fps numbers.
        const lFps: number = 1000 / (pTime - lLastTime);
        lCurrentFps = (1 - 0.05) * lCurrentFps + 0.05 * lFps;
        lLastTime = pTime;

        // Update fps display.
        gUpdateFpsDisplay(lFps, lRenderTargets.width);

        // Update FPS counter.
        lFpsLabel.textContent = lCurrentFps.toFixed(0);

        // Refresh canvas
        requestAnimationFrame(lRender);
    };
    requestAnimationFrame(lRender);
})();