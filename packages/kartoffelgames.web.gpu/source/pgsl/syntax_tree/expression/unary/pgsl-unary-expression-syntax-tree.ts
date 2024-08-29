import { Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-numeric-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree';
import { PgslBooleanTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-boolean-type-definition-syntax-tree';

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
        // Read type of inner expression.
        const lExpressionType: BasePgslTypeDefinitionSyntaxTree = this.mExpression.resolveType;

        // Validate type for each.
        switch (this.mOperator) {
            case PgslOperator.BinaryNegate: {
                // TODO: Allow numeric vectors.
                if (!(lExpressionType instanceof PgslNumericTypeDefinitionSyntaxTree)) {
                    throw new Exception(`Binary negation only valid for numeric type.`, this);
                }

                break;
            }
            case PgslOperator.Minus: {
                if (!(lExpressionType instanceof PgslNumericTypeDefinitionSyntaxTree) && !(lExpressionType instanceof PgslVectorTypeDefinitionSyntaxTree)) {
                    throw new Exception(`Negation only valid for numeric or vector type.`, this);
                }

                break;
            }
            case PgslOperator.Not: {
                // TODO: Only vector booleans.
                if (!(lExpressionType instanceof PgslBooleanTypeDefinitionSyntaxTree)) {
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