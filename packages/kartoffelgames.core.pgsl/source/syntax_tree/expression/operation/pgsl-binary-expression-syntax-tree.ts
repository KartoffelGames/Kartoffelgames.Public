import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { PgslNumericTypeName } from '../../type/enum/pgsl-numeric-type-name.enum.ts';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression-syntax-tree.ts';
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition-syntax-tree.ts";
import { PgslNumericTypeDefinitionSyntaxTree } from "../../type/pgsl-numeric-type-definition-syntax-tree.ts";
import { PgslVectorTypeDefinitionSyntaxTree } from "../../type/pgsl-vector-type-definition-syntax-tree.ts";

export class PgslBinaryExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
    private readonly mLeftExpression: BasePgslExpressionSyntaxTree;
    private readonly mOperatorName: string;
    private readonly mRightExpression: BasePgslExpressionSyntaxTree;

    /**
     * Left expression reference.
     */
    public get leftExpression(): BasePgslExpressionSyntaxTree {
        return this.mLeftExpression;
    }

    /**
     * Right expression reference.
     */
    public get rightExpression(): BasePgslExpressionSyntaxTree {
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
    public constructor(pLeft: BasePgslExpressionSyntaxTree, pOperator: string, pRight: BasePgslExpressionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
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
     * @returns WGSL code.
     */
    protected override onTranspile(): string {
        return `${this.mLeftExpression.transpile()} ${this.mOperatorName} ${this.mRightExpression.transpile()}`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
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
        let lLeftValueType: BasePgslTypeDefinitionSyntaxTree;
        let lRightValueType: BasePgslTypeDefinitionSyntaxTree;

        // Validate vectors differently.
        if (lLeftExpressionAttachment.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) {
            lLeftValueType = lLeftExpressionAttachment.resolveType.innerType;

            // Left and right must be a vector.
            if (!(lRightExpressionAttachment.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree)) {
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
            // Shift value must be numeric.
            if (lRightExpressionTypeAttachment.baseType !== PgslBaseTypeName.Numeric) {
                if (!lRightValueType || (<PgslNumericTypeDefinitionSyntaxTree>lRightValueType).numericType !== PgslNumericTypeName.UnsignedInteger) {
                    pTrace.pushError(`Right expression of a shift operation must be a unsigned integer.`, this.meta, this);
                }
            }
        }

        // Both values need to be numeric.
        if (!(lLeftValueType instanceof PgslNumericTypeDefinitionSyntaxTree)) {
            pTrace.pushError(`Binary operations can only be applied to numeric values.`, this.meta, this);
        }

        return {
            fixedState: Math.min(lLeftExpressionAttachment.fixedState, lRightExpressionAttachment.fixedState),
            isStorage: false,
            resolveType: lLeftExpressionAttachment.resolveType
        };
    }
}