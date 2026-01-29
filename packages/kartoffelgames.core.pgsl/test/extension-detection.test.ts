import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslArrayType } from '../source/abstract_syntax_tree/type/pgsl-array-type.ts';
import { PgslBuildInType } from '../source/abstract_syntax_tree/type/pgsl-build-in-type.ts';
import { PgslNumericType } from '../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslParser } from '../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('Extension detection - f16', async (pContext) => {
    await pContext.step('Enabled', async () => {
        // Setup.
        const lLiteralValue: string = '3.14h';
        const lCodeText: string = `
            const textVariable: ${PgslNumericType.typeName.float16} = ${lLiteralValue};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `enable f16;` +
            `const textVariable:f16=${lLiteralValue};`
        );
    });

    await pContext.step('Disabled', async () => {
        // Setup.
        const lLiteralValue: string = '3.14f';
        const lCodeText: string = `
            const textVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `const textVariable:f32=${lLiteralValue};`
        );
    });
});

Deno.test('Extension detection - clip_distances', async (pContext) => {
    await pContext.step('Enabled', () => {
        // Setup.
        const lStructName: string = 'TestClipDistancesStruct';
        const lPropertyName: string = 'clipDistancesProperty';
        const lArraySize: number = 5;
        const lCodeText: string = `
            struct ${lStructName} {
                ${lPropertyName}: ${PgslBuildInType.typeName.clipDistances}<${lArraySize}>
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output.
        expect(lTranspilationResult.source).toBe(
            `enable clip_distances;` +
            `struct ${lStructName}{` +
            `@builtin(clip_distances)${lPropertyName}:array<f32,${lArraySize}>` +
            `}`
        );
    });

    await pContext.step('Disabled', () => {
        // Setup.
        const lStructName: string = 'TestClipDistancesStruct';
        const lPropertyName: string = 'clipDistancesProperty';
        const lArraySize: number = 5;
        const lCodeText: string = `
            struct ${lStructName} {
                ${lPropertyName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, ${lArraySize}>
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output.
        expect(lTranspilationResult.source).toBe(
            `struct ${lStructName}{` +
            `${lPropertyName}:array<f32,${lArraySize}>` +
            `}`
        );
    });
});

Deno.test('Extension detection - dual_source_blending', async (pContext) => {
    await pContext.step('blend source', () => {
        // Setup.
        const lStructName: string = 'TestBlendSourceStruct';
        const lPropertyName: string = 'blendProperty';
        const lBlendSourceValue: number = 0;
        const lBlendSourceLocation: string = 'TextureOne';
        const lCodeText: string = `
            struct ${lStructName} {
                [${AttributeListAst.attributeNames.location}("${lBlendSourceLocation}")]
                [${AttributeListAst.attributeNames.blendSource}(${lBlendSourceValue})]
                ${lPropertyName}: Vector4<${PgslNumericType.typeName.float32}>
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output.
        expect(lTranspilationResult.source).toBe(
            `enable dual_source_blending;` +
            `struct ${lStructName}{` +
            `@blend_src(0)@location(0)${lPropertyName}:vec4<f32>` +
            `}`
        );
    });

    await pContext.step('blend source', () => {
        // Setup.
        const lStructName: string = 'TestBlendSourceStruct';
        const lPropertyName: string = 'blendProperty';
        const lCodeText: string = `
            struct ${lStructName} {
                ${lPropertyName}: Vector4<${PgslNumericType.typeName.float32}>
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output.
        expect(lTranspilationResult.source).toBe(
            `struct ${lStructName}{` +
            `${lPropertyName}:vec4<f32>` +
            `}`
        );
    });
});

Deno.test('Extension detection - primitive_index', async (pContext) => {
    await pContext.step('PrimitiveIndex', () => {
        // Setup.
        const lStructName: string = 'TestPrimitiveIndexStruct';
        const lPropertyName: string = 'primitiveIndexProperty';
        const lCodeText: string = `
            struct ${lStructName} {
                ${lPropertyName}: ${PgslBuildInType.typeName.primitiveIndex}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output.
        expect(lTranspilationResult.source).toBe(
            `enable primitive_index;` +
            `struct ${lStructName}{` +
            `@builtin(primitive_index)${lPropertyName}:u32` +
            `}`
        );
    });

    await pContext.step('PrimitiveIndex', () => {
        // Setup.
        const lStructName: string = 'TestPrimitiveIndexStruct';
        const lPropertyName: string = 'primitiveIndexProperty';
        const lCodeText: string = `
            struct ${lStructName} {
                ${lPropertyName}: ${PgslNumericType.typeName.unsignedInteger}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output.
        expect(lTranspilationResult.source).toBe(
            `struct ${lStructName}{` +
            `${lPropertyName}:u32` +
            `}`
        );
    });
});