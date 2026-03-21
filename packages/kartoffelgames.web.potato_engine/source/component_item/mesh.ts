import { FileSystem } from '@kartoffelgames/web-file-system';
import { BufferItemFormat } from '../../../kartoffelgames.web.gpu/source/constant/buffer-item-format.enum.ts';
import { PrimitiveTopology } from '../../../kartoffelgames.web.gpu/source/constant/primitive-topology.enum.ts';
import { GameComponentItem } from '../core/component/game-component-item.ts';
import { BoundingBox } from './bounding-box.ts';
import { SubMesh } from './sub-mesh.ts';

// TODO: Add bone indices and bone weights per vertex for skeletal animation support.
// TODO: Add LOD (Level of Detail) mesh variants with distance thresholds for automatic LOD switching.

/**
 * Component that stores mesh geometry data including vertices, normals, UVs, colors, indices and sub meshes.
 * Holds only raw data without performing any GPU operations or heavy computations.
 * The mesh always contains at least one sub mesh that covers all indices by default.
 */
export class Mesh extends GameComponentItem {
    /**
     * System instance with default values (default PBR shader + empty bindings).
     * This instance is immutable and cannot be modified.
     */
    public static readonly SYSTEM_INSTANCE: Mesh = (() => {
        const lInstance: Mesh = new Mesh();

        // Initialize as a unit box from -0.5 to 0.5 in all axes.
        // Vertices (x, y, z) for 8 corners of the box.
        lInstance.verticesData = [
            // Front face
            -0.5, -0.5,  0.5, // 0: left-bottom-front
             0.5, -0.5,  0.5, // 1: right-bottom-front
             0.5,  0.5,  0.5, // 2: right-top-front
            -0.5,  0.5,  0.5, // 3: left-top-front
            // Back face
            -0.5, -0.5, -0.5, // 4: left-bottom-back
             0.5, -0.5, -0.5, // 5: right-bottom-back
             0.5,  0.5, -0.5, // 6: right-top-back
            -0.5,  0.5, -0.5  // 7: left-top-back
        ];

        // Normals (x, y, z) for each vertex (approximate per face).
        lInstance.normals = [
            // Front face
            0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
            // Back face
            0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1
        ];

        // Colors (r, g, b, a) for each vertex (white, opaque).
        lInstance.colors = [
            1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,
            1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1
        ];

        // UVs (u, v) for each vertex (simple mapping).
        lInstance.uv1 = [
            0, 0,  1, 0,  1, 1,  0, 1,
            0, 0,  1, 0,  1, 1,  0, 1
        ];
        lInstance.uv2 = new Array<number>(16).fill(0);
        lInstance.uv3 = new Array<number>(16).fill(0);
        lInstance.uv4 = new Array<number>(16).fill(0);

        // Indices for 12 triangles (two per face).
        const lIndices: Array<number> = [
            // Front face
            0, 1, 2,  0, 2, 3,
            // Right face
            1, 5, 6,  1, 6, 2,
            // Back face
            5, 4, 7,  5, 7, 6,
            // Left face
            4, 0, 3,  4, 3, 7,
            // Top face
            3, 2, 6,  3, 6, 7,
            // Bottom face
            4, 5, 1,  4, 1, 0
        ];

        // Add a single sub mesh covering all indices (assuming triangle list topology).
        lInstance.addSubMesh(lIndices, PrimitiveTopology.TriangleList);

        // Set bounding box.
        lInstance.bounds = new BoundingBox();
        lInstance.bounds.maxX = 0.5;
        lInstance.bounds.maxY = 0.5;
        lInstance.bounds.maxZ = 0.5;
        lInstance.bounds.minX = -0.5;
        lInstance.bounds.minY = -0.5;
        lInstance.bounds.minZ = -0.5;

        lInstance.markAsSystem();
        return lInstance;
    })();

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
    @FileSystem.fileProperty()
    public get bounds(): BoundingBox {
        return this.mBounds;
    } set bounds(pValue: BoundingBox) {
        this.mBounds = pValue;

        // Signal parent component of the change.
        this.update('Mesh_bounds');
    }

