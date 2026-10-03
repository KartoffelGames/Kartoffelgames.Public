import type { FunctionDeclarationAst } from '../../../abstract_syntax_tree/declaration/function-declaration-ast.ts';
import { PgslNumericType } from '../../../abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from "../../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts";
import { PgslFeatureSetProcessor } from "../../pgsl-feature-set-processor.ts";

export class PgslPackingFunctionFeatureSetProcessor extends PgslFeatureSetProcessor {
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
     * Process declaration creations.
     */
    protected override onProcess(): void {
        this.registerpackFunctions();
        this.registerUnpackFunctions();
    }

    /**
     * Create pack functions.
     * 
     * @returns list of function declarations for pack functions. 
     */
    public registerpackFunctions(): void {
        // pack4x8snorm
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.pack4x8snorm, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)) }, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack4x8unorm
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.pack4x8unorm, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)) }, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack4xI8
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.pack4xI8, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.signedInteger)) }, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack4xU8
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.pack4xU8, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger)) }, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack4xI8Clamp
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.pack4xI8Clamp, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.signedInteger)) }, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack4xU8Clamp
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.pack4xU8Clamp, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger)) }, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack2x16snorm
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.pack2x16snorm, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)) }, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack2x16unorm
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.pack2x16unorm, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)) }, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger))
        ]));

        // pack2x16float
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.pack2x16float, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslVectorType, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)) }, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger))
        ]));
    }

    /**
     * Create unpack functions.
     * 
     * @returns list of function declarations for unpack functions. 
     */
    public registerUnpackFunctions(): void {
        // unpack4x8snorm
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.unpack4x8snorm, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger) }, this.types.create(PgslVectorType, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)))
        ]));

        // unpack4x8unorm
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.unpack4x8unorm, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger) }, this.types.create(PgslVectorType, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)))
        ]));

        // unpack4xI8
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.unpack4xI8, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger) }, this.types.create(PgslVectorType, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.signedInteger)))
        ]));

        // unpack4xU8
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.unpack4xU8, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger) }, this.types.create(PgslVectorType, 4, this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger)))
        ]));

        // unpack2x16snorm
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.unpack2x16snorm, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger) }, this.types.create(PgslVectorType, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)))
        ]));

        // unpack2x16unorm
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.unpack2x16unorm, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger) }, this.types.create(PgslVectorType, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)))
        ]));

        // unpack2x16float
        this.registerDeclaration(this.createFunction(PgslPackingFunctionFeatureSetProcessor.names.unpack2x16float, { constant: true }, [
            this.createOverload({}, { 'e': this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger) }, this.types.create(PgslVectorType, 2, this.types.create(PgslNumericType, PgslNumericType.typeName.float32)))
        ]));
    }
}
