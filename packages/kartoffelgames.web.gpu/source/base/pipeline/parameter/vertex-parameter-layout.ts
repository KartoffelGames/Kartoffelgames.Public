import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/object/gpu-object';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { VertexParameter } from './vertex-parameter';
import { IGpuObjectNative } from '../../gpu/object/interface/i-gpu-object-native';
import { GpuObjectLifeTime } from '../../gpu/object/gpu-object-life-time.enum';

/**
 * Vertex parameter layout.
 */
export class VertexParameterLayout extends GpuObject<Array<GPUVertexBufferLayout>> implements IGpuObjectNative<Array<GPUVertexBufferLayout>> {
    private readonly mParameter: Dictionary<string, VertexParameterLayoutDefinition>;

    /**
     * Parameter count.
     */
    public get count(): number {
        return this.mParameter.size;
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
    public constructor(pDevice: GpuDevice, pLayout: Array<VertexParameterLayoutDefinition>) {
        super(pDevice, GpuObjectLifeTime.Persistent);

        // Convert layout list into name key values.
        this.mParameter = new Dictionary<string, VertexParameterLayoutDefinition>();
        for (const lLayoutDefintion of pLayout) {
            this.mParameter.set(lLayoutDefintion.name, lLayoutDefintion);
        }
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

            // Create buffer layout.
            lLayoutList[lParameter.location] = {
                arrayStride: 4 * lByteMultiplier, // 32Bit-Number * (single, vector or matrix number count) 
                stepMode: 'vertex',
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
}

export type VertexParameterLayoutDefinition = {
    name: string;
    location: number;
    format: PrimitiveBufferFormat;
    multiplier: PrimitiveBufferMultiplier;
}

