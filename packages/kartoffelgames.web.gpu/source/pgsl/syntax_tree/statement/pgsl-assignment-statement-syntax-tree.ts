import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslAssignment } from '../../enum/pgsl-assignment.enum';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a assignment statement.
 */
export class PgslAssignmentStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslAssignmentStatementSyntaxTreeStructureData> {
    private readonly mAssignment: PgslAssignment;
    private readonly mExpression: BasePgslExpressionSyntaxTree;
    private readonly mVariable: BasePgslExpressionSyntaxTree;

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
    public get variable(): BasePgslExpressionSyntaxTree {
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

        this.mAssignment = EnumUtil.cast(PgslAssignment, pData.assignment)!;
        this.mVariable = pData.variable; // TODO: Add a isStorage flag to expression.
        this.mExpression = pData.expression;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Must be a storage.
        if (!this.mVariable.isStorage) {
            throw new Exception('Increment or decrement expression muss be applied to a storage expression', this);
        }

        // Validate that it is not a constant.
        if (this.mVariable.isConstant) {
            throw new Exception(`Can't assign values to a constant`, this);
        }

        // TODO: Only a addressOf should be assigned to a pointer variable.
        // TODO: expression should be the correct value type for each assignment.
    }
}

export type PgslAssignmentStatementSyntaxTreeStructureData = {
    assignment: string;
    variable: BasePgslExpressionSyntaxTree;
    expression: BasePgslExpressionSyntaxTree;
};