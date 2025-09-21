import { EnumUtil } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { PgslNumericTypeDefinitionSyntaxTree } from "../../type/pgsl-numeric-type-definition-syntax-tree.ts";
import { PgslVectorTypeDefinitionSyntaxTree } from "../../type/pgsl-vector-type-definition-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression-syntax-tree.ts';

export class PgslArithmeticExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
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
        if (lLeftExpressionAttachment.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) {  // TODO: Cant do this, as alias types could be vectors as well.
            // Validate left side vector type. Right ist the same type.
            if (!(lLeftExpressionAttachment.resolveType.innerType instanceof PgslNumericTypeDefinitionSyntaxTree)) { // TODO: Cant do this, as alias types could be that as well.
                pTrace.pushError('Left and right side of arithmetic expression must be a numeric vector value', this.meta, this);
            }
        } else {
            // Validate left side type. Right ist the same type.
            if (!(lLeftExpressionAttachment.resolveType instanceof PgslNumericTypeDefinitionSyntaxTree)) { // TODO: Cant do this, as alias types could be that as well.
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