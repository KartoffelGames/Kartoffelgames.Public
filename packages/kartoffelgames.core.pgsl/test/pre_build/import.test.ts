import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from "../../source/abstract_syntax_tree/general/attribute-list-ast.ts";
import { PgslNumericType } from "../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { PgslParser } from "../../source/parser/pgsl-parser.ts";
import { PgslParserResult } from "../../source/parser_result/pgsl-parser-result.ts";
import { WgslTranspiler } from "../../source/transpilation/wgsl/wgsl-transpiler.ts";

Deno.test('Import', async (pContext) => {
    await pContext.step('Basic import', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Setup. Assign a import.
        lPgslParser.addImport('FirstImport', `
            const PI: ${PgslNumericType.typeName.float32} = 3.14;    
        `);

        // Setup. Create code text that uses the import.
        const lCodeText: string = `
            #IMPORT "FirstImport";

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
            `const PI:f32=3.14;` +
            `fn testFunction(){` +
            `const innerValue:f32=PI;` +
            `}`
        );
    });

    await pContext.step('Nested import', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Setup. Assign nested imports.
        lPgslParser.addImport('SecondImport', `
            const EPSILON: ${PgslNumericType.typeName.float32} = 0.001;
        `);

        lPgslParser.addImport('FirstImport', `
            #IMPORT "SecondImport";
            const PI: ${PgslNumericType.typeName.float32} = 3.14;
        `);

        // Setup. Create code text that uses the first import.
        const lCodeText: string = `
            #IMPORT "FirstImport";

            function testFunction(): void {
                const result: ${PgslNumericType.typeName.float32} = PI + EPSILON;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output with nested imports.
        expect(lTranspilationResult.source).toBe(
            `const EPSILON:f32=0.001;` +
            `const PI:f32=3.14;` +
            `fn testFunction(){` +
            `const result:f32=PI+EPSILON;` +
            `}`
        );
    });

    await pContext.step('Nested import - Omit second import when main imports it again', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Setup. Assign nested imports.
        lPgslParser.addImport('SecondImport', `
            const EPSILON: ${PgslNumericType.typeName.float32} = 0.001;
        `);

        lPgslParser.addImport('FirstImport', `
            #IMPORT "SecondImport";
            const PI: ${PgslNumericType.typeName.float32} = 3.14;
        `);

        // Setup. Create code text that imports both first and second import.
        const lCodeText: string = `
            #IMPORT "FirstImport";
            #IMPORT "SecondImport";

            function testFunction(): void {
                const result: ${PgslNumericType.typeName.float32} = PI + EPSILON;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Second import is only included once (duplicate removed).
        expect(lTranspilationResult.source).toBe(
            `const EPSILON:f32=0.001;` +
            `const PI:f32=3.14;` +
            `fn testFunction(){` +
            `const result:f32=PI+EPSILON;` +
            `}`
        );
    });

    await pContext.step('Error: Non-existent import', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();
        const lImportName: string = 'NonExistentImport';

        // Setup. Create code text with non-existent import.
        const lCodeText: string = `
            #IMPORT "${lImportName}";

            function testFunction(): void {
                const value: ${PgslNumericType.typeName.float32} = 0.0;
            }
        `;

        // Process.
        const lErrorFunction = () => {
            lPgslParser.transpile(lCodeText, new WgslTranspiler());
        };

        // Evaluation. Contains error incident.
        expect(lErrorFunction).toThrow(`Import "${lImportName.toLowerCase()}" not found.`);
    });

    await pContext.step('Struct import used in array', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();

        // Setup. Assign struct import.
        lPgslParser.addImport('StructImport', `
            struct TestStruct {
                value: ${PgslNumericType.typeName.float32},
                id: ${PgslNumericType.typeName.signedInteger}
            }
        `);

        // Setup. Create code text that uses struct in array.
        const lCodeText: string = `
            #IMPORT "StructImport";

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            storage testArray: Array<TestStruct>;

            function processArray(): void {
                const firstElement: TestStruct = testArray[0];
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = lPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output with struct in array.
        expect(lTranspilationResult.source).toBe(
            `struct TestStruct{` +
            `value:f32,` +
            `id:i32` +
            `}` +
            `@group(0)@binding(0)var<storage,read> testArray:array<TestStruct>;` +
            `fn processArray(){` +
            `let firstElement:TestStruct=testArray[0];` +
            `}`
        );
    });

    await pContext.step('Case insensitive import', () => {
        // Setup. Create parser.
        const lPgslParser: PgslParser = new PgslParser();
        const lImportName: string = 'FirstImport';


        // Setup. Assign a import.
        lPgslParser.addImport(lImportName.toUpperCase(), `
            const PI: ${PgslNumericType.typeName.float32} = 3.14;    
        `);

        // Setup. Create code text that uses the import.
        const lCodeText: string = `
            #IMPORT "${lImportName.toLowerCase()}";

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
            `const PI:f32=3.14;` +
            `fn testFunction(){` +
            `const innerValue:f32=PI;` +
            `}`
        );
    });
});
