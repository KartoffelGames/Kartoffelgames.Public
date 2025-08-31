import { Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression-syntax-tree.ts';

/**
 * PGSL structure holding a variable name used as a pointer value.
 */
export class PgslPointerExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
    private readonly mExpression: BasePgslExpressionSyntaxTree;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pVariable - Pointered variable.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pVariable: BasePgslExpressionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mExpression = pVariable;

        // Add data as child tree.
        this.appendChild(this.mExpression);
    }

    /**
     * Transpile current expression to WGSL code.
     * 
     * @returns WGSL code.
     */
    protected override onTranspile(): string {
      return `*${this.mExpression.transpile()}`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pTrace: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
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