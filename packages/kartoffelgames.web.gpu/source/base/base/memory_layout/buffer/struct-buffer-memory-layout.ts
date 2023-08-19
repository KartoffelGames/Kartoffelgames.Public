import { Exception } from '@kartoffelgames/core.data';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseBufferMemoryLayout, BufferLayoutLocation, BufferMemoryLayoutParameter } from './base-buffer-memory-layout';

export class StructBufferMemoryLayout extends BaseBufferMemoryLayout {
    private mAlignment: number;
    private mInnerProperties: Array<[number, BaseBufferMemoryLayout]>;
    private mSize: number;
    private readonly mStructName: string;

    /**
     * Alignment of type.
     */
    public get alignment(): number {
        return this.mAlignment;
    }

    /**
     * Ordered inner properties.
     */
    public get properties(): Array<BaseBufferMemoryLayout> {
        return this.mInnerProperties.map((pProperty) => pProperty[1]);
    }

    /**
     * Type size in byte.
     */
    public get size(): number {
        return this.mSize;
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
    public constructor(pGpu: GpuDevice, pParameter: StructBufferMemoryLayoutParameter) {
        super(pGpu, pParameter);

        // Calculated properties.
        this.mAlignment = 0;
        this.mSize = 0;

        // Static properties.
        this.mStructName = pParameter.structName;
        this.mInnerProperties = new Array<[number, BaseBufferMemoryLayout]>();
    }

    /**
     * Add property to struct.
     * @param pName - Property name.
     * @param pOrder - Index of property.
     * @param pType - Property type.
     */
    public addProperty(pOrder: number, pType: BaseBufferMemoryLayout): void {
        this.mInnerProperties.push([pOrder, pType]);
        pType.parent = this;

        // Order properties.
        this.mInnerProperties = this.mInnerProperties.sort((pA, pB) => {
            return pA[0] - pB[0];
        });

        // Call recalculation. Or other usefull things.
        this.recalculateAlignment();
    }

    /**
     * Get types of properties with a set memory index.
     */
    public bindingLayouts(): Array<BaseBufferMemoryLayout> {
        const lLocationTypes: Array<BaseBufferMemoryLayout> = new Array<BaseBufferMemoryLayout>();

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
    public locationLayouts(): Array<BaseBufferMemoryLayout> {
        const lLocationTypes: Array<BaseBufferMemoryLayout> = new Array<BaseBufferMemoryLayout>();

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
        const lOrderedTypeList: Array<BaseBufferMemoryLayout> = this.mInnerProperties.sort(([pOrderA], [pOrderB]) => {
            return pOrderA - pOrderB;
        }).map(([, pType]) => pType);

        // Recalculate size.
        let lPropertyOffset: number = 0;
        let lPropertyLayout: BaseBufferMemoryLayout | null = null;
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
     * Recalculate size and alignment.
     */
    private recalculateAlignment(): void {
        // Recalculate size.
        let lRawDataSize: number = 0;
        for (const lType of this.properties) {
            // Increase offset to needed alignment.
            lRawDataSize = Math.ceil(lRawDataSize / lType.alignment) * lType.alignment;

            // Increase offset for type.
            lRawDataSize += lType.size;

            if (lType.alignment > this.mAlignment) {
                this.mAlignment = lType.alignment;
            }
        }

        // Apply struct alignment to raw data size.
        this.mSize = Math.ceil(lRawDataSize / this.mAlignment) * this.mAlignment;
    }
}

export interface StructBufferMemoryLayoutParameter extends BufferMemoryLayoutParameter {
    structName: string;
}