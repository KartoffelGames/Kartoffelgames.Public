import { LogicalExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/logical-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of LogicalExpressionAst.
 */
export class LogicalExpressionAstValidationProcessor extends PgslValidatorProcessor<LogicalExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof LogicalExpressionAst {
        return LogicalExpressionAst;
    }

    /**
     * Validates the PGSL logical expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: LogicalExpressionAst): void {
    }
}
