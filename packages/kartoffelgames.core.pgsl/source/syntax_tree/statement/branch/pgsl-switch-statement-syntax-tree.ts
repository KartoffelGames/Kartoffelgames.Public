import { Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../../expression/base-pgsl-expression-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree } from "../../type/base-pgsl-type-definition-syntax-tree.ts";
import { PgslNumericTypeName } from '../../type/enum/pgsl-numeric-type-name.enum.ts';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree.ts';
import type { PgslBlockStatementSyntaxTree } from '../pgsl-block-statement-syntax-tree.ts';
import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import { PgslNumericTypeDefinitionSyntaxTree } from "../../type/pgsl-numeric-type-definition-syntax-tree.ts";

// TODO: Needs a slight rework.
// Unfortunately, the current implementation is wrong.
// A switch statement must have a default. And that can be in any case block.

/**
 * PGSL structure for a switch statement with optional default block.
 */
export class PgslSwitchStatementSyntaxTree extends BasePgslStatementSyntaxTree<void> {
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
     * Transpile the current structure to a string representation.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        // Open switch.
        let lResult: string = `switch (${this.mExpression.transpile()}) {`

        // Append each case.
        for(const lCase of this.mCases) {
            lResult += `case ${lCase.cases.map((lTree)=> {return lTree.transpile()}).join(', ')}: ${lCase.block.transpile()}`
        }

        // Close switch.
        return lResult + '}';
    }

    /**
     * Constructor.
     *
     * @param pMeta - Syntax tree meta data. 
     * @param pParameter - Construction parameter.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pParameter: PgslSwitchStatementSyntaxTreeConstructorParameter) {
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
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): void {
        // Validate expression.
        this.mExpression.validate(pValidationTrace);

        // Read attachments of expression.
        const lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mExpression);

        // Expression resolve type needed to 
        const lExpressionResolveType: BasePgslTypeDefinitionSyntaxTree = lExpressionAttachment.resolveType;

        // Expression resolve type must be a unsigned integer.
        if (!(lExpressionResolveType instanceof PgslNumericTypeDefinitionSyntaxTree) || lExpressionResolveType.numericType !== PgslNumericTypeName.UnsignedInteger) {
            pValidationTrace.pushError('Switch expression must resolve into a unsigned integer.', this.mExpression.meta, this);
        }

        // Validate each case.
        for (const lCase of this.mCases) {
            // Validate case block.
            lCase.block.validate(pValidationTrace);

            // Validate any case value.
            for (const lCaseValue of lCase.cases) {
                // Validate case value.
                lCaseValue.validate(pValidationTrace);

                // Read attachment of case value.
                const lCaseValueAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lCaseValue);

                // Case value resolve type needed to 
                const lCaseValueResolveType: BasePgslTypeDefinitionSyntaxTree = lCaseValueAttachment.resolveType;

                // Must be number type.
                if (!(lCaseValueResolveType instanceof PgslNumericTypeDefinitionSyntaxTree) || lCaseValueResolveType.numericType !== PgslNumericTypeName.UnsignedInteger) {
                    pValidationTrace.pushError('Case expression must be of a unsigned integer type.', lCaseValue.meta, this);
                }

                // Cases must be constant.
                if (lCaseValueAttachment.fixedState !== PgslValueFixedState.Constant) {
                    pValidationTrace.pushError('Case expression must be a constant.', lCaseValue.meta, this);
                }
            }
        }

        // When set, validate default block.
        if (this.mDefault) {
            this.mDefault.validate(pValidationTrace);
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