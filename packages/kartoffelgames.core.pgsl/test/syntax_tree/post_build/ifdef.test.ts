import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';


Deno.test('Ifdef', async (pContext) => {
    await pContext.step('Basic', () => {
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

    await pContext.step('Imported', () => {
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

    await pContext.step('Nested', () => {
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

Deno.test('IfNotdef', async (pContext) => {
    await pContext.step('Basic', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Define environment value (not using UNDEFINED_KEY).
        const lDefinedKey: string = 'USE_PI_LONG';
        const lUndefinedKey: string = 'USE_PI_SHORT';
        lPgslParser.addEnvironmentValue(lDefinedKey, 'true');

        // Setup. Create code text that uses IFNOTDEF.
        const lCodeText: string = `
            #IFNOTDEF ${lDefinedKey}
            const PI: ${PgslNumericType.typeName.float32} = 3.14;
            #ENDIF

            #IFNOTDEF ${lUndefinedKey}
            const ALTERNATIVE: ${PgslNumericType.typeName.float32} = 2.71828;
            #ENDIF

            function testFunction(): void {
                const result: ${PgslNumericType.typeName.float32} = ALTERNATIVE;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `const ALTERNATIVE:f32=2.71828;` +
            `fn testFunction(){` +
            `const result:f32=ALTERNATIVE;` +
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
            #IFNOTDEF ${lEnvironmentKeyLower.toUpperCase()}
            const VALUE: ${PgslNumericType.typeName.float32} = 42.0;
            #ENDIF

            #IFNOTDEF UNDEFINED_FEATURE
            const FALLBACK: ${PgslNumericType.typeName.float32} = 10.0;
            #ENDIF

            function testFunction(): void {
                const result: ${PgslNumericType.typeName.float32} = FALLBACK;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `const FALLBACK:f32=10.0;` +
            `fn testFunction(){` +
            `const result:f32=FALLBACK;` +
            `}`
        );
    });

    await pContext.step('Nested', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Define environment values.
        const lEnvironmentKeyOuter: string = 'ENABLE_OUTER';
        const lEnvironmentKeyInner: string = 'ENABLE_INNER';
        lPgslParser.addEnvironmentValue(lEnvironmentKeyOuter, 'true');

        // Setup. Create code text with nested ifnotdef blocks.
        const lCodeText: string = `
            #IFNOTDEF ${lEnvironmentKeyOuter}
                const OUTER_VALUE: ${PgslNumericType.typeName.float32} = 1.0;

                #IFNOTDEF ${lEnvironmentKeyInner}
                    const INNER_VALUE: ${PgslNumericType.typeName.float32} = 2.0;
                #ENDIF
            #ENDIF

            #IFNOTDEF ${lEnvironmentKeyInner}
            const FALLBACK_VALUE: ${PgslNumericType.typeName.float32} = 3.0;
            #ENDIF

            function testFunction(): void {
                const result: ${PgslNumericType.typeName.float32} = FALLBACK_VALUE;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `const FALLBACK_VALUE:f32=3.0;` +
            `fn testFunction(){` +
            `const result:f32=FALLBACK_VALUE;` +
            `}`
        );
    });
});

Deno.test('Ifdef - Mixed', async (pContext) => {
    await pContext.step('Basic', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Define environment values.
        const lEnabledKey: string = 'USE_FEATURE_A';
        const lDisabledKey: string = 'USE_FEATURE_B';
        lPgslParser.addEnvironmentValue(lEnabledKey, 'true');

        // Setup. Create code text that mixes IFDEF and IFNOTDEF.
        const lCodeText: string = `
            #IFDEF ${lEnabledKey}
            const FEATURE_A: ${PgslNumericType.typeName.float32} = 100.0;
            #ENDIF

            #IFNOTDEF ${lDisabledKey}
            const FALLBACK_B: ${PgslNumericType.typeName.float32} = 50.0;
            #ENDIF

            function testFunction(): void {
                const result: ${PgslNumericType.typeName.float32} = FEATURE_A + FALLBACK_B;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `const FEATURE_A:f32=100.0;` +
            `const FALLBACK_B:f32=50.0;` +
            `fn testFunction(){` +
            `const result:f32=FEATURE_A+FALLBACK_B;` +
            `}`
        );
    });

    await pContext.step('Alternating conditions', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Define environment values.
        const lKeyOne: string = 'CONFIG_ONE';
        const lKeyTwo: string = 'CONFIG_TWO';
        const lKeyThree: string = 'CONFIG_THREE';
        lPgslParser.addEnvironmentValue(lKeyOne, 'true');
        lPgslParser.addEnvironmentValue(lKeyThree, 'true');

        // Setup. Create code text with alternating ifdef/ifnotdef.
        const lCodeText: string = `
            #IFDEF ${lKeyOne}
            const VALUE_ONE: ${PgslNumericType.typeName.float32} = 1.0;
            #ENDIF

            #IFNOTDEF ${lKeyTwo}
            const VALUE_TWO: ${PgslNumericType.typeName.float32} = 2.0;
            #ENDIF

            #IFDEF ${lKeyThree}
            const VALUE_THREE: ${PgslNumericType.typeName.float32} = 3.0;
            #ENDIF

            #IFNOTDEF ${lKeyOne}
            const VALUE_FALLBACK: ${PgslNumericType.typeName.float32} = 0.0;
            #ENDIF

            function testFunction(): void {
                const result: ${PgslNumericType.typeName.float32} = VALUE_ONE + VALUE_TWO + VALUE_THREE;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `const VALUE_ONE:f32=1.0;` +
            `const VALUE_TWO:f32=2.0;` +
            `const VALUE_THREE:f32=3.0;` +
            `fn testFunction(){` +
            `const result:f32=VALUE_ONE+VALUE_TWO+VALUE_THREE;` +
            `}`
        );
    });

    await pContext.step('Nested mixed', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Define environment values.
        const lOuterEnabled: string = 'OUTER_ENABLED';
        const lInnerEnabled: string = 'INNER_ENABLED';
        const lInnerDisabled: string = 'INNER_DISABLED';
        lPgslParser.addEnvironmentValue(lOuterEnabled, 'true');
        lPgslParser.addEnvironmentValue(lInnerEnabled, 'true');

        // Setup. Create code text with nested mixed ifdef/ifnotdef.
        const lCodeText: string = `
            #IFDEF ${lOuterEnabled}
                const OUTER: ${PgslNumericType.typeName.float32} = 1.0;

                #IFDEF ${lInnerEnabled}
                    const INNER_ENABLED_VAL: ${PgslNumericType.typeName.float32} = 2.0;
                #ENDIF

                #IFNOTDEF ${lInnerDisabled}
                    const INNER_DISABLED_VAL: ${PgslNumericType.typeName.float32} = 3.0;
                #ENDIF
            #ENDIF

            function testFunction(): void {
                const result: ${PgslNumericType.typeName.float32} = OUTER + INNER_ENABLED_VAL + INNER_DISABLED_VAL;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `const OUTER:f32=1.0;` +
            `const INNER_ENABLED_VAL:f32=2.0;` +
            `const INNER_DISABLED_VAL:f32=3.0;` +
            `fn testFunction(){` +
            `const result:f32=OUTER+INNER_ENABLED_VAL+INNER_DISABLED_VAL;` +
            `}`
        );
    });
});