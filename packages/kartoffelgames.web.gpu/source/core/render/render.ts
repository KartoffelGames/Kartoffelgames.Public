export class Render {
    // TODO: Set  GPURenderPassEncoder.setScissorRect


    public render(pEncoder: GPUCommandEncoder, pIndexBuffer: BaseBuffer<Uint16Array>): void {
        const lEncoder: GPURenderPassEncoder = pEncoder.beginRenderPass(this.generatePassDescriptor());
        lEncoder.setPipeline(this.generatePipeline());

        // Add bind groups.
        for (let lIndex: number = 0; lIndex < this.mBindGoupList.length; lIndex++) {
            const lBindGroup = this.mBindGoupList[lIndex];
            lEncoder.setBindGroup(lIndex, lBindGroup.generateBindGroup());
        }

        // Add vertex attribute buffer.
        for (let lIndex: number = 0; lIndex < this.mAttributeList.length; lIndex++) {
            const lAttribute = this.mAttributeList[lIndex];
            lEncoder.setVertexBuffer(lIndex, lAttribute.buffer!.buffer);
        }

        lEncoder.setIndexBuffer(pIndexBuffer.buffer, 'uint16');
        lEncoder.drawIndexed(pIndexBuffer.itemCount);
        lEncoder.end();
    }


    private generatePassDescriptor(): GPURenderPassDescriptor {
        return {
            colorAttachments: this.mRenderTargetList.map((pAttachment) => pAttachment.renderPassAttachment()),
            depthStencilAttachment: this.mDepthAttachment.renderPassAttachment()
        };
    }
} 