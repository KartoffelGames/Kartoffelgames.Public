import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslPointerTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-pointer-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeSetupData } from '../base-pgsl-expression-syntax-tree';
import { PgslIndexedValueExpressionSyntaxTree } from '../storage/pgsl-indexed-value-expression-syntax-tree';
import { PgslValueDecompositionExpressionSyntaxTree } from '../storage/pgsl-value-decomposition-expression-syntax-tree';

/**
 * PGSL structure holding a variable name used to get the address.
 */
export class PgslAddressOfExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
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
    public constructor(pVariable: BasePgslExpressionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mVariable = pVariable;
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data.
     */
    protected override onSetup(): PgslExpressionSyntaxTreeSetupData<unknown> {
        const lResolveType: BasePgslTypeDefinitionSyntaxTree = new PgslPointerTypeDefinitionSyntaxTree(this.mVariable.resolveType, {
            buildIn: false,
            range: [
                this.meta.position.start.line,
                this.meta.position.start.column,
                this.meta.position.end.line,
                this.meta.position.end.column,
            ]
        });

        return {
            expression: {
                isFixed: true,
                isStorage: false,
                resolveType: lResolveType,
                isConstant: true
            },
            data: null
        };
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