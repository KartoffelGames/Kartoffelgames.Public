import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree.ts';
import { PgslBaseTypeName } from '../enum/pgsl-base-type-name.enum.ts';
import { BasePgslTypeDefinitionSyntaxTree, type PgslTypeDefinitionAttributes } from './base-pgsl-type-definition-syntax-tree.ts';

/**
 * Array type definition.
 */
export class PgslArrayTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    private readonly mInnerType: BasePgslTypeDefinitionSyntaxTree;
    private readonly mLengthExpression: BasePgslExpressionSyntaxTree | null;

    /**
     * Inner type of array.
     */
    public get innerType(): BasePgslTypeDefinitionSyntaxTree {
        return this.mInnerType;
    }

    /**
     * Length expression of array.
     */
    public get length(): BasePgslExpressionSyntaxTree | null {
        return this.mLengthExpression;
    }

    /**
     * Constructor.
     * 
     * @param pType - Inner array type.
     * @param pLengthExpression - Length expression.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pType: BasePgslTypeDefinitionSyntaxTree, pLengthExpression: BasePgslExpressionSyntaxTree | null, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        this.mLengthExpression = pLengthExpression ?? null;
        this.mInnerType = pType;

        // Append inner type to child list.
        this.appendChild(this.mInnerType);
        if (this.mLengthExpression) {
            this.appendChild(this.mLengthExpression);
        }
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    protected override isExplicitCastable(_pTarget: this): boolean {
        // Never castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected override isImplicitCastable(pTarget: this): boolean {
        // Must be fixed.
        if (!this.isFixed) {
            return false;
        }

        // When inner types are implicit castable.
        return this.mInnerType.implicitCastable(pTarget.innerType);
    }

    /**
     * Setup syntax tree.
     * 
     * @returns setup data.
     */
    protected override onSetup(): PgslTypeDefinitionAttributes<null> {
        const lIsFixed: boolean = (!this.mLengthExpression) ? false : this.mLengthExpression.isConstant;
        const lIsConstructable: boolean = (!lIsFixed) ? false : this.mInnerType.isConstructable;

        return {
            aliased: false,
            baseType: PgslBaseTypeName.Array,
            data: null,
            typeAttributes: {
                composite: false,
                constructable: lIsConstructable,
                fixed: lIsFixed,
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
        // TODO: Fixed length from const expressions are only valid on workgroup variables. ??? How.
        //       Do we need to split expressions into isConstant and isCompileConstant or so????
    }
}

export type PgslArrayTypeDefinitionSyntaxTreeStructureData = {
    type: BasePgslTypeDefinitionSyntaxTree;
    lengthExpression?: BasePgslExpressionSyntaxTree;
};