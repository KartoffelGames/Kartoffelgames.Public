import { Dictionary } from '@kartoffelgames/core.data';
import { WgslAccessMode } from '../shader/enum/wgsl-access-mode.enum';
import { WgslBindingType } from '../shader/enum/wgsl-binding-type.enum';
import { WgslType } from '../shader/enum/wgsl-type.enum';

export abstract class BufferType {
    private readonly mAccessMode: WgslAccessMode | null;
    private readonly mAttributes: Dictionary<string, BufferTypeAttribute>;
    private readonly mBindingType: WgslBindingType | null;

    // Calculated properties.
    public abstract readonly alignment: number;
    public abstract readonly size: number;
    public abstract readonly type: WgslType;

    /**
     * Buffer type access mode.
     */
    public get accessMode(): WgslAccessMode | null {
        return this.mAccessMode;
    }

    /**
     * Buffer bind type.
     */
    public get bindingType(): WgslBindingType | null {
        return this.mBindingType;
    }

    /**
     * Constructor.
     */
    public constructor(pAccessMode?: WgslAccessMode, pBindType?: WgslBindingType) {
        this.mAttributes = new Dictionary<string, BufferTypeAttribute>();

        // Static properties.
        this.mAccessMode = pAccessMode ?? null;
        this.mBindingType = pBindType ?? null;
    }

    /**
     * Get attribute by name.
     * @param pName - Attribute name.
     */
    public getAttribute(pName: string): BufferTypeAttribute | null {
        return this.mAttributes.get(pName) ?? null;
    }

    /**
     * Set attribute
     * @param pAttribute - Attribute.
     */
    public setAttribute(pAttribute: BufferTypeAttribute): void {
        this.mAttributes.set(pAttribute.name, pAttribute);
    }
}

export type BufferTypeAttribute = {
    name: string;
    parameter: Array<string>;
}; 