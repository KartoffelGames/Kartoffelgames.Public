import { PgslValueType } from '../../../enum/pgsl-value-type.enum';
import { PgslSyntaxTreeInitData } from '../../base-pgsl-syntax-tree';
import { PgslTypeDefinitionSyntaxTree } from '../../general/pgsl-type-definition-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';

/**
 * PGSL structure holding a variable with index expression.
 */
export class PgslIndexedValueExpressionSyntaxTree extends BasePgslSingleValueExpressionSyntaxTree<PgslIndexedValueExpressionSyntaxTreeStructureData> {
    private readonly mIndex: BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>;
    private readonly mValue: BasePgslSingleValueExpressionSyntaxTree<PgslSyntaxTreeInitData>;

    /**
     * Index expression of variable index expression.
     */
    public get index(): BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> {
        return this.mIndex;
    }

    /**
     * Value reference.
     */
    public get value(): BasePgslSingleValueExpressionSyntaxTree<PgslSyntaxTreeInitData> {
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
    protected onConstantStateSet(): boolean {
        // Set constant state when both value and index are constants.
        return this.mIndex.isConstant && this.mValue.isConstant;
    }

    /**
     * On type resolve of expression
     */
    protected onResolveType(): PgslTypeDefinitionSyntaxTree {
        // Type depends on value type.
        switch (this.mValue.resolveType.valueType) {
            case PgslValueType.Array: {
                break;
            }
            case PgslValueType.Vector: {
                break;
            }
            case PgslValueType.Matrix: {
                break;
            }
        }
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Validate value to be a arraylike and index to be a number.

        switch (this.mValue.resolveType.valueType) {
            case PgslValueType.Array: {
                break;
            }
            case PgslValueType.Vector: {
                break;
            }
            case PgslValueType.Matrix: {
                break;
            }
        }
    }
}

type PgslIndexedValueExpressionSyntaxTreeStructureData = {
    value: BasePgslSingleValueExpressionSyntaxTree<PgslSyntaxTreeInitData>;
    index: BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>;
};