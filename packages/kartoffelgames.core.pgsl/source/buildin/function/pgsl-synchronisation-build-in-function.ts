import { PgslBooleanType } from '../../abstract_syntax_tree/type/pgsl-boolean-type.ts';
import { PgslMatrixType } from '../../abstract_syntax_tree/type/pgsl-matrix-type.ts';
import { PgslNumericType, type PgslNumericTypeName } from '../../abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../abstract_syntax_tree/type/pgsl-vector-type.ts';
import { PgslVoidType } from '../../abstract_syntax_tree/type/pgsl-void-type.ts';
import type { FunctionDeclarationCst, FunctionDeclarationGenericCst, FunctionDeclarationHeaderCst, FunctionDeclarationParameterCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { AttributeListCst, TypeDeclarationCst } from '../../concrete_syntax_tree/general.type.ts';
import type { BlockStatementCst } from '../../concrete_syntax_tree/statement.type.ts';

export class PgslSynchronisationBuildInFunction {
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

        };
    }

    /**
     * Create pack functions.
     * 
     * @returns list of cst function declarations for pack functions. 
     */
    public static synchronisation(): Array<FunctionDeclarationCst> {
        const lFunctions: Array<FunctionDeclarationCst> = new Array<FunctionDeclarationCst>();

        // storageBarrier
        lFunctions.push(PgslSynchronisationBuildInFunction.create(PgslSynchronisationBuildInFunction.names.storageBarrier, false, false, [
            PgslSynchronisationBuildInFunction.header({}, {}, PgslSynchronisationBuildInFunction.voidType())
        ]));

        // textureBarrier
        lFunctions.push(PgslSynchronisationBuildInFunction.create(PgslSynchronisationBuildInFunction.names.textureBarrier, false, false, [
            PgslSynchronisationBuildInFunction.header({}, {}, PgslSynchronisationBuildInFunction.voidType())
        ]));

        // workgroupBarrier
        lFunctions.push(PgslSynchronisationBuildInFunction.create(PgslSynchronisationBuildInFunction.names.workgroupBarrier, false, false, [
            PgslSynchronisationBuildInFunction.header({}, {}, PgslSynchronisationBuildInFunction.voidType())
        ]));

        // workgroupUniformLoad

        // Create all possible result values.
        const lWorkgroupUniformLoadResultTypes: Array<TypeDeclarationCst> = [
            // Scalar types.
            PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.signedInteger),
            PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger),
            PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float32),
            PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float16),
            PgslSynchronisationBuildInFunction.booleanType(),

            // Vector types.
            PgslSynchronisationBuildInFunction.vectorType(2, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)),
            PgslSynchronisationBuildInFunction.vectorType(3, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)),
            PgslSynchronisationBuildInFunction.vectorType(4, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)),
            PgslSynchronisationBuildInFunction.vectorType(2, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
            PgslSynchronisationBuildInFunction.vectorType(3, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
            PgslSynchronisationBuildInFunction.vectorType(4, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
            PgslSynchronisationBuildInFunction.vectorType(2, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslSynchronisationBuildInFunction.vectorType(3, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslSynchronisationBuildInFunction.vectorType(4, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslSynchronisationBuildInFunction.vectorType(2, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslSynchronisationBuildInFunction.vectorType(3, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslSynchronisationBuildInFunction.vectorType(4, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float16)),

            // Matrix types.
            PgslSynchronisationBuildInFunction.matrixType(2, 2, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslSynchronisationBuildInFunction.matrixType(2, 3, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslSynchronisationBuildInFunction.matrixType(2, 4, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslSynchronisationBuildInFunction.matrixType(3, 2, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslSynchronisationBuildInFunction.matrixType(3, 3, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslSynchronisationBuildInFunction.matrixType(3, 4, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslSynchronisationBuildInFunction.matrixType(4, 2, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslSynchronisationBuildInFunction.matrixType(4, 3, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslSynchronisationBuildInFunction.matrixType(4, 4, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslSynchronisationBuildInFunction.matrixType(2, 2, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslSynchronisationBuildInFunction.matrixType(2, 3, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslSynchronisationBuildInFunction.matrixType(2, 4, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslSynchronisationBuildInFunction.matrixType(3, 2, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslSynchronisationBuildInFunction.matrixType(3, 3, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslSynchronisationBuildInFunction.matrixType(3, 4, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslSynchronisationBuildInFunction.matrixType(4, 2, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslSynchronisationBuildInFunction.matrixType(4, 3, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslSynchronisationBuildInFunction.matrixType(4, 4, PgslSynchronisationBuildInFunction.numericType(PgslNumericType.typeName.float16)),
        ];

        lFunctions.push(PgslSynchronisationBuildInFunction.create(PgslSynchronisationBuildInFunction.names.workgroupUniformLoad, true, false, lWorkgroupUniformLoadResultTypes.map((pResultType: TypeDeclarationCst) => {
            return PgslSynchronisationBuildInFunction.header({}, { value: PgslSynchronisationBuildInFunction.pointerType(pResultType) }, pResultType);
        })));

        return lFunctions;
    }

    /**
     * Create a cst type declaration of a boolean type.
     * 
     * @returns cst type declaration of a boolean type.
     */
    private static booleanType(): TypeDeclarationCst {
        return {
            type: 'TypeDeclaration',
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslBooleanType.typeName.boolean,
            template: []
        };
    }

    /**
     * Create a new cst function declaration.
     * 
     * @param pName - Function name.
     * @param pConstant - Function is constant.
     * @param pDeclarations - Function header declarations.
     * 
     * @returns cst function declaration.
     */
    private static create(pName: string, pImplicitGenerics: boolean, pConstant: boolean, pDeclarations: Array<FunctionDeclarationHeaderCst>): FunctionDeclarationCst {
        return {
            type: 'FunctionDeclaration',
            isConstant: pConstant,
            buildIn: true,
            implicitGenerics: pImplicitGenerics,
            range: [0, 0, 0, 0],
            name: pName,
            declarations: pDeclarations
        };
    }

    /**
     * Create a cst function declaration header.
     * 
     * @param pGenerics - Function generics.
     * @param pParameter - Function parameters.
     * @param pReturnType - Function return type.
     * 
     * @returns cst function declaration header.
     */
    private static header(pGenerics: PgslSynchronisationBuildInFunctionGenericList, pParameter: PgslSynchronisationBuildInFunctionParameterList, pReturnType: TypeDeclarationCst | string): FunctionDeclarationHeaderCst {
        const lEmptyBlock: BlockStatementCst = {
            type: 'BlockStatement',
            statements: [],
            range: [0, 0, 0, 0],
        };

        const lEmptyAttribteList: AttributeListCst = {
            type: 'AttributeList',
            attributes: [],
            range: [0, 0, 0, 0],
        };

        // Convert parameters
        const lParameters: Array<FunctionDeclarationParameterCst> = new Array<FunctionDeclarationParameterCst>();
        for (const lParameterName in pParameter) {
            lParameters.push({
                type: 'FunctionDeclarationParameter',
                buildIn: true,
                range: [0, 0, 0, 0],
                name: lParameterName,
                typeDeclaration: pParameter[lParameterName],
            });
        }

        // Convert generics
        const lGenerics: Array<FunctionDeclarationGenericCst> = new Array<FunctionDeclarationGenericCst>();
        for (const lGenericName in pGenerics) {
            lGenerics.push({
                type: 'FunctionDeclarationGeneric',
                buildIn: true,
                range: [0, 0, 0, 0],
                name: lGenericName,
                restrictions: pGenerics[lGenericName].length === 0 ? null : pGenerics[lGenericName],
            });
        }

        return {
            type: 'FunctionDeclarationHeader',
            buildIn: true,
            range: [0, 0, 0, 0],
            block: lEmptyBlock,
            attributeList: lEmptyAttribteList,
            parameters: lParameters,
            generics: lGenerics,
            returnType: pReturnType,
        };
    }

    /**
     * Create a cst type declaration of a matrix type.
     * 
     * @param pRows - Number of rows.
     * @param pColumns - Number of columns.
     * @param pInnerType - Inner type of matrix.
     * 
     * @returns cst type declaration of matrix type.
     */
    private static matrixType(pRows: number, pColumns: number, pInnerType: TypeDeclarationCst): TypeDeclarationCst {
        return {
            type: 'TypeDeclaration',
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslMatrixType.typenameFromDimensions(pRows, pColumns),
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
            type: 'TypeDeclaration',
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: pTypeName,
            template: []
        };
    }

    /**
     * Create a cst type declaration of a pointer type.
     * 
     * @returns cst type declaration of pointer type.
     */
    private static pointerType(pType: TypeDeclarationCst): TypeDeclarationCst {
        const lCopy: TypeDeclarationCst = structuredClone(pType);
        lCopy.isPointer = true;
        return lCopy;
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

    /**
     * Create a cst type declaration of a void type.
     * 
     * @returns cst type declaration of void type.
     */
    private static voidType(): TypeDeclarationCst {
        return {
            type: 'TypeDeclaration',
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslVoidType.typeName.void,
            template: []
        };
    }
}

type PgslSynchronisationBuildInFunctionParameterList = {
    [name: string]: TypeDeclarationCst | string;
};

type PgslSynchronisationBuildInFunctionGenericList = {
    [name: string]: Array<string>;
};
