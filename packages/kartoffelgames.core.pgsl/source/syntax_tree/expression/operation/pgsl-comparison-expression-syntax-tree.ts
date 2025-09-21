import { EnumUtil } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition-syntax-tree.ts";
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { PgslBooleanTypeDefinitionSyntaxTree } from "../../type/pgsl-boolean-type-definition-syntax-tree.ts";
import { PgslVectorTypeDefinitionSyntaxTree } from "../../type/pgsl-vector-type-definition-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment, } from '../base-pgsl-expression-syntax-tree.ts';

/**
 * PGSL structure for a comparison expression between two values.
 */
export class PgslComparisonExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
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
        let lValueType: BasePgslTypeDefinitionSyntaxTree;

        // Validate vectors differently.
        if (lLeftExpressionAttachment.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) { // TODO: Cant do this, as alias types could be vectors as well.
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
        const lResolveType: BasePgslTypeDefinitionSyntaxTree = (() => {
            const lBooleanDefinition: PgslBooleanTypeDefinitionSyntaxTree = new PgslBooleanTypeDefinitionSyntaxTree({
                range: [
                    this.meta.position.start.line,
                    this.meta.position.start.column,
                    this.meta.position.end.line,
                    this.meta.position.end.column,
                ]
            });

            // Wrap boolean into a vector when it is a vector expression.
            if (lLeftExpressionAttachment.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree) {  // TODO: Cant do this, as alias types could be vectors as well.
                return new PgslVectorTypeDefinitionSyntaxTree(lLeftExpressionAttachment.resolveType.vectorDimension, lBooleanDefinition, {
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