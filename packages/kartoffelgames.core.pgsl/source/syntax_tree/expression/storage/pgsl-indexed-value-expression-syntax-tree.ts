import { Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { PgslNumericTypeName } from '../../type/enum/pgsl-numeric-type-name.enum.ts';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition-syntax-tree.ts";
import { PgslArrayTypeDefinitionSyntaxTree } from "../../type/pgsl-array-type-definition-syntax-tree.ts";
import { PgslMatrixTypeDefinitionSyntaxTree } from "../../type/pgsl-matrix-type-definition-syntax-tree.ts";
import { PgslNumericTypeDefinitionSyntaxTree } from "../../type/pgsl-numeric-type-definition-syntax-tree.ts";
import { PgslVectorTypeDefinitionSyntaxTree } from "../../type/pgsl-vector-type-definition-syntax-tree.ts";

/**
 * PGSL structure holding a variable with index expression.
 */
export class PgslIndexedValueExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
    private readonly mIndex: BasePgslExpressionSyntaxTree;
    private readonly mValue: BasePgslExpressionSyntaxTree;

    /**
     * Index expression of variable index expression.
     */
    public get index(): BasePgslExpressionSyntaxTree {
        return this.mIndex;
    }

    /**
     * Value reference.
     */
    public get value(): BasePgslExpressionSyntaxTree {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pValue: BasePgslExpressionSyntaxTree, pIndex: BasePgslExpressionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mIndex = pIndex;
        this.mValue = pValue;

        // Add data as child tree.
        this.appendChild(this.mValue, this.mIndex);
    }

    /**
     * Transpile current expression to WGSL code.
     */
    protected override onTranspile(): string {
      return `${this.mValue.transpile()}[${this.mIndex.transpile()}]`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Validate index and value expressions.
        this.mIndex.validate(pTrace);
        this.mValue.validate(pTrace);

        // Read the attachments from the value expression.
        const lValueAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mValue);
        const lValueResolveTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pTrace.getAttachment(lValueAttachment.resolveType);

        // Value needs to be indexable.
        if (!lValueResolveTypeAttachment.indexable) {
            pTrace.pushError('Value of index expression needs to be a indexable composite value.', this.mValue.meta, this);
        }

        // Read the attachments from the index expression.
        const lIndexAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mIndex);
        const lIndexResolveType: BasePgslTypeDefinitionSyntaxTree = lIndexAttachment.resolveType;

        // Value needs to be a unsigned numeric value.
        if (!(lIndexResolveType instanceof PgslNumericTypeDefinitionSyntaxTree) || lIndexResolveType.numericType !== PgslNumericTypeName.UnsignedInteger) {
            pTrace.pushError('Index needs to be a unsigned numeric value.', this.mIndex.meta, this);
        }

        const lResolveType: BasePgslTypeDefinitionSyntaxTree = (() => {
            switch (true) {
                case lValueAttachment.resolveType instanceof PgslArrayTypeDefinitionSyntaxTree: {
                    return lValueAttachment.resolveType.innerType;
                }

                case lValueAttachment.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree: {
                    return lValueAttachment.resolveType.innerType;
                }

                case lValueAttachment.resolveType instanceof PgslMatrixTypeDefinitionSyntaxTree: {
                    return lValueAttachment.resolveType.vectorType;
                }

                default: {
                    pTrace.pushError('Type does not support a index signature', this.mValue.meta,this);

                    // Somehow could have the same type.
                    return lValueAttachment.resolveType;
                }
            }
        })();

        return {
            fixedState: Math.min(lValueAttachment.fixedState, lIndexAttachment.fixedState),
            isStorage: true,
            resolveType: lResolveType
        };
    }
}
