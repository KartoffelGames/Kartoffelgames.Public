import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslAssignment } from '../../enum/pgsl-assignment.enum';
import { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a assignment statement.
 */
export class PgslAssignmentStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslAssignmentStatementSyntaxTreeSetupData> {
    private readonly mAssignmentName: string;
    private readonly mExpression: BasePgslExpressionSyntaxTree;
    private readonly mVariable: BasePgslExpressionSyntaxTree;

    /**
     * Expression operator.
     */
    public get assignment(): PgslAssignment {
        this.ensureSetup();

        return this.setupData.assignment;
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
     * @param pParameter - Parameter.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pParameter: PgslAssignmentStatementSyntaxTreeConstructorParameter, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta, false);

        // Set data.
        this.mAssignmentName = pParameter.assignment;
        this.mVariable = pParameter.variable;
        this.mExpression = pParameter.expression;

        // Set data as child trees.
        this.appendChild(this.mVariable, this.mExpression);
    }

    /**
     * Retrieve data of current structure.
     * @returns setuped data.
     */
    public override onSetup(): PgslAssignmentStatementSyntaxTreeSetupData {
        // Try to parse assignment.
        const lAssignment: PgslAssignment | undefined = EnumUtil.cast(PgslAssignment, this.mAssignmentName);
        if (!lAssignment) {
            throw new Exception(`Operation "${this.mAssignmentName}" can not used for assignment statements.`, this);
        }

        return {
            assignment: lAssignment
        };
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

type PgslAssignmentStatementSyntaxTreeSetupData = {
    assignment: PgslAssignment;
};

export type PgslAssignmentStatementSyntaxTreeConstructorParameter = {
    assignment: string;
    variable: BasePgslExpressionSyntaxTree;
    expression: BasePgslExpressionSyntaxTree;
};