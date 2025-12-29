import { PgslArrayType } from "../abstract_syntax_tree/type/pgsl-array-type.ts";
import { PgslBooleanType } from "../abstract_syntax_tree/type/pgsl-boolean-type.ts";
import { PgslMatrixType } from "../abstract_syntax_tree/type/pgsl-matrix-type.ts";
import { PgslNumericType, PgslNumericTypeName } from "../abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { PgslVectorType } from "../abstract_syntax_tree/type/pgsl-vector-type.ts";
import { FunctionDeclarationCst, FunctionDeclarationGenericCst, FunctionDeclarationHeaderCst, FunctionDeclarationParameterCst } from "../concrete_syntax_tree/declaration.type.ts";
import { ExpressionCst, LiteralValueExpressionCst } from "../concrete_syntax_tree/expression.type.ts";
import { AttributeListCst, TypeDeclarationCst } from "../concrete_syntax_tree/general.type.ts";
import { BlockStatementCst } from "../concrete_syntax_tree/statement.type.ts";
import { PgslFrexpResult } from "./structs/pgsl-frexp-result.ts";
import { PgslModfResult } from "./structs/pgsl-modf-result.ts";

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

            // Basic math
            abs: 'abs',
            acos: 'acos',
            acosh: 'acosh',
            asin: 'asin',
            asinh: 'asinh',
            atan: 'atan',
            atan2: 'atan2',
            atanh: 'atanh',
            ceil: 'ceil',
            clamp: 'clamp',
            cos: 'cos',
            cosh: 'cosh',
            countLeadingZeros: 'countLeadingZeros',
            countOneBits: 'countOneBits',
            countTrailingZeros: 'countTrailingZeros',
            cross: 'cross',
            degrees: 'degrees',
            determinant: 'determinant',
            distance: 'distance',
            dot: 'dot',
            dot4I8Packed: 'dot4I8Packed',
            dot4U8Packed: 'dot4U8Packed',
            exp: 'exp',
            exp2: 'exp2',
            extractBits: 'extractBits',
            faceForward: 'faceForward',
            firstLeadingBit: 'firstLeadingBit',
            firstTrailingBit: 'firstTrailingBit',
            floor: 'floor',
            fma: 'fma',
            fract: 'fract',
            frexp: 'frexp',
            insertBits: 'insertBits',
            inverseSqrt: 'inverseSqrt',
            ldexp: 'ldexp',
            length: 'length',
            log: 'log',
            log2: 'log2',
            max: 'max',
            min: 'min',
            mix: 'mix',
            modf: 'modf',
            normalize: 'normalize',
            pow: 'pow',
            quantizeToF16: 'quantizeToF16',
            radians: 'radians',
            reflect: 'reflect',
            refract: 'refract',
            reverseBits: 'reverseBits',
            round: 'round',
            saturate: 'saturate',
            sign: 'sign',
            sin: 'sin',
            sinh: 'sinh',
            smoothstep: 'smoothstep',
            sqrt: 'sqrt',
            step: 'step',
            tan: 'tan',
            tanh: 'tanh',
            transpose: 'transpose',
            trunc: 'trunc',
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

        // abs
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.abs, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric', 'Vector<numeric>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // acos
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.acos, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // acosh
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.acosh, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'x': 'TResult' }, 'TResult'),
        ]));

        // asin
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.asin, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // asinh
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.asinh, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'y': 'TResult' }, 'TResult'),
        ]));

        // atan
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.atan, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': [], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // atanh
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.atanh, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 't': 'TResult' }, 'TResult')
        ]));

        // --atan2
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.atan2, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'y': 'TResult', 'x': 'TResult' }, 'TResult')
        ]));

        // ceil
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.ceil, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // clamp
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.clamp, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric', 'Vector<numeric>'], }, { 'e': 'TResult', 'low': 'TResult', 'high': 'TResult' }, 'TResult')
        ]));

        // cos
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.cos, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // cosh
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.cosh, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'a': 'TResult' }, 'TResult')
        ]));

        // countLeadingZeros
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.countLeadingZeros, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-integer', 'Vector<numeric-integer>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // countOneBits
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.countOneBits, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-integer', 'Vector<numeric-integer>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // countTrailingZeros
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.countTrailingZeros, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-integer', 'Vector<numeric-integer>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // cross
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.cross, true, [
            PgslBuildInFunction.header({}, { 'a': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'b': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'a': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'b': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'a': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'b': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)))
        ]));

        // degrees
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.degrees, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult' }, 'TResult')
        ]));

        // determinant
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.determinant, true, [
            PgslBuildInFunction.header({ 'T': [`Matrix<${PgslNumericType.typeName.float32}>`], }, { 'e': 'T' }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslBuildInFunction.header({ 'T': [`Matrix<${PgslNumericType.typeName.float16}>`], }, { 'e': 'T' }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslBuildInFunction.header({ 'T': [`Matrix<${PgslNumericType.typeName.abstractFloat}>`], }, { 'e': 'T' }, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),
        ]));

        // distance
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.distance, true, [
            // Scalar
            PgslBuildInFunction.header({ 'TResult': ['numeric-float'], }, { 'e1': 'TResult', 'e2': 'TResult' }, 'TResult'),

            // Vector2
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),

            // Vector3
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),

            // Vector4
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),
        ]));

        // dot
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.dot, true, [
            // Vector2
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),

            // Vector3
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),

            // Vector4
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),
        ]));

        // dot4U8Packed
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.dot4U8Packed, true, [
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger), 'e2': PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
        ]));

        // dot4I8Packed
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.dot4I8Packed, true, [
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger), 'e2': PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
        ]));

        // exp
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.exp, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult' }, 'TResult')
        ]));

        // exp2
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.exp2, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // extractBits
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.extractBits, true, [
            PgslBuildInFunction.header({ 'TResult': [PgslNumericType.typeName.signedInteger, `Vector<${PgslNumericType.typeName.signedInteger}>`], }, { 'e': 'TResult', 'offset': PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger), 'count': PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': [PgslNumericType.typeName.unsignedInteger, `Vector<${PgslNumericType.typeName.unsignedInteger}>`], }, { 'e': 'TResult', 'offset': PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger), 'count': PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, 'TResult'),
        ]));

        // faceForward
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.faceForward, true, [
            PgslBuildInFunction.header({ 'T': ['Vector<numeric-float>'] }, { 'e1': 'T', 'e2': 'T', 'e3': 'T' }, 'T'),
        ]));

        // firstLeadingBit
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.firstLeadingBit, true, [
            PgslBuildInFunction.header({ 'TResult': [PgslNumericType.typeName.signedInteger, `Vector<${PgslNumericType.typeName.signedInteger}>`, PgslNumericType.typeName.unsignedInteger, `Vector<${PgslNumericType.typeName.unsignedInteger}>`], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // firstTrailingBit
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.firstTrailingBit, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-integer', 'Vector<numeric-integer>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // floor
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.floor, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // fma
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.fma, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': 'TResult', 'e3': 'TResult' }, 'TResult'),
        ]));

        // fract
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.fract, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // frexp
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.frexp, true, [
            // Scalar
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_f32)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_f16)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_abstractFloat)),

            // Vector2
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec2_f32)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec2_f16)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec2_abstractFloat)),

            // Vector3
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec3_f32)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec3_f16)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec3_abstractFloat)),

            // Vector4
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec4_f32)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec4_f16)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec4_abstractFloat)),
        ]));

        // insertBits
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.insertBits, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-integer', 'Vector<numeric-integer>'], }, { 'e': 'TResult', 'newbits': 'TResult', 'offset': PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger), 'count': PgslBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, 'TResult')
        ]));

        // inverseSqrt
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.inverseSqrt, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // ldexp
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.ldexp, true, [
            // Scalar
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger) }, 'TResult'),

            // Vector2
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)) }, 'TResult'),

            // Vector3
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)) }, 'TResult'),

            // Vector4
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, 'TResult'),
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)) }, 'TResult'),
        ]));

        // length
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.length, true, [
            // Scalar
            PgslBuildInFunction.header({ 'TResult': ['numeric-float'], }, { 'e': 'TResult' }, 'TResult'),

            // Vector2
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),

            // Vector3
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),

            // Vector4
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))
        ]));

        // log
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.log, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // log2
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.log2, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // max
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.max, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric', 'Vector<numeric>'], }, { 'e1': 'TResult', 'e2': 'TResult' }, 'TResult')
        ]));

        // min
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.min, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric', 'Vector<numeric>'], }, { 'e1': 'TResult', 'e2': 'TResult' }, 'TResult')
        ]));

        // mix
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.mix, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': 'TResult', 'e3': 'TResult' }, 'TResult'),

            // Vector 2
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // Vector 3
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // Vector 4
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)))
        ]));

        // modf
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.modf, true, [
            // Scalar
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslBuildInFunction.structType(PgslModfResult.names.__modf_result_f32)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslBuildInFunction.structType(PgslModfResult.names.__modf_result_f16)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslBuildInFunction.structType(PgslModfResult.names.__modf_result_abstractFloat)),

            // Vector2
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.structType(PgslModfResult.names.__modf_result_vec2_f32)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.structType(PgslModfResult.names.__modf_result_vec2_f16)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.structType(PgslModfResult.names.__modf_result_vec2_abstractFloat)),

            // Vector3
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.structType(PgslModfResult.names.__modf_result_vec3_f32)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.structType(PgslModfResult.names.__modf_result_vec3_f16)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.structType(PgslModfResult.names.__modf_result_vec3_abstractFloat)),

            // Vector4
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.structType(PgslModfResult.names.__modf_result_vec4_f32)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.structType(PgslModfResult.names.__modf_result_vec4_f16)),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.structType(PgslModfResult.names.__modf_result_vec4_abstractFloat)),
        ]));

        // normalize
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.normalize, true, [
            PgslBuildInFunction.header({ 'TVector': ['Vector<numeric-float>'], }, { 'e': 'TVector' }, 'TVector'),
        ]));

        // pow
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.pow, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': 'TResult' }, 'TResult')
        ]));

        // quantizeToF16
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.quantizeToF16, true, [
            PgslBuildInFunction.header({ 'TResult': [PgslNumericType.typeName.float32, `Vector<${PgslNumericType.typeName.float32}>`], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // radians
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.radians, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult' }, 'TResult')
        ]));

        // reflect
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.reflect, true, [
            PgslBuildInFunction.header({ 'TVector': ['Vector<numeric-float>'], }, { 'e1': 'TVector', 'e2': 'TVector' }, 'TVector'),
        ]));

        // refract
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.refract, true, [
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslBuildInFunction.vectorType(2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslBuildInFunction.vectorType(3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e1': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e3': PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslBuildInFunction.vectorType(4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),
        ]));

        // reverseBits
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.reverseBits, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-integer', 'Vector<numeric-integer>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // round
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.round, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // saturate
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.saturate, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // sign
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.sign, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric', 'Vector<numeric>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // sin
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.sin, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // sinh
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.sinh, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'a': 'TResult' }, 'TResult')
        ]));

        // smoothstep
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.smoothstep, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'edge0': 'TResult', 'edge1': 'TResult', 'x': 'TResult' }, 'TResult')
        ]));

        // sqrt
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.sqrt, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // step
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.step, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'edge': 'TResult', 'x': 'TResult' }, 'TResult')
        ]));

        // tan
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.tan, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // tanh
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.tanh, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'a': 'TResult' }, 'TResult')
        ]));

        // transpose
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.transpose, true, [
            // 2x2
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(2, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.matrixType(2, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(2, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.matrixType(2, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(2, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.matrixType(2, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 2x3
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(2, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.matrixType(3, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(2, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.matrixType(3, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(2, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.matrixType(3, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 2x4
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(2, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.matrixType(4, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(2, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.matrixType(4, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(2, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.matrixType(4, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 3x2
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(3, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.matrixType(2, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(3, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.matrixType(2, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(3, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.matrixType(2, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 3x3
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(3, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.matrixType(3, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(3, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.matrixType(3, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(3, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.matrixType(3, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 3x4
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(3, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.matrixType(4, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(3, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.matrixType(4, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(3, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.matrixType(4, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 4x2
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(4, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.matrixType(2, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(4, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.matrixType(2, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(4, 2, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.matrixType(2, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 4x3
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(4, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.matrixType(3, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(4, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.matrixType(3, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(4, 3, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.matrixType(3, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 4x4
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(4, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslBuildInFunction.matrixType(4, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(4, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslBuildInFunction.matrixType(4, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslBuildInFunction.header({}, { 'e': PgslBuildInFunction.matrixType(4, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslBuildInFunction.matrixType(4, 4, PgslBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),
        ]));

        // trunc
        lFunctions.push(PgslBuildInFunction.create(PgslBuildInFunction.names.trunc, true, [
            PgslBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

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
