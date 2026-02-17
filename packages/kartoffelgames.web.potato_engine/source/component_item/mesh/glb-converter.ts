import { PrimitiveTopology } from '../../../../kartoffelgames.web.gpu/source/constant/primitive-topology.enum.ts';
import { Mesh } from './mesh.ts';

// GLB format constants.
const GLB_MAGIC: number = 0x46546C67;
const GLB_VERSION: number = 2;
const JSON_CHUNK_TYPE: number = 0x4E4F534A;
const BIN_CHUNK_TYPE: number = 0x004E4942;

// glTF component type constants.
const COMPONENT_BYTE: number = 5120;
const COMPONENT_UNSIGNED_BYTE: number = 5121;
const COMPONENT_SHORT: number = 5122;
const COMPONENT_UNSIGNED_SHORT: number = 5123;
const COMPONENT_UNSIGNED_INT: number = 5125;
const COMPONENT_FLOAT: number = 5126;

// glTF accessor type to component count.
const TYPE_COMPONENT_COUNT: Record<string, number> = {
    'SCALAR': 1,
    'VEC2': 2,
    'VEC3': 3,
    'VEC4': 4,
    'MAT2': 4,
    'MAT3': 9,
    'MAT4': 16
};

/**
 * Converter for GLB (glTF Binary) files into engine Mesh objects.
 * Supports glTF 2.0 binary format with standard accessors and buffer views.
 */
