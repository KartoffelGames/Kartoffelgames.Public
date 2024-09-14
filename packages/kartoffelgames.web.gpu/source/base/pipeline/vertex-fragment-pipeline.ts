import { CompareFunction } from '../../constant/compare-function.enum';
import { PrimitiveCullMode } from '../../constant/primitive-cullmode.enum';
import { PrimitiveFrontFace } from '../../constant/primitive-front-face.enum';
import { PrimitiveTopology } from '../../constant/primitive-topology.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-native-object';
import { UpdateReason } from '../gpu/gpu-object-update-reason';
import { VertexFragmentShader } from '../shader/vertex-fragment-shader';
import { RenderTargets } from './target/render-targets';

export class VertexFragmentPipeline extends GpuObject<'vertexFragmentPipeline'> {
    private mDepthCompare: CompareFunction;
    private mDepthWriteEnabled: boolean;
    private mPrimitiveCullMode: PrimitiveCullMode;
    private mPrimitiveFrontFace: PrimitiveFrontFace;
    private mPrimitiveTopology: PrimitiveTopology;
    private readonly mRenderTargets: RenderTargets;
    private readonly mShader: VertexFragmentShader;

    /**
     * Set depth compare function.
     */
    public get depthCompare(): CompareFunction {
        return this.mDepthCompare;
    } set depthCompare(pValue: CompareFunction) {
        this.mDepthCompare = pValue;

        // Set data changed flag.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Defines which polygon orientation will be culled.
     */
    public get primitiveCullMode(): PrimitiveCullMode {
        return this.mPrimitiveCullMode;
    } set primitiveCullMode(pValue: PrimitiveCullMode) {
        this.mPrimitiveCullMode = pValue;

        // Set data changed flag.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Defines which polygons are considered front-facing.
     */
    public get primitiveFrontFace(): PrimitiveFrontFace {
        return this.mPrimitiveFrontFace;
    } set primitiveFrontFace(pValue: PrimitiveFrontFace) {
        this.mPrimitiveFrontFace = pValue;

        // Set data changed flag.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * The type of primitive to be constructed from the vertex inputs.
     */
    public get primitiveTopology(): PrimitiveTopology {
        return this.mPrimitiveTopology;
    } set primitiveTopology(pValue: PrimitiveTopology) {
        this.mPrimitiveTopology = pValue;

        // Set data changed flag.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Render targets.
     */
    public get renderTargets(): RenderTargets {
        return this.mRenderTargets;
    }

    /**
     * Pipeline shader.
     */
    public get shader(): VertexFragmentShader {
        return this.mShader;
    }

    /**
     * Set depth write enabled / disabled.
     */
    public get writeDepth(): boolean {
        return this.mDepthWriteEnabled;
    } set writeDepth(pValue: boolean) {
        this.mDepthWriteEnabled = pValue;

        // Set data changed flag.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Constructor.
     * Set default data.
     * 
     * @param pDevice - Device.
     * @param pShader - Pipeline shader.
     */
    public constructor(pDevice: GpuDevice, pShader: VertexFragmentShader, pRenderTargets: RenderTargets) {
        super(pDevice);
        this.mShader = pShader;
        this.mRenderTargets = pRenderTargets;

        // Listen for render target and shader changes.
        pShader.addInvalidationListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
        pRenderTargets.addInvalidationListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });

        // Depth default settings.
        this.mDepthCompare = CompareFunction.Less;
        this.mDepthWriteEnabled = true; // TODO: Default based on render target. 

        // Primitive default settings.
        this.mPrimitiveTopology = PrimitiveTopology.TriangleList;
        this.mPrimitiveCullMode = PrimitiveCullMode.Back;
        this.mPrimitiveFrontFace = PrimitiveFrontFace.ClockWise;
    }
}