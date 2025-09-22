import { EnumUtil } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition.ts";
import { PgslNumericTypeDefinition } from "../../type/pgsl-numeric-type-definition.ts";
import { PgslVectorTypeDefinition } from "../../type/pgsl-vector-type-definition.ts";
import { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression.ts';
import { PgslTranspilationTrace } from "../../pgsl-tranpilation-trace.ts";

export class PgslBinaryExpression extends BasePgslExpression {
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

        // Create list of all bit operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.BinaryOr,
            PgslOperator.BinaryAnd,
            PgslOperator.BinaryXor,
            PgslOperator.ShiftLeft,
            PgslOperator.ShiftRight
        ];

        // Validate operator usable for bit operations.
        if (!lComparisonList.includes(lOperator as PgslOperator)) {
            pTrace.pushError(`Operator "${this.mOperatorName}" can not used for bit operations.`, this.meta, this);
        }

        // Read left and right expression attachments.
        const lLeftExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mLeftExpression);
        const lRightExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mRightExpression);
        const lRightExpressionTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pTrace.getAttachment(lRightExpressionAttachment.resolveType);

        // Type buffer for validating the processed types.
        let lLeftValueType: BasePgslTypeDefinition;
        let lRightValueType: BasePgslTypeDefinition;

        // Validate vectors differently.
        if (lLeftExpressionAttachment.resolveType instanceof PgslVectorTypeDefinition) {  // TODO: Cant do this, as alias types could be vectors as well.
            lLeftValueType = lLeftExpressionAttachment.resolveType.innerType;

            // Left and right must be a vector.
            if (!(lRightExpressionAttachment.resolveType instanceof PgslVectorTypeDefinition)) {  // TODO: Cant do this, as alias types could be vectors as well.
                pTrace.pushError('Left and right side of bit expression must be the a vector type.', this.meta, this);
                lRightValueType = lRightExpressionAttachment.resolveType
            } else {
                lRightValueType = lRightExpressionAttachment.resolveType.innerType;
            }
        } else {
            // Expression types are the processed types.
            lLeftValueType = lLeftExpressionAttachment.resolveType;
            lRightValueType = lRightExpressionAttachment.resolveType;
        }

        // Validate that rigth expression of shift operator needs to be a signed integer.
        if (lOperator === PgslOperator.ShiftLeft || lOperator === PgslOperator.ShiftRight) {
            // TODO: Must be variable.

            // TODO: right must be assignable to unsigned integer.
            // TODO: Left must be any integer.

            // TODO: When left is vector, right must be vector of same size.

            // Shift value must be numeric.
            // if (lRightExpressionTypeAttachment.baseType !== PgslBaseTypeName.Numeric) {
            //     if (!lRightValueType || (<PgslNumericTypeDefinitionSyntaxTree>lRightValueType).numericType !== PgslNumericTypeName.UnsignedInteger) {
            //         pTrace.pushError(`Right expression of a shift operation must be a unsigned integer.`, this.meta, this);
            //     }
            // }
        }

        // Both values need to be numeric.
        if (!(lLeftValueType instanceof PgslNumericTypeDefinition)) { // TODO: Cant do this, as alias types could be that as well.
            pTrace.pushError(`Binary operations can only be applied to numeric values.`, this.meta, this);
        }

        return {
            fixedState: Math.min(lLeftExpressionAttachment.fixedState, lRightExpressionAttachment.fixedState),
            isStorage: false,
            resolveType: lLeftExpressionAttachment.resolveType
        };
    }
}