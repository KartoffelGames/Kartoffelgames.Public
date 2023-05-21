import { Dictionary } from '@kartoffelgames/core.data';
import { WgslAccessMode } from '../../shader/wgsl_enum/wgsl-access-mode.enum';
import { WgslBindingType } from '../../shader/wgsl_enum/wgsl-binding-type.enum';
import { WgslType } from '../../shader/wgsl_enum/wgsl-type.enum';
import { BufferLayoutLocation, IBufferLayout } from '../../../interface/buffer/i-buffer-layout.interface';

export abstract class BufferLayout implements IBufferLayout{
    private readonly mAccessMode: WgslAccessMode | null;
    private readonly mAttributes: Dictionary<string, Array<string | number>>;
    private readonly mBindingType: WgslBindingType | null;
    private readonly mLocation: number | null;
    private readonly mName: string;
    private mParent: BufferLayout | null;

    /**
     * Type byte alignment.
     */
    public abstract readonly alignment: number;

    /**
     * Buffer size in bytes.
     */
    public abstract readonly size: number;

    /**
     * Wgsl type.
     */
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
     * Get buffer location index as parameter.
     */
    public get location(): number | null {
        return this.mLocation;
    }

    /**
     * Variable name of buffer.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Parent type. Stuct or Array.
     */
    public get parent(): BufferLayout | null {
        return this.mParent;
    } set parent(pValue: BufferLayout | null) {
        this.mParent = pValue;
    }

    /**
     * Constructor.
     */
    public constructor(pName: string, pAccessMode?: WgslAccessMode, pBindType?: WgslBindingType, pLocation: number | null = null) {
        this.mAttributes = new Dictionary<string, Array<string | number>>();

        // Static properties.
        this.mName = pName;
        this.mLocation = pLocation;
        this.mAccessMode = pAccessMode ?? null;
        this.mBindingType = pBindType ?? null;
        this.mParent = null;
    }

    /**
     * Get attribute by name.
     * @param pName - Attribute name.
     */
    public getAttribute(pName: string): BufferTypeAttribute | null {
        const lParameter: Array<string | number> | undefined = this.mAttributes.get(pName);
        if (!lParameter) {
            return null;
        }

        return {
            name: pName,
            parameter: lParameter
        };
    }

    /**
     * Set attribute
     * @param pAttribute - Attribute.
     */
    public setAttribute(pAttributeName: string, pParameter: Array<string | number>): void {
        this.mAttributes.set(pAttributeName, pParameter);
    }

    /**
     * Get location of path.
     * @param pPathName - Path name. Divided by dots.
     */
    public abstract locationOf(pPathName: Array<string>): BufferLayoutLocation;
}

export type BufferTypeAttribute = {
    name: string;
    parameter: Array<string | number>;
}; 