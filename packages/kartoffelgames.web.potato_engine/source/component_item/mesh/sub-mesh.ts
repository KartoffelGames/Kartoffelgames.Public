import { Serializer } from "@kartoffelgames/core-serializer";
import { PrimitiveTopology } from '../../../../kartoffelgames.web.gpu/source/constant/primitive-topology.enum.ts';
import { GameComponentItem } from "../../core/component/game-component-item.ts";

/**
 * Represents a sub-section of a mesh defined by a list of vertex indices and rendering configuration.
 * Each sub mesh defines which vertices of the parent mesh to draw with a specific primitive topology.
 */
@Serializer.class('1ca90e2d-721c-480d-855b-82a599c47e18')
export class SubMesh extends GameComponentItem {
    private mIndices: Array<number>;
    private mTopology: PrimitiveTopology;

    /**
     * Vertex index data for this sub mesh.
     * Each value references a vertex in the parent mesh's vertex buffer.
     */
    @Serializer.property()
    public get indices(): Array<number> {
        return this.mIndices;
    } set indices(pValue: Array<number>) {
        this.mIndices = pValue;

        // Send update event to parent.
        this.update();
    }

    /**
     * Primitive topology used for rendering this sub mesh.
     */
    @Serializer.property()
    public get topology(): PrimitiveTopology {
        return this.mTopology;
    } set topology(pValue: PrimitiveTopology) {
        this.mTopology = pValue;

        // Send update event to parent.
        this.update();
    }

    /**
     * Constructor.
     * Creates a sub mesh with an empty index list and triangle list topology.
     */
    public constructor() {
        super('Sub mesh');

        this.mIndices = new Array<number>();
        this.mTopology = PrimitiveTopology.TriangleList;
    }
}
