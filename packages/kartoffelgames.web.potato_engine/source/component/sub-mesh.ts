import { PrimitiveTopology } from '../../../kartoffelgames.web.gpu/source/constant/primitive-topology.enum.ts';

/**
 * Represents a sub-section of a mesh defined by a list of vertex indices and rendering configuration.
 * Each sub mesh defines which vertices of the parent mesh to draw with a specific primitive topology.
 */
export class SubMesh {
    private mIndices: Array<number>;
    private mTopology: PrimitiveTopology;

    /**
     * Vertex index data for this sub mesh.
     * Each value references a vertex in the parent mesh's vertex buffer.
     */
    public get indices(): Array<number> {
        return this.mIndices;
    } set indices(pValue: Array<number>) {
        this.mIndices = pValue;
    }

    /**
     * Primitive topology used for rendering this sub mesh.
     */
    public get topology(): PrimitiveTopology {
        return this.mTopology;
    } set topology(pValue: PrimitiveTopology) {
        this.mTopology = pValue;
    }

    /**
     * Constructor.
     * Creates a sub mesh with an empty index list and triangle list topology.
     *
     * @param pIndices - List of vertex indices for this sub mesh.
     * @param pTopology - Primitive topology used for rendering.
     */
    public constructor(pIndices: Array<number>, pTopology: PrimitiveTopology) {
        this.mIndices = pIndices;
        this.mTopology = pTopology;
    }
}
