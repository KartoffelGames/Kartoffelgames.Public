import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../enum/pgsl-operator.enum';
import { SyntaxTreeMeta } from '../base-pgsl-syntax-tree';
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
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslIncrementDecrementStatementSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pData, pMeta, pBuildIn);

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

        // Shouldnt be a const value.
        if (this.mExpression.isConstant) {
            throw new Exception(`Increment or decrement expression shouldn't be a constant`, this);
        }
    }
}

export type PgslIncrementDecrementStatementSyntaxTreeStructureData = {
    operator: string;
    expression: BasePgslExpressionSyntaxTree;
};