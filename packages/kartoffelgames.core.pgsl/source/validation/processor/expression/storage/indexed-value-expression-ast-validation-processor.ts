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
    }
}
