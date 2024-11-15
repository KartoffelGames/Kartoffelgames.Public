import { PgslBaseType } from '../enum/pgsl-base-type.enum';
import { BasePgslTypeDefinitionSyntaxTree, PgslTypeDefinitionAttributes } from './base-pgsl-type-definition-syntax-tree';

/**
 * Void type definition.
 */
export class PgslVoidTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<null> {
    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    protected override isExplicitCastable(_pTarget: this): boolean {
        // A void is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    protected override isImplicitCastable(_pTarget: this): boolean {
        // A void is never explicit nor implicit castable.
        return false;
    }

    /**
     * Setup syntax tree.
     * 
     * @returns setup data.
     */
    protected override onSetup(): PgslTypeDefinitionAttributes<null> {
        return {
            aliased: false,
            baseType: PgslBaseType.Void,
            data: null,
            typeAttributes: {
                composite: false,
                constructable: false,
                fixed: true,
                indexable: false,
                plain: false,
                hostSharable: false,
                storable: false
            }
        };
    }
}