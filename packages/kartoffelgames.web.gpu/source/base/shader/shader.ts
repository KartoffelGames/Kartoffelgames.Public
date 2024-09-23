import { Dictionary, Exception } from '@kartoffelgames/core';
import { BindGroupLayout, BindLayout } from '../binding/bind-group-layout';
import { PipelineLayout } from '../binding/pipeline-layout';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, GpuObjectSetupReferences, NativeObjectLifeTime } from '../gpu/object/gpu-object';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { IGpuObjectSetup } from '../gpu/object/interface/i-gpu-object-setup';
import { PrimitiveBufferFormat } from '../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { VertexParameterLayout, VertexParameterLayoutDefinition } from '../pipeline/parameter/vertex-parameter-layout';
import { ShaderSetup, ShaderSetupReferenceData } from './setup/shader-setup';
import { ShaderComputeModule } from './shader-compute-module';
import { ShaderRenderModule } from './shader-render-module';

export class Shader extends GpuObject<GPUShaderModule, ShaderSetup> implements IGpuObjectNative<GPUShaderModule>, IGpuObjectSetup<ShaderSetup> {
    private readonly mEntryPoints: ShaderModuleEntryPoints;
    private readonly mParameter: Dictionary<string, PrimitiveBufferFormat>;
    private mPipelineLayout: PipelineLayout | null;
    private readonly mSource: string;

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
     * Shader pipeline parameters.
     */
    public get parameter(): Dictionary<string, PrimitiveBufferFormat> {
        // Ensure setup is called.
        this.ensureSetup();

        return this.mParameter;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     * @param pSource - Shader source as wgsl code.
     * @param pLayout - Shader layout information.
     */
    public constructor(pDevice: GpuDevice, pSource: string) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        // Create shader information for source.
        this.mSource = pSource;

        // Init default unset values.
        this.mParameter = new Dictionary<string, PrimitiveBufferFormat>();
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
    protected override generate(): GPUShaderModule {
        // TODO: Create compilationHints for every entry point?

        // Create shader module use hints to speed up compilation on safari.
        return this.device.gpu.createShaderModule({
            code: this.mSource,
            // TODO: sourceMap: undefined
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
            this.mParameter.set(lParameter.name, lParameter.format);
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

            // Convert all render attachments to a location mapping. 
            const lVertexParameterLocations: Set<number> = new Set<number>();
            const lVertexParameter: Dictionary<string, VertexParameterLayoutDefinition> = new Dictionary<string, VertexParameterLayoutDefinition>();
            for (const lParameter of lVertexEntry.parameter) {
                // Restrict doublicate vertex entry parameter names.
                if (lVertexParameter.has(lParameter.name)) {
                    throw new Exception(`Vertex entry "${lVertexEntry.name}" was has doublicate parameter name "${lParameter.name}".`, this);
                }

                // Restrict doublicate vertex entry parameter locations.
                if (lVertexParameterLocations.has(lParameter.location)) {
                    throw new Exception(`Vertex entry "${lVertexEntry.name}" was has doublicate parameter location index "${lParameter.location}".`, this);
                }

                // Add location to location index buffer. Used for finding dublicates.
                lVertexParameterLocations.add(lParameter.location);

                // Add parameter to list.
                lVertexParameter.add(lParameter.name, {
                    name: lParameter.name,
                    location: lParameter.location,
                    format: lParameter.format,
                    multiplier: lParameter.multiplier
                });
            }

            // Set vertex entry point definition. 
            this.mEntryPoints.vertex.set(lVertexEntry.name, {
                parameter: new VertexParameterLayout(this.device, [...lVertexParameter.values()])
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
            // Generate each binding.
            const lBindLayoutList: Array<BindLayout> = new Array<BindLayout>();
            for (const lBind of lGroup.bindings) {
                // Generate and add bind layout to bind layout list.
                lBindLayoutList.push({
                    name: lBind.name,
                    index: lBind.index,
                    layout: lBind.layout,
                    visibility: lBind.visibility,
                    accessMode: lBind.accessMode
                });
            }

            // Set bind group layout with group index.
            lInitialPipelineLayout.set(lGroup.index, new BindGroupLayout(this.device, lGroup.name, lBindLayoutList));
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
    format: PrimitiveBufferFormat;
    multiplier: PrimitiveBufferMultiplier;
};
export type ShaderModuleEntryPointFragment = {
    renderTargets: Dictionary<string, ShaderModuleEntryPointFragmentRenderTarget>;
};

type ShaderModuleEntryPoints = {
    compute: Dictionary<string, ShaderModuleEntryPointCompute>,
    vertex: Dictionary<string, ShaderModuleEntryPointVertex>,
    fragment: Dictionary<string, ShaderModuleEntryPointFragment>,
};