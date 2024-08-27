import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/base-pgsl-type-definition-syntax-tree';
import { PgslBooleanTypeDefinitionSyntaxTree } from '../../type/pgsl-boolean-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from '../../type/pgsl-numeric-type-definition-syntax-tree';
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
     * On type resolve of expression
     */
    protected determinateResolveType(): BasePgslTypeDefinitionSyntaxTree {
        // TODO: When it is a vector, is is vector<boolean>

        // Create type declaration for a boolean.
        const lTypeDeclaration: PgslBooleanTypeDefinitionSyntaxTree = new PgslBooleanTypeDefinitionSyntaxTree({}, 0, 0, 0, 0);

        // Set parent to this tree.
        lTypeDeclaration.setParent(this);

        // Validate type.
        lTypeDeclaration.validateIntegrity();

        // Set resolve type.
        return lTypeDeclaration;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: This shit allows vectors as well. WTF.

        // Comparison needs to be the same type.
        if (!this.mLeftExpression.resolveType.equals(this.mRightExpression.resolveType)) {
            throw new Exception(`Comparison can only be between values of the same type.`, this);
        }

        const lBooleanComparisonList: Array<PgslOperator> = [
            PgslOperator.Equal,
            PgslOperator.NotEqual
        ];

        // Validate boolean compare.
        if (this.mLeftExpression.resolveType instanceof PgslBooleanTypeDefinitionSyntaxTree && !lBooleanComparisonList.includes(this.mOperator)) {
            throw new Exception(`Boolean can only be compares with "NotEqual" or "Equal"`, this);
        }

        // Both values need to be numeric.
        if (!(this.mLeftExpression.resolveType instanceof PgslNumericTypeDefinitionSyntaxTree)) {
            throw new Exception(`None numeric values can't be compared`, this);
        }
    }
}

export type PgslComparisonExpressionSyntaxTreeStructureData = {
    left: BasePgslExpressionSyntaxTree;
    operator: string;
    right: BasePgslExpressionSyntaxTree;
};