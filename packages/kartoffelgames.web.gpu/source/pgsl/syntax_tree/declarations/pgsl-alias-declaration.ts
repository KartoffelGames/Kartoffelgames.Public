import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree } from '../base-pgsl-syntax-tree';
import { PgslModuleSyntaxTree } from '../pgsl-module-syntax-tree';
import { PgslTypeDefinition } from '../type/pgsl-type-definition';

export class PgslAliasDeclaration extends BasePgslSyntaxTree {
    private mName: string;
    private mType: PgslTypeDefinition | null;


    /**
     * Get document from parent.
     */
    public get document(): PgslModuleSyntaxTree {
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