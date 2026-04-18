import { GpuBuffer } from '../../source/buffer/gpu-buffer.ts';
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
import { VertexParameterStepMode } from '../../source/constant/vertex-parameter-step-mode.enum.ts';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import type { BindGroup } from '../../source/pipeline/bind_group/bind-group.ts';
import { BindGroupLayout } from '../../source/pipeline/bind_group_layout/bind-group-layout.ts';
import { ComputePipeline } from '../../source/pipeline/compute-pipeline.ts';
import type { PipelineData } from '../../source/pipeline/pipeline_data/pipeline-data.ts';
import { RenderTargetsLayout } from '../../source/pipeline/render_targets/render-targets-layout.ts';
import { type RenderTargets, RenderTargetsInvalidationType } from '../../source/pipeline/render_targets/render-targets.ts';
import type { VertexFragmentPipeline } from '../../source/pipeline/vertex_fragment_pipeline/vertex-fragment-pipeline.ts';
import { VertexParameterLayout } from '../../source/pipeline/vertex_parameter/vertex-parameter-layout.ts';
import type { VertexParameter } from '../../source/pipeline/vertex_parameter/vertex-parameter.ts';
import type { ShaderRenderModule } from '../../source/shader/shader-render-module.ts';
import { Shader } from '../../source/shader/shader.ts';
import { CanvasTexture } from '../../source/texture/canvas-texture.ts';
import type { GpuTexture, GpuTextureCopyOptions } from '../../source/texture/gpu-texture.ts';
import { AmbientLight } from './camera/light/ambient-light.ts';
import { Transform, TransformMatrix } from './camera/transform.ts';
import { PerspectiveProjection } from './camera/view_projection/projection/perspective-projection.ts';
import { ViewProjection } from './camera/view_projection/view-projection.ts';
import colorCubeShader from './game_objects/color_cube/color-cube-shader.wgsl' with { type: 'text' };
import cubeShader from './game_objects/cube/cube-shader.wgsl' with { type: 'text' };
import particleComputeShader from './game_objects/leaf_particle/particle-compute-shader.wgsl' with { type: 'text' };
import particleShader from './game_objects/leaf_particle/particle-shader.wgsl' with { type: 'text' };
import lightBoxShader from './game_objects/light/light-box-shader.wgsl' with { type: 'text' };
import skyboxShader from './game_objects/skybox/sky-box-shader.wgsl' with { type: 'text' };
import videoCanvasShader from './game_objects/video_canvas/video-canvas-shader.wgsl' with { type: 'text' };
import { CanvasVertexIndices, CanvasVertexNormalData, CanvasVertexPositionData, CanvasVertexUvData } from './meshes/canvas-mesh.ts';
import { CubeVertexIndices, CubeVertexNormalData, CubeVertexPositionData, CubeVertexUvData } from './meshes/cube-mesh.ts';
import { ParticleVertexIndices, ParticleVertexPositionUvData } from './meshes/particle-mesh.ts';
import { InitCameraControls, UpdateFpsDisplay } from './util.ts';

