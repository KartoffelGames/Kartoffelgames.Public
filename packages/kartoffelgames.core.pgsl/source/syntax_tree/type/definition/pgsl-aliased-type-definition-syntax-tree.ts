import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { PgslAliasDeclarationSyntaxTree } from '../../declaration/pgsl-alias-declaration-syntax-tree.ts';
import { PgslBaseTypeName } from '../enum/pgsl-base-type-name.enum.ts';
import { BasePgslTypeDefinitionSyntaxTree, type PgslTypeDefinitionAttributes } from './base-pgsl-type-definition-syntax-tree.ts';

/**
 * Aliased type definition that aliases a plain type.
 */
export class PgslAliasedTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    private readonly mAliasName: string;

    /**
     * Constructor.
     * 
     * @param pAliasName - Alias name.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pAliasName: string, pMeta: BasePgslSyntaxTreeMeta) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pMeta);

        // Set data.
        this.mAliasName = pAliasName;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected override isExplicitCastable(pTarget: this): boolean {
        // Mirrows aliased.
        return this.aliasedType.explicitCastable(pTarget);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected override isImplicitCastable(pTarget: this): boolean {
        // Mirrows aliased.
        return this.aliasedType.implicitCastable(pTarget);
    }

    /**
     * Setup syntax tree.
     * 
     * @returns setup data.
     */
    protected override onSetup(): PgslTypeDefinitionAttributes<null> {
        // Read aliased type.
        const lAliasedDefinition: PgslAliasDeclarationSyntaxTree = this.document.resolveAlias(this.mAliasName);

        // Save aliased type for easy access.
        const lAliasType: BasePgslTypeDefinitionSyntaxTree = lAliasedDefinition.type;

        return {
            aliased: lAliasType,
            baseType: PgslBaseTypeName.Alias,
            data: null,
            typeAttributes: {
                composite: lAliasType.isComposite,
                constructable: lAliasType.isConstructable,
                fixed: lAliasType.isFixed,
                indexable: lAliasType.isIndexable,
                plain: lAliasType.isPlainType,
                hostSharable: lAliasType.isHostShareable,
                storable: lAliasType.isStorable
            }
        };
    }
}