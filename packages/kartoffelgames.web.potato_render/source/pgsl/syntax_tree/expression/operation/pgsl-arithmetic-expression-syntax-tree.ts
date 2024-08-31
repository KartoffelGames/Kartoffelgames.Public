import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-numeric-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree';
import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';

export class PgslArithmeticExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslArithmeticExpressionSyntaxTreeStructureData> {
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
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslArithmeticExpressionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

        // Create list of all arithmetic operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.Plus,
            PgslOperator.Minus,
            PgslOperator.Multiply,
            PgslOperator.Divide,
            PgslOperator.Modulo
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
        // Types are the same.
        return this.mLeftExpression.resolveType;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Also matrix calculations :(
        // TODO: And Mixed vector calculation...

        // Left and right need to be same type.
        if (!this.mLeftExpression.resolveType.equals(this.mRightExpression.resolveType)) {
            throw new Exception('Left and right side of arithmetic expression must be the same type.', this);
        }

        // Validate vector inner values. 
        if (this.mLeftExpression.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) {
            // Validate left side vector type. Right ist the same type.
            if (!(this.mLeftExpression.resolveType.innerType instanceof PgslNumericTypeDefinitionSyntaxTree)) {
                throw new Exception('Left and right side of arithmetic expression must be a numeric vector value', this);
            }
        } else {
            // Validate left side type. Right ist the same type.
            if (!(this.mLeftExpression.resolveType instanceof PgslNumericTypeDefinitionSyntaxTree)) {
                throw new Exception('Left and right side of arithmetic expression must be a numeric value', this);
            }
        }
    }
}

export type PgslArithmeticExpressionSyntaxTreeStructureData = {
    left: BasePgslExpressionSyntaxTree;
    operator: string;
    right: BasePgslExpressionSyntaxTree;
};