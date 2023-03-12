import { Exception, TypedArray } from '@kartoffelgames/core.data';
import { ColorAttachment } from '../attachment/type/color-attachment';
import { DepthStencilAttachment } from '../attachment/type/depth-stencil-attachment';
import { BindGroupLayout } from '../bind_group/bind-group-layout';
import { Gpu } from '../gpu';
import { GpuNativeObject } from '../gpu-native-object';
import { Shader } from '../shader';
import { VertexAttributes } from './vertex-attributes';

export class RenderPipeline extends GpuNativeObject<GPURenderPipeline>{
    private readonly mAttributeList: Array<VertexAttributes<TypedArray>>;
    private readonly mBindGoupList: Array<BindGroupLayout>;
    private mDepthAttachment: DepthStencilAttachment | null;
    private mDepthCompare: GPUCompareFunction;
    private mDepthWriteEnabled: boolean;
    private mFragmentShader: Shader | null;
    private readonly mPipelineDataChangeState: PipelineDataChangeState;
    private readonly mPrimitive: GPUPrimitiveState;
    private readonly mRenderAttachmentList: Array<ColorAttachment>;
    private mVertexShader: Shader | null;

    /**
     * Render attachments.
     */
    public get attachments(): Readonly<Array<ColorAttachment>> {
        return this.mRenderAttachmentList;
    }

    /**
     * Bind groups.
     */
    public get bindGoups(): Readonly<Array<BindGroupLayout>> {
        return this.mBindGoupList;
    }

    /**
     * Depth attachment.
     */
    public get depthAttachment(): DepthStencilAttachment | null {
        return this.mDepthAttachment;
    } set depthAttachment(pAttachment: DepthStencilAttachment | null) {
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
        this.mPrimitive.topology = pValue;

        // Set data changed flag.
        this.mPipelineDataChangeState.primitive = true;
    }

    /**
     * Pipeline vertex attributes.
     */
    public get vertexAttributes(): Readonly<Array<VertexAttributes<TypedArray>>> {
        return this.mAttributeList;
    }

    /**
     * Set depth write enabled / disabled.
     */
    public get writeDepth(): boolean {
        return this.mDepthWriteEnabled;
    } set writeDepth(pValue: boolean) {
        this.mDepthWriteEnabled = pValue;

        // Set data changed flag.
        this.mPipelineDataChangeState.depthAttachment = true;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: Gpu) {
        super(pGpu);

        // Init unassigned properties.
        this.mVertexShader = null;
        this.mFragmentShader = null;
        this.mDepthAttachment = null;

        // Set default values.
        this.mPrimitive = {
            frontFace: 'cw',
            cullMode: 'back',
            topology: 'triangle-list'
        };
        this.mDepthWriteEnabled = true;
        this.mDepthCompare = 'less';

        // Unchanged change state.
        this.mPipelineDataChangeState = {
            primitive: false,
            shader: false,
            depthAttachment: false
        };

        // Init lists.
        this.mAttributeList = new Array<VertexAttributes<any>>();
        this.mRenderAttachmentList = new Array<ColorAttachment>();
        this.mBindGoupList = new Array<BindGroupLayout>();
    }

    /**
     * Add attachment. Return attachment index.
     * @param pAttachment - Attachment.
     */
    public addAttachment(pAttachment: ColorAttachment): number {
        // Register attachment as internal.
        this.registerInternalNative(pAttachment);

        return this.mRenderAttachmentList.push(pAttachment) - 1;
    }

    /**
     * Add vertex attributes. Order matters.
     * @param pAttribute - Vertex Attributes.
     */
    public addAttribute(pAttribute: VertexAttributes<TypedArray>): void {
        this.mAttributeList.push(pAttribute);

        // Register attribute as internal.
        this.registerInternalNative(pAttribute);
    }

    /**
     * Add bind group layout.
     * @param pBindGroupLayout - Bind group layout.
     */
    public addBindGroup(pBindGroupLayout: BindGroupLayout): void {
        this.mBindGoupList.push(pBindGroupLayout);

        // Register bind group as internal.
        this.registerInternalNative(pBindGroupLayout);
    }

    /**
     * Set Shader programms for pipeline.
     * @param pShader - Vertex with optional fragement shader.
     * @param pFragmentShader - Fragment shader.
     */
    public setShader(pShader: Shader): void;
    public setShader(pVertexShader: Shader, pFragmentShader: Shader): void;
    public setShader(pShader: Shader, pFragmentShader?: Shader): void {
        // Validate vertex shader.
        if (!pShader.vertexEntryPoint) {
            throw new Exception('Vertex shader has no entry point.', this);
        }

        // Validate optional vertex shader.
        if (pFragmentShader) {
            // Invalid set fragment shader.
            if (pFragmentShader.fragmentEntryPoint) {
                throw new Exception('Fragment shader has no entry point.', this);
            }

            this.mFragmentShader = pFragmentShader;
        } else if (pShader.fragmentEntryPoint) {
            // Set fragment shader from base shader when no fragment shader is set and base shader has an fragment entry point.
            this.mFragmentShader = pShader;
        }

        this.mVertexShader = pShader;

        // Set data changed flag.
        this.mPipelineDataChangeState.shader = true;
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
        if (!this.mVertexShader) {
            throw new Exception('Shadermodule has no vertex entry point.', this);
        }

        // Generate pipeline layout from bind group layouts.
        const lPipelineLayout: GPUPipelineLayoutDescriptor = { bindGroupLayouts: new Array<GPUBindGroupLayout>() };
        for (const lBindGroupLayout of this.mBindGoupList) {
            (<Array<GPUBindGroupLayout>>lPipelineLayout.bindGroupLayouts).push(await lBindGroupLayout.native());
        }

        // Generate vertex buffer layouts.
        let lVertexAttributeCount: number = 0;
        const lVertexBufferLayoutList: Array<GPUVertexBufferLayout> = new Array<GPUVertexBufferLayout>();
        for (const lAttribute of this.mAttributeList) {
            // Set location offset based on previous  vertex attributes.
            lAttribute.locationOffset = lVertexAttributeCount;
            lVertexBufferLayoutList.push(await lAttribute.native());

            // Increase vertx atttribute count.
            lVertexAttributeCount += lAttribute.count;
        }

        // Construct basic GPURenderPipelineDescriptor.
        const lPipelineDescriptor: GPURenderPipelineDescriptor = {
            layout: this.gpu.device.createPipelineLayout(lPipelineLayout),
            vertex: {
                module: this.mVertexShader.shaderModule,
                entryPoint: this.mVertexShader.vertexEntryPoint!, // It allways should has an entry point.
                buffers: lVertexBufferLayoutList
                // No constants. Yes.
            },
            primitive: this.mPrimitive
        };

        // Optional fragment state.
        if (this.mFragmentShader) {
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
                module: this.mFragmentShader.shaderModule,
                entryPoint: this.mFragmentShader.fragmentEntryPoint!, // It allways should has an entry point.
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
    shader: boolean;
    depthAttachment: boolean;
};