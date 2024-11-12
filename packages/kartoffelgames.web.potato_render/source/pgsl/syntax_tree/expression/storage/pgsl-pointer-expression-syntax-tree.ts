import { Exception } from '@kartoffelgames/core';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslPointerTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-pointer-type-definition-syntax-tree';
import { PgslTypeName } from '../../type/enum/pgsl-type-name.enum';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';

/**
 * PGSL structure holding a variable name used as a pointer value.
 */
export class PgslPointerExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslPointerExpressionSyntaxTreeStructureData> {
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
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslPointerExpressionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

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
     * On creation fixed state request.
     */
    protected override determinateIsCreationFixed(): boolean {
        // Expression is constant when variable is a constant.
        return this.mVariable.isCreationFixed;
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
        // Pointer value will allways be a pointer.
        const lPointerType: PgslPointerTypeDefinitionSyntaxTree = this.mVariable.resolveType as PgslPointerTypeDefinitionSyntaxTree;

        // Pointer expression returns refered type.
        return lPointerType.referencedType;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Validate that it needs to be a variable name, index value or value decomposition.
        if (this.mVariable.resolveType.baseType !== PgslTypeName.Pointer) {
            throw new Exception('Value of a pointer expression needs to be a pointer', this);
        }
    }
}

export type PgslPointerExpressionSyntaxTreeStructureData = {
    variable: BasePgslExpressionSyntaxTree;
};