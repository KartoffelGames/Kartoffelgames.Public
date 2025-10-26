import { PgslValueAddressSpace } from "../../../enum/pgsl-value-address-space.enum.ts";
import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import { PgslExpressionTrace } from "../../../trace/pgsl-expression-trace.ts";
import { PgslTrace } from "../../../trace/pgsl-trace.ts";
import { PgslStringType } from "../../../type/pgsl-string-type.ts";
import { type BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslExpression } from '../pgsl-expression.ts';

/**
 * PGSL syntax tree for a single string value of boolean, float, integer or uinteger.
 */
export class PgslStringValueExpression extends PgslExpression {
    private readonly mValue: string;

    /**
     * Value of literal.
     */
    public get value(): string {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pTextValue - Text value.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pTextValue: string, pMeta?: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mValue = pTextValue;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace {
        return new PgslExpressionTrace({
            fixedState: PgslValueFixedState.Constant,
            isStorage: false,
            resolveType: new PgslStringType(pTrace),
            constantValue: this.mValue,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        });
    }
}