import { PrimitiveTopology } from '../../../kartoffelgames.web.gpu/source/constant/primitive-topology.enum.ts';
import { MeshRenderComponent } from '../../source/component/mesh-render-component.ts';
import { TransformationComponent } from '../../source/component/transformation-component.ts';
import { Material } from '../../source/component_item/material.ts';
import { Mesh } from '../../source/component_item/mesh.ts';
import { Shader } from '../../source/component_item/shader.ts';
import { Texture } from '../../source/component_item/texture.ts';
import { GameObject } from '../../source/core/hierarchy/game-object.ts';
import defaultPbrShader from '../../source/shader/default-pbr-shader.pgsl';

// GLB format constants.
const gGlbMagic: number = 0x46546C67;
const gGlbVersion: number = 2;
const gJsonChunkType: number = 0x4E4F534A;
const gBinChunkType: number = 0x004E4942;

// glTF component type constants.
const gComponentByte: number = 5120;
const gComponentUnsignedByte: number = 5121;
const gComponentShort: number = 5122;
const gComponentUnsignedShort: number = 5123;
const gComponentUnsignedInt: number = 5125;
const gComponentFloat: number = 5126;

// glTF accessor type to component count.
const gTypeComponentCount: Record<string, number> = {
    'SCALAR': 1,
    'VEC2': 2,
    'VEC3': 3,
    'VEC4': 4,
    'MAT2': 4,
    'MAT3': 9,
    'MAT4': 16
};

/**
 * Result of converting a GLB file. Contains meshes and their per-submesh materials.
 */
export type GlbConvertResult = {
    meshes: Array<Mesh>;
    materials: Array<Array<Material>>;
};

/**
 * Converter for GLB (glTF Binary) files into engine Mesh and Material objects.
 * Supports glTF 2.0 binary format with standard accessors, buffer views, materials, textures, and images.
 */
