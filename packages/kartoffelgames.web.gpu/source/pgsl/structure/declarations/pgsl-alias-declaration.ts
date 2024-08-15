import { Exception } from '@kartoffelgames/core';
import { BasePgslStructure } from '../../base-pgsl-structure';
import { PgslDocument } from '../../pgsl-document';
import { PgslTypeDefinition } from '../type/pgsl-type-definition';

export class PgslAliasDeclaration extends BasePgslStructure {
    private mName: string;
    private mType: PgslTypeDefinition | null;


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
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    } set name(pVariableName: string) {
        this.mName = pVariableName;
    }

    /**
     * Variable name.
     */
    public get type(): PgslTypeDefinition | null {
        return this.mType;
    } set type(pType: PgslTypeDefinition | null) {
        this.mType = pType;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mName = '';
        this.mType = null;
    }
}