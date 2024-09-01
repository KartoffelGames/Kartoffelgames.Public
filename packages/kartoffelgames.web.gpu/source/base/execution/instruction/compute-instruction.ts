import { Exception } from '@kartoffelgames/core';
import { BindDataGroup } from '../../binding/bind-data-group';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/gpu-native-object';
import { ComputePipeline } from '../../pipeline/compute-pipeline';
import { InstructionExecuter } from '../instruction-executor';
import { IGpuInstruction } from './i-gpu-instruction.interface';

export class ComputeInstruction extends GpuObject<'computeInstruction'> implements IGpuInstruction {
    private readonly mExecutor: InstructionExecuter;
    private readonly mStepList: Array<ComputeInstructionStep>;

    /**
     * Get executor.
     */
    public get executor(): InstructionExecuter {
        return this.mExecutor;
    }


    /**
     * Get all instruction steps.
     */
    public get steps(): Array<ComputeInstructionStep> {
        return this.mStepList;
    }

    /**
     * Constructor.
     * @param pDevice - Device reference.
     */
    public constructor(pDevice: GpuDevice, pExecutor: InstructionExecuter) {
        super(pDevice);

        this.mStepList = new Array<ComputeInstructionStep>();
        this.mExecutor = pExecutor;
    }

    /**
     * Add instruction step.
     * @param pPipeline - Pipeline.
     * @param pBindData -  Pipeline bind data.
     */
    public addStep(pPipeline: ComputePipeline, pBindData: Record<number, BindDataGroup>): void {
        const lStep: ComputeInstructionStep = {
            pipeline: pPipeline,
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
        this.device.generator.request<'computeInstruction'>(this).execute();
    }
}

type ComputeInstructionStep = {
    pipeline: ComputePipeline;
    bindData: Array<BindDataGroup | null>;
};