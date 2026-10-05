import { Exception } from '@kartoffelgames/core';
import { NewExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/new-expression-ast.ts';
import { PgslArrayType } from '../../../../abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslBooleanType } from '../../../../abstract_syntax_tree/type/definition/pgsl-boolean-type.ts';
import { PgslMatrixType } from '../../../../abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../../abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class NewCallExpressionAstTranspilerProcessor extends TranspilerProcessor<NewExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof NewExpressionAst {
        return NewExpressionAst;
    }

    /**
     * Transpiles a PGSL new call expression into WGSL code.
     *
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: NewExpressionAst): string {
        // Only write the generic when it is written in PGSL. WGSL infers any omitted template itself.
        let lGenerics: string = '';
        if (pInstance.data.generic) {
            lGenerics = `<${this.transpileAst(pInstance.data.generic)}>`;
        }

        // Simply transpile the constructor and parameters without the new part.
        return `${this.constructorName(pInstance.data.typeName)}${lGenerics}(${pInstance.data.parameterList.map(pParam => this.transpileAst(pParam)).join(',')})`;
    }

    /**
     * Get the WGSL constructor name of a constructible PGSL type name.
     *
     * @param pTypeName - PGSL type name.
     *
     * @returns The WGSL constructor name.
     *
     * @throws {Exception} When the type name has no WGSL constructor.
     */
    private constructorName(pTypeName: string): string {
        switch (pTypeName) {
            // Array types.
            case PgslArrayType.typeName.array: return 'array';

            // Vector types.
            case PgslVectorType.typeName.vector2: return 'vec2';
            case PgslVectorType.typeName.vector3: return 'vec3';
            case PgslVectorType.typeName.vector4: return 'vec4';

            // Matrix types.
            case PgslMatrixType.typeName.matrix22: return 'mat2x2';
            case PgslMatrixType.typeName.matrix23: return 'mat2x3';
            case PgslMatrixType.typeName.matrix24: return 'mat2x4';
            case PgslMatrixType.typeName.matrix32: return 'mat3x2';
            case PgslMatrixType.typeName.matrix33: return 'mat3x3';
            case PgslMatrixType.typeName.matrix34: return 'mat3x4';
            case PgslMatrixType.typeName.matrix42: return 'mat4x2';
            case PgslMatrixType.typeName.matrix43: return 'mat4x3';
            case PgslMatrixType.typeName.matrix44: return 'mat4x4';

            // Scalar types.
            case PgslBooleanType.typeName.boolean: return 'bool';
            case PgslNumericType.typeName.float16: return 'f16';
            case PgslNumericType.typeName.float32: return 'f32';
            case PgslNumericType.typeName.signedInteger: return 'i32';
            case PgslNumericType.typeName.unsignedInteger: return 'u32';
        }

        throw new Exception(`Type '${pTypeName}' has no WGSL constructor.`, this);
    }
}
