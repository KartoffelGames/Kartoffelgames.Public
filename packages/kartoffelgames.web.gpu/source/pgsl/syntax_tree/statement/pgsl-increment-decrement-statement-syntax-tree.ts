import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../enum/pgsl-operator.enum';
import { BasePgslSingleValueExpressionSyntaxTree } from '../expression/single_value/base-pgsl-single-value-expression-syntax-tree';
import { PgslIndexedValueExpressionSyntaxTree } from '../expression/single_value/pgsl-indexed-value-expression-syntax-tree';
import { PgslValueDecompositionExpressionSyntaxTree } from '../expression/single_value/pgsl-value-decomposition-expression-syntax-tree';
import { PgslVariableNameExpressionSyntaxTree } from '../expression/single_value/pgsl-variable-name-expression-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a increment or decrement statement.
 */
export class PgslIncrementDecrementStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslIncrementDecrementStatementSyntaxTreeStructureData> {
    private readonly mExpression: BasePgslSingleValueExpressionSyntaxTree;
    private readonly mOperator: PgslOperator;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslSingleValueExpressionSyntaxTree {
        return this.mExpression;
    }

    /**
     * Expression operator.
     */
    public get operator(): PgslOperator {
        return this.mOperator;
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
    public constructor(pData: PgslIncrementDecrementStatementSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Create list of all bit operations.
        const lIncrementDecrementOperatorList: Array<PgslOperator> = [
            PgslOperator.Increment,
            PgslOperator.Decrement
        ];

        // Validate operator.
        if (!lIncrementDecrementOperatorList.includes(pData.operator as PgslOperator)) {
            throw new Exception(`Operator "${pData.operator}" can not used for increment or decrement statements.`, this);
        }

        // Validate expression type.
        if (!(pData.expression instanceof PgslVariableNameExpressionSyntaxTree) && !(pData.expression instanceof PgslIndexedValueExpressionSyntaxTree) && !(pData.expression instanceof PgslValueDecompositionExpressionSyntaxTree)) {
            throw new Exception(`Increment and decrement operations can only be applied to variables.`, this);
        }

        this.mOperator = EnumUtil.cast(PgslOperator, pData.operator)!;
        this.mExpression = pData.expression;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: SHouldnt be a const value.
    }
}

export type PgslIncrementDecrementStatementSyntaxTreeStructureData = {
    operator: string;
    expression: BasePgslSingleValueExpressionSyntaxTree;
};