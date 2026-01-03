import { PgslBooleanType } from "../../abstract_syntax_tree/type/pgsl-boolean-type.ts";
import { PgslMatrixType } from "../../abstract_syntax_tree/type/pgsl-matrix-type.ts";
import { PgslNumericTypeName } from "../../abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { PgslVectorType } from "../../abstract_syntax_tree/type/pgsl-vector-type.ts";
import { FunctionDeclarationCst, FunctionDeclarationGenericCst, FunctionDeclarationHeaderCst, FunctionDeclarationParameterCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { AttributeListCst, TypeDeclarationCst } from "../../concrete_syntax_tree/general.type.ts";
import { BlockStatementCst } from "../../concrete_syntax_tree/statement.type.ts";

export class PgslPackingBuildInFunction {
    /**
     * Create a cst type declaration of a boolean type.
     * 
     * @returns cst type declaration of a boolean type.
     */
    private static booleanType(): TypeDeclarationCst {
        return {
            type: "TypeDeclaration",
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslBooleanType.typeName.boolean,
            template: []
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

    /**
     * Create a cst type declaration of a struct type.
     * 
     * @param pName - Struct name.
     * 
     * @returns cst type declaration of struct type.
     */
    private static structType(pName: string): TypeDeclarationCst {
        return {
            type: "TypeDeclaration",
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: pName,
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
            type: "TypeDeclaration",
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslVectorType.typeNameFromDimension(pDimension),
            template: [pInnerType]
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
            type: "TypeDeclaration",
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslMatrixType.typenameFromDimensions(pRows, pColumns),
            template: [pInnerType]
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
            type: "FunctionDeclaration",
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
    private static header(pGenerics: PgslPackingBuildInFunctionGenericList, pParameter: PgslPackingBuildInFunctionParameterList, pReturnType: TypeDeclarationCst | string): FunctionDeclarationHeaderCst {
        const lEmptyBlock: BlockStatementCst = {
            type: "BlockStatement",
            statements: [],
            range: [0, 0, 0, 0],
        };

        const lEmptyAttribteList: AttributeListCst = {
            type: "AttributeList",
            attributes: [],
            range: [0, 0, 0, 0],
        };

        // Convert parameters
        const lParameters: Array<FunctionDeclarationParameterCst> = new Array<FunctionDeclarationParameterCst>();
        for (const lParameterName in pParameter) {
            lParameters.push({
                type: "FunctionDeclarationParameter",
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
                type: "FunctionDeclarationGeneric",
                buildIn: true,
                range: [0, 0, 0, 0],
                name: lGenericName,
                restrictions: pGenerics[lGenericName].length === 0 ? null : pGenerics[lGenericName],
            });
        }

        return {
            type: "FunctionDeclarationHeader",
            buildIn: true,
            range: [0, 0, 0, 0],
            block: lEmptyBlock,
            attributeList: lEmptyAttribteList,
            parameters: lParameters,
            generics: lGenerics,
            returnType: pReturnType,
        };
    }
}

type PgslPackingBuildInFunctionParameterList = {
    [name: string]: TypeDeclarationCst | string;
};

type PgslPackingBuildInFunctionGenericList = {
    [name: string]: Array<string>;
};
