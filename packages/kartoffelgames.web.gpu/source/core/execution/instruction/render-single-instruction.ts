import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core.data';
import { BindGroup } from '../../bind_group/bind-group';
import { RenderPipeline } from '../../pipeline/render-pipeline';
import { BaseBuffer } from '../../resource/buffer/base-buffer';
import { RenderMesh } from '../data/render-mesh';
import { IInstruction } from './i-instruction.interface';

export class RenderSingleInstruction implements IInstruction {
    private readonly mBindGroups: Dictionary<number, BindGroup>;
    private readonly mMesh: RenderMesh;
    private readonly mPipeline: RenderPipeline;

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
     * Instruction mesh.
     */
    public get mesh(): RenderMesh {
        return this.mMesh;
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
    public constructor(pPipeline: RenderPipeline, pMesh: RenderMesh) {
        this.mBindGroups = new Dictionary<number, BindGroup>();
        this.mMesh = pMesh;
        this.mPipeline = pPipeline;

        // Validate mesh and pipeline attributes length.
        if (pMesh.attributesCount !== this.mPipeline.shader.vertexEntryPoint?.attributes.length) {
            throw new Exception(`Mesh attributes (length:${pMesh.attributesCount}) does not match pipeline attributes (length${this.mPipeline.shader.vertexEntryPoint?.attributes.length})`, this);
        }

        // Validate mesh and pipeline attributes content.
        for (const lAttribute of this.mPipeline.shader.vertexEntryPoint!.attributes) {
            const lMeshAttributeBuffer: BaseBuffer<TypedArray> = pMesh.getBuffer(lAttribute.name);

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