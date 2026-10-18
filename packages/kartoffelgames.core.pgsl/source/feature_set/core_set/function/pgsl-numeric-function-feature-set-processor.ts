import type { IExpressionAst } from '../../../abstract_syntax_tree/expression/i-expression-ast.interface.ts';
import { FunctionCallExpressionAst } from "../../../abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts";
import { type BasePgslType, BasePgslTypeKind } from '../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslArrayType } from '../../../abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslBooleanType } from '../../../abstract_syntax_tree/type/definition/pgsl-boolean-type.ts';
import { PgslMatrixType } from '../../../abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslPointerType } from '../../../abstract_syntax_tree/type/definition/pgsl-pointer-type.ts';
import { PgslStructType } from '../../../abstract_syntax_tree/type/definition/pgsl-struct-type.ts';
import { PgslVectorType } from '../../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslFeatureSetProcessor } from '../../pgsl-feature-set-processor.ts';
import { PgslFrexpStructFeatureSetConstructor } from '../struct/pgsl-frexp-struct-feature-set-processor.ts';
import { PgslModfStructFeatureSetProcessor } from '../struct/pgsl-modf-struct-feature-set-processor.ts';

/**
 * Numeric, logical, array, bit reinterpretation and derivative functions.
 */
export class PgslNumericFunctionFeatureSetProcessor extends PgslFeatureSetProcessor {
    /**
     * All possible function names.
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
     * Process declaration creations.
     */
    protected override onProcess(): void {
        this.registerBitReinterpretationFunctions();
        this.registerLogicalFunctions();
        this.registerArrayFunctions();
        this.registerNumericFunctions();
        this.registerDerivativeFunctions();
    }

    /**
     * Get all concrete float types.
     * Abstract floats are accepted by converting into them.
     *
     * @returns all concrete float types.
     */
    private floatTypes(): Array<BasePgslType> {
        return [
            this.types.create(PgslNumericType, PgslNumericType.typeName.float32),
            this.types.create(PgslNumericType, PgslNumericType.typeName.float16)
        ];
    }

