import { PrimitiveCullMode } from '../../../../constant/primitive-cullmode';
import { PrimitiveFrontFace } from '../../../../constant/primitive-front-face';
import { PrimitiveTopology } from '../../../../constant/primitive-topology';
import { TextureFormat } from '../../../../constant/texture-format.enum';
import { BaseNativeGenerator, NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { LinearBufferMemoryLayout } from '../../../memory_layout/buffer/linear-buffer-memory-layout';
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
            const lAttributeLayout: LinearBufferMemoryLayout = this.gpuObject.shader.parameterLayout.getLayoutOf(lAttributeName);

            // Set location offset based on previous vertex attributes.
            lVertexBufferLayoutList.push(this.generateAttribute(lAttributeIndex, lAttributeLayout));
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
            if (lDepthStencilBuffer.texture.memoryLayout.format === TextureFormat.Stencil || lDepthStencilBuffer.texture.memoryLayout.format === TextureFormat.DepthStencil) {
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
        return this.factory.gpu.createRenderPipeline(lPipelineDescriptor); // TODO: Async create render pipeline somehow.
    }

    /**
     * Generate attribute.
     * @param pLocation - Attribute location-
     * @param pLayout - Attribute buffer layout.
     */
    private generateAttribute(pLocation: number, pLayout: LinearBufferMemoryLayout): GPUVertexBufferLayout {
        const lBufferLayout: GPUVertexBufferLayout = {
            arrayStride: this.factory.byteCountOfVertexFormat(pLayout.format),
            stepMode: 'vertex',
            attributes: [{
                format: this.factory.toNativeVertexFormat(pLayout.format),
                offset: 0,
                shaderLocation: pLocation
            }]
        };

        return lBufferLayout;
    }

    /**
     * Primitive settings.
     */
    private generatePrimitive(): GPUPrimitiveState {
        // Convert topology to native. Set strip format for strip topology.
        let lStripIndexFormat: GPUIndexFormat | undefined = undefined;
        let lTopology: GPUPrimitiveTopology;
        switch (this.gpuObject.primitiveTopology) {
            case PrimitiveTopology.LineList: {
                lTopology = 'line-list';
                break;
            }
            case PrimitiveTopology.LineStrip: {
                lTopology = 'line-strip';
                lStripIndexFormat = 'uint32';
                break;
            }
            case PrimitiveTopology.PointList: {
                lTopology = 'point-list';
                break;
            }
            case PrimitiveTopology.TriangleList: {
                lTopology = 'triangle-list';
                break;
            }
            case PrimitiveTopology.TriangleStrip: {
                lTopology = 'triangle-strip';
                lStripIndexFormat = 'uint32';
                break;
            }
        }

        // Convert front facing.
        let lFrontFace: GPUFrontFace;
        switch (this.gpuObject.primitiveFrontFace) {
            case PrimitiveFrontFace.ClockWise: {
                lFrontFace = 'cw';
                break;
            }
            case PrimitiveFrontFace.CounterClockWise: {
                lFrontFace = 'ccw';
                break;
            }
        }

        // Convert cullmode.
        let lCullMode: GPUCullMode;
        switch (this.gpuObject.primitiveCullMode) {
            case PrimitiveCullMode.Back: {
                lCullMode = 'back';
                break;
            }
            case PrimitiveCullMode.Front: {
                lCullMode = 'front';
                break;
            }
            case PrimitiveCullMode.None: {
                lCullMode = 'none';
                break;
            }
        }

        // Create primitive state.
        const lPrimitiveState: GPUPrimitiveState = {
            topology: lTopology,
            frontFace: lFrontFace,
            cullMode: lCullMode,
            unclippedDepth: false
        };

        // Set optional strip format.
        if (lStripIndexFormat) {
            lPrimitiveState.stripIndexFormat = lStripIndexFormat;
        }

        return lPrimitiveState;
    }
}