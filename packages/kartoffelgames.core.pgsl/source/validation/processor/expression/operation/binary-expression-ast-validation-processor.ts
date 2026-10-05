import { BinaryExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/binary-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of BinaryExpressionAst.
 */
export class BinaryExpressionAstValidationProcessor extends PgslValidatorProcessor<BinaryExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof BinaryExpressionAst {
        return BinaryExpressionAst;
    }

    /**
     * Validates the PGSL binary expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: BinaryExpressionAst): void {
    }
}
