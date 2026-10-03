import type { FunctionDeclarationAst } from '../../../abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { BasePgslType } from '../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslBooleanType } from "../../../abstract_syntax_tree/type/definition/pgsl-boolean-type.ts";
import { PgslMatrixType } from "../../../abstract_syntax_tree/type/definition/pgsl-matrix-type.ts";
import { PgslNumericType } from '../../../abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslPointerType } from "../../../abstract_syntax_tree/type/definition/pgsl-pointer-type.ts";
import { PgslVectorType } from "../../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts";
import { PgslVoidType } from "../../../abstract_syntax_tree/type/definition/pgsl-void-type.ts";
import { PgslFeatureSetProcessor } from "../../pgsl-feature-set-processor.ts";

export class PgslSynchronisationFunctionFeatureSetProcessor extends PgslFeatureSetProcessor {
    /**
     * All possible function names.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get names() {
        return {
            storageBarrier: 'storageBarrier',
            textureBarrier: 'textureBarrier',
            workgroupBarrier: 'workgroupBarrier',
            workgroupUniformLoad: 'workgroupUniformLoad'
        } as const;
    }

    /**
     * Create pack functions.
     * 
     * @returns list of function declarations for pack functions. 
     */
    protected override onProcess(): void {
        // storageBarrier
        this.registerDeclaration(this.createFunction(PgslSynchronisationFunctionFeatureSetProcessor.names.storageBarrier, {}, [
            this.createOverload({}, {}, this.types.create(PgslVoidType))
        ]));

        // textureBarrier
        this.registerDeclaration(this.createFunction(PgslSynchronisationFunctionFeatureSetProcessor.names.textureBarrier, {}, [
            this.createOverload({}, {}, this.types.create(PgslVoidType))
        ]));

        // workgroupBarrier
        this.registerDeclaration(this.createFunction(PgslSynchronisationFunctionFeatureSetProcessor.names.workgroupBarrier, {}, [
            this.createOverload({}, {}, this.types.create(PgslVoidType))
        ]));

        // workgroupUniformLoad

        // Create all possible result values.
        const lWorkgroupUniformLoadResultTypes: Array<BasePgslType> = [
            // Scalar types.
            this.types.create(PgslNumericType, PgslNumericType.typeName.signedInteger),
            this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger),
            this.types.create(PgslNumericType, PgslNumericType.typeName.float32),
            this.types.create(PgslNumericType, PgslNumericType.typeName.float16),
            this.types.create(PgslBooleanType),

            // Vector types.
            this.types.create(PgslVectorType, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.signedInteger)),
            this.types.create(PgslVectorType, 3, this.types.create(PgslNumericType, PgslNumericType.typeName.signedInteger)),
            this.types.create(PgslVectorType, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.signedInteger)),
            this.types.create(PgslVectorType, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger)),
            this.types.create(PgslVectorType, 3, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger)),
            this.types.create(PgslVectorType, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger)),
            this.types.create(PgslVectorType, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)),
            this.types.create(PgslVectorType, 3, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)),
            this.types.create(PgslVectorType, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)),
            this.types.create(PgslVectorType, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.float16)),
            this.types.create(PgslVectorType, 3, this.types.create(PgslNumericType, PgslNumericType.typeName.float16)),
            this.types.create(PgslVectorType, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.float16)),

            // Matrix types.
            this.types.create(PgslMatrixType, 2, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)),
            this.types.create(PgslMatrixType, 2, 3, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)),
            this.types.create(PgslMatrixType, 2, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)),
            this.types.create(PgslMatrixType, 3, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)),
            this.types.create(PgslMatrixType, 3, 3, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)),
            this.types.create(PgslMatrixType, 3, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)),
            this.types.create(PgslMatrixType, 4, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)),
            this.types.create(PgslMatrixType, 4, 3, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)),
            this.types.create(PgslMatrixType, 4, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)),
            this.types.create(PgslMatrixType, 2, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.float16)),
            this.types.create(PgslMatrixType, 2, 3, this.types.create(PgslNumericType, PgslNumericType.typeName.float16)),
            this.types.create(PgslMatrixType, 2, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.float16)),
            this.types.create(PgslMatrixType, 3, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.float16)),
            this.types.create(PgslMatrixType, 3, 3, this.types.create(PgslNumericType, PgslNumericType.typeName.float16)),
            this.types.create(PgslMatrixType, 3, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.float16)),
            this.types.create(PgslMatrixType, 4, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.float16)),
            this.types.create(PgslMatrixType, 4, 3, this.types.create(PgslNumericType, PgslNumericType.typeName.float16)),
            this.types.create(PgslMatrixType, 4, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.float16)),
        ];

        // Generate workgroupUniformLoad with all different overloads for each WorkgroupUniformLoadResultTypes type.
        const lWorkgroupUniformLoadFunction: FunctionDeclarationAst = this.createFunction(PgslSynchronisationFunctionFeatureSetProcessor.names.workgroupUniformLoad, {}, lWorkgroupUniformLoadResultTypes.map((pResultType: BasePgslType) => {
            return this.createOverload({}, { value: this.types.create(PgslPointerType, pResultType) }, pResultType);
        }));

        this.registerDeclaration(lWorkgroupUniformLoadFunction);
    }
}
