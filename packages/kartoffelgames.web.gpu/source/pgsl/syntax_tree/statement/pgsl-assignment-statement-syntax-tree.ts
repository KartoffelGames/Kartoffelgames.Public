import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslAssignment } from '../../enum/pgsl-assignment.enum';
import { SyntaxTreeMeta } from '../base-pgsl-syntax-tree';
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
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslAssignmentStatementSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

        // Validate assignment.
        if (!EnumUtil.exists<PgslAssignment>(PgslAssignment, pData.assignment)) {
            throw new Exception(`Operation "${pData.assignment}" can not used for assignment statements.`, this);
        }

        this.mAssignment = EnumUtil.cast(PgslAssignment, pData.assignment)!;
        this.mVariable = pData.variable;
        this.mExpression = pData.expression;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Must be a storage.
        if (!this.mVariable.isStorage) {
            throw new Exception('Assignment statement muss be applied to a storage expression', this);
        }

        // Validate that it is not a constant.
        if (this.mVariable.isConstant) {
            throw new Exception(`Can't assign values to a constant`, this);
        }

        // Validate that it has the same value.
        if (!this.mVariable.resolveType.equals(this.mExpression.resolveType)) {
            throw new Exception(`Can't assigne a different type to a variable`, this);
        }
    }
}

export type PgslAssignmentStatementSyntaxTreeStructureData = {
    assignment: string;
    variable: BasePgslExpressionSyntaxTree;
    expression: BasePgslExpressionSyntaxTree;
};