import { Gpu } from './gpu';

export class Shader {
    private readonly mEntryPoints: EntryPoints;
    private readonly mShaderModule: GPUShaderModule;

    /**
     * Compute entry point name.
     */
    public get computeEntryPoint(): string | undefined {
        return this.mEntryPoints.compute;
    }

    /**
     * Fragment entry point name.
     */
    public get fragmentEntryPoint(): string | undefined {
        return this.mEntryPoints.fragment;
    }

    /**
     * Compiled shader module.
     */
    public get shaderModule(): GPUShaderModule {
        return this.mShaderModule;
    }

    /**
     * Vertex entry point name.
     */
    public get vertexEntryPoint(): string | undefined {
        return this.mEntryPoints.vertex;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pSource - Shader module source code.
     */
    public constructor(pGpu: Gpu, pSource: string) {
        this.mShaderModule = pGpu.device.createShaderModule({ code: pSource });

        // Fetch entry points.
        this.mEntryPoints = {
            fragment: /(@fragment\b\nfn )(\w*)/gm.exec(pSource)?.[2],
            vertex: /(@vertex\b\nfn )(\w*)/gm.exec(pSource)?.[2],
            compute: /(@compute\b\nfn )(\w*)/gm.exec(pSource)?.[2]
        };
    }
}

type EntryPoints = {
    fragment?: string | undefined;
    vertex?: string | undefined;
    compute?: string | undefined;
};