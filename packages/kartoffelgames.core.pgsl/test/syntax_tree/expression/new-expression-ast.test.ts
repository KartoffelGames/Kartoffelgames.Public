import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { NewExpressionAst } from '../../../source/abstract_syntax_tree/expression/single_value/new-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslArrayType } from '../../../source/abstract_syntax_tree/type/pgsl-array-type.ts';
import { PgslBooleanType } from '../../../source/abstract_syntax_tree/type/pgsl-boolean-type.ts';
import { PgslMatrixType } from '../../../source/abstract_syntax_tree/type/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/pgsl-vector-type.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('NewExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Array', async (pContext) => {
        await pContext.step('Array(...Numeric)', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 5> = new ${PgslArrayType.typeName.array}(1.0, 2.0, 3.0, 4.0, 5.0);
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslArrayType);
        });
    });

    await pContext.step('Vector2(Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        const lVectorType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
        expect(lVectorType).toBeInstanceOf(PgslVectorType);
        expect(lVectorType.dimension).toBe(2);
    });

    await pContext.step('Vector3(Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        const lVectorType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
        expect(lVectorType).toBeInstanceOf(PgslVectorType);
        expect(lVectorType.dimension).toBe(3);
    });

    await pContext.step('Vector3(Vector2, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(
                        new ${PgslVectorType.typeName.vector2}(1.0, 2.0),
                        3.0
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        const lVectorType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
        expect(lVectorType).toBeInstanceOf(PgslVectorType);
        expect(lVectorType.dimension).toBe(3);
    });

    await pContext.step('Vector3(Numeric, Vector2)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(
                        1.0,
                        new ${PgslVectorType.typeName.vector2}(2.0, 3.0)
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        const lVectorType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
        expect(lVectorType).toBeInstanceOf(PgslVectorType);
        expect(lVectorType.dimension).toBe(3);
    });

    await pContext.step('Vector4(Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        const lVectorType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
        expect(lVectorType).toBeInstanceOf(PgslVectorType);
        expect(lVectorType.dimension).toBe(4);
    });

    await pContext.step('Vector4(Vector2, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(
                    new ${PgslVectorType.typeName.vector2}(1.0, 2.0), 
                    3.0, 4.0
                );
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        const lVectorType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
        expect(lVectorType).toBeInstanceOf(PgslVectorType);
        expect(lVectorType.dimension).toBe(4);
    });

    await pContext.step('Vector4(Numeric, Vector2, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(
                        1.0,
                        new ${PgslVectorType.typeName.vector2}(2.0, 3.0),
                        4.0
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        const lVectorType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
        expect(lVectorType).toBeInstanceOf(PgslVectorType);
        expect(lVectorType.dimension).toBe(4);
    });

    await pContext.step('Vector4(Numeric, Numeric, Vector2)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(
                        1.0, 2.0, 
                        new ${PgslVectorType.typeName.vector2}(3.0, 4.0)
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        const lVectorType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
        expect(lVectorType).toBeInstanceOf(PgslVectorType);
        expect(lVectorType.dimension).toBe(4);
    });

    await pContext.step('Vector4(Vector2, Vector2)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(
                        new ${PgslVectorType.typeName.vector2}(1.0, 2.0),
                        new ${PgslVectorType.typeName.vector2}(3.0, 4.0)
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        const lVectorType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
        expect(lVectorType).toBeInstanceOf(PgslVectorType);
        expect(lVectorType.dimension).toBe(4);
    });

    await pContext.step('Vector4(Vector3, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(
                        new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0), 
                        4.0
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        const lVectorType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
        expect(lVectorType).toBeInstanceOf(PgslVectorType);
        expect(lVectorType.dimension).toBe(4);
    });

    await pContext.step('Vector4(Numeric, Vector3)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(
                        1.0,
                        new ${PgslVectorType.typeName.vector3}(2.0, 3.0, 4.0)
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        const lVectorType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
        expect(lVectorType).toBeInstanceOf(PgslVectorType);
        expect(lVectorType.dimension).toBe(4);
    });

    await pContext.step('Matrix22(Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}(1.0, 2.0, 3.0, 4.0);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix22(Vector2, Vector2)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}(
                        new ${PgslVectorType.typeName.vector2}(1.0, 2.0),
                        new ${PgslVectorType.typeName.vector2}(3.0, 4.0)
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix23(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix23}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix23}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix23(Vector3, Vector3)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix23}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix23}(
                        new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0),
                        new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0)
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix24(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix24}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix24}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix24(Vector4, Vector4)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix24}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix24}(
                        new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0),
                        new ${PgslVectorType.typeName.vector4}(5.0, 6.0, 7.0, 8.0)
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix32(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix32}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix32}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix32(Vector2, Vector2, Vector2)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix32}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix32}(
                        new ${PgslVectorType.typeName.vector2}(1.0, 2.0),
                        new ${PgslVectorType.typeName.vector2}(3.0, 4.0),
                        new ${PgslVectorType.typeName.vector2}(5.0, 6.0)
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix33(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix33(Vector3, Vector3, Vector3)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(
                        new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0),
                        new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0),
                        new ${PgslVectorType.typeName.vector3}(7.0, 8.0, 9.0)
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix34(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix34}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix34}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix34(Vector4, Vector4, Vector4)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix34}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix34}(
                        new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0),
                        new ${PgslVectorType.typeName.vector4}(5.0, 6.0, 7.0, 8.0),
                        new ${PgslVectorType.typeName.vector4}(9.0, 10.0, 11.0, 12.0)
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix42(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix42}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix42}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix42(Vector2, Vector2, Vector2, Vector2)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix42}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix42}(
                        new ${PgslVectorType.typeName.vector2}(1.0, 2.0),
                        new ${PgslVectorType.typeName.vector2}(3.0, 4.0),
                        new ${PgslVectorType.typeName.vector2}(5.0, 6.0),
                        new ${PgslVectorType.typeName.vector2}(7.0, 8.0)
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix43(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix43}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix43}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix43(Vector3, Vector3, Vector3, Vector3)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix43}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix43}(
                        new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0),
                        new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0),
                        new ${PgslVectorType.typeName.vector3}(7.0, 8.0, 9.0),
                        new ${PgslVectorType.typeName.vector3}(10.0, 11.0, 12.0)
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix44(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix44}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix44}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Matrix44(Vector4, Vector4, Vector4, Vector4)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix44}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix44}(
                        new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0),
                        new ${PgslVectorType.typeName.vector4}(5.0, 6.0, 7.0, 8.0),
                        new ${PgslVectorType.typeName.vector4}(9.0, 10.0, 11.0, 12.0),
                        new ${PgslVectorType.typeName.vector4}(13.0, 14.0, 15.0, 16.0)
                    );
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslMatrixType);
    });

    await pContext.step('Boolean(Boolean)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslBooleanType.typeName.boolean} = new ${PgslBooleanType.typeName.boolean}(true);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslBooleanType);
    });

    await pContext.step('Boolean(Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslBooleanType.typeName.boolean} = new ${PgslBooleanType.typeName.boolean}(1);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslBooleanType);
    });

    await pContext.step('Float16(Boolean)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float16} = new ${PgslNumericType.typeName.float16}(true);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
    });

    await pContext.step('Float16(Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float16} = new ${PgslNumericType.typeName.float16}(5.0);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
    });

    await pContext.step('Float32(Boolean)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = new ${PgslNumericType.typeName.float32}(true);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
    });

    await pContext.step('Float32(Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = new ${PgslNumericType.typeName.float32}(5.0);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
    });

    await pContext.step('SignedInteger(Boolean)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = new ${PgslNumericType.typeName.signedInteger}(true);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
    });

    await pContext.step('SignedInteger(Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = new ${PgslNumericType.typeName.signedInteger}(5);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
    });

    await pContext.step('UnsignedInteger(Boolean)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = new ${PgslNumericType.typeName.unsignedInteger}(true);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
    });

    await pContext.step('UnsignedInteger(Numeric)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = new ${PgslNumericType.typeName.unsignedInteger}(5u);
                }
            `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: NewExpressionAst = lVariableDeclarationNode.data.expression as NewExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(NewExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
    });
});

Deno.test('NewExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Array', async (pContext) => {
        await pContext.step('Array(...Numeric)', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 5> = new ${PgslArrayType.typeName.array}(1.0, 2.0, 3.0, 4.0, 5.0);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:array<f32,5>=array(1.0,2.0,3.0,4.0,5.0);` +
                `}`
            );
        });
    });

    await pContext.step('Vector2(Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:vec2<f32>=vec2(1.0,2.0);` +
            `}`
        );
    });

    await pContext.step('Vector3(Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:vec3<f32>=vec3(1.0,2.0,3.0);` +
            `}`
        );
    });

    await pContext.step('Vector3(Vector2, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(
                    new ${PgslVectorType.typeName.vector2}(1.0, 2.0),
                    3.0
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:vec3<f32>=vec3(vec2(1.0,2.0),3.0);` +
            `}`
        );
    });

    await pContext.step('Vector3(Numeric, Vector2)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(
                    1.0,
                    new ${PgslVectorType.typeName.vector2}(2.0, 3.0)
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:vec3<f32>=vec3(1.0,vec2(2.0,3.0));` +
            `}`
        );
    });

    await pContext.step('Vector4(Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:vec4<f32>=vec4(1.0,2.0,3.0,4.0);` +
            `}`
        );
    });

    await pContext.step('Vector4(Vector2, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(
                    new ${PgslVectorType.typeName.vector2}(1.0, 2.0),
                    3.0, 4.0
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:vec4<f32>=vec4(vec2(1.0,2.0),3.0,4.0);` +
            `}`
        );
    });

    await pContext.step('Vector4(Numeric, Vector2, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(
                    1.0, 
                    new ${PgslVectorType.typeName.vector2}(2.0, 3.0),
                    4.0
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:vec4<f32>=vec4(1.0,vec2(2.0,3.0),4.0);` +
            `}`
        );
    });

    await pContext.step('Vector4(Numeric, Numeric, Vector2)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(
                    1.0, 2.0, 
                    new ${PgslVectorType.typeName.vector2}(3.0, 4.0)
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:vec4<f32>=vec4(1.0,2.0,vec2(3.0,4.0));` +
            `}`
        );
    });

    await pContext.step('Vector4(Vector2, Vector2)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(
                    new ${PgslVectorType.typeName.vector2}(1.0, 2.0),
                    new ${PgslVectorType.typeName.vector2}(3.0, 4.0)
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:vec4<f32>=vec4(vec2(1.0,2.0),vec2(3.0,4.0));` +
            `}`
        );
    });

    await pContext.step('Vector4(Vector3, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(
                    new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0),
                    4.0
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:vec4<f32>=vec4(vec3(1.0,2.0,3.0),4.0);` +
            `}`
        );
    });

    await pContext.step('Vector4(Numeric, Vector3)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(
                    1.0,
                    new ${PgslVectorType.typeName.vector3}(2.0, 3.0, 4.0)
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:vec4<f32>=vec4(1.0,vec3(2.0,3.0,4.0));` +
            `}`
        );
    });

    await pContext.step('Matrix22(Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}(1.0, 2.0, 3.0, 4.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat2x2<f32>=mat2x2(1.0,2.0,3.0,4.0);` +
            `}`
        );
    });

    await pContext.step('Matrix22(Vector2, Vector2)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}(
                    new ${PgslVectorType.typeName.vector2}(1.0, 2.0),
                    new ${PgslVectorType.typeName.vector2}(3.0, 4.0)
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat2x2<f32>=mat2x2(vec2(1.0,2.0),vec2(3.0,4.0));` +
            `}`
        );
    });

    await pContext.step('Matrix23(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix23}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix23}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat2x3<f32>=mat2x3(1.0,2.0,3.0,4.0,5.0,6.0);` +
            `}`
        );
    });

    await pContext.step('Matrix23(Vector3, Vector3)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix23}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix23}(
                    new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0),
                    new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0)
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat2x3<f32>=mat2x3(vec3(1.0,2.0,3.0),vec3(4.0,5.0,6.0));` +
            `}`
        );
    });

    await pContext.step('Matrix24(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix24}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix24}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat2x4<f32>=mat2x4(1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0);` +
            `}`
        );
    });

    await pContext.step('Matrix24(Vector4, Vector4)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix24}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix24}(
                    new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0),
                    new ${PgslVectorType.typeName.vector4}(5.0, 6.0, 7.0, 8.0)
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat2x4<f32>=mat2x4(vec4(1.0,2.0,3.0,4.0),vec4(5.0,6.0,7.0,8.0));` +
            `}`
        );
    });

    await pContext.step('Matrix32(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix32}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix32}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat3x2<f32>=mat3x2(1.0,2.0,3.0,4.0,5.0,6.0);` +
            `}`
        );
    });

    await pContext.step('Matrix32(Vector2, Vector2, Vector2)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix32}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix32}(
                    new ${PgslVectorType.typeName.vector2}(1.0, 2.0),
                    new ${PgslVectorType.typeName.vector2}(3.0, 4.0),
                    new ${PgslVectorType.typeName.vector2}(5.0, 6.0)
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat3x2<f32>=mat3x2(vec2(1.0,2.0),vec2(3.0,4.0),vec2(5.0,6.0));` +
            `}`
        );
    });

    await pContext.step('Matrix33(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat3x3<f32>=mat3x3(1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0,9.0);` +
            `}`
        );
    });

    await pContext.step('Matrix33(Vector3, Vector3, Vector3)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(
                    new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0),
                    new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0),
                    new ${PgslVectorType.typeName.vector3}(7.0, 8.0, 9.0)
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat3x3<f32>=mat3x3(vec3(1.0,2.0,3.0),vec3(4.0,5.0,6.0),vec3(7.0,8.0,9.0));` +
            `}`
        );
    });

    await pContext.step('Matrix34(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix34}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix34}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat3x4<f32>=mat3x4(1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0,9.0,10.0,11.0,12.0);` +
            `}`
        );
    });

    await pContext.step('Matrix34(Vector4, Vector4, Vector4)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix34}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix34}(
                    new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0),
                    new ${PgslVectorType.typeName.vector4}(5.0, 6.0, 7.0, 8.0),
                    new ${PgslVectorType.typeName.vector4}(9.0, 10.0, 11.0, 12.0)
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat3x4<f32>=mat3x4(vec4(1.0,2.0,3.0,4.0),vec4(5.0,6.0,7.0,8.0),vec4(9.0,10.0,11.0,12.0));` +
            `}`
        );
    });

    await pContext.step('Matrix42(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix42}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix42}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat4x2<f32>=mat4x2(1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0);` +
            `}`
        );
    });

    await pContext.step('Matrix42(Vector2, Vector2, Vector2, Vector2)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix42}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix42}(
                    new ${PgslVectorType.typeName.vector2}(1.0, 2.0),
                    new ${PgslVectorType.typeName.vector2}(3.0, 4.0),
                    new ${PgslVectorType.typeName.vector2}(5.0, 6.0),
                    new ${PgslVectorType.typeName.vector2}(7.0, 8.0)
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat4x2<f32>=mat4x2(vec2(1.0,2.0),vec2(3.0,4.0),vec2(5.0,6.0),vec2(7.0,8.0));` +
            `}`
        );
    });

    await pContext.step('Matrix43(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix43}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix43}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat4x3<f32>=mat4x3(1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0,9.0,10.0,11.0,12.0);` +
            `}`
        );
    });

    await pContext.step('Matrix43(Vector3, Vector3, Vector3, Vector3)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix43}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix43}(
                    new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0),
                    new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0),
                    new ${PgslVectorType.typeName.vector3}(7.0, 8.0, 9.0),
                    new ${PgslVectorType.typeName.vector3}(10.0, 11.0, 12.0)
                );
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat4x3<f32>=mat4x3(vec3(1.0,2.0,3.0),vec3(4.0,5.0,6.0),vec3(7.0,8.0,9.0),vec3(10.0,11.0,12.0));` +
            `}`
        );
    });

    await pContext.step('Matrix44(Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric, Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix44}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix44}(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat4x4<f32>=mat4x4(1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0,9.0,10.0,11.0,12.0,13.0,14.0,15.0,16.0);` +
            `}`
        );
    });

    await pContext.step('Matrix44(Vector4, Vector4, Vector4, Vector4)', () => {
        // Setup.
        const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix44}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix44}(
                        new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0),
                        new ${PgslVectorType.typeName.vector4}(5.0, 6.0, 7.0, 8.0),
                        new ${PgslVectorType.typeName.vector4}(9.0, 10.0, 11.0, 12.0),
                        new ${PgslVectorType.typeName.vector4}(13.0, 14.0, 15.0, 16.0)
                    );
                }
            `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:mat4x4<f32>=mat4x4(vec4(1.0,2.0,3.0,4.0),vec4(5.0,6.0,7.0,8.0),vec4(9.0,10.0,11.0,12.0),vec4(13.0,14.0,15.0,16.0));` +
            `}`
        );
    });

    await pContext.step('Boolean(Boolean)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslBooleanType.typeName.boolean} = new ${PgslBooleanType.typeName.boolean}(true);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:bool=bool(true);` +
            `}`
        );
    });

    await pContext.step('Boolean(Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslBooleanType.typeName.boolean} = new ${PgslBooleanType.typeName.boolean}(1);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:bool=bool(1);` +
            `}`
        );
    });

    await pContext.step('Float16(Boolean)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float16} = new ${PgslNumericType.typeName.float16}(true);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:f16=f16(true);` +
            `}`
        );
    });

    await pContext.step('Float16(Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float16} = new ${PgslNumericType.typeName.float16}(5.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:f16=f16(5.0);` +
            `}`
        );
    });

    await pContext.step('Float32(Boolean)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float32} = new ${PgslNumericType.typeName.float32}(true);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:f32=f32(true);` +
            `}`
        );
    });

    await pContext.step('Float32(Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float32} = new ${PgslNumericType.typeName.float32}(5.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:f32=f32(5.0);` +
            `}`
        );
    });

    await pContext.step('SignedInteger(Boolean)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.signedInteger} = new ${PgslNumericType.typeName.signedInteger}(true);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:i32=i32(true);` +
            `}`
        );
    });

    await pContext.step('SignedInteger(Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.signedInteger} = new ${PgslNumericType.typeName.signedInteger}(5);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:i32=i32(5);` +
            `}`
        );
    });

    await pContext.step('UnsignedInteger(Boolean)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.unsignedInteger} = new ${PgslNumericType.typeName.unsignedInteger}(true);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:u32=u32(true);` +
            `}`
        );
    });

    await pContext.step('UnsignedInteger(Numeric)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.unsignedInteger} = new ${PgslNumericType.typeName.unsignedInteger}(5u);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let testVariable:u32=u32(5u);` +
            `}`
        );
    });
});

Deno.test('NewExpressionAst - Error', async (pContext) => {
    await pContext.step('Error: Invalid parameter count', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
    });

    await pContext.step('Error: Invalid parameter types', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}(true, true, true, true);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
    });

    await pContext.step('Error: Type mismatch in parameters', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 2.0, true, 4.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
    });

    await pContext.step('Error: Non-constructable type', () => {
        // Setup.
        const lCodeText: string = `
            function nonConstructibleFunction(): void {}
            function testFunction(): void {
                let testVariable: nonConstructibleFunction = new nonConstructibleFunction();
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
    });
});
