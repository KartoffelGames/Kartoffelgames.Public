import { Dictionary } from '@kartoffelgames/core.data';
import { IShaderInformation, ShaderFunction } from '../../interface/shader/i-shader-information';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { MemoryLayout } from '../memory_layout/memory-layout';

export abstract class ShaderInformation implements IShaderInformation {
    private readonly mBindings: Dictionary<number, Array<MemoryLayout>>;
    private readonly mEntryPoints: Dictionary<ComputeStage, ShaderFunction>;

    /**
     * Shader bindings. Grouped by group.
     */
    public get bindings(): Map<number, Array<MemoryLayout>> {
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
    public constructor(pSourceCode: string) {
        // Set placeholder variables.
        this.mBindings = new Dictionary<number, Array<MemoryLayout>>();
        this.mEntryPoints = new Dictionary<ComputeStage, ShaderFunction>();

        // Fetch entry points.
        const lEntryPointList: Array<[ComputeStage, ShaderFunction]> = this.fetchEntryPoints(pSourceCode);
        for (const [lEntryPointStage, lEntryPointFunction] of lEntryPointList) {
            this.mEntryPoints.set(lEntryPointStage, lEntryPointFunction);
        }

        // Fetch bindings.
        const lBindList: Array<[number, MemoryLayout]> = this.fetchBindings(pSourceCode);
        for (const [lBindGroupIndex, lBindLayout] of lBindList) {
            // Init new bind group.
            if (!this.mBindings.has(lBindGroupIndex)) {
                this.mBindings.set(lBindGroupIndex, new Array<MemoryLayout>());
            }

            this.mBindings.get(lBindGroupIndex)!.push(lBindLayout);
        }
    }

    /**
     * Fetch entry points.
     * @param pSourceCode - Shader source code. 
     */
    protected abstract fetchEntryPoints(pSourceCode: string): Array<[ComputeStage, ShaderFunction]>;

    /**
     * Fetch shader binds.
     * @param pSourceCode - Shader source code.
     */
    protected abstract fetchBindings(pSourceCode: string): Array<[number, MemoryLayout]>;
}