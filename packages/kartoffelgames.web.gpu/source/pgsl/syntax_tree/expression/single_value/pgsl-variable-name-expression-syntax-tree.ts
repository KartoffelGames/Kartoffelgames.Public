import { Exception } from '@kartoffelgames/core';
import { PgslVariableDeclarationSyntaxTree } from '../../declarations/pgsl-variable-declaration-syntax-tree';
import { PgslVariableDeclarationStatementSyntaxTree } from '../../statement/pgsl-variable-declaration-statement-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/base-pgsl-type-definition-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';

/**
 * PGSL structure holding single variable name.
 */
export class PgslVariableNameExpressionSyntaxTree extends BasePgslSingleValueExpressionSyntaxTree<PgslVariableNameExpressionSyntaxTreeStructureData> {
    private readonly mName: string;

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
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
    public constructor(pData: PgslVariableNameExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mName = pData.name;
    }

    /**
     * On constant state request.
     */
    protected determinateIsConstant(): boolean {
        // Expression is constant when variable is a constant.
        return this.scopedVariables.get(this.mName)!.isConstant;
    }

    /**
     * On type resolve of expression
     */
    protected determinateResolveType(): BasePgslTypeDefinitionSyntaxTree {
        // Input type is output type.
        return this.scopedVariables.get(this.mName)!.typeDeclaration.type;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Read declaration of variable.
        const lDeclaration: PgslVariableDeclarationStatementSyntaxTree | PgslVariableDeclarationSyntaxTree | undefined = this.scopedVariables.get(this.mName);

        // Catch undefined variables.
        if (!lDeclaration) {
            throw new Exception(`Variable "${this.name}" not defined.`, this);
        }
    }
}

export type PgslVariableNameExpressionSyntaxTreeStructureData = {
    name: string;
};