const gGenerateCubeStep = (pGpu: GpuDevice, pRenderTargetsLayout: RenderTargetsLayout, pWorldGroup: BindGroup): RenderInstruction => {
    const lHeight: number = 50;
    const lWidth: number = 50;
    const lDepth: number = 50;

    // Create shader.
    const lWoodBoxShader = new Shader(pGpu, cubeShader).setup((pShaderSetup) => {
        // Set parameter.
        pShaderSetup.parameter('animationSeconds', ComputeStage.Vertex);

        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(pGpu).setup((pSetup) => {
            pSetup.buffer('position', VertexParameterStepMode.Index)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

            pSetup.buffer('uv', VertexParameterStepMode.Vertex)
                .withParameter('uv', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector2);

            pSetup.buffer('normal', VertexParameterStepMode.Vertex)
                .withParameter('normal', 2, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        }));

        // Fragment entry.
        pShaderSetup.fragmentEntryPoint('fragment_main', pRenderTargetsLayout);

        // Object bind group.
        pShaderSetup.group(0, new BindGroupLayout(pGpu, 'object').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .asBuffer(64); // mat4x4<f32>

            pBindGroupSetup.binding(1, 'instancePositions', ComputeStage.Vertex, StorageBindingType.Read)
                .asBuffer(0, 16); // array<vec4<f32>>, variableSize=16
        }));

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);

        // User bind group
        pShaderSetup.group(2, new BindGroupLayout(pGpu, 'user').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'cubeTextureSampler', ComputeStage.Fragment)
                .asSampler(SamplerType.Filter);

            pBindGroupSetup.binding(1, 'cubeTexture', ComputeStage.Fragment | ComputeStage.Vertex)
                .asTexture('2d-array', 'rgba8unorm');
        }));
    });

    // Create render module from shader.
    const lWoodBoxRenderModule: ShaderRenderModule = lWoodBoxShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lWoodBoxTransformationGroup = lWoodBoxRenderModule.layout.getGroupLayout('object').create();

    // Create transformation.
    lWoodBoxTransformationGroup.data('transformationMatrix').createBufferWithRawData(new Float32Array(new Transform().setScale(1, 1, 1).getMatrix(TransformMatrix.Transformation).dataArray).buffer);

    // Create instance positions.
    const lCubeInstanceTransformationData: Array<number> = new Array<number>();
    for (let lWidthIndex: number = 0; lWidthIndex < lWidth; lWidthIndex++) {
        for (let lHeightIndex: number = 0; lHeightIndex < lHeight; lHeightIndex++) {
            for (let lDepthIndex: number = 0; lDepthIndex < lDepth; lDepthIndex++) {
                lCubeInstanceTransformationData.push(lWidthIndex * 3, lHeightIndex * 3, lDepthIndex * 3, 1);
            }
        }
    }
    lWoodBoxTransformationGroup.data('instancePositions').createBufferWithRawData(new Float32Array(lCubeInstanceTransformationData).buffer);

    /*
     * User defined group.
     */
    const lWoodBoxUserGroup = lWoodBoxRenderModule.layout.getGroupLayout('user').create();

    // Setup cube texture.
    const lImageTexture: GpuTexture = lWoodBoxUserGroup.data('cubeTexture').createTexture().texture as GpuTexture;
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
        const _ = lImageTexture.native; // Force recreate.
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
    const lWoodBoxPipeline: VertexFragmentPipeline = lWoodBoxRenderModule.create();
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

const gGenerateColorCubeStep = (pGpu: GpuDevice, pRenderTargetsLayout: RenderTargetsLayout, pWorldGroup: BindGroup): Array<RenderInstruction> => {
    // Create shader.
    const lColorBoxShader = new Shader(pGpu, colorCubeShader).setup((pShaderSetup) => {
        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(pGpu).setup((pSetup) => {
            pSetup.buffer('position', VertexParameterStepMode.Index)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

            pSetup.buffer('normal', VertexParameterStepMode.Vertex)
                .withParameter('normal', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        }));

        // Fragment entry.
        pShaderSetup.fragmentEntryPoint('fragment_main', pRenderTargetsLayout);

        // Object bind group.
        pShaderSetup.group(0, new BindGroupLayout(pGpu, 'object').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .asBuffer(64, 0, true); // mat4x4<f32>, dynamic offset

            pBindGroupSetup.binding(1, 'color', ComputeStage.Vertex)
                .asBuffer(16, 0, true); // vec4<f32>, dynamic offset
        }));

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);
    });

    // Create render module from shader.
    const lWoodBoxRenderModule: ShaderRenderModule = lColorBoxShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lColorBoxTransformationGroup = lWoodBoxRenderModule.layout.getGroupLayout('object').create();

    // Create transformation. Buffer with 3 dynamic offset elements.
    lColorBoxTransformationGroup.data('transformationMatrix').createBuffer(3);
    const lColorBoxTransformBuffer: GpuBuffer = lColorBoxTransformationGroup.data('transformationMatrix').getRaw<GpuBuffer>();
    // Each transformationMatrix element is mat4x4<f32> = 64 bytes.
    lColorBoxTransformBuffer.write(new Float32Array(new Transform().setScale(1, 1, 1).setTranslation(2, -30, 5).getMatrix(TransformMatrix.Transformation).dataArray).buffer, 0);
    lColorBoxTransformBuffer.write(new Float32Array(new Transform().setScale(1, 1, 1).setTranslation(0, -30, 5).getMatrix(TransformMatrix.Transformation).dataArray).buffer, 64);
    lColorBoxTransformBuffer.write(new Float32Array(new Transform().setScale(1, 1, 1).setTranslation(-2, -30, 5).getMatrix(TransformMatrix.Transformation).dataArray).buffer, 128);

    // Setup color buffer with dynamic offsets (2 colors for different cube instances).
    lColorBoxTransformationGroup.data('color').createBuffer(2);
    const lColorBuffer: GpuBuffer = lColorBoxTransformationGroup.data('color').getRaw<GpuBuffer>();
    const lColorSlotSize: number = lColorBuffer.size / 2; // Alignment-correct by construction.
    lColorBuffer.write(new Float32Array([/* Color 1 */ 0.89, 0.74, 0.00, 1]).buffer, 0);
    lColorBuffer.write(new Float32Array([/* Color 2 */ 0.92, 0.48, 0.14, 1]).buffer, lColorSlotSize);

    // Generate render parameter from parameter layout.
    const lMesh: VertexParameter = lWoodBoxRenderModule.vertexParameter.create(CubeVertexIndices);
    lMesh.create('position', CubeVertexPositionData);
    lMesh.create('normal', CubeVertexNormalData);

    // Create pipeline.
    const lColorBoxPipeline: VertexFragmentPipeline = lWoodBoxRenderModule.create();
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

