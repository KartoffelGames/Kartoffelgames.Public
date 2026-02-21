import { BufferItemFormat } from '../../../../kartoffelgames.web.gpu/source/constant/buffer-item-format.enum.ts';
import type { PrimitiveTopology } from '../../../../kartoffelgames.web.gpu/source/constant/primitive-topology.enum.ts';
import { BoundingBox } from '../bounding-box.ts';
import { GameComponentItem } from '../../core/component/game-component-item.ts';
import { SubMesh } from './sub-mesh.ts';

// TODO: Add bone indices and bone weights per vertex for skeletal animation support.
// TODO: Add LOD (Level of Detail) mesh variants with distance thresholds for automatic LOD switching.

/**
 * Component that stores mesh geometry data including vertices, normals, UVs, colors, indices and sub meshes.
 * Holds only raw data without performing any GPU operations or heavy computations.
 * The mesh always contains at least one sub mesh that covers all indices by default.
 */
export class Mesh extends GameComponentItem {
    private mBounds: BoundingBox;
    private mColors: Array<number>;
    private mNormals: Array<number>;
    private readonly mSubMeshes: Array<SubMesh>;
    private mUv1: Array<number>;
    private mUv2: Array<number>;
    private mUv3: Array<number>;
    private mUv4: Array<number>;
    private mVertices: Array<number>;

    /**
     * Axis-aligned bounding box of the mesh in local space.
     */
    public get bounds(): BoundingBox {
        return this.mBounds;
    } set bounds(pValue: BoundingBox) {
        this.mBounds = pValue;

        // Signal parent component of the change.
        this.update();
    }

    /**
     * Vertex color data as a flat array of RGBA values.
     * Every four consecutive values represent one vertex color (r, g, b, a).
     */
    public get colors(): Array<number> {
        return this.mColors;
    } set colors(pValue: Array<number>) {
        this.mColors = pValue;

        // Signal parent component of the change.
        this.update();
    }

    /**
     * Index buffer format determined by the vertex count.
     * Uses 16-bit unsigned integers when the vertex count fits within 65535, otherwise 32-bit.
     */
    public get indexFormat(): BufferItemFormat {
        if (this.mVertices.length <= 65535) {
            return BufferItemFormat.Uint16;
        }

        return BufferItemFormat.Uint32;
    }

    /**
     * Vertex normal data as a flat array of XYZ values.
     * Every three consecutive values represent one normal vector (x, y, z).
     */
    public get normals(): Array<number> {
        return this.mNormals;
    } set normals(pValue: Array<number>) {
        this.mNormals = pValue;

        // Signal parent component of the change.
        this.update();
    }

    /**
     * List of sub meshes defining index ranges and their rendering configuration.
     * Always contains at least one sub mesh.
     */
    public get subMeshes(): Array<SubMesh> {
        return this.mSubMeshes;
    }

    /**
     * Primary UV channel as a flat array of UV values.
     * Every two consecutive values represent one texture coordinate (u, v).
     */
    public get uv1(): Array<number> {
        return this.mUv1;
    } set uv1(pValue: Array<number>) {
        this.mUv1 = pValue;

        // Signal parent component of the change.
        this.update();
    }

    /**
     * Secondary UV channel as a flat array of UV values.
     * Every two consecutive values represent one texture coordinate (u, v).
     */
    public get uv2(): Array<number> {
        return this.mUv2;
    } set uv2(pValue: Array<number>) {
        this.mUv2 = pValue;

        // Signal parent component of the change.
        this.update();
    }

    /**
     * Third UV channel as a flat array of UV values.
     * Every two consecutive values represent one texture coordinate (u, v).
     */
    public get uv3(): Array<number> {
        return this.mUv3;
    } set uv3(pValue: Array<number>) {
        this.mUv3 = pValue;

        // Signal parent component of the change.
        this.update();
    }

    /**
     * Fourth UV channel as a flat array of UV values.
     * Every two consecutive values represent one texture coordinate (u, v).
     */
    public get uv4(): Array<number> {
        return this.mUv4;
    } set uv4(pValue: Array<number>) {
        this.mUv4 = pValue;

        // Signal parent component of the change.
        this.update();
    }

    /**
     * Vertex position data as a flat array of XYZ values.
     * Every three consecutive values represent one vertex position (x, y, z).
     */
    public get verticesData(): Array<number> {
        return this.mVertices;
    } set verticesData(pValue: Array<number>) {
        this.mVertices = pValue;

        // Signal parent component of the change.
        this.update();
    }

    /**
     * Number of vertices in the mesh.
     * Calculated from the vertex position data assuming three components per vertex (x, y, z).
     */
    public get verticlesCount(): number {
        return this.mVertices.length / 3;
    }

    /**
     * Constructor.
     * Initializes an empty mesh with a single default sub mesh.
     */
    public constructor() {
        super('Mesh');

        // Initialize empty vertex data arrays.
        this.mVertices = new Array<number>();
        this.mNormals = new Array<number>();
        this.mColors = new Array<number>();

        // Initialize empty UV channels.
        this.mUv1 = new Array<number>();
        this.mUv2 = new Array<number>();
        this.mUv3 = new Array<number>();
        this.mUv4 = new Array<number>();

        // Initialize default bounding box.
        this.mBounds = new BoundingBox();

        // Initialize with one default sub mesh.
        this.mSubMeshes = new Array<SubMesh>();
    }

    /**
     * Add a new sub mesh to the mesh.
     *
     * @param pIndices - List of vertex indices for the sub mesh.
     * @param pTopology - Primitive topology for rendering.
     *
     * @returns The newly created sub mesh.
     */
    public addSubMesh(pIndices: Array<number>, pTopology: PrimitiveTopology): SubMesh {
        // Create new sub mesh with specified indices and topology.
        const lSubMesh: SubMesh = new SubMesh();
        lSubMesh.indices = pIndices;
        lSubMesh.topology = pTopology;

        // Add new sub mesh to the list.
        this.mSubMeshes.push(lSubMesh);

        // Signal parent component of the change.
        this.update();

        return lSubMesh;
    }

    /**
     * Remove a sub mesh from the mesh by index.
     * The last sub mesh cannot be removed to ensure at least one sub mesh always exists.
     *
     * @param pIndex - Index of the sub mesh to remove.
     *
     * @throws {Error} When trying to remove the last remaining sub mesh.
     */
    public removeSubMesh(pIndex: number): void {
        // Prevent removing the last sub mesh.
        if (this.mSubMeshes.length <= 1) {
            throw new Error('Cannot remove the last sub mesh. A mesh must always contain at least one sub mesh.');
        }

        // Remove sub mesh at specified index.
        this.mSubMeshes.splice(pIndex, 1);

        // Signal parent component of the change.
        this.update();
    }
}