export class GlbConverter {
    /**
     * Convert GLB binary data to meshes and materials.
     * Each glTF mesh becomes one engine Mesh. Each glTF primitive within a mesh becomes a SubMesh.
     * When a mesh has multiple primitives, their vertex data is merged and indices are offset accordingly.
     * Materials are parsed from glTF material definitions including PBR properties and textures.
     *
     * @param pData - Raw GLB file data as an ArrayBuffer.
     *
     * @returns Object containing meshes and per-submesh materials arrays.
     */
    public static convert(pData: ArrayBuffer): GlbConvertResult {
        const lParsed: ParsedGlb = GlbConverter.parseGlb(pData);

        if (!lParsed.json.meshes || !lParsed.json.accessors || !lParsed.json.bufferViews) {
            return { meshes: [], materials: [] };
        }

        // Parse engine textures from glTF images.
        const lTextures: Array<Texture> = GlbConverter.parseTextures(lParsed.json, lParsed.bin);

        // Parse engine materials from glTF materials.
        const lGltfMaterials: Array<Material> = GlbConverter.parseMaterials(lParsed.json, lTextures);

        // Convert each glTF mesh to an engine Mesh with per-submesh material list.
        const lMeshes: Array<Mesh> = new Array<Mesh>();
        const lAllMaterials: Array<Array<Material>> = new Array<Array<Material>>();

        for (const lGltfMesh of lParsed.json.meshes) {
            const lMesh: Mesh = new Mesh();
            let lVertexOffset: number = 0;
            const lSubmeshMaterials: Array<Material> = new Array<Material>();

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

                const lPosAccessor: GltfAccessor = lParsed.json.accessors![lPrimitive.attributes['POSITION']];
                lAllPositions.push(...GlbConverter.readAccessor(lParsed.json, lParsed.bin!, lPosAccessor));

                // Read optional normal data.
                if (lPrimitive.attributes['NORMAL'] !== undefined) {
                    const lNormAccessor: GltfAccessor = lParsed.json.accessors![lPrimitive.attributes['NORMAL']];
                    lAllNormals.push(...GlbConverter.readAccessor(lParsed.json, lParsed.bin!, lNormAccessor));
                }

                // Read optional vertex colors.
                if (lPrimitive.attributes['COLOR_0'] !== undefined) {
                    const lColorAccessor: GltfAccessor = lParsed.json.accessors![lPrimitive.attributes['COLOR_0']];
                    lAllColors.push(...GlbConverter.readAccessor(lParsed.json, lParsed.bin!, lColorAccessor));
                }

                // Read optional UV channels.
                if (lPrimitive.attributes['TEXCOORD_0'] !== undefined) {
                    const lUvAccessor: GltfAccessor = lParsed.json.accessors![lPrimitive.attributes['TEXCOORD_0']];
                    lAllUv1.push(...GlbConverter.readAccessor(lParsed.json, lParsed.bin!, lUvAccessor));
                }
                if (lPrimitive.attributes['TEXCOORD_1'] !== undefined) {
                    const lUvAccessor: GltfAccessor = lParsed.json.accessors![lPrimitive.attributes['TEXCOORD_1']];
                    lAllUv2.push(...GlbConverter.readAccessor(lParsed.json, lParsed.bin!, lUvAccessor));
                }
                if (lPrimitive.attributes['TEXCOORD_2'] !== undefined) {
                    const lUvAccessor: GltfAccessor = lParsed.json.accessors![lPrimitive.attributes['TEXCOORD_2']];
                    lAllUv3.push(...GlbConverter.readAccessor(lParsed.json, lParsed.bin!, lUvAccessor));
                }
                if (lPrimitive.attributes['TEXCOORD_3'] !== undefined) {
                    const lUvAccessor: GltfAccessor = lParsed.json.accessors![lPrimitive.attributes['TEXCOORD_3']];
                    lAllUv4.push(...GlbConverter.readAccessor(lParsed.json, lParsed.bin!, lUvAccessor));
                }

                // Read indices or generate sequential indices.
                let lIndices: Array<number>;
                if (lPrimitive.indices !== undefined) {
                    const lIndexAccessor: GltfAccessor = lParsed.json.accessors![lPrimitive.indices];
                    const lRawIndices: Array<number> = GlbConverter.readAccessor(lParsed.json, lParsed.bin!, lIndexAccessor);
                    lIndices = lRawIndices.map((pIndex: number) => pIndex + lVertexOffset);
                } else {
                    lIndices = Array.from({ length: lPosAccessor.count }, (_pUnused: unknown, pIndex: number) => pIndex + lVertexOffset);
                }

                // Map glTF primitive mode to engine topology.
                const lTopology: PrimitiveTopology = GlbConverter.mapTopology(lPrimitive.mode ?? 4);

                // Add submesh with the primitive's indices and topology.
                lMesh.addSubMesh(lIndices, lTopology);

                // Resolve material for this submesh.
                if (lPrimitive.material !== undefined && lPrimitive.material < lGltfMaterials.length) {
                    lSubmeshMaterials.push(lGltfMaterials[lPrimitive.material]);
                } else {
                    lSubmeshMaterials.push(Material.SYSTEM_INSTANCE);
                }

                // Track vertex count for index offsetting across primitives.
                lVertexOffset += lPosAccessor.count;
            }

            // Set merged vertex data on the mesh.
            lMesh.verticesData = lAllPositions;
            if (lAllNormals.length > 0) { lMesh.normals = lAllNormals; }
            if (lAllColors.length > 0) { lMesh.colors = lAllColors; }
            if (lAllUv1.length > 0) { lMesh.uv1 = lAllUv1; }
            if (lAllUv2.length > 0) { lMesh.uv2 = lAllUv2; }
            if (lAllUv3.length > 0) { lMesh.uv3 = lAllUv3; }
            if (lAllUv4.length > 0) { lMesh.uv4 = lAllUv4; }

            // Calculate AABB from vertex positions.
            GlbConverter.calculateBounds(lMesh, lAllPositions);

            lMeshes.push(lMesh);
            lAllMaterials.push(lSubmeshMaterials);
        }

