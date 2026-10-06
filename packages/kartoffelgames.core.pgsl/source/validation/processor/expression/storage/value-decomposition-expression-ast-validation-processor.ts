import { ValueDecompositionExpressionAst } from '../../../../abstract_syntax_tree/expression/storage/value-decomposition-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of ValueDecompositionExpressionAst.
 */
export class ValueDecompositionExpressionAstValidationProcessor extends PgslValidatorProcessor<ValueDecompositionExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ValueDecompositionExpressionAst {
        return ValueDecompositionExpressionAst;
    }

    /**
     * Validates the PGSL value decomposition expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: ValueDecompositionExpressionAst): void {
        // TODO: Validate the child value expression.
        // TODO: Validate that the value is a struct, an enum or a Vector, reporting once in place of both of today's messages.
        // TODO: Validate that the struct type of the value resolves to its struct declaration.
        // TODO: Validate that the struct declares a property with the accessed name.
        // TODO: Validate that the enum type of the value resolves to its enum declaration.
        // TODO: Validate that the enum contains a value with the accessed name.
        // TODO: Validate that a Vector swizzle consists of one to four letters taken only from rgba or only from xyzw.
        // TODO: Validate that a Vector swizzle uses z or b only on a Vector3 or Vector4 and w or a only on a Vector4 (new).
        // TODO: Validate that a value of a string enum is only used as an attribute parameter, a type template argument or an enum value, because WGSL has no string values (new).
    }
}
