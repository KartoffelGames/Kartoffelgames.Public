import { Dictionary } from '@kartoffelgames/core.data';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { GpuDependent } from '../gpu/gpu-dependent';
import { GpuTypes } from '../gpu/gpu-device';

export abstract class ShaderInformation<TGpuTypes extends GpuTypes> extends GpuDependent<TGpuTypes> {
    private readonly mBindings: Dictionary<number, Array<TGpuTypes['memoryLayout']>>;
    private readonly mEntryPoints: Dictionary<ComputeStage, ShaderFunction<TGpuTypes>>;
    private readonly mShaderFunctions: Dictionary<string, ShaderFunction<TGpuTypes>>;
    private readonly mShaderValue: Dictionary<string, ShaderValue<TGpuTypes>>;
    private readonly mSourceCode: string;

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
     * Shader source code.
     */
    public get source(): string {
        return this.mSourceCode;
    }

    /**
     * Constructor.
     * @param pSourceCode - Shader source code.
     */
    public constructor(pGpu: TGpuTypes['gpuDevice'], pSourceCode: string) {
        super(pGpu);

        this.mSourceCode = pSourceCode;

        // Meta data storages placeholders.
        this.mShaderFunctions = new Dictionary<string, ShaderFunction<TGpuTypes>>();
        this.mShaderValue = new Dictionary<string, ShaderValue<TGpuTypes>>();

        // Get all shader functions.
        for (const lShaderFunction of this.fetchFunctions(pSourceCode)) {
            this.mShaderFunctions.set(lShaderFunction.name, lShaderFunction);
        }

        // Get all shader values.
        for (const lShaderValue of this.fetchGlobalValues(pSourceCode)) {
            this.mShaderValue.set(lShaderValue.name, lShaderValue);
        }

        // Set entry point and bindings.
        this.mEntryPoints = this.readEntryPoints();
        this.mBindings = this.readBindings();
    }

    /**
     * Get visibility of global name.
     * @param pName - Name of a global. 
     */
    protected visibilityOf(pName: string): ComputeStage {
        let lComputeStage: ComputeStage = <ComputeStage>0;

        for (const lShaderFunction of this.searchEntryPointsOf(pName, new Set<string>())) {
            lComputeStage |= lShaderFunction.tag;
        }

        return lComputeStage;
    }

    /**
     * Fetch shader binds.
     * @param pSourceCode - Shader source code.
     */
    private readBindings(): Dictionary<number, Array<TGpuTypes['memoryLayout']>> {
        const lBindings: Dictionary<number, Array<TGpuTypes['memoryLayout']>> = new Dictionary<number, Array<TGpuTypes['memoryLayout']>>();

        for (const lShaderValue of this.mShaderValue.values()) {
            // Skip all values without binding group.
            if (lShaderValue.group === null) {
                continue;
            }

            // Init new bind group.
            if (!lBindings.has(lShaderValue.group)) {
                lBindings.set(lShaderValue.group, new Array<TGpuTypes['memoryLayout']>());
            }

            lBindings.get(lShaderValue.group)!.push(lShaderValue.value);
        }

        return lBindings;
    }

    /**
     * Read entry points from crawled shader functions.
     */
    private readEntryPoints(): Dictionary<ComputeStage, ShaderFunction<TGpuTypes>> {
        const lEntryPoints: Dictionary<ComputeStage, ShaderFunction<TGpuTypes>> = new Dictionary<ComputeStage, ShaderFunction<TGpuTypes>>();

        // Map shader function to entry point by function tags.
        for (const lShaderFunction of this.mShaderFunctions.values()) {
            if ((lShaderFunction.tag & ComputeStage.Compute) === ComputeStage.Compute) {
                lEntryPoints.set(ComputeStage.Compute, lShaderFunction);
            }
            if ((lShaderFunction.tag & ComputeStage.Vertex) === ComputeStage.Vertex) {
                lEntryPoints.set(ComputeStage.Vertex, lShaderFunction);
            }
            if ((lShaderFunction.tag & ComputeStage.Fragment) === ComputeStage.Fragment) {
                lEntryPoints.set(ComputeStage.Fragment, lShaderFunction);
            }
        }

        return lEntryPoints;
    }

    /**
     * Search for all functions hat uses the global name.
     * @param pName - variable or function name.
     * @param pScannedNames - All already scanned names. Prevents recursion.
     */
    private searchEntryPointsOf(pName: string, pScannedNames: Set<string>): Array<ShaderFunction<TGpuTypes>> {
        // Add current searched name to already scanned names.
        pScannedNames.add(pName);

        const lUsedFunctionList: Array<ShaderFunction<TGpuTypes>> = new Array<ShaderFunction<TGpuTypes>>();

        // Search all global names of all functions.
        for (const lShaderFunction of this.mShaderFunctions.values()) {
            for (const lGlobal of lShaderFunction.usedGlobals) {
                // Prevent endless recursion.
                if (pScannedNames.has(lGlobal)) {
                    continue;
                }

                // Further down the rabbithole. Search for 
                if (this.mShaderFunctions.has(lGlobal)) {
                    // Add found function to used function list.
                    lUsedFunctionList.push(this.mShaderFunctions.get(lGlobal)!);

                    // Recursive search for all functions that use this function.
                    lUsedFunctionList.push(...this.searchEntryPointsOf(lGlobal, pScannedNames));
                }
            }
        }

        return [...new Set<ShaderFunction<TGpuTypes>>(lUsedFunctionList)];
    }

    /**
     * Get all functions.
     * @param pSourceCode - Source code of shader.
     */
    protected abstract fetchFunctions(pSourceCode: string): Array<ShaderFunction<TGpuTypes>>;

    /**
     * Get all global shader values.
     * @param pSourceCode - Source code of shader.
     */
    protected abstract fetchGlobalValues(pSourceCode: string): Array<ShaderValue<TGpuTypes>>;
}

export type ShaderGlobal<TGpuTypes extends GpuTypes> = ShaderValue<TGpuTypes> | ShaderFunction<TGpuTypes>;

export type ShaderValue<TGpuTypes extends GpuTypes> = {
    name: string,
    value: TGpuTypes['memoryLayout'];
    group: number | null;
};

export type ShaderFunction<TGpuTypes extends GpuTypes> = {
    tag: ComputeStage;
    usedGlobals: Array<string>;
    name: string;
    parameter: Array<TGpuTypes['memoryLayout']>;
    return: TGpuTypes['memoryLayout'] | null;
};