import { IndexedValueExpressionAst } from '../../../../abstract_syntax_tree/expression/storage/indexed-value-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of IndexedValueExpressionAst.
 */
export class IndexedValueExpressionAstValidationProcessor extends PgslValidatorProcessor<IndexedValueExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof IndexedValueExpressionAst {
        return IndexedValueExpressionAst;
    }

    /**
     * Validates the PGSL indexed value expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: IndexedValueExpressionAst): void {
        // TODO: Validate the child value expression.
        // TODO: Validate the child index expression.
        // TODO: Validate that the value is an Array, a Vector or a Matrix, reporting once in place of both of today's messages.
        // TODO: Validate that the index is an int or a uint scalar, abstract integers included.
        // TODO: Validate that a constant index is not negative, where constant means a compile time constant and not a param value.
        // TODO: Validate that a constant index is less than the length of an Array with a constant length, the dimension of a Vector or the column count of a Matrix (new).
    }
}