const gGenerateLightBoxStep = (pGpu: GpuDevice, pRenderTargetsLayout: RenderTargetsLayout, pWorldGroup: BindGroup): RenderInstruction => {
    // Create shader.
    const lLightBoxShader: Shader = new Shader(pGpu, lightBoxShader).setup((pShaderSetup) => {
        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(pGpu).setup((pSetup) => {
            pSetup.buffer('position', VertexParameterStepMode.Index)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

            pSetup.buffer('uv', VertexParameterStepMode.Vertex)
                .withParameter('uv', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector2);

            pSetup.buffer('normal', VertexParameterStepMode.Vertex)
                .withParameter('normal', 2, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        }));

        // Fragment entry.
        pShaderSetup.fragmentEntryPoint('fragment_main', pRenderTargetsLayout);

        // Object bind group.
        pShaderSetup.group(0, new BindGroupLayout(pGpu, 'object').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .asBuffer(64); // mat4x4<f32>
        }));

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);
    });

    // Create render module from shader.
    const lLightBoxRenderModule = lLightBoxShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lLightBoxTransformationGroup = lLightBoxShader.layout.getGroupLayout('object').create();

    // Create transformation.
    lLightBoxTransformationGroup.data('transformationMatrix').createBufferWithRawData(new Float32Array(new Transform().setScale(1, 1, 1).getMatrix(TransformMatrix.Transformation).dataArray).buffer);

    const lLightBoxPipeline: VertexFragmentPipeline = lLightBoxRenderModule.create();
    lLightBoxPipeline.primitiveCullMode = PrimitiveCullMode.Front;

    // Generate render parameter from parameter layout.
    const lMesh: VertexParameter = lLightBoxRenderModule.vertexParameter.create(CubeVertexIndices);
    lMesh.create('position', CubeVertexPositionData);
    lMesh.create('uv', CubeVertexUvData);
    lMesh.create('normal', CubeVertexNormalData);

    // Point light count: 3 lights (each struct is 48 bytes = 12 floats: vec4 position + vec4 color + f32 range + 3f padding).
    const lPointLightCount: number = 3;

    return {
        pipeline: lLightBoxPipeline,
        parameter: lMesh,
        instanceCount: lPointLightCount,
        data: lLightBoxPipeline.layout.withData((pSetup) => {
            pSetup.addGroup(lLightBoxTransformationGroup);
            pSetup.addGroup(pWorldGroup);
        })
    };
};

