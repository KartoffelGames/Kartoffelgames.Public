import { PgslExpressionTrace } from "../../../trace/pgsl-expression-trace.ts";
import { PgslTrace } from "../../../trace/pgsl-trace.ts";
import { PgslPointerType } from "../../../type/pgsl-pointer-type.ts";
import { PgslType } from "../../../type/pgsl-type.ts";
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslExpression } from '../pgsl-expression.ts';

/**
 * PGSL structure holding a variable name used to get the address.
 */
export class PgslAddressOfExpression extends PgslExpression {
    private readonly mVariable: PgslExpression;

    /**
     * Variable reference.
     */
    public get variable(): PgslExpression {
        return this.mVariable;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pVariable: PgslExpression, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mVariable = pVariable;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace {
        // Validate variable.
        this.mVariable.trace(pTrace);

        // Read attachment of inner expression.
        const lVariableTrace: PgslExpressionTrace = pTrace.getExpression(this.mVariable);

        // Type of expression needs to be storable.
        if (!lVariableTrace.isStorage) {
            pTrace.pushIncident(`Target of address needs to a stored value`, this);
        }

        // Read type attachment of variable.
        const lVariableResolveType: PgslType = lVariableTrace.resolveType;

        // Type of expression needs to be storable.
        if (!lVariableResolveType.storable) {
            pTrace.pushIncident(`Target of address needs to storable`, this);
        }

        // TODO: No vector item.

        return new PgslExpressionTrace({
            fixedState: lVariableTrace.fixedState,
            isStorage: false,
            resolveType: new PgslPointerType(pTrace, lVariableResolveType),
            constantValue: null,
            storageAddressSpace: lVariableTrace.storageAddressSpace
        });
    }
}