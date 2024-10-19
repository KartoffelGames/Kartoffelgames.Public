import { BindGroup } from '../../source/binding/bind-group';
import { BindGroupLayout } from '../../source/binding/bind-group-layout';
import { GpuBuffer } from '../../source/buffer/gpu-buffer';
import { CompareFunction } from '../../source/constant/compare-function.enum';
import { ComputeStage } from '../../source/constant/compute-stage.enum';
import { PrimitiveCullMode } from '../../source/constant/primitive-cullmode.enum';
import { SamplerType } from '../../source/constant/sampler-type.enum';
import { StorageBindingType } from '../../source/constant/storage-binding-type.enum';
import { TextureBlendFactor } from '../../source/constant/texture-blend-factor.enum';
import { TextureBlendOperation } from '../../source/constant/texture-blend-operation.enum';
import { TextureFormat } from '../../source/constant/texture-format.enum';
import { TextureViewDimension } from '../../source/constant/texture-view-dimension.enum';
import { VertexParameterStepMode } from '../../source/constant/vertex-parameter-step-mode.enum';
import { GpuExecution } from '../../source/execution/gpu-execution';
import { RenderPass } from '../../source/execution/pass/render-pass';
import { GpuDevice } from '../../source/gpu/gpu-device';
import { PrimitiveBufferFormat } from '../../source/memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../source/memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { VertexParameter } from '../../source/pipeline/parameter/vertex-parameter';
import { RenderTargets, RenderTargetsInvalidationType } from '../../source/pipeline/target/render-targets';
import { VertexFragmentPipeline } from '../../source/pipeline/vertex-fragment-pipeline';
import { Shader } from '../../source/shader/shader';
import { ShaderRenderModule } from '../../source/shader/shader-render-module';
import { CanvasTexture } from '../../source/texture/canvas-texture';
import { GpuTexture, GpuTextureCopyOptions } from '../../source/texture/gpu-texture';
import { AmbientLight } from './camera/light/ambient-light';
import { Transform, TransformMatrix } from './camera/transform';
import { PerspectiveProjection } from './camera/view_projection/projection/perspective-projection';
import { ViewProjection } from './camera/view_projection/view-projection';
import cubeShader from './game_objects/cube/cube-shader.wgsl';
import lightBoxShader from './game_objects/light/light-box-shader.wgsl';
import skyboxShader from './game_objects/skybox/sky-box-shader.wgsl';
import videoCanvasShader from './game_objects/video_canvas/video-canvas-shader.wgsl';
import { CanvasVertexIndices, CanvasVertexNormalData, CanvasVertexPositionData, CanvasVertexUvData } from './meshes/canvas-mesh';
import { CubeVertexIndices, CubeVertexNormalData, CubeVertexPositionData, CubeVertexUvData } from './meshes/cube-mesh';
import { InitCameraControls, UpdateFpsDisplay } from './util';

