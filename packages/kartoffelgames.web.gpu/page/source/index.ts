import { GpuBuffer } from '../../source/buffer/gpu-buffer.ts';
import { GpuBufferView } from '../../source/buffer/gpu-buffer-view.ts';
import { BufferItemFormat } from '../../source/constant/buffer-item-format.enum.ts';
import { BufferItemMultiplier } from '../../source/constant/buffer-item-multiplier.enum.ts';
import { CompareFunction } from '../../source/constant/compare-function.enum.ts';
import { ComputeStage } from '../../source/constant/compute-stage.enum.ts';
import { GpuFeature } from '../../source/constant/gpu-feature.enum.ts';
import { PrimitiveCullMode } from '../../source/constant/primitive-cullmode.enum.ts';
import { SamplerType } from '../../source/constant/sampler-type.enum.ts';
import { StorageBindingType } from '../../source/constant/storage-binding-type.enum.ts';
import { TextureBlendFactor } from '../../source/constant/texture-blend-factor.enum.ts';
import { TextureBlendOperation } from '../../source/constant/texture-blend-operation.enum.ts';
import { TextureFormat } from '../../source/constant/texture-format.enum.ts';
import { TextureViewDimension } from '../../source/constant/texture-view-dimension.enum.ts';
import { VertexParameterStepMode } from '../../source/constant/vertex-parameter-step-mode.enum.ts';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { GpuExecution } from '../../source/execution/gpu-execution.ts';
import { ComputePass } from '../../source/execution/pass/compute-pass.ts';
import { RenderPass } from '../../source/execution/pass/render-pass.ts';
import { BindGroup } from '../../source/pipeline/bind_group/bind-group.ts';
import { BindGroupLayout } from '../../source/pipeline/bind_group_layout/bind-group-layout.ts';
import { ComputePipeline } from '../../source/pipeline/compute-pipeline.ts';
import { PipelineData } from '../../source/pipeline/pipeline_data/pipeline-data.ts';
import { RenderTargets, RenderTargetsInvalidationType } from '../../source/pipeline/render_targets/render-targets.ts';
import { VertexFragmentPipeline } from '../../source/pipeline/vertex_fragment_pipeline/vertex-fragment-pipeline.ts';
import { VertexParameter } from '../../source/pipeline/vertex_parameter/vertex-parameter.ts';
import { Shader } from '../../source/shader/shader.ts';
import { ShaderRenderModule } from '../../source/shader/shader-render-module.ts';
import { CanvasTexture } from '../../source/texture/canvas-texture.ts';
import { GpuTexture, GpuTextureCopyOptions } from '../../source/texture/gpu-texture.ts';
import { AmbientLight } from './camera/light/ambient-light.ts';
import { Transform, TransformMatrix } from './camera/transform.ts';
import { PerspectiveProjection } from './camera/view_projection/projection/perspective-projection.ts';
import { ViewProjection } from './camera/view_projection/view-projection.ts';
import colorCubeShader from './game_objects/color_cube/color-cube-shader.wgsl';
import cubeShader from './game_objects/cube/cube-shader.wgsl';
import particleComputeShader from './game_objects/leaf_particle/particle-compute-shader.wgsl';
import particleShader from './game_objects/leaf_particle/particle-shader.wgsl';
import lightBoxShader from './game_objects/light/light-box-shader.wgsl';
import skyboxShader from './game_objects/skybox/sky-box-shader.wgsl';
import videoCanvasShader from './game_objects/video_canvas/video-canvas-shader.wgsl';
import { CanvasVertexIndices, CanvasVertexNormalData, CanvasVertexPositionData, CanvasVertexUvData } from './meshes/canvas-mesh.ts';
import { CubeVertexIndices, CubeVertexNormalData, CubeVertexPositionData, CubeVertexUvData } from './meshes/cube-mesh.ts';
import { ParticleVertexIndices, ParticleVertexPositionUvData } from './meshes/particle-mesh.ts';
import { InitCameraControls, UpdateFpsDisplay } from './util.ts';

