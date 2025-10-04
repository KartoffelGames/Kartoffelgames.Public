import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslFileMetaInformation } from "../../pgsl-build-result.ts";
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { PgslStringTypeDefinition } from "../../type/pgsl-string-type-definition.ts";
import { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression.ts';

/**
 * PGSL syntax tree for a single string value of boolean, float, integer or uinteger.
 */
export class PgslStringValueExpression extends BasePgslExpression {
    private readonly mValue: string;
    private readonly mType: PgslStringTypeDefinition;

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
        this.mValue = pTextValue.substring(1, pTextValue.length - 1);

        // Create type declaration.
        this.mType = new PgslStringTypeDefinition(BasePgslSyntaxTree.convertMeta(this.meta));

        // Append type as child.
        this.appendChild(this.mType);
    }

    /**
     * Transpile current expression to WGSL code.
     * 
     * @param _pTrace - Transpilation trace.
     * 
     * @returns WGSL code of current expression.
     */
    protected override onTranspile(_pTrace: PgslFileMetaInformation): string {
        return this.mValue;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        this.mType.validate(pTrace);

        return {
            fixedState: PgslValueFixedState.Constant,
            isStorage: false,
            resolveType: this.mType
        };
    }
}