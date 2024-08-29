import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslPointerTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-pointer-type-definition-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';

/**
 * PGSL structure holding a variable name used to get the address.
 */
export class PgslAddressOfExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslAddressOfExpressionSyntaxTreeStructureData> {
    private readonly mVariable: BasePgslExpressionSyntaxTree;

    /**
     * Variable reference.
     */
    public get variable(): BasePgslExpressionSyntaxTree {
        return this.mVariable;
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
    public constructor(pData: PgslAddressOfExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mVariable = pData.variable;
    }

    /**
     * On constant state request.
     */
    protected determinateIsConstant(): boolean {
        // Expression is constant when variable is a constant.
        return this.mVariable.isConstant;
    }

    /**
     * On is storage set.
     */
    protected determinateIsStorage(): boolean {
        return false;
    }

    /**
     * On type resolve of expression
     */
    protected determinateResolveType(): BasePgslTypeDefinitionSyntaxTree {
        // Create type declaration.
        const lTypeDeclaration: PgslPointerTypeDefinitionSyntaxTree = new PgslPointerTypeDefinitionSyntaxTree({
            // TODO: this.mVariable.resolveType
        }, 0, 0, 0, 0);

        // Set parent to this tree.
        lTypeDeclaration.setParent(this);

        // Validate type.
        lTypeDeclaration.validateIntegrity();

        // Set resolve type.
        return lTypeDeclaration;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Needs to be a special type.. storable, hostsharable???

        // TODO: No vector item.
    }
}

type PgslAddressOfExpressionSyntaxTreeStructureData = {
    variable: BasePgslExpressionSyntaxTree;
};