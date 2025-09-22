import { EnumUtil } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { PgslNumericTypeDefinition } from "../../type/pgsl-numeric-type-definition.ts";
import { PgslVectorTypeDefinition } from "../../type/pgsl-vector-type-definition.ts";
import { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression.ts';
import { PgslTranspilationTrace } from "../../pgsl-tranpilation-trace.ts";

export class PgslArithmeticExpression extends BasePgslExpression {
    private readonly mLeftExpression: BasePgslExpression;
    private readonly mOperatorName: string;
    private readonly mRightExpression: BasePgslExpression;

    /**
     * Left expression reference.
     */
    public get leftExpression(): BasePgslExpression {
        return this.mLeftExpression;
    }

    /**
     * Right expression reference.
     */
    public get rightExpression(): BasePgslExpression {
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
    public constructor(pLeft: BasePgslExpression, pOperator: string, pRight: BasePgslExpression, pMeta: BasePgslSyntaxTreeMeta) {
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
    protected override onTranspile(pTrace: PgslTranspilationTrace): string {
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

        // Create list of all arithmetic operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.Plus,
            PgslOperator.Minus,
            PgslOperator.Multiply,
            PgslOperator.Divide,
            PgslOperator.Modulo
        ];

        // Validate.
        if (!lComparisonList.includes(lOperator as PgslOperator)) {
            pTrace.pushError(`Operator "${this.mOperatorName}" can not used for arithmetic operations.`, this.meta, this);
        }

        // Read left and right expression attachments.
        const lLeftExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mLeftExpression);
        const lRightExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mRightExpression);

        // TODO: Also matrix calculations :(
        // TODO: And Mixed vector calculation...

        // Left and right need to be same type or implicitly castable.
        if (!lRightExpressionAttachment.resolveType.isImplicitCastableInto(pTrace, lLeftExpressionAttachment.resolveType)) {
            pTrace.pushError('Left and right side of arithmetic expression must be the same type.', this.meta, this);
        }

        // Validate vector inner values. 
        if (lLeftExpressionAttachment.resolveType instanceof PgslVectorTypeDefinition) {  // TODO: Cant do this, as alias types could be vectors as well.
            // Validate left side vector type. Right ist the same type.
            if (!(lLeftExpressionAttachment.resolveType.innerType instanceof PgslNumericTypeDefinition)) { // TODO: Cant do this, as alias types could be that as well.
                pTrace.pushError('Left and right side of arithmetic expression must be a numeric vector value', this.meta, this);
            }
        } else {
            // Validate left side type. Right ist the same type.
            if (!(lLeftExpressionAttachment.resolveType instanceof PgslNumericTypeDefinition)) { // TODO: Cant do this, as alias types could be that as well.
                pTrace.pushError('Left and right side of arithmetic expression must be a numeric value', this.meta, this);
            }
        }

        return {
            fixedState: Math.min(lLeftExpressionAttachment.fixedState, lRightExpressionAttachment.fixedState),
            isStorage: false,
            resolveType: lLeftExpressionAttachment.resolveType,
        };
    }
}