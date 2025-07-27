import { Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree.ts';
import type { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree.ts';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree.ts';

/**
 * PGSL syntax tree for a struct property declaration.
 */
export class PgslStructPropertyDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree {
    private readonly mName: string;
    private readonly mTypeDefinition: BasePgslTypeDefinitionSyntaxTree;

    /**
     * Property name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Property type.
     */
    public get type(): BasePgslTypeDefinitionSyntaxTree {
        return this.mTypeDefinition;
    }

    /**
     * Constructor.
     * 
     * @param pName - Property name.
     * @param pType - Property type.
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pName: string, pType: BasePgslTypeDefinitionSyntaxTree, pAttributes: PgslAttributeListSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pAttributes, pMeta);

        // Set data.
        this.mName = pName;
        this.mTypeDefinition = pType;

        // Add type defintion as child tree.
        this.appendChild(pType);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Supports only plain types.
        if (!this.mTypeDefinition.isPlainType) {
            throw new Exception('Structure properties can only store plain types.', this);
        }
    }
}