import { Exception } from '@kartoffelgames/core';
import { IPgslVariableDeclarationSyntaxTree } from '../../interface/i-pgsl-variable-declaration-syntax-tree.interface';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';

/**
 * PGSL structure holding single variable name.
 */
export class PgslVariableNameExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslVariableNameExpressionSyntaxTreeStructureData> {
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
     * On creation fixed state request.
     */
    protected override determinateIsCreationFixed(): boolean {
        // Expression is constant when variable is a constant.
        return this.scopedVariables.get(this.mName)!.isCreationFixed;
    }

    /**
     * On is storage set.
     */
    protected determinateIsStorage(): boolean {
        return true;
    }

    /**
     * On type resolve of expression
     */
    protected determinateResolveType(): BasePgslTypeDefinitionSyntaxTree {
        // Input type is output type.
        return this.scopedVariables.get(this.mName)!.type;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Read declaration of variable.
        const lDeclaration: IPgslVariableDeclarationSyntaxTree | undefined = this.scopedVariables.get(this.mName);

        // Catch undefined variables.
        if (!lDeclaration) {
            throw new Exception(`Variable "${this.name}" not defined.`, this);
        }
    }
}

export type PgslVariableNameExpressionSyntaxTreeStructureData = {
    name: string;
};