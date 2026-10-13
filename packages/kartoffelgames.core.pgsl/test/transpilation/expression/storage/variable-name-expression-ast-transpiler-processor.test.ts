import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('VariableNameExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Variable References', async (pContext) => {
        await pContext.step('Let variable', () => {
            // Setup.
            const lVariableName: string = 'testLetVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
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
                `var testResult:f32=${lVariableName};` +
                `}`
            );
        });

        await pContext.step('Function const variable', () => {
            // Setup.
            const lVariableName: string = 'testConstVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    const ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `const ${lVariableName}:f32=5.0;` +
                `var testResult:f32=${lVariableName};` +
                `}`
            );
        });

        await pContext.step('Module const variable', () => {
            // Setup.
            const lVariableName: string = 'moduleVariable';
            const lCodeText: string = `
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                function testFunction(): void {
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `const ${lVariableName}:f32=5.0;` +
                `fn testFunction(){` +
                `var testResult:f32=${lVariableName};` +
                `}`
            );
        });

        await pContext.step('Parameter variable', () => {
            // Setup.
            const lParameterName: string = 'testParameter';
            const lCodeText: string = `
                function testFunction(${lParameterName}: ${PgslNumericType.typeName.float32}): void {
                    let testResult: ${PgslNumericType.typeName.float32} = ${lParameterName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(${lParameterName}:f32){` +
                `var testResult:f32=${lParameterName};` +
                `}`
            );
        });

        await pContext.step('Uniform variable', () => {
            // Setup.
            const lVariableName: string = 'uniformVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};

                function testFunction(): void {
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:f32;` +
                `fn testFunction(){` +
                `var testResult:f32=${lVariableName};` +
                `}`
            );
        });
    });
});
