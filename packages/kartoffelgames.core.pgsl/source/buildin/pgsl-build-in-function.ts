import { PgslNumericType, PgslNumericTypeName } from "../abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { PgslVectorType } from "../abstract_syntax_tree/type/pgsl-vector-type.ts";
import { FunctionDeclarationCst, FunctionDeclarationGenericCst, FunctionDeclarationHeaderCst, FunctionDeclarationParameterCst } from "../concrete_syntax_tree/declaration.type.ts";
import { AttributeListCst, Cst, TypeDeclarationCst } from "../concrete_syntax_tree/general.type.ts";
import { BlockStatementCst } from "../concrete_syntax_tree/statement.type.ts";

export class PgslBuildInFunction {
    public static bitReinterpretation(): Array<FunctionDeclarationCst> {
        const lFunctions: Array<FunctionDeclarationCst> = new Array<FunctionDeclarationCst>();

        // bitcast
        lFunctions.push(PgslBuildInFunction.create('bitcast', true, [
            // Numerics
            PgslBuildInFunction.header({ 'TResult': ['numeric'], }, { 'value': PgslBuildInFunction.numericType(PgslNumericType.typeName.float16) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['numeric'], }, { 'value': PgslBuildInFunction.numericType(PgslNumericType.typeName.float32) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['numeric'], }, { 'value': PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['numeric'], }, { 'value': PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, 'TResult'),

            // Numeric Vectors.
            PgslBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)) }, 'TResult'),

            PgslBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)) }, 'TResult'),
            
            PgslBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)) }, 'TResult'),
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
    private static create(pName: string, pConstant: boolean, pDeclarations: Array<FunctionDeclarationHeaderCst>): FunctionDeclarationCst {
        return {
            type: "FunctionDeclaration",
            isConstant: pConstant,
            buildIn: true,
            range: [0, 0, 0, 0],
            name: pName,
            declarations: pDeclarations
        };
    }

    private static header(pGenerics: PgslBuildInFunctionGenericList, pParameter: PgslBuildInFunctionParameterList, pReturnType: TypeDeclarationCst | string): FunctionDeclarationHeaderCst {
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

type PgslBuildInFunctionParameterList = {
    [name: string]: TypeDeclarationCst | string;
};

type PgslBuildInFunctionGenericList = {
    [name: string]: Array<string>;
};
