import { Dictionary, Exception } from '@kartoffelgames/core';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { BaseMemoryLayout } from '../../memory_layout/base-memory-layout';
import { PrimitiveBufferMemoryLayout } from '../../memory_layout/buffer/primitive-buffer-memory-layout';

export class ShaderLayout {
    // TODO: Make this a long big shit type.


    private readonly mEntryPointCompute: Dictionary<string, ShaderLayoutComputeEntryPoint>;
    private readonly mEntryPointFragment: Dictionary<string, ShaderLayoutFragmentEntryPoint>;
    private readonly mEntryPointVertex: Dictionary<string, ShaderLayoutVertexEntryPoint>;

    private readonly mGroups: Dictionary<string, ShaderLayoutGroup>;
    private readonly mParameter: Dictionary<string, ShaderLayoutParameter>;

    /**
     * Constructor.
     */
    public constructor() {
        this.mGroups = new Dictionary<string, ShaderLayoutGroup>();
        this.mParameter = new Dictionary<string, ShaderLayoutParameter>();

        // Entry points.
        this.mEntryPointCompute = new Dictionary<string, ShaderLayoutComputeEntryPoint>();
        this.mEntryPointFragment = new Dictionary<string, ShaderLayoutFragmentEntryPoint>();
        this.mEntryPointVertex = new Dictionary<string, ShaderLayoutVertexEntryPoint>();
    }

    /**
     * Add shader memory binding.
     * 
     * @param pGroupName - Name of a setup group.
     * @param pBindingName - Binding name.
     * @param pUsage - Visibility in every shader stage.
     * @param pLayout - Memory layout of binding.
     */
    public addBinding(pGroupName: string, pBindingName: string, pUsage: ComputeStage, pLayout: BaseMemoryLayout): void {
        if (!this.mGroups.has(pGroupName)) {
            throw new Exception(`Group "${pGroupName}" not setup.`, this);
        }

        // Add binding.
        this.mGroups.get(pGroupName)!.bindings.set(pBindingName, {
            name: pBindingName,
            usage: pUsage,
            layout: pLayout
        });
    }

    /**
     * Setup layout group.
     * 
     * @param pIndex - Group index.
     * @param pName - Group name.
     */
    public setupGroup(pIndex: number, pName: string): void {
        this.mGroups.add(pName, {
            index: pIndex,
            name: pName,
            bindings: new Dictionary<string, ShaderLayoutGroupBinding>()
        });
    }



    // TODO: Add entry points.
}

type ShaderLayoutVertexEntryPointParameter = {
    index: number;
    name: string;
    primitive: PrimitiveBufferMemoryLayout;
};

type ShaderLayoutFragmentEntryPointTarget = {
    index: number;
    name: string;
    primitive: PrimitiveBufferMemoryLayout;
};

type ShaderLayoutComputeEntryPoint = {
    name: string;
};

type ShaderLayoutVertexEntryPoint = {
    name: string;
    parameter: Dictionary<string, ShaderLayoutVertexEntryPointParameter>;
};

type ShaderLayoutFragmentEntryPoint = {
    name: string;
    targets: Dictionary<string, ShaderLayoutFragmentEntryPointTarget>;
};

type ShaderLayoutGroupBinding = {
    name: string;
    usage: ComputeStage; // Stages where binding is used.
    layout: BaseMemoryLayout;
};

type ShaderLayoutGroup = {
    index: number;
    name: string,
    bindings: Dictionary<string, ShaderLayoutGroupBinding>;
};

type ShaderLayoutParameter = {
    name: string,
    primitive: PrimitiveBufferMemoryLayout;
};