import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslArrayType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('AddressOfExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Variable Address', async (pContext) => {
        await pContext.step('Simple variable address', () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var ${lVariableName}:f32=5.0;` +
                `var pointerVariable:ptr<function,f32>=&${lVariableName};` +
                `}`
            );
        });

        await pContext.step('Struct property address', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lPropertyName: string = 'propertyOne';
            const lVariableName: string = 'structVariable';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lPropertyName}: ${PgslNumericType.typeName.float32}
                }
                function testFunction(): void {
                    let ${lVariableName}: ${lStructName};
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName}.${lPropertyName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lStructName}{` +
                `${lPropertyName}:f32` +
                `}` +
                `fn testFunction(){` +
                `var ${lVariableName}:${lStructName};` +
                `var pointerVariable:ptr<function,f32>=&${lVariableName}.${lPropertyName};` +
                `}`
            );
        });

        await pContext.step('Array element address', () => {
            // Setup.
            const lArrayName: string = 'arrayVariable';
            const lArrayIndex: number = 2;
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lArrayName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 5> = new ${PgslArrayType.typeName.array}(1.0, 2.0, 3.0, 4.0, 5.0);
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lArrayName}[${lArrayIndex}];
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var ${lArrayName}:array<f32,5>=array(1.0,2.0,3.0,4.0,5.0);` +
                `var pointerVariable:ptr<function,f32>=&${lArrayName}[${lArrayIndex}];` +
                `}`
            );
        });
    });

    await pContext.step('Address Space Variations', async (pContext) => {
        await pContext.step('Function address space', () => {
            // Setup.
            const lVariableName: string = 'functionVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var ${lVariableName}:f32=5.0;` +
                `var pointerVariable:ptr<function,f32>=&${lVariableName};` +
                `}`
            );
        });

        await pContext.step('Private address space', () => {
            // Setup.
            const lVariableName: string = 'privateVariable';
            const lCodeText: string = `
                private ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `var<private> ${lVariableName}:f32;` +
                `fn testFunction(){` +
                `var pointerVariable:ptr<private,f32>=&${lVariableName};` +
                `}`
            );
        });

        await pContext.step('Storage address space', () => {
            // Setup.
            const lVariableName: string = 'storageVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)` +
                `var<storage,read> ${lVariableName}:f32;` +
                `fn testFunction(){` +
                `var pointerVariable:ptr<storage,f32>=&${lVariableName};` +
                `}`
            );
        });
    });
});
