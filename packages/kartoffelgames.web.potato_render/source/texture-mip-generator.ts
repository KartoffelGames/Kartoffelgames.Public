import { Dictionary, Exception } from '@kartoffelgames/core';


export class TextureMipGenerator {
    private static readonly WORKGROUP_SIZE_PER_DIMENSION = 8;

    // TODO: Cache static for each device.
    private readonly mDevice: GpuDevice;
    private readonly mFormatBindGroupsLayouts2d: Dictionary<TextureFormat, GPUBindGroupLayout> = new Dictionary<TextureFormat, GPUBindGroupLayout>();
    private readonly mFormatBindGroupsLayouts3d: Dictionary<TextureFormat, GPUBindGroupLayout> = new Dictionary<TextureFormat, GPUBindGroupLayout>();
    private readonly mFormatPipelines2d: Dictionary<TextureFormat, GPUComputePipeline> = new Dictionary<TextureFormat, GPUComputePipeline>();
    private readonly mFormatPipelines3d: Dictionary<TextureFormat, GPUComputePipeline> = new Dictionary<TextureFormat, GPUComputePipeline>();

    public constructor(pDevice: GpuDevice) {
        this.mDevice = pDevice;

        this.mFormatPipelines2d = new Dictionary<TextureFormat, GPUComputePipeline>();
        this.mFormatBindGroupsLayouts2d = new Dictionary<TextureFormat, GPUBindGroupLayout>();
        this.mFormatPipelines3d = new Dictionary<TextureFormat, GPUComputePipeline>();
        this.mFormatBindGroupsLayouts3d = new Dictionary<TextureFormat, GPUBindGroupLayout>();
    }

    /**
     * Generate mips for textures.
     * 
     * @param pDevice - Device reference.
     * @param pTexture - Filled texture.sdsd
     */
    public generateMips(pTexture: GPUTexture): void {
        const lTextureCapability: TextureFormatCapability = this.mDevice.formatValidator.capabilityOf(pTexture.format as TextureFormat);

        // Use compute shader or fallback to cpu generation of mips.
        if (lTextureCapability.storage.writeonly && lTextureCapability.textureUsages.has(TextureUsage.TextureBinding)) {
            switch (pTexture.dimension) {
                case '1d': {
                    break; // TODO;
                }
                case '2d': {
                    this.initComputeShader2d(lTextureCapability);
                    this.generateMipsWithCompute2d(this.mDevice.gpu, pTexture, lTextureCapability);
                    break;
                }
                case '3d': {
                    break; // TODO;
                }
            }

        } else {
            // TODO: Fallback CPU generation.
            switch (pTexture.dimension) {
                case '1d': {
                    break; // TODO;
                }
                case '2d': {
                    break; // TODO;
                }
                case '3d': {
                    break; // TODO;
                }
            }
        }
    }

    /**
     * Create mips for texture with compute shader.
     * 
     * @param pTexture - Target texture.
     */
    private generateMipsWithCompute2d(pGpuDevice: GPUDevice, pTexture: GPUTexture, pFormat: TextureFormatCapability) {
        // Calulate mip count.
        const lMipCount = 1 + Math.floor(Math.log2(Math.max(pTexture.width, pTexture.height)));

        // Read cached pipeline and layout.
        const lPipeline: GPUComputePipeline = this.mFormatPipelines2d.get(pFormat.format)!;
        const lBindGroupLayout: GPUBindGroupLayout = this.mFormatBindGroupsLayouts2d.get(pFormat.format)!;

        // Create command encoder.
        const lCommandEncoder: GPUCommandEncoder = pGpuDevice.createCommandEncoder();

        const lComputePass: GPUComputePassEncoder = lCommandEncoder.beginComputePass();
        lComputePass.setPipeline(lPipeline);

        for (let lMipLevel: number = 1; lMipLevel < lMipCount; lMipLevel++) {
            // Create and add bind group with needed texture resources.
            lComputePass.setBindGroup(0, pGpuDevice.createBindGroup({
                layout: lBindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: pTexture.createView({
                            format: pFormat.format as GPUTextureFormat,
                            dimension: '2d-array',
                            baseMipLevel: lMipLevel - 1,
                            mipLevelCount: 1
                        })
                    },
                    {
                        binding: 1,
                        resource: pTexture.createView({
                            format: pFormat.format as GPUTextureFormat,
                            dimension: '2d-array',
                            baseMipLevel: lMipLevel,
                            mipLevelCount: 1
                        })
                    }
                ]
            }));

