import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-numeric-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree';
import { PgslTypeName } from '../../type/enum/pgsl-type-name.enum';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';

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
        // Set resolved type to left expression type.
        return this.mLeftExpression.resolveType;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Type buffer for validating the processed types.
        let lLeftValueType: BasePgslTypeDefinitionSyntaxTree;
        let lRightValueType: BasePgslTypeDefinitionSyntaxTree;

        // Validate vectors differently.
        if (this.mLeftExpression.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) {
            lLeftValueType = this.mLeftExpression.resolveType.innerType;

            // Left and right must be a vector.
            if (!(this.mRightExpression.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree)) {
                throw new Exception('Left and right side of bit expression must be the a vector type.', this);
            }
            lRightValueType = this.mRightExpression.resolveType.innerType;
        } else {
            // Expression types are the processed types.
            lLeftValueType = this.mLeftExpression.resolveType;
            lRightValueType = this.mRightExpression.resolveType;
        }

        // Validate that rigth expression of shift operator needs to be a signed integer.
        if (this.mOperator === PgslOperator.ShiftLeft || this.mOperator === PgslOperator.ShiftRight) {
            // Shift value must be numeric.
            if(lRightValueType.typeName !== PgslTypeName.UnsignedInteger) {
                throw new Exception(`Right expression of a shift operation must be a unsigned integer.`, this);
            }
        }

        // Both values need to be numeric.
        if (!(lLeftValueType instanceof PgslNumericTypeDefinitionSyntaxTree)) {
            throw new Exception(`Binary operations can only be applied to numeric values.`, this);
        }
    }
}

export type PgslBinaryExpressionSyntaxTreeStructureData = {
    left: BasePgslExpressionSyntaxTree;
    operator: string;
    right: BasePgslExpressionSyntaxTree;
};