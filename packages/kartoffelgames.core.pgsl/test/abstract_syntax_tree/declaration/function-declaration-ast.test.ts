import { expect } from '@kartoffelgames/core-test';
import { FunctionDeclarationAst } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAstDataEntryPointWorkgroupSize } from '../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { TypeDeclarationAst } from '../../../source/abstract_syntax_tree/general/type-declaration-ast.ts';
import { BlockStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/block-statement-ast.ts';
import { PgslArrayType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslMatrixType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('FunctionDeclarationAst - Parsing', async (pContext) => {
    await pContext.step('Result types', async (pContext) => {
        await pContext.step('Numeric', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `function ${lFunctionName}(): ${PgslNumericType.typeName.float32} { return 5.0; }`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.name).toBe(lFunctionName);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].data.returnType).toBeInstanceOf(TypeDeclarationAst);
            expect(lFunctionNode.data.declarations[0].data.block).toBeInstanceOf(BlockStatementAst);
        });

        await pContext.step('Array', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `function ${lFunctionName}(): ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},3> { return new ${PgslArrayType.typeName.array}(1.0, 2.0, 3.0); }`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.name).toBe(lFunctionName);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].data.returnType).toBeInstanceOf(TypeDeclarationAst);
            expect(lFunctionNode.data.declarations[0].data.block).toBeInstanceOf(BlockStatementAst);
        });

        await pContext.step('Vector', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `function ${lFunctionName}(): ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> { return new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0); }`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.name).toBe(lFunctionName);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].data.returnType).toBeInstanceOf(TypeDeclarationAst);
            expect(lFunctionNode.data.declarations[0].data.block).toBeInstanceOf(BlockStatementAst);
        });

        await pContext.step('Matrix', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `function ${lFunctionName}(): ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> { return new ${PgslMatrixType.typeName.matrix22}(1.0, 2.0, 3.0, 4.0); }`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.name).toBe(lFunctionName);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].data.returnType).toBeInstanceOf(TypeDeclarationAst);
            expect(lFunctionNode.data.declarations[0].data.block).toBeInstanceOf(BlockStatementAst);
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
                expect(lFunctionNode.data.declarations[0].data.returnType).toBeInstanceOf(TypeDeclarationAst);
                expect(lFunctionNode.data.declarations[0].data.block).toBeInstanceOf(BlockStatementAst);
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
                expect(lFunctionNode.data.declarations[0].data.returnType).toBeInstanceOf(TypeDeclarationAst);
                expect(lFunctionNode.data.declarations[0].data.block).toBeInstanceOf(BlockStatementAst);
            });
        });
    });

    await pContext.step('Parameter', async (pContext) => {
        await pContext.step('No parameter', async () => {
            // Setup.
            const lCodeText: string = `function testFunction(): void {}`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].data.parameter).toHaveLength(0);
        });

        await pContext.step('Single parameter', async (pContext) => {
            await pContext.step('Numeric', async () => {
                // Setup.
                const lParameterName: string = 'paramOne';
                const lCodeText: string = `function testFunction(${lParameterName}: ${PgslNumericType.typeName.float32}): void {}`;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation.
                expect(lDocument.data.content).toHaveLength(1);
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                expect(lFunctionNode.data.declarations).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].data.parameter).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].data.parameter[0].name).toBe(lParameterName);
                expect(lFunctionNode.data.declarations[0].data.parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
            });

            await pContext.step('Array', async () => {
                // Setup.
                const lParameterName: string = 'paramOne';
                const lCodeText: string = `function testFunction(${lParameterName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},5>): void {}`;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation.
                expect(lDocument.data.content).toHaveLength(1);
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                expect(lFunctionNode.data.declarations).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].data.parameter).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].data.parameter[0].name).toBe(lParameterName);
                expect(lFunctionNode.data.declarations[0].data.parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
            });

            await pContext.step('Vector', async () => {
                // Setup.
                const lParameterName: string = 'paramOne';
                const lCodeText: string = `function testFunction(${lParameterName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>): void {}`;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation.
                expect(lDocument.data.content).toHaveLength(1);
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                expect(lFunctionNode.data.declarations).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].data.parameter).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].data.parameter[0].name).toBe(lParameterName);
                expect(lFunctionNode.data.declarations[0].data.parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
            });

            await pContext.step('Matrix', async () => {
                // Setup.
                const lParameterName: string = 'paramOne';
                const lCodeText: string = `function testFunction(${lParameterName}: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}>): void {}`;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation.
                expect(lDocument.data.content).toHaveLength(1);
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                expect(lFunctionNode.data.declarations).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].data.parameter).toHaveLength(1);
                expect(lFunctionNode.data.declarations[0].data.parameter[0].name).toBe(lParameterName);
                expect(lFunctionNode.data.declarations[0].data.parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
            });

            await pContext.step('Pointer', async (pContext) => {
                await pContext.step('Numeric', async () => {
                    // Setup.
                    const lParameterName: string = 'paramOne';
                    const lCodeText: string = `function testFunction(${lParameterName}: *${PgslNumericType.typeName.float32}): void {}`;

                    // Process.
                    const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                    // Evaluation.
                    expect(lDocument.data.content).toHaveLength(1);
                    const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                    expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                    expect(lFunctionNode.data.declarations).toHaveLength(1);
                    expect(lFunctionNode.data.declarations[0].data.parameter).toHaveLength(1);
                    expect(lFunctionNode.data.declarations[0].data.parameter[0].name).toBe(lParameterName);
                    expect(lFunctionNode.data.declarations[0].data.parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
                });

                await pContext.step('Vector', async () => {
                    // Setup.
                    const lParameterName: string = 'paramOne';
                    const lCodeText: string = `function testFunction(${lParameterName}: *${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>): void {}`;

                    // Process.
                    const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                    // Evaluation.
                    expect(lDocument.data.content).toHaveLength(1);
                    const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                    expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                    expect(lFunctionNode.data.declarations).toHaveLength(1);
                    expect(lFunctionNode.data.declarations[0].data.parameter).toHaveLength(1);
                    expect(lFunctionNode.data.declarations[0].data.parameter[0].name).toBe(lParameterName);
                    expect(lFunctionNode.data.declarations[0].data.parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
                });

                await pContext.step('Array', async () => {
                    // Setup.
                    const lParameterName: string = 'paramOne';
                    const lCodeText: string = `function testFunction(${lParameterName}: *${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},7>): void {}`;

                    // Process.
                    const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                    // Evaluation.
                    expect(lDocument.data.content).toHaveLength(1);
                    const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                    expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
                    expect(lFunctionNode.data.declarations).toHaveLength(1);
                    expect(lFunctionNode.data.declarations[0].data.parameter).toHaveLength(1);
                    expect(lFunctionNode.data.declarations[0].data.parameter[0].name).toBe(lParameterName);
                    expect(lFunctionNode.data.declarations[0].data.parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
                });
            });
        });

        await pContext.step('Multiparameter', async () => {
            // Setup.
            const lParameterOneName: string = 'paramOne';
            const lParameterTwoName: string = 'paramTwo';
            const lCodeText: string = `function testFunction(${lParameterOneName}: ${PgslNumericType.typeName.float32}, ${lParameterTwoName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>): void {}`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].data.parameter).toHaveLength(2);
            expect(lFunctionNode.data.declarations[0].data.parameter[0].name).toBe(lParameterOneName);
            expect(lFunctionNode.data.declarations[0].data.parameter[0].type).toBeInstanceOf(TypeDeclarationAst);
            expect(lFunctionNode.data.declarations[0].data.parameter[1].name).toBe(lParameterTwoName);
            expect(lFunctionNode.data.declarations[0].data.parameter[1].type).toBeInstanceOf(TypeDeclarationAst);
        });
    });

    await pContext.step('Attributes', async (pContext) => {
        await pContext.step('Vertex', async () => {
            // Setup.
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function testFunction(in: VertexIn): VertexOut {
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
            expect(lFunctionNode.data.declarations[0].data.entryPoint).toBeDefined();
            expect(lFunctionNode.data.declarations[0].data.entryPoint?.stage).toBe('vertex');
        });

        await pContext.step('Fragment', async () => {
            // Setup.
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function testFunction(in: FragmentIn): FragmentOut {
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
            expect(lFunctionNode.data.declarations[0].data.entryPoint).toBeDefined();
            expect(lFunctionNode.data.declarations[0].data.entryPoint?.stage).toBe('fragment');
        });

        await pContext.step('Compute', async () => {
            // Setup.
            const lWorkgroupX: number = 8;
            const lWorkgroupY: number = 8;
            const lWorkgroupZ: number = 1;
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(${lWorkgroupX}, ${lWorkgroupY}, ${lWorkgroupZ})]
                function testFunction(): void {}
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
            expect(lDocument.data.content).toHaveLength(1);
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            expect(lFunctionNode).toBeInstanceOf(FunctionDeclarationAst);
            expect(lFunctionNode.data.declarations).toHaveLength(1);
            expect(lFunctionNode.data.declarations[0].data.entryPoint).toBeDefined();
            expect(lFunctionNode.data.declarations[0].data.entryPoint?.stage).toBe('compute');
            expect((<{ workgroupSize: FunctionOverloadDeclarationAstDataEntryPointWorkgroupSize; }>lFunctionNode.data.declarations[0].data.entryPoint).workgroupSize).toBeDefined();
            expect((<{ workgroupSize: FunctionOverloadDeclarationAstDataEntryPointWorkgroupSize; }>lFunctionNode.data.declarations[0].data.entryPoint).workgroupSize?.x).toBe(lWorkgroupX);
            expect((<{ workgroupSize: FunctionOverloadDeclarationAstDataEntryPointWorkgroupSize; }>lFunctionNode.data.declarations[0].data.entryPoint).workgroupSize?.y).toBe(lWorkgroupY);
            expect((<{ workgroupSize: FunctionOverloadDeclarationAstDataEntryPointWorkgroupSize; }>lFunctionNode.data.declarations[0].data.entryPoint).workgroupSize?.z).toBe(lWorkgroupZ);
        });
    });
});
