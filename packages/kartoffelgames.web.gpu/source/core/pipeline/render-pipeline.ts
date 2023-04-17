import { Exception } from '@kartoffelgames/core.data';
import { ColorAttachment } from '../attachment/type/color-attachment';
import { DepthStencilAttachment } from '../attachment/type/depth-stencil-attachment';
import { Gpu } from '../gpu';
import { GpuNativeObject } from '../gpu-native-object';
import { Shader } from '../shader';
import { IPipeline } from './i-pipeline.interface';

export class RenderPipeline extends GpuNativeObject<GPURenderPipeline> implements IPipeline{
    private mDepthAttachment: DepthStencilAttachment | null;
    private mDepthCompare: GPUCompareFunction;
    private mDepthWriteEnabled: boolean;
    private readonly mPipelineDataChangeState: PipelineDataChangeState;
    private readonly mPrimitive: GPUPrimitiveState;
    private readonly mRenderAttachmentList: Array<ColorAttachment>;
    private mShader: Shader | null;

    /**
     * Render attachments.
     */
    public get attachments(): Readonly<Array<ColorAttachment>> {
        return this.mRenderAttachmentList;
    }

    /**
     * Depth attachment.
     */
    public get depthAttachment(): DepthStencilAttachment | null {
        return this.mDepthAttachment;
    } set depthAttachment(pAttachment: DepthStencilAttachment | null) {
        // Do nothing on assigning old an value.
        if (this.mDepthAttachment === pAttachment) {
            return;
        }

        // Unregister old and register new depth attachment.
        if (this.mDepthAttachment) {
            this.unregisterInternalNative(this.mDepthAttachment);
        }
        if (pAttachment) {
            this.registerInternalNative(pAttachment);
        }

        // Set attachment.
        this.mDepthAttachment = pAttachment;
    }

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
     * Shader.
     */
    public get shader(): Shader {
        if (!this.mShader) {
            throw new Exception('Shader is not set for this pipeline', this);
        }
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
    public constructor(pGpu: Gpu) {
        super(pGpu, 'RENDER_PIPELINE');

        // Init unassigned properties.
        this.mShader = null;
        this.mDepthAttachment = null;

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

        // Init lists.
        this.mRenderAttachmentList = new Array<ColorAttachment>();
    }

    /**
     * Add attachment. Return attachment index.
     * @param pAttachment - Attachment.
     */
    public addAttachment(pAttachment: ColorAttachment): number {
        // Dont register attachment as an canvas attachment refreshes every frame.
        // The Pipeline would refresh every frame. 
        this.mPipelineDataChangeState.attachment = true;

        return this.mRenderAttachmentList.push(pAttachment) - 1;
    }

    /**
     * Set Shader programms for pipeline.
     * @param pShader - Vertex with optional fragement shader.
     */
    public setShader(pShader: Shader): void {
        // Validate vertex shader.
        if (!pShader.vertexEntryPoint) {
            throw new Exception('Vertex shader has no entry point.', this);
        }

        // Unregister old shader and register new.
        if (this.mShader) {
            this.unregisterInternalNative(this.mShader);
        }
        if (pShader) {
            this.registerInternalNative(pShader);
        }

        this.mShader = pShader;
    }

    /**
     * Free storage of native object.
     * @param _pNativeObject - Native object. 
     */
    protected async destroyNative(_pNativeObject: GPURenderPipeline): Promise<void> {
        // Nothing to destroy.
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
            for (const lRenderTarget of this.mRenderAttachmentList) {
                lFragmentTargetList.push({
                    format: lRenderTarget.format,
                    // blend?: GPUBlendState;
                    // writeMask?: GPUColorWriteFlags;
                });
            }

            lPipelineDescriptor.fragment = {
                module: await this.mShader.native(),
                entryPoint: this.mShader.fragmentEntryPoint!.name, // It allways should has an entry point.
                targets: lFragmentTargetList
            };
        }

        // Setup optional depth attachment.
        if (this.mDepthAttachment) {
            lPipelineDescriptor.depthStencil = {
                depthWriteEnabled: this.mDepthWriteEnabled,
                depthCompare: this.mDepthCompare,
                format: this.mDepthAttachment.format,
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