const gGenerateSkyboxStep = (pGpu: GpuDevice, pRenderTargetsLayout: RenderTargetsLayout, pWorldGroup: BindGroup): RenderInstruction => {
    const lSkyBoxShader: Shader = new Shader(pGpu, skyboxShader).setup((pShaderSetup) => {
        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(pGpu).setup((pSetup) => {
            pSetup.buffer('position', VertexParameterStepMode.Index)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        }));

        // Fragment entry.
        pShaderSetup.fragmentEntryPoint('fragment_main', pRenderTargetsLayout);

        pShaderSetup.group(0, new BindGroupLayout(pGpu, 'object').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'cubeTextureSampler', ComputeStage.Fragment)
                .asSampler(SamplerType.Filter);

            pBindGroupSetup.binding(1, 'cubeMap', ComputeStage.Fragment)
                .asTexture('cube', 'rgba8unorm');
        }));

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);
    });

    // Create render module from shader.
    const lSkyBoxRenderModule = lSkyBoxShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lSkyBoxTextureGroup = lSkyBoxShader.layout.getGroupLayout('object').create();

    const lImageTexture: GpuTexture = lSkyBoxTextureGroup.data('cubeMap').createTexture().texture as GpuTexture;
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

    const lSkyBoxPipeline: VertexFragmentPipeline = lSkyBoxRenderModule.create();
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

