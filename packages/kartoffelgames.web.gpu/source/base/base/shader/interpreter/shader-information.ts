import { Dictionary } from '@kartoffelgames/core.data';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { BaseMemoryLayout } from '../../memory_layout/base-memory-layout';

export class ShaderInformation {
    private readonly mBindings: Dictionary<number, Array<BaseMemoryLayout>>;
    private readonly mEntryPoints: Dictionary<ComputeStage, Array<ShaderFunction>>;
    private readonly mShaderFunctions: Dictionary<string, ShaderFunction>;
    private readonly mSourceCode: string;

    /**
     * Shader bindings. Grouped by group.
     */
    public get bindings(): Map<number, Array<BaseMemoryLayout>> {
        return this.mBindings;
    }

    /**
     * Shader entry points.
     */
    public get entryPoints(): Map<ComputeStage, Array<ShaderFunction>> {
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
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: ShaderInformationParameter) {
        this.mSourceCode = pParameter.sourceCode;

        // Set binding.
        this.mBindings = pParameter.bindings;

        // Map functions by name.
        this.mShaderFunctions = new Dictionary<string, ShaderFunction>();
        for (const lShaderFunction of pParameter.shaderFunctions) {
            this.mShaderFunctions.set(lShaderFunction.name, lShaderFunction);
        }

        // Read entry points of shader functions.
        this.mEntryPoints = this.readEntryPoints(pParameter.shaderFunctions);
    }

    /**
     * Get shader function.
     * @param pName - Function name.
     */
    public getFunction(pName: string): ShaderFunction | null {
        return this.mShaderFunctions.get(pName) ?? null;
    }

    /**
     * Read entry points from crawled shader functions.
     */
    private readEntryPoints(pFunctions: Array<ShaderFunction>): Dictionary<ComputeStage, Array<ShaderFunction>> {
        const lEntryPoints: Dictionary<ComputeStage, Array<ShaderFunction>> = new Dictionary<ComputeStage, Array<ShaderFunction>>();

        // Map shader function to entry point by function tags.
        for (const lShaderFunction of pFunctions) {
            // Check for compute entry point.
            if ((lShaderFunction.entryPoints & ComputeStage.Compute) === ComputeStage.Compute) {
                // Init shader stage container.
                if (!lEntryPoints.has(ComputeStage.Compute)) {
                    lEntryPoints.set(ComputeStage.Compute, new Array<ShaderFunction>());
                }

                lEntryPoints.get(ComputeStage.Compute)!.push(lShaderFunction);
            }

            // Check for vertex entry point.
            if ((lShaderFunction.entryPoints & ComputeStage.Vertex) === ComputeStage.Vertex) {
                // Init shader stage container.
                if (!lEntryPoints.has(ComputeStage.Vertex)) {
                    lEntryPoints.set(ComputeStage.Vertex, new Array<ShaderFunction>());
                }

                lEntryPoints.get(ComputeStage.Vertex)!.push(lShaderFunction);
            }

            // Check for fragment entry point.
            if ((lShaderFunction.entryPoints & ComputeStage.Fragment) === ComputeStage.Fragment) {
                // Init shader stage container.
                if (!lEntryPoints.has(ComputeStage.Fragment)) {
                    lEntryPoints.set(ComputeStage.Fragment, new Array<ShaderFunction>());
                }

                lEntryPoints.get(ComputeStage.Fragment)!.push(lShaderFunction);
            }
        }

        return lEntryPoints;
    }
}

type ShaderInformationParameter = {
    bindings: Dictionary<number, Array<BaseMemoryLayout>>;
    shaderFunctions: Array<ShaderFunction>;
    sourceCode: string;
};

export type ShaderFunction = {
    entryPoints: ComputeStage;
    usedGlobals: Array<string>;
    name: string;
    parameter: Array<BaseMemoryLayout>;
    return: BaseMemoryLayout | null;
};