const gGenerateCubeStep = (pGpu: GpuDevice, pRenderTargets: RenderTargets, pWorldGroup: BindGroup): RenderInstruction => {
    const lHeight: number = 50;
    const lWidth: number = 50;
    const lDepth: number = 50;

    // Create shader.
    const lWoodBoxShader = pGpu.shader(cubeShader).setup((pShaderSetup) => {
        // Set parameter.
        pShaderSetup.parameter('animationSeconds', ComputeStage.Vertex);

        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', (pVertexParameterSetup) => {
            pVertexParameterSetup.buffer('position', VertexParameterStepMode.Index)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

            pVertexParameterSetup.buffer('uv', VertexParameterStepMode.Vertex)
                .withParameter('uv', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector2);

            pVertexParameterSetup.buffer('normal', VertexParameterStepMode.Vertex)
                .withParameter('normal', 2, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        });

        // Fragment entry.
        pShaderSetup.fragmentEntryPoint('fragment_main')
            .addRenderTarget('main', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

        // Object bind group.
        pShaderSetup.group(0, 'object', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .asBuffer().withPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Matrix44);

            pBindGroupSetup.binding(1, 'instancePositions', ComputeStage.Vertex, StorageBindingType.Read)
                .asBuffer().withArray().withPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        });

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);

        // User bind group
        pShaderSetup.group(2, 'user', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'cubeTextureSampler', ComputeStage.Fragment)
                .asSampler(SamplerType.Filter);

            pBindGroupSetup.binding(1, 'cubeTexture', ComputeStage.Fragment | ComputeStage.Vertex)
                .asTexture(TextureViewDimension.TwoDimensionArray, TextureFormat.Rgba8unorm);
        });
    });

    // Create render module from shader.
    const lWoodBoxRenderModule: ShaderRenderModule = lWoodBoxShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lWoodBoxTransformationGroup = lWoodBoxRenderModule.layout.getGroupLayout('object').create();

    // Create transformation.
    lWoodBoxTransformationGroup.data('transformationMatrix').createBuffer(new Transform().setScale(1, 1, 1).getMatrix(TransformMatrix.Transformation).dataArray);

    // Create instance positions.
    const lCubeInstanceTransformationData: Array<number> = new Array<number>();
    for (let lWidthIndex: number = 0; lWidthIndex < lWidth; lWidthIndex++) {
        for (let lHeightIndex: number = 0; lHeightIndex < lHeight; lHeightIndex++) {
            for (let lDepthIndex: number = 0; lDepthIndex < lDepth; lDepthIndex++) {
                lCubeInstanceTransformationData.push(lWidthIndex * 3, lHeightIndex * 3, lDepthIndex * 3, 1);
            }
        }
    }
    lWoodBoxTransformationGroup.data('instancePositions').createBuffer(lCubeInstanceTransformationData);

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

        // Test for keeping information on resize.
        lImageTexture.width = lImageTexture.width * 2;
        lImageTexture.native;
        lImageTexture.width = lImageTexture.width / 2;
    })();

    // Setup Sampler.
    lWoodBoxUserGroup.data('cubeTextureSampler').createSampler();

    // Generate render parameter from parameter layout.
    const lMesh: VertexParameter = lWoodBoxRenderModule.vertexParameter.create(CubeVertexIndices);
    lMesh.create('position', CubeVertexPositionData);
    lMesh.create('uv', CubeVertexUvData);
    lMesh.create('normal', CubeVertexNormalData);

    // Create pipeline.
    const lWoodBoxPipeline: VertexFragmentPipeline = lWoodBoxRenderModule.create(pRenderTargets);
    lWoodBoxPipeline.primitiveCullMode = PrimitiveCullMode.Front;
    lWoodBoxPipeline.setParameter('animationSeconds', 3);
    (<any>window).animationSpeed = (pSeconds: number) => {
        lWoodBoxPipeline.setParameter('animationSeconds', pSeconds);
    };

    return {
        pipeline: lWoodBoxPipeline,
        parameter: lMesh,
        instanceCount: lWidth * lHeight * lDepth,
        data: lWoodBoxPipeline.layout.withData((pSetup) => {
            pSetup.addGroup(lWoodBoxTransformationGroup);
            pSetup.addGroup(pWorldGroup);
            pSetup.addGroup(lWoodBoxUserGroup);
        })
    };
};