            // Calculate needed single pixel invocations to cover complete mipmap level texture. 
            // Prevent dimension from becoming zero.
            const lMipMapDimensionX: number = Math.floor(pTexture.width / Math.pow(2, lMipLevel)) || 1;
            const lMipMapDimensionY: number = Math.floor(pTexture.height / Math.pow(2, lMipLevel)) || 1;

            // Calculate needed compute workgroup invocations to cover complete mipmap level texture.
            const lWorkgroupCountForX = Math.ceil((lMipMapDimensionX / TextureMipGenerator.WORKGROUP_SIZE_PER_DIMENSION));
            const lWorkgroupCountForY = Math.ceil((lMipMapDimensionY / TextureMipGenerator.WORKGROUP_SIZE_PER_DIMENSION));

            lComputePass.dispatchWorkgroups(lWorkgroupCountForX, lWorkgroupCountForY, 1);
        }

        // End computepass after all mips are generated.
        lComputePass.end();

        // Push all commands to gpu queue.
        pGpuDevice.queue.submit([lCommandEncoder.finish()]);
    }

    // TODO: 3D
    // lMipCount = 1 + Math.floor(Math.log2(Math.max(this.width, this.height, this.depth)));

    private initComputeShader2d(pFormat: TextureFormatCapability) {
        // Generate cache when missed.
        if (!this.mFormatPipelines2d.has(pFormat.format)) {
            const lSampleTypeName: 'f32' | 'u32' | 'i32' = (() => {
                switch (pFormat.sampleTypes.primary) {
                    case TextureSampleType.Float: return 'f32';
                    case TextureSampleType.UnsignedInteger: return 'u32';
                    case TextureSampleType.SignedInteger: return 'i32';
                    default: {
                        throw new Exception(`Can't generate mip for textures that cant be filtered.`, this);
                    }
                }
            })();

            // Shader code. Insert format.
            const lShader: GPUShaderModule = this.mDevice.gpu.createShaderModule({
                code: `
                        @group(0) @binding(0) var previousMipLevel: texture_2d_array<${lSampleTypeName}>;
                        @group(0) @binding(1) var nextMipLevel: texture_storage_2d_array<${pFormat.format}, write>;

                        @compute @workgroup_size(${TextureMipGenerator.WORKGROUP_SIZE_PER_DIMENSION}, ${TextureMipGenerator.WORKGROUP_SIZE_PER_DIMENSION})
                        fn computeMipMap(@builtin(global_invocation_id) id: vec3<u32>) {
                            const lOffset: vec2<u32> = vec2<u32>(0u, 1u);

                            let lTextureLayerCount: u32 = textureNumLayers(previousMipLevel);

                            var lColor: vec4<${lSampleTypeName}>;
                            for(var lArrayLayer = 0u; lArrayLayer < lTextureLayerCount; lArrayLayer++){
                                lColor = (
                                    textureLoad(previousMipLevel, 2u * id.xy + lOffset.xx, lArrayLayer, 0) +
                                    textureLoad(previousMipLevel, 2u * id.xy + lOffset.xy, lArrayLayer, 0) +
                                    textureLoad(previousMipLevel, 2u * id.xy + lOffset.yx, lArrayLayer, 0) +
                                    textureLoad(previousMipLevel, 2u * id.xy + lOffset.yy, lArrayLayer, 0)
                                ) * 0.25;
                                textureStore(nextMipLevel, id.xy, lArrayLayer, lColor);
                            }
                        }
                    `
            });

            // Generate bind group layout.
            const lBindGroupLayout = this.mDevice.gpu.createBindGroupLayout({
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.COMPUTE,
                        texture: {
                            sampleType: pFormat.sampleTypes.primary,
                            viewDimension: '2d-array'
                        }
                    },
                    {
                        binding: 1,
                        visibility: GPUShaderStage.COMPUTE,
                        storageTexture: {
                            access: 'write-only',
                            format: pFormat.format as GPUTextureFormat,
                            viewDimension: '2d-array'
                        }
                    }
                ]
            });

            // Create pipeline.
            const lPipeline: GPUComputePipeline = this.mDevice.gpu.createComputePipeline({
                layout: this.mDevice.gpu.createPipelineLayout({
                    bindGroupLayouts: [lBindGroupLayout]
                }),
                compute: {
                    module: lShader,
                    entryPoint: 'computeMipMap'
                }
            });

            // Safe pipeline and bind group layout.
            this.mFormatPipelines2d.set(pFormat.format, lPipeline);
            this.mFormatBindGroupsLayouts2d.set(pFormat.format, lBindGroupLayout);
        }
    }
}