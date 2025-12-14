import { PgslDeclarationType } from '../../../enum/pgsl-declaration-type.enum.ts';
import type { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import type { PgslValueTrace } from '../../../trace/pgsl-value-trace.ts';
import { PgslBooleanType } from '../../../type/pgsl-boolean-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../../abstract-syntax-tree.ts';
import type { ExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { PgslStatement } from '../i-statement-ast.interface.ts';
import { PgslAssignmentStatement } from '../execution/pgsl-assignment-statement.ts';
import type { BlockStatementAst } from '../execution/block-statement-ast.ts';
import { PgslFunctionCallStatement } from '../execution/pgsl-function-call-statement.ts';
import { PgslIncrementDecrementStatement } from '../execution/pgsl-increment-decrement-statement.ts';
import type { PgslVariableDeclarationStatement } from '../execution/pgsl-variable-declaration-statement.ts';

/**
 * PGSL structure for a if statement with optional else block.
 */
export class PgslForStatement extends PgslStatement {
    private readonly mBlock: BlockStatementAst;
    private readonly mExpression: ExpressionAst | null;
    private readonly mInit: PgslVariableDeclarationStatement | null;
    private readonly mUpdate: PgslStatement | null;

    /**
     * Block.
     */
    public get block(): BlockStatementAst {
        return this.mBlock;
    }

    /**
     * Compare expression reference.
     */
    public get expression(): ExpressionAst | null {
        return this.mExpression;
    }

    /**
     * Variable declaration statement reference.
     */
    public get init(): PgslVariableDeclarationStatement | null {
        return this.mInit;
    }

    /**
     * Assignment expression.
     */
    public get update(): PgslStatement | null {
        return this.mUpdate;
    }

    /**
     * Constructor.
     * 
     * @param pParameter - Parameter.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pParameter: PgslForStatementSyntaxTreeConstructorParameter, pMeta: BasePgslSyntaxTreeMeta,) {
        super(pMeta);

        // Set data.
        this.mBlock = pParameter.block;
        this.mUpdate = pParameter.update;
        this.mExpression = pParameter.expression;
        this.mInit = pParameter.init;

        // Set child as tree data.
        this.appendChild(this.mBlock);
        if (this.mUpdate) {
            this.appendChild(this.mUpdate);
        }
        if (this.mExpression) {
            this.appendChild(this.mExpression);
        }
        if (this.mInit) {
            this.appendChild(this.mInit);
        }
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected onTrace(pTrace: PgslTrace): void {
        // Create new loop scope and trace child trees.
        pTrace.newScope('loop', () => {
            // Trace optional init declaration. Do it first to make variable available in expression and update traces.
            if (this.mInit) {
                this.mInit.trace(pTrace);

                // Read value trace of init declaration.
                const lInitAttachment: PgslValueTrace | null = pTrace.currentScope.getValue(this.mInit.name);
                if (!lInitAttachment) {
                    pTrace.pushIncident('Unable to find for loop init declaration in scope.', this.mInit);
                } else {
                    // Variable must be a let
                    if (lInitAttachment.declarationType !== PgslDeclarationType.Let) {
                        pTrace.pushIncident('Initial of for loops must be a let declaration.', this.mInit);
                    }
                }
            }

            // Validate optional expression.
            if (this.mExpression) {
                this.mExpression.trace(pTrace);

                // Read attachments of expression.
                const lExpressionTrace: PgslExpressionTrace = pTrace.getExpression(this.mExpression);

                // Expression must be a boolean.
                if (lExpressionTrace.resolveType.isImplicitCastableInto(new PgslBooleanType(pTrace))) {
                    pTrace.pushIncident('Expression of while loops must resolve into a boolean.', this.mExpression);
                }
            }

            // Validate optional update statement.
            if (this.mUpdate) {
                this.mUpdate.trace(pTrace);

                switch (true) {
                    case this.mUpdate instanceof PgslAssignmentStatement:
                    case this.mUpdate instanceof PgslIncrementDecrementStatement:
                    case this.mUpdate instanceof PgslFunctionCallStatement: {
                        break;
                    }
                    default: {
                        pTrace.pushIncident('For update statement must be either an assignment, increment or function statement.', this.mUpdate);
                    }
                }
            }

            // Trace block.
            this.mBlock.trace(pTrace);
        }, this);
    }
}

type PgslForStatementSyntaxTreeConstructorParameter = {
    init: PgslVariableDeclarationStatement | null;
    expression: ExpressionAst | null;
    update: PgslStatement | null;
    block: BlockStatementAst;
};