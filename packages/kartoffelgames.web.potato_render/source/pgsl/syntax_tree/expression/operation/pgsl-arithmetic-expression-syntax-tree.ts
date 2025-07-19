import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslNumericTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-numeric-type-definition-syntax-tree.ts';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree.ts';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeSetupData } from '../base-pgsl-expression-syntax-tree.ts';

export class PgslArithmeticExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslArithmeticExpressionSyntaxTreeSetupData> {
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
    protected override onSetup(): PgslExpressionSyntaxTreeSetupData<PgslArithmeticExpressionSyntaxTreeSetupData> {
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

        // Create list of all arithmetic operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.Plus,
            PgslOperator.Minus,
            PgslOperator.Multiply,
            PgslOperator.Divide,
            PgslOperator.Modulo
        ];

        // Validate.
        if (!lComparisonList.includes(this.setupData.data.operator)) {
            throw new Exception(`Operator "${this.setupData.data.operator}" can not used for bit operations.`, this);
        }

        // TODO: Also matrix calculations :(
        // TODO: And Mixed vector calculation...

        // Left and right need to be same type.
        if (!this.mLeftExpression.resolveType.explicitCastable(this.mRightExpression.resolveType)) {
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

export type PgslArithmeticExpressionSyntaxTreeSetupData = {
    operator: PgslOperator;
};