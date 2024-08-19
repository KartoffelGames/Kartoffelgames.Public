import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../base-pgsl-syntax-tree';
import { PgslExpressionSyntaxTree, PgslExpressionSyntaxTreeStructureData } from '../expression/pgsl-expression-syntax-tree-factory';
import { PgslTypeDefinitionSyntaxTreeStructureData } from '../general/pgsl-type-definition-syntax-tree';

export class PgslVariableDeclarationStatementSyntaxTree extends BasePgslSyntaxTree<PgslVariableDeclarationStatementSyntaxTreeStructureData['meta']['type'], PgslVariableDeclarationStatementSyntaxTreeStructureData['data']> {
    private mConstant: boolean;
    private mExpression: PgslExpressionSyntaxTree | null;
    private mName: string;

    /**
     * Variable declaration is a constant value and can not be changed.
     */
    public get constant(): boolean {
        return this.mConstant;
    }

    /**
     * Expression reference.
     */
    public get expression(): PgslExpressionSyntaxTree {
        if (this.mExpression === null) {
            throw new Exception('Expression not set.', this);
        }

        return this.mExpression;
    }

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
        super('Statement-VariableDeclaration');

        this.mName = '';
        this.mExpression = null;
        this.mConstant = false;
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslVariableDeclarationStatementSyntaxTreeStructureData['data']): void {

    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslVariableDeclarationStatementSyntaxTreeStructureData['data'] {
        // Basic structure data.
        const lData:  PgslVariableDeclarationStatementSyntaxTreeStructureData['data'] =  {
            name: this.mName,
            statements: this.mStatementList.map((pParameter) => { return pParameter.retrieveDataStructure(); })
        };

        return lData;
    }
}

export type PgslVariableDeclarationStatementSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Statement-VariableDeclaration', {
    name: string;
    type: PgslTypeDefinitionSyntaxTreeStructureData;
    expression?: PgslExpressionSyntaxTreeStructureData;
}>;