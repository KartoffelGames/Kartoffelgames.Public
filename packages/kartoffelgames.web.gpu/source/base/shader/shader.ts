import { Dictionary, Exception } from '@kartoffelgames/core';
import { BindGroupLayout, BindLayout } from '../binding/bind-group-layout';
import { PipelineLayout } from '../binding/pipeline-layout';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../gpu/gpu-native-object';
import { PrimitiveBufferFormat } from '../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { VertexParameterLayout, VertexParameterLayoutDefinition } from '../pipeline/parameter/vertex-parameter-layout';
import { ShaderComputeModule } from './shader-compute-module';
import { ShaderLayout } from './shader-layout';
import { ShaderRenderModule } from './shader-render-module';

export class Shader extends GpuNativeObject<GPUShaderModule> {
    private readonly mEntryPoints: ShaderModuleEntryPoints;
    private readonly mParameter: Dictionary<string, PrimitiveBufferFormat>;
    private readonly mPipelineLayout: PipelineLayout;
    private readonly mSource: string;

    /**
     * Shader pipeline layout.
     */
    public get layout(): PipelineLayout {
        return this.mPipelineLayout;
    }

    /**
     * Shader pipeline parameters.
     */
    public get parameter(): Dictionary<string, PrimitiveBufferFormat> {
        return this.mParameter;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     * @param pSource - Shader source as wgsl code.
     * @param pLayout - Shader layout information.
     */
    public constructor(pDevice: GpuDevice, pSource: string, pLayout: ShaderLayout) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        // TODO: Add limitations that should be checked. (GroupCount, BindCount, Float16)

        // Create shader information for source.
        this.mSource = pSource;

        // Generate initial pipeline layout.
        const lInitialPipelineLayout: Dictionary<number, BindGroupLayout> = new Dictionary<number, BindGroupLayout>();
        for (const lGroupName of Object.keys(pLayout.groups)) {
            const lGroup: ShaderLayout['groups'][string] = pLayout.groups[lGroupName];

            // Generate each binding.
            const lBindLayoutList: Array<BindLayout> = new Array<BindLayout>();
            for (const lBindName of Object.keys(lGroup.bindings)) {
                const lBind: ShaderLayout['groups'][string]['bindings'][string] = lGroup.bindings[lBindName];

                // Generate and add bind layout to bind layout list.
                lBindLayoutList.push({
                    name: lBindName,
                    index: lBind.index,
                    layout: lBind.layout,
                    visibility: lBind.visibility,
                    accessMode: lBind.accessMode
                });
            }

            // Set bind group layout with group index.
            lInitialPipelineLayout.set(lGroup.index, new BindGroupLayout(this.device, lGroupName, lBindLayoutList));
        }

        // Generate layout.
        this.mPipelineLayout = new PipelineLayout(this.device, lInitialPipelineLayout);

        // Save parameters.
        this.mParameter = new Dictionary<string, PrimitiveBufferFormat>(Object.entries(pLayout.parameter));

        // Init entry points.
        this.mEntryPoints = {
            compute: new Dictionary<string, ShaderModuleEntryPointCompute>(),
            vertex: new Dictionary<string, ShaderModuleEntryPointVertex>(),
            fragment: new Dictionary<string, ShaderModuleEntryPointFragment>()
        };

        // Convert compute entry point informations
        for (const lComputeEntryName of Object.keys(pLayout.computeEntryPoints)) {
            const lComputeEntry: ShaderLayout['computeEntryPoints'][string] = pLayout.computeEntryPoints[lComputeEntryName];

            this.mEntryPoints.compute.set(lComputeEntryName, {
                // Workgroup is static when all dimensions are static set.
                static: lComputeEntry.workgroupSize.x > 0 && lComputeEntry.workgroupSize.y > 0 && lComputeEntry.workgroupSize.z > 0,

                workgroupDimension: {
                    x: lComputeEntry.workgroupSize.x > 0 ? lComputeEntry.workgroupSize.x : null,
                    y: lComputeEntry.workgroupSize.y > 0 ? lComputeEntry.workgroupSize.y : null,
                    z: lComputeEntry.workgroupSize.z > 0 ? lComputeEntry.workgroupSize.z : null
                }
            });
        }

        // Convert fragment entry point informations
        for (const lFragmentEntryName of Object.keys(pLayout.fragmentEntryPoints)) {
            const lFragmentEntry: ShaderLayout['fragmentEntryPoints'][string] = pLayout.fragmentEntryPoints[lFragmentEntryName];

            // Convert all render attachments to a location mapping. 
            const lLocations: ShaderModuleEntryPointFragment['attachments'] = new Dictionary<string, any>();
            for (const lAttachmentName of Object.keys(lFragmentEntry.attachments)) {
                const lAttachment: ShaderLayout['fragmentEntryPoints'][string]['attachments'][string] = lFragmentEntry.attachments[lAttachmentName];
                lLocations.set(lAttachmentName, {
                    name: lAttachmentName,
                    location: lAttachment.location,
                    format: lAttachment.primitive.format,
                    multiplier: lAttachment.primitive.multiplier
                });
            }

            // Set fragment entry point definition. 
            this.mEntryPoints.fragment.set(lFragmentEntryName, {
                attachments: lLocations
            });
        }

        // Convert vertex entry point informations
        for (const lVertexEntryName of Object.keys(pLayout.vertexEntryPoints)) {
            const lVertexEntry: ShaderLayout['vertexEntryPoints'][string] = pLayout.vertexEntryPoints[lVertexEntryName];

            // Convert all render attachments to a location mapping. 
            const lLocations: Array<VertexParameterLayoutDefinition> = new Array<VertexParameterLayoutDefinition>();
            for (const lParameterName of Object.keys(lVertexEntry.parameter)) {
                const lAttachment: ShaderLayout['vertexEntryPoints'][string]['parameter'][string] = lVertexEntry.parameter[lParameterName];
                lLocations.push({
                    name: lParameterName,
                    location: lAttachment.location,
                    format: lAttachment.primitive.format,
                    multiplier: lAttachment.primitive.multiplier
                });
            }

            // Set vertex entry point definition. 
            this.mEntryPoints.vertex.set(lVertexEntryName, {
                parameter: new VertexParameterLayout(this.device, lLocations)
            });
        }
    }

    /**
     * Create a compute module from shader entry point.
     * 
     * @param pEntryName - Compute entry name.
     * 
     * @returns shader compute module. 
     */
    public createComputeModule(pEntryName: string): ShaderComputeModule {
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
     * Destroy absolutly nothing.
     */
    protected override destroy(): void {
        // Nothing to destroy.
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
}

type ShaderModuleEntryPointCompute = {
    static: boolean;
    workgroupDimension: {
        x: number | null;
        y: number | null;
        z: number | null;
    };
};

type ShaderModuleEntryPointVertex = {
    parameter: VertexParameterLayout;
};

type ShaderModuleEntryPointFragment = {
    attachments: Dictionary<string, {
        name: string;
        location: number;
        format: PrimitiveBufferFormat;
        multiplier: PrimitiveBufferMultiplier;
    }>;
};

type ShaderModuleEntryPoints = {
    compute: Dictionary<string, ShaderModuleEntryPointCompute>,
    vertex: Dictionary<string, ShaderModuleEntryPointVertex>,
    fragment: Dictionary<string, ShaderModuleEntryPointFragment>,
};