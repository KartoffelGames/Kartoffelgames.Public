import { Dictionary } from '@kartoffelgames/core.data';
import { Base } from '../../../base/export.';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { WgslType } from '../../shader/wgsl_enum/wgsl-type.enum';

export abstract class BufferLayout extends Base.BufferLayout {
    private readonly mAttributes: Dictionary<string, Array<string | number>>;

    /**
     * Wgsl type.
     */
    public abstract readonly type: WgslType;

    /**
     * Constructor.
     */
    public constructor(pName: string, pParent?: BufferLayout, pAccessMode?: AccessMode, pBindType?: BindType, pLocation: number | null = null) {
        super(pName, pParent, pAccessMode, pBindType, pLocation);

        this.mAttributes = new Dictionary<string, Array<string | number>>();
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