    /**
     * Get all concrete integer types.
     * Abstract integers are accepted by converting into them.
     *
     * @returns all concrete integer types.
     */
    private integerTypes(): Array<BasePgslType> {
        return [
            this.types.create(PgslNumericType, PgslNumericType.typeName.signedInteger),
            this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger)
        ];
    }

    /**
     * Get all concrete numeric types.
     *
     * @returns all concrete float and integer types.
     */
    private numericTypes(): Array<BasePgslType> {
        return [...this.floatTypes(), ...this.integerTypes()];
    }

    /**
     * Register array functions.
     */
    private registerArrayFunctions(): void {
        // Scalar types used by the overloads.
        const lUnsignedInteger: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger);

        // arrayLength
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.arrayLength, {}, [
            // TODO: Restrict to pointers of arrays with any element type once pointer types can express it. An empty restriction accepts nothing yet.
            this.createOverload({ 'TResult': [], }, { 'array': 'TResult' }, lUnsignedInteger),
        ], (pCall: FunctionCallExpressionAst, pPushIncident) => {
            // Try to read array type.
            const lArrayType: BasePgslType | undefined = pCall.getParameter('array')?.data.resolveType;
            if (!lArrayType) {
                return;
            }

            // Must be a pointer type.
            if (!(lArrayType instanceof PgslPointerType)) {
                return;
            }

            // The references type cant be a fixed array.
            if (lArrayType.referencedType.isKind(BasePgslTypeKind.FixedFootprint)) {
                pPushIncident(`References array must be runtime-sized.`);
            }
        }));
    }

    /**
     * Register bit reinterpretation functions.
     */
    private registerBitReinterpretationFunctions(): void {
        // Scalar types used by the overloads.
        const lFloat32: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.float32);
        const lSignedInteger: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.signedInteger);
        const lUnsignedInteger: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger);

        // bitcast
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.bitcast, { constant: true, explicitGenerics: true }, [
            // Numerics
            this.createOverload({ 'TResult': [lFloat32, lSignedInteger, lUnsignedInteger] }, { 'value': lFloat32 }, 'TResult'),
            this.createOverload({ 'TResult': [lFloat32, lSignedInteger, lUnsignedInteger], }, { 'value': lSignedInteger }, 'TResult'),
            this.createOverload({ 'TResult': [lFloat32, lSignedInteger, lUnsignedInteger], }, { 'value': lUnsignedInteger }, 'TResult'),

            // Numeric Vectors.
            this.createOverload({ 'TResult': [this.types.create(PgslVectorType, 2, lFloat32), this.types.create(PgslVectorType, 2, lSignedInteger), this.types.create(PgslVectorType, 2, lUnsignedInteger)], }, { 'value': this.types.create(PgslVectorType, 2, lFloat32) }, 'TResult'),
            this.createOverload({ 'TResult': [this.types.create(PgslVectorType, 2, lFloat32), this.types.create(PgslVectorType, 2, lSignedInteger), this.types.create(PgslVectorType, 2, lUnsignedInteger)], }, { 'value': this.types.create(PgslVectorType, 2, lSignedInteger) }, 'TResult'),
            this.createOverload({ 'TResult': [this.types.create(PgslVectorType, 2, lFloat32), this.types.create(PgslVectorType, 2, lSignedInteger), this.types.create(PgslVectorType, 2, lUnsignedInteger)], }, { 'value': this.types.create(PgslVectorType, 2, lUnsignedInteger) }, 'TResult'),

            this.createOverload({ 'TResult': [this.types.create(PgslVectorType, 3, lFloat32), this.types.create(PgslVectorType, 3, lSignedInteger), this.types.create(PgslVectorType, 3, lUnsignedInteger)], }, { 'value': this.types.create(PgslVectorType, 3, lFloat32) }, 'TResult'),
            this.createOverload({ 'TResult': [this.types.create(PgslVectorType, 3, lFloat32), this.types.create(PgslVectorType, 3, lSignedInteger), this.types.create(PgslVectorType, 3, lUnsignedInteger)], }, { 'value': this.types.create(PgslVectorType, 3, lSignedInteger) }, 'TResult'),
            this.createOverload({ 'TResult': [this.types.create(PgslVectorType, 3, lFloat32), this.types.create(PgslVectorType, 3, lSignedInteger), this.types.create(PgslVectorType, 3, lUnsignedInteger)], }, { 'value': this.types.create(PgslVectorType, 3, lUnsignedInteger) }, 'TResult'),

            this.createOverload({ 'TResult': [this.types.create(PgslVectorType, 4, lFloat32), this.types.create(PgslVectorType, 4, lSignedInteger), this.types.create(PgslVectorType, 4, lUnsignedInteger)], }, { 'value': this.types.create(PgslVectorType, 4, lFloat32) }, 'TResult'),
            this.createOverload({ 'TResult': [this.types.create(PgslVectorType, 4, lFloat32), this.types.create(PgslVectorType, 4, lSignedInteger), this.types.create(PgslVectorType, 4, lUnsignedInteger)], }, { 'value': this.types.create(PgslVectorType, 4, lSignedInteger) }, 'TResult'),
            this.createOverload({ 'TResult': [this.types.create(PgslVectorType, 4, lFloat32), this.types.create(PgslVectorType, 4, lSignedInteger), this.types.create(PgslVectorType, 4, lUnsignedInteger)], }, { 'value': this.types.create(PgslVectorType, 4, lUnsignedInteger) }, 'TResult'),
        ]));
    }

    /**
     * Register derivative functions.
     */
    private registerDerivativeFunctions(): void {
        // Scalar types used by the overloads.
        const lFloat32: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.float32);

        // dpdx
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.dpdx, {}, [
            this.createOverload({ 'TResult': [lFloat32, ...this.vectorTypes([lFloat32])], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // dpdxCoarse
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.dpdxCoarse, {}, [
            this.createOverload({ 'TResult': [lFloat32, ...this.vectorTypes([lFloat32])], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // dpdxFine
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.dpdxFine, {}, [
            this.createOverload({ 'TResult': [lFloat32, ...this.vectorTypes([lFloat32])], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // dpdy
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.dpdy, {}, [
            this.createOverload({ 'TResult': [lFloat32, ...this.vectorTypes([lFloat32])], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // dpdyCoarse
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.dpdyCoarse, {}, [
            this.createOverload({ 'TResult': [lFloat32, ...this.vectorTypes([lFloat32])], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // dpdyFine
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.dpdyFine, {}, [
            this.createOverload({ 'TResult': [lFloat32, ...this.vectorTypes([lFloat32])], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // fwidth
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.fwidth, {}, [
            this.createOverload({ 'TResult': [lFloat32, ...this.vectorTypes([lFloat32])], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // fwidthCoarse
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.fwidthCoarse, {}, [
            this.createOverload({ 'TResult': [lFloat32, ...this.vectorTypes([lFloat32])], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // fwidthFine
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.fwidthFine, {}, [
            this.createOverload({ 'TResult': [lFloat32, ...this.vectorTypes([lFloat32])], }, { 'e': 'TResult' }, 'TResult'),
        ]));
    }

    /**
     * Register logical functions.
     */
    private registerLogicalFunctions(): void {
        // Scalar types used by the overloads.
        const lBoolean: BasePgslType = this.types.create(PgslBooleanType);

        // all
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.all, { constant: true }, [
            this.createOverload({}, { 'value': lBoolean }, lBoolean),
            this.createOverload({}, { 'value': this.types.create(PgslVectorType, 2, lBoolean) }, lBoolean),
            this.createOverload({}, { 'value': this.types.create(PgslVectorType, 3, lBoolean) }, lBoolean),
            this.createOverload({}, { 'value': this.types.create(PgslVectorType, 4, lBoolean) }, lBoolean),
        ]));

        // any
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.any, { constant: true }, [
            this.createOverload({}, { 'value': lBoolean }, lBoolean),
            this.createOverload({}, { 'value': this.types.create(PgslVectorType, 2, lBoolean) }, lBoolean),
            this.createOverload({}, { 'value': this.types.create(PgslVectorType, 3, lBoolean) }, lBoolean),
            this.createOverload({}, { 'value': this.types.create(PgslVectorType, 4, lBoolean) }, lBoolean),
        ]));

        // select
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.select, { constant: true }, [
            this.createOverload({ 'TResult': [...this.scalarTypes(), ...this.vectorTypes(this.scalarTypes())], }, { 'trueValue': 'TResult', 'falseValue': 'TResult', 'condition': lBoolean }, 'TResult'),
            this.createOverload({ 'TResult': this.vectorTypes(this.scalarTypes(), [2]), }, { 'trueValue': 'TResult', 'falseValue': 'TResult', 'condition': this.types.create(PgslVectorType, 2, lBoolean) }, 'TResult'),
            this.createOverload({ 'TResult': this.vectorTypes(this.scalarTypes(), [3]), }, { 'trueValue': 'TResult', 'falseValue': 'TResult', 'condition': this.types.create(PgslVectorType, 3, lBoolean) }, 'TResult'),
            this.createOverload({ 'TResult': this.vectorTypes(this.scalarTypes(), [4]), }, { 'trueValue': 'TResult', 'falseValue': 'TResult', 'condition': this.types.create(PgslVectorType, 4, lBoolean) }, 'TResult'),
        ]));
    }

    /**
     * Register numeric functions.
     */
    private registerNumericFunctions(): void {
        // Scalar types used by the overloads.
        const lFloat32: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.float32);
        const lFloat16: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.float16);
        const lAbstractFloat: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.abstractFloat);
        const lSignedInteger: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.signedInteger);
        const lUnsignedInteger: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger);
        const lAbstractInteger: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.abstractInteger);

        // abs
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.abs, { constant: true }, [
            this.createOverload({ 'TResult': [...this.numericTypes(), ...this.vectorTypes(this.numericTypes())], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // acos
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.acos, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // acosh
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.acosh, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'x': 'TResult' }, 'TResult'),
        ]));

        // asin
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.asin, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // asinh
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.asinh, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'y': 'TResult' }, 'TResult'),
        ]));

        // atan
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.atan, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // atanh
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.atanh, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 't': 'TResult' }, 'TResult')
        ]));

        // --atan2
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.atan2, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'y': 'TResult', 'x': 'TResult' }, 'TResult')
        ]));

        // ceil
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.ceil, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // clamp
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.clamp, { constant: true }, [
            this.createOverload({ 'TResult': [...this.numericTypes(), ...this.vectorTypes(this.numericTypes())], }, { 'e': 'TResult', 'low': 'TResult', 'high': 'TResult' }, 'TResult')
        ], (pCall: FunctionCallExpressionAst, pPushIncident) => {
            // Constant low must not be greater than constant high.
            const lLow: number | string | null = pCall.getParameter('low')?.data.constantValue ?? null;
            const lHigh: number | string | null = pCall.getParameter('high')?.data.constantValue ?? null;
            if (typeof lLow === 'number' && typeof lHigh === 'number' && lLow > lHigh) {
                pPushIncident(`Low value of clamp must not be greater than its high value.`);
            }
        }));

        // cos
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.cos, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // cosh
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.cosh, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'a': 'TResult' }, 'TResult')
        ]));

        // countLeadingZeros
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.countLeadingZeros, { constant: true }, [
            this.createOverload({ 'TResult': [...this.integerTypes(), ...this.vectorTypes(this.integerTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // countOneBits
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.countOneBits, { constant: true }, [
            this.createOverload({ 'TResult': [...this.integerTypes(), ...this.vectorTypes(this.integerTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // countTrailingZeros
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.countTrailingZeros, { constant: true }, [
            this.createOverload({ 'TResult': [...this.integerTypes(), ...this.vectorTypes(this.integerTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // cross
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.cross, { constant: true }, [
            this.createOverload({}, { 'a': this.types.create(PgslVectorType, 3, lFloat32), 'b': this.types.create(PgslVectorType, 3, lFloat32) }, this.types.create(PgslVectorType, 3, lFloat32)),
            this.createOverload({}, { 'a': this.types.create(PgslVectorType, 3, lFloat16), 'b': this.types.create(PgslVectorType, 3, lFloat16) }, this.types.create(PgslVectorType, 3, lFloat16)),
            this.createOverload({}, { 'a': this.types.create(PgslVectorType, 3, lAbstractFloat), 'b': this.types.create(PgslVectorType, 3, lAbstractFloat) }, this.types.create(PgslVectorType, 3, lAbstractFloat))
        ]));

        // degrees
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.degrees, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e1': 'TResult' }, 'TResult')
        ]));

        // determinant
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.determinant, { constant: true }, [
            this.createOverload({ 'T': this.squareMatrixTypes(lFloat32), }, { 'e': 'T' }, lFloat32),
            this.createOverload({ 'T': this.squareMatrixTypes(lFloat16), }, { 'e': 'T' }, lFloat16),
            this.createOverload({ 'T': this.squareMatrixTypes(lAbstractFloat), }, { 'e': 'T' }, lAbstractFloat),
        ]));

        // distance
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.distance, { constant: true }, [
            // Scalar
            this.createOverload({ 'TResult': this.floatTypes(), }, { 'e1': 'TResult', 'e2': 'TResult' }, 'TResult'),

            // Vector2
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lFloat32), 'e2': this.types.create(PgslVectorType, 2, lFloat32) }, lFloat32),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lFloat16), 'e2': this.types.create(PgslVectorType, 2, lFloat16) }, lFloat16),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 2, lAbstractFloat) }, lAbstractFloat),

            // Vector3
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lFloat32), 'e2': this.types.create(PgslVectorType, 3, lFloat32) }, lFloat32),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lFloat16), 'e2': this.types.create(PgslVectorType, 3, lFloat16) }, lFloat16),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 3, lAbstractFloat) }, lAbstractFloat),

            // Vector4
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lFloat32), 'e2': this.types.create(PgslVectorType, 4, lFloat32) }, lFloat32),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lFloat16), 'e2': this.types.create(PgslVectorType, 4, lFloat16) }, lFloat16),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 4, lAbstractFloat) }, lAbstractFloat),
        ]));

        // dot
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.dot, { constant: true }, [
            // Vector2
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lSignedInteger), 'e2': this.types.create(PgslVectorType, 2, lSignedInteger) }, lSignedInteger),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lUnsignedInteger), 'e2': this.types.create(PgslVectorType, 2, lUnsignedInteger) }, lUnsignedInteger),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lFloat16), 'e2': this.types.create(PgslVectorType, 2, lFloat16) }, lFloat16),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lFloat32), 'e2': this.types.create(PgslVectorType, 2, lFloat32) }, lFloat32),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lAbstractInteger), 'e2': this.types.create(PgslVectorType, 2, lAbstractInteger) }, lAbstractInteger),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 2, lAbstractFloat) }, lAbstractFloat),

            // Vector3
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lSignedInteger), 'e2': this.types.create(PgslVectorType, 3, lSignedInteger) }, lSignedInteger),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lUnsignedInteger), 'e2': this.types.create(PgslVectorType, 3, lUnsignedInteger) }, lUnsignedInteger),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lFloat16), 'e2': this.types.create(PgslVectorType, 3, lFloat16) }, lFloat16),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lFloat32), 'e2': this.types.create(PgslVectorType, 3, lFloat32) }, lFloat32),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lAbstractInteger), 'e2': this.types.create(PgslVectorType, 3, lAbstractInteger) }, lAbstractInteger),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 3, lAbstractFloat) }, lAbstractFloat),

            // Vector4
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lSignedInteger), 'e2': this.types.create(PgslVectorType, 4, lSignedInteger) }, lSignedInteger),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lUnsignedInteger), 'e2': this.types.create(PgslVectorType, 4, lUnsignedInteger) }, lUnsignedInteger),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lFloat16), 'e2': this.types.create(PgslVectorType, 4, lFloat16) }, lFloat16),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lFloat32), 'e2': this.types.create(PgslVectorType, 4, lFloat32) }, lFloat32),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lAbstractInteger), 'e2': this.types.create(PgslVectorType, 4, lAbstractInteger) }, lAbstractInteger),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 4, lAbstractFloat) }, lAbstractFloat),
        ]));

        // dot4U8Packed
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.dot4U8Packed, { constant: true }, [
            this.createOverload({}, { 'e1': lUnsignedInteger, 'e2': lUnsignedInteger }, lUnsignedInteger)
        ]));

        // dot4I8Packed
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.dot4I8Packed, { constant: true }, [
            this.createOverload({}, { 'e1': lUnsignedInteger, 'e2': lUnsignedInteger }, lSignedInteger)
        ]));

        // exp
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.exp, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e1': 'TResult' }, 'TResult')
        ]));

        // exp2
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.exp2, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // extractBits
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.extractBits, { constant: true }, [
            this.createOverload({ 'TResult': [lSignedInteger, ...this.vectorTypes([lSignedInteger])], }, { 'e': 'TResult', 'offset': lUnsignedInteger, 'count': lUnsignedInteger }, 'TResult'),
            this.createOverload({ 'TResult': [lUnsignedInteger, ...this.vectorTypes([lUnsignedInteger])], }, { 'e': 'TResult', 'offset': lUnsignedInteger, 'count': lUnsignedInteger }, 'TResult'),
        ], (pCall: FunctionCallExpressionAst, pPushIncident) => {
            // Constant offset plus count must stay within the 32 bits of an int or uint.
            const lOffset: number | string | null = pCall.getParameter('offset')?.data.constantValue ?? null;
            const lCount: number | string | null = pCall.getParameter('count')?.data.constantValue ?? null;
            if (typeof lOffset === 'number' && typeof lCount === 'number' && lOffset + lCount > 32) {
                pPushIncident(`Offset plus count of extractBits must not exceed 32 bits.`);
            }
        }));

        // faceForward
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.faceForward, { constant: true }, [
            this.createOverload({ 'T': this.vectorTypes(this.floatTypes()) }, { 'e1': 'T', 'e2': 'T', 'e3': 'T' }, 'T'),
        ]));

        // firstLeadingBit
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.firstLeadingBit, { constant: true }, [
            this.createOverload({ 'TResult': [...this.integerTypes(), ...this.vectorTypes(this.integerTypes())], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // firstTrailingBit
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.firstTrailingBit, { constant: true }, [
            this.createOverload({ 'TResult': [...this.integerTypes(), ...this.vectorTypes(this.integerTypes())], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // floor
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.floor, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // fma
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.fma, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e1': 'TResult', 'e2': 'TResult', 'e3': 'TResult' }, 'TResult'),
        ]));

        // fract
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.fract, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // frexp
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.frexp, { constant: true }, [
            // Scalar
            this.createOverload({}, { 'e': lFloat32 }, this.types.create(PgslStructType, this.getStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_f32))),
            this.createOverload({}, { 'e': lFloat16 }, this.types.create(PgslStructType, this.getStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_f16))),
            this.createOverload({}, { 'e': lAbstractFloat }, this.types.create(PgslStructType, this.getStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_abstractFloat))),

            // Vector2
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 2, lFloat32) }, this.types.create(PgslStructType, this.getStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec2_f32))),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 2, lFloat16) }, this.types.create(PgslStructType, this.getStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec2_f16))),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 2, lAbstractFloat) }, this.types.create(PgslStructType, this.getStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec2_abstractFloat))),

            // Vector3
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 3, lFloat32) }, this.types.create(PgslStructType, this.getStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec3_f32))),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 3, lFloat16) }, this.types.create(PgslStructType, this.getStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec3_f16))),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 3, lAbstractFloat) }, this.types.create(PgslStructType, this.getStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec3_abstractFloat))),

            // Vector4
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, lFloat32) }, this.types.create(PgslStructType, this.getStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec4_f32))),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, lFloat16) }, this.types.create(PgslStructType, this.getStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec4_f16))),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, lAbstractFloat) }, this.types.create(PgslStructType, this.getStruct(PgslFrexpStructFeatureSetConstructor.names.__frexp_result_vec4_abstractFloat))),
        ]));

        // insertBits
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.insertBits, { constant: true }, [
            this.createOverload({ 'TResult': [...this.integerTypes(), ...this.vectorTypes(this.integerTypes())], }, { 'e': 'TResult', 'newbits': 'TResult', 'offset': lUnsignedInteger, 'count': lUnsignedInteger }, 'TResult')
        ], (pCall: FunctionCallExpressionAst, pPushIncident) => {
            // Constant offset plus count must stay within the 32 bits of an int or uint.
            const lOffset: number | string | null = pCall.getParameter('offset')?.data.constantValue ?? null;
            const lCount: number | string | null = pCall.getParameter('count')?.data.constantValue ?? null;
            if (typeof lOffset === 'number' && typeof lCount === 'number' && lOffset + lCount > 32) {
                pPushIncident(`Offset plus count of insertBits must not exceed 32 bits.`);
            }
        }));

        // inverseSqrt
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.inverseSqrt, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult'),
        ]));

        // ldexp
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.ldexp, { constant: true }, [
            // Scalar. The exponent is only abstract when the value is abstract.
            this.createOverload({ 'TResult': this.floatTypes(), }, { 'e1': 'TResult', 'e2': lSignedInteger }, 'TResult'),
            this.createOverload({}, { 'e1': lAbstractFloat, 'e2': lAbstractInteger }, lAbstractFloat),

            // Vector2
            this.createOverload({ 'TResult': this.vectorTypes(this.floatTypes(), [2]), }, { 'e1': 'TResult', 'e2': this.types.create(PgslVectorType, 2, lSignedInteger) }, 'TResult'),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 2, lAbstractInteger) }, this.types.create(PgslVectorType, 2, lAbstractFloat)),

            // Vector3
            this.createOverload({ 'TResult': this.vectorTypes(this.floatTypes(), [3]), }, { 'e1': 'TResult', 'e2': this.types.create(PgslVectorType, 3, lSignedInteger) }, 'TResult'),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 3, lAbstractInteger) }, this.types.create(PgslVectorType, 3, lAbstractFloat)),

            // Vector4
            this.createOverload({ 'TResult': this.vectorTypes(this.floatTypes(), [4]), }, { 'e1': 'TResult', 'e2': this.types.create(PgslVectorType, 4, lSignedInteger) }, 'TResult'),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 4, lAbstractInteger) }, this.types.create(PgslVectorType, 4, lAbstractFloat)),
        ], (pCall: FunctionCallExpressionAst, pPushIncident) => {
            // Only a constant exponent is limited.
            const lExponentParameter: IExpressionAst | null = pCall.getParameter('e2');
            const lExponentNumber: number | string | null = lExponentParameter?.data.constantValue ?? null;
            if (!lExponentParameter || typeof lExponentNumber !== 'number') {
                return;
            }

            // The exponent must not be greater than the exponent bias plus one of the float type. A concrete exponent converts an abstract float into a float.
            const lExponentLimit: number = (() => {
                if (pCall.data.resolveType.isKind(BasePgslTypeKind.Float16)) {
                    return 16;
                }
                if (pCall.data.resolveType.isKind(BasePgslTypeKind.Float32) || !lExponentParameter.data.resolveType.isKind(BasePgslTypeKind.Abstract)) {
                    return 128;
                }

                return 1024;
            })();
            
            if (lExponentNumber > lExponentLimit) {
                pPushIncident(`Exponent of ldexp must not be greater than ${lExponentLimit}.`);
            }
        }));

        // length
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.length, { constant: true }, [
            // Scalar
            this.createOverload({ 'TResult': this.floatTypes(), }, { 'e': 'TResult' }, 'TResult'),

            // Vector2
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 2, lFloat32) }, lFloat32),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 2, lFloat16) }, lFloat16),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 2, lAbstractFloat) }, lAbstractFloat),

            // Vector3
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 3, lFloat32) }, lFloat32),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 3, lFloat16) }, lFloat16),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 3, lAbstractFloat) }, lAbstractFloat),

            // Vector4
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, lFloat32) }, lFloat32),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, lFloat16) }, lFloat16),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, lAbstractFloat) }, lAbstractFloat)
        ]));

        // log
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.log, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // log2
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.log2, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // max
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.max, { constant: true }, [
            this.createOverload({ 'TResult': [...this.numericTypes(), ...this.vectorTypes(this.numericTypes())], }, { 'e1': 'TResult', 'e2': 'TResult' }, 'TResult')
        ]));

        // min
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.min, { constant: true }, [
            this.createOverload({ 'TResult': [...this.numericTypes(), ...this.vectorTypes(this.numericTypes())], }, { 'e1': 'TResult', 'e2': 'TResult' }, 'TResult')
        ]));

        // mix
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.mix, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e1': 'TResult', 'e2': 'TResult', 'e3': 'TResult' }, 'TResult'),

            // Vector 2
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lFloat32), 'e2': this.types.create(PgslVectorType, 2, lFloat32), 'e3': lFloat32 }, this.types.create(PgslVectorType, 2, lFloat32)),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lFloat16), 'e2': this.types.create(PgslVectorType, 2, lFloat16), 'e3': lFloat16 }, this.types.create(PgslVectorType, 2, lFloat16)),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 2, lAbstractFloat), 'e3': lAbstractFloat }, this.types.create(PgslVectorType, 2, lAbstractFloat)),

            // Vector 3
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lFloat32), 'e2': this.types.create(PgslVectorType, 3, lFloat32), 'e3': lFloat32 }, this.types.create(PgslVectorType, 3, lFloat32)),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lFloat16), 'e2': this.types.create(PgslVectorType, 3, lFloat16), 'e3': lFloat16 }, this.types.create(PgslVectorType, 3, lFloat16)),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 3, lAbstractFloat), 'e3': lAbstractFloat }, this.types.create(PgslVectorType, 3, lAbstractFloat)),

            // Vector 4
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lFloat32), 'e2': this.types.create(PgslVectorType, 4, lFloat32), 'e3': lFloat32 }, this.types.create(PgslVectorType, 4, lFloat32)),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lFloat16), 'e2': this.types.create(PgslVectorType, 4, lFloat16), 'e3': lFloat16 }, this.types.create(PgslVectorType, 4, lFloat16)),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 4, lAbstractFloat), 'e3': lAbstractFloat }, this.types.create(PgslVectorType, 4, lAbstractFloat))
        ]));

        // modf
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.modf, { constant: true }, [
            // Scalar
            this.createOverload({}, { 'e': lFloat32 }, this.types.create(PgslStructType, this.getStruct(PgslModfStructFeatureSetProcessor.names.__modf_result_f32))),
            this.createOverload({}, { 'e': lFloat16 }, this.types.create(PgslStructType, this.getStruct(PgslModfStructFeatureSetProcessor.names.__modf_result_f16))),
            this.createOverload({}, { 'e': lAbstractFloat }, this.types.create(PgslStructType, this.getStruct(PgslModfStructFeatureSetProcessor.names.__modf_result_abstractFloat))),

            // Vector2
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 2, lFloat32) }, this.types.create(PgslStructType, this.getStruct(PgslModfStructFeatureSetProcessor.names.__modf_result_vec2_f32))),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 2, lFloat16) }, this.types.create(PgslStructType, this.getStruct(PgslModfStructFeatureSetProcessor.names.__modf_result_vec2_f16))),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 2, lAbstractFloat) }, this.types.create(PgslStructType, this.getStruct(PgslModfStructFeatureSetProcessor.names.__modf_result_vec2_abstractFloat))),

            // Vector3
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 3, lFloat32) }, this.types.create(PgslStructType, this.getStruct(PgslModfStructFeatureSetProcessor.names.__modf_result_vec3_f32))),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 3, lFloat16) }, this.types.create(PgslStructType, this.getStruct(PgslModfStructFeatureSetProcessor.names.__modf_result_vec3_f16))),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 3, lAbstractFloat) }, this.types.create(PgslStructType, this.getStruct(PgslModfStructFeatureSetProcessor.names.__modf_result_vec3_abstractFloat))),

            // Vector4
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, lFloat32) }, this.types.create(PgslStructType, this.getStruct(PgslModfStructFeatureSetProcessor.names.__modf_result_vec4_f32))),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, lFloat16) }, this.types.create(PgslStructType, this.getStruct(PgslModfStructFeatureSetProcessor.names.__modf_result_vec4_f16))),
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, lAbstractFloat) }, this.types.create(PgslStructType, this.getStruct(PgslModfStructFeatureSetProcessor.names.__modf_result_vec4_abstractFloat))),
        ]));

        // normalize
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.normalize, { constant: true }, [
            this.createOverload({ 'TVector': this.vectorTypes(this.floatTypes()), }, { 'e': 'TVector' }, 'TVector'),
        ]));

        // pow
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.pow, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e1': 'TResult', 'e2': 'TResult' }, 'TResult')
        ]));

        // quantizeToF16
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.quantizeToF16, { constant: true }, [
            this.createOverload({ 'TResult': [lFloat32, ...this.vectorTypes([lFloat32])], }, { 'e': 'TResult' }, 'TResult'),
        ], (pCall: FunctionCallExpressionAst, pPushIncident) => {
            // Read potential constant float32 value.
            const lValue: number | string | null = pCall.getParameter('e')?.data.constantValue ?? null;
            if (typeof lValue !== 'number') {
                return;
            }

            // Value must be in float16 range.
            if (Math.abs(lValue) > (Math.pow(2, 16) - Math.pow(2, 5))) {
                pPushIncident(`Value ${lValue} of quantizeToF16 does not fit into 'float16'.`);
            }
        }));

        // radians
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.radians, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e1': 'TResult' }, 'TResult')
        ]));

        // reflect
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.reflect, { constant: true }, [
            this.createOverload({ 'TVector': this.vectorTypes(this.floatTypes()), }, { 'e1': 'TVector', 'e2': 'TVector' }, 'TVector'),
        ]));

        // refract
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.refract, { constant: true }, [
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lFloat32), 'e2': this.types.create(PgslVectorType, 2, lFloat32), 'e3': lFloat32 }, this.types.create(PgslVectorType, 2, lFloat32)),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lFloat16), 'e2': this.types.create(PgslVectorType, 2, lFloat16), 'e3': lFloat16 }, this.types.create(PgslVectorType, 2, lFloat16)),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 2, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 2, lAbstractFloat), 'e3': lAbstractFloat }, this.types.create(PgslVectorType, 2, lAbstractFloat)),

            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lFloat32), 'e2': this.types.create(PgslVectorType, 3, lFloat32), 'e3': lFloat32 }, this.types.create(PgslVectorType, 3, lFloat32)),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lFloat16), 'e2': this.types.create(PgslVectorType, 3, lFloat16), 'e3': lFloat16 }, this.types.create(PgslVectorType, 3, lFloat16)),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 3, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 3, lAbstractFloat), 'e3': lAbstractFloat }, this.types.create(PgslVectorType, 3, lAbstractFloat)),

            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lFloat32), 'e2': this.types.create(PgslVectorType, 4, lFloat32), 'e3': lFloat32 }, this.types.create(PgslVectorType, 4, lFloat32)),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lFloat16), 'e2': this.types.create(PgslVectorType, 4, lFloat16), 'e3': lFloat16 }, this.types.create(PgslVectorType, 4, lFloat16)),
            this.createOverload({}, { 'e1': this.types.create(PgslVectorType, 4, lAbstractFloat), 'e2': this.types.create(PgslVectorType, 4, lAbstractFloat), 'e3': lAbstractFloat }, this.types.create(PgslVectorType, 4, lAbstractFloat)),
        ]));

        // reverseBits
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.reverseBits, { constant: true }, [
            this.createOverload({ 'TResult': [...this.integerTypes(), ...this.vectorTypes(this.integerTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // round
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.round, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // saturate
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.saturate, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // sign
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.sign, { constant: true }, [
            this.createOverload({ 'TResult': [...this.numericTypes(), ...this.vectorTypes(this.numericTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // sin
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.sin, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // sinh
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.sinh, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'a': 'TResult' }, 'TResult')
        ]));

        // smoothstep
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.smoothstep, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'edge0': 'TResult', 'edge1': 'TResult', 'x': 'TResult' }, 'TResult')
        ], (pCall: FunctionCallExpressionAst, pPushIncident) => {
            // Constant edges must not be equal, as the interpolation divides by their difference.
            const lEdge0: number | string | null = pCall.getParameter('edge0')?.data.constantValue ?? null;
            const lEdge1: number | string | null = pCall.getParameter('edge1')?.data.constantValue ?? null;
            if (typeof lEdge0 === 'number' && lEdge0 === lEdge1) {
                pPushIncident(`Values of smoothstep must not be equal.`);
            }
        }));

        // sqrt
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.sqrt, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // step
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.step, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'edge': 'TResult', 'x': 'TResult' }, 'TResult')
        ]));

        // tan
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.tan, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));

        // tanh
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.tanh, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'a': 'TResult' }, 'TResult')
        ]));

        // transpose
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.transpose, { constant: true }, [
            // 2x2
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 2, 2, lFloat32) }, this.types.create(PgslMatrixType, 2, 2, lFloat32)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 2, 2, lFloat16) }, this.types.create(PgslMatrixType, 2, 2, lFloat16)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 2, 2, lAbstractFloat) }, this.types.create(PgslMatrixType, 2, 2, lAbstractFloat)),

            // 2x3
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 2, 3, lFloat32) }, this.types.create(PgslMatrixType, 3, 2, lFloat32)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 2, 3, lFloat16) }, this.types.create(PgslMatrixType, 3, 2, lFloat16)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 2, 3, lAbstractFloat) }, this.types.create(PgslMatrixType, 3, 2, lAbstractFloat)),

            // 2x4
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 2, 4, lFloat32) }, this.types.create(PgslMatrixType, 4, 2, lFloat32)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 2, 4, lFloat16) }, this.types.create(PgslMatrixType, 4, 2, lFloat16)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 2, 4, lAbstractFloat) }, this.types.create(PgslMatrixType, 4, 2, lAbstractFloat)),

            // 3x2
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 3, 2, lFloat32) }, this.types.create(PgslMatrixType, 2, 3, lFloat32)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 3, 2, lFloat16) }, this.types.create(PgslMatrixType, 2, 3, lFloat16)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 3, 2, lAbstractFloat) }, this.types.create(PgslMatrixType, 2, 3, lAbstractFloat)),

            // 3x3
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 3, 3, lFloat32) }, this.types.create(PgslMatrixType, 3, 3, lFloat32)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 3, 3, lFloat16) }, this.types.create(PgslMatrixType, 3, 3, lFloat16)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 3, 3, lAbstractFloat) }, this.types.create(PgslMatrixType, 3, 3, lAbstractFloat)),

            // 3x4
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 3, 4, lFloat32) }, this.types.create(PgslMatrixType, 4, 3, lFloat32)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 3, 4, lFloat16) }, this.types.create(PgslMatrixType, 4, 3, lFloat16)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 3, 4, lAbstractFloat) }, this.types.create(PgslMatrixType, 4, 3, lAbstractFloat)),

            // 4x2
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 4, 2, lFloat32) }, this.types.create(PgslMatrixType, 2, 4, lFloat32)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 4, 2, lFloat16) }, this.types.create(PgslMatrixType, 2, 4, lFloat16)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 4, 2, lAbstractFloat) }, this.types.create(PgslMatrixType, 2, 4, lAbstractFloat)),

            // 4x3
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 4, 3, lFloat32) }, this.types.create(PgslMatrixType, 3, 4, lFloat32)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 4, 3, lFloat16) }, this.types.create(PgslMatrixType, 3, 4, lFloat16)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 4, 3, lAbstractFloat) }, this.types.create(PgslMatrixType, 3, 4, lAbstractFloat)),

            // 4x4
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 4, 4, lFloat32) }, this.types.create(PgslMatrixType, 4, 4, lFloat32)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 4, 4, lFloat16) }, this.types.create(PgslMatrixType, 4, 4, lFloat16)),
            this.createOverload({}, { 'e': this.types.create(PgslMatrixType, 4, 4, lAbstractFloat) }, this.types.create(PgslMatrixType, 4, 4, lAbstractFloat)),
        ]));

        // trunc
        this.registerDeclaration(this.createFunction(PgslNumericFunctionFeatureSetProcessor.names.trunc, { constant: true }, [
            this.createOverload({ 'TResult': [...this.floatTypes(), ...this.vectorTypes(this.floatTypes())], }, { 'e': 'TResult' }, 'TResult')
        ]));
    }

    /**
     * Get all concrete scalar types.
     *
     * @returns the boolean and all concrete numeric types.
     */
    private scalarTypes(): Array<BasePgslType> {
        return [this.types.create(PgslBooleanType), ...this.numericTypes()];
    }

    /**
     * Get all square matrix types.
     *
     * @param pComponentType - Component type of the matrices.
     *
     * @returns the 2x2, 3x3 and 4x4 matrix types.
     */
    private squareMatrixTypes(pComponentType: BasePgslType): Array<BasePgslType> {
        return [2, 3, 4].map((pDimension: number) => {
            return this.types.create(PgslMatrixType, pDimension, pDimension, pComponentType);
        });
    }

    /**
     * Get vector types for every component type and dimension.
     *
     * @param pComponentTypes - Component types of the vectors.
     * @param pDimensions - Vector dimensions. Defaults to all dimensions.
     *
     * @returns all vector types.
     */
    private vectorTypes(pComponentTypes: Array<BasePgslType>, pDimensions: Array<number> = [2, 3, 4]): Array<BasePgslType> {
        return pDimensions.flatMap((pDimension: number) => {
            return pComponentTypes.map((pComponentType: BasePgslType) => {
                return this.types.create(PgslVectorType, pDimension, pComponentType);
            });
        });
    }
}
