import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { PgslPointerTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-pointer-type-definition-syntax-tree';
import { PgslBaseType } from '../../type/enum/pgsl-base-type.enum';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeSetupData } from '../base-pgsl-expression-syntax-tree';

/**
 * PGSL structure holding a variable name used as a pointer value.
 */
export class PgslPointerExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
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
     * @param pVariable - Pointered variable.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pVariable: BasePgslExpressionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mVariable = pVariable;
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data.
     */
    protected override onSetup(): PgslExpressionSyntaxTreeSetupData {
        // Validate that it needs to be a variable name, index value or value decomposition.
        if (this.mVariable.resolveType.baseType !== PgslBaseType.Pointer) {
            throw new Exception('Value of a pointer expression needs to be a pointer', this);
        }

        // Pointer value will allways be a pointer.
        const lPointerType: PgslPointerTypeDefinitionSyntaxTree = this.mVariable.resolveType as PgslPointerTypeDefinitionSyntaxTree;

        return {
            expression: {
                isFixed: this.mVariable.isCreationFixed,
                isStorage: true,
                resolveType: lPointerType.referencedType,
                isConstant: this.mVariable.isConstant
            },
            data: null
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Validate that it needs to be a variable name, index value or value decomposition.
        if (this.mVariable.resolveType.baseType !== PgslBaseType.Pointer) {
            throw new Exception('Value of a pointer expression needs to be a pointer', this);
        }
    }
}