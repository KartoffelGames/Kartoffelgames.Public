import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeSetupData } from '../base-pgsl-expression-syntax-tree.ts';

/**
 * PGSL structure for a logical expression between two values.
 */
export class PgslLogicalExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslLogicalExpressionSyntaxTreeSetupData> {
    private readonly mLeftExpression: BasePgslExpressionSyntaxTree;
    private readonly mOperatorName: string;
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
        this.ensureSetup();

        return this.setupData.data.operator;
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
     * @param pLeft - Left expression.
     * @param pOperator - Operator.
     * @param pRight - Right expression.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pLeft: BasePgslExpressionSyntaxTree, pOperator: string, pRight: BasePgslExpressionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mLeftExpression = pLeft;
        this.mOperatorName = pOperator;
        this.mRightExpression = pRight;

        // Add data as child tree.
        this.appendChild(this.mLeftExpression, this.mRightExpression);
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data.
     */
    protected override onSetup(): PgslExpressionSyntaxTreeSetupData<PgslLogicalExpressionSyntaxTreeSetupData> {
        // Try to convert operator.
        const lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.mOperatorName);
        if (!lOperator) {
            throw new Exception(`"${this.mOperatorName}" can't be used as a operator.`, this);
        }

        return {
            expression: {
                isFixed: this.mLeftExpression.isCreationFixed && this.mRightExpression.isCreationFixed,
                isStorage: false,
                resolveType: this.mLeftExpression.resolveType,
                isConstant: this.mLeftExpression.isConstant && this.mRightExpression.isConstant
            },
            data: {
                operator: lOperator
            }
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        this.ensureSetup();

        // Create list of all short circuit operations.
        const lShortCircuitOperationList: Array<PgslOperator> = [
            PgslOperator.ShortCircuitOr,
            PgslOperator.ShortCircuitAnd
        ];

        // Validate
        if (!lShortCircuitOperationList.includes(this.setupData.data.operator)) {
            throw new Exception(`Operator "${this.setupData.data.operator}" can not used for logical expressions.`, this);
        }

        // Validate left side type.
        if (this.mLeftExpression.resolveType.baseType !== PgslBaseTypeName.Boolean) {
            throw new Exception('Left side of logical expression needs to be a boolean', this);
        }

        // Validate right side type.
        if (this.mRightExpression.resolveType.baseType !== PgslBaseTypeName.Boolean) {
            throw new Exception('Right side of logical expression needs to be a boolean', this);
        }
    }
}

type PgslLogicalExpressionSyntaxTreeSetupData = {
    operator: PgslOperator;
};