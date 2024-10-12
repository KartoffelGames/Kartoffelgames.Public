import { Dictionary, Exception } from '@kartoffelgames/core';
import { CompareFunction } from '../../constant/compare-function.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { PrimitiveCullMode } from '../../constant/primitive-cullmode.enum';
import { PrimitiveFrontFace } from '../../constant/primitive-front-face.enum';
import { PrimitiveTopology } from '../../constant/primitive-topology.enum';
import { TextureAspect } from '../../constant/texture-aspect.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { ShaderRenderModule } from '../shader/shader-render-module';
import { CanvasTexture } from '../texture/canvas-texture';
import { FrameBufferTexture } from '../texture/frame-buffer-texture';
import { RenderTargets, RenderTargetsInvalidationType } from './target/render-targets';
import { TextureBlendOperation } from '../../constant/texture-blend-operation.enum';
import { TextureBlendFactor } from '../../constant/texture-blend-factor.enum';
import { VertexFragmentPipelineTargetConfig } from './vertex-fragment-pipeline-target-config';

export class VertexFragmentPipeline extends GpuObject<GPURenderPipeline, VertexFragmentPipelineInvalidationType> implements IGpuObjectNative<GPURenderPipeline> {
    private mDepthCompare: CompareFunction;
    private mDepthWriteEnabled: boolean;
    private readonly mParameter: Dictionary<ComputeStage, Record<string, number>>;
    private mPrimitiveCullMode: PrimitiveCullMode;
    private mPrimitiveFrontFace: PrimitiveFrontFace;
    private mPrimitiveTopology: PrimitiveTopology;
    private readonly mRenderTargetConfig: Dictionary<string, VertexFragmentPipelineTargetConfigData>;
    private readonly mRenderTargets: RenderTargets;
    private readonly mShaderModule: ShaderRenderModule;

    /**
     * Set depth compare function.
     */
    public get depthCompare(): CompareFunction {
        return this.mDepthCompare;
    } set depthCompare(pValue: CompareFunction) {
        this.mDepthCompare = pValue;

        // Invalidate pipeline on setting change.
        this.invalidate(VertexFragmentPipelineInvalidationType.Config);
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

        // Invalidate pipeline on setting change.
        this.invalidate(VertexFragmentPipelineInvalidationType.Config);
    }

    /**
     * Defines which polygons are considered front-facing.
     */
    public get primitiveFrontFace(): PrimitiveFrontFace {
        return this.mPrimitiveFrontFace;
    } set primitiveFrontFace(pValue: PrimitiveFrontFace) {
        this.mPrimitiveFrontFace = pValue;

        // Invalidate pipeline on setting change.
        this.invalidate(VertexFragmentPipelineInvalidationType.Config);
    }

    /**
     * The type of primitive to be constructed from the vertex inputs.
     */
    public get primitiveTopology(): PrimitiveTopology {
        return this.mPrimitiveTopology;
    } set primitiveTopology(pValue: PrimitiveTopology) {
        this.mPrimitiveTopology = pValue;

        // Invalidate pipeline on setting change.
        this.invalidate(VertexFragmentPipelineInvalidationType.Config);
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

        // Invalidate pipeline on setting change.
        this.invalidate(VertexFragmentPipelineInvalidationType.Config);
    }

