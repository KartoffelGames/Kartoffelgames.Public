import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslStructure } from '../../base-pgsl-structure';
import { PgslDocument } from '../../pgsl-document';

/**
 * Generic attributre list.
 */
export class PgslAttributeList extends BasePgslStructure {
    /**
     * Get document from parent.
     */
    public get document(): PgslDocument {
        return this.parent.document;
    }

    static {
        // TODO: Init available attributes.
    }

    // TODO: Types-
    private readonly mAttributes: Dictionary<string, Array<any>>;

    public constructor() {
        super();

        this.mAttributes = new Dictionary<string, Array<any>>();
    }

    /**
     * Add attribute to list.
     * @param pAttributeName - Attribute name.
     * @param pParameter - Parameter of attribute.
     */
    public addAttribute(pAttributeName: string, pParameter: Array<never>): void {
        // TODO: Validate if attribute exists.
        
        // TODO: Maybe validate parameter and the types of it.

        // Validate if this attribute was already added.
        if(this.mAttributes.has(pAttributeName)){
            throw new Exception(`Attribute "${pAttributeName}" is used twice.`, this);
        }

        // Add attribute to list.
        this.mAttributes.set(pAttributeName, pParameter);
    }
}