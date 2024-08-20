import { Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from '../single_value/base-pgsl-single-value-expression-syntax-tree';
import { PgslSyntaxTreeInitData } from '../../base-pgsl-syntax-tree';

/**
 * PGSL structure holding a expression with a single value and a single unary operation.
 */
export class PgslUnaryExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslUnaryExpressionSyntaxTreeStructureData> {
    private readonly mExpression: BasePgslSingleValueExpressionSyntaxTree<PgslSyntaxTreeInitData>;
    private readonly mOperator: PgslOperator;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslSingleValueExpressionSyntaxTree<PgslSyntaxTreeInitData> {
        return this.mExpression;
    }

    /**
     * Unary operator.
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
    public constructor(pData: PgslUnaryExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Validate operator.
        if (![PgslOperator.BinaryNegate, PgslOperator.Minus, PgslOperator.Not].includes(pData.operator as (PgslOperator | any))) {
            throw new Exception(`Unary operator "${pData.operator}" not supported`, this);
        }

        // Set data.
        this.mExpression = pData.expression;
        this.mOperator = pData.operator as PgslOperator;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing to validate eighter.
    }
}

export type PgslUnaryExpressionSyntaxTreeStructureData = {
    expression: BasePgslSingleValueExpressionSyntaxTree<PgslSyntaxTreeInitData>;
    operator: string;
};