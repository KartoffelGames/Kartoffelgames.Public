import { UnknownPgslSyntaxTree } from '../base-pgsl-syntax-tree';
import { PgslAddressOfExpressionSyntaxTree, PgslAddressOfExpressionSyntaxTreeStructureData } from './pgsl-address-of-expression-syntax-tree';
import { PgslLiteralValueExpressionSyntaxTree, PgslLiteralValueExpressionSyntaxTreeStructureData } from './pgsl-literal-value-expression-syntax-tree';
import { PgslPointerExpressionSyntaxTree, PgslPointerExpressionSyntaxTreeStructureData } from './pgsl-pointer-expression-syntax-tree';
import { PgslUnaryExpressionSyntaxTree, PgslUnaryExpressionSyntaxTreeStructureData } from './pgsl-unary-expression-syntax-tree';
import { PgslEnumValueExpressionSyntaxTree, PgslEnumValueExpressionSyntaxTreeStructureData } from './variable/pgsl-enum-value-expression-syntax-tree';
import { PgslIndexedValueExpressionSyntaxTree, PgslIndexedValueExpressionSyntaxTreeStructureData } from './variable/pgsl-indexed-value-expression-syntax-tree';
import { PgslValueDecompositionExpressionSyntaxTree, PgslValueDecompositionExpressionSyntaxTreeStructureData } from './variable/pgsl-value-decomposition-expression-syntax-tree';
import { PgslVariableNameExpressionSyntaxTree, PgslVariableNameExpressionSyntaxTreeStructureData } from './variable/pgsl-variable-name-expression-syntax-tree';

/**
 * Expression factory.
 */
export class PgslExpressionSyntaxTreeFactory {
    /**
     * Create a new instance of a pgsl expression syntax tree from its structure data.
     * 
     * @param pData - Syntax tree structure data for a pgsl expression.
     * 
     * @returns  a new instance of a pgsl expression syntax tree.
     */
    public static createFrom(pData: PgslExpressionSyntaxTreeStructureData, pParent: UnknownPgslSyntaxTree | null): PgslExpressionSyntaxTree {
        // Create new syntax tree object for all expression types.
        switch (pData.meta.type) {
            // Literals
            case 'Expression-LiteralValue': return new PgslLiteralValueExpressionSyntaxTree().applyDataStructure(pData as PgslLiteralValueExpressionSyntaxTreeStructureData, pParent);

            // Variables
            case 'Expression-VariableName': return new PgslVariableNameExpressionSyntaxTree().applyDataStructure(pData as PgslVariableNameExpressionSyntaxTreeStructureData, pParent);
            case 'Expression-EnumValue': return new PgslEnumValueExpressionSyntaxTree().applyDataStructure(pData as PgslEnumValueExpressionSyntaxTreeStructureData, pParent);
            case 'Expression-ValueDecomposition': return new PgslValueDecompositionExpressionSyntaxTree().applyDataStructure(pData as PgslValueDecompositionExpressionSyntaxTreeStructureData, pParent);
            case 'Expression-IndexedValue': return new PgslIndexedValueExpressionSyntaxTree().applyDataStructure(pData as PgslIndexedValueExpressionSyntaxTreeStructureData, pParent);

            // Unary Operations
            case 'Expression-Pointer': return new PgslPointerExpressionSyntaxTree().applyDataStructure(pData as PgslPointerExpressionSyntaxTreeStructureData, pParent);
            case 'Expression-AddressOf': return new PgslAddressOfExpressionSyntaxTree().applyDataStructure(pData as PgslAddressOfExpressionSyntaxTreeStructureData, pParent);
            case 'Expression-Unary': return new PgslUnaryExpressionSyntaxTree().applyDataStructure(pData as PgslUnaryExpressionSyntaxTreeStructureData, pParent);

            // Binary operations
        }
    }
}

export type PgslVariableExpressionSyntaxTree = PgslVariableNameExpressionSyntaxTree | PgslEnumValueExpressionSyntaxTree | PgslValueDecompositionExpressionSyntaxTree | PgslIndexedValueExpressionSyntaxTree;
export type PgslUnaryOperationExpressionSyntaxTree = PgslPointerExpressionSyntaxTree | PgslAddressOfExpressionSyntaxTree | PgslUnaryExpressionSyntaxTree;
export type PgslExpressionSyntaxTree = PgslLiteralValueExpressionSyntaxTree | PgslVariableExpressionSyntaxTree | PgslUnaryOperationExpressionSyntaxTree;

export type PgslExpressionSyntaxTreeStructureData = ReturnType<PgslExpressionSyntaxTree['retrieveDataStructure']>;
export type PgslVariableExpressionSyntaxTreeStructureData = ReturnType<PgslVariableExpressionSyntaxTree['retrieveDataStructure']>;