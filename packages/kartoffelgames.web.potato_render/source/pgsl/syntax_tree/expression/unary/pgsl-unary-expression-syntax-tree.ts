import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree';
import { PgslBaseType } from '../../type/enum/pgsl-base-type.enum';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeSetupData } from '../base-pgsl-expression-syntax-tree';

/**
 * PGSL structure holding a expression with a single value and a single unary operation.
 */
export class PgslUnaryExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslUnaryExpressionSyntaxTreeSetupData> {
    private readonly mExpression: BasePgslExpressionSyntaxTree;
    private readonly mOperatorName: string;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree {
        return this.mExpression;
    }

    /**
     * Unary operator.
     */
    public get operator(): PgslOperator {
        this.ensureSetup();

        return this.setupData.data.operator;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pExpression: BasePgslExpressionSyntaxTree, pOperator: string, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mExpression = pExpression;
        this.mOperatorName = pOperator;
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data.
     */
    protected override onSetup(): PgslExpressionSyntaxTreeSetupData<PgslUnaryExpressionSyntaxTreeSetupData> {
        // Try to read operator.
        const lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.mOperatorName);
        if (!lOperator) {
            throw new Exception(`Can't use "${this.mOperatorName}" as a operator.`, this);
        }

        // TODO: Integer type changes when value is negative.

        return {
            expression: {
                isFixed: this.mExpression.isCreationFixed,
                isStorage: false,
                resolveType: this.mExpression.resolveType,
                isConstant: this.mExpression.isConstant
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

        // Type buffer for validating the processed types.
        let lValueType: BasePgslTypeDefinitionSyntaxTree;

        // Validate vectors differently.
        if (this.mExpression.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) {
            lValueType = this.mExpression.resolveType.innerType;
        } else {
            lValueType = this.mExpression.resolveType;
        }

        // Validate operator.
        if (![PgslOperator.BinaryNegate, PgslOperator.Minus, PgslOperator.Not].includes(this.setupData.data.operator)) {
            throw new Exception(`Unary operator "${this.setupData.data.operator}" not supported`, this);
        }

        // Validate type for each.
        switch (this.setupData.data.operator) {
            case PgslOperator.BinaryNegate: {
                if (lValueType.baseType !== PgslBaseType.Numberic) {
                    throw new Exception(`Binary negation only valid for numeric type.`, this);
                }

                break;
            }
            case PgslOperator.Minus: {
                // TODO: Not unsigned int.
                if (lValueType.baseType !== PgslBaseType.Numberic) {
                    throw new Exception(`Negation only valid for numeric or vector type.`, this);
                }

                break;
            }
            case PgslOperator.Not: {
                if (lValueType.baseType !== PgslBaseType.Boolean) {
                    throw new Exception(`Boolean negation only valid for boolean type.`, this);
                }

                break;
            }
        }
    }
}

export type PgslUnaryExpressionSyntaxTreeSetupData = {
    operator: PgslOperator;
};