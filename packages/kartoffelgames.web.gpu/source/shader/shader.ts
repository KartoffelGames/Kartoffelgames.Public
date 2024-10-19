import { Dictionary, Exception } from '@kartoffelgames/core';
import { ComputeStage } from '../constant/compute-stage.enum';
import { BindGroupLayout } from '../binding/bind-group-layout';
import { PipelineLayout } from '../binding/pipeline-layout';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, GpuObjectSetupReferences } from '../gpu/object/gpu-object';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { IGpuObjectSetup } from '../gpu/object/interface/i-gpu-object-setup';
import { BufferItemFormat } from '../constant/buffer-item-format.enum';
import { BufferItemMultiplier } from '../constant/buffer-item-multiplier.enum';
import { VertexParameterLayout } from '../pipeline/parameter/vertex-parameter-layout';
import { ShaderSetup, ShaderSetupReferenceData } from './setup/shader-setup';
import { ShaderComputeModule } from './shader-compute-module';
import { ShaderRenderModule } from './shader-render-module';

export class Shader extends GpuObject<GPUShaderModule, '', ShaderSetup> implements IGpuObjectNative<GPUShaderModule>, IGpuObjectSetup<ShaderSetup> {
    private readonly mEntryPoints: ShaderModuleEntryPoints;
    private readonly mParameter: Dictionary<string, Set<ComputeStage>>;
    private mPipelineLayout: PipelineLayout | null;
    private readonly mSource: string;
    private readonly mSourceMap: any | null;