export class GlbConverter {
    /**
     * Convert GLB binary data to an array of Mesh objects.
     * Each glTF mesh becomes one engine Mesh. Each glTF primitive within a mesh becomes a SubMesh.
     * When a mesh has multiple primitives, their vertex data is merged and indices are offset accordingly.
     *
     * @param pData - Raw GLB file data as an ArrayBuffer.
     *
     * @returns Array of Mesh objects extracted from the GLB data.
     */
    public static convert(pData: ArrayBuffer): Array<Mesh> {
        const lView: DataView = new DataView(pData);

        // Validate GLB header.
        const lMagic: number = lView.getUint32(0, true);
        if (lMagic !== GLB_MAGIC) {
            throw new Error('Invalid GLB file: wrong magic number.');
        }

        const lVersion: number = lView.getUint32(4, true);
        if (lVersion !== GLB_VERSION) {
            throw new Error(`Unsupported GLB version: ${lVersion}. Only version 2 is supported.`);
        }

        // Parse chunks.
        let lJsonData: GltfJson | null = null;
        let lBinData: ArrayBuffer | null = null;

        let lOffset: number = 12;
        while (lOffset < pData.byteLength) {
            const lChunkLength: number = lView.getUint32(lOffset, true);
            const lChunkType: number = lView.getUint32(lOffset + 4, true);
            const lChunkDataOffset: number = lOffset + 8;

            if (lChunkType === JSON_CHUNK_TYPE) {
                const lJsonBytes: Uint8Array = new Uint8Array(pData, lChunkDataOffset, lChunkLength);
                const lJsonString: string = new TextDecoder().decode(lJsonBytes);
                lJsonData = JSON.parse(lJsonString);
            } else if (lChunkType === BIN_CHUNK_TYPE) {
                lBinData = pData.slice(lChunkDataOffset, lChunkDataOffset + lChunkLength);
            }

            lOffset = lChunkDataOffset + lChunkLength;
        }

        if (!lJsonData) {
            throw new Error('Invalid GLB file: missing JSON chunk.');
        }

        if (!lJsonData.meshes || !lJsonData.accessors || !lJsonData.bufferViews) {
            return [];
        }

        // Convert each glTF mesh to an engine Mesh.
        const lMeshes: Array<Mesh> = new Array<Mesh>();

        for (const lGltfMesh of lJsonData.meshes) {
            const lMesh: Mesh = new Mesh();
            let lVertexOffset: number = 0;

            const lAllPositions: Array<number> = [];
            const lAllNormals: Array<number> = [];
            const lAllColors: Array<number> = [];
            const lAllUv1: Array<number> = [];
            const lAllUv2: Array<number> = [];
            const lAllUv3: Array<number> = [];
            const lAllUv4: Array<number> = [];

            for (const lPrimitive of lGltfMesh.primitives) {
                // Position attribute is required.
                if (lPrimitive.attributes['POSITION'] === undefined) {
                    continue;
                }

                const lPosAccessor: GltfAccessor = lJsonData.accessors![lPrimitive.attributes['POSITION']];
                lAllPositions.push(...GlbConverter.readAccessor(lJsonData, lBinData!, lPosAccessor));

                // Read optional normal data.
                if (lPrimitive.attributes['NORMAL'] !== undefined) {
                    const lNormAccessor: GltfAccessor = lJsonData.accessors![lPrimitive.attributes['NORMAL']];
                    lAllNormals.push(...GlbConverter.readAccessor(lJsonData, lBinData!, lNormAccessor));
                }

                // Read optional vertex colors.
                if (lPrimitive.attributes['COLOR_0'] !== undefined) {
                    const lColorAccessor: GltfAccessor = lJsonData.accessors![lPrimitive.attributes['COLOR_0']];
                    lAllColors.push(...GlbConverter.readAccessor(lJsonData, lBinData!, lColorAccessor));
                }

                // Read optional UV channels.
                if (lPrimitive.attributes['TEXCOORD_0'] !== undefined) {
                    const lUvAccessor: GltfAccessor = lJsonData.accessors![lPrimitive.attributes['TEXCOORD_0']];
                    lAllUv1.push(...GlbConverter.readAccessor(lJsonData, lBinData!, lUvAccessor));
                }
                if (lPrimitive.attributes['TEXCOORD_1'] !== undefined) {
                    const lUvAccessor: GltfAccessor = lJsonData.accessors![lPrimitive.attributes['TEXCOORD_1']];
                    lAllUv2.push(...GlbConverter.readAccessor(lJsonData, lBinData!, lUvAccessor));
                }
                if (lPrimitive.attributes['TEXCOORD_2'] !== undefined) {
                    const lUvAccessor: GltfAccessor = lJsonData.accessors![lPrimitive.attributes['TEXCOORD_2']];
                    lAllUv3.push(...GlbConverter.readAccessor(lJsonData, lBinData!, lUvAccessor));
                }
                if (lPrimitive.attributes['TEXCOORD_3'] !== undefined) {
                    const lUvAccessor: GltfAccessor = lJsonData.accessors![lPrimitive.attributes['TEXCOORD_3']];
                    lAllUv4.push(...GlbConverter.readAccessor(lJsonData, lBinData!, lUvAccessor));
                }

                // Read indices or generate sequential indices.
                let lIndices: Array<number>;
                if (lPrimitive.indices !== undefined) {
                    const lIndexAccessor: GltfAccessor = lJsonData.accessors![lPrimitive.indices];
                    const lRawIndices: Array<number> = GlbConverter.readAccessor(lJsonData, lBinData!, lIndexAccessor);
                    lIndices = lRawIndices.map((pIndex: number) => pIndex + lVertexOffset);
                } else {
                    lIndices = Array.from({ length: lPosAccessor.count }, (_: unknown, pIndex: number) => pIndex + lVertexOffset);
                }

                // Map glTF primitive mode to engine topology.
                const lTopology: PrimitiveTopology = GlbConverter.mapTopology(lPrimitive.mode ?? 4);

                // Add submesh with the primitive's indices and topology.
                lMesh.addSubMesh(lIndices, lTopology);

                // Track vertex count for index offsetting across primitives.
                lVertexOffset += lPosAccessor.count;
            }

            // Set merged vertex data on the mesh.
            lMesh.vertices = lAllPositions;
            if (lAllNormals.length > 0) { lMesh.normals = lAllNormals; }
            if (lAllColors.length > 0) { lMesh.colors = lAllColors; }
            if (lAllUv1.length > 0) { lMesh.uv1 = lAllUv1; }
            if (lAllUv2.length > 0) { lMesh.uv2 = lAllUv2; }
            if (lAllUv3.length > 0) { lMesh.uv3 = lAllUv3; }
            if (lAllUv4.length > 0) { lMesh.uv4 = lAllUv4; }

            lMeshes.push(lMesh);
        }

        return lMeshes;
    }

