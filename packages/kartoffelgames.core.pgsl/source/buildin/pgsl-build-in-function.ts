import { PgslArrayType } from "../abstract_syntax_tree/type/pgsl-array-type.ts";
import { PgslBooleanType } from "../abstract_syntax_tree/type/pgsl-boolean-type.ts";
import { PgslNumericType, PgslNumericTypeName } from "../abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { PgslVectorType } from "../abstract_syntax_tree/type/pgsl-vector-type.ts";
import { FunctionDeclarationCst, FunctionDeclarationGenericCst, FunctionDeclarationHeaderCst, FunctionDeclarationParameterCst } from "../concrete_syntax_tree/declaration.type.ts";
import { ExpressionCst, LiteralValueExpressionCst } from "../concrete_syntax_tree/expression.type.ts";
import { AttributeListCst, TypeDeclarationCst } from "../concrete_syntax_tree/general.type.ts";
import { BlockStatementCst } from "../concrete_syntax_tree/statement.type.ts";

export class PgslBuildInFunction {
    /**
     * All possible attribute names.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get names() {
        return {
            // Bit reinterpretation
            bitcast: 'bitcast',

            // Logical
            all: 'all',
            any: 'any',
            select: 'select',

            // Array
            arrayLength: 'arrayLength',
        } as const;
    }

    /**
     * Create array functions.
     * 
     * @returns list of cst function declarations for array functions. 
     */
    public static array(): Array<FunctionDeclarationCst> {
        const lFunctions: Array<FunctionDeclarationCst> = new Array<FunctionDeclarationCst>();

        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.arrayLength, true, [
            PgslBuildInFunction.header({ 'TResult': ['Pointer<Array>'], }, { 'array': 'TResult' }, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)),
        ]));

        return lFunctions;
    }

    /**
     * Create bit reinterpretation functions.
     * 
     * @returns list of cst function declarations for bit reinterpretation functions.
     */
    public static bitReinterpretation(): Array<FunctionDeclarationCst> {
        const lFunctions: Array<FunctionDeclarationCst> = new Array<FunctionDeclarationCst>();

        // bitcast
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.bitcast, true, [
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
     * Create logical functions.
     * 
     * @returns list of cst function declarations for logical functions.
     */
    public static logical(): Array<FunctionDeclarationCst> {
        const lFunctions: Array<FunctionDeclarationCst> = new Array<FunctionDeclarationCst>();

        // all
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.all, true, [
            PgslBuildInFunction.header({}, { 'value': PgslBuildInFunction.booleanType() }, PgslBuildInFunction.booleanType()),
            PgslBuildInFunction.header({}, { 'value': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.booleanType()) }, PgslBuildInFunction.booleanType()),
            PgslBuildInFunction.header({}, { 'value': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.booleanType()) }, PgslBuildInFunction.booleanType()),
            PgslBuildInFunction.header({}, { 'value': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.booleanType()) }, PgslBuildInFunction.booleanType()),
        ]));

        // any
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.any, true, [
            PgslBuildInFunction.header({}, { 'value': PgslBuildInFunction.booleanType() }, PgslBuildInFunction.booleanType()),
            PgslBuildInFunction.header({}, { 'value': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.booleanType()) }, PgslBuildInFunction.booleanType()),
            PgslBuildInFunction.header({}, { 'value': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.booleanType()) }, PgslBuildInFunction.booleanType()),
            PgslBuildInFunction.header({}, { 'value': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.booleanType()) }, PgslBuildInFunction.booleanType()),
        ]));

        // select
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.select, true, [
            PgslBuildInFunction.header({ 'TResult': [], }, { 'trueValue': 'TResult', 'falseValue': 'TResult', 'condition': PgslBuildInFunction.booleanType() }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['Vector2'], }, { 'trueValue': 'TResult', 'falseValue': 'TResult', 'condition': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.booleanType()) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['Vector3'], }, { 'trueValue': 'TResult', 'falseValue': 'TResult', 'condition': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.booleanType()) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['Vector4'], }, { 'trueValue': 'TResult', 'falseValue': 'TResult', 'condition': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.booleanType()) }, 'TResult'),
        ]));

        return lFunctions;
    }

    /**
     * Create numeric functions.
     * 
     * @returns list of cst function declarations for numeric functions.
     */
    public static numeric(): Array<FunctionDeclarationCst> {
        const lFunctions: Array<FunctionDeclarationCst> = new Array<FunctionDeclarationCst>();

        return lFunctions;
    }



    /**
     * Create a cst type declaration of an array type.
     * 
     * @param pInnerType - Array inner type.
     * @param pLength - Length of array.
     * 
     * @returns cst type declaration of an array type. 
     */
    private static arrayType(pInnerType: TypeDeclarationCst, pLength: number | null = null): TypeDeclarationCst {
        // Template for array type.
        const lTemplate: Array<TypeDeclarationCst | LiteralValueExpressionCst> = new Array<TypeDeclarationCst | LiteralValueExpressionCst>();
        lTemplate.push(pInnerType);

        // Create literal expression from length.
        if (pLength !== null) {
            lTemplate.push({
                type: "LiteralValueExpression",
                range: [0, 0, 0, 0],
                textValue: pLength.toString()
            } satisfies LiteralValueExpressionCst);
        }

        return {
            type: "TypeDeclaration",
            range: [0, 0, 0, 0],
            isPointer: false,
            typeName: PgslArrayType.typeName.array,
            template: lTemplate
        };
    }

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
     * Create a cst type declaration of a pointer type.
     * 
     * @param pInnerType - Referenced type of pointer.
     * 
     * @returns cst type declaration of pointer type.
     */
    private static pointerType(pInnerType: TypeDeclarationCst): TypeDeclarationCst {
        pInnerType.isPointer = true;
        return pInnerType;
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
