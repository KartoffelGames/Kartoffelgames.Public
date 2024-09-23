import { AccessMode } from '../../../constant/access-mode.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { GpuObjectSetup } from '../../gpu/object/gpu-object-setup';
import { BaseMemoryLayout } from '../../memory_layout/base-memory-layout';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { ShaderModuleEntryPointFragmentRenderTarget } from '../shader';
import { ShaderComputeEntryPointSetup } from './shader-compute-entry-point-setup';
import { ShaderFragmentEntryPointRenderTargetSetupData, ShaderFragmentEntryPointSetup } from './shader-fragment-entry-point-setup';
import { ShaderVertexEntryPointSetup, VertexEntryPointParameterSetupData } from './shader-vertex-entry-point-setup';

export class ShaderSetup extends GpuObjectSetup<ShaderSetupReferenceData> {
    /**
     * Add static pipeline parameters definitions.
     * 
     * @param pName- Parameter name.
     * @param pFormat - Parameter format.
     * 
     * @returns this. 
     */
    public addParameter(pName: string, pFormat: PrimitiveBufferFormat): this {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Add parameter.
        this.setupData.parameter.push({ name: pName, format: pFormat });

        return this;
    }

    /**
     * Setup compute entry point.
     * When size is not called, the compute entry point will be setup with a dynamic size.
     * 
     * @param pName - Compute entry name.
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
        return new ShaderComputeEntryPointSetup(this.setupReferences, (pX: number, pY: number, pZ: number) => {
            lEntryPoint.workgroupDimension = {
                x: pX,
                y: pY,
                z: pZ
            };
        });
    }

    /**
     * Setup fragment entry point.
     * 
     * @param pName - Fragment entry name.
     */
    public fragmentEntryPoint(pName: string): ShaderFragmentEntryPointSetup {
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
        return new ShaderFragmentEntryPointSetup(this.setupReferences, (pRenderTarget: ShaderModuleEntryPointFragmentRenderTarget) => {
            lEntryPoint.renderTargets.push(pRenderTarget);
        });
    }

    /**
     * Setup vertex entry point.
     * 
     * @param pName - Vertex entry name.
     */
    public vertexEntryPoint(pName: string): ShaderVertexEntryPointSetup {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Create empty fragment entry point.
        const lEntryPoint: ShaderEntryPointVertexSetupData = {
            name: pName,
            parameter: new Array<VertexEntryPointParameterSetupData>()
        };

        // Append compute entry.
        this.setupData.vertexEntrypoints.push(lEntryPoint);

        // Return fragment entry setup object.
        return new ShaderVertexEntryPointSetup(this.setupReferences, (pRenderTarget: VertexEntryPointParameterSetupData) => {
            lEntryPoint.parameter.push(pRenderTarget);
        });
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
        pDataReference.parameter = new Array<{ name: string; format: PrimitiveBufferFormat; }>();

        // Bind groups.
        pDataReference.bindingGroups = new Array<ShaderBindGroupSetupData>();
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
    parameter: Array<VertexEntryPointParameterSetupData>;
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
        name: string; format:
        PrimitiveBufferFormat;
    }>;

    // Bind groups.
    bindingGroups: Array<ShaderBindGroupSetupData>;
};


type ShaderBindingSetupData = {
    index: number,
    name: string;
    layout: BaseMemoryLayout;
    visibility: ComputeStage;
    accessMode: AccessMode;
};

type ShaderBindGroupSetupData = {
    index: number;
    name: string;
    bindings: Array<ShaderBindingSetupData>;
};