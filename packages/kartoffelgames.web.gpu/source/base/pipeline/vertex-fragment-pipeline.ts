import { CompareFunction } from '../../constant/compare-function.enum';
import { PrimitiveCullMode } from '../../constant/primitive-cullmode.enum';
import { PrimitiveFrontFace } from '../../constant/primitive-front-face.enum';
import { PrimitiveTopology } from '../../constant/primitive-topology.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, GpuObjectLifeTime } from '../gpu/object/gpu-object';
import { GpuObjectInvalidationReason } from '../gpu/object/gpu-object-invalidation-reasons';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { ShaderRenderModule } from '../shader/shader-render-module';
import { RenderTargets } from './target/render-targets';

export class VertexFragmentPipeline extends GpuObject<GPURenderPipeline> implements IGpuObjectNative<GPURenderPipeline> {
    private mDepthCompare: CompareFunction;
    private mDepthWriteEnabled: boolean;
    private mPrimitiveCullMode: PrimitiveCullMode;
    private mPrimitiveFrontFace: PrimitiveFrontFace;
    private mPrimitiveTopology: PrimitiveTopology;
    private readonly mRenderTargets: RenderTargets;
    private readonly mShaderModule: ShaderRenderModule;

    /**
     * Set depth compare function.
     */
    public get depthCompare(): CompareFunction {
        return this.mDepthCompare;
    } set depthCompare(pValue: CompareFunction) {
        this.mDepthCompare = pValue;

        // Set data changed flag.
        this.triggerAutoUpdate(GpuObjectInvalidationReason.Setting);
    }

