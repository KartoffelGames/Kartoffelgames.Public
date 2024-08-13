import { Exception, List } from '@kartoffelgames/core';
import { BasePgslStructure } from '../../base-pgsl-structure';
import { PgslDocument } from '../../pgsl-document';
import { PgslExpression } from '../expression/pgsl-expression';
import { PgslTypeDefinition } from '../type/pgsl-type-definition';

/**
 * Template list parameter.
 */
export class PgslTemplateList extends BasePgslStructure {
    private readonly mItems: List<PgslTypeDefinition | PgslExpression>;

    /**
     * Get document from parent.
     */
    public get document(): PgslDocument {
        if (!this.parent) {
            throw new Exception('PGSL-Structure not attached to any document', this);
        }

        return this.parent.document;
    }

    /**
     * Parameter list.
     */
    public get items(): Array<PgslTypeDefinition | PgslExpression> {
        return this.mItems;
    }

    /**
     * List size.
     */
    public get size(): number {
        return this.mItems.length;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mItems = new List<PgslTypeDefinition | PgslExpression>();
    }

    /**
     * Set new item of template list.
     * 
     * @param pItem - Item.
     */
    public setItem(pItems: PgslTypeDefinition | PgslExpression): void {
        // Set items.
        this.mItems.push(pItems);
    }
}