const gAddCubeStep = (pGpu: GpuDevice, pRenderTargets: RenderTargets, pRenderPass: RenderPass, pWorldGroup: BindGroup) => {
    const lHeight: number = 100;
    const lWidth: number = 100;
    const lDepth: number = 100;

    // Create shader.
    const lWoodBoxShader = pGpu.shader(cubeShader).setup((pShaderSetup) => {
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
        pShaderSetup.group(0, 'object', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .withPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);

            pBindGroupSetup.binding(1, 'instancePositions', ComputeStage.Vertex, StorageBindingType.Read)
                .withArray().withPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);
        });

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);

        // User bind group
        pShaderSetup.group(2, 'user', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'cubeTextureSampler', ComputeStage.Fragment)
                .withSampler(SamplerType.Filter);

            pBindGroupSetup.binding(1, 'cubeTexture', ComputeStage.Fragment | ComputeStage.Vertex)
                .withTexture(TextureViewDimension.TwoDimensionArray, TextureFormat.Rgba8unorm);
        });
    });

    // Create render module from shader.
    const lWoodBoxRenderModule: ShaderRenderModule = lWoodBoxShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lWoodBoxTransformationGroup = lWoodBoxRenderModule.layout.getGroupLayout('object').create();

    // Create transformation.
    const lWoodBoxTransform: Transform = new Transform();
    lWoodBoxTransform.setScale(1, 1, 1);
    lWoodBoxTransformationGroup.data('transformationMatrix').createBuffer(new Float32Array(lWoodBoxTransform.getMatrix(TransformMatrix.Transformation).dataArray));

    // Create instance positions.
    const lCubeInstanceTransformationData: Array<number> = new Array<number>();
    for (let lWidthIndex: number = 0; lWidthIndex < lWidth; lWidthIndex++) {
        for (let lHeightIndex: number = 0; lHeightIndex < lHeight; lHeightIndex++) {
            for (let lDepthIndex: number = 0; lDepthIndex < lDepth; lDepthIndex++) {
                lCubeInstanceTransformationData.push(lWidthIndex * 3, lHeightIndex * 3, lDepthIndex * 3, 1);
            }
        }
    }
    lWoodBoxTransformationGroup.data('instancePositions').createBuffer(new Float32Array(lCubeInstanceTransformationData));

    /*
     * User defined group.
     */
    const lWoodBoxUserGroup = lWoodBoxRenderModule.layout.getGroupLayout('user').create();

    // Setup cube texture.
    const lImageTexture: GpuTexture = lWoodBoxUserGroup.data('cubeTexture').createTexture().texture;
    lImageTexture.depth = 3;
    lImageTexture.mipCount = 20;
    (async () => {
        const lSourceList: Array<string> = [
            '/source/game_objects/cube/texture_one/cube-texture.png',
            '/source/game_objects/cube/texture_two/cube-texture.png',
            '/source/game_objects/cube/texture_three/cube-texture.png'
        ];

        let lHeight: number = 0;
        let lWidth: number = 0;

        // "Random" colors.
        const lColorList: Array<string> = new Array<string>();
        for (let lIndex: number = 0; lIndex < 20; lIndex++) {
            lColorList.push('#' + Math.floor(Math.random() * 16777215).toString(16));
        }

        // Parallel load images.
        const lImageLoadPromiseList: Array<Promise<Array<GpuTextureCopyOptions>>> = lSourceList.map(async (pSource, pIndex: number) => {
            // Load image with html image element.
            const lImage: HTMLImageElement = new Image();
            lImage.src = pSource;
            await lImage.decode();

            // Init size.
            if (lHeight === 0 || lWidth === 0) {
                lWidth = lImage.naturalWidth;
                lHeight = lImage.naturalHeight;
            }

            // Validate same image size for all layers.
            if (lHeight !== lImage.naturalHeight || lWidth !== lImage.naturalWidth) {
                throw new Error(`Texture image layers are not the same size. (${lImage.naturalWidth}, ${lImage.naturalHeight}) needs (${lWidth}, ${lHeight}).`);
            }

            const lWaiter: Array<Promise<void>> = new Array<Promise<void>>();
            const lMipList: Array<GpuTextureCopyOptions> = new Array<GpuTextureCopyOptions>();

            // Add level one.
            lWaiter.push(createImageBitmap(lImage).then((pBitmap) => {
                lMipList.push({
                    data: pBitmap,
                    mipLevel: 0,
                    targetOrigin: { x: 0, y: 0, z: pIndex }
                });
            }));

            // Generate all mips.
            const lMaxMipCount = 1 + Math.floor(Math.log2(Math.max(lWidth, lHeight)));
            for (let lMipLevel: number = 1; lMipLevel < lMaxMipCount; lMipLevel++) {
                const lCanvas: OffscreenCanvas = new OffscreenCanvas(
                    Math.max(1, Math.floor(lWidth / Math.pow(2, lMipLevel))),
                    Math.max(1, Math.floor(lHeight / Math.pow(2, lMipLevel)))
                );

                // Fill canvas.
                const lCanvasContext: OffscreenCanvasRenderingContext2D = lCanvas.getContext('2d')!;
                lCanvasContext.globalAlpha = 1;
                lCanvasContext.drawImage(lImage, 0, 0, lWidth, lHeight, 0, 0, lCanvas.width, lCanvas.height);
                lCanvasContext.globalAlpha = 0.5;
                lCanvasContext.fillStyle = lColorList[lMipLevel];
                lCanvasContext.fillRect(0, 0, lCanvas.width, lCanvas.height);

                lWaiter.push(createImageBitmap(lCanvas).then((pBitmap) => {
                    lMipList.push({
                        data: pBitmap,
                        mipLevel: lMipLevel,
                        targetOrigin: { x: 0, y: 0, z: pIndex }
                    });
                }));
            }

            // Wait for all images to resolve.
            await Promise.all(lWaiter);

            return lMipList;
        }).flat();

        // Resolve all bitmaps.
        const lImageList: Array<GpuTextureCopyOptions> = (await Promise.all(lImageLoadPromiseList)).flat();

        // Set new texture size.
        lImageTexture.width = lWidth;
        lImageTexture.height = lHeight;
        lImageTexture.depth = lSourceList.length;

        // Copy images into texture.
        lImageTexture.copyFrom(...lImageList);
    })();

    // Setup Sampler.
    lWoodBoxUserGroup.data('cubeTextureSampler').createSampler();

    // Generate render parameter from parameter layout.
    const lMesh: VertexParameter = lWoodBoxRenderModule.vertexParameter.create(CubeVertexIndices);
    lMesh.set('position', CubeVertexPositionData);
    lMesh.set('uv', CubeVertexUvData);
    lMesh.set('normal', CubeVertexNormalData);

    // Create pipeline.
    const lWoodBoxPipeline: VertexFragmentPipeline = lWoodBoxRenderModule.create(pRenderTargets);
    lWoodBoxPipeline.primitiveCullMode = PrimitiveCullMode.Front;
    lWoodBoxPipeline.setParameter('animationSeconds', 3);
    (<any>window).animationSpeed = (pSeconds: number) => {
        lWoodBoxPipeline.setParameter('animationSeconds', pSeconds);
    };

    pRenderPass.addStep(lWoodBoxPipeline, lMesh, [lWoodBoxTransformationGroup, pWorldGroup, lWoodBoxUserGroup], lWidth * lHeight * lDepth);
};

