import { EnumUtil } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition.ts";
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { PgslBooleanTypeDefinition } from "../../type/pgsl-boolean-type-definition.ts";
import { PgslVectorTypeDefinition } from "../../type/pgsl-vector-type-definition.ts";
import { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment, } from '../base-pgsl-expression.ts';
import { PgslFileMetaInformation } from "../../pgsl-build-result.ts";

/**
 * PGSL structure for a comparison expression between two values.
 */
export class PgslComparisonExpression extends BasePgslExpression {
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
            pTrace.pushError(`Operator "${this.mOperatorName}" can not used for comparisons.`, this.meta, this);
        }

        // Read left and right expression attachments.
        const lLeftExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mLeftExpression);
        const lRightExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mRightExpression);

        // Comparison needs to be the same type or implicitly castable.
        if (!lRightExpressionAttachment.resolveType.isImplicitCastableInto(pTrace, lLeftExpressionAttachment.resolveType)) {
            pTrace.pushError(`Comparison can only be between values of the same type.`, this.meta, this);
        }

        // Type buffer for validating the processed types.
        let lValueType: BasePgslTypeDefinition;

        // Validate vectors differently.
        if (lLeftExpressionAttachment.resolveType instanceof PgslVectorTypeDefinition) { // TODO: Cant do this, as alias types could be vectors as well.
            lValueType = lLeftExpressionAttachment.resolveType.innerType;
        } else {
            lValueType = lLeftExpressionAttachment.resolveType;
        }

        // Read value type attachment.
        const lValueTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pTrace.getAttachment(lValueType);

        // TODO: Values must be same type.
        // TODO: Values must be scalar or same scalar vector type .

        // Both values need to be numeric or boolean.
        if (lValueTypeAttachment.baseType !== PgslBaseTypeName.Float && lValueTypeAttachment.baseType !== PgslBaseTypeName.Integer && lValueTypeAttachment.baseType !== PgslBaseTypeName.Boolean) {
            pTrace.pushError(`None numeric or boolean values can't be compared`, this.meta, this);
        }

        // Validate boolean compare.
        if (![PgslOperator.Equal, PgslOperator.NotEqual].includes(lOperator as PgslOperator)) {
            if (lValueTypeAttachment.baseType === PgslBaseTypeName.Boolean) {
                pTrace.pushError(`Boolean can only be compares with "NotEqual" or "Equal"`, this.meta, this);
            }
        }

        // Any value is converted into a boolean type.
        const lResolveType: BasePgslTypeDefinition = (() => {
            const lBooleanDefinition: PgslBooleanTypeDefinition = new PgslBooleanTypeDefinition({
                range: [
                    this.meta.position.start.line,
                    this.meta.position.start.column,
                    this.meta.position.end.line,
                    this.meta.position.end.column,
                ]
            });

            // Wrap boolean into a vector when it is a vector expression.
            if (lLeftExpressionAttachment.resolveType instanceof PgslVectorTypeDefinition) {  // TODO: Cant do this, as alias types could be vectors as well.
                return new PgslVectorTypeDefinition(lLeftExpressionAttachment.resolveType.vectorDimension, lBooleanDefinition, {
                    range: [
                        this.meta.position.start.line,
                        this.meta.position.start.column,
                        this.meta.position.end.line,
                        this.meta.position.end.column,
                    ]
                });
            }

            return lBooleanDefinition;
        })();

        return {
            fixedState: Math.min(lLeftExpressionAttachment.fixedState, lRightExpressionAttachment.fixedState),
            isStorage: false,
            resolveType: lResolveType
        };
    }
}