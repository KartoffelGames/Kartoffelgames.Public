import { LiteralValueExpressionAst, type LiteralValueExpressionAstData } from '../../../../abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of LiteralValueExpressionAst.
 */
export class LiteralValueExpressionAstValidationProcessor extends PgslValidatorProcessor<LiteralValueExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof LiteralValueExpressionAst {
        return LiteralValueExpressionAst;
    }

    /**
     * Validates the PGSL literal value expression syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: LiteralValueExpressionAstData): void {
        // TODO: Validate that the literal text is a boolean, integer or float literal, reporting "No matching Type for literal" for the recorded text.
        // TODO: Validate that an integer literal with i suffix is at most 2147483647 and one with u suffix is at most 4294967295 (new).
        // TODO: Validate that an integer literal without suffix is representable as a 64-bit signed integer (new).
        // TODO: Validate that a float literal with f or h suffix does not overflow float or float16 (new).
        // TODO: Validate that a hexadecimal float literal with f or h suffix is exactly representable in float or float16 (new).
        // TODO: Validate that a float literal without suffix is finite as a 64-bit float (new).
    }
}
