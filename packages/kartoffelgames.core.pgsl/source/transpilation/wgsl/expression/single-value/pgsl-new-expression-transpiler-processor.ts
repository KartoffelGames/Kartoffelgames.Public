import { NewExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/new-expression-ast.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import { PgslArrayType } from "../../../../type/pgsl-array-type.ts";
import { PgslBooleanType } from "../../../../type/pgsl-boolean-type.ts";
import { PgslMatrixType } from "../../../../type/pgsl-matrix-type.ts";
import { PgslNumericType } from "../../../../type/pgsl-numeric-type.ts";
import { PgslVectorType } from "../../../../type/pgsl-vector-type.ts";
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslNewCallExpressionTranspilerProcessor implements IPgslTranspilerProcessor<NewExpressionAst> {
    /**
     * Converts PGSL type names into WGSL type names.
     * 
     * @param pTypeName - PGSL type name.
     * 
     * @returns WGSL type name.
     */
    private static typeNameConversion(pTypeName: string): string {
        switch(pTypeName) {
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

        return '';
    }

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
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: NewExpressionAst, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        const lTypeNameConversion: string = PgslNewCallExpressionTranspilerProcessor.typeNameConversion(pInstance.typeName)
        // Simply transpile the type and parameters without the new part.
        return `${lTypeNameConversion}(${pInstance.parameter.map(pParam => pTranspile(pParam)).join(',')})`;
    }
}
