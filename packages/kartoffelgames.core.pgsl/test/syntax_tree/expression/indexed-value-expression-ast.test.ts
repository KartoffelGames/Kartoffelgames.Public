import { expect } from '@kartoffelgames/core-test';
import { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from "../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts";
import { DocumentAst } from "../../../source/abstract_syntax_tree/document-ast.ts";
import { LiteralValueExpressionAst } from "../../../source/abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts";
import { IndexedValueExpressionAst } from "../../../source/abstract_syntax_tree/expression/storage/indexed-value-expression-ast.ts";
import { VariableNameExpressionAst } from "../../../source/abstract_syntax_tree/expression/storage/variable-name-expression-ast.ts";
import { VariableDeclarationStatementAst } from "../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts";
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import { PgslArrayType } from "../../../source/type/pgsl-array-type.ts";
import { PgslNumericType } from '../../../source/type/pgsl-numeric-type.ts';
import { PgslVectorType } from "../../../source/type/pgsl-vector-type.ts";
import { PgslMatrixType } from "../../../source/type/pgsl-matrix-type.ts";
import { PgslParserResult } from "../../../source/parser_result/pgsl-parser-result.ts";
import { WgslTranspiler } from "../../../source/transpilation/wgsl/wgsl-transpiler.ts";

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('IndexedValueExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Array Indexing', async () => {
        // Setup.
        const lArrayIndex: number = 2;
        const lVariableName: string = 'numericArray';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 5> = new ${PgslArrayType.typeName.array}(1, 2, 3, 4, 5);
                let arrayItem: ${PgslNumericType.typeName.float32} = ${lVariableName}[${lArrayIndex}];
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of child node.
        const lExpressionNode: IndexedValueExpressionAst = lVariableDeclarationNode.data.expression as IndexedValueExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(IndexedValueExpressionAst);

        const lIndexExpression: LiteralValueExpressionAst = lExpressionNode.data.index as LiteralValueExpressionAst;
        const lVariableExpression: VariableNameExpressionAst = lExpressionNode.data.value as VariableNameExpressionAst;

        // Evaluation. Correct types.
        const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
        expect(lResultType).toBeInstanceOf(PgslNumericType);
        expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.float32);

        // Evaluation. Correct structure.
        expect(lIndexExpression).toBeInstanceOf(LiteralValueExpressionAst);
        expect(lIndexExpression.data.constantValue).toBe(lArrayIndex);
        expect(lVariableExpression).toBeInstanceOf(VariableNameExpressionAst);
        expect(lVariableExpression.data.variableName).toBe(lVariableName);
    });

    await pContext.step('Vector Indexing', async () => {
        // Setup.
        const lVectorItemIndex: number = 2;
        const lVariableName: string = 'numericVector';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1, 2, 3);
                let vectorItem: ${PgslNumericType.typeName.float32} = ${lVariableName}[${lVectorItemIndex}];
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of child node.
        const lExpressionNode: IndexedValueExpressionAst = lVariableDeclarationNode.data.expression as IndexedValueExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(IndexedValueExpressionAst);

        const lIndexExpression: LiteralValueExpressionAst = lExpressionNode.data.index as LiteralValueExpressionAst;
        const lVariableExpression: VariableNameExpressionAst = lExpressionNode.data.value as VariableNameExpressionAst;

        // Evaluation. Correct types.
        const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
        expect(lResultType).toBeInstanceOf(PgslNumericType);
        expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.float32);

        // Evaluation. Correct structure.
        expect(lIndexExpression).toBeInstanceOf(LiteralValueExpressionAst);
        expect(lIndexExpression.data.constantValue).toBe(lVectorItemIndex);
        expect(lVariableExpression).toBeInstanceOf(VariableNameExpressionAst);
        expect(lVariableExpression.data.variableName).toBe(lVariableName);
    });

    await pContext.step('Matrix Indexing', async (pContext) => {
        await pContext.step('Vector Indexing', async () => {
            // Setup.
            const lMatrixItemIndex: number = 2;
            const lVariableName: string = 'numericMatrix';
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}(1, 2, 3, 4);
                    let numericVector: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = ${lVariableName}[${lMatrixItemIndex}];
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of child node.
            const lExpressionNode: IndexedValueExpressionAst = lVariableDeclarationNode.data.expression as IndexedValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(IndexedValueExpressionAst);

            const lIndexExpression: LiteralValueExpressionAst = lExpressionNode.data.index as LiteralValueExpressionAst;
            const lVariableExpression: VariableNameExpressionAst = lExpressionNode.data.value as VariableNameExpressionAst;

            // Evaluation. Correct types.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(2);
            expect(lResultType.innerType).toBeInstanceOf(PgslNumericType);

            // Evaluation. Correct structure.
            expect(lIndexExpression).toBeInstanceOf(LiteralValueExpressionAst);
            expect(lIndexExpression.data.constantValue).toBe(lMatrixItemIndex);
            expect(lVariableExpression).toBeInstanceOf(VariableNameExpressionAst);
            expect(lVariableExpression.data.variableName).toBe(lVariableName);
        });
        await pContext.step('Scalar Indexing', async () => {
            // Setup.
            const lMatrixItemIndex: number = 2;
            const lVectorItemIndex: number = 1;
            const lVariableName: string = 'numericMatrix';
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}(1, 2, 3, 4);
                    let numeric: ${PgslNumericType.typeName.float32} = ${lVariableName}[${lMatrixItemIndex}][${lVectorItemIndex}];
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of child node.
            const lExpressionNode: IndexedValueExpressionAst = lVariableDeclarationNode.data.expression as IndexedValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(IndexedValueExpressionAst);

            const lIndexExpression: LiteralValueExpressionAst = lExpressionNode.data.index as LiteralValueExpressionAst;
            const lInnerIndexedValueExpression: IndexedValueExpressionAst = lExpressionNode.data.value as IndexedValueExpressionAst;
            const lVariableExpression: VariableNameExpressionAst = lInnerIndexedValueExpression.data.value as VariableNameExpressionAst;


            // Evaluation. Correct types.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);

            // Evaluation. Correct structure.
            expect(lIndexExpression).toBeInstanceOf(LiteralValueExpressionAst);
            expect(lIndexExpression.data.constantValue).toBe(lVectorItemIndex);
            expect(lVariableExpression).toBeInstanceOf(VariableNameExpressionAst);
            expect(lVariableExpression.data.variableName).toBe(lVariableName);
        });
    });
});

