import { Dictionary, Exception } from '@kartoffelgames/core';
import { PrimitiveBufferMemoryLayout } from '../../buffer/memory_layout/primitive-buffer-memory-layout.ts';
import { StructBufferMemoryLayout } from '../../buffer/memory_layout/struct-buffer-memory-layout.ts';
import { BufferAlignmentType } from '../../constant/buffer-alignment-type.enum.ts';
import { BufferItemMultiplier } from '../../constant/buffer-item-multiplier.enum.ts';
import { VertexParameterStepMode } from '../../constant/vertex-parameter-step-mode.enum.ts';
import type { GpuDevice } from '../../device/gpu-device.ts';
import { GpuObject, type GpuObjectSetupReferences } from '../../gpu_object/gpu-object.ts';
import type { IGpuObjectNative } from '../../gpu_object/interface/i-gpu-object-native.ts';
import type { IGpuObjectSetup } from '../../gpu_object/interface/i-gpu-object-setup.ts';
import { VertexParameter } from './vertex-parameter.ts';
import { VertexParameterLayoutSetup, type VertexParameterLayoutSetupData } from './vertex-parameter-layout-setup.ts';

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
     * Call setup.
     * 
     * @param pSetupCallback - Setup callback.
     *
     * @returns — this.
     */
    public override setup(pSetupCallback?: ((pSetup: VertexParameterLayoutSetup) => void)): this {
        return super.setup(pSetupCallback);
    }

    /**
     * Generate new native object.
     */
    protected override generateNative(): Array<GPUVertexBufferLayout> {
        // Create vertex buffer layout for each parameter.
        const lLayoutList: Array<GPUVertexBufferLayout> = new Array<GPUVertexBufferLayout>();
        for (const lBuffer of this.mBuffer.values()) {
            let lCurrentBufferByteLength: number = 0;
            // Create parameter layouts.
            const lVertexAttributes: Array<GPUVertexAttribute> = new Array<GPUVertexAttribute>();
            for (const lParameter of lBuffer.layout.properties) {
                // Convert parameter layout to primitive buffer layout.
                const lPrimitiveParameterLayout: PrimitiveBufferMemoryLayout = lParameter.layout as PrimitiveBufferMemoryLayout;

                // Convert multiplier to value.
                const lItemMultiplier = PrimitiveBufferMemoryLayout.itemCountOfMultiplier(lPrimitiveParameterLayout.itemMultiplier);

                // Convert multiplier to float32 format.
                let lFormat: GPUVertexFormat = `${lPrimitiveParameterLayout.itemFormat}x${lItemMultiplier}` as GPUVertexFormat;
                if (lPrimitiveParameterLayout.itemMultiplier === BufferItemMultiplier.Single) {
                    lFormat = lPrimitiveParameterLayout.itemFormat as GPUVertexFormat;
                }

                // Read location of parameter.
                const lParameterLocation: number = this.mParameter.get(lParameter.name)!.location;

                // Create buffer layout.
                lVertexAttributes.push({
                    format: lFormat,
                    offset: lCurrentBufferByteLength,
                    shaderLocation: lParameterLocation
                });

                // Apply alignment and extend buffer size by parameter length.
                lCurrentBufferByteLength = Math.ceil(lCurrentBufferByteLength / lPrimitiveParameterLayout.alignment) * lPrimitiveParameterLayout.alignment;
                lCurrentBufferByteLength += lPrimitiveParameterLayout.fixedSize;
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
            // Create struct layout with packed alignment.
            const lBufferLayout: StructBufferMemoryLayout = new StructBufferMemoryLayout(this.device, BufferAlignmentType.Packed);
            lBufferLayout.setup((pSetup) => {
                for (const lParameterSetupData of lBufferSetupData.parameter) {
                    // No double locations.
                    if (lParameterIndicies[lParameterSetupData.location]) {
                        throw new Exception(`Vertex parameter location "${lParameterSetupData.location}" can't be defined twice.`, this);
                    }

                    // Validate multiplier.
                    if (!lAllowedMultiplier.has(lParameterSetupData.multiplier)) {
                        throw new Exception(`Vertex parameter item multiplier "${lParameterSetupData.multiplier}" not supported.`, this);
                    }

                    // Add parameter as struct property.
                    pSetup.property(lParameterSetupData.name)
                        .asPrimitive(lParameterSetupData.format, lParameterSetupData.multiplier, lParameterSetupData.alignment);

                    // Add to parameter list.
                    this.mParameter.set(lParameterSetupData.name, {
                        name: lParameterSetupData.name,
                        location: lParameterSetupData.location,
                    });

                    // Save location index for checkind double
                    lParameterIndicies[lParameterSetupData.location] = true;
                }
            });

            // Create buffer description.
            this.mBuffer.set(lBufferSetupData.name, {
                name: lBufferSetupData.name,
                stepMode: lBufferSetupData.stepMode,
                layout: lBufferLayout
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
}

export type VertexParameterLayoutBuffer = {
    name: string;
    stepMode: VertexParameterStepMode;
    layout: StructBufferMemoryLayout;
};

export type VertexParameterLayoutBufferParameter = {
    name: string;
    location: number;
};