const gAddLightBoxStep = (pGpu: GpuDevice, pRenderTargets: RenderTargets, pRenderPass: RenderPass, pWorldGroup: BindGroup): void => {
    // Create shader.
    const lLightBoxShader: Shader = pGpu.shader(lightBoxShader).setup((pShaderSetup) => {
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
        pShaderSetup.group(0, 'object', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .withPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);
        });

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);
    });

    // Create render module from shader.
    const lLightBoxRenderModule = lLightBoxShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lLightBoxTransformationGroup = lLightBoxShader.layout.getGroupLayout('object').create();

    // Create transformation.
    const lLightBoxTransform: Transform = new Transform();
    lLightBoxTransform.setScale(1, 1, 1);
    lLightBoxTransformationGroup.data('transformationMatrix').createBuffer(new Float32Array(lLightBoxTransform.getMatrix(TransformMatrix.Transformation).dataArray));

    const lLightBoxPipeline: VertexFragmentPipeline = lLightBoxRenderModule.create(pRenderTargets);
    lLightBoxPipeline.primitiveCullMode = PrimitiveCullMode.Front;

    // Generate render parameter from parameter layout.
    const lMesh: VertexParameter = lLightBoxRenderModule.vertexParameter.create(CubeVertexIndices);
    lMesh.set('position', CubeVertexPositionData);
    lMesh.set('uv', CubeVertexUvData);
    lMesh.set('normal', CubeVertexNormalData);

    pRenderPass.addStep(lLightBoxPipeline, lMesh, [lLightBoxTransformationGroup, pWorldGroup], pWorldGroup.data('pointLights').get<GpuBuffer>().length / 12);
};

