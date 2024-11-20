import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslBooleanTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-boolean-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree';
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeSetupData } from '../base-pgsl-expression-syntax-tree';

/**
 * PGSL structure for a comparison expression between two values.
 */
export class PgslComparisonExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslComparisonExpressionSyntaxTreeSetupData> {
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
    protected override onSetup(): PgslExpressionSyntaxTreeSetupData<PgslComparisonExpressionSyntaxTreeSetupData> {
        // Try to convert operator.
        const lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.mOperatorName);
        if (!lOperator) {
            throw new Exception(`"${this.mOperatorName}" can't be used as a operator.`, this);
        }

        // Any value is converted into a boolean type.
        const lResolveType: BasePgslTypeDefinitionSyntaxTree = (() => {
            const lBooleanDefinition: PgslBooleanTypeDefinitionSyntaxTree = new PgslBooleanTypeDefinitionSyntaxTree({
                buildIn: false,
                range: [
                    this.meta.position.start.line,
                    this.meta.position.start.column,
                    this.meta.position.end.line,
                    this.meta.position.end.column,
                ]
            });

            // Wrap boolean into a vector when it is a vector expression.
            if (this.mLeftExpression.resolveType.baseType === PgslBaseTypeName.Vector) {
                const lVectorType: PgslVectorTypeDefinitionSyntaxTree = this.mLeftExpression.resolveType as PgslVectorTypeDefinitionSyntaxTree;

                return new PgslVectorTypeDefinitionSyntaxTree(lVectorType.vectorDimension, lBooleanDefinition, {
                    buildIn: false,
                    range: [
                        this.meta.position.start.line,
                        this.meta.position.start.column,
                        this.meta.position.end.line,
                        this.meta.position.end.column,
                    ]
                });
            }

            return lBooleanDefinition;
        })();

        return {
            expression: {
                isFixed: this.mLeftExpression.isCreationFixed && this.mRightExpression.isCreationFixed,
                isStorage: false,
                resolveType: lResolveType,
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

        // Create list of all comparison operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.Equal,
            PgslOperator.NotEqual,
            PgslOperator.LowerThan,
            PgslOperator.LowerThanEqual,
            PgslOperator.GreaterThan,
            PgslOperator.GreaterThanEqual
        ];

        // Validate
        if (!lComparisonList.includes(this.setupData.data.operator)) {
            throw new Exception(`Operator "${this.setupData.data.operator}" can not used for comparisons.`, this);
        }

        // Comparison needs to be the same type.
        if (!this.mLeftExpression.resolveType.equals(this.mRightExpression.resolveType)) {
            throw new Exception(`Comparison can only be between values of the same type.`, this);
        }

        // Type buffer for validating the processed types.
        let lValueType: BasePgslTypeDefinitionSyntaxTree;

        // Validate vectors differently.
        if (this.mLeftExpression.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) {
            lValueType = this.mLeftExpression.resolveType.innerType;
        } else {
            lValueType = this.mLeftExpression.resolveType;
        }

        // Both values need to be numeric or boolean.
        if (lValueType.baseType !== PgslBaseTypeName.Numberic && lValueType.baseType !== PgslBaseTypeName.Boolean) {
            throw new Exception(`None numeric or boolean values can't be compared`, this);
        }

        // Validate boolean compare.
        if (![PgslOperator.Equal, PgslOperator.NotEqual].includes(this.setupData.data.operator)) {
            if (lValueType.baseType === PgslBaseTypeName.Boolean) {
                throw new Exception(`Boolean can only be compares with "NotEqual" or "Equal"`, this);
            }
        }
    }
}

export type PgslComparisonExpressionSyntaxTreeSetupData = {
    operator: PgslOperator;
};