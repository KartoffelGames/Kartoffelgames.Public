import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core.data';
import { BindGroup } from '../../bind_group/bind-group';
import { RenderPipeline } from '../../pipeline/render-pipeline';
import { BaseBuffer } from '../../resource/buffer/base-buffer';
import { RenderMesh } from '../data/render-mesh';
import { IInstruction } from './i-instruction.interface';

export class RenderSingleInstruction implements IInstruction {
    private readonly mBindGroups: Dictionary<number, BindGroup>;
    private mMesh: RenderMesh | null;
    private mPipeline: RenderPipeline | null;

    // TODO: Set  GPURenderPassEncoder.setScissorRect

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
        if (!this.mMesh) {
            throw new Exception('Mesh not set.', this);
        }

        return this.mMesh;
    }

    /**
     * Instructions render pipeline.
     */
    public get pipeline(): RenderPipeline {
        if (!this.mPipeline) {
            throw new Exception('Pipeline not set.', this);
        }

        return this.mPipeline;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mBindGroups = new Dictionary<number, BindGroup>();
        this.mMesh = null;
        this.mPipeline = null;
    }

    /**
     * Set bind group of pipeline.
     * @param pBindGroup - Bind group.
     */
    public async setBindGroup(pIndex: number, pBindGroup: BindGroup): Promise<void> {
        // Validate pipeline existance.
        if (!this.mPipeline) {
            throw new Exception(`Can't set bind group without set pipeline.`, this);
        }

        // Validate bind group layout.
        if (this.mPipeline.shader.bindGroups.getGroup(pIndex) !== pBindGroup.layout) {
            throw new Exception(`Bind data layout not matched with pipeline bind group layout.`, this);
        }

        this.mBindGroups.set(pIndex, pBindGroup);
    }

    /**
     * Set mesh to render.
     * @param pMesh - Mesh to render.
     */
    public async setMesh(pMesh: RenderMesh): Promise<void> {
        // Validate pipeline existance.
        if (!this.mPipeline) {
            throw new Exception(`Can't set mesh without set pipeline.`, this);
        }

        // Validate mesh and pipeline attributes length.
        if (pMesh.attributesCount !== this.mPipeline.shader.vertexEntryPoint?.attributes.length) {
            throw new Exception(`Mesh attributes (length:${pMesh.attributesCount}) does not match pipeline attributes (length${this.mPipeline.shader.vertexEntryPoint?.attributes.length})`, this);
        }

        // Validate mesh and pipeline attributes content.
        for (const lAttribute of this.mPipeline.shader.vertexEntryPoint!.attributes) {
            const lMeshAttributeBuffer: BaseBuffer<TypedArray> = pMesh.getVertexBuffer(lAttribute.name);

            if (lMeshAttributeBuffer.type !== lAttribute.bufferDataType) {
                throw new Exception(`Mesh attributes does not match pipeline attributes`, this);
            }
        }

        this.mMesh = pMesh;
    }

    /**
     * Set render pipeline. Clears group binds.
     * @param pPipeline - Render pipeline.
     */
    public async setPipeline(pPipeline: RenderPipeline): Promise<void> {
        this.mPipeline = pPipeline;

        // Clear binds.
        this.mBindGroups.clear();
    }
} 