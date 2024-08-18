import { Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../../base-pgsl-syntax-tree';
import { PgslExpressionSyntaxTree, PgslExpressionSyntaxTreeFactory, PgslExpressionSyntaxTreeStructureData } from '../pgsl-expression-syntax-tree';

export class PgslUnaryExpressionSyntaxTree extends BasePgslSyntaxTree<PgslUnaryExpressionSyntaxTreeStructureData['meta']['type'], PgslUnaryExpressionSyntaxTreeStructureData['data']> {
    private mExpression: PgslExpressionSyntaxTree | null;
    private mOperator: PgslOperator;

    /**
     * Expression reference.
     */
    public get expression(): PgslExpressionSyntaxTree {
        if (this.mExpression === null) {
            throw new Exception('Expression not set.', this);
        }

        return this.mExpression;
    }

    /**
     * Expression operator.
     */
    public get operator(): PgslOperator {
        if (this.mOperator === null) {
            throw new Exception('Unary operator not set.', this);
        }

        return this.mOperator;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Expression-Unary');

        this.mExpression = null;
        this.mOperator = PgslOperator.Minus;
    }
    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslUnaryExpressionSyntaxTreeStructureData['data']): void {
        if (![PgslOperator.BinaryNegate, PgslOperator.Minus, PgslOperator.Not].includes(pData.operator as (PgslOperator | any))) {
            throw new Exception(`Unary operator "${pData.operator}" not supported`, this);
        }

        this.mExpression = PgslExpressionSyntaxTreeFactory.createFrom(pData.expression, this);
        this.mOperator = pData.operator as PgslOperator;
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslUnaryExpressionSyntaxTreeStructureData['data'] {
        // Value validation.
        if (this.mExpression === null) {
            throw new Exception('Expression not set.', this);
        }

        return {
            expression: this.mExpression.retrieveDataStructure(),
            operator: this.mOperator
        };
    }
}

export type PgslUnaryExpressionSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Expression-Unary', {
    expression: PgslExpressionSyntaxTreeStructureData;
    operator: string;
}>;