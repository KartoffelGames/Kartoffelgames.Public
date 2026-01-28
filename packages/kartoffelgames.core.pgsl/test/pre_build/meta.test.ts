import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslParser } from '../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../source/transpilation/wgsl/wgsl-transpiler.ts';

Deno.test('Meta', async (pContext) => {
    await pContext.step('Remove Metavalues from output', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Setup. Create code text with only meta values.
        const lCodeText: string = `
            #META "AppName" "MyApp";
            #META "Version" "1.0.0";

            function testFunction(): void {
                const value: ${PgslNumericType.typeName.float32} = 1.0;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Output is blank.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `const value:f32=1.0;` +
            `}`
        );
    });

    await pContext.step('Key-Value Metavalue', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Setup. Create code text with key-value meta.
        const lCodeText: string = `
            #META "AppName" "MyApplication";
            #META "Version" "2.5.1";

            function testFunction(): void {
                const value: ${PgslNumericType.typeName.float32} = 1.0;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Meta values are in the map.
        expect(lTranspilationResult.metaValues.get('AppName')).toBe('MyApplication');
        expect(lTranspilationResult.metaValues.get('Version')).toBe('2.5.1');
    });

    await pContext.step('Key Metavalue', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Setup. Create code text with key-only meta.
        const lCodeText: string = `
            #META "Debug";
            #META "OptimizeShaders";

            function testFunction(): void {
                const value: ${PgslNumericType.typeName.float32} = 1.0;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Meta keys exist with empty string values.
        expect(lTranspilationResult.metaValues.get('Debug')).toBe('');
        expect(lTranspilationResult.metaValues.get('OptimizeShaders')).toBe('');
    });

    await pContext.step('Imported Key-Value Metavalue', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Setup. Add import with key-value meta.
        lPgslParser.addImport('MetaImport', `
            #META "LibraryName" "CoreLibrary";
            #META "LibraryVersion" "3.0.0";
            const CONSTANT: ${PgslNumericType.typeName.float32} = 42.0;
        `);

        // Setup. Create code text that uses the import.
        const lCodeText: string = `
            #IMPORT "MetaImport";

            function testFunction(): void {
                const value: ${PgslNumericType.typeName.float32} = CONSTANT;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Imported meta values are in the map.
        expect(lTranspilationResult.metaValues.get('LibraryName')).toBe('CoreLibrary');
        expect(lTranspilationResult.metaValues.get('LibraryVersion')).toBe('3.0.0');
    });

    await pContext.step('Imported Key Metavalue', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Setup. Add import with key-only meta.
        lPgslParser.addImport('MetaImport', `
            #META "IsLibrary";
            #META "Experimental";
            const CONSTANT: ${PgslNumericType.typeName.float32} = 42.0;
        `);

        // Setup. Create code text that uses the import.
        const lCodeText: string = `
            #IMPORT "MetaImport";

            function testFunction(): void {
                const value: ${PgslNumericType.typeName.float32} = CONSTANT;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Imported meta keys exist with empty string values.
        expect(lTranspilationResult.metaValues.get('IsLibrary')).toBe('');
        expect(lTranspilationResult.metaValues.get('Experimental')).toBe('');
    });

    await pContext.step('Overriden Imported Key-Value Metavalue', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Setup. Add import with key-value meta.
        lPgslParser.addImport('MetaImport', `
            #META "AppName" "DefaultApp";
            #META "Version" "1.0.0";
            const CONSTANT: ${PgslNumericType.typeName.float32} = 42.0;
        `);

        // Setup. Create code text that overrides imported meta values.
        const lCodeText: string = `
            #IMPORT "MetaImport";
            #META "AppName" "OverriddenApp";

            function testFunction(): void {
                const value: ${PgslNumericType.typeName.float32} = CONSTANT;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Main code meta value overrides imported value.
        expect(lTranspilationResult.metaValues.get('AppName')).toBe('OverriddenApp');
        // Imported value that is not overridden still exists.
        expect(lTranspilationResult.metaValues.get('Version')).toBe('1.0.0');
    });

    await pContext.step('Overriden Imported Key Metavalue', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Setup. Add import with key-only meta.
        lPgslParser.addImport('MetaImport', `
            #META "Debug";
            #META "Verbose";
            const CONSTANT: ${PgslNumericType.typeName.float32} = 42.0;
        `);

        // Setup. Create code text that overrides imported meta keys.
        const lCodeText: string = `
            #IMPORT "MetaImport";
            #META "Debug" "false";

            function testFunction(): void {
                const value: ${PgslNumericType.typeName.float32} = CONSTANT;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Main code meta value overrides imported key-only meta.
        expect(lTranspilationResult.metaValues.get('Debug')).toBe('false');
        // Imported key that is not overridden still exists with empty string.
        expect(lTranspilationResult.metaValues.get('Verbose')).toBe('');
    });
});
