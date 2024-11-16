import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../enum/pgsl-operator.enum';
import { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a increment or decrement statement.
 */
export class PgslIncrementDecrementStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslIncrementDecrementStatementSyntaxTreeSetupData> {
    private readonly mExpression: BasePgslExpressionSyntaxTree;
    private readonly mOperatorName: string;

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
        this.ensureSetup();

        return this.setupData.operator;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pOperator: string, pExpression: BasePgslExpressionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pMeta);

        // Set base data.
        this.mOperatorName = pOperator;
        this.mExpression = pExpression;
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data.
     */
    protected override onSetup(): PgslIncrementDecrementStatementSyntaxTreeSetupData {
        // Try to parse operator.
        const lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.mOperatorName);
        if (!lOperator) {
            throw new Exception(`Operator "${this.mOperatorName}" not a valid operator.`, this);
        }

        return {
            operator: lOperator
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        this.ensureSetup();

        // Create list of all bit operations.
        const lIncrementDecrementOperatorList: Array<PgslOperator> = [
            PgslOperator.Increment,
            PgslOperator.Decrement
        ];

        // Validate operator.
        if (!lIncrementDecrementOperatorList.includes(this.setupData.operator as PgslOperator)) {
            throw new Exception(`Operator "${this.setupData.operator}" can not used for increment or decrement statements.`, this);
        }

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

type PgslIncrementDecrementStatementSyntaxTreeSetupData = {
    operator: PgslOperator;
};