const gGenerateColorCubeStep = (pGpu: GpuDevice, pRenderTargets: RenderTargets, pWorldGroup: BindGroup): Array<RenderInstruction> => {
    // Create shader.
    const lColorBoxShader = pGpu.shader(colorCubeShader).setup((pShaderSetup) => {
        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', (pVertexParameterSetup) => {
            pVertexParameterSetup.buffer('position', VertexParameterStepMode.Index)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

            pVertexParameterSetup.buffer('normal', VertexParameterStepMode.Vertex)
                .withParameter('normal', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        });

        // Fragment entry.
        pShaderSetup.fragmentEntryPoint('fragment_main')
            .addRenderTarget('main', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

        // Object bind group.
        pShaderSetup.group(0, 'object', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .asBuffer(true).withPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Matrix44);

            pBindGroupSetup.binding(1, 'color', ComputeStage.Vertex)
                .asBuffer(true).withPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        });

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);
    });

    // Create render module from shader.
    const lWoodBoxRenderModule: ShaderRenderModule = lColorBoxShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lColorBoxTransformationGroup = lWoodBoxRenderModule.layout.getGroupLayout('object').create();

    // Create transformation.
    lColorBoxTransformationGroup.data('transformationMatrix').createBuffer(3);
    lColorBoxTransformationGroup.data('transformationMatrix').asBufferView(Float32Array, 0).write(new Transform().setScale(1, 1, 1).setTranslation(2, -30, 5).getMatrix(TransformMatrix.Transformation).dataArray);
    lColorBoxTransformationGroup.data('transformationMatrix').asBufferView(Float32Array, 1).write(new Transform().setScale(1, 1, 1).setTranslation(0, -30, 5).getMatrix(TransformMatrix.Transformation).dataArray);
    lColorBoxTransformationGroup.data('transformationMatrix').asBufferView(Float32Array, 2).write(new Transform().setScale(1, 1, 1).setTranslation(-2, -30, 5).getMatrix(TransformMatrix.Transformation).dataArray);

    // Setup cube texture.
    lColorBoxTransformationGroup.data('color').createBuffer([
        /* Color 1*/ 0.89, 0.74, 0.00, 1,
        /* Color 2*/ 0.92, 0.48, 0.14, 1
    ]);

    // Generate render parameter from parameter layout.
    const lMesh: VertexParameter = lWoodBoxRenderModule.vertexParameter.create(CubeVertexIndices);
    lMesh.create('position', CubeVertexPositionData);
    lMesh.create('normal', CubeVertexNormalData);

    // Create pipeline.
    const lColorBoxPipeline: VertexFragmentPipeline = lWoodBoxRenderModule.create(pRenderTargets);
    lColorBoxPipeline.primitiveCullMode = PrimitiveCullMode.Front;

    return [{
        pipeline: lColorBoxPipeline,
        parameter: lMesh,
        instanceCount: 1,
        data: lColorBoxPipeline.layout.withData((pSetup) => {
            pSetup.addGroup(lColorBoxTransformationGroup)
                .withOffset('color', 0)
                .withOffset('transformationMatrix', 0);
            pSetup.addGroup(pWorldGroup);
        })
    },
    {
        pipeline: lColorBoxPipeline,
        parameter: lMesh,
        instanceCount: 1,
        data: lColorBoxPipeline.layout.withData((pSetup) => {
            pSetup.addGroup(lColorBoxTransformationGroup)
                .withOffset('color', 1)
                .withOffset('transformationMatrix', 1);
            pSetup.addGroup(pWorldGroup);
        })
    },
    {
        pipeline: lColorBoxPipeline,
        parameter: lMesh,
        instanceCount: 1,
        data: lColorBoxPipeline.layout.withData((pSetup) => {
            pSetup.addGroup(lColorBoxTransformationGroup)
                .withOffset('color', 0)
                .withOffset('transformationMatrix', 2);
            pSetup.addGroup(pWorldGroup);
        })
    }];
};

