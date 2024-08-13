import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslStructure } from '../../base-pgsl-structure';
import { PgslDocument } from '../../pgsl-document';

export class PgslEnumDeclaration extends BasePgslStructure {
    private mName: string;
    private readonly mValues: Dictionary<string, string | number>;

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
     * Constructor.
     */
    public constructor() {
        super();

        this.mValues = new Dictionary<string, string | number>();
        this.mName = '';
    }

    public addValue(pName: string, pValue?: string | number): void {
        if (this.mValues.has(pName)) {
            throw new Exception(`Value "${pName}" was already added to enum "${this.mName}"`, this);
        }

        this.mValues.set(pName, pValue ?? this.mValues.size);
    }
}