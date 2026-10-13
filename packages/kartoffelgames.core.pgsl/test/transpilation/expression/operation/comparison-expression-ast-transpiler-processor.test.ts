import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ComparisonExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Equality Operations', async (pContext) => {
        await pContext.step('Equal comparison', async (pContext) => {
            await pContext.step('Boolean', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let boolOne: bool = true;
                        let boolTwo: bool = false;
                        let testVariable: bool = boolOne == boolTwo;
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `fn testFunction(){` +
                    `var boolOne:bool=true;` +
                    `var boolTwo:bool=false;` +
                    `var testVariable:bool=boolOne==boolTwo;` +
                    `}`
                );
            });

            await pContext.step('Boolean vector', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                        let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                        let testVariable: ${PgslVectorType.typeName.vector3}<bool> = vectorOne == vectorTwo;
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `fn testFunction(){` +
                    `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                    `var vectorTwo:vec3<f32>=vec3(1.0,2.0,3.0);` +
                    `var testVariable:vec3<bool>=vectorOne==vectorTwo;` +
                    `}`
                );
            });
        });

        await pContext.step('Not equal comparison', async (pContext) => {
            await pContext.step('Boolean', () => {
                // Setup.
                const lLeftValue: number = 5.0;
                const lRightValue: number = 3.0;
                const lCodeText: string = `
                    function testFunction(): void {
                        let testVariable: bool = ${lLeftValue} != ${lRightValue};
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `fn testFunction(){` +
                    `var testVariable:bool=${lLeftValue}!=${lRightValue};` +
                    `}`
                );
            });

            await pContext.step('Boolean vector', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                        let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                        let testVariable: ${PgslVectorType.typeName.vector3}<bool> = vectorOne != vectorTwo;
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `fn testFunction(){` +
                    `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                    `var vectorTwo:vec3<f32>=vec3(4.0,5.0,6.0);` +
                    `var testVariable:vec3<bool>=vectorOne!=vectorTwo;` +
                    `}`
                );
            });
        });
    });

    await pContext.step('Relational Operations', async (pContext) => {
        await pContext.step('Lower than', async (pContext) => {
            await pContext.step('Float', () => {
                // Setup.
                const lLeftValue: number = 3.0;
                const lRightValue: number = 5.0;
                const lCodeText: string = `
                    function testFunction(): void {
                        let testVariable: bool = ${lLeftValue} < ${lRightValue};
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `fn testFunction(){` +
                    `var testVariable:bool=${lLeftValue}<${lRightValue};` +
                    `}`
                );
            });

            await pContext.step('Float vector', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                        let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                        let testVariable: ${PgslVectorType.typeName.vector3}<bool> = vectorOne < vectorTwo;
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `fn testFunction(){` +
                    `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                    `var vectorTwo:vec3<f32>=vec3(4.0,5.0,6.0);` +
                    `var testVariable:vec3<bool>=vectorOne<vectorTwo;` +
                    `}`
                );
            });
        });

        await pContext.step('Lower than or equal', async (pContext) => {
            await pContext.step('Float', () => {
                // Setup.
                const lLeftValue: number = 3.0;
                const lRightValue: number = 5.0;
                const lCodeText: string = `
                    function testFunction(): void {
                        let testVariable: bool = ${lLeftValue} <= ${lRightValue};
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `fn testFunction(){` +
                    `var testVariable:bool=${lLeftValue}<=${lRightValue};` +
                    `}`
                );
            });

            await pContext.step('Float vector', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                        let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                        let testVariable: ${PgslVectorType.typeName.vector3}<bool> = vectorOne <= vectorTwo;
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `fn testFunction(){` +
                    `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                    `var vectorTwo:vec3<f32>=vec3(4.0,5.0,6.0);` +
                    `var testVariable:vec3<bool>=vectorOne<=vectorTwo;` +
                    `}`
                );
            });
        });

        await pContext.step('Greater than', async (pContext) => {
            await pContext.step('Float', () => {
                // Setup.
                const lLeftValue: number = 5.0;
                const lRightValue: number = 3.0;
                const lCodeText: string = `
                    function testFunction(): void {
                        let testVariable: bool = ${lLeftValue} > ${lRightValue};
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `fn testFunction(){` +
                    `var testVariable:bool=${lLeftValue}>${lRightValue};` +
                    `}`
                );
            });

            await pContext.step('Float vector', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                        let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                        let testVariable: ${PgslVectorType.typeName.vector3}<bool> = vectorOne > vectorTwo;
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `fn testFunction(){` +
                    `var vectorOne:vec3<f32>=vec3(4.0,5.0,6.0);` +
                    `var vectorTwo:vec3<f32>=vec3(1.0,2.0,3.0);` +
                    `var testVariable:vec3<bool>=vectorOne>vectorTwo;` +
                    `}`
                );
            });
        });

        await pContext.step('Greater than or equal', async (pContext) => {
            await pContext.step('Float', () => {
                // Setup.
                const lLeftValue: number = 5.0;
                const lRightValue: number = 3.0;
                const lCodeText: string = `
                    function testFunction(): void {
                        let testVariable: bool = ${lLeftValue} >= ${lRightValue};
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `fn testFunction(){` +
                    `var testVariable:bool=${lLeftValue}>=${lRightValue};` +
                    `}`
                );
            });

            await pContext.step('Float vector', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                        let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                        let testVariable: ${PgslVectorType.typeName.vector3}<bool> = vectorOne >= vectorTwo;
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `fn testFunction(){` +
                    `var vectorOne:vec3<f32>=vec3(4.0,5.0,6.0);` +
                    `var vectorTwo:vec3<f32>=vec3(1.0,2.0,3.0);` +
                    `var testVariable:vec3<bool>=vectorOne>=vectorTwo;` +
                    `}`
                );
            });
        });
    });
});
