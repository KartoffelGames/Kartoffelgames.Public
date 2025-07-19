import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree.ts';
import { PgslNumericTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-numeric-type-definition-syntax-tree.ts';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { PgslNumericTypeName } from '../../type/enum/pgsl-numeric-type-name.enum.ts';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeSetupData } from '../base-pgsl-expression-syntax-tree.ts';

export class PgslBinaryExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslBinaryExpressionSyntaxTreeSetupData> {
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
    protected override onSetup(): PgslExpressionSyntaxTreeSetupData<PgslBinaryExpressionSyntaxTreeSetupData> {
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

        // Create list of all bit operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.BinaryOr,
            PgslOperator.BinaryAnd,
            PgslOperator.BinaryXor,
            PgslOperator.ShiftLeft,
            PgslOperator.ShiftRight
        ];

        // Validate.
        if (!lComparisonList.includes(this.setupData.data.operator as PgslOperator)) {
            throw new Exception(`Operator "${this.setupData.data.operator}" can not used for bit operations.`, this);
        }

        // Type buffer for validating the processed types.
        let lLeftValueType: BasePgslTypeDefinitionSyntaxTree;
        let lRightValueType: BasePgslTypeDefinitionSyntaxTree;

        // Validate vectors differently.
        if (this.mLeftExpression.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) {
            lLeftValueType = this.mLeftExpression.resolveType.innerType;

            // Left and right must be a vector.
            if (!(this.mRightExpression.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree)) {
                throw new Exception('Left and right side of bit expression must be the a vector type.', this);
            }
            lRightValueType = this.mRightExpression.resolveType.innerType;
        } else {
            // Expression types are the processed types.
            lLeftValueType = this.mLeftExpression.resolveType;
            lRightValueType = this.mRightExpression.resolveType;
        }

        // Validate that rigth expression of shift operator needs to be a signed integer.
        if (this.setupData.data.operator === PgslOperator.ShiftLeft || this.setupData.data.operator === PgslOperator.ShiftRight) {
            // Shift value must be numeric.
            if (lRightValueType.baseType !== PgslBaseTypeName.Numberic) {
                if ((<PgslNumericTypeDefinitionSyntaxTree>lRightValueType).numericType !== PgslNumericTypeName.UnsignedInteger) {
                    throw new Exception(`Right expression of a shift operation must be a unsigned integer.`, this);
                }
            }
        }

        // Both values need to be numeric.
        if (!(lLeftValueType instanceof PgslNumericTypeDefinitionSyntaxTree)) {
            throw new Exception(`Binary operations can only be applied to numeric values.`, this);
        }
    }
}

type PgslBinaryExpressionSyntaxTreeSetupData = {
    operator: PgslOperator;
};