        return { meshes: lMeshes, materials: lAllMaterials };
    }

    /**
     * Convert GLB binary data to an array of GameEntity objects.
     * Each glTF mesh becomes a GameEntity with TransformationComponent and MeshRenderComponent.
     * The MeshRenderComponent is configured with the mesh and its per-submesh materials.
     *
     * @param pData - Raw GLB file data as an ArrayBuffer.
     *
     * @returns Array of GameEntity objects, one per mesh in the GLB file.
     */
    public static convertToEntities(pData: ArrayBuffer): Array<GameObject> {
        const lResult: GlbConvertResult = GlbConverter.convert(pData);
        const lEntities: Array<GameObject> = new Array<GameObject>();

        for (let lIndex: number = 0; lIndex < lResult.meshes.length; lIndex++) {
            const lEntity: GameObject = new GameObject();
            lEntity.label = `GLB Mesh ${lIndex}`;
            lEntity.addComponent(TransformationComponent);

            const lMeshRenderer: MeshRenderComponent = lEntity.addComponent(MeshRenderComponent);
            lMeshRenderer.mesh = lResult.meshes[lIndex];
            lMeshRenderer.materials = lResult.materials[lIndex];

            lEntities.push(lEntity);
        }

        return lEntities;
    }

    /**
     * Calculate and set the axis-aligned bounding box from vertex positions.
     *
     * @param pMesh - The mesh to set bounds on.
     * @param pPositions - Flat array of vertex positions (x, y, z).
     */
    private static calculateBounds(pMesh: Mesh, pPositions: Array<number>): void {
        let lMinX: number = 0;
        let lMinY: number = 0;
        let lMinZ: number = 0;
        let lMaxX: number = 0;
        let lMaxY: number = 0;
        let lMaxZ: number = 0;

        for (let lIndex: number = 0; lIndex < pPositions.length; lIndex += 3) {
            const lX: number = pPositions[lIndex];
            const lY: number = pPositions[lIndex + 1];
            const lZ: number = pPositions[lIndex + 2];

            lMinX = Math.min(lMinX, lX);
            lMinY = Math.min(lMinY, lY);
            lMinZ = Math.min(lMinZ, lZ);
            lMaxX = Math.max(lMaxX, lX);
            lMaxY = Math.max(lMaxY, lY);
            lMaxZ = Math.max(lMaxZ, lZ);
        }

        pMesh.bounds.minX = lMinX;
        pMesh.bounds.minY = lMinY;
        pMesh.bounds.minZ = lMinZ;
        pMesh.bounds.maxX = lMaxX;
        pMesh.bounds.maxY = lMaxY;
        pMesh.bounds.maxZ = lMaxZ;
    }

    /**
     * Get the byte size of a glTF component type.
     */
    private static componentByteSize(pComponentType: number): number {
        switch (pComponentType) {
            case gComponentByte:
            case gComponentUnsignedByte: return 1;
            case gComponentShort:
            case gComponentUnsignedShort: return 2;
            case gComponentUnsignedInt:
            case gComponentFloat: return 4;
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

    /**
     * Parse GLB header and chunks into JSON and binary data.
     *
     * @param pData - Raw GLB file data.
     *
     * @returns Parsed GLB data with JSON and binary chunks.
     */
    private static parseGlb(pData: ArrayBuffer): ParsedGlb {
        const lView: DataView = new DataView(pData);

        // Validate GLB header.
        const lMagic: number = lView.getUint32(0, true);
        if (lMagic !== gGlbMagic) {
            throw new Error('Invalid GLB file: wrong magic number.');
        }

        const lVersion: number = lView.getUint32(4, true);
        if (lVersion !== gGlbVersion) {
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

            if (lChunkType === gJsonChunkType) {
                const lJsonBytes: Uint8Array = new Uint8Array(pData, lChunkDataOffset, lChunkLength);
                const lJsonString: string = new TextDecoder().decode(lJsonBytes);
                lJsonData = JSON.parse(lJsonString);
            } else if (lChunkType === gBinChunkType) {
                lBinData = pData.slice(lChunkDataOffset, lChunkDataOffset + lChunkLength);
            }

            lOffset = lChunkDataOffset + lChunkLength;
        }

        if (!lJsonData) {
            throw new Error('Invalid GLB file: missing JSON chunk.');
        }

        return { json: lJsonData, bin: lBinData };
    }

    /**
     * Parse engine Material objects from glTF material definitions.
     * Extracts PBR metallic-roughness properties, base color, and texture references.
     * Material bindings are set for properties that the default PBR shader reads from the User group.
     *
     * @param pJson - Parsed glTF JSON data.
     * @param pTextures - Engine textures indexed by glTF texture index.
     *
     * @returns Array of engine Material objects indexed by glTF material index.
     */
    private static parseMaterials(pJson: GltfJson, pTextures: Array<Texture>): Array<Material> {
        const lMaterials: Array<Material> = new Array<Material>();

        if (!pJson.materials) {
            return lMaterials;
        }

        // texture data containing a 2x2 checkerboard pattern;
        const lTextureData: string = '/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQI' + 
            'BAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAw' + 
            'MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAA' + 
            'AAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo' + 
            '0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytL' + 
            'T1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAE' + 
            'CAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ' + 
            '3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAI' + 
            'RAxEAPwD9/KKKKAP/2Q==';

        // Convert the base64 string to binary data.
        const lTextureBinaryString: string = atob(lTextureData);
        const lTextureBinaryBytes: Uint8Array<ArrayBuffer> = new Uint8Array(lTextureBinaryString.length);
        for (let lByteIndex = 0; lByteIndex < lTextureBinaryString.length; lByteIndex++) {
            lTextureBinaryBytes[lByteIndex] = lTextureBinaryString.charCodeAt(lByteIndex);
        }

        const lPlaceholderTexture: Texture = new Texture();
        lPlaceholderTexture.imageData = lTextureBinaryBytes.buffer;

        for (const lGltfMaterial of pJson.materials) {
            const lMaterial: Material = new Material();

            // Assign default PBR shader.
            const lShader: Shader = new Shader();
            lShader.shaderCode = defaultPbrShader;
            lMaterial.shader = lShader;

            const lPbr: GltfPbrMetallicRoughness | undefined = lGltfMaterial.pbrMetallicRoughness;

            if (lPbr) {
                // Base color factor (RGBA).
                const lBaseColor: [number, number, number, number] = lPbr.baseColorFactor ?? [1, 1, 1, 1];
                lMaterial.setBinding('baseColorFactor', new Float32Array(lBaseColor).buffer);

                // Base color texture.
                if (lPbr.baseColorTexture && lPbr.baseColorTexture.index < pTextures.length) {
                    lMaterial.setBinding('baseColorTexture', pTextures[lPbr.baseColorTexture.index]);
                } else {
                    lMaterial.setBinding('baseColorTexture', lPlaceholderTexture);
                }

                // Metallic and roughness factors.
                lMaterial.setBinding('metallicFactor', new Float32Array([lPbr.metallicFactor ?? 1.0]).buffer);
                lMaterial.setBinding('roughnessFactor', new Float32Array([lPbr.roughnessFactor ?? 0.5]).buffer);

                // Metallic-roughness texture.
                if (lPbr.metallicRoughnessTexture && lPbr.metallicRoughnessTexture.index < pTextures.length) {
                    lMaterial.setBinding('metallicRoughnessTexture', pTextures[lPbr.metallicRoughnessTexture.index]);
                }
            } else {
                // No PBR data: default to white, non-metallic.
                lMaterial.setBinding('baseColorFactor', new Float32Array([1, 1, 1, 1]).buffer);
                lMaterial.setBinding('baseColorTexture', lPlaceholderTexture);
                lMaterial.setBinding('metallicFactor', new Float32Array([0.0]).buffer);
                lMaterial.setBinding('roughnessFactor', new Float32Array([0.5]).buffer);
            }

            // Normal texture.
            if (lGltfMaterial.normalTexture && lGltfMaterial.normalTexture.index < pTextures.length) {
                lMaterial.setBinding('normalTexture', pTextures[lGltfMaterial.normalTexture.index]);
            }

            // Occlusion texture.
            if (lGltfMaterial.occlusionTexture && lGltfMaterial.occlusionTexture.index < pTextures.length) {
                lMaterial.setBinding('occlusionTexture', pTextures[lGltfMaterial.occlusionTexture.index]);
            }

            // Emissive factor (RGB).
            const lEmissive: [number, number, number] = lGltfMaterial.emissiveFactor ?? [0, 0, 0];
            lMaterial.setBinding('emissiveFactor', new Float32Array(lEmissive).buffer);

            // Emissive texture.
            if (lGltfMaterial.emissiveTexture && lGltfMaterial.emissiveTexture.index < pTextures.length) {
                lMaterial.setBinding('emissiveTexture', pTextures[lGltfMaterial.emissiveTexture.index]);
            }

            lMaterials.push(lMaterial);
        }

        return lMaterials;
    }

    /**
     * Parse engine Texture objects from glTF images embedded in the binary buffer.
     * Each glTF texture references an image; images with a bufferView are extracted from the binary data.
     *
     * @param pJson - Parsed glTF JSON data.
     * @param pBin - Binary buffer data (may be null if no binary chunk).
     *
     * @returns Array of engine Texture objects indexed by glTF texture index.
     */
    private static parseTextures(pJson: GltfJson, pBin: ArrayBuffer | null): Array<Texture> {
        const lTextures: Array<Texture> = new Array<Texture>();

        if (!pJson.textures || !pJson.images || !pBin) {
            return lTextures;
        }

        // Pre-extract image data from buffer views.
        const lImageDataMap: Map<number, ArrayBuffer> = new Map<number, ArrayBuffer>();
        for (let lIndex: number = 0; lIndex < pJson.images.length; lIndex++) {
            const lImage: GltfImage = pJson.images[lIndex];
            if (lImage.bufferView !== undefined && pJson.bufferViews) {
                const lBufferView: GltfBufferView = pJson.bufferViews[lImage.bufferView];
                const lByteOffset: number = lBufferView.byteOffset ?? 0;
                lImageDataMap.set(lIndex, pBin.slice(lByteOffset, lByteOffset + lBufferView.byteLength));
            }
        }

        // Create engine textures for each glTF texture.
        for (const lGltfTexture of pJson.textures) {
            const lTexture: Texture = new Texture();
            const lImageData: ArrayBuffer | undefined = lImageDataMap.get(lGltfTexture.source);
            if (lImageData) {
                lTexture.imageData = lImageData;
            }
            lTextures.push(lTexture);
        }

        return lTextures;
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
        const lComponentCount: number | undefined = gTypeComponentCount[pAccessor.type];

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
            case gComponentByte: return pView.getInt8(pOffset);
            case gComponentUnsignedByte: return pView.getUint8(pOffset);
            case gComponentShort: return pView.getInt16(pOffset, true);
            case gComponentUnsignedShort: return pView.getUint16(pOffset, true);
            case gComponentUnsignedInt: return pView.getUint32(pOffset, true);
            case gComponentFloat: return pView.getFloat32(pOffset, true);
            default: throw new Error(`Unsupported glTF component type: ${pComponentType}`);
        }
    }
}

