import { Dictionary, Exception } from '@kartoffelgames/core';
import { BufferItemFormat } from '../../constant/buffer-item-format.enum.ts';
import { BufferItemMultiplier } from '../../constant/buffer-item-multiplier.enum.ts';
import { VertexParameterStepMode } from '../../constant/vertex-parameter-step-mode.enum.ts';
import type { GpuDevice } from '../../device/gpu-device.ts';
import { GpuObject, type GpuObjectSetupReferences } from '../../gpu_object/gpu-object.ts';
import type { IGpuObjectNative } from '../../gpu_object/interface/i-gpu-object-native.ts';
import type { IGpuObjectSetup } from '../../gpu_object/interface/i-gpu-object-setup.ts';
import { VertexParameterLayoutSetup, type VertexParameterLayoutSetupData } from './vertex-parameter-layout-setup.ts';
import { VertexParameter } from './vertex-parameter.ts';

/**
 * Vertex parameter layout.
 */
export class VertexParameterLayout extends GpuObject<Array<GPUVertexBufferLayout>, '', VertexParameterLayoutSetup> implements IGpuObjectNative<Array<GPUVertexBufferLayout>>, IGpuObjectSetup<VertexParameterLayoutSetup> {
    private readonly mBuffer: Dictionary<string, VertexParameterLayoutBuffer>;
    private mIndexable: boolean;
    private readonly mParameter: Dictionary<string, VertexParameterLayoutBufferParameter>;

    /**
     * Get all parameter buffer names.
     */
    public get bufferNames(): Array<string> {
        // Setup must be called.
        this.ensureSetup();

        return [...this.mBuffer.keys()];
    }

    /**
     * If parameters are indexable.
     * Meanins every parameter is eighter stepmode index or instance.
     * When even one parameter has a stepmode of vertex, any index parameters must be converted. 
     */
    public get indexable(): boolean {
        // Setup must be called.
        this.ensureSetup();

        return this.mIndexable;
    }

    /**
     * Native gpu object.
     */
    public override get native(): Array<GPUVertexBufferLayout> {
        return super.native;
    }

    /**
     * Get all parameter names.
     */
    public get parameterNames(): Array<string> {
        // Setup must be called.
        this.ensureSetup();

        return [...this.mParameter.keys()];
    }

    /**
     * Construct.
     * 
     * @param pDevice - Device reference.
     * @param pLayout - Simple layout of parameter.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);

        this.mIndexable = false;
        this.mBuffer = new Dictionary<string, VertexParameterLayoutBuffer>();
        this.mParameter = new Dictionary<string, VertexParameterLayoutBufferParameter>();
    }

    /**
     * Create vertex parameters from layout.
     * @param pIndexData - Index data.
     */
    public create(pIndexData: Array<number>): VertexParameter {
        return new VertexParameter(this.device, this, pIndexData);
    }

    /**
     * Get vertex parameter layout definition by name.
     * 
     * @param pName - Parameter name.
     */
    public parameter(pName: string): Readonly<VertexParameterLayoutBufferParameter> {
        const lLayout: VertexParameterLayoutBufferParameter | undefined = this.mParameter.get(pName);
        if (!lLayout) {
            throw new Exception(`Vertex parameter "${pName}" is not defined.`, this);
        }

        return lLayout;
    }

    /**
     * Get vertex parameter layout definition by name.
     * 
     * @param pBufferName - Parameter name.
     */
    public parameterBuffer(pBufferName: string): Readonly<VertexParameterLayoutBuffer> {
        const lLayout: VertexParameterLayoutBuffer | undefined = this.mBuffer.get(pBufferName);
        if (!lLayout) {
            throw new Exception(`Vertex parameter buffer "${pBufferName}" is not defined.`, this);
        }

        return lLayout;
    }

