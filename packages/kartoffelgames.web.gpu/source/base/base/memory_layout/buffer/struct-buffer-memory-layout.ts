import { Exception } from '@kartoffelgames/core.data';
import { BufferLayoutLocation, IBufferMemoryLayout } from '../../../interface/memory_layout/buffer/i-buffer-memory-layout.interface';
import { IStructBufferMemoryLayout, StructBufferMemoryLayoutParameter } from '../../../interface/memory_layout/buffer/i-struct-buffer.memory-layout.interface';
import { GpuDevice } from '../../gpu/gpu-device';
import { BufferMemoryLayout } from './buffer-memory-layout';

export abstract class StructBufferMemoryLayout<TGpu extends GpuDevice> extends BufferMemoryLayout<TGpu> implements IStructBufferMemoryLayout {
    private mInnerProperties: Array<[number, IBufferMemoryLayout]>;
    private readonly mStructName: string;

    /**
     * Ordered inner properties.
     */
    public get properties(): Array<IBufferMemoryLayout> {
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
    public constructor(pGpu: TGpu, pParameter: StructBufferMemoryLayoutParameter) {
        super(pGpu, pParameter);

        // Static properties.
        this.mStructName = pParameter.structName;
        this.mInnerProperties = new Array<[number, IBufferMemoryLayout]>();
    }

    /**
     * Add property to struct.
     * @param pName - Property name.
     * @param pOrder - Index of property.
     * @param pType - Property type.
     */
    public addProperty(pOrder: number, pType: IBufferMemoryLayout): void {
        this.mInnerProperties.push([pOrder, pType]);

        // Order properties.
        this.mInnerProperties = this.mInnerProperties.sort((pA, pB) => {
            return pA[0] - pB[0];
        });

        // Call recalculation. Or other usefull things.
        this.onProperyAdd();
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
        const lOrderedTypeList: Array<IBufferMemoryLayout> = this.mInnerProperties.sort(([pOrderA], [pOrderB]) => {
            return pOrderA - pOrderB;
        }).map(([, pType]) => pType);

        // Recalculate size.
        let lPropertyOffset: number = 0;
        let lPropertyLayout: IBufferMemoryLayout | null = null;
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
     * Get types of properties with set location.
     */
    public locations(): Array<IBufferMemoryLayout> {
        const lLocationTypes: Array<IBufferMemoryLayout> = new Array<IBufferMemoryLayout>();
        for (const [, lPropertyType] of this.mInnerProperties.values()) {
            // Set property as location when set.
            if (lPropertyType.location !== null) {
                lLocationTypes.push(lPropertyType);
            }

            // Get all inner locations when property is a struct type.
            if (lPropertyType instanceof StructBufferMemoryLayout) {
                lLocationTypes.push(...lPropertyType.locations());
            }
        }

        return lLocationTypes;
    }

    /**
     * Called on property add.
     */
    protected abstract onProperyAdd(): void;
}