const gGenerateLightBoxStep = (pGpu: GpuDevice, pRenderTargets: RenderTargets, pWorldGroup: BindGroup): RenderInstruction => {
    // Create shader.
    const lLightBoxShader: Shader = pGpu.shader(lightBoxShader).setup((pShaderSetup) => {
        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', (pVertexParameterSetup) => {
            pVertexParameterSetup.buffer('position', VertexParameterStepMode.Index)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

            pVertexParameterSetup.buffer('uv', VertexParameterStepMode.Vertex)
                .withParameter('uv', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector2);

            pVertexParameterSetup.buffer('normal', VertexParameterStepMode.Vertex)
                .withParameter('normal', 2, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        });

        // Fragment entry.
        pShaderSetup.fragmentEntryPoint('fragment_main')
            .addRenderTarget('main', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

        // Object bind group.
        pShaderSetup.group(0, 'object', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .asBuffer().withPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Matrix44);
        });

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);
    });

    // Create render module from shader.
    const lLightBoxRenderModule = lLightBoxShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lLightBoxTransformationGroup = lLightBoxShader.layout.getGroupLayout('object').create();

    // Create transformation.
    lLightBoxTransformationGroup.data('transformationMatrix').createBuffer(new Transform().setScale(1, 1, 1).getMatrix(TransformMatrix.Transformation).dataArray);

    const lLightBoxPipeline: VertexFragmentPipeline = lLightBoxRenderModule.create(pRenderTargets);
    lLightBoxPipeline.primitiveCullMode = PrimitiveCullMode.Front;

    // Generate render parameter from parameter layout.
    const lMesh: VertexParameter = lLightBoxRenderModule.vertexParameter.create(CubeVertexIndices);
    lMesh.create('position', CubeVertexPositionData);
    lMesh.create('uv', CubeVertexUvData);
    lMesh.create('normal', CubeVertexNormalData);

    // Create buffer view for pointlights.
    const lPointLightsBuffer: GpuBufferView<Float32Array> = pWorldGroup.data('pointLights').asBufferView(Float32Array);

    return {
        pipeline: lLightBoxPipeline,
        parameter: lMesh,
        instanceCount: lPointLightsBuffer.length / 12,
        data: lLightBoxPipeline.layout.withData((pSetup) => {
            pSetup.addGroup(lLightBoxTransformationGroup);
            pSetup.addGroup(pWorldGroup);
        })
    };
};

const gGenerateSkyboxStep = (pGpu: GpuDevice, pRenderTargets: RenderTargets, pWorldGroup: BindGroup): RenderInstruction => {
    const lSkyBoxShader: Shader = pGpu.shader(skyboxShader).setup((pShaderSetup) => {
        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', (pVertexParameterSetup) => {
            pVertexParameterSetup.buffer('position', VertexParameterStepMode.Index)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        });

        // Fragment entry.
        pShaderSetup.fragmentEntryPoint('fragment_main')
            .addRenderTarget('main', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

        pShaderSetup.group(0, 'object', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'cubeTextureSampler', ComputeStage.Fragment)
                .asSampler(SamplerType.Filter);

            pBindGroupSetup.binding(1, 'cubeMap', ComputeStage.Fragment)
                .asTexture(TextureViewDimension.Cube, TextureFormat.Rgba8unorm);
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
    lMesh.create('position', CubeVertexPositionData);

    const lSkyBoxPipeline: VertexFragmentPipeline = lSkyBoxRenderModule.create(pRenderTargets);
    lSkyBoxPipeline.primitiveCullMode = PrimitiveCullMode.Back;
    lSkyBoxPipeline.depthConfig().enableWrite(false).compareWith(CompareFunction.Allways);

    return {
        pipeline: lSkyBoxPipeline,
        parameter: lMesh,
        instanceCount: 1,
        data: lSkyBoxPipeline.layout.withData((pSetup) => {
            pSetup.addGroup(lSkyBoxTextureGroup);
            pSetup.addGroup(pWorldGroup);
        })
    };
};

const gGenerateVideoCanvasStep = (pGpu: GpuDevice, pRenderTargets: RenderTargets, pWorldGroup: BindGroup): RenderInstruction => {
    // Create shader.
    const lWoodBoxShader = pGpu.shader(videoCanvasShader).setup((pShaderSetup) => {
        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', (pVertexParameterSetup) => {
            pVertexParameterSetup.buffer('position', VertexParameterStepMode.Index)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

            pVertexParameterSetup.buffer('uv', VertexParameterStepMode.Vertex)
                .withParameter('uv', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector2);

            pVertexParameterSetup.buffer('normal', VertexParameterStepMode.Vertex)
                .withParameter('normal', 2, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        });

        // Fragment entry.
        pShaderSetup.fragmentEntryPoint('fragment_main')
            .addRenderTarget('main', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

        // Object bind group.
        pShaderSetup.group(0, 'object', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .asBuffer().withPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Matrix44);
        });

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);

        // User bind group
        pShaderSetup.group(2, 'user', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'videoTextureSampler', ComputeStage.Fragment)
                .asSampler(SamplerType.Filter);

            pBindGroupSetup.binding(1, 'videoTexture', ComputeStage.Fragment)
                .asTexture(TextureViewDimension.TwoDimension, TextureFormat.Rgba8unorm);
        });
    });

    // Create render module from shader.
    const lWoodBoxRenderModule: ShaderRenderModule = lWoodBoxShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lTransformationGroup = lWoodBoxRenderModule.layout.getGroupLayout('object').create();

    // Create transformation.
    lTransformationGroup.data('transformationMatrix').createBuffer(new Transform().addTranslation(-0.5, -0.5, 100).setScale(15, 8.4, 0).getMatrix(TransformMatrix.Transformation).dataArray);

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
    lMesh.create('position', CanvasVertexPositionData);
    lMesh.create('uv', CanvasVertexUvData);
    lMesh.create('normal', CanvasVertexNormalData);

    // Create pipeline.
    const lPipeline: VertexFragmentPipeline = lWoodBoxRenderModule.create(pRenderTargets);
    lPipeline.primitiveCullMode = PrimitiveCullMode.None;
    lPipeline.depthConfig().enableWrite(false);
    lPipeline.targetConfig('color')
        .alphaBlend(TextureBlendOperation.Add, TextureBlendFactor.One, TextureBlendFactor.OneMinusSrcAlpha)
        .colorBlend(TextureBlendOperation.Add, TextureBlendFactor.SrcAlpha, TextureBlendFactor.OneMinusSrcAlpha);

    return {
        pipeline: lPipeline,
        parameter: lMesh,
        instanceCount: 1,
        data: lPipeline.layout.withData((pSetup) => {
            pSetup.addGroup(lTransformationGroup);
            pSetup.addGroup(pWorldGroup);
            pSetup.addGroup(lUserGroup);
        })
    };
};

