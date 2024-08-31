import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslTypeName } from '../../type/enum/pgsl-type-name.enum';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';

/**
 * PGSL structure for a logical expression between two values.
 */
export class PgslLogicalExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslLogicalExpressionSyntaxTreeStructureData> {
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
    public constructor(pData: PgslLogicalExpressionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

        // Create list of all short circuit operations.
        const lShortCircuitOperationList: Array<PgslOperator> = [
            PgslOperator.ShortCircuitOr,
            PgslOperator.ShortCircuitAnd
        ];

        // Validate
        if (!lShortCircuitOperationList.includes(pData.operator as PgslOperator)) {
            throw new Exception(`Operator "${pData.operator}" can not used for logical expressions.`, this);
        }

        // Set data.
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
        // Set result type to left side value. Both types must be the same, so it does not matter.
        return this.mLeftExpression.resolveType;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Validate left side type.
        if (this.mLeftExpression.resolveType.typeName !== PgslTypeName.Boolean) {
            throw new Exception('Left side of logical expression needs to be a boolean', this);
        }

        // Validate right side type.
        if (this.mRightExpression.resolveType.typeName !== PgslTypeName.Boolean) {
            throw new Exception('Right side of logical expression needs to be a boolean', this);
        }
    }
}

export type PgslLogicalExpressionSyntaxTreeStructureData = {
    left: BasePgslExpressionSyntaxTree;
    operator: string;
    right: BasePgslExpressionSyntaxTree;
};