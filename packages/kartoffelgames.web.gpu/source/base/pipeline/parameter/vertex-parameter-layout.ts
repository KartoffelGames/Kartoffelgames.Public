import { Dictionary, Exception } from '@kartoffelgames/core';
import { VertexParameterStepMode } from '../../../constant/vertex-parameter-step-mode.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject, GpuObjectSetupReferences } from '../../gpu/object/gpu-object';
import { GpuObjectLifeTime } from '../../gpu/object/gpu-object-life-time.enum';
import { IGpuObjectNative } from '../../gpu/object/interface/i-gpu-object-native';
import { IGpuObjectSetup } from '../../gpu/object/interface/i-gpu-object-setup';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { VertexParameter } from './vertex-parameter';
import { VertexParameterLayoutSetup, VertexParameterLayoutSetupData } from './vertex-parameter-layout-setup';

/**
 * Vertex parameter layout.
 */
export class VertexParameterLayout extends GpuObject<Array<GPUVertexBufferLayout>, '', VertexParameterLayoutSetup> implements IGpuObjectNative<Array<GPUVertexBufferLayout>>, IGpuObjectSetup<VertexParameterLayoutSetup> {
    private readonly mIndexable: boolean;
    private readonly mParameter: Dictionary<string, VertexParameterLayoutDefinition>;

    /**
     * Parameter count.
     */
    public get count(): number {
        return this.mParameter.size;
    }

    /**
     * If parameters are indexable.
     * Meanins every parameter is eighter stepmode index or instance.
     * When even one parameter has a stepmode of vertex, any index parameters must be converted. 
     */
    public get indexable(): boolean {
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
        return [...this.mParameter.keys()];
    }

    /**
     * Construct.
     * 
     * @param pDevice - Device reference.
     * @param pLayout - Simple layout of parameter.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice, GpuObjectLifeTime.Persistent);

        this.mIndexable = false;
        this.mParameter = new Dictionary<string, VertexParameterLayoutDefinition>();
    }

    /**
     * Create vertex parameters from layout.
     * @param pIndexData - Index data.
     */
    public create(pIndexData: Array<number>): VertexParameter {
        return new VertexParameter(this.device, this, pIndexData);
    }

    /**
     * Get vertex parameter layout definition of name.
     * 
     * @param pName - Parameter name.
     */
    public parameter(pName: string): Readonly<VertexParameterLayoutDefinition> {
        const lLayout: VertexParameterLayoutDefinition | undefined = this.mParameter.get(pName);
        if (!lLayout) {
            throw new Exception(`Vertex parameter "${pName}" is not defined.`, this);
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
        for (const lParameter of this.mParameter.values()) {
            // Convert multiplier to value.
            const lByteMultiplier = lParameter.multiplier.split('').reduce<number>((pPreviousNumber: number, pCurrentValue: string) => {
                const lCurrentNumber: number = parseInt(pCurrentValue);
                if (isNaN(lCurrentNumber)) {
                    return pPreviousNumber;
                }

                return pPreviousNumber * lCurrentNumber;
            }, 1);

            // Convert multiplier to float32 format. // TODO: How to support other vertex formats.
            let lFormat: GPUVertexFormat = `float32x${lByteMultiplier}` as GPUVertexFormat;
            if (lParameter.multiplier === PrimitiveBufferMultiplier.Single) {
                lFormat = 'float32';
            }

            // Convert stepmode.
            let lStepmode: GPUVertexStepMode = 'vertex';
            if (lParameter.stepMode === VertexParameterStepMode.Instance) {
                lStepmode = 'instance';
            }

            // Create buffer layout.
            lLayoutList[lParameter.location] = {
                arrayStride: 4 * lByteMultiplier, // 32Bit-Number * (single, vector or matrix number count) 
                stepMode: lStepmode,
                attributes: [{
                    format: lFormat,
                    offset: 0,
                    shaderLocation: lParameter.location
                }]
            };
        }

        // Validate continuity of parameter locations.
        if (lLayoutList.length !== this.mParameter.size) {
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
        // Convert layout list into name key values.
        for (const lLayoutDefintion of pLayout) {
            this.mParameter.set(lLayoutDefintion.name, lLayoutDefintion);

            // When any of the parameters stepmode is vertex, no parameter can be used with indicies.
            if (lLayoutDefintion.stepMode === VertexParameterStepMode.Vertex) {
                this.mIndexable = false;
            }
        }
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

export type VertexParameterLayoutDefinition = {
    name: string;
    location: number;
    format: PrimitiveBufferFormat;
    multiplier: PrimitiveBufferMultiplier; // TODO: Change to bufferLayout to allow different vertex layouts.
    stepMode: VertexParameterStepMode;
};

