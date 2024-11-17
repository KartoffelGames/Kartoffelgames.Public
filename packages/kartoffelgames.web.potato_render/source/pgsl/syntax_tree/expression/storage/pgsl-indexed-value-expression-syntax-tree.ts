import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslArrayTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-array-type-definition-syntax-tree';
import { PgslMatrixTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-matrix-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-numeric-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree';
import { PgslBaseType } from '../../type/enum/pgsl-base-type.enum';
import { PgslNumericTypeName } from '../../type/enum/pgsl-numeric-type-name.enum';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeSetupData } from '../base-pgsl-expression-syntax-tree';

/**
 * PGSL structure holding a variable with index expression.
 */
export class PgslIndexedValueExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
    private readonly mIndex: BasePgslExpressionSyntaxTree;
    private readonly mValue: BasePgslExpressionSyntaxTree;

    /**
     * Index expression of variable index expression.
     */
    public get index(): BasePgslExpressionSyntaxTree {
        return this.mIndex;
    }

    /**
     * Value reference.
     */
    public get value(): BasePgslExpressionSyntaxTree {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pValue: BasePgslExpressionSyntaxTree, pIndex: BasePgslExpressionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mIndex = pIndex;
        this.mValue = pValue;
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data.
     */
    protected override onSetup(): PgslExpressionSyntaxTreeSetupData {
        const lResolveType: BasePgslTypeDefinitionSyntaxTree = (() => {
            switch (true) {
                case this.mValue.resolveType instanceof PgslArrayTypeDefinitionSyntaxTree: {
                    return this.mValue.resolveType.innerType;
                }

                case this.mValue.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree: {
                    return this.mValue.resolveType.innerType;
                }

                case this.mValue.resolveType instanceof PgslMatrixTypeDefinitionSyntaxTree: {
                    return this.mValue.resolveType.vectorType;
                }
            }

            // This should never be called.
            throw new Exception('Type does not support a index signature', this);
        })();

        return {
            expression: {
                isFixed: this.mIndex.isCreationFixed && this.mValue.isCreationFixed,
                isStorage: true,
                resolveType: lResolveType,
                isConstant: this.mIndex.isConstant && this.mValue.isConstant
            },
            data: null
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Type needs to be a composite.
        if (!this.mValue.resolveType.isIndexable) {
            throw new Exception(`Value of index expression needs to be a indexable composite value.`, this);
        }

        // Value needs to be a unsigned numeric value.
        if (this.mIndex.resolveType.baseType !== PgslBaseType.Numberic) {
            if ((<PgslNumericTypeDefinitionSyntaxTree>this.mIndex.resolveType).numericType !== PgslNumericTypeName.UnsignedInteger) {
                throw new Exception(`Index needs to be a unsigned numeric value.`, this);
            }
        }
    }
}
