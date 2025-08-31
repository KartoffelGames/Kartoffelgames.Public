import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { PgslStringTypeDefinitionSyntaxTree } from "../../type/pgsl-string-type-definition-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression-syntax-tree.ts';

/**
 * PGSL syntax tree for a single string value of boolean, float, integer or uinteger.
 */
export class PgslStringValueExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
    private readonly mValue: string;
    private readonly mType: PgslStringTypeDefinitionSyntaxTree;

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
    public constructor(pTextValue: string, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mValue = pTextValue.substring(1, pTextValue.length - 1);

        // Create type declaration.
        this.mType = new PgslStringTypeDefinitionSyntaxTree({
            range: [
                this.meta.position.start.line,
                this.meta.position.start.column,
                this.meta.position.end.line,
                this.meta.position.end.column,
            ]
        });

        // Append type as child.
        this.appendChild(this.mType);
    }

    /**
     * Transpile current expression to WGSL code.
     */
    protected override onTranspile(): string {
        return this.mValue;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        this.mType.validate(pTrace);

        return {
            fixedState: PgslValueFixedState.Constant,
            isStorage: false,
            resolveType: this.mType
        };
    }
}