const gAddSkyboxStep = (pGpu: GpuDevice, pRenderTargets: RenderTargets, pRenderPass: RenderPass, pWorldGroup: BindGroup): void => {
    const lSkyBoxShader: Shader = pGpu.shader(skyboxShader).setup((pShaderSetup) => {
        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', (pVertexParameterSetup) => {
            pVertexParameterSetup.buffer('position', PrimitiveBufferFormat.Float32, VertexParameterStepMode.Index)
                .withParameter('position', 0, PrimitiveBufferMultiplier.Vector4);
        });

        // Fragment entry.
        pShaderSetup.fragmentEntryPoint('fragment_main')
            .addRenderTarget('main', 0, PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Vector4);

        pShaderSetup.group(0, 'object', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'cubeTextureSampler', ComputeStage.Fragment)
                .withSampler(SamplerType.Filter);

            pBindGroupSetup.binding(1, 'cubeMap', ComputeStage.Fragment)
                .withTexture(TextureViewDimension.Cube, TextureFormat.Rgba8unorm);
        });

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);
    });

    // Create render module from shader.
    const lSkyBoxRenderModule = lSkyBoxShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lSkyBoxTextureGroup = lSkyBoxShader.layout.getGroupLayout('object').create();

    const lImageTexture: GpuTexture = lSkyBoxTextureGroup.data('cubeMap').createTexture().texture;
    lImageTexture.depth = 6;
    (async () => {
        const lSourceList: Array<string> = [
            '/source/game_objects/skybox/right.jpg',
            '/source/game_objects/skybox/left.jpg',
            '/source/game_objects/skybox/top.jpg',
            '/source/game_objects/skybox/bottom.jpg',
            '/source/game_objects/skybox/front.jpg',
            '/source/game_objects/skybox/back.jpg'
        ];

        let lHeight: number = 0;
        let lWidth: number = 0;

        // Parallel load images.
        const lImageLoadPromiseList: Array<Promise<ImageBitmap>> = lSourceList.map(async (pSource) => {
            // Load image with html image element.
            const lImage: HTMLImageElement = new Image();
            lImage.src = pSource;
            await lImage.decode();

            // Init size.
            if (lHeight === 0 || lWidth === 0) {
                lWidth = lImage.naturalWidth;
                lHeight = lImage.naturalHeight;
            }

            // Validate same image size for all layers.
            if (lHeight !== lImage.naturalHeight || lWidth !== lImage.naturalWidth) {
                throw new Error(`Texture image layers are not the same size. (${lImage.naturalWidth}, ${lImage.naturalHeight}) needs (${lWidth}, ${lHeight}).`);
            }

            return createImageBitmap(lImage);
        });

        // Resolve all bitmaps.
        const lImageList: Array<ImageBitmap> = await Promise.all(lImageLoadPromiseList);

        // Set new texture size.
        lImageTexture.width = lWidth;
        lImageTexture.height = lHeight;
        lImageTexture.depth = lSourceList.length;

        // Copy images into texture.
        lImageTexture.copyFrom(...lImageList);
    })();

    // Setup Sampler.
    lSkyBoxTextureGroup.data('cubeTextureSampler').createSampler();

    // Generate render parameter from parameter layout.
    const lMesh: VertexParameter = lSkyBoxRenderModule.vertexParameter.create(CubeVertexIndices);
    lMesh.set('position', CubeVertexPositionData);

    const lSkyBoxPipeline: VertexFragmentPipeline = lSkyBoxRenderModule.create(pRenderTargets);
    lSkyBoxPipeline.primitiveCullMode = PrimitiveCullMode.Back;
    lSkyBoxPipeline.depthCompare = CompareFunction.Allways;
    lSkyBoxPipeline.writeDepth = false;

    pRenderPass.addStep(lSkyBoxPipeline, lMesh, [lSkyBoxTextureGroup, pWorldGroup]);
};