    /**
     * Generate new native object.
     */
    protected override generateNative(): Array<GPUVertexBufferLayout> {
        // Create vertex buffer layout for each parameter.
        const lLayoutList: Array<GPUVertexBufferLayout> = new Array<GPUVertexBufferLayout>();
        for (const lBuffer of this.mBuffer.values()) {
            // Create parameter layouts.
            const lVertexAttributes: Array<GPUVertexAttribute> = new Array<GPUVertexAttribute>();
            for (const lProperty of lBuffer.layout.properties) {
                // Convert multiplier to vertex format string.
                let lFormat: GPUVertexFormat = `${lProperty.item.format}x${lProperty.item.count}` as GPUVertexFormat;
                if (lProperty.item.count === 1) {
                    lFormat = lProperty.item.format as GPUVertexFormat;
                }

                // Read location of parameter.
                const lParameterLocation: number = this.mParameter.get(lProperty.name)!.location;

                // Create buffer layout.
                lVertexAttributes.push({
                    format: lFormat,
                    offset: lProperty.byteOffset,
                    shaderLocation: lParameterLocation
                });
            }

            // Convert stepmode.
            let lStepmode: GPUVertexStepMode = 'vertex';
            if (lBuffer.stepMode === VertexParameterStepMode.Instance) {
                lStepmode = 'instance';
            }

            lLayoutList.push({
                stepMode: lStepmode,
                arrayStride: lBuffer.layout.fixedSize,
                attributes: lVertexAttributes
            });
        }

        return lLayoutList;
    }

    /**
     * Setup with setup object.
     *
     * @param pReferences - Used references.
     */
    protected override onSetup(pReferences: VertexParameterLayoutSetupData): void {
        let lCanBeIndexed: boolean = true;

        // Build allowed multiplier list.
        const lAllowedMultiplier: Set<BufferItemMultiplier> = new Set<BufferItemMultiplier>([
            BufferItemMultiplier.Single,
            BufferItemMultiplier.Vector2,
            BufferItemMultiplier.Vector3,
            BufferItemMultiplier.Vector4
        ]);

        // Create each buffer.
        const lParameterIndicies: Array<true> = new Array<true>();
        for (const lBufferSetupData of pReferences.buffer) {
            // Compute struct layout inline with packed alignment.
            const lProperties: VertexParameterLayoutComputedBuffer['properties'] = [];
            let lRunningOffset: number = 0;

            for (const lParameterSetupData of lBufferSetupData.parameter) {
                // No double locations.
                if (lParameterIndicies[lParameterSetupData.location]) {
                    throw new Exception(`Vertex parameter location "${lParameterSetupData.location}" can't be defined twice.`, this);
                }

                // Validate multiplier.
                if (!lAllowedMultiplier.has(lParameterSetupData.multiplier)) {
                    throw new Exception(`Vertex parameter item multiplier "${lParameterSetupData.multiplier}" not supported.`, this);
                }

                // Compute size and alignment for this primitive.
                const lByteSize: number = this.computePrimitiveSize(lParameterSetupData.format, lParameterSetupData.multiplier);

                lProperties.push({
                    name: lParameterSetupData.name,
                    item: {
                        format: lParameterSetupData.format,
                        count: this.itemCountOfMultiplier(lParameterSetupData.multiplier),
                        byteCount: this.itemFormatByteCount(lParameterSetupData.format)
                    },
                    byteOffset: lRunningOffset,
                    byteSize: lByteSize,
                });

                lRunningOffset += lByteSize;

                // Add to parameter list.
                this.mParameter.set(lParameterSetupData.name, {
                    name: lParameterSetupData.name,
                    location: lParameterSetupData.location,
                });

                // Save location index for checking double.
                lParameterIndicies[lParameterSetupData.location] = true;
            }

            // Create buffer description.
            this.mBuffer.set(lBufferSetupData.name, {
                name: lBufferSetupData.name,
                stepMode: lBufferSetupData.stepMode,
                layout: {
                    fixedSize: lRunningOffset,
                    properties: lProperties,
                }
            });

            // When one buffer is not indexable than no buffer is it.
            if (lBufferSetupData.stepMode === VertexParameterStepMode.Vertex) {
                lCanBeIndexed = false;
            }
        }

        // Validate continuity of parameter locations.
        if (lParameterIndicies.length !== this.mParameter.size) {
            throw new Exception(`Vertex parameter locations need to be in continious order.`, this);
        }

        this.mIndexable = lCanBeIndexed;
    }

