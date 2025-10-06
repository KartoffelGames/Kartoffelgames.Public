import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslFileMetaInformation } from "../../pgsl-build-result.ts";
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition.ts";
import { PgslNumericTypeName } from '../../type/enum/pgsl-numeric-type-name.enum.ts';
import { PgslArrayTypeDefinition } from "../../type/pgsl-array-type-definition.ts";
import { PgslMatrixTypeDefinition } from "../../type/pgsl-matrix-type-definition.ts";
import { PgslNumericTypeDefinition } from "../../type/pgsl-numeric-type-definition.ts";
import { PgslVectorTypeDefinition } from "../../type/pgsl-vector-type-definition.ts";
import { PgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../pgsl-expression.ts';

/**
 * PGSL structure holding a variable with index expression.
 */
export class PgslIndexedValueExpression extends PgslExpression {
    private readonly mIndex: PgslExpression;
    private readonly mValue: PgslExpression;

    /**
     * Index expression of variable index expression.
     */
    public get index(): PgslExpression {
        return this.mIndex;
    }

    /**
     * Value reference.
     */
    public get value(): PgslExpression {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pValue: PgslExpression, pIndex: PgslExpression, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mIndex = pIndex;
        this.mValue = pValue;

        // Add data as child tree.
        this.appendChild(this.mValue, this.mIndex);
    }

    /**
     * Transpile current expression to WGSL code.
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns WGSL code of current expression.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
      return `${this.mValue.transpile(pTrace)}[${this.mIndex.transpile(pTrace)}]`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
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
        const lIndexResolveType: BasePgslTypeDefinition = lIndexAttachment.resolveType;

        // Value needs to be a unsigned numeric value. // TODO: Dont check for instance as Alias still can be a numeric type.
        if (!(lIndexResolveType instanceof PgslNumericTypeDefinition) || lIndexResolveType.numericType !== PgslNumericTypeName.UnsignedInteger) {  // TODO: Cant do this, as alias types could be that as well.
            pTrace.pushError('Index needs to be a unsigned numeric value.', this.mIndex.meta, this);
        }

        const lResolveType: BasePgslTypeDefinition = (() => {
            switch (true) {
                case lValueAttachment.resolveType instanceof PgslArrayTypeDefinition: { // TODO: Cant do this, as alias types could be that as well.
                    return lValueAttachment.resolveType.innerType;
                }

                case lValueAttachment.resolveType instanceof PgslVectorTypeDefinition: {  // TODO: Cant do this, as alias types could be that as well.
                    return lValueAttachment.resolveType.innerType;
                }

                case lValueAttachment.resolveType instanceof PgslMatrixTypeDefinition: { // TODO: Cant do this, as alias types could be that as well.
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
