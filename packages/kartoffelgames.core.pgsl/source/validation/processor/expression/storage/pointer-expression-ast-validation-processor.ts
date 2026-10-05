import { PointerExpressionAst } from '../../../../abstract_syntax_tree/expression/storage/pointer-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of PointerExpressionAst.
 */
export class PointerExpressionAstValidationProcessor extends PgslValidatorProcessor<PointerExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PointerExpressionAst {
        return PointerExpressionAst;
    }

    /**
     * Validates the PGSL pointer expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: PointerExpressionAst): void {
    }
}
