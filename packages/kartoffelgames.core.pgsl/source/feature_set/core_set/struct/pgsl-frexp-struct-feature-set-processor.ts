import type { StructDeclarationAst } from '../../../abstract_syntax_tree/declaration/struct-declaration-ast.ts';
import type { BasePgslType } from '../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslNumericType } from '../../..//abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from "../../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts";
import { PgslFeatureSetProcessor } from "../../pgsl-feature-set-processor.ts";

export class PgslFrexpStructFeatureSetConstructor extends PgslFeatureSetProcessor {
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
     * Process registration.
     */
    protected override onProcess(): void {
        const lFloat32: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.float32);
        const lFloat16: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.float16);
        const lAbstractFloat: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.abstractFloat);


        // Scalar.
        this.registerDeclaration(this.createFrexpStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_f32, lFloat32));
        this.registerDeclaration(this.createFrexpStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_f16, lFloat16));
        this.registerDeclaration(this.createFrexpStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_abstractFloat, lAbstractFloat));

        // Vector2.
        this.registerDeclaration(this.createFrexpStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec2_f32, this.types.create(PgslVectorType, 2, lFloat32)));
        this.registerDeclaration(this.createFrexpStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec2_f16, this.types.create(PgslVectorType, 2, lFloat16)));
        this.registerDeclaration(this.createFrexpStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec2_abstractFloat, this.types.create(PgslVectorType, 2, lAbstractFloat)));

        // Vector3.
        this.registerDeclaration(this.createFrexpStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec3_f32, this.types.create(PgslVectorType, 3, lFloat32)));
        this.registerDeclaration(this.createFrexpStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec3_f16, this.types.create(PgslVectorType, 3, lFloat16)));
        this.registerDeclaration(this.createFrexpStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec3_abstractFloat, this.types.create(PgslVectorType, 3, lAbstractFloat)));

        // Vector4.
        this.registerDeclaration(this.createFrexpStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec4_f32, this.types.create(PgslVectorType, 4, lFloat32)));
        this.registerDeclaration(this.createFrexpStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec4_f16, this.types.create(PgslVectorType, 4, lFloat16)));
        this.registerDeclaration(this.createFrexpStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec4_abstractFloat, this.types.create(PgslVectorType, 4, lAbstractFloat)));
    }

    /**
     * Create a frexp result struct.
     *
     * @param pName - Struct name.
     * @param pType - Result types of frexp struct properties.
     *
     * @returns frexp result struct.
     */
    private createFrexpStruct(pName: string, pType: BasePgslType): StructDeclarationAst {
        return this.createStruct(pName, {
            fract: pType,
            exp: pType
        });
    }
}