Deno.test('IndexedValueExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Array Indexing', async () => {
        // Setup.
        const lArrayIndex: number = 2;
        const lVariableName: string = 'numericArray';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 5> = new ${PgslArrayType.typeName.array}(1, 2, 3, 4, 5);
                let arrayItem: ${PgslNumericType.typeName.float32} = ${lVariableName}[${lArrayIndex}];
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses the aliased type.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:array<f32,5>=array(1,2,3,4,5);` +
            `let arrayItem:f32=${lVariableName}[${lArrayIndex}];` +
            `}`
        );
    });

    await pContext.step('Vector Indexing', async () => {
        // Setup.
        const lVectorItemIndex: number = 2;
        const lVariableName: string = 'numericVector';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1, 2, 3);
                let vectorItem: ${PgslNumericType.typeName.float32} = ${lVariableName}[${lVectorItemIndex}];
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses the aliased type.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:vec3<f32>=vec3(1,2,3);` +
            `let vectorItem:f32=${lVariableName}[${lVectorItemIndex}];` +
            `}`
        );
    });

    await pContext.step('Matrix Indexing', async () => {
        // Setup.
        const lMatrixItemIndex: number = 2;
        const lVariableName: string = 'numericMatrix';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}(1, 2, 3, 4);
                let numericVector: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = ${lVariableName}[${lMatrixItemIndex}];
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses the aliased type.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:mat2x2<f32>=mat2x2(1,2,3,4);` +
            `let numericVector:vec2<f32>=${lVariableName}[${lMatrixItemIndex}];` +
            `}`
        );
    });
});

Deno.test('IndexedValueExpressionAst - Error', async (pContext) => {
    await pContext.step('Non-indexable type', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let wrongType: ${PgslNumericType.typeName.float32} = 5.0;
                let numericVector: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = wrongType[2];
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention duplicate alias.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Value of index expression needs to be a indexable composite value.`)
        )).toBe(true);
    });

    await pContext.step('Non-unsigned integer index', async () => {
        const lCodeText: string = `
            function testFunction(): void {
                let numericArray: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 5> = new ${PgslArrayType.typeName.array}(1, 2, 3, 4, 5);
                let arrayItem: ${PgslNumericType.typeName.float32} = numericArray[-1];
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention duplicate alias.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Index needs to be a unsigned numeric value.`)
        )).toBe(true);
    });
});