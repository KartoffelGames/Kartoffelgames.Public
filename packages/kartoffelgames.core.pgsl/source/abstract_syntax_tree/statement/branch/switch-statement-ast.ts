import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { SwitchStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import { PgslNumericType } from '../../type/pgsl-numeric-type.ts';
import type { IType } from '../../type/i-type.interface.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { BlockStatementAst } from '../execution/block-statement-ast.ts';
import type { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure for a switch statement with optional default block.
 */
export class SwitchStatementAst extends AbstractSyntaxTree<SwitchStatementCst, SwitchStatementAstData> implements IStatementAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): SwitchStatementAstData {
        // Trace expression.
        const lExpression: IExpressionAst | null = ExpressionAstBuilder.build(this.cst.expression).process(pContext);
        if (!lExpression) {
            throw new Error('Expression could not be build.');
        }

        // Trace block in switch scope
        return pContext.pushScope('switch', () => {
            const lCastableIntoInteger = (pType: IType) => {
                const lSignedIntegerType = new PgslNumericType(PgslNumericType.typeName.signedInteger).process(pContext);
                const lUnsignedIntegerType = new PgslNumericType( PgslNumericType.typeName.unsignedInteger).process(pContext);
                return pType.isImplicitCastableInto(lSignedIntegerType) || pType.isImplicitCastableInto(lUnsignedIntegerType);
            };

            // Expression resolve type must be a unsigned integer.
            if (!lCastableIntoInteger(lExpression.data.resolveType)) {
                pContext.pushIncident('Switch expression must resolve into a unsigned integer.', lExpression);
            }

            const lSelectorValues: Set<number> = new Set<number>();
            const lCases: Array<SwitchStatementAstSwitchCase> = [];

            // Validate each case.
            for (const lCaseData of this.cst.cases) {
                const lCaseExpressions: Array<IExpressionAst> = [];

                // Validate case block.
                const lCaseBlock: BlockStatementAst = new BlockStatementAst(lCaseData.block).process(pContext);

                // Validate any case value.
                for (const lCaseValue of lCaseData.expressions) {
                    // Validate case value.
                    const lCaseValueAst: IExpressionAst | null = ExpressionAstBuilder.build(lCaseValue).process(pContext);
                    if (!lCaseValueAst) {
                        throw new Error('Case value expression could not be build.');
                    }

                    // Check for duplicate case values.
                    if (typeof lCaseValueAst.data.constantValue === 'number') {
                        if (lSelectorValues.has(lCaseValueAst.data.constantValue)) {
                            pContext.pushIncident('Duplicate case value found.', lCaseValueAst);
                        }

                        lSelectorValues.add(lCaseValueAst.data.constantValue);
                    }

                    // Must be number type.
                    if (!lCastableIntoInteger(lCaseValueAst.data.resolveType)) {
                        pContext.pushIncident('Case expression must be of a unsigned integer type.', lCaseValueAst);
                    }

                    // Cases must be constant.
                    if (lCaseValueAst.data.fixedState !== PgslValueFixedState.Constant) {
                        pContext.pushIncident('Case expression must be a constant.', lCaseValueAst);
                    }

                    lCaseExpressions.push(lCaseValueAst);
                }

                lCases.push({
                    cases: lCaseExpressions,
                    block: lCaseBlock
                });
            }

            // Trace default block.
            const lDefault: BlockStatementAst = new BlockStatementAst(this.cst.default).process(pContext);

            return {
                expression: lExpression,
                cases: lCases,
                default: lDefault
            };
        }, this);
    }
}

export type SwitchStatementAstSwitchCase = {
    readonly cases: Array<IExpressionAst>;
    readonly block: BlockStatementAst;
};

export type SwitchStatementAstData = {
    expression: IExpressionAst;
    cases: Array<SwitchStatementAstSwitchCase>;
    default: BlockStatementAst;
} & StatementAstData;