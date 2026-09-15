import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { FunctionCallExpressionAst } from '../../../source/abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts';
import { LiteralValueExpressionAst } from '../../../source/abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts';
import { IndexedValueExpressionAst } from '../../../source/abstract_syntax_tree/expression/storage/indexed-value-expression-ast.ts';
import { ValueDecompositionExpressionAst } from '../../../source/abstract_syntax_tree/expression/storage/value-decomposition-expression-ast.ts';
import { VariableNameExpressionAst } from '../../../source/abstract_syntax_tree/expression/storage/variable-name-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslArrayType } from '../../../source/abstract_syntax_tree/type/pgsl-array-type.ts';
import { PgslMatrixType } from '../../../source/abstract_syntax_tree/type/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/pgsl-vector-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

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

    await pContext.step('Indexing a chained value', async (pContext) => {
        await pContext.step('After a property access', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lPropertyName: string = 'propertyOne';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lPropertyName}: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                function testFunction(): void {
                    let testStruct: ${lStructName};
                    let testVariable: ${PgslNumericType.typeName.float32} = testStruct.${lPropertyName}[0];
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Index wraps the property access, not the other way around.
            const lExpressionNode: IndexedValueExpressionAst = lVariableDeclarationNode.data.expression as IndexedValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(IndexedValueExpressionAst);

            const lDecompositionExpression: ValueDecompositionExpressionAst = lExpressionNode.data.value as ValueDecompositionExpressionAst;
            expect(lDecompositionExpression).toBeInstanceOf(ValueDecompositionExpressionAst);
            expect(lDecompositionExpression.data.property).toBe(lPropertyName);
            expect(lDecompositionExpression.data.value).toBeInstanceOf(VariableNameExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('After a nested property access', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lNestedStructName: string = 'NestedStruct';
            const lPropertyName: string = 'propertyOne';
            const lNestedPropertyName: string = 'nestedProperty';
            const lCodeText: string = `
                struct ${lNestedStructName} {
                    ${lNestedPropertyName}: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct ${lStructName} {
                    ${lPropertyName}: ${lNestedStructName}
                }
                function testFunction(): void {
                    let testStruct: ${lStructName};
                    let testVariable: ${PgslNumericType.typeName.float32} = testStruct.${lPropertyName}.${lNestedPropertyName}[0];
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[2] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Suffixes nest left to right: ((testStruct.propertyOne).nestedProperty)[0].
            const lExpressionNode: IndexedValueExpressionAst = lVariableDeclarationNode.data.expression as IndexedValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(IndexedValueExpressionAst);

            const lNestedDecomposition: ValueDecompositionExpressionAst = lExpressionNode.data.value as ValueDecompositionExpressionAst;
            expect(lNestedDecomposition).toBeInstanceOf(ValueDecompositionExpressionAst);
            expect(lNestedDecomposition.data.property).toBe(lNestedPropertyName);

            const lOuterDecomposition: ValueDecompositionExpressionAst = lNestedDecomposition.data.value as ValueDecompositionExpressionAst;
            expect(lOuterDecomposition).toBeInstanceOf(ValueDecompositionExpressionAst);
            expect(lOuterDecomposition.data.property).toBe(lPropertyName);
            expect(lOuterDecomposition.data.value).toBeInstanceOf(VariableNameExpressionAst);
        });

        await pContext.step('After a function call', () => {
            // Setup.
            const lFunctionName: string = 'createVector';
            const lCodeText: string = `
                function ${lFunctionName}(): ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> {
                    return new ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>(1, 2, 3, 4);
                }
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lFunctionName}()[0];
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. A call result can be indexed directly.
            const lExpressionNode: IndexedValueExpressionAst = lVariableDeclarationNode.data.expression as IndexedValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(IndexedValueExpressionAst);

            const lCallExpression: FunctionCallExpressionAst = lExpressionNode.data.value as FunctionCallExpressionAst;
            expect(lCallExpression).toBeInstanceOf(FunctionCallExpressionAst);
            expect(lCallExpression.data.name).toBe(lFunctionName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
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
            `var ${lVariableName}:array<f32,5>=array(1,2,3,4,5);` +
            `var arrayItem:f32=${lVariableName}[${lArrayIndex}];` +
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
            `var ${lVariableName}:vec3<f32>=vec3(1,2,3);` +
            `var vectorItem:f32=${lVariableName}[${lVectorItemIndex}];` +
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
            `var ${lVariableName}:mat2x2<f32>=mat2x2(1,2,3,4);` +
            `var numericVector:vec2<f32>=${lVariableName}[${lMatrixItemIndex}];` +
            `}`
        );
    });

    await pContext.step('Indexing a chained value', async () => {
        // Setup.
        const lStructName: string = 'TestStruct';
        const lPropertyName: string = 'propertyOne';
        const lFunctionName: string = 'createVector';
        const lCodeText: string = `
            struct ${lStructName} {
                ${lPropertyName}: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
            }
            function ${lFunctionName}(): ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> {
                return new ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>(1, 2, 3, 4);
            }
            function testFunction(): void {
                let testStruct: ${lStructName};
                let afterProperty: ${PgslNumericType.typeName.float32} = testStruct.${lPropertyName}[0];
                let afterCall: ${PgslNumericType.typeName.float32} = ${lFunctionName}()[0];
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Chains are emitted in source order.
        expect(lTranspilationResult.source).toBe(
            `struct ${lStructName}{${lPropertyName}:vec4<f32>}` +
            `fn ${lFunctionName}()->vec4<f32>{return vec4<f32>(1,2,3,4);}` +
            `fn testFunction(){` +
            `var testStruct:${lStructName};` +
            `var afterProperty:f32=testStruct.${lPropertyName}[0];` +
            `var afterCall:f32=${lFunctionName}()[0];` +
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