import { FunctionDeclarationAst, type FunctionDeclarationAstData } from '../../../abstract_syntax_tree/declaration/function-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of FunctionDeclarationAst.
 */
export class FunctionDeclarationAstValidationProcessor extends PgslValidatorProcessor<FunctionDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof FunctionDeclarationAst {
        return FunctionDeclarationAst;
    }

    /**
     * Validates the PGSL function declaration syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: FunctionDeclarationAstData): void {
        // TODO: Validate the child overload declarations.
        // TODO: Validate that the function name is a valid WGSL identifier: not a WGSL keyword or reserved word (the lexer lets fn, override, non_coherent and noncoherent through) and not starting with two underscores (new).
        // TODO: Validate that the function name is not a WGSL predeclared type or enumerant name like f32, vec3, read or rgba8unorm, which the function would shadow in the whole transpiled module (new).
        // TODO: Validate that the function name does not contain the reserved name part __GENERIC__ (new).
        // TODO: Validate that no overload of a function with more than one overload has attributes.
    }
}