    /**
     * Read accessor data from the binary buffer as a flat array of numbers.
     *
     * @param pJson - Parsed glTF JSON data.
     * @param pBin - Binary buffer data.
     * @param pAccessor - The accessor to read.
     *
     * @returns Flat array of numeric values from the accessor.
     */
    private static readAccessor(pJson: GltfJson, pBin: ArrayBuffer, pAccessor: GltfAccessor): Array<number> {
        const lBufferView: GltfBufferView = pJson.bufferViews![pAccessor.bufferView];
        const lByteOffset: number = (lBufferView.byteOffset ?? 0) + (pAccessor.byteOffset ?? 0);
        const lComponentCount: number | undefined = TYPE_COMPONENT_COUNT[pAccessor.type];

        if (lComponentCount === undefined) {
            throw new Error(`Unsupported accessor type: ${pAccessor.type}`);
        }

        const lComponentByteSize: number = GlbConverter.componentByteSize(pAccessor.componentType);
        const lElementByteSize: number = lComponentCount * lComponentByteSize;
        const lStride: number = lBufferView.byteStride ?? lElementByteSize;

        const lView: DataView = new DataView(pBin);
        const lResult: Array<number> = new Array<number>(pAccessor.count * lComponentCount);

        for (let lElem: number = 0; lElem < pAccessor.count; lElem++) {
            const lElemOffset: number = lByteOffset + lElem * lStride;
            for (let lComp: number = 0; lComp < lComponentCount; lComp++) {
                const lCompOffset: number = lElemOffset + lComp * lComponentByteSize;
                lResult[lElem * lComponentCount + lComp] = GlbConverter.readComponent(lView, lCompOffset, pAccessor.componentType);
            }
        }

        return lResult;
    }

    /**
     * Read a single component value from a DataView at the given byte offset.
     */
    private static readComponent(pView: DataView, pOffset: number, pComponentType: number): number {
        switch (pComponentType) {
            case COMPONENT_BYTE: return pView.getInt8(pOffset);
            case COMPONENT_UNSIGNED_BYTE: return pView.getUint8(pOffset);
            case COMPONENT_SHORT: return pView.getInt16(pOffset, true);
            case COMPONENT_UNSIGNED_SHORT: return pView.getUint16(pOffset, true);
            case COMPONENT_UNSIGNED_INT: return pView.getUint32(pOffset, true);
            case COMPONENT_FLOAT: return pView.getFloat32(pOffset, true);
            default: throw new Error(`Unsupported glTF component type: ${pComponentType}`);
        }
    }

    /**
     * Get the byte size of a glTF component type.
     */
    private static componentByteSize(pComponentType: number): number {
        switch (pComponentType) {
            case COMPONENT_BYTE:
            case COMPONENT_UNSIGNED_BYTE: return 1;
            case COMPONENT_SHORT:
            case COMPONENT_UNSIGNED_SHORT: return 2;
            case COMPONENT_UNSIGNED_INT:
            case COMPONENT_FLOAT: return 4;
            default: throw new Error(`Unsupported glTF component type: ${pComponentType}`);
        }
    }

    /**
     * Map a glTF primitive mode number to the engine's PrimitiveTopology enum.
     */
    private static mapTopology(pMode: number): PrimitiveTopology {
        switch (pMode) {
            case 0: return PrimitiveTopology.PointList;
            case 1: return PrimitiveTopology.LineList;
            case 3: return PrimitiveTopology.LineStrip;
            case 4: return PrimitiveTopology.TriangleList;
            case 5: return PrimitiveTopology.TriangleStrip;
            default: throw new Error(`Unsupported glTF primitive mode: ${pMode}. LINE_LOOP (2) and TRIANGLE_FAN (6) are not supported.`);
        }
    }
}

/**
 * glTF 2.0 JSON structure types used internally by the converter.
 */
type GltfAccessor = {
    bufferView: number;
    byteOffset?: number;
    componentType: number;
    count: number;
    type: string;
};

type GltfBufferView = {
    buffer: number;
    byteOffset?: number;
    byteLength: number;
    byteStride?: number;
};

type GltfPrimitive = {
    attributes: Record<string, number>;
    indices?: number;
    mode?: number;
};

type GltfMesh = {
    primitives: Array<GltfPrimitive>;
};

type GltfJson = {
    meshes?: Array<GltfMesh>;
    accessors?: Array<GltfAccessor>;
    bufferViews?: Array<GltfBufferView>;
};
