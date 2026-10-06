import { VariableDeclarationStatementAst, type VariableDeclarationStatementAstData } from '../../../../abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of VariableDeclarationStatementAst.
 */
export class VariableDeclarationStatementAstValidationProcessor extends PgslValidatorProcessor<VariableDeclarationStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof VariableDeclarationStatementAst {
        return VariableDeclarationStatementAst;
    }

    /**
     * Validates the PGSL variable declaration statement syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: VariableDeclarationStatementAstData): void {
        // TODO: Validate the child type declaration.
        // TODO: Validate the child initializer expression when present.
        // TODO: Validate that the declaration type is a known declaration keyword.
        // TODO: Validate that the declaration type is let or const, as storage, uniform, workgroup, private and param are only allowed at module scope.
        // TODO: Validate that the variable name does not start with two underscores, which WGSL reserves (new).
        // TODO: Validate that the variable name is none of fn, override, non_coherent and noncoherent, the WGSL keywords and reserved words that the PGSL lexer accepts as identifiers (new).
        // TODO: Validate that the variable name is not a WGSL predeclared type, enumerant or built-in function name like f32, vec3, read or min, which the variable would shadow in the rest of its transpiled scope (new).
        // TODO: Validate that the variable name is not the name of a function or struct declaration, which the variable would shadow in the rest of its transpiled scope while PGSL still resolves calls and type names to that declaration (new).
        // TODO: Validate that the variable name does not contain the reserved name part __GENERIC__ (new).
        // TODO: Validate that a const declaration has an initializer.
        // TODO: Validate that the declared type is constructible unless it is a pointer, which also rejects an Array with a param-sized length once the Array type is only constructible with a constant length.
        // TODO: Validate that a variable of pointer type is declared with const, because let emits a WGSL var and a var cannot hold a pointer (new).
        // TODO: Validate that the type of the initializer converts to the declared type.
        // TODO: Validate that a constant initializer value is representable in the declared type, e.g. no negative value for uint and no value outside the range of int, uint, float or float16 (new).
    }
}
