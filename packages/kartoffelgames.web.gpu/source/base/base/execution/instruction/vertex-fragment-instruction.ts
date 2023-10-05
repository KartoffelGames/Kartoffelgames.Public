import { Exception } from '@kartoffelgames/core.data';
import { BindDataGroup } from '../../binding/bind-data-group';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/gpu-object';
import { VertexParameter } from '../../pipeline/parameter/vertex-parameter';
import { RenderTargets } from '../../pipeline/target/render-targets';
import { VertexFragmentPipeline } from '../../pipeline/vertex-fragment-pipeline';
import { InstructionExecuter } from '../instruction-executor';
import { IGpuInstruction } from './i-gpu-instruction.interface';

export class VertexFragmentInstruction extends GpuObject<'vertexFragmentInstruction'> implements IGpuInstruction {
    private readonly mExecutor: InstructionExecuter;
    private readonly mRenderTargets: RenderTargets;
    private readonly mStepList: Array<VertexFragmentInstructionStep>;

    /**
     * Get executor.
     */
    public get executor(): InstructionExecuter {
        return this.mExecutor;
    }

    /**
     * Get instruction render target.
     */
    public get renderTargets(): RenderTargets {
        return this.mRenderTargets;
    }

    /**
     * Get all instruction steps.
     */
    public get steps(): Array<VertexFragmentInstructionStep> {
        return this.mStepList;
    }

    /**
     * Constructor.
     * @param pDevice - Device reference.
     * @param pRenderTargets - Render targets. 
     */
    public constructor(pDevice: GpuDevice, pExecutor: InstructionExecuter, pRenderTargets: RenderTargets) {
        super(pDevice);

        this.mStepList = new Array<VertexFragmentInstructionStep>();
        this.mRenderTargets = pRenderTargets;
        this.mExecutor = pExecutor;
    }

    /**
     * Add instruction step.
     * @param pPipeline - Pipeline.
     * @param pParameter - Pipeline parameter.
     * @param pBindData - Pipline bind data groups.
     * @param pInstanceCount - Instance count.
     */
    public addStep(pPipeline: VertexFragmentPipeline, pParameter: VertexParameter, pBindData: Record<number, BindDataGroup>, pInstanceCount: number = 1): void {
        // Validate same render targets.
        if (this.mRenderTargets !== pPipeline.renderTargets) {
            throw new Exception('Instruction render pass not valid for instruction set.', this);
        }

        const lStep: VertexFragmentInstructionStep = {
            pipeline: pPipeline,
            parameter: pParameter,
            instanceCount: pInstanceCount,
            bindData: new Array<BindDataGroup | null>()
        };

        // Fill in data groups.
        for (const lGroup of pPipeline.shader.pipelineLayout.groups) {
            const lBindDataGroup: BindDataGroup | undefined = pBindData[lGroup];

            // Validate bind data group.
            if (!lBindDataGroup) {
                throw new Exception('Defined bind data group not set.', this);
            }

            // Validate same layout bind layout.
            const lBindGroupLayout = pPipeline.shader.pipelineLayout.getGroupLayout(lGroup);
            if (lBindDataGroup.layout.identifier !== lBindGroupLayout.identifier) {
                throw new Exception('Source bind group layout does not match target layout.', this);
            }

            lStep.bindData[lGroup] = pBindData[lGroup];
        }

        this.mStepList.push(lStep);
    }

    /**
     * Execute instruction.
     * @param pExecutor - Executor context.
     */
    public execute(): void {
        this.device.generator.request<'vertexFragmentInstruction'>(this).execute();
    }
}

type VertexFragmentInstructionStep = {
    pipeline: VertexFragmentPipeline;
    parameter: VertexParameter;
    instanceCount: number;
    bindData: Array<BindDataGroup | null>;
};