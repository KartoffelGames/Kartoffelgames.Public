import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { UnaryExpressionAst } from '../../../source/abstract_syntax_tree/expression/unary/unary-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslBooleanType } from '../../../source/abstract_syntax_tree/type/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/pgsl-vector-type.ts';
import { PgslOperator } from '../../../source/enum/pgsl-operator.enum.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('UnaryExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Bitwise Operations', async (pContext) => {
        await pContext.step('Binary negation', () => {
            // Setup.
            const lValue: number = 5;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ~${lValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: UnaryExpressionAst = lVariableDeclarationNode.data.expression as UnaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(UnaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.BinaryNegate);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });
    });

    await pContext.step('Arithmetic Operations', async (pContext) => {
        await pContext.step('Negation integer', () => {
            // Setup.
            const lValue: number = 5;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = -${lValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: UnaryExpressionAst = lVariableDeclarationNode.data.expression as UnaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(UnaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Minus);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Negation float', () => {
            // Setup.
            const lValue: number = 5.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = -${lValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: UnaryExpressionAst = lVariableDeclarationNode.data.expression as UnaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(UnaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Minus);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Negation vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>(1.0, 2.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = -testVector;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: UnaryExpressionAst = lVariableDeclarationNode.data.expression as UnaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(UnaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Minus);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslVectorType);
        });
    });

    await pContext.step('Logical Operations', async (pContext) => {
        await pContext.step('Boolean negation', () => {
            // Setup.
            const lValue: boolean = true;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslBooleanType.typeName.boolean} = !${lValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: UnaryExpressionAst = lVariableDeclarationNode.data.expression as UnaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(UnaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Not);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslBooleanType);
        });
    });
});

Deno.test('UnaryExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Bitwise Operations', async (pContext) => {
        await pContext.step('Binary negation', () => {
            // Setup.
            const lValue: number = 5;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ~${lValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:i32=~${lValue};` +
                `}`
            );
        });
    });

    await pContext.step('Arithmetic Operations', async (pContext) => {
        await pContext.step('Negation integer', () => {
            // Setup.
            const lValue: number = 5;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = -${lValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:i32=-${lValue};` +
                `}`
            );
        });

        await pContext.step('Negation float', () => {
            // Setup.
            const lValue: number = 5.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = -${lValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:f32=-${lValue};` +
                `}`
            );
        });

        await pContext.step('Negation vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = -testVector;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVector:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `let testVariable:vec3<f32>=-testVector;` +
                `}`
            );
        });
    });

    await pContext.step('Logical Operations', async (pContext) => {
        await pContext.step('Boolean negation', () => {
            // Setup.
            const lValue: boolean = true;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslBooleanType.typeName.boolean} = !${lValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:bool=!${lValue};` +
                `}`
            );
        });
    });
});

Deno.test('UnaryExpressionAst - Error', async (pContext) => {
    await pContext.step('Non-numeric type for binary negation', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float32} = ~5.0;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention invalid type.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Binary negation only valid for numeric type`)
        )).toBe(true);
    });

    await pContext.step('Non-numeric type for arithmetic negation', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslBooleanType.typeName.boolean} = -true;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention invalid type.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Negation only valid for numeric or vector type.`)
        )).toBe(true);
    });

    await pContext.step('Non-boolean type for boolean negation', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.signedInteger} = !5;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention invalid type.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Boolean negation only valid for boolean type`)
        )).toBe(true);
    });
});
