import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core.data';
import { BindGroup } from '../../bind_group/bind-group';
import { RenderPipeline } from '../../pipeline/render-pipeline';
import { BaseBuffer } from '../../buffer/base-buffer';
import { RenderParameter } from '../parameter/render-parameter';
import { IInstruction } from './i-instruction.interface';

export class RenderInstruction implements IInstruction {
    private readonly mBindGroups: Dictionary<number, BindGroup>;
    private readonly mInstanceCount: number;
    private readonly mPipeline: RenderPipeline;
    private readonly mRenderParameter: RenderParameter;
    
    /**
     * Get bind groups.
     */
    public get bindGroups(): Array<BindGroup> {
        const lBindGroupList: Array<BindGroup> = new Array<BindGroup>();
        for (const [lIndex, lBindGroup] of this.mBindGroups) {
            lBindGroupList[lIndex] = lBindGroup;
        }

        return lBindGroupList;
    }

    /**
     * Instance count.
     */
    public get instanceCount(): number {
        return this.mInstanceCount;
    }

    /**
     * Instruction parameter.
     */
    public get parameter(): RenderParameter {
        return this.mRenderParameter;
    }

    /**
     * Instructions render pipeline.
     */
    public get pipeline(): RenderPipeline {
        return this.mPipeline;
    }

    /**
     * Constructor.
     */
    public constructor(pPipeline: RenderPipeline, pRenderParameter: RenderParameter, pInstanceCount: number = 1) {
        this.mBindGroups = new Dictionary<number, BindGroup>();
        this.mRenderParameter = pRenderParameter;
        this.mPipeline = pPipeline;
        this.mInstanceCount = pInstanceCount;

        // Validate mesh and pipeline attributes length.
        if (pRenderParameter.attributesCount !== this.mPipeline.shader.vertexEntryPoint?.attributes.length) {
            throw new Exception(`Mesh attributes (length:${pRenderParameter.attributesCount}) does not match pipeline attributes (length: ${this.mPipeline.shader.vertexEntryPoint?.attributes.length})`, this);
        }

        // Validate mesh and pipeline attributes content.
        for (const lAttribute of this.mPipeline.shader.vertexEntryPoint!.attributes) {
            const lMeshAttributeBuffer: BaseBuffer<TypedArray> = pRenderParameter.getBuffer(lAttribute.name);

            if (lMeshAttributeBuffer.type !== lAttribute.bufferDataType) {
                throw new Exception(`Mesh attributes does not match pipeline attributes`, this);
            }
        }
    }

    /**
     * Set bind group of pipeline.
     * @param pBindGroup - Bind group.
     */
    public setBindGroup(pIndex: number, pBindGroup: BindGroup): void {
        // Validate bind group layout.
        if (!this.mPipeline.shader.bindGroups.getGroup(pIndex).equal(pBindGroup.layout)) {
            throw new Exception(`Bind data layout not matched with pipeline bind group layout.`, this);
        }

        this.mBindGroups.set(pIndex, pBindGroup);
    }
} 