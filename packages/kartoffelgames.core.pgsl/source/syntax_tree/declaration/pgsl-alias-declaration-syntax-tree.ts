import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree.ts';
import type { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree.ts';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree.ts';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslAliasDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree {
    private readonly mName: string;
    private readonly mTypeDefinition: BasePgslTypeDefinitionSyntaxTree;

    /**
     * Alias name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Alias type definition.
     */
    public get type(): BasePgslTypeDefinitionSyntaxTree {
        return this.mTypeDefinition;
    }

    /**
     * Constructor.
     * 
     * @param pName - Alias name.
     * @param pType - Aliased type.
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pName: string, pType: BasePgslTypeDefinitionSyntaxTree, pAttributeList: PgslAttributeListSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pAttributeList, pMeta);

        // Set data.
        this.mName = pName;
        this.mTypeDefinition = pType;

        // Add child trees.
        this.appendChild(pType);
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns nothing. 
     */
    protected override onSetup(): null {
        // Add alias declaration to current scope.
        this.pushScopedValue(this.mName, this);

        return null;
    }
}