import { Exception } from '@kartoffelgames/core';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslArrayTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-array-type-definition-syntax-tree';
import { PgslMatrixTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-matrix-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree';
import { PgslTypeName } from '../../type/enum/pgsl-type-name.enum';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';

/**
 * PGSL structure holding a variable with index expression.
 */
export class PgslIndexedValueExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslIndexedValueExpressionSyntaxTreeStructureData> {
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
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslIndexedValueExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mIndex = pData.index;
        this.mValue = pData.value;
    }

    /**
     * On constant state request.
     */
    protected determinateIsConstant(): boolean {
        // Set constant state when both value and index are constants.
        return this.mIndex.isConstant && this.mValue.isConstant;
    }

    /**
     * On creation fixed state request.
     */
    protected override determinateIsCreationFixed(): boolean {
        // Expression is constant when variable and index is a constant.
        return this.mIndex.isCreationFixed && this.mValue.isCreationFixed;
    }

    /**
     * On is storage set.
     */
    protected determinateIsStorage(): boolean {
        return true;
    }

    /**
     * On type resolve of expression
     */
    protected determinateResolveType(): BasePgslTypeDefinitionSyntaxTree {
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
        if (this.mIndex.resolveType.typeName !== PgslTypeName.Integer) {
            throw new Exception(`Index needs to be a unsigned numeric value.`, this);
        }
    }
}

type PgslIndexedValueExpressionSyntaxTreeStructureData = {
    value: BasePgslExpressionSyntaxTree;
    index: BasePgslExpressionSyntaxTree;
};