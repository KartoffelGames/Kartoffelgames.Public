import { TextureFormat } from '../../../../constant/texture-format.enum';
import { BaseNativeGenerator, NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { BaseBufferMemoryLayout } from '../../../memory_layout/buffer/base-buffer-memory-layout';
import { NativeWebGpuMap } from '../web-gpu-generator-factory';

export class WebGpuVertexFragmentPipelineGenerator extends BaseNativeGenerator<NativeWebGpuMap, 'vertexFragmentPipeline'> {
    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
    }

    /**
     * Generate native gpu pipeline data layout.
     */
    protected override generate(): GPURenderPipeline {
        // Generate pipeline layout from bind group layouts.
        const lPipelineLayout: GPUPipelineLayout = this.factory.request<'pipelineDataLayout'>(this.gpuObject.shader.pipelineLayout).create();

        // Generate vertex buffer layouts.
        const lVertexBufferLayoutList: Array<GPUVertexBufferLayout> = new Array<GPUVertexBufferLayout>(this.gpuObject.shader.parameterLayout.count);
        for (const lAttributeName of this.gpuObject.shader.parameterLayout.parameter) {
            const lAttributeIndex: number = this.gpuObject.shader.parameterLayout.getIndexOf(lAttributeName);
            const lAttributeLayout: BaseBufferMemoryLayout = this.gpuObject.shader.parameterLayout.getLayoutOf(lAttributeName);

            // Set location offset based on previous vertex attributes.
            lVertexBufferLayoutList[lAttributeIndex] = lAttributeLayout.native(); // TODO: Needs primitive format for simplebuffermemorylayout :(
        }

        // Construct basic GPURenderPipelineDescriptor.
        const lPipelineDescriptor: GPURenderPipelineDescriptor = {
            layout: lPipelineLayout,
            vertex: {
                module: this.factory.request<'renderShader'>(this.gpuObject.shader).create(),
                entryPoint: this.gpuObject.shader.vertexEntry,
                buffers: lVertexBufferLayoutList
                // No constants. Yes.
            },
            primitive: this.generatePrimitive()
        };

        // Optional fragment state.
        if (this.gpuObject.shader.fragmentEntry) {
            // Generate fragment targets only when fragment state is needed.
            const lFragmentTargetList: Array<GPUColorTargetState> = new Array<GPUColorTargetState>();
            for (const lRenderTarget of this.gpuObject.renderTargets.colorBuffer) {
                lFragmentTargetList.push({
                    format: this.factory.formatFromLayout(lRenderTarget.texture.memoryLayout),
                    // blend?: GPUBlendState;   // TODO: GPUBlendState
                    // writeMask?: GPUColorWriteFlags; // TODO: GPUColorWriteFlags
                });
            }

            lPipelineDescriptor.fragment = {
                module: this.factory.request<'renderShader'>(this.gpuObject.shader).create(),
                entryPoint: this.gpuObject.shader.fragmentEntry,
                targets: lFragmentTargetList
            };
        }

        // Setup optional depth attachment.
        const lDepthStencilBuffer = this.gpuObject.renderTargets.depthStencilBuffer;
        if (lDepthStencilBuffer) {
            lPipelineDescriptor.depthStencil = {
                depthWriteEnabled: this.gpuObject.writeDepth,
                depthCompare: this.factory.compareFunctionToNative(this.gpuObject.depthCompare),
                format: this.factory.formatFromLayout(lDepthStencilBuffer.texture.memoryLayout),
            };

            // Stencil can only be set, when depth is set.
            if(lDepthStencilBuffer.texture.memoryLayout.format === TextureFormat.Stencil || lDepthStencilBuffer.texture.memoryLayout.format === TextureFormat.DepthStencil) {
                // TODO: Stencil settings. Empty for now.
            }
        }

        // Set multisample count.
        if (this.gpuObject.renderTargets.multisampleCount > 1) {
            lPipelineDescriptor.multisample = {
                count: this.gpuObject.renderTargets.multisampleCount
            };
        }

        // Async is none GPU stalling.
        return this.factory.gpu.createRenderPipeline(lPipelineDescriptor); // TODO: Async somehow.
    }

    /**
     * Primitive settings.
     */
    private generatePrimitive(): GPUPrimitiveState {

    }
}