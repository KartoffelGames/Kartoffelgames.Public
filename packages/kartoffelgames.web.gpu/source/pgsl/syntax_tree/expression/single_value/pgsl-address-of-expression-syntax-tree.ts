import { Exception } from '@kartoffelgames/core';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslPointerTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-pointer-type-definition-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree';
import { PgslValueDecompositionExpressionSyntaxTree } from '../storage/pgsl-value-decomposition-expression-syntax-tree';
import { PgslIndexedValueExpressionSyntaxTree } from '../storage/pgsl-indexed-value-expression-syntax-tree';
import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';

/**
 * PGSL structure holding a variable name used to get the address.
 */
export class PgslAddressOfExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslAddressOfExpressionSyntaxTreeStructureData> {
    private readonly mVariable: BasePgslExpressionSyntaxTree;

    /**
     * Variable reference.
     */
    public get variable(): BasePgslExpressionSyntaxTree {
        return this.mVariable;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslAddressOfExpressionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

        // Set data.
        this.mVariable = pData.variable;
    }

    /**
     * On constant state request.
     */
    protected determinateIsConstant(): boolean {
        // A address is allways a constant.
        return true;
    }

    /**
     * On creation fixed state request.
     */
    protected override determinateIsCreationFixed(): boolean {
        // A address is allways a creation fixed value.
        return true;
    }

    /**
     * On is storage set.
     */
    protected determinateIsStorage(): boolean {
        return false;
    }

    /**
     * On type resolve of expression
     */
    protected determinateResolveType(): BasePgslTypeDefinitionSyntaxTree {
        // Create type declaration.
        return new PgslPointerTypeDefinitionSyntaxTree({
            referencedType: this.mVariable.resolveType
        }, this.meta).setParent(this).validateIntegrity();
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Type of expression needs to be storable.
        if (!this.mVariable.isStorage) {
            throw new Exception(`Target of address needs to a stored value`, this);
        }

        // Type of expression needs to be storable.
        if (!this.mVariable.resolveType.isStorable) {
            throw new Exception(`Target of address needs to storable`, this);
        }

        // No vector item.
        const lParent: BasePgslExpressionSyntaxTree = this.mVariable.parent as BasePgslExpressionSyntaxTree;
        if (lParent.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) {
            // Single swizzle name.
            if (this.mVariable instanceof PgslValueDecompositionExpressionSyntaxTree && this.mVariable.property.length === 1) {
                throw new Exception(`AddressOf operator can not be applied to a vector item.`, this);
            }

            // Reference by index.
            if (this.mVariable instanceof PgslIndexedValueExpressionSyntaxTree) {
                throw new Exception(`AddressOf operator can not be applied to a vector item.`, this);
            }
        }
    }
}

type PgslAddressOfExpressionSyntaxTreeStructureData = {
    variable: BasePgslExpressionSyntaxTree;
};