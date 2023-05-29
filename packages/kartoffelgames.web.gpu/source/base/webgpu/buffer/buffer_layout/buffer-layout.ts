import { Dictionary } from '@kartoffelgames/core.data';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { Base } from '../../../base/export.';
import { WgslType } from '../../shader/wgsl_enum/wgsl-type.enum';

export abstract class BufferLayout extends Base.BufferLayout {
    private readonly mAttributes: Dictionary<string, Array<string | number>>;
    private readonly mLocation: number | null;

    /**
     * Wgsl type.
     */
    public abstract readonly type: WgslType;

    /**
     * Get buffer location index as parameter.
     */
    public get location(): number | null {
        return this.mLocation;
    }

    /**
     * Constructor.
     */
    public constructor(pName: string, pParent?: BufferLayout, pAccessMode?: AccessMode, pBindType?: BindType, pLocation: number | null = null) {
        super(pName, pParent, pAccessMode, pBindType);

        this.mAttributes = new Dictionary<string, Array<string | number>>();

        // Static properties.
        this.mLocation = pLocation;
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
}

export type BufferTypeAttribute = {
    name: string;
    parameter: Array<string | number>;
}; 