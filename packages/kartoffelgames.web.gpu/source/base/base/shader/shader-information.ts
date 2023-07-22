import { Dictionary } from '@kartoffelgames/core.data';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { IMemoryLayout } from '../../interface/memory_layout/i-memory-layout.interface';
import { GpuDependent } from '../gpu/gpu-dependent';
import { GpuDevice } from '../gpu/gpu-device';
import { MemoryLayout } from '../memory_layout/memory-layout';

export abstract class ShaderInformation<TGpu extends GpuDevice> extends GpuDependent<TGpu> {
    private readonly mBindings: Dictionary<number, Array<MemoryLayout<TGpu>>>;
    private readonly mEntryPoints: Dictionary<ComputeStage, ShaderFunction>;

    /**
     * Shader bindings. Grouped by group.
     */
    public get bindings(): Map<number, Array<IMemoryLayout>> {
        return this.mBindings;
    }

    /**
     * Shader entry points.
     */
    public get entryPoints(): Map<ComputeStage, ShaderFunction> {
        return this.mEntryPoints;
    }

    /**
     * Constructor.
     * @param pSourceCode - Shader source code.
     */
    public constructor(pGpu: TGpu, pSourceCode: string) {
        super(pGpu);

        // Set placeholder variables.
        this.mBindings = new Dictionary<number, Array<MemoryLayout<TGpu>>>();
        this.mEntryPoints = new Dictionary<ComputeStage, ShaderFunction>();

        // Fetch entry points.
        const lEntryPointList: Array<[ComputeStage, ShaderFunction]> = this.fetchEntryPoints(pSourceCode);
        for (const [lEntryPointStage, lEntryPointFunction] of lEntryPointList) {
            this.mEntryPoints.set(lEntryPointStage, lEntryPointFunction);
        }

        // Fetch bindings.
        const lBindList: Array<[number, MemoryLayout<TGpu>]> = this.fetchBindings(pSourceCode);
        for (const [lBindGroupIndex, lBindLayout] of lBindList) {
            // Init new bind group.
            if (!this.mBindings.has(lBindGroupIndex)) {
                this.mBindings.set(lBindGroupIndex, new Array<MemoryLayout<TGpu>>());
            }

            this.mBindings.get(lBindGroupIndex)!.push(lBindLayout);
        }
    }

    /**
     * Fetch shader binds.
     * @param pSourceCode - Shader source code.
     */
    protected abstract fetchBindings(pSourceCode: string): Array<[number, MemoryLayout<TGpu>]>;

    /**
     * Fetch entry points.
     * @param pSourceCode - Shader source code. 
     */
    protected abstract fetchEntryPoints(pSourceCode: string): Array<[ComputeStage, ShaderFunction]>;
}

export type ShaderFunction = {
    name: string;
    parameter: Array<IMemoryLayout>;
    return: IMemoryLayout | null;
};