import { PgslNumericType, PgslNumericTypeName } from "../../abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { PgslVectorType } from "../../abstract_syntax_tree/type/pgsl-vector-type.ts";
import { StructDeclarationCst, StructPropertyDeclarationCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { AttributeListCst, TypeDeclarationCst } from "../../concrete_syntax_tree/general.type.ts";

export class PgslModfResult {
    /**
     * All possible attribute names.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get names() {
        return {
            // Scalar
            __modf_result_f32: '__modf_result_f32',
            __modf_result_f16: '__modf_result_f16',
            __modf_result_abstractFloat: '__modf_result_abstractFloat',

            // Vector2
            __modf_result_vec2_f32: '__modf_result_vec2_f32',
            __modf_result_vec2_f16: '__modf_result_vec2_f16',
            __modf_result_vec2_abstractFloat: '__modf_result_vec2_abstractFloat',

            // Vector3
            __modf_result_vec3_f32: '__modf_result_vec3_f32',
            __modf_result_vec3_f16: '__modf_result_vec3_f16',
            __modf_result_vec3_abstractFloat: '__modf_result_vec3_abstractFloat',

            // Vector4
            __modf_result_vec4_f32: '__modf_result_vec4_f32',
            __modf_result_vec4_f16: '__modf_result_vec4_f16',
            __modf_result_vec4_abstractFloat: '__modf_result_vec4_abstractFloat',

        } as const;
    }

    /**
     * Creates a list of modf result structs cst.
     *  
     * @returns List of modf result structs cst. 
     */
    public static structs(): Array<StructDeclarationCst> {
        return [
            // Scalar.
            PgslModfResult.modfStruct(PgslModfResult.names.__modf_result_f32, PgslModfResult.numericType(PgslNumericType.typeName.float32)),
            PgslModfResult.modfStruct(PgslModfResult.names.__modf_result_f16, PgslModfResult.numericType(PgslNumericType.typeName.float16)),
            PgslModfResult.modfStruct(PgslModfResult.names.__modf_result_abstractFloat, PgslModfResult.numericType(PgslNumericType.typeName.abstractFloat)),

            // Vector1.
            PgslModfResult.modfStruct(PgslModfResult.names.__modf_result_vec2_f32, PgslModfResult.vectorType(2, PgslModfResult.numericType(PgslNumericType.typeName.float32))),
            PgslModfResult.modfStruct(PgslModfResult.names.__modf_result_vec2_f16, PgslModfResult.vectorType(2, PgslModfResult.numericType(PgslNumericType.typeName.float16))),
            PgslModfResult.modfStruct(PgslModfResult.names.__modf_result_vec2_abstractFloat, PgslModfResult.vectorType(2, PgslModfResult.numericType(PgslNumericType.typeName.abstractFloat))),

            // Vector2.
            PgslModfResult.modfStruct(PgslModfResult.names.__modf_result_vec3_f32, PgslModfResult.vectorType(3, PgslModfResult.numericType(PgslNumericType.typeName.float32))),
            PgslModfResult.modfStruct(PgslModfResult.names.__modf_result_vec3_f16, PgslModfResult.vectorType(3, PgslModfResult.numericType(PgslNumericType.typeName.float16))),
            PgslModfResult.modfStruct(PgslModfResult.names.__modf_result_vec3_abstractFloat, PgslModfResult.vectorType(3, PgslModfResult.numericType(PgslNumericType.typeName.abstractFloat))),

            // Vector3.
            PgslModfResult.modfStruct(PgslModfResult.names.__modf_result_vec4_f32, PgslModfResult.vectorType(4, PgslModfResult.numericType(PgslNumericType.typeName.float32))),
            PgslModfResult.modfStruct(PgslModfResult.names.__modf_result_vec4_f16, PgslModfResult.vectorType(4, PgslModfResult.numericType(PgslNumericType.typeName.float16))),
            PgslModfResult.modfStruct(PgslModfResult.names.__modf_result_vec4_abstractFloat, PgslModfResult.vectorType(4, PgslModfResult.numericType(PgslNumericType.typeName.abstractFloat))),
        ];
    }

    /**
     * Create a modf result struct cst.
     * 
     * @param pType - Result types of modf struct properties.
     * 
     * @returns modf result struct cst.
     */
    private static modfStruct(pName: string, pType: TypeDeclarationCst): StructDeclarationCst {
        const lFract: StructPropertyDeclarationCst = {
            type: 'StructPropertyDeclaration',
            buildIn: true,
            range: [0, 0, 0, 0],
            attributeList: this.emptyAttributeList(),
            name: 'fract',
            typeDeclaration: pType
        };

        const lWhole: StructPropertyDeclarationCst = {
            type: 'StructPropertyDeclaration',
            buildIn: true,
            range: [0, 0, 0, 0],
            attributeList: this.emptyAttributeList(),
            name: 'whole',
            typeDeclaration: pType
        };

        return {
            type: 'StructDeclaration',
            buildIn: true,
            range: [0, 0, 0, 0],
            name: pName,
            attributeList: this.emptyAttributeList(),
            properties: [lFract, lWhole]
        };
    }

    /**
     * Create an empty attribute list.
     * 
     * @returns Empty attribute list cst. 
     */
    private static emptyAttributeList(): AttributeListCst {
        return {
            type: "AttributeList",
            attributes: [],
            range: [0, 0, 0, 0],
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
            type: "TypeDeclaration",
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslVectorType.typeNameFromDimension(pDimension),
            template: [pInnerType]
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
            type: "TypeDeclaration",
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: pTypeName,
            template: []
        };
    }
}