    /**
     * Shader pipeline layout.
     */
    public get layout(): PipelineLayout {
        // Ensure setup is called.
        this.ensureSetup();

        return this.mPipelineLayout!;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPUShaderModule {
        return super.native;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     * @param pSource - Shader source as wgsl code.
     * @param pLayout - Shader layout information.
     */
    public constructor(pDevice: GpuDevice, pSource: string, pSourceMap: any | null = null) {
        super(pDevice);

        // Create shader information for source.
        this.mSource = pSource;
        this.mSourceMap = pSourceMap;

        // Init default unset values.
        this.mParameter = new Dictionary<string, Set<ComputeStage>>();
        this.mPipelineLayout = null;
        this.mEntryPoints = {
            compute: new Dictionary<string, ShaderModuleEntryPointCompute>(),
            vertex: new Dictionary<string, ShaderModuleEntryPointVertex>(),
            fragment: new Dictionary<string, ShaderModuleEntryPointFragment>()
        };
    }

    /**
     * Create a compute module from shader entry point.
     * 
     * @param pEntryName - Compute entry name.
     * 
     * @returns shader compute module. 
     */
    public createComputeModule(pEntryName: string): ShaderComputeModule {
        // Ensure setup is called.
        this.ensureSetup();

        const lEntryPoint: ShaderModuleEntryPointCompute | undefined = this.mEntryPoints.compute.get(pEntryName);
        if (!lEntryPoint) {
            throw new Exception(`Compute entry point "${pEntryName}" does not exists.`, this);
        }

        // Return shader module without defined workgroup sizes.
        if (!lEntryPoint.static) {
            return new ShaderComputeModule(this.device, this, pEntryName);
        }

        // Define workgroup sizes.
        return new ShaderComputeModule(this.device, this, pEntryName, [lEntryPoint.workgroupDimension.x ?? 1, lEntryPoint.workgroupDimension.y ?? 1, lEntryPoint.workgroupDimension.z ?? 1]);
    }

    /**
     * Create a render module from a vertex and fragment entry point.
     * 
     * @param pVertexEntryName - Vertex entry point.
     * @param pFragmentEntryName - Optional fragment entry point.
     * 
     * @returns shader render module. 
     */
    public createRenderModule(pVertexEntryName: string, pFragmentEntryName?: string): ShaderRenderModule {
        // Ensure setup is called.
        this.ensureSetup();

        const lVertexEntryPoint: ShaderModuleEntryPointVertex | undefined = this.mEntryPoints.vertex.get(pVertexEntryName);
        if (!lVertexEntryPoint) {
            throw new Exception(`Vertex entry point "${pVertexEntryName}" does not exists.`, this);
        }

        // Return shader module without fragment entry.
        if (!pFragmentEntryName) {
            return new ShaderRenderModule(this.device, this, pVertexEntryName, lVertexEntryPoint.parameter);
        }

        // Validate fragment entry point.
        const lFragmentEntryPoint: ShaderModuleEntryPointFragment | undefined = this.mEntryPoints.fragment.get(pFragmentEntryName);
        if (!lFragmentEntryPoint) {
            throw new Exception(`Fragment entry point "${pFragmentEntryName}" does not exists.`, this);
        }

        return new ShaderRenderModule(this.device, this, pVertexEntryName, lVertexEntryPoint.parameter, pFragmentEntryName);
    }

    /**
     * Get shader pipeline parameters.
     * 
     * @param pParameterName - Parameter name.
     */
    public parameter(pParameterName: string): Set<ComputeStage> {
        // Ensure setup is called.
        this.ensureSetup();

        // Try to read parameter type.
        const lParameterType: Set<ComputeStage> | undefined = this.mParameter.get(pParameterName);
        if (!lParameterType) {
            throw new Exception(`Shader has parameter "${pParameterName}" not defined.`, this);
        }

        return new Set(lParameterType);
    }

    /**
     * Setup render targets.
     * Can only be called once and is the only way to create or add target textures.
     * 
     * @param pSetup - Setup call.
     * 
     * @returns this. 
     */
    public override setup(pSetupCallback?: ((pSetup: ShaderSetup) => void) | undefined): this {
        return super.setup(pSetupCallback);
    }

    /**
     * Generate shader module.
     */
    protected override generateNative(): GPUShaderModule {
        // Read pipeline for compilation hints.
        const lPipelineLayout = this.mPipelineLayout!.native;

        // Create compilationHints for every entry point
        const lCompilationHints: Array<GPUShaderModuleCompilationHint> = new Array<GPUShaderModuleCompilationHint>();
        for (const lEntryName of [...this.mEntryPoints.vertex.keys(), ...this.mEntryPoints.fragment.keys(), ...this.mEntryPoints.compute.keys()]) {
            lCompilationHints.push({
                entryPoint: lEntryName,
                layout: lPipelineLayout
            });
        }

        // Create shader module use hints to speed up compilation on safari.
        return this.device.gpu.createShaderModule({
            code: this.mSource,
            compilationHints: lCompilationHints,
            sourceMap: this.mSourceMap ?? {}
        });
    }

    /**
     * Setup with setup object.
     * 
     * @param pReferences - Used references.
     */
    protected override onSetup(pReferences: ShaderSetupReferenceData): void {
        // Setup parameter.
        for (const lParameter of pReferences.parameter) {
            // Dont override parameters.
            if (this.mParameter.has(lParameter.name)) {
                throw new Exception(`Can't add parameter "${lParameter.name}" more than once.`, this);
            }

            // Add parameter.
            this.mParameter.set(lParameter.name, new Set<ComputeStage>(lParameter.usage));
        }

        // Convert fragment entry point informations
        for (const lFragmentEntry of pReferences.fragmentEntrypoints) {
            // Restrict doublicate fragment entry names.
            if (this.mEntryPoints.fragment.has(lFragmentEntry.name)) {
                throw new Exception(`Fragment entry "${lFragmentEntry.name}" was setup more than once.`, this);
            }

            // Convert all render attachments to a location mapping.
            const lRenderTargetLocations: Set<number> = new Set<number>();
            const lRenderTargets: ShaderModuleEntryPointFragment['renderTargets'] = new Dictionary<string, any>();
            for (const lRenderTarget of lFragmentEntry.renderTargets) {
                // Restrict doublicate fragment entry render target names.
                if (lRenderTargets.has(lRenderTarget.name)) {
                    throw new Exception(`Fragment entry "${lFragmentEntry.name}" was has doublicate render attachment name "${lRenderTarget.name}".`, this);
                }

                // Restrict doublicate fragment entry render target locations.
                if (lRenderTargetLocations.has(lRenderTarget.location)) {
                    throw new Exception(`Fragment entry "${lFragmentEntry.name}" was has doublicate render attachment location index "${lRenderTarget.location}".`, this);
                }

                // Add location to location index buffer. Used for finding dublicates.
                lRenderTargetLocations.add(lRenderTarget.location);

                // Add target to list. 
                lRenderTargets.set(lRenderTarget.name, {
                    name: lRenderTarget.name,
                    location: lRenderTarget.location,
                    format: lRenderTarget.format,
                    multiplier: lRenderTarget.multiplier
                });
            }

            // Set fragment entry point definition. 
            this.mEntryPoints.fragment.set(lFragmentEntry.name, {
                renderTargets: lRenderTargets
            });
        }

        // Convert vertex entry point informations
        for (const lVertexEntry of pReferences.vertexEntrypoints) {
            // Restrict doublicate vertex entry names.
            if (this.mEntryPoints.vertex.has(lVertexEntry.name)) {
                throw new Exception(`Vertex entry "${lVertexEntry.name}" was setup more than once.`, this);
            }

            // Set vertex entry point definition. 
            this.mEntryPoints.vertex.set(lVertexEntry.name, {
                parameter: lVertexEntry.parameter
            });
        }

        // Convert compute entry point informations
        for (const lComputeEntry of pReferences.computeEntrypoints) {
            // Restrict doublicate compute entry names.
            if (this.mEntryPoints.compute.has(lComputeEntry.name)) {
                throw new Exception(`Vertex entry "${lComputeEntry.name}" was setup more than once.`, this);
            }

            // Set vertex entry point definition. 
            this.mEntryPoints.compute.set(lComputeEntry.name, {
                static: lComputeEntry.workgroupDimension !== null,
                workgroupDimension: {
                    x: lComputeEntry.workgroupDimension?.x ?? null,
                    y: lComputeEntry.workgroupDimension?.y ?? null,
                    z: lComputeEntry.workgroupDimension?.z ?? null
                }
            });
        }

        // Generate initial pipeline layout.
        const lInitialPipelineLayout: Dictionary<number, BindGroupLayout> = new Dictionary<number, BindGroupLayout>();
        for (const lGroup of pReferences.bindingGroups) {
            // Set bind group layout with group index.
            lInitialPipelineLayout.set(lGroup.index, lGroup.group);
        }
        this.mPipelineLayout = new PipelineLayout(this.device, lInitialPipelineLayout);
    }

    /**
     * Create setup object. Return null to skip any setups.
     * 
     *  @param pReferences - Unfilled setup references.
     * 
     *  @returns Setup object.
     */
    protected override onSetupObjectCreate(pReferences: GpuObjectSetupReferences<ShaderSetupReferenceData>): ShaderSetup {
        return new ShaderSetup(pReferences);
    }
}

export type ShaderModuleEntryPointCompute = {
    static: boolean;
    workgroupDimension: {
        x: number | null;
        y: number | null;
        z: number | null;
    };
};

export type ShaderModuleEntryPointVertex = {
    parameter: VertexParameterLayout;
};

export type ShaderModuleEntryPointFragmentRenderTarget = {
    name: string;
    location: number;
    format: BufferItemFormat;
    multiplier: BufferItemMultiplier;
};
export type ShaderModuleEntryPointFragment = {
    renderTargets: Dictionary<string, ShaderModuleEntryPointFragmentRenderTarget>;
};

type ShaderModuleEntryPoints = {
    compute: Dictionary<string, ShaderModuleEntryPointCompute>,
    vertex: Dictionary<string, ShaderModuleEntryPointVertex>,
    fragment: Dictionary<string, ShaderModuleEntryPointFragment>,
};