import { FunctionOverloadDeclarationAst, type FunctionOverloadDeclarationAstData } from '../../../abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { BasePgslType } from '../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslGenericType } from '../../../abstract_syntax_tree/type/definition/pgsl-generic-type.ts';
import { PgslVoidType } from '../../../abstract_syntax_tree/type/definition/pgsl-void-type.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of FunctionOverloadDeclarationAst.
 */
export class FunctionOverloadDeclarationAstValidationProcessor extends PgslValidatorProcessor<FunctionOverloadDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof FunctionOverloadDeclarationAst {
        return FunctionOverloadDeclarationAst;
    }

    /**
     * Validates the PGSL function overload declaration syntax tree.
     * 
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: FunctionOverloadDeclarationAstData): void {
        // Validate the child attribute list.
        this.validateAst(pData.attributes);

        // Validate the child restriction type declarations of every generic.
        for (const lRestrictionTypeDeclarations of pData.generic.restrictions.values()) {
            for (const lRestrictionTypeDeclaration of lRestrictionTypeDeclarations) {
                this.validateAst(lRestrictionTypeDeclaration);
            }
        }

        // Validate the child return type declaration.
        this.validateAst(pData.returnType);

        // Validate the child block.
        this.validateAst(pData.block);

        // Validate that an entry point overload has no generics.
        if (pData.entryPoint && pData.generic.types.length > 0) {
            this.pushIncident(`The ${pData.entryPoint.stage} entry point must not have generic parameters.`);
        }

        // Validate the child type declaration of every parameter.
        for (const lParameter of pData.parameter) {
            this.validateAst(lParameter.type);

            // Validate that every generic parameter has its generic defined as function generic.
            const lParameterType: BasePgslType = lParameter.type.data.type;
            if (lParameterType instanceof PgslGenericType && !pData.generic.restrictions.has(lParameterType)) {
                this.pushIncident(`Generic parameter name "${lParameterType.name}" is not defined for this function header.`);
            }
        }

        // Validate that generics names have no dublicates.
        const lGenericNames: Set<string> = new Set<string>();
        for (const lGeneric of pData.generic.types) {
            if (lGenericNames.has(lGeneric.name)) {
                this.pushIncident(`Generic type name "${lGeneric.name}" is already defined for this function header.`);
            }

            lGenericNames.add(lGeneric.name);
        }

        // TODO: Validate that a generic restriction only references generics declared before it (new).
        // TODO: Validate that no generic name shadows a module scope type (new).


        // TODO: Validate that no two parameters share a name (new).
        // TODO: Validate that every parameter name is a valid WGSL identifier: not a WGSL keyword or reserved word (the lexer lets fn, override, non_coherent and noncoherent through) and not starting with two underscores (new).
        // TODO: Validate that no parameter name is a WGSL predeclared type, enumerant or built-in function name like f32, vec3, read or min, which the parameter would shadow in the transpiled function body (new).
        // TODO: Validate that no parameter name is the name of a function or struct declaration, which the parameter would shadow in the transpiled function body while PGSL still resolves calls and type names in the body to that declaration (new).
        // TODO: Validate that no parameter name contains the reserved name part __GENERIC__ (new).
        // TODO: Validate that no variable declared directly in the function block shares a name with a parameter, because WGSL gives both the same end scope (new).
        // TODO: Validate that every parameter type is constructible, a pointer, a texture or a sampler (new).
        // TODO: Validate that the declared return type is void or constructible (new).
        // TODO: Validate that every control flow path of an overload with a non-void return type ends in a return statement, counting returns nested in if/else and switch branches, in place of today's comparison of the block return type with the declared return type.

        // Validate that the block return type can convert to the return type.
        if (pData.block.data.returnType.conversionRankTo(pData.returnType.data.type) === Number.POSITIVE_INFINITY) {
            this.pushIncident(`Function block return type does not match the declared return type.`, pData.block);
        }

        // TODO: Validate that at most one of the Vertex, Fragment and Compute attributes is set (new).

        // Everything but a compute entry point.
        if (pData.entryPoint && pData.entryPoint.stage !== 'compute') {
            // Validate that a Vertex or Fragment entry point has exactly one parameter.
            if (pData.parameter.length !== 1) {
                this.pushIncident(`The ${pData.entryPoint.stage} entry points must have exactly one parameter defining the ${pData.entryPoint.stage} input structure.`);
            }

            // Validate that the parameter type of a Vertex or Fragment entry point is a struct. A missing parameter is already reported by the parameter count.
            if (pData.parameter.length > 0 && !pData.entryPoint.parameter) {
                this.pushIncident(`The ${pData.entryPoint.stage} entry point parameter must be a struct type defining the ${pData.entryPoint.stage} input structure.`);
            }

            // Validate that the return type of a Vertex or Fragment entry point is a struct.
            if (!pData.entryPoint.returnType) {
                this.pushIncident(`The ${pData.entryPoint.stage} entry point return type must be a struct type defining the ${pData.entryPoint.stage} output structure.`);
            }
        }

        // TODO: Validate that every property of the input and output struct of a Vertex or Fragment entry point has either a built-in type or a Location attribute, never both (new).
        // TODO: Validate that every built-in property of the input and output struct fits the stage and direction: VertexIndex and InstanceIndex as Vertex input, Position and ClipDistances as Vertex output, Position, FrontFacing, SampleIndex, SampleMask and PrimitiveIndex as Fragment input, FragDepth and SampleMask as Fragment output (new).
        // TODO: Validate that no built-in type occurs more than once in the input struct or in the output struct of an entry point (new).
        // TODO: Validate that the output struct of a Vertex entry point has a Position property (new).
        // TODO: Validate that every Location property with an integer scalar or vector type in the output struct of a Vertex entry point or the input struct of a Fragment entry point has a flat Interpolate attribute (new).
        // TODO: Validate that BlendSource properties only appear in the output struct of a Fragment entry point (new).

        // Nothing but a compute entry point.
        if (pData.entryPoint?.stage === 'compute') {
            // Validate that the workgroup size of a Compute entry point could be read from the attribute parameters.
            if (!pData.entryPoint.workgroupSize) {
                this.pushIncident(`All compute attribute parameters need to be constant integer expressions.`, pData.attributes);
            }

            // TODO: Validate that all Compute attribute parameters are greater than zero (new).

            // Validate that a Compute entry point has no parameters.
            if (pData.parameter.length > 0) {
                this.pushIncident(`Compute entry points must not have parameters.`);
            }

            // Validate that a Compute entry point has a void return type.
            if (!(pData.returnType.data.type instanceof PgslVoidType)) {
                this.pushIncident(`Compute entry points must not have a return type.`);
            }
        }
    }
}
