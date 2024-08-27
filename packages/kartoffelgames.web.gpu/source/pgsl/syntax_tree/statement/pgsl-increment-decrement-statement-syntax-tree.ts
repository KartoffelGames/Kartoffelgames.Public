import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../enum/pgsl-operator.enum';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a increment or decrement statement.
 */
export class PgslIncrementDecrementStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslIncrementDecrementStatementSyntaxTreeStructureData> {
    private readonly mExpression: BasePgslExpressionSyntaxTree;
    private readonly mOperator: PgslOperator;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree {
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


        this.mOperator = EnumUtil.cast(PgslOperator, pData.operator)!;
        this.mExpression = pData.expression;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Must be a storage.
        if (!this.mExpression.isStorage) {
            throw new Exception('Increment or decrement expression muss be applied to a storage expression', this);
        }

        // TODO: SHouldnt be a const value.
    }
}

export type PgslIncrementDecrementStatementSyntaxTreeStructureData = {
    operator: string;
    expression: BasePgslExpressionSyntaxTree;
};