import { expect } from '@kartoffelgames/core-test';
import { FunctionDeclarationAst, type FunctionDeclarationAstDataEntryPointWorkgroupSize } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { TypeDeclarationAst } from '../../../source/abstract_syntax_tree/general/type-declaration-ast.ts';
import { BlockStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/block-statement-ast.ts';
import { PgslArrayType } from '../../../source/abstract_syntax_tree/type/pgsl-array-type.ts';
import { PgslMatrixType } from '../../../source/abstract_syntax_tree/type/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/pgsl-vector-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('FunctionDeclarationAst - Parsing', async (pContext) => {
    await pContext.step('Result types', async (pContext) => {
        await pContext.step('Numeric', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lReturnType: string = PgslNumericType.typeName.float32;
            const lCodeText: string = `function ${lFunctionName}(): ${lReturnType} { return 5.0; }`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.name).toBe(lFunctionName);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].returnType).toBeInstanceOf(TypeDeclarationAst);
            expect(lFunctionNode.data.declarations[0].block).toBeInstanceOf(BlockStatementAst);
        });

        await pContext.step('Array', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lReturnType: string = `${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},3>`;
            const lCodeText: string = `function ${lFunctionName}(): ${lReturnType} { return new ${PgslArrayType.typeName.array}(1.0, 2.0, 3.0); }`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.name).toBe(lFunctionName);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].returnType).toBeInstanceOf(TypeDeclarationAst);
            expect(lFunctionNode.data.declarations[0].block).toBeInstanceOf(BlockStatementAst);
        });

        await pContext.step('Vector', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lReturnType: string = `${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>`;
            const lCodeText: string = `function ${lFunctionName}(): ${lReturnType} { return new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0); }`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.name).toBe(lFunctionName);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].returnType).toBeInstanceOf(TypeDeclarationAst);
            expect(lFunctionNode.data.declarations[0].block).toBeInstanceOf(BlockStatementAst);
        });

        await pContext.step('Matrix', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lReturnType: string = `${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>`;
            const lCodeText: string = `function ${lFunctionName}(): ${lReturnType} { return new ${PgslMatrixType.typeName.matrix22}(1.0, 2.0, 3.0, 4.0); }`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.name).toBe(lFunctionName);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].returnType).toBeInstanceOf(TypeDeclarationAst);
            expect(lFunctionNode.data.declarations[0].block).toBeInstanceOf(BlockStatementAst);
        });

        await pContext.step('Void', async (pContext) => {
            await pContext.step('No return', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lCodeText: string = `function ${lFunctionName}(): void {}`;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation.
                expect(lDocument.data.content).toHaveLength(1);
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                expect(lFunctionNode.data.name).toBe(lFunctionName);
                expect(lFunctionNode.data.declarations).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].returnType).toBeInstanceOf(TypeDeclarationAst);
                expect(lFunctionNode.data.declarations[0].block).toBeInstanceOf(BlockStatementAst);
            });

            await pContext.step('Empty return', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lCodeText: string = `function ${lFunctionName}(): void { return; }`;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation.
                expect(lDocument.data.content).toHaveLength(1);
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                expect(lFunctionNode.data.name).toBe(lFunctionName);
                expect(lFunctionNode.data.declarations).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].returnType).toBeInstanceOf(TypeDeclarationAst);
                expect(lFunctionNode.data.declarations[0].block).toBeInstanceOf(BlockStatementAst);
            });
        });
    });

    await pContext.step('Parameter', async (pContext) => {
        await pContext.step('No parameter', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `function ${lFunctionName}(): void {}`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].parameter).toHaveLength(0);
        });

        await pContext.step('Single parameter', async (pContext) => {
            await pContext.step('Numeric', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lParameterName: string = 'paramOne';
                const lParameterType: string = PgslNumericType.typeName.float32;
                const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}`;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation.
                expect(lDocument.data.content).toHaveLength(1);
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                expect(lFunctionNode.data.declarations).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].parameter).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].parameter[0].name).toBe(lParameterName);
                expect(lFunctionNode.data.declarations[0].parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
            });

            await pContext.step('Array', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lParameterName: string = 'paramOne';
                const lParameterType: string = `${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},5>`;
                const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}`;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation.
                expect(lDocument.data.content).toHaveLength(1);
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                expect(lFunctionNode.data.declarations).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].parameter).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].parameter[0].name).toBe(lParameterName);
                expect(lFunctionNode.data.declarations[0].parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
            });

            await pContext.step('Vector', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lParameterName: string = 'paramOne';
                const lParameterType: string = `${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>`;
                const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}`;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation.
                expect(lDocument.data.content).toHaveLength(1);
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                expect(lFunctionNode.data.declarations).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].parameter).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].parameter[0].name).toBe(lParameterName);
                expect(lFunctionNode.data.declarations[0].parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
            });

            await pContext.step('Matrix', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lParameterName: string = 'paramOne';
                const lParameterType: string = `${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}>`;
                const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}`;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation.
                expect(lDocument.data.content).toHaveLength(1);
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                expect(lFunctionNode.data.declarations).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].parameter).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].parameter[0].name).toBe(lParameterName);
                expect(lFunctionNode.data.declarations[0].parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
            });

            await pContext.step('Pointer', async (pContext) => {
                await pContext.step('Numeric', async () => {
                    // Setup.
                    const lFunctionName: string = 'testFunction';
                    const lParameterName: string = 'paramOne';
                    const lParameterType: string = `*${PgslNumericType.typeName.float32}`;
                    const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}`;

                    // Process.
                    const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                    // Evaluation.
                    expect(lDocument.data.content).toHaveLength(1);
                    const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                    expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                    expect(lFunctionNode.data.declarations).toHaveLength(1);
                    expect(lFunctionNode.data.declarations[0].parameter).toHaveLength(1);
                    expect(lFunctionNode.data.declarations[0].parameter[0].name).toBe(lParameterName);
                    expect(lFunctionNode.data.declarations[0].parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
                });

                await pContext.step('Vector', async () => {
                    // Setup.
                    const lFunctionName: string = 'testFunction';
                    const lParameterName: string = 'paramOne';
                    const lParameterType: string = `*${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>`;
                    const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}`;

                    // Process.
                    const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                    // Evaluation.
                    expect(lDocument.data.content).toHaveLength(1);
                    const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                    expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                    expect(lFunctionNode.data.declarations).toHaveLength(1);
                    expect(lFunctionNode.data.declarations[0].parameter).toHaveLength(1);
                    expect(lFunctionNode.data.declarations[0].parameter[0].name).toBe(lParameterName);
                    expect(lFunctionNode.data.declarations[0].parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
                });

                await pContext.step('Array', async () => {
                    // Setup.
                    const lFunctionName: string = 'testFunction';
                    const lParameterName: string = 'paramOne';
                    const lParameterType: string = `*${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},7>`;
                    const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}`;

                    // Process.
                    const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                    // Evaluation.
                    expect(lDocument.data.content).toHaveLength(1);
                    const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                    expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                    expect(lFunctionNode.data.declarations).toHaveLength(1);
                    expect(lFunctionNode.data.declarations[0].parameter).toHaveLength(1);
                    expect(lFunctionNode.data.declarations[0].parameter[0].name).toBe(lParameterName);
                    expect(lFunctionNode.data.declarations[0].parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
                });
            });
        });

        await pContext.step('Multiparameter', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lParameterOneName: string = 'paramOne';
            const lParameterOneType: string = PgslNumericType.typeName.float32;
            const lParameterTwoName: string = 'paramTwo';
            const lParameterTwoType: string = `${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>`;
            const lCodeText: string = `function ${lFunctionName}(${lParameterOneName}: ${lParameterOneType}, ${lParameterTwoName}: ${lParameterTwoType}): void {}`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].parameter).toHaveLength(2);
            expect(lFunctionNode.data.declarations[0].parameter[0].name).toBe(lParameterOneName);
            expect(lFunctionNode.data.declarations[0].parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
            expect(lFunctionNode.data.declarations[0].parameter[1].name).toBe(lParameterTwoName);
            expect(lFunctionNode.data.declarations[0].parameter[1].type).toBeInstanceOf(TypeDeclarationAst);
        });
    });

    await pContext.step('Attributes', async (pContext) => {
        await pContext.step('Vertex', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.vertex}()]
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].entryPoint).toBeDefined();
            expect(lFunctionNode.data.declarations[0].entryPoint?.stage).toBe('vertex');
        });

        await pContext.step('Fragment', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.fragment}()]
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].entryPoint).toBeDefined();
            expect(lFunctionNode.data.declarations[0].entryPoint?.stage).toBe('fragment');
        });

        await pContext.step('Compute', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lWorkgroupX: number = 8;
            const lWorkgroupY: number = 8;
            const lWorkgroupZ: number = 1;
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(${lWorkgroupX}, ${lWorkgroupY}, ${lWorkgroupZ})]
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].entryPoint).toBeDefined();
            expect(lFunctionNode.data.declarations[0].entryPoint?.stage).toBe('compute');
            expect((<{ workgroupSize: FunctionDeclarationAstDataEntryPointWorkgroupSize; }>lFunctionNode.data.declarations[0].entryPoint).workgroupSize).toBeDefined();
            expect((<{ workgroupSize: FunctionDeclarationAstDataEntryPointWorkgroupSize; }>lFunctionNode.data.declarations[0].entryPoint).workgroupSize?.x).toBe(lWorkgroupX);
            expect((<{ workgroupSize: FunctionDeclarationAstDataEntryPointWorkgroupSize; }>lFunctionNode.data.declarations[0].entryPoint).workgroupSize?.y).toBe(lWorkgroupY);
            expect((<{ workgroupSize: FunctionDeclarationAstDataEntryPointWorkgroupSize; }>lFunctionNode.data.declarations[0].entryPoint).workgroupSize?.z).toBe(lWorkgroupZ);
        });
    });
});

Deno.test('FunctionDeclarationAst - Transpilation', async (pContext) => {
    await pContext.step('Result types', async (pContext) => {
        await pContext.step('Numeric', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lReturnType: string = PgslNumericType.typeName.float32;
            const lCodeText: string = `function ${lFunctionName}(): ${lReturnType} { return 5.0; }`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}()->f32{return 5.0;}`
            );
        });

        await pContext.step('Array', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lReturnType: string = `${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},3>`;
            const lCodeText: string = `function ${lFunctionName}(): ${lReturnType} { return new ${PgslArrayType.typeName.array}(1.0, 2.0, 3.0); }`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}()->array<f32,3>{return array(1.0,2.0,3.0);}`
            );
        });

        await pContext.step('Vector', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lReturnType: string = `${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>`;
            const lCodeText: string = `function ${lFunctionName}(): ${lReturnType} { return new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0); }`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}()->vec3<f32>{return vec3(1.0,2.0,3.0);}`
            );
        });

        await pContext.step('Matrix', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lReturnType: string = `${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>`;
            const lCodeText: string = `function ${lFunctionName}(): ${lReturnType} { return new ${PgslMatrixType.typeName.matrix22}(1.0, 2.0, 3.0, 4.0); }`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}()->mat2x2<f32>{return mat2x2(1.0,2.0,3.0,4.0);}`
            );
        });

        await pContext.step('Void', async (pContext) => {
            await pContext.step('No return', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lCodeText: string = `function ${lFunctionName}(): void {}`;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation.
                expect(lTranspilationResult.incidents).toHaveLength(0);
                expect(lTranspilationResult.source).toBe(
                    `fn ${lFunctionName}(){}`
                );
            });

            await pContext.step('Empty return', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lCodeText: string = `function ${lFunctionName}(): void { return; }`;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation.
                expect(lTranspilationResult.incidents).toHaveLength(0);
                expect(lTranspilationResult.source).toBe(
                    `fn ${lFunctionName}(){return;}`
                );
            });
        });
    });

    await pContext.step('Parameter', async (pContext) => {
        await pContext.step('No parameter', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `function ${lFunctionName}(): void {}`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}(){}`
            );
        });

        await pContext.step('Single parameter', async (pContext) => {
            await pContext.step('Numeric', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lParameterName: string = 'paramOne';
                const lParameterType: string = PgslNumericType.typeName.float32;
                const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}`;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation.
                expect(lTranspilationResult.incidents).toHaveLength(0);
                expect(lTranspilationResult.source).toBe(
                    `fn ${lFunctionName}(${lParameterName}:f32){}`
                );
            });

            await pContext.step('Array', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lParameterName: string = 'paramOne';
                const lParameterType: string = `${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},5>`;
                const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}`;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation.
                expect(lTranspilationResult.incidents).toHaveLength(0);
                expect(lTranspilationResult.source).toBe(
                    `fn ${lFunctionName}(${lParameterName}:array<f32,5>){}`
                );
            });

            await pContext.step('Vector', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lParameterName: string = 'paramOne';
                const lParameterType: string = `${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>`;
                const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}`;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation.
                expect(lTranspilationResult.incidents).toHaveLength(0);
                expect(lTranspilationResult.source).toBe(
                    `fn ${lFunctionName}(${lParameterName}:vec2<f32>){}`
                );
            });

            await pContext.step('Matrix', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lParameterName: string = 'paramOne';
                const lParameterType: string = `${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}>`;
                const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}`;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation.
                expect(lTranspilationResult.incidents).toHaveLength(0);
                expect(lTranspilationResult.source).toBe(
                    `fn ${lFunctionName}(${lParameterName}:mat3x3<f32>){}`
                );
            });

            await pContext.step('Pointer', async (pContext) => {
                await pContext.step('Numeric', async () => {
                    // Setup.
                    const lFunctionName: string = 'testFunction';
                    const lParameterName: string = 'paramOne';
                    const lParameterType: string = `*${PgslNumericType.typeName.float32}`;
                    const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}`;

                    // Process.
                    const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                    // Evaluation.
                    expect(lTranspilationResult.incidents).toHaveLength(0);
                    expect(lTranspilationResult.source).toBe(
                        `fn ${lFunctionName}(${lParameterName}:ptr<function,f32>){}`
                    );
                });

                await pContext.step('Vector', async () => {
                    // Setup.
                    const lFunctionName: string = 'testFunction';
                    const lParameterName: string = 'paramOne';
                    const lParameterType: string = `*${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>`;
                    const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}`;

                    // Process.
                    const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                    // Evaluation.
                    expect(lTranspilationResult.incidents).toHaveLength(0);
                    expect(lTranspilationResult.source).toBe(
                        `fn ${lFunctionName}(${lParameterName}:ptr<function,vec4<f32>>){}`
                    );
                });

                await pContext.step('Array', async () => {
                    // Setup.
                    const lFunctionName: string = 'testFunction';
                    const lParameterName: string = 'paramOne';
                    const lParameterType: string = `*${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},7>`;
                    const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}`;

                    // Process.
                    const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                    // Evaluation.
                    expect(lTranspilationResult.incidents).toHaveLength(0);
                    expect(lTranspilationResult.source).toBe(
                        `fn ${lFunctionName}(${lParameterName}:ptr<function,array<f32,7>>){}`
                    );
                });
            });
        });

        await pContext.step('Multiparameter', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lParameterOneName: string = 'paramOne';
            const lParameterOneType: string = PgslNumericType.typeName.float32;
            const lParameterTwoName: string = 'paramTwo';
            const lParameterTwoType: string = `${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>`;
            const lCodeText: string = `function ${lFunctionName}(${lParameterOneName}: ${lParameterOneType}, ${lParameterTwoName}: ${lParameterTwoType}): void {}`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}(${lParameterOneName}:f32,${lParameterTwoName}:vec2<f32>){}`
            );
        });
    });

    await pContext.step('Attributes', async (pContext) => {
        await pContext.step('Vertex', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.vertex}()]
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@vertex fn ${lFunctionName}(){}`
            );
        });

        await pContext.step('Fragment', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.fragment}()]
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@fragment fn ${lFunctionName}(){}`
            );
        });

        await pContext.step('Compute', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lWorkgroupX: number = 8;
            const lWorkgroupY: number = 8;
            const lWorkgroupZ: number = 1;
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(${lWorkgroupX}, ${lWorkgroupY}, ${lWorkgroupZ})]
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@compute @workgroup_size(${lWorkgroupX},${lWorkgroupY},${lWorkgroupZ}) fn ${lFunctionName}(){}`
            );
        });
    });
});

Deno.test('FunctionDeclarationAst - Error', async (pContext) => {
    await pContext.step('Duplicate function names', async () => {
        // Setup.
        const lFunctionName: string = 'testFunction';
        const lCodeText: string = `
            function ${lFunctionName}(): void {}
            function ${lFunctionName}(): void {}
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Function "${lFunctionName}" is already defined.`)
        )).toBe(true);
    });

    await pContext.step('Result type', async (pContext) => {
        await pContext.step('Return value on void function', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `function ${lFunctionName}(): void { return 5.0; }`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('Function block return type does not match the declared return type.')
            )).toBe(true);
        });

        await pContext.step('Missing return on non void function', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `function ${lFunctionName}(): ${PgslNumericType.typeName.float32} {}`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('Function block return type does not match the declared return type.')
            )).toBe(true);
        });
    });

    await pContext.step('Attribute', async (pContext) => {
        await pContext.step('Invalid attribute', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes(`Attribute "${AttributeListAst.attributeNames.groupBinding}" is not attached to a valid parent type.`)
            )).toBe(true);
        });

        await pContext.step('Missing compute parameter', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}()]
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes(`Attribute "${AttributeListAst.attributeNames.compute}" has invalid number of parameters.`)
            )).toBe(true);
        });

        await pContext.step('Wrong compute parameter type', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(8.5, 8.5, 1.5)]
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('All compute attribute parameters need to be constant integer expressions.')
            )).toBe(true);
        });
    });
});