const gAddVideoCanvasStep = (pGpu: GpuDevice, pRenderTargets: RenderTargets, pRenderPass: RenderPass, pWorldGroup: BindGroup) => {
    // Create shader.
    const lWoodBoxShader = pGpu.shader(videoCanvasShader).setup((pShaderSetup) => {
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
        pShaderSetup.group(0, 'object', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .withPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);
        });

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);

        // User bind group
        pShaderSetup.group(2, 'user', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'videoTextureSampler', ComputeStage.Fragment)
                .withSampler(SamplerType.Filter);

            pBindGroupSetup.binding(1, 'videoTexture', ComputeStage.Fragment)
                .withTexture(TextureViewDimension.TwoDimension, TextureFormat.Rgba8unorm);
        });
    });

    // Create render module from shader.
    const lWoodBoxRenderModule: ShaderRenderModule = lWoodBoxShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lTransformationGroup = lWoodBoxRenderModule.layout.getGroupLayout('object').create();

    // Create transformation.
    const lWoodBoxTransform: Transform = new Transform();
    lWoodBoxTransform.setScale(15, 8.4, 0);
    lWoodBoxTransform.addTranslation(-0.5, -0.5, 100);
    lTransformationGroup.data('transformationMatrix').createBuffer(new Float32Array(lWoodBoxTransform.getMatrix(TransformMatrix.Transformation).dataArray));

    /*
     * User defined group.
     */
    const lUserGroup = lWoodBoxRenderModule.layout.getGroupLayout('user').create();

    // Setup cube texture.
    const lVideoTexture: GpuTexture = lUserGroup.data('videoTexture').createTexture().texture;

    // Create video.
    const lVideo = document.createElement('video');
    lVideo.preload = 'auto';
    lVideo.loop = true;
    lVideo.muted = true; // Allways muted.
    lVideo.src = '/source/game_objects/video_canvas/earth.mp4';
    lVideo.addEventListener('resize', () => {
        lVideoTexture.height = Math.max(lVideo.videoHeight, 1);
        lVideoTexture.width = Math.max(lVideo.videoWidth, 1);
    });
    lVideo.play();

    let lTimeStamp: number = performance.now();
    pGpu.addFrameChangeListener(() => {
        // Has at least one frame buffered.
        if (lVideo.readyState > 1) {
            const lFrameTimeStamp: number = performance.now();
            createImageBitmap(lVideo).then((pImageBitmap) => {
                if (lFrameTimeStamp < lTimeStamp) {
                    return;
                }

                lTimeStamp = lFrameTimeStamp;
                lVideoTexture.copyFrom(pImageBitmap);
            });
        }
    });

    // Setup Sampler.
    lUserGroup.data('videoTextureSampler').createSampler();

    // Generate render parameter from parameter layout.
    const lMesh: VertexParameter = lWoodBoxRenderModule.vertexParameter.create(CanvasVertexIndices);
    lMesh.set('position', CanvasVertexPositionData);
    lMesh.set('uv', CanvasVertexUvData);
    lMesh.set('normal', CanvasVertexNormalData);

    // Create pipeline.
    const lPipeline: VertexFragmentPipeline = lWoodBoxRenderModule.create(pRenderTargets);
    lPipeline.primitiveCullMode = PrimitiveCullMode.None;
    lPipeline.writeDepth = false;
    lPipeline.targetConfig('color').alphaBlend(TextureBlendOperation.Add, TextureBlendFactor.One, TextureBlendFactor.OneMinusSrcAlpha);
    lPipeline.targetConfig('color').colorBlend(TextureBlendOperation.Add, TextureBlendFactor.SrcAlpha, TextureBlendFactor.OneMinusSrcAlpha);

    pRenderPass.addStep(lPipeline, lMesh, [lTransformationGroup, pWorldGroup, lUserGroup]);
};

const gGenerateWorldBindGroup = (pGpu: GpuDevice): BindGroup => {
    const lWorldGroupLayout = new BindGroupLayout(pGpu, 'world').setup((pBindGroupSetup) => {
        pBindGroupSetup.binding(0, 'camera', ComputeStage.Vertex).withStruct((pStructSetup) => {
            pStructSetup.property('viewProjection').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);
            pStructSetup.property('view').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);
            pStructSetup.property('projection').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);

            pStructSetup.property('translation').asStruct((pTranslationStruct) => {
                pTranslationStruct.property('rotation').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);
                pTranslationStruct.property('translation').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);
            });

            pStructSetup.property('invertedTranslation').asStruct((pTranslationStruct) => {
                pTranslationStruct.property('rotation').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);
                pTranslationStruct.property('translation').asPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Matrix44);
            });
        });

        pBindGroupSetup.binding(1, 'timestamp', ComputeStage.Vertex | ComputeStage.Fragment)
            .withPrimitive(PrimitiveBufferFormat.Float32, PrimitiveBufferMultiplier.Single);

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

    });

    /*
     * Camera and world group. 
     */
    const lWorldGroup: BindGroup = lWorldGroupLayout.create();
    lWorldGroup.data('camera').createBuffer(PrimitiveBufferFormat.Float32);

    // Create ambient light.
    const lAmbientLight: AmbientLight = new AmbientLight();
    lAmbientLight.setColor(0.3, 0.3, 0.3);
    lWorldGroup.data('ambientLight').createBuffer(new Float32Array(lAmbientLight.data));

    // Create point lights.
    lWorldGroup.data('pointLights').createBuffer(new Float32Array([
        /* Position */1, 1, 1, 1, /* Color */1, 0, 0, 1,/* Range */ 200, 0, 0, 0,
        /* Position */10, 10, 10, 1, /* Color */0, 0, 1, 1,/* Range */ 200, 0, 0, 0,
        /* Position */-10, 10, 10, 1, /* Color */0, 1, 0, 1,/* Range */ 200, 0, 0, 0
    ]));

    // Create timestamp.
    lWorldGroup.data('timestamp').createBuffer(new Float32Array(1));


    // Create debug value.
    lWorldGroup.data('debugValue').createBuffer(new Float32Array(1));
    const lDebugBuffer: GpuBuffer<Uint32Array> = lWorldGroup.data('debugValue').get();
    (<any>window).debugBuffer = () => {
        lDebugBuffer.readRaw(0, 4).then((pResulto) => {
            // eslint-disable-next-line no-console
            console.log(pResulto);
        });
    };

    return lWorldGroup;
};

