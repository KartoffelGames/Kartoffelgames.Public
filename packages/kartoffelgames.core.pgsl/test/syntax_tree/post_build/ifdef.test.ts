import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from "../../../source/abstract_syntax_tree/general/attribute-list-ast.ts";
import { PgslNumericType } from "../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';


Deno.test('Ifdef', async (pContext) => {
    await pContext.step('Basic IFDEF', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Define environment value.
        const lEnvironmentKeyOne: string = 'USE_PI_LONG';
        const lEnvironmentKeyTwo: string = 'USE_PI_SHORT';
        lPgslParser.addEnvironmentValue(lEnvironmentKeyOne, 'true');

        // Setup. Assign a import.

        // Setup. Create code text that uses the import.
        const lCodeText: string = `
            #IFDEF ${lEnvironmentKeyOne}
            const PI: ${PgslNumericType.typeName.float32} = 3.14159265;
            #ENDIF

            #IFDEF ${lEnvironmentKeyTwo}
            const PI: ${PgslNumericType.typeName.float32} = 3.14;
            #ENDIF

            function testFunction(): void {
                const innerValue: ${PgslNumericType.typeName.float32} = PI;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `const PI:f32=3.14159265;` +
            `fn testFunction(){` +
            `const innerValue:f32=PI;` +
            `}`
        );
    });

    await pContext.step('Imported IFDEF', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Define environment value.
        const lEnvironmentKeyOne: string = 'USE_PI_LONG';
        const lEnvironmentKeyTwo: string = 'USE_PI_SHORT';
        lPgslParser.addEnvironmentValue(lEnvironmentKeyOne, 'true');

        // Setup. Assign a import.
        const lImportCode: string = `
            #IFDEF ${lEnvironmentKeyOne}
            const PI: ${PgslNumericType.typeName.float32} = 3.14159265;
            #ENDIF

            #IFDEF ${lEnvironmentKeyTwo}
            const PI: ${PgslNumericType.typeName.float32} = 3.14;
            #ENDIF
        `;
        const lImportName: string = 'imported_document.pgsl';
        lPgslParser.addImport(lImportName, lImportCode);

        // Setup. Create code text that uses the import.
        const lCodeText: string = `
            #IMPORT "${lImportName}";
            function testFunction(): void {
                const innerValue: ${PgslNumericType.typeName.float32} = PI;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `const PI:f32=3.14159265;` +
            `fn testFunction(){` +
            `const innerValue:f32=PI;` +
            `}`
        );
    });

    await pContext.step('Case insensitive environment keys', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Define environment value with lowercase.
        const lEnvironmentKeyLower: string = 'use_feature_enabled';
        lPgslParser.addEnvironmentValue(lEnvironmentKeyLower, 'true');

        // Setup. Create code text that uses uppercase key.
        const lCodeText: string = `
            #IFDEF ${lEnvironmentKeyLower.toUpperCase()}
            const VALUE: ${PgslNumericType.typeName.float32} = 42.0;
            #ENDIF

            function testFunction(): void {
                const result: ${PgslNumericType.typeName.float32} = VALUE;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `const VALUE:f32=42.0;` +
            `fn testFunction(){` +
            `const result:f32=VALUE;` +
            `}`
        );
    });

    await pContext.step('Nested IFDEF', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Define environment values.
        const lEnvironmentKeyOuter: string = 'ENABLE_OUTER';
        const lEnvironmentKeyInner: string = 'ENABLE_INNER';
        lPgslParser.addEnvironmentValue(lEnvironmentKeyOuter, 'true');
        lPgslParser.addEnvironmentValue(lEnvironmentKeyInner, 'true');

        // Setup. Create code text with nested ifdef blocks.
        const lCodeText: string = `
            #IFDEF ${lEnvironmentKeyOuter}
                const OUTER_VALUE: ${PgslNumericType.typeName.float32} = 1.0;

                #IFDEF ${lEnvironmentKeyInner}
                    const INNER_VALUE: ${PgslNumericType.typeName.float32} = 2.0;
                #ENDIF
            #ENDIF

            function testFunction(): void {
                const result: ${PgslNumericType.typeName.float32} = OUTER_VALUE + INNER_VALUE;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `const OUTER_VALUE:f32=1.0;` +
            `const INNER_VALUE:f32=2.0;` +
            `fn testFunction(){` +
            `const result:f32=OUTER_VALUE+INNER_VALUE;` +
            `}`
        );
    });
});