/**
 * Parsed GLB file data containing the JSON and binary chunks.
 */
type ParsedGlb = {
    json: GltfJson;
    bin: ArrayBuffer | null;
};

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
    material?: number;
};

type GltfMesh = {
    primitives: Array<GltfPrimitive>;
};

type GltfImage = {
    bufferView?: number;
    mimeType?: string;
    uri?: string;
};

type GltfTexture = {
    source: number;
    sampler?: number;
};

type GltfTextureInfo = {
    index: number;
    texCoord?: number;
};

type GltfPbrMetallicRoughness = {
    baseColorFactor?: [number, number, number, number];
    baseColorTexture?: GltfTextureInfo;
    metallicFactor?: number;
    roughnessFactor?: number;
    metallicRoughnessTexture?: GltfTextureInfo;
};

type GltfMaterialDef = {
    pbrMetallicRoughness?: GltfPbrMetallicRoughness;
    normalTexture?: GltfTextureInfo;
    occlusionTexture?: GltfTextureInfo;
    emissiveFactor?: [number, number, number];
    emissiveTexture?: GltfTextureInfo;
};

type GltfJson = {
    meshes?: Array<GltfMesh>;
    accessors?: Array<GltfAccessor>;
    bufferViews?: Array<GltfBufferView>;
    materials?: Array<GltfMaterialDef>;
    textures?: Array<GltfTexture>;
    images?: Array<GltfImage>;
};
