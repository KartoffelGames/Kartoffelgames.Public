import { PgslNumericType, type PgslNumericTypeName } from '../../abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../abstract_syntax_tree/type/pgsl-vector-type.ts';
import type { StructDeclarationCst, StructPropertyDeclarationCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { AttributeListCst, TypeDeclarationCst } from '../../concrete_syntax_tree/general.type.ts';

export class PgslFrexpResult {
    /**
     * All possible attribute names.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get names() {
        return {
            // Scalar
            __frexp_result_f32: '__frexp_result_f32',
            __frexp_result_f16: '__frexp_result_f16',
            __frexp_result_abstractFloat: '__frexp_result_abstractFloat',

            // Vector2
            __frexp_result_vec2_f32: '__frexp_result_vec2_f32',
            __frexp_result_vec2_f16: '__frexp_result_vec2_f16',
            __frexp_result_vec2_abstractFloat: '__frexp_result_vec2_abstractFloat',

            // Vector3
            __frexp_result_vec3_f32: '__frexp_result_vec3_f32',
            __frexp_result_vec3_f16: '__frexp_result_vec3_f16',
            __frexp_result_vec3_abstractFloat: '__frexp_result_vec3_abstractFloat',

            // Vector4
            __frexp_result_vec4_f32: '__frexp_result_vec4_f32',
            __frexp_result_vec4_f16: '__frexp_result_vec4_f16',
            __frexp_result_vec4_abstractFloat: '__frexp_result_vec4_abstractFloat',

        } as const;
    }

    /**
     * Creates a list of frexp result structs cst.
     *  
     * @returns List of frexp result structs cst. 
     */
    public static structs(): Array<StructDeclarationCst> {
        return [
            // Scalar.
            PgslFrexpResult.frexpStruct(PgslFrexpResult.names.__frexp_result_f32, PgslFrexpResult.numericType(PgslNumericType.typeName.float32)),
            PgslFrexpResult.frexpStruct(PgslFrexpResult.names.__frexp_result_f16, PgslFrexpResult.numericType(PgslNumericType.typeName.float16)),
            PgslFrexpResult.frexpStruct(PgslFrexpResult.names.__frexp_result_abstractFloat, PgslFrexpResult.numericType(PgslNumericType.typeName.abstractFloat)),

            // Vector1.
            PgslFrexpResult.frexpStruct(PgslFrexpResult.names.__frexp_result_vec2_f32, PgslFrexpResult.vectorType(2, PgslFrexpResult.numericType(PgslNumericType.typeName.float32))),
            PgslFrexpResult.frexpStruct(PgslFrexpResult.names.__frexp_result_vec2_f16, PgslFrexpResult.vectorType(2, PgslFrexpResult.numericType(PgslNumericType.typeName.float16))),
            PgslFrexpResult.frexpStruct(PgslFrexpResult.names.__frexp_result_vec2_abstractFloat, PgslFrexpResult.vectorType(2, PgslFrexpResult.numericType(PgslNumericType.typeName.abstractFloat))),

            // Vector2.
            PgslFrexpResult.frexpStruct(PgslFrexpResult.names.__frexp_result_vec3_f32, PgslFrexpResult.vectorType(3, PgslFrexpResult.numericType(PgslNumericType.typeName.float32))),
            PgslFrexpResult.frexpStruct(PgslFrexpResult.names.__frexp_result_vec3_f16, PgslFrexpResult.vectorType(3, PgslFrexpResult.numericType(PgslNumericType.typeName.float16))),
            PgslFrexpResult.frexpStruct(PgslFrexpResult.names.__frexp_result_vec3_abstractFloat, PgslFrexpResult.vectorType(3, PgslFrexpResult.numericType(PgslNumericType.typeName.abstractFloat))),

            // Vector3.
            PgslFrexpResult.frexpStruct(PgslFrexpResult.names.__frexp_result_vec4_f32, PgslFrexpResult.vectorType(4, PgslFrexpResult.numericType(PgslNumericType.typeName.float32))),
            PgslFrexpResult.frexpStruct(PgslFrexpResult.names.__frexp_result_vec4_f16, PgslFrexpResult.vectorType(4, PgslFrexpResult.numericType(PgslNumericType.typeName.float16))),
            PgslFrexpResult.frexpStruct(PgslFrexpResult.names.__frexp_result_vec4_abstractFloat, PgslFrexpResult.vectorType(4, PgslFrexpResult.numericType(PgslNumericType.typeName.abstractFloat))),
        ];
    }

    /**
     * Create an empty attribute list.
     * 
     * @returns Empty attribute list cst. 
     */
    private static emptyAttributeList(): AttributeListCst {
        return {
            type: 'AttributeList',
            attributes: [],
            range: [0, 0, 0, 0],
        };
    }

    /**
     * Create a frexp result struct cst.
     * 
     * @param pType - Result types of frexp struct properties.
     * 
     * @returns frexp result struct cst.
     */
    private static frexpStruct(pName: string, pType: TypeDeclarationCst): StructDeclarationCst {
        const lFract: StructPropertyDeclarationCst = {
            type: 'StructPropertyDeclaration',
            buildIn: true,
            range: [0, 0, 0, 0],
            attributeList: this.emptyAttributeList(),
            name: 'fract',
            typeDeclaration: pType
        };

        const lExp: StructPropertyDeclarationCst = {
            type: 'StructPropertyDeclaration',
            buildIn: true,
            range: [0, 0, 0, 0],
            attributeList: this.emptyAttributeList(),
            name: 'exp',
            typeDeclaration: pType
        };

        return {
            type: 'StructDeclaration',
            buildIn: true,
            range: [0, 0, 0, 0],
            name: pName,
            attributeList: this.emptyAttributeList(),
            properties: [lFract, lExp]
        };
    }

    /**
     * Create a cst type declaration of a numeric type.
     * 
     * @param pTypeName - Numeric type name.
     * 
     * @returns cst type declaration of the numeric type. 
     */
    private static numericType(pTypeName: PgslNumericTypeName): TypeDeclarationCst {
        return {
            type: 'TypeDeclaration',
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: pTypeName,
            template: []
        };
    }

    /**
     * Create a cst type declaration of a vector type.
     * 
     * @param pDimension - Vector dimension.
     * @param pInnerType - Inner type of vector.
     * 
     * @returns cst type declaration of vector type.
     */
    private static vectorType(pDimension: number, pInnerType: TypeDeclarationCst): TypeDeclarationCst {
        return {
            type: 'TypeDeclaration',
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslVectorType.typeNameFromDimension(pDimension),
            template: [pInnerType]
        };
    }
}