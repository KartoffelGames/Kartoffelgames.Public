import { Exception } from '@kartoffelgames/core.data';
import { WebGpuDevice } from '../web-gpu-device';
import { GpuNativeObject } from '../gpu-native-object';
import { WebGpuShader } from '../shader/web-gpu-shader';
import { IPipeline } from './i-pipeline.interface';
import { RenderPassDescriptor } from '../pass_descriptor/render-pass-descriptor';
import { Attachment } from '../pass_descriptor/type/attachment';

export class RenderPipeline extends GpuNativeObject<GPURenderPipeline> implements IPipeline {
    private mDepthCompare: GPUCompareFunction;
    private mDepthWriteEnabled: boolean;
    private readonly mPrimitive: GPUPrimitiveState;
    private readonly mRenderPass: RenderPassDescriptor;
    private readonly mShader: WebGpuShader;

    /**
     * Set depth compare function.
     */
    public get depthCompare(): GPUCompareFunction {
        return this.mDepthCompare;
    } set depthCompare(pValue: GPUCompareFunction) {
        this.mDepthCompare = pValue;

        // Set data changed flag.
        this.triggerChange();
    }

    /**
     * Defines which polygon orientation will be culled.
     */
    public get primitiveCullMode(): GPUCullMode {
        return this.mPrimitive.cullMode!;
    } set primitiveCullMode(pValue: GPUCullMode) {
        this.mPrimitive.cullMode = pValue;

        // Set data changed flag.
        this.triggerChange();
    }

    /**
     * Defines which polygons are considered front-facing.
     */
    public get primitiveFrontFace(): GPUFrontFace {
        return this.mPrimitive.frontFace!;
    } set primitiveFrontFace(pValue: GPUFrontFace) {
        this.mPrimitive.frontFace = pValue;

        // Set data changed flag.
        this.triggerChange();
    }

    /**
     * The type of primitive to be constructed from the vertex inputs.
     */
    public get primitiveTopology(): GPUPrimitiveTopology {
        return this.mPrimitive.topology!;
    } set primitiveTopology(pValue: GPUPrimitiveTopology) {
        this.mPrimitive.topology = pValue;

        // Set data changed flag.
        this.triggerChange();
    }

    /**
     * Render pass of pipeline.
     */
    public get renderPass(): RenderPassDescriptor {
        return this.mRenderPass;
    }

    /**
     * Shader.
     */
    public get shader(): WebGpuShader {
        return this.mShader;
    }

    /**
     * Set depth to never clip.
     */
    public get unclipedDepth(): boolean {
        return this.mPrimitive.unclippedDepth ?? false;
    } set unclipedDepth(pValue: boolean) {
        this.mPrimitive.unclippedDepth = pValue;

        // Set data changed flag.
        this.triggerChange();
    }

    /**
     * Set depth write enabled / disabled.
     */
    public get writeDepth(): boolean {
        return this.mDepthWriteEnabled;
    } set writeDepth(pValue: boolean) {
        this.mDepthWriteEnabled = pValue;

        // Set data changed flag.
        this.triggerChange();
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: WebGpuDevice, pShader: WebGpuShader, pRenderPass: RenderPassDescriptor) {
        super(pGpu, 'RENDER_PIPELINE');

        // Set statics.
        this.mRenderPass = pRenderPass;

        // Set and register shader.
        this.mShader = pShader;
        this.registerInternalNative(pShader);

        // Validate vertex shader.
        if (!pShader.vertexEntryPoint) {
            throw new Exception('Vertex shader has no entry point.', this);
        }

        // Validate render pass to has same render target count as fragment.
        if (pShader.fragmentEntryPoint) {
            if (pRenderPass.colorAttachments.length !== pShader.fragmentEntryPoint.renderTargetCount) {
                throw new Exception(`Render pass(${pRenderPass.colorAttachments.length}) and shader(${pShader.fragmentEntryPoint.renderTargetCount}) are having unmatching render targets`, this);
            }
        }

        // Set default values.
        this.mPrimitive = {
            frontFace: 'cw',
            cullMode: 'back',
            topology: 'triangle-list',
            unclippedDepth: false
        };
        this.mDepthWriteEnabled = true;
        this.mDepthCompare = 'less';
    }

    /**
     * Generate native render pipeline.
     */
    protected generate(): GPURenderPipeline {
        // Generate pipeline layout from bind group layouts.
        const lPipelineLayout: GPUPipelineLayoutDescriptor = this.mShader.bindGroups.native();

        // Generate vertex buffer layouts.
        const lVertexBufferLayoutList: Array<GPUVertexBufferLayout> = new Array<GPUVertexBufferLayout>();
        for (const lAttribute of this.mShader.vertexEntryPoint!.attributes) {
            // Set location offset based on previous  vertex attributes.
            lVertexBufferLayoutList.push(lAttribute.native());
        }

        // Construct basic GPURenderPipelineDescriptor.
        const lPipelineDescriptor: GPURenderPipelineDescriptor = {
            label: this.label,
            layout: this.gpu.device.createPipelineLayout(lPipelineLayout),
            vertex: {
                module: this.mShader.native(),
                entryPoint: this.mShader.vertexEntryPoint!.name, // It allways should has an entry point.
                buffers: lVertexBufferLayoutList
                // No constants. Yes.
            },
            primitive: this.mPrimitive
        };

        // Buffer render pass formats.
        const lRenderPassBuffer: RenderpassFormats = {
            color: new Array<GPUTextureFormat>()
        };

        // Save highest multisample count.
        let lMultisampleCount: number = 1;

        // Optional fragment state.
        if (this.mShader.fragmentEntryPoint) {
            // Generate fragment targets only when fragment state is needed.
            const lFragmentTargetList: Array<GPUColorTargetState> = new Array<GPUColorTargetState>();
            for (const lRenderTarget of this.mRenderPass.colorAttachments) {
                lFragmentTargetList.push({
                    format: lRenderTarget.format,
                    // blend?: GPUBlendState;   // TODO: GPUBlendState
                    // writeMask?: GPUColorWriteFlags; // TODO: GPUColorWriteFlags
                });

                // Save highest multisample count.
                if (lMultisampleCount < lRenderTarget.multiSampleLevel) {
                    lMultisampleCount = lRenderTarget.multiSampleLevel;
                }

                // Save last render pass targets.
                lRenderPassBuffer.color.push(lRenderTarget.format);
            }

            lPipelineDescriptor.fragment = {
                module: this.mShader.native(),
                entryPoint: this.mShader.fragmentEntryPoint.name,
                targets: lFragmentTargetList
            };
        }

        // Setup optional depth attachment.
        const lDepthAttachment: Attachment | undefined = this.mRenderPass.depthAttachment;
        if (lDepthAttachment) {
            lPipelineDescriptor.depthStencil = {
                depthWriteEnabled: this.mDepthWriteEnabled,
                depthCompare: this.mDepthCompare,
                format: lDepthAttachment.format,
                // TODO: Stencil settings. 
            };

            // Save last render pass depth.
            lRenderPassBuffer.depth = lDepthAttachment.format;
        }

        // Set multisample count.
        if (lMultisampleCount > 1) {
            lPipelineDescriptor.multisample = {
                count: lMultisampleCount
            };
        }

        // Async is none GPU stalling.
        return this.gpu.device.createRenderPipeline(lPipelineDescriptor); // TODO: Async somehow.
    }
}

type RenderpassFormats = {
    color: Array<GPUTextureFormat>;
    depth?: GPUTextureFormat;
};