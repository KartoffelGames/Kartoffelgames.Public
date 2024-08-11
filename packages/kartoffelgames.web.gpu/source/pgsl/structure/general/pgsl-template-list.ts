import { BasePgslStructure } from '../../base-pgsl-structure';
import { PgslDocument } from '../../pgsl-document';

export class PgslTemplateList extends BasePgslStructure {
    /**
     * Get document from parent.
     */
    public get document(): PgslDocument {
        return this.parent.document;
    }
}