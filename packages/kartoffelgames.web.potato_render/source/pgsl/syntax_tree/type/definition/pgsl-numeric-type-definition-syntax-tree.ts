import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { PgslBaseTypeName } from '../enum/pgsl-base-type-name.enum';
import { PgslNumericTypeName } from '../enum/pgsl-numeric-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree, PgslTypeDefinitionAttributes } from './base-pgsl-type-definition-syntax-tree';

/**
 * Numeric type definition.
 */
export class PgslNumericTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    private readonly mNumericType: PgslNumericTypeName;

    /**
     * Explicit numeric type.
     */
    public get numericType(): PgslNumericTypeName {
        return this.mNumericType;
    }

    /**
     * Constructor.
     * 
     * @param pNumericType - Contrete numeric type.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pNumericType: PgslNumericTypeName, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        this.mNumericType = pNumericType;
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both types describes the same type.
     */
    public override equals(pTarget: BasePgslTypeDefinitionSyntaxTree): pTarget is this {
        // Base equals.
        if (!super.equals(pTarget)) {
            return false;
        }

        return this.mNumericType !== pTarget.mNumericType;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    protected override isExplicitCastable(_pTarget: this): boolean {
        // All numberic values are explicit castable.
        return true;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected override isImplicitCastable(pTarget: this): boolean {
        // Abstract float is allways castable.
        if (pTarget.mNumericType === PgslNumericTypeName.AbstractFloat) {
            return true;
        }

        // Abstract int is allways castable.
        if (pTarget.mNumericType === PgslNumericTypeName.AbstractInteger) {
            return true;
        }

        return true;
    }

    /**
     * Setup syntax tree.
     * 
     * @returns setup data.
     */
    protected override onSetup(): PgslTypeDefinitionAttributes<null> {
        return {
            aliased: false,
            baseType: PgslBaseTypeName.Numberic,
            data: null,
            typeAttributes: {
                composite: false,
                constructable: true,
                fixed: true,
                indexable: false,
                plain: true,
                hostSharable: true,
                storable: true
            }
        };
    }
}