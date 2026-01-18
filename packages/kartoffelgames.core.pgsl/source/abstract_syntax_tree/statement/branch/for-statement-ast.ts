import type { ForStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import { PgslDeclarationType } from '../../../enum/pgsl-declaration-type.enum.ts';
import { PgslBooleanType } from '../../type/pgsl-boolean-type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { BlockStatementAst } from '../execution/block-statement-ast.ts';
import { VariableDeclarationStatementAst } from '../execution/variable-declaration-statement-ast.ts';
import type { IStatementAst } from '../i-statement-ast.interface.ts';
import type { StatementAstData } from '../i-statement-ast.interface.ts';
import { StatementAstBuilder } from '../statement-ast-builder.ts';

/**
 * PGSL structure for a for statement.
 */
export class ForStatementAst extends AbstractSyntaxTree<ForStatementCst, ForStatementAstData> implements IStatementAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected onProcess(pContext: AbstractSyntaxTreeContext): ForStatementAstData {
        // Trace block in own loop scope and trace child trees.
        return pContext.pushScope('loop', () => {
            // Trace optional init declaration. Do it first to make variable available in expression and update traces.
            let lInit: VariableDeclarationStatementAst | null = null;
            if (this.cst.init) {
                lInit = new VariableDeclarationStatementAst(this.cst.init).process(pContext);

                // Variable must be a let
                if (lInit.data.declarationType !== PgslDeclarationType.Let) {
                    pContext.pushIncident('Initial of for loops must be a let declaration.', lInit);
                }
            }

            // Validate optional expression.
            let lExpression: IExpressionAst | null = null;
            if (this.cst.expression) {
                lExpression = ExpressionAstBuilder.build(this.cst.expression).process(pContext);

                // Expression must be a boolean.
                if (!lExpression.data.resolveType.isImplicitCastableInto(new PgslBooleanType().process(pContext))) {
                    pContext.pushIncident('Expression of for loops must resolve into a boolean.', lExpression);
                }
            }

            // Validate optional update statement.
            let lUpdate: IStatementAst | null = null;
            if (this.cst.update) {
                lUpdate = StatementAstBuilder.build(this.cst.update).process(pContext);

                // Parse update statement type
                const lUpdateType = this.cst.update.type;
                if (lUpdateType !== 'AssignmentStatement' && lUpdateType !== 'IncrementDecrementStatement' && lUpdateType !== 'FunctionCallStatement') {
                    pContext.pushIncident('For update statement must be either an assignment, increment or function statement.', lUpdate);
                }
            }

            // Trace block.
            const lBlock: BlockStatementAst = new BlockStatementAst(this.cst.block).process(pContext);

            return {
                init: lInit,
                expression: lExpression,
                update: lUpdate,
                block: lBlock
            };
        }, this);
    }
}

export type ForStatementAstData = {
    init: VariableDeclarationStatementAst | null;
    expression: IExpressionAst | null;
    update: IStatementAst | null;
    block: BlockStatementAst;
} & StatementAstData;