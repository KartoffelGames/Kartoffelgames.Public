import { Exception } from '@kartoffelgames/core';
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
        // A address is allways a constant.
        return true;
    }

    /**
     * On creation fixed state request.
     */
    protected override determinateIsCreationFixed(): boolean {
        // A address is allways a creation fixed value.
        return true;
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
        return new PgslPointerTypeDefinitionSyntaxTree({
            referencedType: this.mVariable.resolveType
        }, 0, 0, 0, 0).setParent(this).validateIntegrity();
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Type of expression needs to be storable.
        if(!this.mVariable.isStorage) {
            throw new Exception(`Target of address needs to a stored value`, this);
        }

        // Type of expression needs to be storable.
        if(!this.mVariable.resolveType.isStorable) {
            throw new Exception(`Target of address needs to storable`, this);
        }

        // TODO: No vector item.
    }
}

type PgslAddressOfExpressionSyntaxTreeStructureData = {
    variable: BasePgslExpressionSyntaxTree;
};