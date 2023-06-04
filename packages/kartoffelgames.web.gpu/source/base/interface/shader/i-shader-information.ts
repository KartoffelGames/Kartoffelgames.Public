import { MemoryLayout } from '../../base/memory_layout/memory-layout';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { IMemoryLayout } from '../memory_layout/i-memory-layout.interface';

export interface IShaderInformation {
    /**
     * Shader bindings. Grouped by group.
     */
    bindings: Map<number, Array<MemoryLayout>>;

    /**
     * Shader entry points.
     */
    entryPoints: Map<ComputeStage, ShaderFunction>;
}

export type ShaderFunction = {
    name: string;
    parameter: Array<IMemoryLayout>;
    return: IMemoryLayout | null;
};