    /**
     * Pipeline shader.
     */
    public get module(): ShaderRenderModule {
        return this.mShaderModule;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPURenderPipeline {
        return super.native;
    }

    /**
     * Defines which polygon orientation will be culled.
     */
    public get primitiveCullMode(): PrimitiveCullMode {
        return this.mPrimitiveCullMode;
    } set primitiveCullMode(pValue: PrimitiveCullMode) {
        this.mPrimitiveCullMode = pValue;

        // Set data changed flag.
        this.triggerAutoUpdate(GpuObjectInvalidationReason.Setting);
    }

    /**
     * Defines which polygons are considered front-facing.
     */
    public get primitiveFrontFace(): PrimitiveFrontFace {
        return this.mPrimitiveFrontFace;
    } set primitiveFrontFace(pValue: PrimitiveFrontFace) {
        this.mPrimitiveFrontFace = pValue;

        // Set data changed flag.
        this.triggerAutoUpdate(GpuObjectInvalidationReason.Setting);
    }

    /**
     * The type of primitive to be constructed from the vertex inputs.
     */
    public get primitiveTopology(): PrimitiveTopology {
        return this.mPrimitiveTopology;
    } set primitiveTopology(pValue: PrimitiveTopology) {
        this.mPrimitiveTopology = pValue;

        // Set data changed flag.
        this.triggerAutoUpdate(GpuObjectInvalidationReason.Setting);
    }

    /**
     * Render targets.
     */
    public get renderTargets(): RenderTargets {
        return this.mRenderTargets;
    }

    /**
     * Set depth write enabled / disabled.
     */
    public get writeDepth(): boolean {
        return this.mDepthWriteEnabled;
    } set writeDepth(pValue: boolean) {
        this.mDepthWriteEnabled = pValue;

        // Set data changed flag.
        this.triggerAutoUpdate(GpuObjectInvalidationReason.Setting);
    }

    /**
     * Constructor.
     * Set default data.
     * 
     * @param pDevice - Device.
     * @param pShaderRenderModule - Pipeline shader.
     */
    public constructor(pDevice: GpuDevice, pShaderRenderModule: ShaderRenderModule, pRenderTargets: RenderTargets) {
        super(pDevice, GpuObjectLifeTime.Persistent);

        this.mShaderModule = pShaderRenderModule;
        this.mRenderTargets = pRenderTargets;

        // Listen for render target and shader changes.
        pShaderRenderModule.addInvalidationListener(() => {
            this.triggerAutoUpdate(GpuObjectInvalidationReason.ChildData);
        });
        pRenderTargets.addInvalidationListener(() => {
            this.triggerAutoUpdate(GpuObjectInvalidationReason.ChildData);
        });

        // Depth default settings.
        this.mDepthCompare = CompareFunction.Less;
        this.mDepthWriteEnabled = true; // TODO: Default based on render target. 

        // Primitive default settings.
        this.mPrimitiveTopology = PrimitiveTopology.TriangleList;
        this.mPrimitiveCullMode = PrimitiveCullMode.Back;
        this.mPrimitiveFrontFace = PrimitiveFrontFace.ClockWise;
    }

    /**
     * Generate native gpu pipeline data layout.
     */
    protected override generateNative(): GPURenderPipeline {
        // Generate pipeline layout from bind group layouts.
        const lPipelineLayout: GPUPipelineLayout = this.mShaderModule.shader.layout.native;

        // Construct basic GPURenderPipelineDescriptor.
        const lPipelineDescriptor: GPURenderPipelineDescriptor = {
            layout: lPipelineLayout,
            vertex: {
                module: this.mShaderModule.shader.native,
                entryPoint: this.mShaderModule.vertexEntryPoint,
                buffers: this.mShaderModule.vertexParameter.native
                // TODO: Yes constants.
            },
            primitive: this.generatePrimitive()
        };

        // Optional fragment state.
        if (this.module.fragmentEntryPoint) {
            // Generate fragment targets only when fragment state is needed.
            const lFragmentTargetList: Array<GPUColorTargetState> = new Array<GPUColorTargetState>();
            for (const lRenderTarget of this.renderTargets.colorTextures) {
                lFragmentTargetList.push({
                    format: lRenderTarget.memoryLayout.format as GPUTextureFormat,
                    // blend?: GPUBlendState;   // TODO: GPUBlendState
                    // writeMask?: GPUColorWriteFlags; // TODO: GPUColorWriteFlags
                });
            }

            lPipelineDescriptor.fragment = {
                module: this.mShaderModule.shader.native,
                entryPoint: this.module.fragmentEntryPoint,
                targets: lFragmentTargetList
                // TODO: constants
            };
        }

        // Setup optional depth attachment.
        if (this.renderTargets.depthTexture) {
            lPipelineDescriptor.depthStencil = {
                depthWriteEnabled: this.writeDepth,
                depthCompare: this.depthCompare,
                format: this.renderTargets.depthTexture.memoryLayout.format as GPUTextureFormat,
            };
        }

        // TODO: Stencil.

        // Set multisample count.
        if (this.renderTargets.multiSampleLevel > 1) {
            lPipelineDescriptor.multisample = {
                count: this.renderTargets.multiSampleLevel
            };
        }

        // Async is none GPU stalling.
        return this.device.gpu.createRenderPipeline(lPipelineDescriptor); // TODO: Async create render pipeline somehow.
    }

    /**
     * Primitive settings.
     */
    private generatePrimitive(): GPUPrimitiveState {
        // Convert topology to native. Set strip format for strip topology.
        let lStripIndexFormat: GPUIndexFormat | undefined = undefined;

        switch (this.primitiveTopology) {
            case PrimitiveTopology.LineStrip:
            case PrimitiveTopology.TriangleStrip: {
                lStripIndexFormat = 'uint32';
                break;
            }
        }

        // Create primitive state.
        const lPrimitiveState: GPUPrimitiveState = {
            topology: this.primitiveTopology,
            frontFace: this.primitiveFrontFace,
            cullMode: this.primitiveCullMode,
            unclippedDepth: false
        };

        // Set optional strip format.
        if (lStripIndexFormat) {
            lPrimitiveState.stripIndexFormat = lStripIndexFormat;
        }

        return lPrimitiveState;
    }
}