const gGenerateParticleStep = (pGpu: GpuDevice, pRenderTargets: RenderTargets, pWorldGroup: BindGroup): [RenderInstruction, ComputeInstruction] => {
    const lMaxParticleCount: number = 18000;

    const lParticleRenderShader: Shader = pGpu.shader(particleShader).setup((pShaderSetup) => {
        // Set parameter.
        pShaderSetup.parameter('animationSeconds', ComputeStage.Vertex);

        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', (pVertexParameterSetup) => {
            pVertexParameterSetup.buffer('position-uv', VertexParameterStepMode.Index)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4)
                .withParameter('uv', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector2);
        });

        // Fragment entry.
        pShaderSetup.fragmentEntryPoint('fragment_main')
            .addRenderTarget('main', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

        // Compute entry.
        pShaderSetup.computeEntryPoint('compute_main').size(64);

        // Object bind group.
        pShaderSetup.group(0, 'object', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .asBuffer().withPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Matrix44);
            pBindGroupSetup.binding(1, 'particles', ComputeStage.Vertex, StorageBindingType.Read)
                .asBuffer().withArray().withStruct((pStructSetup) => {
                    pStructSetup.property('position').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
                    pStructSetup.property('rotation').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
                    pStructSetup.property('velocity').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
                    pStructSetup.property('lifetime').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Single);
                });
        });

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);

        pShaderSetup.group(2, 'user', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'textureSampler', ComputeStage.Fragment)
                .asSampler(SamplerType.Filter);

            pBindGroupSetup.binding(1, 'texture', ComputeStage.Fragment)
                .asTexture(TextureViewDimension.TwoDimension, TextureFormat.Rgba8unorm);
        });
    });

    // Create render module from shader.
    const lParticleRenderModule = lParticleRenderShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lParticleInformationGroup = lParticleRenderModule.layout.getGroupLayout('object').create();
    lParticleInformationGroup.data('particles').createBuffer(lMaxParticleCount);

    // Create transformation.
    lParticleInformationGroup.data('transformationMatrix').createBuffer(new Transform().setScale(0.02, 0.02, 0.02).getMatrix(TransformMatrix.Transformation).dataArray);

    // Transformation and position group. 
    const lParticleTextureGroup = lParticleRenderShader.layout.getGroupLayout('user').create();

    const lImageTexture: GpuTexture = lParticleTextureGroup.data('texture').createTexture().texture;
    lImageTexture.depth = 6;
    (async () => {
        const lSourceList: Array<string> = [
            '/source/game_objects/leaf_particle/leaf.png'
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
    lParticleTextureGroup.data('textureSampler').createSampler();

    // Generate render parameter from parameter layout.
    const lMesh: VertexParameter = lParticleRenderModule.vertexParameter.create(ParticleVertexIndices);
    lMesh.create('position-uv', ParticleVertexPositionUvData);

    const lParticlePipeline: VertexFragmentPipeline = lParticleRenderModule.create(pRenderTargets);
    lParticlePipeline.primitiveCullMode = PrimitiveCullMode.None;
    lParticlePipeline.depthConfig().enableWrite(true).compareWith(CompareFunction.Less);
    lParticlePipeline.targetConfig('color')
        .alphaBlend(TextureBlendOperation.Add, TextureBlendFactor.One, TextureBlendFactor.OneMinusSrcAlpha)
        .colorBlend(TextureBlendOperation.Add, TextureBlendFactor.SrcAlpha, TextureBlendFactor.OneMinusSrcAlpha);

    // vertexCount: GPUSize32, instanceCount?: GPUSize32, firstVertex?: GPUSize32, firstInstance?: GPUSize32    
    const lIndirectionBuffer: GpuBuffer = new GpuBuffer(pGpu, 4 * 4).initialData(new Uint32Array([ParticleVertexIndices.length, 0, 0, 0]).buffer);

    const lRenderInstruction: RenderInstruction = {
        pipeline: lParticlePipeline,
        parameter: lMesh,
        instanceCount: 0,
        data: lParticlePipeline.layout.withData((pSetup) => {
            pSetup.addGroup(lParticleTextureGroup);
            pSetup.addGroup(pWorldGroup);
            pSetup.addGroup(lParticleInformationGroup);
        }),
        indirectBuffer: lIndirectionBuffer
    };

    /*
     * Compute shader.
     */
    const lParticleComputeShader: Shader = pGpu.shader(particleComputeShader).setup((pShaderSetup) => {
        // Set parameter.
        pShaderSetup.parameter('animationSeconds', ComputeStage.Vertex);

        // Compute entry.
        pShaderSetup.computeEntryPoint('compute_main').size(64);

        // Object bind group.
        pShaderSetup.group(0, 'object', (pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'particles', ComputeStage.Compute, StorageBindingType.ReadWrite)
                .asBuffer().withArray().withStruct((pStructSetup) => {
                    pStructSetup.property('position').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
                    pStructSetup.property('rotation').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
                    pStructSetup.property('velocity').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
                    pStructSetup.property('lifetime').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Single);
                });

            pBindGroupSetup.binding(1, 'indirect', ComputeStage.Compute, StorageBindingType.ReadWrite)
                .asBuffer().withPrimitive(BufferItemFormat.Uint32, BufferItemMultiplier.Vector4);
        });

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);
    });

    // Create render module from shader.
    const lParticleComputeModule = lParticleComputeShader.createComputeModule('compute_main');

    // Create compute pipeline.
    const lComputePipeline: ComputePipeline = new ComputePipeline(pGpu, lParticleComputeModule);
    lComputePipeline.setParameter('animationSeconds', 30);

    // Transformation and position group. 
    const lParticleComputeInformationGroup = lParticleComputeModule.layout.getGroupLayout('object').create();
    lParticleComputeInformationGroup.data('particles').set(lParticleInformationGroup.data('particles').getRaw());
    lParticleComputeInformationGroup.data('indirect').set(lIndirectionBuffer);

    // Create compute instruction
    const lComputeInstruction: ComputeInstruction = {
        pipeline: lComputePipeline,
        data: lComputePipeline.layout.withData((pSetup) => {
            pSetup.addGroup(lParticleComputeInformationGroup);
            pSetup.addGroup(pWorldGroup);
        }),
        dimensions: {
            x: Math.ceil(lMaxParticleCount / (lParticleComputeModule.workGroupSizeX * lParticleComputeModule.workGroupSizeY * lParticleComputeModule.workGroupSizeZ)),
            y: 1,
            z: 1
        }
    };

    return [lRenderInstruction, lComputeInstruction];
};

