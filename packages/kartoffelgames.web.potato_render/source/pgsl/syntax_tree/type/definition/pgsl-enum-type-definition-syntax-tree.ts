import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { PgslEnumDeclarationSyntaxTree } from '../../declaration/pgsl-enum-declaration-syntax-tree';
import { PgslBaseTypeName } from '../enum/pgsl-base-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree, PgslTypeDefinitionAttributes } from './base-pgsl-type-definition-syntax-tree';

/**
 * Enum type definition that aliases a plain type.
 */
export class PgslEnumTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    private readonly mEnumName: string;

    /**
     * Constructor.
     * 
     * @param pEnumName - Enum name.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pEnumName: string, pMeta: BasePgslSyntaxTreeMeta) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pMeta);

        // Set data.
        this.mEnumName = pEnumName;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected override isExplicitCastable(pTarget: this): boolean {
        // A enum in mirrows aliased.
        return this.aliasedType.explicitCastable(pTarget);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected override isImplicitCastable(pTarget: this): boolean {
        // A enum in mirrows aliased.
        return this.aliasedType.implicitCastable(pTarget);
    }

    /**
     * Setup syntax tree.
     * 
     * @returns setup data.
     */
    protected override onSetup(): PgslTypeDefinitionAttributes<null> {
        // Read aliased type.
        const lEnumDefinition: PgslEnumDeclarationSyntaxTree | null = this.document.resolveEnum(this.mEnumName);
        if (!lEnumDefinition) {
            throw new Exception(`Enum "${this.mEnumName}" not defined.`, this);
        }

        // Save aliased type for easy access.
        const lAliasType: BasePgslTypeDefinitionSyntaxTree = lEnumDefinition.type;

        return {
            aliased: lAliasType,
            baseType: PgslBaseTypeName.Enum,
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