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
import { execPath } from "node:process";
import { PgslParserResultComputeEntryPoint } from "../../../source/parser_result/entry_point/pgsl-parser-result-compute-entry-point.ts";
import { PgslParserResultFragmentEntryPoint } from "../../../source/parser_result/entry_point/pgsl-parser-result-fragment-entry-point.ts";
import { PgslParserResultVertexEntryPoint } from "../../../source/parser_result/entry_point/pgsl-parser-result-vertex-entry-point.ts";
import { PgslParserResultVectorType } from "../../../source/parser_result/type/pgsl-parser-result-vector-type.ts";
import { PgslParserResultNumericType } from "../../../source/parser_result/type/pgsl-parser-result-numeric-type.ts";
import { PgslBuildInType } from "../../../source/abstract_syntax_tree/type/pgsl-build-in-type.ts";

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
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function ${lFunctionName}(in: VertexIn): VertexOut {
                    let out: VertexOut;
                    return out;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(3);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[2] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].entryPoint).toBeDefined();
            expect(lFunctionNode.data.declarations[0].entryPoint?.stage).toBe('vertex');
        });

        await pContext.step('Fragment', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function ${lFunctionName}(in: FragmentIn): FragmentOut {
                    let out: FragmentOut;
                    return out;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(3);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[2] as FunctionDeclarationAst;
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
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function ${lFunctionName}(in: VertexIn): VertexOut {
                    let out: VertexOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `struct VertexIn{@location(0)position:vec4<f32>}` +
                `struct VertexOut{@location(0)position:vec4<f32>}` +
                `@vertex fn ${lFunctionName}(in:VertexIn)->VertexOut{` +
                `var out:VertexOut;` +
                `return out;` +
                `}`
            );
        });

        await pContext.step('Fragment', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function ${lFunctionName}(in: FragmentIn): FragmentOut {
                    let out: FragmentOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `struct FragmentIn{@location(0)position:vec4<f32>}` +
                `struct FragmentOut{@location(0)position:vec4<f32>}` +
                `@fragment fn ${lFunctionName}(in:FragmentIn)->FragmentOut{` +
                `var out:FragmentOut;` +
                `return out;` +
                `}`
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

Deno.test('FunctionDeclarationAst - Parser Result', async (pContext) => {
    await pContext.step('Compute Entry Point', async () => {
        // Setup.
        const lFunctionName: string = 'testFunction';
        const lWorkgroupX: number = 8;
        const lWorkgroupY: number = 4;
        const lWorkgroupZ: number = 2;
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.compute}(${lWorkgroupX}, ${lWorkgroupY}, ${lWorkgroupZ})]
            function ${lFunctionName}(): void {}
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No incidents.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Check entry points count.
        expect(lTranspilationResult.entryPoints.compute.size).toBe(1);

        // Evaluation. Check entry point type and name.
        const lEntryPoint: PgslParserResultComputeEntryPoint = lTranspilationResult.entryPoints.compute.get(lFunctionName)!;
        expect(lEntryPoint).toBeDefined();
        expect(lEntryPoint.type).toBe('compute');
        expect(lEntryPoint.name).toBe(lFunctionName);

        // Evaluation. Check workgroup size.
        expect(lEntryPoint.workgroupSize).toBeDefined();
        expect(lEntryPoint.workgroupSize.x).toBe(lWorkgroupX);
        expect(lEntryPoint.workgroupSize.y).toBe(lWorkgroupY);
        expect(lEntryPoint.workgroupSize.z).toBe(lWorkgroupZ);
    });

    await pContext.step('Fragment Entry Point', async (pContext) => {
        await pContext.step('Only location output values', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_location_one")] positionOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_location_two")] positionTwo: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_render_one")] renderOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_render_two")] renderTwo: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function ${lFunctionName}(in: FragmentIn): FragmentOut {
                    let out: FragmentOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No incidents.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Check entry points count.
            expect(lTranspilationResult.entryPoints.fragment.size).toBe(1);

            // Evaluation. Check entry point type and name.
            const lEntryPoint: PgslParserResultFragmentEntryPoint = lTranspilationResult.entryPoints.fragment.get(lFunctionName)!;
            expect(lEntryPoint).toBeDefined();
            expect(lEntryPoint.type).toBe('fragment');
            expect(lEntryPoint.name).toBe(lFunctionName);

            // Evaluation. Check render targets count.
            expect(lEntryPoint.renderTargets).toHaveLength(2);

            // Evaluation. Check first render target.
            const lRenderTargetOne = lEntryPoint.renderTargets[0];
            expect(lRenderTargetOne.name).toBe('renderOne');
            expect(lRenderTargetOne.location).toBe(0);
            expect(lRenderTargetOne.type.type).toBe('vector');

            // Evaluation. Check first render target element type.
            const lRenderTargetOneType = lRenderTargetOne.type as PgslParserResultVectorType;
            expect(lRenderTargetOneType.dimension).toBe(4);
            expect(lRenderTargetOneType.elementType.type).toBe('numeric');
            const lRenderTargetOneElementType = lRenderTargetOneType.elementType as PgslParserResultNumericType;
            expect(lRenderTargetOneElementType.numberType).toBe('float');
            expect(lRenderTargetOneElementType.alignmentType).toBe('packed');

            // Evaluation. Check second render target.
            const lRenderTargetTwo = lEntryPoint.renderTargets[1];
            expect(lRenderTargetTwo.name).toBe('renderTwo');
            expect(lRenderTargetTwo.location).toBe(1);
            expect(lRenderTargetTwo.type.type).toBe('vector');

            // Evaluation. Check second render target element type.
            const lRenderTargetTwoType = lRenderTargetTwo.type as PgslParserResultVectorType;
            expect(lRenderTargetTwoType.dimension).toBe(4);
            expect(lRenderTargetTwoType.elementType.type).toBe('numeric');
            const lRenderTargetTwoElementType = lRenderTargetTwoType.elementType as PgslParserResultNumericType;
            expect(lRenderTargetTwoElementType.numberType).toBe('float');
            expect(lRenderTargetTwoElementType.alignmentType).toBe('packed');
        });

        await pContext.step('With buildin position value', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_location_one")] renderOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    builtInPosition: ${PgslBuildInType.typeName.position}
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_render_one")] outputOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function ${lFunctionName}(in: FragmentIn): FragmentOut {
                    let out: FragmentOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No incidents.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Check entry points count.
            expect(lTranspilationResult.entryPoints.fragment.size).toBe(1);

            // Evaluation. Check entry point type and name.
            const lEntryPoint: PgslParserResultFragmentEntryPoint = lTranspilationResult.entryPoints.fragment.get(lFunctionName)!;
            expect(lEntryPoint).toBeDefined();
            expect(lEntryPoint.type).toBe('fragment');
            expect(lEntryPoint.name).toBe(lFunctionName);

            // Evaluation. Check render targets count (should only include location properties, not built-in values).
            expect(lEntryPoint.renderTargets).toHaveLength(1);

            // Evaluation. Check the single render target.
            const lRenderTargetOne = lEntryPoint.renderTargets[0];
            expect(lRenderTargetOne.name).toBe('outputOne');
            expect(lRenderTargetOne.location).toBe(0);
            expect(lRenderTargetOne.type.type).toBe('vector');

            // Evaluation. Check first render target element type.
            const lRenderTargetOneType = lRenderTargetOne.type as PgslParserResultVectorType;
            expect(lRenderTargetOneType.dimension).toBe(4);
            expect(lRenderTargetOneType.elementType.type).toBe('numeric');
            const lRenderTargetOneElementType = lRenderTargetOneType.elementType as PgslParserResultNumericType;
            expect(lRenderTargetOneElementType.numberType).toBe('float');
            expect(lRenderTargetOneElementType.alignmentType).toBe('packed');
        });
    });

    await pContext.step('Vertex Entry Point', async (pContext) => {
        await pContext.step('Only location input values', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_normal")] normal: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    [${AttributeListAst.attributeNames.location}("test_output_pos")] outputPos: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_output_norm")] outputNorm: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function ${lFunctionName}(in: VertexIn): VertexOut {
                    let out: VertexOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No incidents.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Check entry points count.
            expect(lTranspilationResult.entryPoints.vertex.size).toBe(1);

            // Evaluation. Check entry point type and name.
            const lEntryPoint: PgslParserResultVertexEntryPoint = lTranspilationResult.entryPoints.vertex.get(lFunctionName)!;
            expect(lEntryPoint).toBeDefined();
            expect(lEntryPoint.type).toBe('vertex');
            expect(lEntryPoint.name).toBe(lFunctionName);

            // Evaluation. Check parameters count.
            expect(lEntryPoint.parameters).toHaveLength(2);

            // Evaluation. Check first parameter.
            const lParameterOne = lEntryPoint.parameters[0];
            expect(lParameterOne.name).toBe('position');
            expect(lParameterOne.location).toBe(0);
            expect(lParameterOne.type.type).toBe('vector');

            // Evaluation. Check first parameter element type.
            const lParameterOneType = lParameterOne.type as PgslParserResultVectorType;
            expect(lParameterOneType.dimension).toBe(3);
            expect(lParameterOneType.elementType.type).toBe('numeric');
            const lParameterOneElementType = lParameterOneType.elementType as PgslParserResultNumericType;
            expect(lParameterOneElementType.numberType).toBe('float');
            expect(lParameterOneElementType.alignmentType).toBe('packed');

            // Evaluation. Check second parameter.
            const lParameterTwo = lEntryPoint.parameters[1];
            expect(lParameterTwo.name).toBe('normal');
            expect(lParameterTwo.location).toBe(1);
            expect(lParameterTwo.type.type).toBe('vector');

            // Evaluation. Check second parameter element type.
            const lParameterTwoType = lParameterTwo.type as PgslParserResultVectorType;
            expect(lParameterTwoType.dimension).toBe(3);
            expect(lParameterTwoType.elementType.type).toBe('numeric');
            const lParameterTwoElementType = lParameterTwoType.elementType as PgslParserResultNumericType;
            expect(lParameterTwoElementType.numberType).toBe('float');
            expect(lParameterTwoElementType.alignmentType).toBe('packed');
        });

        await pContext.step('With buildin vertexIndex value', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>,
                    vertexIndexValue: ${PgslBuildInType.typeName.vertexIndex}
                }
                struct VertexOut {
                    [${AttributeListAst.attributeNames.location}("test_output_pos")] outputPos: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function ${lFunctionName}(in: VertexIn): VertexOut {
                    let out: VertexOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No incidents.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Check entry points count.
            expect(lTranspilationResult.entryPoints.vertex.size).toBe(1);

            // Evaluation. Check entry point type and name.
            const lEntryPoint: PgslParserResultVertexEntryPoint = lTranspilationResult.entryPoints.vertex.get(lFunctionName)!;
            expect(lEntryPoint).toBeDefined();
            expect(lEntryPoint.type).toBe('vertex');
            expect(lEntryPoint.name).toBe(lFunctionName);

            // Evaluation. Check parameters count (should only include location properties, not built-in values).
            expect(lEntryPoint.parameters).toHaveLength(1);

            // Evaluation. Check the single parameter.
            const lParameterOne = lEntryPoint.parameters[0];
            expect(lParameterOne.name).toBe('position');
            expect(lParameterOne.location).toBe(0);
            expect(lParameterOne.type.type).toBe('vector');

            // Evaluation. Check first parameter element type.
            const lParameterOneType = lParameterOne.type as PgslParserResultVectorType;
            expect(lParameterOneType.dimension).toBe(3);
            expect(lParameterOneType.elementType.type).toBe('numeric');
            const lParameterOneElementType = lParameterOneType.elementType as PgslParserResultNumericType;
            expect(lParameterOneElementType.numberType).toBe('float');
            expect(lParameterOneElementType.alignmentType).toBe('packed');
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

        await pContext.step('Compute entry point has a result type', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lWorkgroupX: number = 8;
            const lWorkgroupY: number = 8;
            const lWorkgroupZ: number = 1;
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(${lWorkgroupX}, ${lWorkgroupY}, ${lWorkgroupZ})]
                function ${lFunctionName}(): ${PgslNumericType.typeName.float32} {}
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('Compute entry points must not have a return type.')
            )).toBe(true);
        });

        await pContext.step('Compute entry point has a parameter', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lParameterName: string = 'paramOne';
            const lParameterType: string = PgslNumericType.typeName.float32;
            const lWorkgroupX: number = 8;
            const lWorkgroupY: number = 8;
            const lWorkgroupZ: number = 1;
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(${lWorkgroupX}, ${lWorkgroupY}, ${lWorkgroupZ})]
                function ${lFunctionName}(${lParameterName}: ${lParameterType}): void {}
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('Compute entry points must not have parameters.')
            )).toBe(true);
        });

        await pContext.step('Fragment entry point has no result type', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function ${lFunctionName}(in: FragmentIn): void {}
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The fragment entry point return type must be a struct type defining the fragment output structure.')
            )).toBe(true);
        });

        await pContext.step('Fragment entry point has none struct result type', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function ${lFunctionName}(in: FragmentIn): ${PgslNumericType.typeName.float32} { return 1.0; }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The fragment entry point return type must be a struct type defining the fragment output structure.')
            )).toBe(true);
        });

        await pContext.step('Fragment entry point has no parameter', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function ${lFunctionName}(): FragmentOut {
                    let out: FragmentOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The fragment entry points must have exactly one parameter defining the fragment input structure.')
            )).toBe(true);
        });

        await pContext.step('Fragment entry point has more than one input parameter', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function ${lFunctionName}(in: FragmentIn, extraParam: ${PgslNumericType.typeName.float32}): FragmentOut {
                    let out: FragmentOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The fragment entry points must have exactly one parameter defining the fragment input structure.')
            )).toBe(true);
        });

        await pContext.step('Fragment entry point has none struct type asparameter', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function ${lFunctionName}(in: ${PgslNumericType.typeName.float32}): FragmentOut {
                    let out: FragmentOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The fragment entry point parameter must be a struct type defining the fragment input structure.')
            )).toBe(true);
        });

        await pContext.step('Vertex entry point has no result type', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function ${lFunctionName}(in: VertexIn): void {}
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The vertex entry point return type must be a struct type defining the vertex output structure.')
            )).toBe(true);
        });

        await pContext.step('Vertex entry point has none struct result type', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function ${lFunctionName}(in: VertexIn): ${PgslNumericType.typeName.float32} { return 1.0; }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The vertex entry point return type must be a struct type defining the vertex output structure.')
            )).toBe(true);
        });

        await pContext.step('Vertex entry point has no parameter', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct VertexOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function ${lFunctionName}(): VertexOut {
                    let out: VertexOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The vertex entry points must have exactly one parameter defining the vertex input structure.')
            )).toBe(true);
        });

        await pContext.step('Vertex entry point has more than one input parameter', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function ${lFunctionName}(in: VertexIn, extraParam: ${PgslNumericType.typeName.float32}): VertexOut {
                    let out: VertexOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The vertex entry points must have exactly one parameter defining the vertex input structure.')
            )).toBe(true);
        });

        await pContext.step('Vertex entry point has none struct type asparameter', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct VertexOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function ${lFunctionName}(in: ${PgslNumericType.typeName.float32}): VertexOut {
                    let out: VertexOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The vertex entry point parameter must be a struct type defining the vertex input structure.')
            )).toBe(true);
        });
    });
});
