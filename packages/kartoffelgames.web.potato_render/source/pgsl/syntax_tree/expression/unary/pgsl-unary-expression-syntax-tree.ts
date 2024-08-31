import { Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-numeric-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree';
import { PgslTypeName } from '../../type/enum/pgsl-type-name.enum';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';

/**
 * PGSL structure holding a expression with a single value and a single unary operation.
 */
export class PgslUnaryExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslUnaryExpressionSyntaxTreeStructureData> {
    private readonly mExpression: BasePgslExpressionSyntaxTree;
    private readonly mOperator: PgslOperator;

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
        return this.mOperator;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslUnaryExpressionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

        // Validate operator.
        if (![PgslOperator.BinaryNegate, PgslOperator.Minus, PgslOperator.Not].includes(pData.operator as (PgslOperator | any))) {
            throw new Exception(`Unary operator "${pData.operator}" not supported`, this);
        }

        // Set data.
        this.mExpression = pData.expression;
        this.mOperator = pData.operator as PgslOperator;
    }

    /**
     * On constant state request.
     */
    protected determinateIsConstant(): boolean {
        // Expression is constant when variable is a constant.
        return this.mExpression.isConstant;
    }

    /**
     * On creation fixed state request.
     */
    protected override determinateIsCreationFixed(): boolean {
        // Expression is constant when variable is a constant.
        return this.mExpression.isCreationFixed;
    }

    /**
     * On is storage set.
     */
    protected determinateIsStorage(): boolean {
        return false;
    }

    /**
     * On type resolve of expression
     */
    protected determinateResolveType(): BasePgslTypeDefinitionSyntaxTree {
        // TODO: Integer type changes when value is negative.

        // Input type is output type.
        return this.mExpression.resolveType;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Type buffer for validating the processed types.
        let lValueType: BasePgslTypeDefinitionSyntaxTree;

        // Validate vectors differently.
        if (this.mExpression.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) {
            lValueType = this.mExpression.resolveType.innerType;
        } else {
            lValueType = this.mExpression.resolveType;
        }

        // Validate type for each.
        switch (this.mOperator) {
            case PgslOperator.BinaryNegate: {
                if (!(lValueType instanceof PgslNumericTypeDefinitionSyntaxTree)) {
                    throw new Exception(`Binary negation only valid for numeric type.`, this);
                }

                break;
            }
            case PgslOperator.Minus: {
                // TODO: Not unsigned int.
                if (!(lValueType instanceof PgslNumericTypeDefinitionSyntaxTree)) {
                    throw new Exception(`Negation only valid for numeric or vector type.`, this);
                }

                break;
            }
            case PgslOperator.Not: {
                if (lValueType.typeName !== PgslTypeName.Boolean) {
                    throw new Exception(`Boolean negation only valid for boolean type.`, this);
                }

                break;
            }
        }
    }
}

export type PgslUnaryExpressionSyntaxTreeStructureData = {
    expression: BasePgslExpressionSyntaxTree;
    operator: string;
};