import { PgslBooleanType } from "../../abstract_syntax_tree/type/pgsl-boolean-type.ts";
import { PgslMatrixType } from "../../abstract_syntax_tree/type/pgsl-matrix-type.ts";
import { PgslNumericType, PgslNumericTypeName } from "../../abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { PgslVectorType } from "../../abstract_syntax_tree/type/pgsl-vector-type.ts";
import { FunctionDeclarationCst, FunctionDeclarationGenericCst, FunctionDeclarationHeaderCst, FunctionDeclarationParameterCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { AttributeListCst, TypeDeclarationCst } from "../../concrete_syntax_tree/general.type.ts";
import { BlockStatementCst } from "../../concrete_syntax_tree/statement.type.ts";
import { PgslFrexpResult } from "../struct/pgsl-frexp-result.ts";
import { PgslModfResult } from "../struct/pgsl-modf-result.ts";

export class PgslNumericBuildInFunction {
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

            // Derivative
            dpdx: 'dpdx',
            dpdxCoarse: 'dpdxCoarse',
            dpdxFine: 'dpdxFine',
            dpdy: 'dpdy',
            dpdyCoarse: 'dpdyCoarse',
            dpdyFine: 'dpdyFine',
            fwidth: 'fwidth',
            fwidthCoarse: 'fwidthCoarse',
            fwidthFine: 'fwidthFine',
        } as const;
    }

    /**
     * Create array functions.
     * 
     * @returns list of cst function declarations for array functions. 
     */
    public static array(): Array<FunctionDeclarationCst> {
        const lFunctions: Array<FunctionDeclarationCst> = new Array<FunctionDeclarationCst>();

        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.arrayLength, true, false, [
            PgslNumericBuildInFunction.header({ 'TResult': ['Pointer<Array>'], }, { 'array': 'TResult' }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)),
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
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.bitcast, false, true, [
            // Numerics
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric'], }, { 'value': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric'], }, { 'value': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric'], }, { 'value': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric'], }, { 'value': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, 'TResult'),

            // Numeric Vectors.
            PgslNumericBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)) }, 'TResult'),

            PgslNumericBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)) }, 'TResult'),

            PgslNumericBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['Vector<numeric>'], }, { 'value': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)) }, 'TResult'),
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
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.all, true, true, [
            PgslNumericBuildInFunction.header({}, { 'value': PgslNumericBuildInFunction.booleanType() }, PgslNumericBuildInFunction.booleanType()),
            PgslNumericBuildInFunction.header({}, { 'value': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.booleanType()) }, PgslNumericBuildInFunction.booleanType()),
            PgslNumericBuildInFunction.header({}, { 'value': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.booleanType()) }, PgslNumericBuildInFunction.booleanType()),
            PgslNumericBuildInFunction.header({}, { 'value': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.booleanType()) }, PgslNumericBuildInFunction.booleanType()),
        ]));

        // any
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.any, true, true, [
            PgslNumericBuildInFunction.header({}, { 'value': PgslNumericBuildInFunction.booleanType() }, PgslNumericBuildInFunction.booleanType()),
            PgslNumericBuildInFunction.header({}, { 'value': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.booleanType()) }, PgslNumericBuildInFunction.booleanType()),
            PgslNumericBuildInFunction.header({}, { 'value': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.booleanType()) }, PgslNumericBuildInFunction.booleanType()),
            PgslNumericBuildInFunction.header({}, { 'value': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.booleanType()) }, PgslNumericBuildInFunction.booleanType()),
        ]));

        // select
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.select, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': [], }, { 'trueValue': 'TResult', 'falseValue': 'TResult', 'condition': PgslNumericBuildInFunction.booleanType() }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['Vector2'], }, { 'trueValue': 'TResult', 'falseValue': 'TResult', 'condition': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.booleanType()) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['Vector3'], }, { 'trueValue': 'TResult', 'falseValue': 'TResult', 'condition': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.booleanType()) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['Vector4'], }, { 'trueValue': 'TResult', 'falseValue': 'TResult', 'condition': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.booleanType()) }, 'TResult'),
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
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.abs, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric', 'Vector<numeric>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // acos
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.acos, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // acosh
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.acosh, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'x': 'TResult' }, 'TResult'),
        ]));

        // asin
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.asin, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // asinh
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.asinh, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'y': 'TResult' }, 'TResult'),
        ]));

        // atan
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.atan, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': [], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // atanh
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.atanh, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 't': 'TResult' }, 'TResult')
        ]));

        // --atan2
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.atan2, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'y': 'TResult', 'x': 'TResult' }, 'TResult')
        ]));

        // ceil
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.ceil, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // clamp
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.clamp, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric', 'Vector<numeric>'], }, { 'e': 'TResult', 'low': 'TResult', 'high': 'TResult' }, 'TResult')
        ]));

        // cos
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.cos, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // cosh
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.cosh, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'a': 'TResult' }, 'TResult')
        ]));

        // countLeadingZeros
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.countLeadingZeros, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-integer', 'Vector<numeric-integer>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // countOneBits
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.countOneBits, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-integer', 'Vector<numeric-integer>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // countTrailingZeros
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.countTrailingZeros, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-integer', 'Vector<numeric-integer>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // cross
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.cross, true, true, [
            PgslNumericBuildInFunction.header({}, { 'a': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'b': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'a': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'b': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'a': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'b': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)))
        ]));

        // degrees
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.degrees, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult' }, 'TResult')
        ]));

        // determinant
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.determinant, true, true, [
            PgslNumericBuildInFunction.header({ 'T': [`Matrix<${PgslNumericType.typeName.float32}>`], }, { 'e': 'T' }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslNumericBuildInFunction.header({ 'T': [`Matrix<${PgslNumericType.typeName.float16}>`], }, { 'e': 'T' }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslNumericBuildInFunction.header({ 'T': [`Matrix<${PgslNumericType.typeName.abstractFloat}>`], }, { 'e': 'T' }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),
        ]));

        // distance
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.distance, true, true, [
            // Scalar
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float'], }, { 'e1': 'TResult', 'e2': 'TResult' }, 'TResult'),

            // Vector2
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),

            // Vector3
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),

            // Vector4
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),
        ]));

        // dot
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.dot, true, true, [
            // Vector2
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),

            // Vector3
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),

            // Vector4
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),
        ]));

        // dot4U8Packed
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.dot4U8Packed, true, true, [
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger), 'e2': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger))
        ]));

        // dot4I8Packed
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.dot4I8Packed, true, true, [
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger), 'e2': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger))
        ]));

        // exp
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.exp, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult' }, 'TResult')
        ]));

        // exp2
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.exp2, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // extractBits
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.extractBits, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': [PgslNumericType.typeName.signedInteger, `Vector<${PgslNumericType.typeName.signedInteger}>`], }, { 'e': 'TResult', 'offset': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger), 'count': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': [PgslNumericType.typeName.unsignedInteger, `Vector<${PgslNumericType.typeName.unsignedInteger}>`], }, { 'e': 'TResult', 'offset': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger), 'count': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, 'TResult'),
        ]));

        // faceForward
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.faceForward, true, true, [
            PgslNumericBuildInFunction.header({ 'T': ['Vector<numeric-float>'] }, { 'e1': 'T', 'e2': 'T', 'e3': 'T' }, 'T'),
        ]));

        // firstLeadingBit
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.firstLeadingBit, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': [PgslNumericType.typeName.signedInteger, `Vector<${PgslNumericType.typeName.signedInteger}>`, PgslNumericType.typeName.unsignedInteger, `Vector<${PgslNumericType.typeName.unsignedInteger}>`], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // firstTrailingBit
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.firstTrailingBit, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-integer', 'Vector<numeric-integer>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // floor
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.floor, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // fma
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.fma, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': 'TResult', 'e3': 'TResult' }, 'TResult'),
        ]));

        // fract
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.fract, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // frexp
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.frexp, true, true, [
            // Scalar
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslNumericBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_f32)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslNumericBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_f16)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslNumericBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_abstractFloat)),

            // Vector2
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec2_f32)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec2_f16)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec2_abstractFloat)),

            // Vector3
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec3_f32)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec3_f16)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec3_abstractFloat)),

            // Vector4
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec4_f32)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec4_f16)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.structType(PgslFrexpResult.names.__frexp_result_vec4_abstractFloat)),
        ]));

        // insertBits
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.insertBits, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-integer', 'Vector<numeric-integer>'], }, { 'e': 'TResult', 'newbits': 'TResult', 'offset': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger), 'count': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.unsignedInteger) }, 'TResult')
        ]));

        // inverseSqrt
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.inverseSqrt, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // ldexp
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.ldexp, true, true, [
            // Scalar
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger) }, 'TResult'),

            // Vector2
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)) }, 'TResult'),

            // Vector3
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)) }, 'TResult'),

            // Vector4
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.signedInteger)) }, 'TResult'),
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractInteger)) }, 'TResult'),
        ]));

        // length
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.length, true, true, [
            // Scalar
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float'], }, { 'e': 'TResult' }, 'TResult'),

            // Vector2
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),

            // Vector3
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)),

            // Vector4
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))
        ]));

        // log
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.log, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // log2
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.log2, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // max
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.max, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric', 'Vector<numeric>'], }, { 'e1': 'TResult', 'e2': 'TResult' }, 'TResult')
        ]));

        // min
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.min, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric', 'Vector<numeric>'], }, { 'e1': 'TResult', 'e2': 'TResult' }, 'TResult')
        ]));

        // mix
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.mix, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': 'TResult', 'e3': 'TResult' }, 'TResult'),

            // Vector 2
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // Vector 3
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // Vector 4
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)))
        ]));

        // modf
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.modf, true, true, [
            // Scalar
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslNumericBuildInFunction.structType(PgslModfResult.names.__modf_result_f32)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslNumericBuildInFunction.structType(PgslModfResult.names.__modf_result_f16)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslNumericBuildInFunction.structType(PgslModfResult.names.__modf_result_abstractFloat)),

            // Vector2
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.structType(PgslModfResult.names.__modf_result_vec2_f32)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.structType(PgslModfResult.names.__modf_result_vec2_f16)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.structType(PgslModfResult.names.__modf_result_vec2_abstractFloat)),

            // Vector3
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.structType(PgslModfResult.names.__modf_result_vec3_f32)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.structType(PgslModfResult.names.__modf_result_vec3_f16)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.structType(PgslModfResult.names.__modf_result_vec3_abstractFloat)),

            // Vector4
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.structType(PgslModfResult.names.__modf_result_vec4_f32)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.structType(PgslModfResult.names.__modf_result_vec4_f16)),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.structType(PgslModfResult.names.__modf_result_vec4_abstractFloat)),
        ]));

        // normalize
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.normalize, true, true, [
            PgslNumericBuildInFunction.header({ 'TVector': ['Vector<numeric-float>'], }, { 'e': 'TVector' }, 'TVector'),
        ]));

        // pow
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.pow, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult', 'e2': 'TResult' }, 'TResult')
        ]));

        // quantizeToF16
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.quantizeToF16, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': [PgslNumericType.typeName.float32, `Vector<${PgslNumericType.typeName.float32}>`], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // radians
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.radians, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e1': 'TResult' }, 'TResult')
        ]));

        // reflect
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.reflect, true, true, [
            PgslNumericBuildInFunction.header({ 'TVector': ['Vector<numeric-float>'], }, { 'e1': 'TVector', 'e2': 'TVector' }, 'TVector'),
        ]));

        // refract
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.refract, true, true, [
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslNumericBuildInFunction.vectorType(2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslNumericBuildInFunction.vectorType(3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32) }, PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16) }, PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e1': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e2': PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)), 'e3': PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat) }, PgslNumericBuildInFunction.vectorType(4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),
        ]));

        // reverseBits
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.reverseBits, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-integer', 'Vector<numeric-integer>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // round
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.round, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // saturate
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.saturate, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // sign
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.sign, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric', 'Vector<numeric>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // sin
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.sin, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // sinh
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.sinh, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'a': 'TResult' }, 'TResult')
        ]));

        // smoothstep
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.smoothstep, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'edge0': 'TResult', 'edge1': 'TResult', 'x': 'TResult' }, 'TResult')
        ]));

        // sqrt
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.sqrt, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // step
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.step, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'edge': 'TResult', 'x': 'TResult' }, 'TResult')
        ]));

        // tan
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.tan, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // tanh
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.tanh, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'a': 'TResult' }, 'TResult')
        ]));

        // transpose
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.transpose, true, true, [
            // 2x2
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(2, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.matrixType(2, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(2, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.matrixType(2, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(2, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.matrixType(2, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 2x3
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(2, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.matrixType(3, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(2, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.matrixType(3, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(2, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.matrixType(3, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 2x4
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(2, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.matrixType(4, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(2, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.matrixType(4, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(2, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.matrixType(4, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 3x2
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(3, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.matrixType(2, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(3, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.matrixType(2, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(3, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.matrixType(2, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 3x3
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(3, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.matrixType(3, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(3, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.matrixType(3, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(3, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.matrixType(3, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 3x4
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(3, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.matrixType(4, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(3, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.matrixType(4, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(3, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.matrixType(4, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 4x2
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(4, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.matrixType(2, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(4, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.matrixType(2, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(4, 2, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.matrixType(2, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 4x3
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(4, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.matrixType(3, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(4, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.matrixType(3, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(4, 3, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.matrixType(3, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),

            // 4x4
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(4, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32)) }, PgslNumericBuildInFunction.matrixType(4, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float32))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(4, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16)) }, PgslNumericBuildInFunction.matrixType(4, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.float16))),
            PgslNumericBuildInFunction.header({}, { 'e': PgslNumericBuildInFunction.matrixType(4, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat)) }, PgslNumericBuildInFunction.matrixType(4, 4, PgslNumericBuildInFunction.numericType(PgslNumericType.typeName.abstractFloat))),
        ]));

        // trunc
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.trunc, true, true, [
            PgslNumericBuildInFunction.header({ 'TResult': ['numeric-float', 'Vector<numeric-float>'], }, { 'e': 'TResult' }, 'TResult')
        ]));

        return lFunctions;
    }

    public static derivative(): Array<FunctionDeclarationCst> {
        const lFunctions: Array<FunctionDeclarationCst> = new Array<FunctionDeclarationCst>();

        // dpdx
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.dpdx, true, false, [
            PgslNumericBuildInFunction.header({ 'TResult': ['f32', 'Vector<f32>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // dpdxCoarse
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.dpdxCoarse, true, false, [
            PgslNumericBuildInFunction.header({ 'TResult': ['f32', 'Vector<f32>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // dpdxFine
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.dpdxFine, true, false, [
            PgslNumericBuildInFunction.header({ 'TResult': ['f32', 'Vector<f32>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // dpdy
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.dpdy, true, false, [
            PgslNumericBuildInFunction.header({ 'TResult': ['f32', 'Vector<f32>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // dpdyCoarse
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.dpdyCoarse, true, false, [
            PgslNumericBuildInFunction.header({ 'TResult': ['f32', 'Vector<f32>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // dpdyFine
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.dpdyFine, true, false, [
            PgslNumericBuildInFunction.header({ 'TResult': ['f32', 'Vector<f32>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // fwidth
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.fwidth, true, false, [
            PgslNumericBuildInFunction.header({ 'TResult': ['f32', 'Vector<f32>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // fwidthCoarse
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.fwidthCoarse, true, false, [
            PgslNumericBuildInFunction.header({ 'TResult': ['f32', 'Vector<f32>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // fwidthFine
        lFunctions.push(PgslNumericBuildInFunction.create(PgslNumericBuildInFunction.names.fwidthFine, true, false, [
            PgslNumericBuildInFunction.header({ 'TResult': ['f32', 'Vector<f32>'], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        return lFunctions;
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
    private static header(pGenerics: PgslNumericBuildInFunctionGenericList, pParameter: PgslNumericBuildInFunctionParameterList, pReturnType: TypeDeclarationCst | string): FunctionDeclarationHeaderCst {
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

type PgslNumericBuildInFunctionParameterList = {
    [name: string]: TypeDeclarationCst | string;
};

type PgslNumericBuildInFunctionGenericList = {
    [name: string]: Array<string>;
};
