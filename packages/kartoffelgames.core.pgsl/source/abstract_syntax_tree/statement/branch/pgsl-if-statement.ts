import type { IfStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import { PgslBooleanType } from '../../../type/pgsl-boolean-type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { BlockStatementAst } from '../execution/block-statement-ast.ts';
import { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure for a if statement with optional else block.
 */
export class IfStatementAst extends AbstractSyntaxTree<IfStatementCst, IfStatementAstData> implements IStatementAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected process(pContext: AbstractSyntaxTreeContext): IfStatementAstData {
        // Validate expression.
        const lExpression: IExpressionAst | null = ExpressionAstBuilder.build(this.cst.expression, pContext);
        if (!lExpression) {
            throw new Error('Expression could not be build.');
        }

        // Validate block.
        const lBlock: BlockStatementAst = new BlockStatementAst(this.cst.block, pContext);

        // Validate else block.
        let lElse: BlockStatementAst | IfStatementAst | null = null;
        if (this.cst.else) {
            // Check if else is another if statement or a block
            if (this.cst.else.type === 'IfStatement') {
                lElse = new IfStatementAst(this.cst.else as any, pContext);
            } else {
                lElse = new BlockStatementAst(this.cst.else as any, pContext);
            }
        }

        // Expression must be a boolean.
        if (!lExpression.data.returnType.isImplicitCastableInto(new PgslBooleanType(pContext))) {
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