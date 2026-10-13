import { expect } from '@kartoffelgames/core-test';
import { PgslArrayType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslMatrixType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('IndexedValueExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Array Indexing', async () => {
        // Setup.
        const lArrayIndex: number = 2;
        const lVariableName: string = 'numericArray';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 5> = new ${PgslArrayType.typeName.array}(1, 2, 3, 4, 5);
                let arrayItem: ${PgslNumericType.typeName.float32} = ${lVariableName}[${lArrayIndex}];
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses the aliased type.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var ${lVariableName}:array<f32,5>=array(1,2,3,4,5);` +
            `var arrayItem:f32=${lVariableName}[${lArrayIndex}];` +
            `}`
        );
    });

    await pContext.step('Vector Indexing', async () => {
        // Setup.
        const lVectorItemIndex: number = 2;
        const lVariableName: string = 'numericVector';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1, 2, 3);
                let vectorItem: ${PgslNumericType.typeName.float32} = ${lVariableName}[${lVectorItemIndex}];
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses the aliased type.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var ${lVariableName}:vec3<f32>=vec3(1,2,3);` +
            `var vectorItem:f32=${lVariableName}[${lVectorItemIndex}];` +
            `}`
        );
    });

    await pContext.step('Matrix Indexing', async () => {
        // Setup.
        const lMatrixItemIndex: number = 2;
        const lVariableName: string = 'numericMatrix';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}(1, 2, 3, 4);
                let numericVector: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = ${lVariableName}[${lMatrixItemIndex}];
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses the aliased type.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var ${lVariableName}:mat2x2<f32>=mat2x2(1,2,3,4);` +
            `var numericVector:vec2<f32>=${lVariableName}[${lMatrixItemIndex}];` +
            `}`
        );
    });

    await pContext.step('Indexing a chained value', async () => {
        // Setup.
        const lStructName: string = 'TestStruct';
        const lPropertyName: string = 'propertyOne';
        const lFunctionName: string = 'createVector';
        const lCodeText: string = `
            struct ${lStructName} {
                ${lPropertyName}: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
            }
            function ${lFunctionName}(): ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> {
                return new ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>(1, 2, 3, 4);
            }
            function testFunction(): void {
                let testStruct: ${lStructName};
                let afterProperty: ${PgslNumericType.typeName.float32} = testStruct.${lPropertyName}[0];
                let afterCall: ${PgslNumericType.typeName.float32} = ${lFunctionName}()[0];
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Chains are emitted in source order.
        expect(lTranspilationResult.source).toBe(
            `struct ${lStructName}{${lPropertyName}:vec4<f32>}` +
            `fn ${lFunctionName}()->vec4<f32>{return vec4<f32>(1,2,3,4);}` +
            `fn testFunction(){` +
            `var testStruct:${lStructName};` +
            `var afterProperty:f32=testStruct.${lPropertyName}[0];` +
            `var afterCall:f32=${lFunctionName}()[0];` +
            `}`
        );
    });
});
