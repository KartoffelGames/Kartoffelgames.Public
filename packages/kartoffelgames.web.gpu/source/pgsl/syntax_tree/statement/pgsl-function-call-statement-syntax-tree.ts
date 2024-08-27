import { PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';

/**
 * PGSL syntax tree of a function call statement with optional template list.
 */
export class PgslFunctionCallStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslFunctionCallStatementSyntaxTreeStructureData> {
    private readonly mName: string;
    private readonly mParameterList: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;

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
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslFunctionCallStatementSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mName = pData.name;
        this.mParameterList = pData.parameterList;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Validate function parameter and template.
    }
}

type PgslFunctionCallStatementSyntaxTreeStructureData = {
    name: string;
    parameterList: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;
};