const gGenerateWorldBindGroup = (pGpu: GpuDevice): BindGroup => {
    const lWorldGroupLayout = new BindGroupLayout(pGpu, 'world').setup((pBindGroupSetup) => {
        pBindGroupSetup.binding(0, 'camera', ComputeStage.Vertex | ComputeStage.Compute).asBuffer().withStruct((pStructSetup) => {
            pStructSetup.property('viewProjection').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Matrix44);
            pStructSetup.property('view').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Matrix44);
            pStructSetup.property('projection').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Matrix44);

            pStructSetup.property('translation').asStruct((pTranslationStruct) => {
                pTranslationStruct.property('rotation').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Matrix44);
                pTranslationStruct.property('translation').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Matrix44);
            });

            pStructSetup.property('invertedTranslation').asStruct((pTranslationStruct) => {
                pTranslationStruct.property('rotation').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Matrix44);
                pTranslationStruct.property('translation').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Matrix44);
            });

            pStructSetup.property('position').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
        });

        pBindGroupSetup.binding(1, 'timestamp', ComputeStage.Vertex | ComputeStage.Fragment | ComputeStage.Compute).asBuffer().withStruct((pTimeStruct) => {
            pTimeStruct.property('timestamp').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Single);
            pTimeStruct.property('delta').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Single);
        });

        pBindGroupSetup.binding(2, 'ambientLight', ComputeStage.Fragment)
            .asBuffer().withStruct((pStruct) => {
                pStruct.property('color').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            });

        pBindGroupSetup.binding(3, 'pointLights', ComputeStage.Fragment | ComputeStage.Vertex, StorageBindingType.Read)
            .asBuffer().withArray().withStruct((pStruct) => {
                pStruct.property('position').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
                pStruct.property('color').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
                pStruct.property('range').asPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Single);
            });

        pBindGroupSetup.binding(4, 'debugValue', ComputeStage.Fragment | ComputeStage.Compute, StorageBindingType.ReadWrite)
            .asBuffer().withPrimitive(BufferItemFormat.Float32, BufferItemMultiplier.Single);

    });

    /*
     * Camera and world group. 
     */
    const lWorldGroup: BindGroup = lWorldGroupLayout.create();
    lWorldGroup.data('camera').createBuffer();

    // Create ambient light.
    const lAmbientLight: AmbientLight = new AmbientLight();
    lAmbientLight.setColor(0.3, 0.3, 0.3);
    lWorldGroup.data('ambientLight').createBuffer(lAmbientLight.data);

    // Create point lights.
    lWorldGroup.data('pointLights').createBuffer([
        /* Position */1, 1, 1, 1, /* Color */1, 0, 0, 1,/* Range */ 200,
        /* Position */10, 10, 10, 1, /* Color */0, 0, 1, 1,/* Range */ 200,
        /* Position */-10, 10, 10, 1, /* Color */0, 1, 0, 1,/* Range */ 200
    ]);

    // Create timestamp.
    lWorldGroup.data('timestamp').createBuffer();

    // Create debug value.
    lWorldGroup.data('debugValue').createBuffer();
    const lDebugBuffer: GpuBufferView<Float32Array> = lWorldGroup.data('debugValue').asBufferView(Float32Array);
    (<any>window).debugBuffer = () => {
        lDebugBuffer.read().then((pResulto) => {
            // eslint-disable-next-line no-console
            console.log(pResulto);
        });
    };

    return lWorldGroup;
};