    /**
     * Vertex color data as a flat array of RGBA values.
     * Every four consecutive values represent one vertex color (r, g, b, a).
     */
    @FileSystem.fileProperty()
    public get colors(): Array<number> {
        return this.mColors;
    } set colors(pValue: Array<number>) {
        this.mColors = pValue;

        // Signal parent component of the change.
        this.update('Mesh_colors');
    }

    /**
     * Index buffer format determined by the vertex count.
     * Uses 16-bit unsigned integers when the vertex count fits within 65535, otherwise 32-bit.
     */
    @FileSystem.fileProperty()
    public get indexFormat(): BufferItemFormat {
        if (this.verticesCount <= 65535) {
            return BufferItemFormat.Uint16;
        }

        return BufferItemFormat.Uint32;
    }

    /**
     * Vertex normal data as a flat array of XYZ values.
     * Every three consecutive values represent one normal vector (x, y, z).
     */
    @FileSystem.fileProperty()
    public get normals(): Array<number> {
        return this.mNormals;
    } set normals(pValue: Array<number>) {
        this.mNormals = pValue;

        // Signal parent component of the change.
        this.update('Mesh_normals');
    }

    /**
     * List of sub meshes defining index ranges and their rendering configuration.
     * Always contains at least one sub mesh.
     */
    @FileSystem.fileProperty()
    public get subMeshes(): Array<SubMesh> {
        return this.mSubMeshes;
    }

    /**
     * Primary UV channel as a flat array of UV values.
     * Every two consecutive values represent one texture coordinate (u, v).
     */
    @FileSystem.fileProperty()
    public get uv1(): Array<number> {
        return this.mUv1;
    } set uv1(pValue: Array<number>) {
        this.mUv1 = pValue;

        // Signal parent component of the change.
        this.update('Mesh_uv1');
    }

    /**
     * Secondary UV channel as a flat array of UV values.
     * Every two consecutive values represent one texture coordinate (u, v).
     */
    @FileSystem.fileProperty()
    public get uv2(): Array<number> {
        return this.mUv2;
    } set uv2(pValue: Array<number>) {
        this.mUv2 = pValue;

        // Signal parent component of the change.
        this.update('Mesh_uv2');
    }

    /**
     * Third UV channel as a flat array of UV values.
     * Every two consecutive values represent one texture coordinate (u, v).
     */
    @FileSystem.fileProperty()
    public get uv3(): Array<number> {
        return this.mUv3;
    } set uv3(pValue: Array<number>) {
        this.mUv3 = pValue;

        // Signal parent component of the change.
        this.update('Mesh_uv3');
    }

    /**
     * Fourth UV channel as a flat array of UV values.
     * Every two consecutive values represent one texture coordinate (u, v).
     */
    @FileSystem.fileProperty()
    public get uv4(): Array<number> {
        return this.mUv4;
    } set uv4(pValue: Array<number>) {
        this.mUv4 = pValue;

        // Signal parent component of the change.
        this.update('Mesh_uv4');
    }

    /**
     * Number of vertices in the mesh.
     * Calculated from the vertex position data assuming three components per vertex (x, y, z).
     */
    public get verticesCount(): number {
        return this.mVertices.length / 3;
    }

    /**
     * Vertex position data as a flat array of XYZ values.
     * Every three consecutive values represent one vertex position (x, y, z).
     */
    @FileSystem.fileProperty()
    public get verticesData(): Array<number> {
        return this.mVertices;
    } set verticesData(pValue: Array<number>) {
        this.mVertices = pValue;

        // Signal parent component of the change.
        this.update('Mesh_verticesData');
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
        this.update('Mesh_addSubMesh');

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
        this.update('Mesh_removeSubMesh');
    }
}