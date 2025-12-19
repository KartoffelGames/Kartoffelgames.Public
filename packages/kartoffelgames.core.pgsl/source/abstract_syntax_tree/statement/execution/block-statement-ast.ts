import { BlockStatementCst } from "../../../concrete_syntax_tree/statement.type.ts";
import type { PgslType } from '../../../type/pgsl-type.ts';
import { PgslVoidType } from '../../../type/pgsl-void-type.ts';
import { AbstractSyntaxTreeContext } from "../../abstract-syntax-tree-context.ts";
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';
import { BreakStatementAst } from "../single/pgsl-break-statement.ts";
import { ContinueStatementAst } from "../single/pgsl-continue-statement.ts";
import { ReturnStatementAst } from '../single/return-statement-ast.ts';
import { StatementAstBuilder } from "../statement-ast-builder.ts";

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
                returnType: null as PgslType | null,
                isContinuing: null as boolean | null,
                isBreaking: null as boolean | null
            } satisfies BlockStatementAstData;

            for (const lStatement of this.cst.statements) {
                // Build statement.
                const lStatementAst: IStatementAst = StatementAstBuilder.build(lStatement, pContext);

                // Push statement to list.
                lStatementData.statementList.push(lStatementAst);

                // Check for return statement.
                if (lStatementAst instanceof ReturnStatementAst) {
                    // When the statement has no expression, the return type is void.
                    if (!lStatementAst.data.expression) {
                        lStatementData.returnType = new PgslVoidType(pContext);
                        continue;
                    }

                    lStatementData.returnType = lStatementAst.data.expression.data.resolveType;
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

            return lStatementData satisfies BlockStatementAstData;
        }, this);
    }
}

export type BlockStatementAstData = {
    statementList: ReadonlyArray<IStatementAst>;
    returnType: PgslType | null;
    isContinuing: boolean | null;
    isBreaking: boolean | null;
} & StatementAstData;