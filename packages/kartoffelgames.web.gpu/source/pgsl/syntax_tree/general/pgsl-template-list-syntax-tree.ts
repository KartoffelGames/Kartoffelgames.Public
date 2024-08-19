import { BasePgslSyntaxTree, PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslTypeDefinitionSyntaxTree } from './pgsl-type-definition-syntax-tree';

/**
 * Template list parameter.
 */
export class PgslTemplateListSyntaxTree extends BasePgslSyntaxTree<PgslTemplateListSyntaxTreeStructureData> {
    private readonly mItems: Array<PgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;

    /**
     * Parameter list.
     */
    public get items(): Array<PgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>> {
        return [...this.mItems];
    }

    /**
     * List size.
     */
    public get size(): number {
        return this.mItems.length;
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
    public constructor(pData: PgslTemplateListSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mItems = pData.parameterList;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidate(): void {
        // Nothing really to validate.
    }
}

type PgslTemplateListSyntaxTreeStructureData = {
    parameterList: Array<PgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;
};