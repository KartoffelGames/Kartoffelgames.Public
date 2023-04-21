import { Exception } from '@kartoffelgames/core.data';
import { Gpu } from '../gpu';
import { GpuNativeObject } from '../gpu-native-object';
import { Shader } from '../shader/shader';
import { IPipeline } from './i-pipeline.interface';
import { RenderPassDescriptor } from '../pass_descriptor/render-pass-descriptor';
import { Attachment } from '../pass_descriptor/type/attachment';

export class RenderPipeline extends GpuNativeObject<GPURenderPipeline> implements IPipeline {
    private mDepthCompare: GPUCompareFunction;
    private mDepthWriteEnabled: boolean;
    private readonly mPipelineDataChangeState: PipelineDataChangeState;
    private readonly mPrimitive: GPUPrimitiveState;
    private readonly mRenderPass: RenderPassDescriptor;
    private readonly mShader: Shader;

    /**
     * Set depth compare function.
     */
    public get depthCompare(): GPUCompareFunction {
        return this.mDepthCompare;
    } set depthCompare(pValue: GPUCompareFunction) {
        // Do nothing on assigning old an value.
        if (this.mDepthCompare === pValue) {
            return;
        }

        this.mDepthCompare = pValue;

        // Set data changed flag.
        this.mPipelineDataChangeState.depthAttachment = true;
    }

    /**
     * Defines which polygon orientation will be culled.
     */
    public get primitiveCullMode(): GPUCullMode {
        return this.mPrimitive.cullMode!;
    } set primitiveCullMode(pValue: GPUCullMode) {
        // Do nothing on assigning old an value.
        if (this.mPrimitive.cullMode === pValue) {
            return;
        }

        this.mPrimitive.cullMode = pValue;

        // Set data changed flag.
        this.mPipelineDataChangeState.primitive = true;
    }

    /**
     * Defines which polygons are considered front-facing.
     */
    public get primitiveFrontFace(): GPUFrontFace {
        return this.mPrimitive.frontFace!;
    } set primitiveFrontFace(pValue: GPUFrontFace) {
        // Do nothing on assigning old an value.
        if (this.mPrimitive.frontFace === pValue) {
            return;
        }

        this.mPrimitive.frontFace = pValue;

        // Set data changed flag.
        this.mPipelineDataChangeState.primitive = true;
    }

    /**
     * The type of primitive to be constructed from the vertex inputs.
     */
    public get primitiveTopology(): GPUPrimitiveTopology {
        return this.mPrimitive.topology!;
    } set primitiveTopology(pValue: GPUPrimitiveTopology) {
        // Do nothing on assigning old an value.
        if (this.mPrimitive.topology === pValue) {
            return;
        }

        this.mPrimitive.topology = pValue;

        // Set data changed flag.
        this.mPipelineDataChangeState.primitive = true;
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
    public get shader(): Shader {
        return this.mShader;
    }

    /**
     * Set depth to never clip.
     */
    public get unclipedDepth(): boolean {
        return this.mPrimitive.unclippedDepth ?? false;
    } set unclipedDepth(pValue: boolean) {
        // Do nothing on assigning old an value.
        if (this.mPrimitive.unclippedDepth === pValue) {
            return;
        }

        this.mPrimitive.unclippedDepth = pValue;

        // Set data changed flag.
        this.mPipelineDataChangeState.primitive = true;
    }

    /**
     * Set depth write enabled / disabled.
     */
    public get writeDepth(): boolean {
        return this.mDepthWriteEnabled;
    } set writeDepth(pValue: boolean) {
        // Do nothing on assigning old an value.
        if (this.mDepthWriteEnabled === pValue) {
            return;
        }

        this.mDepthWriteEnabled = pValue;

        // Set data changed flag.
        this.mPipelineDataChangeState.depthAttachment = true;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: Gpu, pShader: Shader, pRenderPass: RenderPassDescriptor) {
        super(pGpu, 'RENDER_PIPELINE');

        // Set statics.
        this.mRenderPass = pRenderPass;
        this.registerInternalNative(pRenderPass);

        // Set and register shader.
        this.mShader = pShader;
        this.registerInternalNative(pShader);

        // Set default values.
        this.mPrimitive = {
            frontFace: 'cw',
            cullMode: 'back',
            topology: 'triangle-list',
            unclippedDepth: false
        };
        this.mDepthWriteEnabled = true;
        this.mDepthCompare = 'less';

        // Unchanged change state.
        this.mPipelineDataChangeState = {
            primitive: false,
            depthAttachment: false,
            attachment: true
        };

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
    }

    /**
     * Generate native render pipeline.
     */
    protected async generate(): Promise<GPURenderPipeline> {
        // Check valid entry points.
        if (!this.mShader?.vertexEntryPoint) {
            throw new Exception('Shadermodule has no vertex entry point.', this);
        }

        // Generate pipeline layout from bind group layouts.
        const lPipelineLayout: GPUPipelineLayoutDescriptor = await this.mShader.bindGroups.native();

        // Generate vertex buffer layouts.
        const lVertexBufferLayoutList: Array<GPUVertexBufferLayout> = new Array<GPUVertexBufferLayout>();
        for (const lAttribute of this.mShader.vertexEntryPoint.attributes) {
            // Set location offset based on previous  vertex attributes.
            lVertexBufferLayoutList.push(await lAttribute.native());
        }

        // Construct basic GPURenderPipelineDescriptor.
        const lPipelineDescriptor: GPURenderPipelineDescriptor = {
            label: this.label,
            layout: this.gpu.device.createPipelineLayout(lPipelineLayout),
            vertex: {
                module: await this.mShader.native(),
                entryPoint: this.mShader.vertexEntryPoint!.name, // It allways should has an entry point.
                buffers: lVertexBufferLayoutList
                // No constants. Yes.
            },
            primitive: this.mPrimitive
        };

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
            }

            lPipelineDescriptor.fragment = {
                module: await this.mShader.native(),
                entryPoint: this.mShader.fragmentEntryPoint!.name, // It allways should has an entry point.
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
        }

        // Reset change states.
        for (const lChangeState in this.mPipelineDataChangeState) {
            (<{ [changeState: string]: boolean; }>this.mPipelineDataChangeState)[lChangeState] = false;
        }

        // Async is none GPU stalling.
        return this.gpu.device.createRenderPipelineAsync(lPipelineDescriptor);
    }

    /**
     * Invalidate on data change or native data change.s
     */
    protected override async validateState(): Promise<boolean> {
        // Go for the fast checks first.
        for (const lChangeState in this.mPipelineDataChangeState) {
            if ((<{ [changeState: string]: boolean; }>this.mPipelineDataChangeState)[lChangeState]) {
                return false;
            }
        }

        // Native objects are validated over internal natives.

        return true;
    }
}

type PipelineDataChangeState = {
    primitive: boolean;
    depthAttachment: boolean;
    attachment: boolean;
};