import type { ComputeStage } from '../../constant/compute-stage.enum.ts';
import { GpuObjectSetup } from '../../gpu_object/gpu-object-setup.ts';
import { BindGroupLayout } from '../../pipeline/bind_group_layout/bind-group-layout.ts';
import type { BindGroupLayoutSetup } from '../../pipeline/bind_group_layout/bind-group-layout-setup.ts';
import { VertexParameterLayout } from '../../pipeline/vertex_parameter/vertex-parameter-layout.ts';
import type { VertexParameterLayoutSetup } from '../../pipeline/vertex_parameter/vertex-parameter-layout-setup.ts';
import type { ShaderModuleEntryPointFragmentRenderTarget } from '../shader.ts';
import { ShaderComputeEntryPointSetup } from './shader-compute-entry-point-setup.ts';
import { type ShaderFragmentEntryPointRenderTargetSetupData, ShaderFragmentEntryPointSetup } from './shader-fragment-entry-point-setup.ts';

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
    public computeEntryPoint(pName: string): ShaderComputeEntryPointSetup {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Create dynamic compute entry point.
        const lEntryPoint: ShaderEntryPointComputeSetupData = {
            name: pName,
            workgroupDimension: null
        };

        // Append compute entry.
        this.setupData.computeEntrypoints.push(lEntryPoint);

        // Return compute entry setup object.
        const lSetup: ShaderComputeEntryPointSetup = new ShaderComputeEntryPointSetup(this.setupReferences, (pX: number, pY: number, pZ: number) => {
            lEntryPoint.workgroupDimension = {
                x: pX,
                y: pY,
                z: pZ
            };
        });

        return lSetup;
    }

    /**
     * Setup fragment entry point.
     * 
     * @param pName - Fragment entry name.
     * @param pSetupCallback - Setup callback to setup fragment render targets.
     */
    public fragmentEntryPoint(pName: string, pSetupCallback: (pSetup: ShaderFragmentEntryPointSetup) => void): void {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Create empty fragment entry point.
        const lEntryPoint: ShaderEntryPointFragmentSetupData = {
            name: pName,
            renderTargets: new Array<ShaderFragmentEntryPointRenderTargetSetupData>()
        };

        // Append compute entry.
        this.setupData.fragmentEntrypoints.push(lEntryPoint);

        // Return fragment entry setup object.
        const lSetup: ShaderFragmentEntryPointSetup = new ShaderFragmentEntryPointSetup(this.setupReferences, (pRenderTarget: ShaderModuleEntryPointFragmentRenderTarget) => {
            lEntryPoint.renderTargets.push(pRenderTarget);
        });

        pSetupCallback(lSetup);
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
    renderTargets: Array<ShaderFragmentEntryPointRenderTargetSetupData>;
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