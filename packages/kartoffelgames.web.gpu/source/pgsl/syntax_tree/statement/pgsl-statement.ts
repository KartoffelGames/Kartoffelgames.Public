import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree } from '../base-pgsl-syntax-tree';
import { PgslModuleSyntaxTree } from '../pgsl-module-syntax-tree';

export abstract class PgslStatement extends BasePgslSyntaxTree {
    /**
     * Get document from parent.
     */
    public get document(): PgslModuleSyntaxTree {
        if (!this.parent) {
            throw new Exception('PGSL-Structure not attached to any document', this);
        }
        
        return this.parent.document;
    }
}