(async () => {
    const lGpu: GpuDevice = await GpuDevice.request('high-performance', {
        features: [
            { name: GpuFeature.TimestampQuery, required: true }
        ]
    });

    // Create canvas.
    const lCanvasTexture: CanvasTexture = lGpu.canvas(document.getElementById('canvas') as HTMLCanvasElement);

    // Create and configure render targets.
    const lRenderTargets: RenderTargets = lGpu.renderTargets(true).setup((pSetup) => {
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
    }, RenderTargetsInvalidationType.Resize);

    // Create camera.
    const lCamera: ViewProjection = new ViewProjection(lPerspectiveProjection);
    lCamera.transformation.setTranslation(0, 0, -4);

    const lWorldGroup: BindGroup = gGenerateWorldBindGroup(lGpu);
    const lTimestampBuffer: GpuBufferView<Float32Array> = lWorldGroup.data('timestamp').asBufferView(Float32Array);

    const [lParticelRenderInstruction, lParticelComputeInstruction] = gGenerateParticleStep(lGpu, lRenderTargets, lWorldGroup);

    // Create instruction.
    const lRenderSteps: Array<RenderInstruction> = [
        gGenerateSkyboxStep(lGpu, lRenderTargets, lWorldGroup),
        gGenerateCubeStep(lGpu, lRenderTargets, lWorldGroup),
        gGenerateLightBoxStep(lGpu, lRenderTargets, lWorldGroup),
        gGenerateVideoCanvasStep(lGpu, lRenderTargets, lWorldGroup),
        ...gGenerateColorCubeStep(lGpu, lRenderTargets, lWorldGroup),
        lParticelRenderInstruction
    ];
    const lRenderPass: RenderPass = lGpu.renderPass(lRenderTargets, (pContext) => {
        for (const lStep of lRenderSteps) {
            if (lStep.indirectBuffer) {
                pContext.drawIndirect(
                    lStep.pipeline,
                    lStep.parameter,
                    lStep.data,
                    lStep.indirectBuffer
                );
            } else {
                pContext.drawDirect(
                    lStep.pipeline,
                    lStep.parameter,
                    lStep.data,
                    lStep.instanceCount
                );
            }
        }
    });

    (<any>window).renderpassRuntime = () => {
        lRenderPass.probeTimestamp().then(([pStart, pEnd]) => {
            // eslint-disable-next-line no-console
            console.log('Runtime:', Number(pEnd - pStart) / 1000000, 'ms');
        });
    };

    // Create instruction.
    const lComputeSteps: Array<ComputeInstruction> = [
        lParticelComputeInstruction
    ];
    const lComputePass: ComputePass = lGpu.computePass((pContext) => {
        for (const lStep of lComputeSteps) {
            pContext.computeDirect(
                lStep.pipeline,
                lStep.data,
                lStep.dimensions.x,
                lStep.dimensions.y,
                lStep.dimensions.z
            );
        }
    });

    (<any>window).computepassRuntime = () => {
        lComputePass.probeTimestamp().then(([pStart, pEnd]) => {
            // eslint-disable-next-line no-console
            console.log('Runtime:', Number(pEnd - pStart) / 1000000, 'ms');
        });
    };

    /**
     * Controls
     */
    InitCameraControls(lCanvasTexture.canvas, lCamera, lWorldGroup.data('camera').asBufferView(Float32Array));

    /*
     * Execution 
     */
    const lRenderExecutor: GpuExecution = lGpu.executor((pExecutor) => {
        lComputePass.execute(pExecutor);
        lRenderPass.execute(pExecutor);
    });

    const lFpsLabel = document.getElementById('fpsCounter')!;

    // Actual execute.
    let lLastTime: number = 0;
    let lCurrentFps: number = 0;
    const lRender = (pTime: number) => {
        // Start new frame.
        lGpu.startNewFrame();

        // Generate fps and smooth fps numbers.
        const lFps: number = 1000 / (pTime - lLastTime);
        lCurrentFps = (1 - 0.05) * lCurrentFps + 0.05 * lFps;

        // Update time stamp data.
        lTimestampBuffer.write([pTime / 1000, (pTime - lLastTime) / 1000]);

        lLastTime = pTime;

        // Generate encoder and add render commands.
        lRenderExecutor.execute();

        // Update fps display.
        UpdateFpsDisplay(lFps, lRenderTargets.width);

        // Update FPS counter.
        lFpsLabel.textContent = lCurrentFps.toFixed(0);

        // Refresh canvas
        requestAnimationFrame(lRender);
    };
    requestAnimationFrame(lRender);
})();

type RenderInstruction = {
    pipeline: VertexFragmentPipeline;
    parameter: VertexParameter;
    instanceCount: number;
    data: PipelineData;
    indirectBuffer?: GpuBuffer;
};

type ComputeInstruction = {
    pipeline: ComputePipeline;
    data: PipelineData;
    dimensions: {
        x: number;
        y: number;
        z: number;
    };
};