import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-numeric-type-definition-syntax-tree';
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum';
import { PgslNumericTypeName } from '../../type/enum/pgsl-numeric-type-name.enum';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree';
import { PgslBlockStatementSyntaxTree } from '../pgsl-block-statement-syntax-tree';

/**
 * PGSL structure for a switch statement with optional default block.
 */
export class PgslSwitchStatementSyntaxTree extends BasePgslStatementSyntaxTree {
    private readonly mCases: Array<PgslSwitchStatementSwitchCase>;
    private readonly mDefault: PgslBlockStatementSyntaxTree | null;
    private readonly mExpression: BasePgslExpressionSyntaxTree;

    /**
     * Switch cases.
     */
    public get cases(): Array<PgslSwitchStatementSwitchCase> {
        return [...this.mCases];
    }

    /**
     * Default block.
     */
    public get default(): PgslBlockStatementSyntaxTree | null {
        return this.mDefault;
    }

    /**
     * Switch boolean expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pParameter - Construction parameter.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pParameter: PgslSwitchStatementSyntaxTreeConstructorParameter, pMeta: BasePgslSyntaxTreeMeta) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pMeta);

        // Set data.
        this.mCases = pParameter.cases;
        this.mExpression = pParameter.expression;
        this.mDefault = pParameter.default;

        // Add data as child tree.
        this.appendChild(this.mExpression);
        if (this.mDefault) {
            this.appendChild(this.mDefault);
        }

        // Add each case as 
        for (const lCase of this.mCases) {
            this.appendChild(lCase.block, ...lCase.cases);
        }
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Switch statement must be of a numberic type.
        if (this.mExpression.resolveType.aliasedType.baseType !== PgslBaseTypeName.Numberic) {
            throw new Exception('Switch expression must be of a unsigned integer type.', this);
        }

        // Switch must be a unsigned integer type.
        const lNumericType: PgslNumericTypeDefinitionSyntaxTree = this.mExpression.resolveType.aliasedType as PgslNumericTypeDefinitionSyntaxTree;
        if (lNumericType.numericType !== PgslNumericTypeName.UnsignedInteger) {
            throw new Exception('Switch expression must be of a unsigned integer type.', this);
        }

        // Validate each case.
        for (const lCase of this.mCases) {
            // Validate any case value.
            for (const lCaseValue of lCase.cases) {
                // Must be number type.
                if (lCaseValue.resolveType.baseType !== PgslBaseTypeName.Numberic) {
                    throw new Exception('Case expression must be of a unsigned integer type.', this);
                }

                // Case must be a unsigned integer type.
                const lCaseNumericType: PgslNumericTypeDefinitionSyntaxTree = lCaseValue.resolveType.aliasedType as PgslNumericTypeDefinitionSyntaxTree;
                if (lCaseNumericType.numericType !== PgslNumericTypeName.UnsignedInteger) {
                    throw new Exception('Switch expression must be of a unsigned integer type.', this);
                }

                // Cases must be constant.
                if (!lCaseValue.isConstant) {
                    throw new Exception('Case expression must be a constant.', this);
                }
            }
        }
    }
}

export type PgslSwitchStatementSwitchCase = {
    readonly cases: Array<BasePgslExpressionSyntaxTree>,
    readonly block: PgslBlockStatementSyntaxTree;
};

export type PgslSwitchStatementSyntaxTreeConstructorParameter = {
    expression: BasePgslExpressionSyntaxTree,
    cases: Array<PgslSwitchStatementSwitchCase>;
    default: PgslBlockStatementSyntaxTree | null;
};