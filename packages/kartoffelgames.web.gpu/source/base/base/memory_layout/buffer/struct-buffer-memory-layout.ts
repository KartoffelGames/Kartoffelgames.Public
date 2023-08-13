import { Exception } from '@kartoffelgames/core.data';
import { GpuTypes } from '../../gpu/gpu-device';
import { BufferLayoutLocation, BufferMemoryLayout, BufferMemoryLayoutParameter } from './buffer-memory-layout';

export abstract class StructBufferMemoryLayout<TGpuTypes extends GpuTypes = GpuTypes> extends BufferMemoryLayout<TGpuTypes> {
    private mInnerProperties: Array<[number, TGpuTypes['bufferMemoryLayout']]>;
    private readonly mStructName: string;

    /**
     * Ordered inner properties.
     */
    public get properties(): Array<TGpuTypes['bufferMemoryLayout']> {
        return this.mInnerProperties.map((pProperty) => pProperty[1]);
    }

    /**
     * Struct name.
     */
    public get structName(): string {
        return this.mStructName;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pGpu: TGpuTypes['gpuDevice'], pParameter: StructBufferMemoryLayoutParameter) {
        super(pGpu, pParameter);

        // Static properties.
        this.mStructName = pParameter.structName;
        this.mInnerProperties = new Array<[number, TGpuTypes['bufferMemoryLayout']]>();
    }

    /**
     * Add property to struct.
     * @param pName - Property name.
     * @param pOrder - Index of property.
     * @param pType - Property type.
     */
    public addProperty(pOrder: number, pType: TGpuTypes['bufferMemoryLayout']): void {
        this.mInnerProperties.push([pOrder, pType]);
        pType.parent = this;

        // Order properties.
        this.mInnerProperties = this.mInnerProperties.sort((pA, pB) => {
            return pA[0] - pB[0];
        });

        // Call recalculation. Or other usefull things.
        this.onProperyAdd();
    }

    /**
     * Get types of properties with a set memory index.
     */
    public bindingLayouts(): Array<TGpuTypes['bufferMemoryLayout']> {
        const lLocationTypes: Array<TGpuTypes['bufferMemoryLayout']> = new Array<TGpuTypes['bufferMemoryLayout']>();

        // Include itself.
        if (this.locationIndex !== null || this.bindingIndex !== null) {
            lLocationTypes.push(this);
        }

        // Check all properties.
        for (const [, lPropertyType] of this.mInnerProperties.values()) {
            // Get all inner locations when property is a struct type.
            if (lPropertyType instanceof StructBufferMemoryLayout) {
                // Result does include itself 
                lLocationTypes.push(...lPropertyType.bindingLayouts());
            } else if (lPropertyType.bindingIndex !== null) {
                lLocationTypes.push(lPropertyType);
            }
        }

        return lLocationTypes;
    }

    /**
     * Get types of properties with a set memory index.
     */
    public locationLayouts(): Array<TGpuTypes['bufferMemoryLayout']> {
        const lLocationTypes: Array<TGpuTypes['bufferMemoryLayout']> = new Array<TGpuTypes['bufferMemoryLayout']>();

        // Include itself.
        if (this.locationIndex !== null || this.bindingIndex !== null) {
            lLocationTypes.push(this);
        }

        // Check all properties.
        for (const [, lPropertyType] of this.mInnerProperties.values()) {
            // Get all inner locations when property is a struct type.
            if (lPropertyType instanceof StructBufferMemoryLayout) {
                // Result does include itself 
                lLocationTypes.push(...lPropertyType.locationLayouts());
            } else if (lPropertyType.locationIndex !== null) {
                lLocationTypes.push(lPropertyType);
            }
        }

        return lLocationTypes;
    }

    /**
     * Get location of path.
     * @param pPathName - Path name. Divided by dots.
     */
    public override locationOf(pPathName: Array<string>): BufferLayoutLocation {
        const lPathName: Array<string> = [...pPathName];

        // Complete array.
        const lPropertyName: string | undefined = lPathName.shift();
        if (!lPropertyName) {
            return { size: this.size, offset: 0 };
        }

        // Get ordered types.
        const lOrderedTypeList: Array<TGpuTypes['bufferMemoryLayout']> = this.mInnerProperties.sort(([pOrderA], [pOrderB]) => {
            return pOrderA - pOrderB;
        }).map(([, pType]) => pType);

        // Recalculate size.
        let lPropertyOffset: number = 0;
        let lPropertyLayout: TGpuTypes['bufferMemoryLayout'] | null = null;
        for (const lProperty of lOrderedTypeList) {
            // Increase offset to needed alignment.
            lPropertyOffset = Math.ceil(lPropertyOffset / lProperty.alignment) * lProperty.alignment;

            // Inner property is found. Skip searching.
            // Alignment just applied so it can be skipped later.
            if (lProperty.name === lPropertyName) {
                lPropertyLayout = lProperty;
                break;
            }

            // Increase offset for complete property.
            lPropertyOffset += lProperty.size;
        }

        // Validate property.
        if (!lPropertyLayout) {
            throw new Exception(`Struct buffer layout property "${lPropertyName}" not found.`, this);
        }

        const lPropertyLocation = lPropertyLayout.locationOf(lPathName);
        return {
            size: lPropertyLocation.size,
            offset: lPropertyOffset + lPropertyLocation.offset
        };
    }

    /**
     * Called on property add.
     */
    protected abstract onProperyAdd(): void;
}

export interface StructBufferMemoryLayoutParameter extends BufferMemoryLayoutParameter {
    structName: string;
}