import type { IfStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { PgslBooleanType } from '../../type/definition/pgsl-boolean-type.ts';
import { BlockStatementAst } from '../execution/block-statement-ast.ts';
import type { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure for a if statement with optional else block.
 */
export class IfStatementAst extends AbstractSyntaxTree<IfStatementCst, IfStatementAstData> implements IStatementAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected onProcess(pContext: AbstractSyntaxTreeContext, pCst: IfStatementCst): IfStatementAstData {
        // Validate expression.
        const lExpression: IExpressionAst | null = ExpressionAstBuilder.build(pCst.expression).process(pContext);
        if (!lExpression) {
            throw new Error('Expression could not be build.');
        }

        // Validate block.
        const lBlock: BlockStatementAst = new BlockStatementAst(pCst.block).process(pContext);

        // Validate else block.
        let lElse: BlockStatementAst | IfStatementAst | null = null;
        if (pCst.else) {
            // Check if else is another if statement or a block
            if (pCst.else.type === 'IfStatement') {
                lElse = new IfStatementAst(pCst.else as any).process(pContext);
            } else {
                lElse = new BlockStatementAst(pCst.else as any).process(pContext);
            }
        }

        // Expression must be a boolean.
        if (lExpression.data.resolveType.conversionRankTo(new PgslBooleanType()) === Number.POSITIVE_INFINITY) {
            pContext.pushIncident('Expression of if must resolve into a boolean.', lExpression);
        }

        return {
            expression: lExpression,
            block: lBlock,
            else: lElse
        };
    }
}

export type IfStatementAstData = {
    expression: IExpressionAst;
    block: BlockStatementAst;
    else: BlockStatementAst | IfStatementAst | null;
} & StatementAstData;