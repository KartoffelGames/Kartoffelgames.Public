import { Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression.ts';
import { PgslTranspilationTrace } from "../../pgsl-tranpilation-trace.ts";

/**
 * PGSL structure holding a variable name used as a pointer value.
 */
export class PgslPointerExpression extends BasePgslExpression {
    private readonly mExpression: BasePgslExpression;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpression {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pVariable - Pointered variable.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pVariable: BasePgslExpression, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mExpression = pVariable;

        // Add data as child tree.
        this.appendChild(this.mExpression);
    }

    /**
     * Transpile current expression to WGSL code.
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns WGSL code.
     */
    protected override onTranspile(pTrace: PgslTranspilationTrace): string {
      return `*${this.mExpression.transpile(pTrace)}`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pTrace: PgslValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Validate child expression.
        this.mExpression.validate(pTrace);

        // Read attached value of expression.
        const lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mExpression);

        // Read expression resolve type attachment.
        const lExpressionResolveTypeAttachment = pTrace.getAttachment(lExpressionAttachment.resolveType);

        // Validate that it needs to be a variable name, index value or value decomposition.
        if (lExpressionResolveTypeAttachment.baseType !== PgslBaseTypeName.Pointer) {
            throw new Exception('Value of a pointer expression needs to be a pointer', this);
        }

        // TODO: Somehow must save the address space.

        return {
            fixedState: lExpressionAttachment.fixedState,
            isStorage: true,
            resolveType: lExpressionAttachment.resolveType,
        };
    }
}