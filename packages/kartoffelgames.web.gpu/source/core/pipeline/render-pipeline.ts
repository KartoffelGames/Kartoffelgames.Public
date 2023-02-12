import { Exception, TypedArray } from '@kartoffelgames/core.data';
import { CanvasAttachment } from '../attachment/canvas-attachment';
import { ColorAttachment } from '../attachment/color-attachment';
import { DepthStencilAttachment } from '../attachment/depth-stencil-attachment';
import { BaseBuffer } from '../buffer/base-buffer';
import { Gpu } from '../gpu';
import { Shader } from '../shader';
import { BindGroup } from './data/bind-group';
import { VertexAttributes } from './data/vertex-attributes';

export class RenderPipeline {
    private readonly mAttributeList: Array<VertexAttributes<TypedArray>>;
    private readonly mBindGoupList: Array<BindGroup>;
    private mDepthAttachment!: DepthStencilAttachment;
    private readonly mGpu: Gpu;
    private readonly mPrimitive: GPUPrimitiveState;
    private readonly mRenderTargetList: Array<ColorAttachment | CanvasAttachment>;
    private readonly mShader: Shader;

    public set depth(pAttachment: DepthStencilAttachment) {
        this.mDepthAttachment = pAttachment;
    }

    /**
     * GPU.
     */
    public get gpu(): Gpu {
        return this.mGpu;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: Gpu, pShader: Shader, pPrimitive: GPUPrimitiveState) {
        this.mGpu = pGpu;
        this.mShader = pShader;
        this.mPrimitive = pPrimitive;
        this.mAttributeList = new Array<VertexAttributes<any>>();
        this.mRenderTargetList = new Array<ColorAttachment | CanvasAttachment>();
        this.mBindGoupList = new Array<BindGroup>();
    }

    public addAttachment(pAttachment: ColorAttachment | CanvasAttachment): void {
        this.mRenderTargetList.push(pAttachment);
    }

    public addAttribute(pAttribute: VertexAttributes<TypedArray>): void {
        this.mAttributeList.push(pAttribute);
    }

    public addBinGroup(pGroup: BindGroup): void {
        this.mBindGoupList.push(pGroup);
    }

    public generatePipeline(): GPURenderPipeline {
        // Check valid entry points.
        if (!this.mShader.vertexEntryPoint) {
            throw new Exception('Shadermodule has no vertex entry point.', this);
        }
        if (!this.mShader.fragmentEntryPoint) {
            throw new Exception('Shadermodule has no fragment entry point.', this);
        }

        // Generate fragment targets.
        const lFragmentTargetList: Array<GPUColorTargetState> = new Array<GPUColorTargetState>();
        for (const lRenderTarget of this.mRenderTargetList) {
            lFragmentTargetList.push({
                format: lRenderTarget.format,
                // blend?: GPUBlendState;
                // writeMask?: GPUColorWriteFlags;
            });
        }

        return this.mGpu.device.createRenderPipeline({
            layout: 'auto', // TODO: layout.
            vertex: {
                module: this.mShader.shaderModule,
                entryPoint: this.mShader.vertexEntryPoint,
                buffers: this.mAttributeList.map((pAttribute) => { return pAttribute.generateBufferLayout(); })
                // TODO: constants.
            },
            fragment: {
                module: this.mShader.shaderModule,
                entryPoint: this.mShader.fragmentEntryPoint,
                targets: lFragmentTargetList
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: this.mDepthAttachment.format,
                // TODO: Stencil settings. 
            },
            primitive: this.mPrimitive
        });
    }

    public render(pEncoder: GPUCommandEncoder, pVertexBuffer: BaseBuffer<any>, pIndexBuffer: BaseBuffer<Uint16Array>): void {
        const lEncoder: GPURenderPassEncoder = pEncoder.beginRenderPass(this.generatePassDescriptor());
        lEncoder.setPipeline(this.generatePipeline());

        for (let lIndex: number = 0; lIndex < this.mBindGoupList.length; lIndex++) {
            const lBindGroup = this.mBindGoupList[lIndex];

            lEncoder.setBindGroup(lIndex, lBindGroup.generateBindGroup());
        }

        lEncoder.setVertexBuffer(0, pVertexBuffer.buffer);
        lEncoder.setIndexBuffer(pIndexBuffer.buffer, 'uint16');
        lEncoder.drawIndexed(pIndexBuffer.itemCount);
        lEncoder.end();

        this.mGpu.device.queue.submit([pEncoder.finish()]);
    }

    private generatePassDescriptor(): GPURenderPassDescriptor {
        return {
            colorAttachments: this.mRenderTargetList.map((pAttachment) => pAttachment.renderPassAttachment()),
            depthStencilAttachment: this.mDepthAttachment.renderPassAttachment()
        };
    }
}