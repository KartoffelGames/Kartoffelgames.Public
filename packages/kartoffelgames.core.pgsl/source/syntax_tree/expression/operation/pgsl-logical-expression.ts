import { EnumUtil } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition.ts";
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { PgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../pgsl-expression.ts';
import { PgslFileMetaInformation } from "../../pgsl-build-result.ts";

/**
 * PGSL structure for a logical expression between two values.
 */
export class PgslLogicalExpression extends PgslExpression {
    private readonly mLeftExpression: PgslExpression;
    private readonly mOperatorName: string;
    private readonly mRightExpression: PgslExpression;

    /**
     * Left expression reference.
     */
    public get leftExpression(): PgslExpression {
        return this.mLeftExpression;
    }

    /**
     * Right expression reference.
     */
    public get rightExpression(): PgslExpression {
        return this.mRightExpression;
    }

    /**
     * Constructor.
     * 
     * @param pLeft - Left expression.
     * @param pOperator - Operator.
     * @param pRight - Right expression.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pLeft: PgslExpression, pOperator: string, pRight: PgslExpression, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mLeftExpression = pLeft;
        this.mOperatorName = pOperator;
        this.mRightExpression = pRight;

        // Add data as child tree.
        this.appendChild(this.mLeftExpression, this.mRightExpression);
    }

    /**
     * Transpile current expression to WGSL code.
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns WGSL code.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
        return `${this.mLeftExpression.transpile(pTrace)} ${this.mOperatorName} ${this.mRightExpression.transpile(pTrace)}`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Validate left and right expressions.
        this.mLeftExpression.validate(pTrace);
        this.mRightExpression.validate(pTrace);

        // Try to convert operator.
        const lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.mOperatorName);

        // Create list of all short circuit operations.
        const lShortCircuitOperationList: Array<PgslOperator> = [
            PgslOperator.ShortCircuitOr,
            PgslOperator.ShortCircuitAnd
        ];

        // Validate operator usable for logical expressions.
        if (!lShortCircuitOperationList.includes(lOperator as PgslOperator)) {
            pTrace.pushError(`Operator "${this.mOperatorName}" can not used for logical expressions.`, this.meta, this);
        }

        // Read left and right expression attachments.
        const lLeftExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mLeftExpression);
        const lLeftExpressionTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pTrace.getAttachment(lLeftExpressionAttachment.resolveType);
        const lRightExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mRightExpression);
        const lRightExpressionTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pTrace.getAttachment(lRightExpressionAttachment.resolveType);

        // Validate left side type.
        if (lLeftExpressionTypeAttachment.baseType !== PgslBaseTypeName.Boolean) {
            pTrace.pushError('Left side of logical expression needs to be a boolean', this.meta, this);
        }

        // Validate right side type.
        if (lRightExpressionTypeAttachment.baseType !== PgslBaseTypeName.Boolean) {
            pTrace.pushError('Right side of logical expression needs to be a boolean', this.meta, this);
        }

        return {
            fixedState: Math.min(lLeftExpressionAttachment.fixedState, lRightExpressionAttachment.fixedState),
            isStorage: false,
            resolveType: lLeftExpressionAttachment.resolveType
        };
    }
}