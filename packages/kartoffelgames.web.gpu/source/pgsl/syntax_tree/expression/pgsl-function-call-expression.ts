import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../base-pgsl-syntax-tree';
import { PgslTemplateListSyntaxTree, PgslTemplateListSyntaxTreeStructureData } from '../general/pgsl-template-list-syntax-tree';
import { PgslExpressionSyntaxTree, PgslExpressionSyntaxTreeFactory, PgslExpressionSyntaxTreeStructureData } from './pgsl-expression-syntax-tree-factory';

export class PgslFunctionCallExpressionSyntaxTree extends BasePgslSyntaxTree<PgslFunctionCallExpressionSyntaxTreeStructureData['meta']['type'], PgslFunctionCallExpressionSyntaxTreeStructureData['data']> {
    private mName: string;
    private readonly mParameterList: Array<PgslExpressionSyntaxTree>;
    private mTemplateList: PgslTemplateListSyntaxTree | null;

    /**
     * Function name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Function parameter.
     */
    public get parameter(): Array<PgslExpressionSyntaxTree> {
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
     */
    public constructor() {
        super('Expression-FunctionCall');

        this.mName = '';
        this.mParameterList = new Array<PgslExpressionSyntaxTree>();
        this.mTemplateList = null;
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslFunctionCallExpressionSyntaxTreeStructureData['data']): void {
        // TODO: Validate function parameter and template.

        // Set name.
        this.mName = pData.name;

        // Add all parameter.
        this.mParameterList.push(...pData.parameterList.map((pParameter) => { return PgslExpressionSyntaxTreeFactory.createFrom(pParameter, this); }));

        // Add optional template list.
        if (pData.template) {
            this.mTemplateList = new PgslTemplateListSyntaxTree().applyDataStructure(pData.template, this);
        }
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslFunctionCallExpressionSyntaxTreeStructureData['data'] {
        // Basic structure data.
        const lData: PgslFunctionCallExpressionSyntaxTreeStructureData['data'] = {
            name: this.mName,
            parameterList: this.mParameterList.map((pParameter) => { return pParameter.retrieveDataStructure(); })
        };

        // Optional template list.
        if (this.mTemplateList) {
            lData.template = this.mTemplateList.retrieveDataStructure();
        }

        return lData;
    }
}

export type PgslFunctionCallExpressionSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Expression-FunctionCall', {
    name: string;
    parameterList: Array<PgslExpressionSyntaxTreeStructureData>;
    template?: PgslTemplateListSyntaxTreeStructureData;
}>;