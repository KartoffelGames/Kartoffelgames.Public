import { Exception } from '@kartoffelgames/core';
import type { PgslFunctionTrace } from '../../../trace/pgsl-function-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import type { PgslType } from '../../../type/pgsl-type.ts';
import { PgslVoidType } from '../../../type/pgsl-void-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { PgslFunctionDeclaration } from '../../declaration/pgsl-function-declaration.ts';
import type { PgslExpression } from '../../expression/pgsl-expression.ts';
import { PgslStatement } from '../pgsl-statement.ts';

/**
 * PGSL structure holding a return statement with an optional expression.
 */
export class PgslReturnStatement extends PgslStatement {
    private readonly mExpression: PgslExpression | null;

    /**
     * Expression reference.
     */
    public get expression(): PgslExpression | null {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pExpression - Return expression.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pExpression: PgslExpression | null, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mExpression = pExpression;

        // Add child trees.
        if (this.mExpression) {
            this.appendChild(this.mExpression);
        }
    }

    /**
     * Validate data of current structure.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Validate child expression.
        if (this.mExpression) {
            this.mExpression.trace(pTrace);
        }

        const lFunctionScope: PgslFunctionDeclaration | null = pTrace.currentScope.hasScope('function');

        // Check that this expression is inside a function declaration scope.
        if (lFunctionScope) {
            // Get the function declaration scope.
            const lFunctionTrace: PgslFunctionTrace | undefined = pTrace.getFunction(lFunctionScope.name);
            if (!lFunctionTrace) {
                throw new Exception(`Function declaration trace for function '${lFunctionScope.name}' not found.`, this);
            }

            // Determine the return type of the return statement.
            const lReturnType: PgslType = (() => {
                if (this.mExpression) {
                    // Read expression attachment to resolve the type.
                    return pTrace.getExpression(this.mExpression).resolveType;
                } else {
                    // Create a void type.
                    return new PgslVoidType(pTrace);
                }
            })();

            // Validate that the return type matches the function declaration.
            if (!lReturnType.isImplicitCastableInto(lFunctionTrace.returnType)) {
                pTrace.pushIncident(`Return type does not match function declaration.`, this);
            }
        } else {
            pTrace.pushIncident(`Return statement is not inside a function declaration.`, this);
        }
    }
}