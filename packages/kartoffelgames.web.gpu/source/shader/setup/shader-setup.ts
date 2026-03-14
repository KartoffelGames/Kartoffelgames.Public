import type { RenderTargetsLayout } from '@kartoffelgames/web-gpu';
import type { ComputeStage } from '../../constant/compute-stage.enum.ts';
import { GpuObjectSetup } from '../../gpu_object/gpu-object-setup.ts';
import type { BindGroupLayout } from '../../pipeline/bind_group_layout/bind-group-layout.ts';
import type { VertexParameterLayout } from '../../pipeline/vertex_parameter/vertex-parameter-layout.ts';

/**
 * Setup object to setup all layout and constant informations for shaders.
 */
export class ShaderSetup extends GpuObjectSetup<ShaderSetupReferenceData> {
    /**
     * Setup compute entry point.
     * When size is not called, the compute entry point will be setup with a dynamic size.
     * 
     * @param pName - Compute entry name.
     * @param pSetupCallback - Setup callback to setup compute entry point.
     */
    public computeEntryPoint(pName: string, pX: number, pY: number = 1, pZ: number = 1): void {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Create dynamic compute entry point.
        const lEntryPoint: ShaderEntryPointComputeSetupData = {
            name: pName,
            workgroupDimension: {
                x: pX,
                y: pY,
                z: pZ
            }
        };

        // Append compute entry.
        this.setupData.computeEntrypoints.push(lEntryPoint);
    }

    /**
     * Setup fragment entry point.
     * 
     * @param pName - Fragment entry name.
     * @param pSetupCallback - Setup callback to setup fragment render targets.
     */
    public fragmentEntryPoint(pName: string, pRenderTargetsLayout: RenderTargetsLayout): RenderTargetsLayout {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Create empty fragment entry point.
        const lEntryPoint: ShaderEntryPointFragmentSetupData = {
            name: pName,
            renderTargets: pRenderTargetsLayout
        };

        // Append compute entry.
        this.setupData.fragmentEntrypoints.push(lEntryPoint);

        // Return fragment render targets.
        return pRenderTargetsLayout;
    }

    /**
     * Add group to layout.
     * 
     * @param pIndex - Bind group index.
     * @param pGroup - Group.
     * 
     * @returns the same group.
     */
    public group(pIndex: number, pGroup: BindGroupLayout): BindGroupLayout {
        // Register group.
        this.setupData.bindingGroups.push({
            index: pIndex,
            group: pGroup
        });

        return pGroup;
    }

    /**
     * Add static pipeline parameters definitions.
     * 
     * @param pName- Parameter name.
     * @param pFormat - Parameter format.
     * 
     * @returns this. 
     */
    public parameter(pName: string, ...pStageUsage: Array<ComputeStage>): this {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Add parameter.
        this.setupData.parameter.push({ name: pName, usage: pStageUsage });

        return this;
    }

    /**
     * Setup vertex entry point with an existing vertex parameter layout.
     *
     * @param pName - Vertex entry name.
     * @param pExistingLayout - Existing vertex parameter layout to reuse.
     */
    public vertexEntryPoint(pName: string, pLayout: VertexParameterLayout): VertexParameterLayout {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Create vertex entry point.
        const lEntryPoint: ShaderEntryPointVertexSetupData = {
            name: pName,
            parameter: pLayout
        };

        // Append vertex entry.
        this.setupData.vertexEntrypoints.push(lEntryPoint);

        return pLayout;
    }

    /**
     * Fill in default data before the setup starts.
     *
     * @param pDataReference - Setup data reference.
     */
    protected override fillDefaultData(pDataReference: ShaderSetupReferenceData): void {
        // Entry points.
        pDataReference.computeEntrypoints = new Array<ShaderEntryPointComputeSetupData>();
        pDataReference.fragmentEntrypoints = new Array<ShaderEntryPointFragmentSetupData>();
        pDataReference.vertexEntrypoints = new Array<ShaderEntryPointVertexSetupData>();

        // Parameter.
        pDataReference.parameter = new Array<{
            name: string;
            usage: Array<ComputeStage>;
        }>();

        // Bind groups.
        pDataReference.bindingGroups = new Array<{
            index: number;
            group: BindGroupLayout;
        }>();
    }
}

type ShaderEntryPointComputeSetupData = {
    name: string;
    workgroupDimension: {
        x: number;
        y: number;
        z: number;
    } | null;
};

type ShaderEntryPointVertexSetupData = {
    name: string;
    parameter: VertexParameterLayout;
};

type ShaderEntryPointFragmentSetupData = {
    name: string;
    renderTargets: RenderTargetsLayout;
};

export type ShaderSetupReferenceData = {
    // Entry points.
    computeEntrypoints: Array<ShaderEntryPointComputeSetupData>;
    fragmentEntrypoints: Array<ShaderEntryPointFragmentSetupData>;
    vertexEntrypoints: Array<ShaderEntryPointVertexSetupData>;

    // Parameter.
    parameter: Array<{
        name: string;
        usage: Array<ComputeStage>;
    }>;

    // Bind groups.
    bindingGroups: Array<{
        index: number;
        group: BindGroupLayout;
    }>;
};