import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslBooleanTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-boolean-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-numeric-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree';
import { PgslTypeName } from '../../type/enum/pgsl-type-name.enum';
import { PgslVectorTypeName } from '../../type/enum/pgsl-vector-type-name.enum';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';

/**
 * PGSL structure for a comparison expression between two values.
 */
export class PgslComparisonExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslComparisonExpressionSyntaxTreeStructureData> {
    private readonly mLeftExpression: BasePgslExpressionSyntaxTree;
    private readonly mOperator: PgslOperator;
    private readonly mRightExpression: BasePgslExpressionSyntaxTree;

    /**
     * Left expression reference.
     */
    public get leftExpression(): BasePgslExpressionSyntaxTree {
        return this.mLeftExpression;
    }

    /**
     * Expression operator.
     */
    public get operator(): PgslOperator {
        return this.mOperator;
    }

    /**
     * Right expression reference.
     */
    public get rightExpression(): BasePgslExpressionSyntaxTree {
        return this.mRightExpression;
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
    public constructor(pData: PgslComparisonExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Create list of all comparison operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.Equal,
            PgslOperator.NotEqual,
            PgslOperator.LowerThan,
            PgslOperator.LowerThanEqual,
            PgslOperator.GreaterThan,
            PgslOperator.GreaterThanEqual
        ];

        // Validate
        if (!lComparisonList.includes(pData.operator as PgslOperator)) {
            throw new Exception(`Operator "${pData.operator}" can not used for comparisons.`, this);
        }

        this.mLeftExpression = pData.left;
        this.mOperator = EnumUtil.cast(PgslOperator, pData.operator)!;
        this.mRightExpression = pData.right;
    }

    /**
     * On constant state request.
     */
    protected determinateIsConstant(): boolean {
        // Set constant state when both expressions are constants.
        return this.mLeftExpression.isConstant && this.mRightExpression.isConstant;
    }

    /**
     * On creation fixed state request.
     */
    protected override determinateIsCreationFixed(): boolean {
        // Set creation fixed state when both expressions are creation fixed.
        return this.mLeftExpression.isCreationFixed && this.mRightExpression.isCreationFixed;
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
        const lBooleanDefinition: PgslBooleanTypeDefinitionSyntaxTree = new PgslBooleanTypeDefinitionSyntaxTree({}, 0, 0, 0, 0).setParent(this).validateIntegrity();

        // Wrap boolean into a vector when it is a vector expression.
        if (this.mLeftExpression.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) {
            return new PgslVectorTypeDefinitionSyntaxTree({
                innerType: lBooleanDefinition,
                typeName: this.mLeftExpression.resolveType.typeName as unknown as PgslVectorTypeName
            }, 0, 0, 0, 0).setParent(this).validateIntegrity();
        }

        return lBooleanDefinition;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Comparison needs to be the same type.
        if (!this.mLeftExpression.resolveType.equals(this.mRightExpression.resolveType)) {
            throw new Exception(`Comparison can only be between values of the same type.`, this);
        }

        // Type buffer for validating the processed types.
        let lValueType: BasePgslTypeDefinitionSyntaxTree;

        // Validate vectors differently.
        if (this.mLeftExpression.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) {
            lValueType = this.mLeftExpression.resolveType.innerType;
        } else {
            lValueType = this.mLeftExpression.resolveType;
        }

        // Both values need to be numeric or boolean.
        if (!(lValueType instanceof PgslNumericTypeDefinitionSyntaxTree) || lValueType.typeName !== PgslTypeName.Boolean) {
            throw new Exception(`None numeric or boolean values can't be compared`, this);
        }

        // Validate boolean compare.
        if (![PgslOperator.Equal, PgslOperator.NotEqual].includes(this.mOperator)) {
            if (lValueType.typeName === PgslTypeName.Boolean) {
                throw new Exception(`Boolean can only be compares with "NotEqual" or "Equal"`, this);
            }
        }
    }
}

export type PgslComparisonExpressionSyntaxTreeStructureData = {
    left: BasePgslExpressionSyntaxTree;
    operator: string;
    right: BasePgslExpressionSyntaxTree;
};