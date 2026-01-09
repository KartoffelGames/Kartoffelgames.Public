import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/pgsl-vector-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslSynchronisationBuildInFunction-storageBarrier', async (pContext) => {
    await pContext.step('storageBarrier()', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                storageBarrier();
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `storageBarrier();` +
            `}`
        );
    });
});

Deno.test('PgslSynchronisationBuildInFunction-textureBarrier', async (pContext) => {
    await pContext.step('textureBarrier()', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                textureBarrier();
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `textureBarrier();` +
            `}`
        );
    });
});

Deno.test('PgslSynchronisationBuildInFunction-workgroupBarrier', async (pContext) => {
    await pContext.step('workgroupBarrier()', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                workgroupBarrier();
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `workgroupBarrier();` +
            `}`
        );
    });
});

Deno.test('PgslSynchronisationBuildInFunction-workgroupUniformLoad', async (pContext) => {
    await pContext.step('workgroupUniformLoad<ptr<workgroup, i32>, i32>(ptr)', () => {
        // Setup.
        const lCodeText: string = `
            workgroup sharedValue: ${PgslNumericType.typeName.signedInteger} = 42i;
            function testFunction(): void {
                let loadedValue: ${PgslNumericType.typeName.signedInteger} = workgroupUniformLoad(&sharedValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `var<workgroup> sharedValue:i32=42i;` +
            `fn testFunction(){` +
            `let loadedValue:i32=workgroupUniformLoad(&sharedValue);` +
            `}`
        );
    });

    await pContext.step('workgroupUniformLoad<ptr<workgroup, f32>, f32>(ptr)', () => {
        // Setup.
        const lCodeText: string = `
            workgroup sharedValue: ${PgslNumericType.typeName.float32} = 3.14f;
            function testFunction(): void {
                let loadedValue: ${PgslNumericType.typeName.float32} = workgroupUniformLoad(&sharedValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `var<workgroup> sharedValue:f32=3.14f;` +
            `fn testFunction(){` +
            `let loadedValue:f32=workgroupUniformLoad(&sharedValue);` +
            `}`
        );
    });

    await pContext.step('workgroupUniformLoad<ptr<workgroup, vec4<f32>>, vec4<f32>>(ptr)', () => {
        // Setup.
        const lCodeText: string = `
            workgroup sharedValue: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0);
            function testFunction(): void {
                let loadedValue: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = workgroupUniformLoad(&sharedValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `var<workgroup> sharedValue:vec4<f32>=vec4(1.0,2.0,3.0,4.0);` +
            `fn testFunction(){` +
            `let loadedValue:vec4<f32>=workgroupUniformLoad(&sharedValue);` +
            `}`
        );
    });
});
