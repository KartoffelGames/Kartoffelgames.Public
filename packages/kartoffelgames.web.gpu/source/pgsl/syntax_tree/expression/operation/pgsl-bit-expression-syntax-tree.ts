import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-numeric-type-definition-syntax-tree';

export class PgslBinaryExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslBinaryExpressionSyntaxTreeStructureData> {
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
    public constructor(pData: PgslBinaryExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Create list of all bit operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.BinaryOr,
            PgslOperator.BinaryAnd,
            PgslOperator.BinaryXor,
            PgslOperator.ShiftLeft,
            PgslOperator.ShiftRight
        ];

        // Validate.
        if (!lComparisonList.includes(pData.operator as PgslOperator)) {
            throw new Exception(`Operator "${pData.operator}" can not used for bit operations.`, this);
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
        // TODO: Vectors are also allowed...

        // Set resolved type to left expression type.
        return this.mLeftExpression.resolveType;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Validate that rigth expression of shift operator needs to be a signed integer.
        //if ((this.mOperator === PgslOperator.ShiftLeft || this.mOperator === PgslOperator.ShiftRight) && this.mRightExpression.resolveType.type !== Integer) {
        //    throw new Exception(`Right expression of a shift operation must be a integer.`, this);
        //}

        // Both values need to be numeric.
        if (!(this.mLeftExpression.resolveType instanceof PgslNumericTypeDefinitionSyntaxTree)) {
            throw new Exception(`Binary operations can only be applied to numeric values.`, this);
        }
    }
}

export type PgslBinaryExpressionSyntaxTreeStructureData = {
    left: BasePgslExpressionSyntaxTree;
    operator: string;
    right: BasePgslExpressionSyntaxTree;
};