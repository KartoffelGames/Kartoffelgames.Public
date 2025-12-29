import type { BlockStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { IType } from '../../type/i-type.interface.ts';
import { PgslVoidType } from '../../type/pgsl-void-type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';
import { BreakStatementAst } from '../single/break-statement-ast.ts';
import { ContinueStatementAst } from '../single/continue-statement-ast.ts';
import { ReturnStatementAst } from '../single/return-statement-ast.ts';
import { StatementAstBuilder } from '../statement-ast-builder.ts';

/**
 * PGSL structure holding a list of statements. Handles scoped values.
 */
export class BlockStatementAst extends AbstractSyntaxTree<BlockStatementCst, BlockStatementAstData> implements IStatementAst {
    /**
     * Build tree of current structure.
     * 
     * @param pContext - Context.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): BlockStatementAstData {
        // Create new scope and validate all statements.
        return pContext.pushScope('inherit', () => {
            // Prepare data containers.
            const lStatementData = {
                statementList: Array<IStatementAst>(),
                returnType: null as IType | null,
                isContinuing: null as boolean | null,
                isBreaking: null as boolean | null
            };

            for (const lStatement of this.cst.statements) {
                // Build statement.
                const lStatementAst: IStatementAst = StatementAstBuilder.build(lStatement, pContext);

                // Push statement to list.
                lStatementData.statementList.push(lStatementAst);

                // Check for return statement.
                if (lStatementAst instanceof ReturnStatementAst) {
                    lStatementData.returnType = lStatementAst.data.returnType;
                    continue;
                }

                // Check for continuing or breaking statements.
                if (lStatementAst instanceof ContinueStatementAst) {
                    lStatementData.isContinuing = true;
                    continue;
                }

                // Check for breaking statements.
                if (lStatementAst instanceof BreakStatementAst) {
                    lStatementData.isBreaking = true;
                    continue;
                }
            }

            return {
                statementList: lStatementData.statementList,
                returnType: lStatementData.returnType ?? new PgslVoidType().process(pContext),
                isContinuing: lStatementData.isContinuing ?? false,
                isBreaking: lStatementData.isBreaking ?? false
            } satisfies BlockStatementAstData;
        }, this);
    }
}

export type BlockStatementAstData = {
    statementList: ReadonlyArray<IStatementAst>;
    returnType: IType;
    isContinuing: boolean;
    isBreaking: boolean;
} & StatementAstData;