import { Exception } from '@kartoffelgames/core';
import { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import { PgslPointerType } from '../../../type/pgsl-pointer-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslExpression } from '../pgsl-expression.ts';

/**
 * PGSL structure holding a variable name used as a pointer value.
 */
export class PgslPointerExpression extends PgslExpression {
    private readonly mExpression: PgslExpression;

    /**
     * Expression reference.
     */
    public get expression(): PgslExpression {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pVariable - Pointered variable.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pVariable: PgslExpression, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mExpression = pVariable;

        // Add data as child tree.
        this.appendChild(this.mExpression);
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Trace to use for validation.
     * 
     * @returns Expression trace data.
     */
    protected override onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace {
        // Validate child expression.
        this.mExpression.trace(pTrace);

        // Read attached value of expression.
        const lExpressionAttachment: PgslExpressionTrace = pTrace.getExpression(this.mExpression);

        // Validate that it needs to be a variable name, index value or value decomposition.
        if (!(lExpressionAttachment.resolveType instanceof PgslPointerType)) {
            throw new Exception('Value of a pointer expression needs to be a pointer', this);
        }

        return new PgslExpressionTrace({
            fixedState: lExpressionAttachment.fixedState,
            isStorage: true,
            resolveType: lExpressionAttachment.resolveType.referencedType,
            constantValue: lExpressionAttachment.constantValue,
            storageAddressSpace: lExpressionAttachment.storageAddressSpace
        });
    }
}