    /**
     * Create setup object. Return null to skip any setups.
     * 
     * @param pReferences - Setup references.
     * 
     * @returns created setup. 
     */
    protected override onSetupObjectCreate(pReferences: GpuObjectSetupReferences<VertexParameterLayoutSetupData>): VertexParameterLayoutSetup {
        return new VertexParameterLayoutSetup(pReferences);
    }

    /**
     * Compute byte size of a primitive type.
     *
     * @param pFormat - Item format.
     * @param pMultiplier - Item multiplier.
     *
     * @returns byte size of primitive.
     */
    private computePrimitiveSize(pFormat: BufferItemFormat, pMultiplier: BufferItemMultiplier): number {
        return this.itemFormatByteCount(pFormat) * this.itemCountOfMultiplier(pMultiplier);
    }

    /**
     * Get item count for multiplier type.
     *
     * @param pMultiplier - Multiplier type.
     *
     * @returns item count of multiplier.
     */
    private itemCountOfMultiplier(pMultiplier: BufferItemMultiplier): number {
        switch (pMultiplier) {
            case BufferItemMultiplier.Single: { return 1; }
            case BufferItemMultiplier.Vector2: { return 2; }
            case BufferItemMultiplier.Vector3: { return 3; }
            case BufferItemMultiplier.Vector4: { return 4; }
            case BufferItemMultiplier.Matrix22: { return 4; }
            case BufferItemMultiplier.Matrix23: { return 6; }
            case BufferItemMultiplier.Matrix24: { return 8; }
            case BufferItemMultiplier.Matrix32: { return 6; }
            case BufferItemMultiplier.Matrix33: { return 9; }
            case BufferItemMultiplier.Matrix34: { return 12; }
            case BufferItemMultiplier.Matrix42: { return 8; }
            case BufferItemMultiplier.Matrix43: { return 0; }
            case BufferItemMultiplier.Matrix44: { return 16; }
        }
    }

    /**
     * Get byte count of item format.
     *
     * @param pItemFormat - Item format.
     *
     * @returns byte count of format.
     */
    private itemFormatByteCount(pItemFormat: BufferItemFormat): number {
        switch (pItemFormat) {
            case BufferItemFormat.Float16: return 2;
            case BufferItemFormat.Float32: return 4;
            case BufferItemFormat.Uint32: return 4;
            case BufferItemFormat.Sint32: return 4;
            case BufferItemFormat.Uint8: return 1;
            case BufferItemFormat.Sint8: return 1;
            case BufferItemFormat.Uint16: return 2;
            case BufferItemFormat.Sint16: return 2;
            case BufferItemFormat.Unorm16: return 2;
            case BufferItemFormat.Snorm16: return 2;
            case BufferItemFormat.Unorm8: return 1;
            case BufferItemFormat.Snorm8: return 1;
        }
    }
}

export type VertexParameterLayoutComputedBuffer = {
    fixedSize: number;
    properties: Array<{
        name: string;
        item: {
            format: BufferItemFormat;
            count: number;
            byteCount: number;
        };
        byteOffset: number;
        byteSize: number;
    }>;
};

export type VertexParameterLayoutBuffer = {
    name: string;
    stepMode: VertexParameterStepMode;
    layout: VertexParameterLayoutComputedBuffer;
};

export type VertexParameterLayoutBufferParameter = {
    name: string;
    location: number;
};