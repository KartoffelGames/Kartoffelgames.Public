import { Exception } from '@kartoffelgames/core.data';
import { BindDataGroup } from '../../binding/bind-data-group';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/gpu-object';
import { ComputePipeline } from '../../pipeline/compute-pipeline';

export class ComputeInstruction extends GpuObject<'computeInstruction'> {
    private readonly mStepList: Array<ComputeInstructionStep>;

    /**
     * Constructor.
     * @param pDevice - Device reference.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);

        this.mStepList = new Array<ComputeInstructionStep>();
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
     */
    public execute(): void {
        this.device.generator.request<'computeInstruction'>(this).execute();
    }
}

type ComputeInstructionStep = {
    pipeline: ComputePipeline;
    bindData: Array<BindDataGroup | null>;
};