(async () => {
    const lGpu: GpuDevice = await GpuDevice.request('high-performance');

    // Create canvas.
    const lCanvasTexture: CanvasTexture = lGpu.canvas(document.getElementById('canvas') as HTMLCanvasElement);

    // Create and configure render targets.
    const lRenderTargets: RenderTargets = lGpu.renderTargets(false).setup((pSetup) => {
        // Add "color" target and init new texture.
        pSetup.addColor('color', 0, true, { r: 0, g: 1, b: 0, a: 0 })
            .new(TextureFormat.Bgra8unorm, lCanvasTexture);

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
            lRenderTargets.resize(lNewCanvasHeight, lNewCanvasWidth);
        }).observe(lCanvasWrapper);
    })();

    // Create camera perspective.
    const lPerspectiveProjection: PerspectiveProjection = new PerspectiveProjection();
    lPerspectiveProjection.aspectRatio = lRenderTargets.width / lRenderTargets.height;
    lPerspectiveProjection.angleOfView = 72;
    lPerspectiveProjection.near = 0.1;
    lPerspectiveProjection.far = Number.MAX_SAFE_INTEGER;
    lRenderTargets.addInvalidationListener(() => {
        lPerspectiveProjection.aspectRatio = lRenderTargets.width / lRenderTargets.height;
    }, [RenderTargetsInvalidationType.Resize]);

    // Create camera.
    const lCamera: ViewProjection = new ViewProjection(lPerspectiveProjection);
    lCamera.transformation.setTranslation(0, 0, -4);

    const lWorldGroup: BindGroup = gGenerateWorldBindGroup(lGpu);
    const lTimestampBuffer: GpuBuffer<Float32Array> = lWorldGroup.data('timestamp').get();

    // Create instruction.
    const lRenderPass: RenderPass = lGpu.renderPass(lRenderTargets);
    gAddSkyboxStep(lGpu, lRenderTargets, lRenderPass, lWorldGroup);
    gAddCubeStep(lGpu, lRenderTargets, lRenderPass, lWorldGroup);
    gAddLightBoxStep(lGpu, lRenderTargets, lRenderPass, lWorldGroup);
    gAddVideoCanvasStep(lGpu, lRenderTargets, lRenderPass, lWorldGroup);

    /**
     * Controls
     */
    InitCameraControls(lCanvasTexture.canvas, lCamera, lWorldGroup);

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
        lTimestampBuffer.write([pTime / 1000], []);

        // Generate encoder and add render commands.
        lRenderExecutor.execute();

        // Generate fps and smooth fps numbers.
        const lFps: number = 1000 / (pTime - lLastTime);
        lCurrentFps = (1 - 0.05) * lCurrentFps + 0.05 * lFps;
        lLastTime = pTime;

        // Update fps display.
        UpdateFpsDisplay(lFps, lRenderTargets.width);

        // Update FPS counter.
        lFpsLabel.textContent = lCurrentFps.toFixed(0);

        // Refresh canvas
        requestAnimationFrame(lRender);
    };
    requestAnimationFrame(lRender);
})();