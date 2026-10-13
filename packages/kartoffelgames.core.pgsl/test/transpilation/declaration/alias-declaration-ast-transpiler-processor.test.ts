import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('AliasDeclarationAst - Transpilation', async (pContext) => {
    await pContext.step('Scalar Types', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableValue: string = '5.0';
            const lCodeText: string = `
                alias TestFloatAlias = ${PgslNumericType.typeName.float32};
                const ${lVariableName}: TestFloatAlias = ${lVariableValue};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the aliased type.
            expect(lTranspilationResult.source).toBe(`const ${lVariableName}:f32=${lVariableValue};`);
        });

        await pContext.step('Integer', () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableValue: string = '42';
            const lCodeText: string = `
                alias TestIntegerAlias = ${PgslNumericType.typeName.signedInteger};
                const ${lVariableName}: TestIntegerAlias = ${lVariableValue};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the aliased type.
            expect(lTranspilationResult.source).toBe(`const ${lVariableName}:i32=${lVariableValue};`);
        });

        await pContext.step('Boolean', () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableValue: string = 'true';
            const lCodeText: string = `
                alias TestBooleanAlias = bool;
                const ${lVariableName}: TestBooleanAlias = ${lVariableValue};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the aliased type.
            expect(lTranspilationResult.source).toBe(`const ${lVariableName}:bool=${lVariableValue};`);
        });
    });

    await pContext.step('Templated Types', async (pContext) => {
        await pContext.step('Array', () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                alias TestArrayAlias = Array<${PgslNumericType.typeName.float32}, 10>;
                private ${lVariableName}: TestArrayAlias;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the aliased type.
            expect(lTranspilationResult.source).toBe(`var<private> ${lVariableName}:array<f32,10>;`);
        });

        await pContext.step('Vector', () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                alias TestVectorAlias = Vector3<${PgslNumericType.typeName.float32}>;
                private ${lVariableName}: TestVectorAlias;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the aliased type.
            expect(lTranspilationResult.source).toBe(`var<private> ${lVariableName}:vec3<f32>;`);
        });
    });

    await pContext.step('Complex Types', async (pContext) => {
        await pContext.step('Struct', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                struct ${lStructName} {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
                alias TestStructAlias = ${lStructName};
                private ${lVariableName}: TestStructAlias;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the aliased type.
            expect(lTranspilationResult.source).toBe(
                `struct ${lStructName}{propertyOne:f32}` +
                `var<private> ${lVariableName}:${lStructName};`
            );
        });

        await pContext.step('Alias', () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableValue: string = '5.0';
            const lCodeText: string = `
                alias TestFloatAlias = ${PgslNumericType.typeName.float32};
                alias TestAliasedAlias = TestFloatAlias;
                const ${lVariableName}: TestAliasedAlias = ${lVariableValue};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the final aliased type.
            expect(lTranspilationResult.source).toBe(`const ${lVariableName}:f32=${lVariableValue};`);
        });
    });
});
