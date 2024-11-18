import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { PgslBaseType } from '../enum/pgsl-base-type.enum';
import { PgslVectorTypeName } from '../enum/pgsl-vector-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree, PgslTypeDefinitionAttributes } from './base-pgsl-type-definition-syntax-tree';

/**
 * Vector type definition.
 */
export class PgslVectorTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    private readonly mInnerType: BasePgslTypeDefinitionSyntaxTree;
    private readonly mVectorType: PgslVectorTypeName;

    /**
     * Inner type of vector.
     */
    public get innerType(): BasePgslTypeDefinitionSyntaxTree {
        return this.mInnerType;
    }

    /**
     * Vector dimension.
     */
    public get vectorDimension(): PgslVectorTypeName {
        return this.mVectorType;
    }

    /**
     * Constructor.
     * 
     * @param pVectorType - Concreate vector dimension.
     * @param pInnerType - Inner type of vector.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pVectorType: PgslVectorTypeName, pInnerType: BasePgslTypeDefinitionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mInnerType = pInnerType;
        this.mVectorType = pVectorType;

        // Append inner type to child list.
        this.appendChild(this.mInnerType);
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected override isExplicitCastable(pTarget: this): boolean {
        // It is when inner types are.
        return this.mInnerType.explicitCastable(pTarget.mInnerType);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected override isImplicitCastable(pTarget: this): boolean {
        // It is when inner types are.
        return this.mInnerType.implicitCastable(pTarget.mInnerType);
    }

    /**
     * Setup syntax tree.
     * 
     * @returns setup data.
     */
    protected override onSetup(): PgslTypeDefinitionAttributes<null> {
        return {
            aliased: false,
            baseType: PgslBaseType.Vector,
            data: null,
            typeAttributes: {
                composite: true,
                constructable: this.mInnerType.isConstructable,
                fixed: this.mInnerType.isFixed,
                indexable: true,
                plain: this.mInnerType.isPlainType,
                hostSharable: this.mInnerType.isHostShareable,
                storable: this.mInnerType.isStorable
            }
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Must be scalar.
        if (this.mInnerType.baseType !== PgslBaseType.Numberic && this.mInnerType.baseType !== PgslBaseType.Boolean) {
            throw new Exception('Vector type must be a scalar value', this);
        }
    }
}

export type PgslVectorTypeDefinitionSyntaxTreeStructureData = {
    typeName: PgslVectorTypeName;
    innerType: BasePgslTypeDefinitionSyntaxTree;
};