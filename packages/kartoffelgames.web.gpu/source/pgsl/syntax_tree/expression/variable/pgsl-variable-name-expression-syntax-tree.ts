import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../../base-pgsl-syntax-tree';

/**
 * PGSL structure holding single variable name.
 */
export class PgslVariableNameExpressionSyntaxTree extends BasePgslSyntaxTree<PgslVariableNameExpressionSyntaxTreeStructureData['meta']['type'], PgslVariableNameExpressionSyntaxTreeStructureData['data']> {
    private mName: string;

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Expression-VariableName');

        this.mName = '';
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslVariableNameExpressionSyntaxTreeStructureData['data']): void {
        // TODO: Validate existance of variable name in current scope.

        this.mName = pData.name;
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslVariableNameExpressionSyntaxTreeStructureData['data'] {
        return {
            name: this.mName
        };
    }
}

export type PgslVariableNameExpressionSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Expression-VariableName', {
    name: string;
}>;