import { PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { PgslTemplateListSyntaxTree } from '../general/pgsl-template-list-syntax-tree';
import { BasePgslExpressionSyntaxTree } from './base-pgsl-expression-syntax-tree';

/**
 * PGSL syntax tree of a function call expression with optional template list.
 */
export class PgslFunctionCallExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslFunctionCallExpressionSyntaxTreeStructureData> {
    private readonly mName: string;
    private readonly mParameterList: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;
    private readonly mTemplateList: PgslTemplateListSyntaxTree | null;

    /**
     * Function name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Function parameter.
     */
    public get parameter(): Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>> {
        return this.mParameterList;
    }

    /**
     * Function template.
     */
    public get templateList(): PgslTemplateListSyntaxTree | null {
        return this.mTemplateList;
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
    public constructor(pData: PgslFunctionCallExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mName = pData.name;
        this.mParameterList = pData.parameterList;
        this.mTemplateList = pData.template ?? null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidate(): void {
        // TODO: Validate function parameter and template.
    }
}

type PgslFunctionCallExpressionSyntaxTreeStructureData = {
    name: string;
    parameterList: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;
    template?: PgslTemplateListSyntaxTree;
};