    /**
     * Constructor.
     * Set default data.
     * 
     * @param pDevice - Device.
     * @param pShaderRenderModule - Pipeline shader.
     */
    public constructor(pDevice: GpuDevice, pShaderRenderModule: ShaderRenderModule, pRenderTargets: RenderTargets) {
        super(pDevice);

        // Set config objects.
        this.mShaderModule = pShaderRenderModule;
        this.mRenderTargets = pRenderTargets;
        this.mRenderTargetConfig = new Dictionary<string, VertexFragmentPipelineTargetConfigData>();

        // Pipeline constants.
        this.mParameter = new Dictionary<ComputeStage, Record<string, number>>();

        // Listen for shader changes.
        this.mShaderModule.shader.addInvalidationListener(() => {
            this.invalidate(VertexFragmentPipelineInvalidationType.Shader);
        });
        this.mShaderModule.vertexParameter.addInvalidationListener(() => {
            this.invalidate(VertexFragmentPipelineInvalidationType.Shader);
        });
        this.mShaderModule.shader.layout.addInvalidationListener(() => {
            this.invalidate(VertexFragmentPipelineInvalidationType.Shader);
        });

        // Listen for render target changes.
        this.mRenderTargets.addInvalidationListener(() => {
            this.invalidate(VertexFragmentPipelineInvalidationType.RenderTargets);
        }, [
            RenderTargetsInvalidationType.TextureFormatChange,
            RenderTargetsInvalidationType.Resize,
            RenderTargetsInvalidationType.MultisampleChange
        ]);

        // Depth default settings.
        this.mDepthCompare = CompareFunction.Less;
        this.mDepthWriteEnabled = this.mRenderTargets.hasDepth;

        // Primitive default settings.
        this.mPrimitiveTopology = PrimitiveTopology.TriangleList;
        this.mPrimitiveCullMode = PrimitiveCullMode.Back;
        this.mPrimitiveFrontFace = PrimitiveFrontFace.ClockWise;
    }

    /**
     * Set optional parameter of pipeline.
     * 
     * @param pParameterName - name of parameter.
     * @param pValue - Value.
     * 
     * @returns this. 
     */
    public setParameter(pParameterName: string, pValue: number): this {
        const lParameterUsage: Set<ComputeStage> | undefined = this.mShaderModule.shader.parameter(pParameterName);

        // Set parameter for each assigned compute stage.
        for (const lUsage of lParameterUsage) {
            // Init parameters for computestage when not set.
            if (!this.mParameter.has(lUsage)) {
                this.mParameter.set(lUsage, {});
            }

            // Set value for compute stage.
            this.mParameter.get(lUsage)![pParameterName] = pValue;
        }

        // Generate pipeline anew.
        this.invalidate(VertexFragmentPipelineInvalidationType.Parameter);

        return this;
    }

