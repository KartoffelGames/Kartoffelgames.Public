import { Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree.ts';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree.ts';
import type { PgslStructPropertyDeclarationSyntaxTree } from './pgsl-struct-property-declaration-syntax-tree.ts';

/**
 * PGSL syntax tree for a struct declaration.
 */
export class PgslStructDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<null> {
    private readonly mName: string;
    private readonly mProperties: Array<PgslStructPropertyDeclarationSyntaxTree>;

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Variable name.
     */
    public get properties(): Array<PgslStructPropertyDeclarationSyntaxTree> {
        return this.mProperties;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pName: string, pProperties: Array<PgslStructPropertyDeclarationSyntaxTree>, pAttributes: PgslAttributeListSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pAttributes, pMeta);

        // Set data.
        this.mName = pName;
        this.mProperties = pProperties;

        // Add all properties as child.
        this.appendChild(...pProperties);
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns nothing. 
     */
    protected override onSetup(): null {
        // Add struct declaration to current scope.
        this.pushScopedValue(this.mName, this);

        return null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Type validation is in property syntax tree.

        // Only types with fixed footprints.
        // Only last property is allowed to be variable but then the struct is no longer fixed.
        for (let lIndex: number = 0; lIndex < this.mProperties.length; lIndex++) {
            // Skip last property. 
            if (lIndex === (this.mProperties.length - 1)) {
                break;
            }

            // Validate if properties dont have fixed length.
            if (!this.mProperties[lIndex].type.isFixed) {
                throw new Exception('Only the last property of a struct can have a variable length.', this);
            }
        }
    }
}