import { PgslSyntaxTreeInitData } from '../../base-pgsl-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';

/**
 * PGSL structure holding a single value of a decomposited composite value.
 */
export class PgslValueDecompositionExpressionSyntaxTree extends BasePgslSingleValueExpressionSyntaxTree<PgslValueDecompositionExpressionSyntaxTreeStructureData> {
    private readonly mProperty: string;
    private readonly mValue:  BasePgslSingleValueExpressionSyntaxTree<PgslSyntaxTreeInitData>;

    /**
     * Index expression of variable index expression.
     */
    public get property(): string {
        return this.mProperty;
    }

    /**
     * Value reference.
     */
    public get value():  BasePgslSingleValueExpressionSyntaxTree<PgslSyntaxTreeInitData> {
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
    public constructor(pData: PgslValueDecompositionExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mProperty = pData.property;
        this.mValue = pData.value;
    }
    
    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Validate value to be a composition object and haves the property.
        // Only structs, matrix or vector types.
    }
}

type PgslValueDecompositionExpressionSyntaxTreeStructureData = {
    value: BasePgslSingleValueExpressionSyntaxTree<PgslSyntaxTreeInitData>;
    property: string;
};