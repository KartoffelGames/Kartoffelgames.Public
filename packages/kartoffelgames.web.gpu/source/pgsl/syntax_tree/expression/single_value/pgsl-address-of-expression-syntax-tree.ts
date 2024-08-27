import { BasePgslTypeDefinitionSyntaxTree } from '../../type/base-pgsl-type-definition-syntax-tree';
import { PgslPointerTypeDefinitionSyntaxTree } from '../../type/pgsl-pointer-type-definition-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';

/**
 * PGSL structure holding a variable name used to get the address.
 */
export class PgslAddressOfExpressionSyntaxTree extends BasePgslSingleValueExpressionSyntaxTree<PgslAddressOfExpressionSyntaxTreeStructureData> {
    private readonly mVariable: BasePgslSingleValueExpressionSyntaxTree;

    /**
     * Variable reference.
     */
    public get variable(): BasePgslSingleValueExpressionSyntaxTree {
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
    protected onConstantStateSet(): boolean {
        // Expression is constant when variable is a constant.
        return this.mVariable.isConstant;
    }

    /**
     * On type resolve of expression
     */
    protected onResolveType(): BasePgslTypeDefinitionSyntaxTree {
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
    }
}

type PgslAddressOfExpressionSyntaxTreeStructureData = {
    variable: BasePgslSingleValueExpressionSyntaxTree;
};