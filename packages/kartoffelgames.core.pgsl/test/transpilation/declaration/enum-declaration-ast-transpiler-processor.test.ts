import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('EnumDeclarationAst - Transpilation', async (pContext) => {
    await pContext.step('Numeric enum', async (pContext) => {
        await pContext.step('Enum value usage in variable', () => {
            // Setup.
            const lValueData: string = '42';
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = ${lValueData}
                }
                const ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = TestEnum.ValueOne;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Enum reference replaced with value.
            expect(lTranspilationResult.source).toBe(`const ${lVariableName}:u32=${lValueData};`);
        });

        await pContext.step('Multiple enum values', () => {
            // Setup.
            const lFirstValueData: string = '1';
            const lSecondValueData: string = '2';
            const lFirstVariableName: string = 'testVariableOne';
            const lSecondVariableName: string = 'testVariableTwo';
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = ${lFirstValueData},
                    ValueTwo = ${lSecondValueData}
                }
                const ${lFirstVariableName}: ${PgslNumericType.typeName.unsignedInteger} = TestEnum.ValueOne;
                const ${lSecondVariableName}: ${PgslNumericType.typeName.unsignedInteger} = TestEnum.ValueTwo;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Both enum references replaced with values.
            expect(lTranspilationResult.source).toBe(
                `const ${lFirstVariableName}:u32=${lFirstValueData};` +
                `const ${lSecondVariableName}:u32=${lSecondValueData};`
            );
        });
    });

    await pContext.step('String Enums', async (pContext) => {
        await pContext.step('String enum value usage', () => {
            // Setup. Code blocks.
            const lVariableName: string = 'testVariable';

            // Setup. Code text.
            const lCodeText: string = `
                enum TestStringEnum {
                    ValueOne = "TestString",
                    ValueTwo = "TestString2"
                }
                [${AttributeListAst.attributeNames.groupBinding}(TestStringEnum.ValueOne, TestStringEnum.ValueTwo)]
                uniform ${lVariableName}: float;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the enum value.
            expect(lTranspilationResult.source).toBe(`@group(0)@binding(0)var<uniform> ${lVariableName}:f32;`);
        });
    });
});