const gGenerateVideoCanvasStep = (pGpu: GpuDevice, pRenderTargetsLayout: RenderTargetsLayout, pWorldGroup: BindGroup): RenderInstruction => {
    // Create shader.
    const lWoodBoxShader = new Shader(pGpu, videoCanvasShader).setup((pShaderSetup) => {
        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(pGpu).setup((pSetup) => {
            pSetup.buffer('position', VertexParameterStepMode.Index)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);

            pSetup.buffer('uv', VertexParameterStepMode.Vertex)
                .withParameter('uv', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector2);

            pSetup.buffer('normal', VertexParameterStepMode.Vertex)
                .withParameter('normal', 2, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        }));

        // Fragment entry.
        pShaderSetup.fragmentEntryPoint('fragment_main', pRenderTargetsLayout);

        // Object bind group.
        pShaderSetup.group(0, new BindGroupLayout(pGpu, 'object').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .asBuffer(64); // mat4x4<f32>
        }));

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);

        // User bind group
        pShaderSetup.group(2, new BindGroupLayout(pGpu, 'user').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'videoTextureSampler', ComputeStage.Fragment)
                .asSampler(SamplerType.Filter);

            pBindGroupSetup.binding(1, 'videoTexture', ComputeStage.Fragment)
                .asTexture('2d', 'rgba8unorm');
        }));
    });

    // Create render module from shader.
    const lWoodBoxRenderModule: ShaderRenderModule = lWoodBoxShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lTransformationGroup = lWoodBoxRenderModule.layout.getGroupLayout('object').create();

    // Create transformation.
    lTransformationGroup.data('transformationMatrix').createBufferWithRawData(new Float32Array(new Transform().addTranslation(-0.5, -0.5, 100).setScale(15, 8.4, 0).getMatrix(TransformMatrix.Transformation).dataArray).buffer);

    /*
     * User defined group.
     */
    const lUserGroup = lWoodBoxRenderModule.layout.getGroupLayout('user').create();

    // Setup cube texture.
    const lVideoTexture: GpuTexture = lUserGroup.data('videoTexture').createTexture().texture as GpuTexture;

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
    pGpu.addTickListener(() => {
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
    const lPipeline: VertexFragmentPipeline = lWoodBoxRenderModule.create();
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

const gGenerateParticleStep = (pGpu: GpuDevice, pRenderTargetsLayout: RenderTargetsLayout, pWorldGroup: BindGroup): [RenderInstruction, ComputeInstruction] => {
    const lMaxParticleCount: number = 18000;

    const lParticleRenderShader: Shader = new Shader(pGpu, particleShader).setup((pShaderSetup) => {
        // Set parameter.
        pShaderSetup.parameter('animationSeconds', ComputeStage.Vertex);

        // Vertex entry.
        pShaderSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(pGpu).setup((pSetup) => {
            pSetup.buffer('position-uv', VertexParameterStepMode.Index)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4)
                .withParameter('uv', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector2);
        }));

        // Fragment entry.
        pShaderSetup.fragmentEntryPoint('fragment_main', pRenderTargetsLayout);

        // Compute entry.
        pShaderSetup.computeEntryPoint('compute_main', 64);

        // Object bind group.
        pShaderSetup.group(0, new BindGroupLayout(pGpu, 'object').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'transformationMatrix', ComputeStage.Vertex)
                .asBuffer(64); // mat4x4<f32>
            pBindGroupSetup.binding(1, 'particles', ComputeStage.Vertex, StorageBindingType.Read)
                .asBuffer(0, 48); // array<Particle>, Particle struct stride = 48 => (3x vec3 + 4byte-alignment) + 1x f32 = 48 bytes
        }));

        // World bind group.
        pShaderSetup.group(1, pWorldGroup.layout);

        pShaderSetup.group(2, new BindGroupLayout(pGpu, 'user').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'textureSampler', ComputeStage.Fragment)
                .asSampler(SamplerType.Filter);

            pBindGroupSetup.binding(1, 'texture', ComputeStage.Fragment)
                .asTexture('2d', 'rgba8unorm');
        }));
    });

    // Create render module from shader.
    const lParticleRenderModule = lParticleRenderShader.createRenderModule('vertex_main', 'fragment_main');

    // Transformation and position group. 
    const lParticleInformationGroup = lParticleRenderModule.layout.getGroupLayout('object').create();
    lParticleInformationGroup.data('particles').createBuffer(lMaxParticleCount);

    // Create transformation.
    lParticleInformationGroup.data('transformationMatrix').createBufferWithRawData(new Float32Array(new Transform().setScale(0.02, 0.02, 0.02).getMatrix(TransformMatrix.Transformation).dataArray).buffer);

    // Transformation and position group. 
    const lParticleTextureGroup = lParticleRenderShader.layout.getGroupLayout('user').create();

    const lImageTexture: GpuTexture = lParticleTextureGroup.data('texture').createTexture().texture as GpuTexture;
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

    const lParticlePipeline: VertexFragmentPipeline = lParticleRenderModule.create();
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
    const lParticleComputeShader: Shader = new Shader(pGpu, particleComputeShader).setup((pShaderSetup) => {
        // Set parameter.
        pShaderSetup.parameter('animationSeconds', ComputeStage.Vertex);

        // Compute entry.
        pShaderSetup.computeEntryPoint('compute_main', 64);

        // Object bind group.
        pShaderSetup.group(0, new BindGroupLayout(pGpu, 'object').setup((pBindGroupSetup) => {
            pBindGroupSetup.binding(0, 'particles', ComputeStage.Compute, StorageBindingType.ReadWrite)
                .asBuffer(0, 48); // array<Particle>, Particle struct stride = 48

            pBindGroupSetup.binding(1, 'indirect', ComputeStage.Compute, StorageBindingType.ReadWrite)
                .asBuffer(16); // vec4<u32>
        }));

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
    lParticleComputeInformationGroup.data('particles').set(lParticleInformationGroup.data('particles').getRaw<GpuBuffer>());
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
        pBindGroupSetup.binding(0, 'camera', ComputeStage.Vertex | ComputeStage.Compute)
            .asBuffer(464); // Camera struct: viewProjection(64) + view(64) + projection(64) + translation(128) + invertedTranslation(128) + position(16) = 464

        pBindGroupSetup.binding(1, 'timestamp', ComputeStage.Vertex | ComputeStage.Fragment | ComputeStage.Compute)
            .asBuffer(8); // Timestamp struct: timestamp(4) + delta(4) = 8

        pBindGroupSetup.binding(2, 'ambientLight', ComputeStage.Fragment)
            .asBuffer(16); // AmbientLight struct: color vec4<f32> = 16

        pBindGroupSetup.binding(3, 'pointLights', ComputeStage.Fragment | ComputeStage.Vertex, StorageBindingType.Read)
            .asBuffer(0, 48); // array<PointLight>, stride = 48 (position(16) + color(16) + range(4) rounded to 48)

        pBindGroupSetup.binding(4, 'debugValue', ComputeStage.Fragment | ComputeStage.Compute, StorageBindingType.ReadWrite)
            .asBuffer(4); // f32

    });

    /*
     * Camera and world group. 
     */
    const lWorldGroup: BindGroup = lWorldGroupLayout.create();
    lWorldGroup.data('camera').createBuffer();

    // Create ambient light.
    const lAmbientLight: AmbientLight = new AmbientLight();
    lAmbientLight.setColor(0.3, 0.3, 0.3);
    lWorldGroup.data('ambientLight').createBufferWithRawData(new Float32Array(lAmbientLight.data).buffer);

    // Create point lights.
    lWorldGroup.data('pointLights').createBufferWithRawData(new Float32Array([
        /* Position */1, 1, 1, 1, /* Color */1, 0, 0, 1,/* Range */ 200, 0, 0, 0,
        /* Position */10, 10, 10, 1, /* Color */0, 0, 1, 1,/* Range */ 200, 0, 0, 0,
        /* Position */-10, 10, 10, 1, /* Color */0, 1, 0, 1,/* Range */ 200, 0, 0, 0
    ]).buffer);

    // Create timestamp.
    lWorldGroup.data('timestamp').createBuffer();

    // Create debug value.
    lWorldGroup.data('debugValue').createBuffer();
    const lDebugBuffer: GpuBuffer = lWorldGroup.data('debugValue').getRaw<GpuBuffer>();
    (<any>window).debugBuffer = () => {
        lDebugBuffer.read(0, 4).then((pResult) => {
            // eslint-disable-next-line no-console
            console.log(new Float32Array(pResult));
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
    const lCanvasTexture: CanvasTexture = new CanvasTexture(lGpu, document.getElementById('canvas') as HTMLCanvasElement);

    // Create and configure render targets layout.
    const lRenderTargetsLayout: RenderTargetsLayout = new RenderTargetsLayout(lGpu, true).setup((pSetup) => {
        // Add "color" target format.
        pSetup.addColor('color', 0, 'bgra8unorm', true, { r: 0, g: 1, b: 0, a: 0 });

        // Add depth format.
        pSetup.addDepthStencil('depth24plus', true, 1);
    });

    // Create render targets from layout.
    const lRenderTargets: RenderTargets = lRenderTargetsLayout.create((pSetup) => {
        pSetup.setOwnColorTarget('color', lCanvasTexture);
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
    const lTimestampBuffer: GpuBuffer = lWorldGroup.data('timestamp').getRaw<GpuBuffer>();

    const [lParticelRenderInstruction, lParticelComputeInstruction] = gGenerateParticleStep(lGpu, lRenderTargetsLayout, lWorldGroup);

    // Create instruction.
    const lRenderSteps: Array<RenderInstruction> = [
        gGenerateSkyboxStep(lGpu, lRenderTargetsLayout, lWorldGroup),
        gGenerateCubeStep(lGpu, lRenderTargetsLayout, lWorldGroup),
        gGenerateLightBoxStep(lGpu, lRenderTargetsLayout, lWorldGroup),
        gGenerateVideoCanvasStep(lGpu, lRenderTargetsLayout, lWorldGroup),
        ...gGenerateColorCubeStep(lGpu, lRenderTargetsLayout, lWorldGroup),
        lParticelRenderInstruction
    ];

    // Create instruction.
    const lComputeSteps: Array<ComputeInstruction> = [
        lParticelComputeInstruction
    ];

    /**
     * Controls
     */
    InitCameraControls(lCanvasTexture.canvas, lCamera, lWorldGroup.data('camera').getRaw<GpuBuffer>());

    const lFpsLabel = document.getElementById('fpsCounter')!;

    /*
     * Execution 
     */

    // Actual execute.
    let lLastTime: number = 0;
    let lCurrentFps: number = 0;
    const lRender = (pTime: number) => {
        // Start new frame.
        lGpu.processTick();

        // Generate fps and smooth fps numbers.
        const lFps: number = 1000 / (pTime - lLastTime);
        lCurrentFps = (1 - 0.05) * lCurrentFps + 0.05 * lFps;

        // Update time stamp data.
        lTimestampBuffer.write(new Float32Array([pTime / 1000, (pTime - lLastTime) / 1000]).buffer, 0);

        lLastTime = pTime;

        // Generate encoder and add render commands.
        lGpu.execute((pExecutor) => {
            pExecutor.computePass((pContext) => {
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

            // Render.
            pExecutor.renderPass(lRenderTargets, (pContext) => {
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
        });

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