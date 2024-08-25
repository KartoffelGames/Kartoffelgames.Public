import { EnumUtil, Exception } from '@kartoffelgames/core';
import { BasePgslSingleValueExpressionSyntaxTree } from '../expression/single_value/base-pgsl-single-value-expression-syntax-tree';
import { PgslIndexedValueExpressionSyntaxTree } from '../expression/single_value/pgsl-indexed-value-expression-syntax-tree';
import { PgslValueDecompositionExpressionSyntaxTree } from '../expression/single_value/pgsl-value-decomposition-expression-syntax-tree';
import { PgslVariableNameExpressionSyntaxTree } from '../expression/single_value/pgsl-variable-name-expression-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslAssignment } from '../../enum/pgsl-assignment.enum';

/**
 * PGSL structure holding a assignment statement.
 */
export class PgslAssignmentStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslAssignmentStatementSyntaxTreeStructureData> {
    private readonly mAssignment: PgslAssignment;
    private readonly mExpression: BasePgslExpressionSyntaxTree;
    private readonly mVariable: BasePgslSingleValueExpressionSyntaxTree;

    /**
     * Expression operator.
     */
    public get assignment(): PgslAssignment {
        return this.mAssignment;
    }

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree {
        return this.mExpression;
    }

    /**
     * Expression reference.
     */
    public get variable(): BasePgslSingleValueExpressionSyntaxTree {
        return this.mVariable;
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
    public constructor(pData: PgslAssignmentStatementSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Validate assignment.
        if (!EnumUtil.exists<PgslAssignment>(PgslAssignment, pData.assignment)) {
            throw new Exception(`Operation "${pData.assignment}" can not used for increment or decrement statements.`, this);
        }

        // Validate expression type. // TODO: Add pointer expression.
        if (!(pData.variable instanceof PgslVariableNameExpressionSyntaxTree) && !(pData.variable instanceof PgslIndexedValueExpressionSyntaxTree) && !(pData.variable instanceof PgslValueDecompositionExpressionSyntaxTree)) {
            throw new Exception(`Increment and decrement operations can only be applied to variables.`, this);
        }

        this.mAssignment = EnumUtil.cast(PgslAssignment, pData.assignment)!;
        this.mVariable = pData.variable;
        this.mExpression = pData.expression;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Validate that it is not a constant.
        if (this.mVariable.isConstant) {
            throw new Exception(`Can't assign values to a constant`, this);
        }

        // TODO: Only a addressOf should be assigned to a pointer variable.

        // TODO:expression should be the correct value type for each assignment.
    }
}

export type PgslAssignmentStatementSyntaxTreeStructureData = {
    assignment: string;
    variable: BasePgslSingleValueExpressionSyntaxTree;
    expression: BasePgslExpressionSyntaxTree;
};