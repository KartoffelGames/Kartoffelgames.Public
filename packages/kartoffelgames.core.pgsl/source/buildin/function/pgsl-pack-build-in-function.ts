import { PgslBooleanType } from "../../abstract_syntax_tree/type/pgsl-boolean-type.ts";
import { PgslMatrixType } from "../../abstract_syntax_tree/type/pgsl-matrix-type.ts";
import { PgslNumericType, PgslNumericTypeName } from "../../abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { PgslVectorType } from "../../abstract_syntax_tree/type/pgsl-vector-type.ts";
import { FunctionDeclarationCst, FunctionDeclarationGenericCst, FunctionDeclarationHeaderCst, FunctionDeclarationParameterCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { AttributeListCst, TypeDeclarationCst } from "../../concrete_syntax_tree/general.type.ts";
import { BlockStatementCst } from "../../concrete_syntax_tree/statement.type.ts";

export class PgslPackingBuildInFunction {
    /**
     * All possible function names.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get names() {
        return {
            // Pack.
            pack4x8snorm: 'pack4x8snorm',
            pack4x8unorm: 'pack4x8unorm',
            pack4xI8: 'pack4xI8',
            pack4xU8: 'pack4xU8',
            pack4xI8Clamp: 'pack4xI8Clamp',
            pack4xU8Clamp: 'pack4xU8Clamp',
            pack2x16snorm: 'pack2x16snorm',
            pack2x16unorm: 'pack2x16unorm',
            pack2x16float: 'pack2x16float',

            // Unpack.
            unpack4x8snorm: 'unpack4x8snorm',
            unpack4x8unorm: 'unpack4x8unorm',
            unpack4xI8: 'unpack4xI8',
            unpack4xU8: 'unpack4xU8',
            unpack2x16snorm: 'unpack2x16snorm',
            unpack2x16unorm: 'unpack2x16unorm',
            unpack2x16float: 'unpack2x16float',
        };
    }

    /**
     * Create pack functions.
     * 
     * @returns list of cst function declarations for pack functions. 
     */
    public static pack(): Array<FunctionDeclarationCst> {
        const lFunctions: Array<FunctionDeclarationCst> = new Array<FunctionDeclarationCst>();

        // pack4x8snorm
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.pack4x8snorm, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.vectorType(4, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack4x8unorm
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.pack4x8unorm, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.vectorType(4, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack4xI8
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.pack4xI8, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.vectorType(4, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack4xU8
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.pack4xU8, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.vectorType(4, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)) }, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack4xI8Clamp
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.pack4xI8Clamp, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.vectorType(4, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack4xU8Clamp
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.pack4xU8Clamp, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.vectorType(4, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)) }, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack2x16snorm
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.pack2x16snorm, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.vectorType(2, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack2x16unorm
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.pack2x16unorm, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.vectorType(2, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack2x16float
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.pack2x16float, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.vectorType(2, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
        ]));

        return lFunctions;
    }

    /**
     * Create unpack functions.
     * 
     * @returns list of cst function declarations for unpack functions. 
     */
    public static unpack(): Array<FunctionDeclarationCst> {
        const lFunctions: Array<FunctionDeclarationCst> = new Array<FunctionDeclarationCst>();

        // unpack4x8snorm
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.unpack4x8snorm, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, PgslPackingBuildInFunction.vectorType(4, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.float32)))
        ]));

        // unpack4x8unorm
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.unpack4x8unorm, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, PgslPackingBuildInFunction.vectorType(4, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.float32)))
        ]));

        // unpack4xI8
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.unpack4xI8, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, PgslPackingBuildInFunction.vectorType(4, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)))
        ]));

        // unpack4xU8
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.unpack4xU8, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, PgslPackingBuildInFunction.vectorType(4, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)))
        ]));

        // unpack2x16snorm
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.unpack2x16snorm, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, PgslPackingBuildInFunction.vectorType(2, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.float32)))
        ]));

        // unpack2x16unorm
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.unpack2x16unorm, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, PgslPackingBuildInFunction.vectorType(2, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.float32)))
        ]));

        // unpack2x16float
        lFunctions.push(PgslPackingBuildInFunction.create(PgslPackingBuildInFunction.names.unpack2x16float, false, true, [
            PgslPackingBuildInFunction.header({}, { 'e': PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, PgslPackingBuildInFunction.vectorType(2, PgslPackingBuildInFunction.numericType(PgslNumericType.typeName.float32)))
        ]));

        return lFunctions;
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
