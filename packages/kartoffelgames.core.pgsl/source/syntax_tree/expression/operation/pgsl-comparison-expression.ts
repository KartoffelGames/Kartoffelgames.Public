import { EnumUtil } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslExpressionTrace } from "../../../trace/pgsl-expression-trace.ts";
import { PgslTrace } from "../../../trace/pgsl-trace.ts";
import { PgslBooleanType } from "../../../type/pgsl-boolean-type.ts";
import { PgslType } from "../../../type/pgsl-type.ts";
import { PgslVectorType } from "../../../type/pgsl-vector-type.ts";
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslExpression, } from '../pgsl-expression.ts';
import { PgslValueAddressSpace } from "../../../enum/pgsl-value-address-space.enum.ts";

/**
 * PGSL structure for a comparison expression between two values.
 */
export class PgslComparisonExpression extends PgslExpression {
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
     * Operator name.
     */
    public get operatorName(): string {
        return this.mOperatorName;
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
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace {
        // Validate left and right expressions.
        this.mLeftExpression.trace(pTrace);
        this.mRightExpression.trace(pTrace);

        // Try to convert operator.
        const lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.mOperatorName);

        // Create list of all comparison operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.Equal,
            PgslOperator.NotEqual,
            PgslOperator.LowerThan,
            PgslOperator.LowerThanEqual,
            PgslOperator.GreaterThan,
            PgslOperator.GreaterThanEqual
        ];

        // Validate operator usable for comparisons.
        if (!lComparisonList.includes(lOperator as PgslOperator)) {
            pTrace.pushIncident(`Operator "${this.mOperatorName}" can not used for comparisons.`, this);
        }

        // Read left and right expression attachments.
        const lLeftExpressionTrace: PgslExpressionTrace = pTrace.getExpression(this.mLeftExpression);
        const lRightExpressionTrace: PgslExpressionTrace = pTrace.getExpression(this.mRightExpression);

        // Comparison needs to be the same type or implicitly castable.
        if (!lRightExpressionTrace.resolveType.isImplicitCastableInto(lLeftExpressionTrace.resolveType)) {
            pTrace.pushIncident(`Comparison can only be between values of the same type.`, this);
        }

        // Type buffer for validating the processed types.
        let lValueType: PgslType;

        // Validate vectors differently.
        if (lLeftExpressionTrace.resolveType instanceof PgslVectorType) {
            lValueType = lLeftExpressionTrace.resolveType.innerType;
        } else {
            lValueType = lLeftExpressionTrace.resolveType;
        }

        // Both values need to be numeric or boolean.
        if (!lValueType.scalar) {
            pTrace.pushIncident(`Comparison can only be between scalar values.`, this);
        }

        // Validate boolean compare.
        if (![PgslOperator.Equal, PgslOperator.NotEqual].includes(lOperator as PgslOperator) && lValueType instanceof PgslBooleanType) {
            pTrace.pushIncident(`Boolean can only be compares with "NotEqual" or "Equal"`, this);
        }

        // Any value is converted into a boolean type.
        const lResolveType: PgslType = (() => {
            const lBooleanDefinition: PgslBooleanType = new PgslBooleanType(pTrace);

            // Wrap boolean into a vector when it is a vector expression.
            if (lLeftExpressionTrace.resolveType instanceof PgslVectorType) {
                return new PgslVectorType(pTrace, lLeftExpressionTrace.resolveType.dimension, lBooleanDefinition);
            }

            return lBooleanDefinition;
        })();

        return new PgslExpressionTrace({
            fixedState: Math.min(lLeftExpressionTrace.fixedState, lRightExpressionTrace.fixedState),
            isStorage: false,
            resolveType: lResolveType,
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        });
    }
}