    /**
     * Create or update target config.
     * 
     * @param pTargetName - Target name.
     * 
     * @returns config object. 
     */
    public targetConfig(pTargetName: string): VertexFragmentPipelineTargetConfig {
        if (!this.mRenderTargets.hasColorTarget(pTargetName)) {
            throw new Exception(`Color target "${pTargetName}" does not exists.`, this);
        }

        // Create default config when not already set.
        if (!this.mRenderTargetConfig.has(pTargetName)) {
            this.mRenderTargetConfig.set(pTargetName, {
                colorBlend: {
                    operation: TextureBlendOperation.Add,
                    sourceFactor: TextureBlendFactor.One,
                    destinationFactor: TextureBlendFactor.Zero
                },
                alphaBlend: {
                    operation: TextureBlendOperation.Add,
                    sourceFactor: TextureBlendFactor.One,
                    destinationFactor: TextureBlendFactor.Zero
                },
                aspectWriteMask: new Set<TextureAspect>([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha])
            });
        }


        return new VertexFragmentPipelineTargetConfig(this.mRenderTargetConfig.get(pTargetName)!, () => {
            // Generate pipeline anew.
            this.invalidate(VertexFragmentPipelineInvalidationType.Config);
        });
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
                buffers: this.mShaderModule.vertexParameter.native,
                constants: this.mParameter.get(ComputeStage.Vertex) ?? {}
            },
            primitive: this.generatePrimitive()
        };

        // Optional fragment state.
        if (this.module.fragmentEntryPoint) {
            // Generate fragment targets only when fragment state is needed.
            const lFragmentTargetList: Array<GPUColorTargetState> = new Array<GPUColorTargetState>();
            for (const lRenderTargetName of this.mRenderTargets.colorTargetNames) {
                const lRenderTarget: FrameBufferTexture | CanvasTexture = this.mRenderTargets.colorTarget(lRenderTargetName);

                lFragmentTargetList.push({
                    format: lRenderTarget.layout.format as GPUTextureFormat,
                    blend: this.generateRenderTargetBlendState(lRenderTargetName),
                    writeMask: this.generateRenderTargetWriteMask(lRenderTargetName)
                });
            }

            lPipelineDescriptor.fragment = {
                module: this.mShaderModule.shader.native,
                entryPoint: this.module.fragmentEntryPoint,
                targets: lFragmentTargetList,
                constants: this.mParameter.get(ComputeStage.Fragment) ?? {}
            };
        }

        // Setup optional depth attachment.
        if (this.mRenderTargets.hasDepth) {
            lPipelineDescriptor.depthStencil = {
                depthWriteEnabled: this.writeDepth,
                depthCompare: this.depthCompare,
                format: this.mRenderTargets.depthStencilTarget().layout.format as GPUTextureFormat,
            };
        }

        // TODO: Stencil.

        // Set multisample count.
        if (this.mRenderTargets.multiSampleLevel > 1) {
            lPipelineDescriptor.multisample = {
                count: this.mRenderTargets.multiSampleLevel
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

    /**
     * Generate blend state for render target.
     * 
     * @param pTargetName - Render target name.
     * 
     * @returns generated blend state. 
     */
    private generateRenderTargetBlendState(pTargetName: string): GPUBlendState {
        const lConfig: VertexFragmentPipelineTargetConfigData | undefined = this.mRenderTargetConfig.get(pTargetName);

        // Set defaults for blend state.
        const lBlendState: GPUBlendState = {
            color: {
                operation: 'add',
                srcFactor: 'one',
                dstFactor: 'zero'
            },
            alpha: {
                operation: 'add',
                srcFactor: 'one',
                dstFactor: 'zero'
            }
        };

        // Set alpha and alpha blend when set.
        if (lConfig) {
            lBlendState.alpha = {
                operation: lConfig.alphaBlend.operation,
                srcFactor: lConfig.alphaBlend.sourceFactor,
                dstFactor: lConfig.alphaBlend.destinationFactor
            };
            lBlendState.color = {
                operation: lConfig.colorBlend.operation,
                srcFactor: lConfig.colorBlend.sourceFactor,
                dstFactor: lConfig.colorBlend.destinationFactor
            };
        }

        return lBlendState;
    }

    /**
     * Generate gpu color write mask for the set render target.
     * 
     * @param pTargetName - Target name.
     * 
     * @returns color write flags.
     */
    private generateRenderTargetWriteMask(pTargetName: string): GPUColorWriteFlags {
        const lConfig: VertexFragmentPipelineTargetConfigData | undefined = this.mRenderTargetConfig.get(pTargetName);

        // Convert color aspects config to write mask.
        let lWriteMask: GPUColorWriteFlags = 0xf;
        if (lConfig) {
            lWriteMask = 0x0;
            if (lConfig.aspectWriteMask.has(TextureAspect.Red)) {
                lWriteMask += 0x1;
            }
            if (lConfig.aspectWriteMask.has(TextureAspect.Green)) {
                lWriteMask += 0x2;
            }
            if (lConfig.aspectWriteMask.has(TextureAspect.Red)) {
                lWriteMask += 0x4;
            }
            if (lConfig.aspectWriteMask.has(TextureAspect.Alpha)) {
                lWriteMask += 0x8;
            }
        }

        return lWriteMask;
    }
}

export enum VertexFragmentPipelineInvalidationType {
    Shader = 'ShaderChange',
    RenderTargets = 'RenderTargetsChange',
    Config = 'ConfigChange',
    Parameter = 'ParameterChange'
}

type VertexFragmentPipelineTargetConfigBlendData = {
    operation: TextureBlendOperation;
    sourceFactor: TextureBlendFactor;
    destinationFactor: TextureBlendFactor;
};

export type VertexFragmentPipelineTargetConfigData = {
    colorBlend: VertexFragmentPipelineTargetConfigBlendData;
    alphaBlend: VertexFragmentPipelineTargetConfigBlendData;
    aspectWriteMask: Set<TextureAspect>;
};