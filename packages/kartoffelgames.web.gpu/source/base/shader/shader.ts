import { Dictionary, Exception } from '@kartoffelgames/core';
import { BindGroupLayout, BindLayout } from '../binding/bind-group-layout';
import { PipelineLayout } from '../binding/pipeline-layout';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, NativeObjectLifeTime } from '../gpu/object/gpu-object';
import { PrimitiveBufferFormat } from '../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { VertexParameterLayout, VertexParameterLayoutDefinition } from '../pipeline/parameter/vertex-parameter-layout';
import { ShaderSetup } from './setup/shader-setup';
import { ShaderComputeModule } from './shader-compute-module';
import { ShaderRenderModule } from './shader-render-module';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';

export class Shader extends GpuObject<GPUShaderModule> implements IGpuObjectNative<GPUShaderModule> {
    private readonly mEntryPoints: ShaderModuleEntryPoints;
    private mIsSetup: boolean;
    private readonly mParameter: Dictionary<string, PrimitiveBufferFormat>;
    private mPipelineLayout: PipelineLayout | null;
    private readonly mSource: string;

    /**
     * Shader pipeline layout.
     */
    public get layout(): PipelineLayout {
        // Layout only available after setup.
        if (this.mIsSetup) {
            throw new Exception(`To access the layout, the shader must be setup.`, this);
        }

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

        // Init setup object.
        this.mIsSetup = false;

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

        // Convert fragment entry point informations
        for (const lFragmentEntryName of Object.keys(pLayout.fragmentEntryPoints)) {
            const lFragmentEntry: ShaderLayout['fragmentEntryPoints'][string] = pLayout.fragmentEntryPoints[lFragmentEntryName];

            // Convert all render attachments to a location mapping. 
            const lLocations: ShaderModuleEntryPointFragment['renderTargets'] = new Dictionary<string, any>();
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
                renderTargets: lLocations
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
     * Setup render targets.
     * Can only be called once and is the only way to create or add target textures.
     * 
     * @param pSetup - Setup call.
     * 
     * @returns this. 
     */
    public setup(pSetup: (pSetup: ShaderSetup) => void): this {
        // Dont call twice.
        if (this.mIsSetup) {
            throw new Exception(`Shader setup can't be called twice.`, this);
        }

        // Create references to internal resources.
        const lSetupReference: ShaderSetupReference = {
            shader: this,
            device: this.device,
            inSetup: true,
            entrypoints: this.mEntryPoints,
            parameter: this.mParameter,
            pipelineLayout: new Dictionary<number, BindGroupLayout>()
        };

        // Call setup.
        pSetup(new ShaderSetup(lSetupReference));

        // Lock setup.
        this.mIsSetup = true;

        // Lock setup reference.
        lSetupReference.inSetup = false;

        // Init and generate layout.
        this.mPipelineLayout = new PipelineLayout(this.device, lSetupReference.pipelineLayout);

        // TODO: Add limitations that should be checked. (GroupCount, BindCount, Float16)

        return this;
    }

    /**
     * Generate shader module.
     */
    protected override generate(): GPUShaderModule {
        // Must be setup.
        if (!this.mIsSetup) {
            throw new Exception(`Shader must be setup.`, this);
        }

        // TODO: Create compilationHints for every entry point?

        // Create shader module use hints to speed up compilation on safari.
        return this.device.gpu.createShaderModule({
            code: this.mSource,
            // TODO: sourceMap: undefined
        });
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

export type ShaderSetupReference = {
    shader: Shader;
    device: GpuDevice;
    inSetup: boolean;
    entrypoints: ShaderModuleEntryPoints;
    parameter: Dictionary<string, PrimitiveBufferFormat>;
    pipelineLayout: Dictionary<number, BindGroupLayout>;
};

/**
 * Shader layout description. // TODO: remove
 */
export type ShaderLayout = {
    // Memory binding.
    groups: {
        [groupName: string]: {
            index: number;
            bindings: {
                [bindingName: string]: {
                    index: number,
                    layout: BaseMemoryLayout;
                    visibility: ComputeStage;
                    accessMode: AccessMode;
                };
            };
        };
    };

    // Parameter.
    parameter: {
        [parameterName: string]: PrimitiveBufferFormat;
    };

    // Compute entry points.
    computeEntryPoints: {
        [functionName: string]: {
            workgroupSize: {
                x: number;
                y: number;
                z: number;
            };
        };
    };

    // Vertex entry point.
    vertexEntryPoints: {
        [functionName: string]: {
            parameter: {
                [parameterName: string]: {
                    location: number;
                    primitive: {
                        format: PrimitiveBufferFormat;
                        multiplier: PrimitiveBufferMultiplier;
                    };
                };
            };
        };
    };

    // Fragment entry point.
    fragmentEntryPoints: {
        [functionName: string]: {
            attachments: {
                [attachmentName: string]: {
                    location: number;
                    primitive: {
                        format: PrimitiveBufferFormat;
                        multiplier: PrimitiveBufferMultiplier;
                    };
                };
            };
        };
    };
};