import { PgslBuildInTypeName } from '../../../enum/pgsl-type-name.enum';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';

/**
 * PGSL syntax tree for a single string value of boolean, float, integer or uinteger.
 */
export class PgslStringValueExpressionSyntaxTree extends BasePgslSingleValueExpressionSyntaxTree<PgslStringValueExpressionSyntaxTreeStructureData> {
    private readonly mValue: string;

    /**
     * Type name of literal value.
     */
    public get type(): PgslBuildInTypeName {
        return PgslBuildInTypeName.String;
    }

    /**
     * Value of literal.
     */
    public get value(): string {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslStringValueExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mValue = pData.textValue.substring(1, pData.textValue.length - 1);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing to validate 
    }

}

export type PgslStringValueExpressionSyntaxTreeStructureData = {
    textValue: string;
};