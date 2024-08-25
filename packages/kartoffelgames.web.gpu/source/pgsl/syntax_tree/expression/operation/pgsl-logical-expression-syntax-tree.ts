import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum';
import { PgslValueType } from '../../../enum/pgsl-value-type.enum';
import { PgslTypeDefinitionSyntaxTree } from '../../general/pgsl-type-definition-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';

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
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslLogicalExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

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
    protected onConstantStateSet(): boolean {
        // Set constant state when both expressions are constants.
        return this.mLeftExpression.isConstant && this.mRightExpression.isConstant;
    }

    /**
     * On type resolve of expression
     */
    protected onResolveType(): PgslTypeDefinitionSyntaxTree {
        // TODO: Bitwise on vector changes type to vector<numeric>

        // Set result type to left side value. Both types must be the same, so it does not matter.
        return this.mLeftExpression.resolveType;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Allow vectors. For Bitwise or and Bitwise and

        // Validate left side type.
        if (this.mLeftExpression.resolveType.valueType !== PgslValueType.Boolean) {
            throw new Exception('Left side of logical expression needs to be a boolean', this);
        }

        // Validate right side type.
        if (this.mRightExpression.resolveType.valueType !== PgslValueType.Boolean) {
            throw new Exception('Right side of logical expression needs to be a boolean', this);
        }
    }
}

export type PgslLogicalExpressionSyntaxTreeStructureData = {
    left: BasePgslExpressionSyntaxTree;
    operator: string;
    right: BasePgslExpressionSyntaxTree;
};