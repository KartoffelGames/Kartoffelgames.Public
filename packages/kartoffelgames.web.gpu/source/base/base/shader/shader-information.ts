import { Dictionary } from '@kartoffelgames/core.data';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { GpuDependent } from '../gpu/gpu-dependent';
import { GpuTypes } from '../gpu/gpu-device';

export abstract class ShaderInformation<TGpuTypes extends GpuTypes> extends GpuDependent<TGpuTypes> {
    private readonly mBindings: Dictionary<number, Array<TGpuTypes['memoryLayout']>>;
    private readonly mEntryPoints: Dictionary<ComputeStage, ShaderFunction<TGpuTypes>>;

    /**
     * Shader bindings. Grouped by group.
     */
    public get bindings(): Map<number, Array<TGpuTypes['memoryLayout']>> {
        return this.mBindings;
    }

    /**
     * Shader entry points.
     */
    public get entryPoints(): Map<ComputeStage, ShaderFunction<TGpuTypes>> {
        return this.mEntryPoints;
    }

    /**
     * Constructor.
     * @param pSourceCode - Shader source code.
     */
    public constructor(pGpu: TGpuTypes['gpuDevice'], pSourceCode: string) {
        super(pGpu);

        // Set placeholder variables.
        this.mBindings = new Dictionary<number, Array<TGpuTypes['memoryLayout']>>();
        this.mEntryPoints = new Dictionary<ComputeStage, ShaderFunction<TGpuTypes>>();

        // Fetch entry points.
        const lEntryPointList: Array<[ComputeStage, ShaderFunction<TGpuTypes>]> = this.fetchEntryPoints(pSourceCode);
        for (const [lEntryPointStage, lEntryPointFunction] of lEntryPointList) {
            this.mEntryPoints.set(lEntryPointStage, lEntryPointFunction);
        }

        // Fetch bindings.
        const lBindList: Array<[number, TGpuTypes['memoryLayout']]> = this.fetchBindings(pSourceCode);
        for (const [lBindGroupIndex, lBindLayout] of lBindList) {
            // Init new bind group.
            if (!this.mBindings.has(lBindGroupIndex)) {
                this.mBindings.set(lBindGroupIndex, new Array<TGpuTypes['memoryLayout']>());
            }

            this.mBindings.get(lBindGroupIndex)!.push(lBindLayout);
        }
    }

    /**
     * Fetch shader binds.
     * @param pSourceCode - Shader source code.
     */
    protected abstract fetchBindings(pSourceCode: string): Array<[number, TGpuTypes['memoryLayout']]>;

    /**
     * Fetch entry points.
     * @param pSourceCode - Shader source code. 
     */
    protected abstract fetchEntryPoints(pSourceCode: string): Array<[ComputeStage, ShaderFunction<TGpuTypes>]>;
}

export type ShaderFunction<TGpuTypes extends GpuTypes> = {
    name: string;
    parameter: Array<TGpuTypes['memoryLayout']>;
    return: TGpuTypes['memoryLayout'] | null;
};