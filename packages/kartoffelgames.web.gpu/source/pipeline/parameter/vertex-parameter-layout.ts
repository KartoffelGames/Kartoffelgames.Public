import { Dictionary, Exception } from '@kartoffelgames/core';
import { BufferItemMultiplier } from '../../constant/buffer-item-multiplier.enum';
import { VertexBufferItemFormat } from '../../constant/vertex-buffer-item-format.enum';
import { VertexParameterStepMode } from '../../constant/vertex-parameter-step-mode.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject, GpuObjectSetupReferences } from '../../gpu/object/gpu-object';
import { IGpuObjectNative } from '../../gpu/object/interface/i-gpu-object-native';
import { IGpuObjectSetup } from '../../gpu/object/interface/i-gpu-object-setup';
import { VertexBufferMemoryLayout, VertexBufferMemoryLayoutParameterParameter } from '../../memory_layout/buffer/vertex-buffer-memory-layout';
import { VertexParameter } from './vertex-parameter';
import { VertexParameterLayoutSetup, VertexParameterLayoutSetupData } from './vertex-parameter-layout-setup';

/**
 * Vertex parameter layout.
 */
export class VertexParameterLayout extends GpuObject<Array<GPUVertexBufferLayout>, VertexParameterLayoutInvalidationType, VertexParameterLayoutSetup> implements IGpuObjectNative<Array<GPUVertexBufferLayout>>, IGpuObjectSetup<VertexParameterLayoutSetup> {
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
        const lParameterIndicies: Array<true> = new Array<true>();
        for (const lBuffer of this.mBuffer.values()) {
            // Create parameter layouts.
            const lVertexAttributes: Array<GPUVertexAttribute> = new Array<GPUVertexAttribute>();
            let lCurrentByteLength: number = 0;
            for (const lParameter of lBuffer.parameter) {
                // No double locations.
                if (lParameterIndicies[lParameter.location]) {
                    throw new Exception(`Vertex parameter location "${lParameter.location}" can't be defined twice.`, this);
                }

                // Convert multiplier to value.
                const lByteMultiplier = lParameter.multiplier.split('').reduce<number>((pPreviousNumber: number, pCurrentValue: string) => {
                    const lCurrentNumber: number = parseInt(pCurrentValue);
                    if (isNaN(lCurrentNumber)) {
                        return pPreviousNumber;
                    }

                    return pPreviousNumber * lCurrentNumber;
                }, 1);

                // Convert multiplier to float32 format.
                let lFormat: GPUVertexFormat = `${lBuffer.format}x${lByteMultiplier}` as GPUVertexFormat;
                if (lParameter.multiplier === BufferItemMultiplier.Single) {
                    lFormat = lBuffer.format as GPUVertexFormat;
                }

                // Create buffer layout.
                lVertexAttributes.push({
                    format: lFormat,
                    offset: lCurrentByteLength + lParameter.offset,
                    shaderLocation: lParameter.location
                });

                // Increment current byte length.
                lCurrentByteLength += 4 * lByteMultiplier + lParameter.offset; // 32Bit-Number * (single, vector or matrix number count) 

                // Save location index for checkind double
                lParameterIndicies[lParameter.location] = true;
            }

            // Convert stepmode.
            let lStepmode: GPUVertexStepMode = 'vertex';
            if (lBuffer.stepMode === VertexParameterStepMode.Instance) {
                lStepmode = 'instance';
            }

            lLayoutList.push({
                stepMode: lStepmode,
                arrayStride: lBuffer.layout.variableSize,
                attributes: lVertexAttributes
            });
        }

        // Validate continuity of parameter locations.
        if (lParameterIndicies.length !== this.mParameter.size) {
            throw new Exception(`Vertex parameter locations need to be in continious order.`, this);
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

        // Create each buffer.
        for (const lBufferSetupData of pReferences.buffer) {
            // Add each parameter to parameter list.
            const lParameterList: Array<VertexParameterLayoutBufferParameter> = new Array<VertexParameterLayoutBufferParameter>();
            const lParameterlayoutList: Array<VertexBufferMemoryLayoutParameterParameter> = new Array<VertexBufferMemoryLayoutParameterParameter>();
            for (const lParameterSetupData of lBufferSetupData.parameter) {
                // Create parameter list for the vertex buffer memory layout.
                lParameterlayoutList.push({
                    primitiveMultiplier: lParameterSetupData.multiplier,
                    offset: lParameterSetupData.offset
                });

                // Create vertex parameter.
                const lParameterLayout: VertexParameterLayoutBufferParameter = {
                    name: lParameterSetupData.name,
                    location: lParameterSetupData.location,
                    multiplier: lParameterSetupData.multiplier,
                    offset: lParameterSetupData.offset,
                    bufferName: lBufferSetupData.name
                };

                // Add to parameter list and mapping.
                lParameterList.push(lParameterLayout);
                this.mParameter.set(lParameterLayout.name, lParameterLayout);
            }

            // Create empty buffer.
            const lBufferLayout: VertexParameterLayoutBuffer = {
                name: lBufferSetupData.name,
                stepMode: lBufferSetupData.stepMode,
                format: lBufferSetupData.format,
                parameter: lParameterList,
                layout: new VertexBufferMemoryLayout(this.device, {
                    format: lBufferSetupData.format,
                    parameter: lParameterlayoutList
                })
            };

            this.mBuffer.set(lBufferLayout.name, lBufferLayout);

            // When one buffer is not indexable than no buffer is it.
            if (lBufferLayout.stepMode === VertexParameterStepMode.Vertex) {
                lCanBeIndexed = false;
            }
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
    format: VertexBufferItemFormat;
    layout: VertexBufferMemoryLayout;
    parameter: Array<VertexParameterLayoutBufferParameter>;
};

export type VertexParameterLayoutBufferParameter = {
    name: string;
    location: number;
    multiplier: BufferItemMultiplier;
    offset: number;
    bufferName: string;
};

export enum VertexParameterLayoutInvalidationType {
    NativeRebuild = 'NativeRebuild',
}