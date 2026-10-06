import { PointerExpressionAst, type PointerExpressionAstData } from '../../../../abstract_syntax_tree/expression/storage/pointer-expression-ast.ts';
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
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: PointerExpressionAstData): void {
        // TODO: Validate the child expression that is dereferenced.
        // TODO: Validate that the dereferenced expression is a pointer.
    }
}
