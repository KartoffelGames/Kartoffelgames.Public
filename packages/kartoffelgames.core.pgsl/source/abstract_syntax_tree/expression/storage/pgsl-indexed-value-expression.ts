import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import { PgslArrayType } from '../../../type/pgsl-array-type.ts';
import { PgslMatrixType } from '../../../type/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../type/pgsl-numeric-type.ts';
import type { PgslType } from '../../../type/pgsl-type.ts';
import { PgslVectorType } from '../../../type/pgsl-vector-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../../abstract-syntax-tree.ts';
import { ExpressionAst } from '../pgsl-expression.ts';

/**
 * PGSL structure holding a variable with index expression.
 */
export class PgslIndexedValueExpression extends ExpressionAst {
    private readonly mIndex: ExpressionAst;
    private readonly mValue: ExpressionAst;

    /**
     * Index expression of variable index expression.
     */
    public get index(): ExpressionAst {
        return this.mIndex;
    }

    /**
     * Value reference.
     */
    public get value(): ExpressionAst {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pValue: ExpressionAst, pIndex: ExpressionAst, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mIndex = pIndex;
        this.mValue = pValue;

        // Add data as child tree.
        this.appendChild(this.mValue, this.mIndex);
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace {
        // Validate index and value expressions.
        this.mIndex.trace(pTrace);
        this.mValue.trace(pTrace);

        // Read the attachments from the value expression.
        const lValueTrace: PgslExpressionTrace = pTrace.getExpression(this.mValue);

        // Value needs to be indexable.
        if (!lValueTrace.resolveType.indexable) {
            pTrace.pushIncident('Value of index expression needs to be a indexable composite value.', this.mValue);
        }

        // Read the attachments from the index expression.
        const lIndexTrace: PgslExpressionTrace = pTrace.getExpression(this.mIndex);

        // Value needs to be a unsigned numeric value.
        if (!lIndexTrace.resolveType.isImplicitCastableInto(new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger))) {
            pTrace.pushIncident('Index needs to be a unsigned numeric value.', this.mIndex);
        }

        const lResolveType: PgslType = (() => {
            switch (true) {
                case lValueTrace.resolveType instanceof PgslArrayType: {
                    return lValueTrace.resolveType.innerType;
                }

                case lValueTrace.resolveType instanceof PgslVectorType: {
                    return lValueTrace.resolveType.innerType;
                }

                case lValueTrace.resolveType instanceof PgslMatrixType: {
                    return lValueTrace.resolveType.vectorType;
                }

                default: {
                    pTrace.pushIncident('Type does not support a index signature', this);

                    // Somehow could have the same type.
                    return lValueTrace.resolveType;
                }
            }
        })();

        return new PgslExpressionTrace({
            fixedState: PgslValueFixedState.Variable,
            isStorage: true,
            resolveType: lResolveType,
            constantValue: null,
            storageAddressSpace: lValueTrace.storageAddressSpace
        });
    }
}
