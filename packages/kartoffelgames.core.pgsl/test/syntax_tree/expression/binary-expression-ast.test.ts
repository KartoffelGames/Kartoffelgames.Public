import { expect } from '@kartoffelgames/core-test';
import { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from "../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts";
import { DocumentAst } from "../../../source/abstract_syntax_tree/document-ast.ts";
import { BinaryExpressionAst } from "../../../source/abstract_syntax_tree/expression/operation/binary-expression-ast.ts";
import { LiteralValueExpressionAst } from "../../../source/abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts";
import { VariableDeclarationStatementAst } from "../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts";
import { PgslOperator } from "../../../source/enum/pgsl-operator.enum.ts";
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import { PgslParserResult } from "../../../source/parser_result/pgsl-parser-result.ts";
import { PgslNumericType } from '../../../source/type/pgsl-numeric-type.ts';
import { PgslVectorType } from "../../../source/type/pgsl-vector-type.ts";
import { WgslTranspiler } from "../../../source/transpilation/wgsl/wgsl-transpiler.ts";

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('BinaryExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Bitwise Operations', async (pContext) => {
        await pContext.step('Binary OR', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} | ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.BinaryOr);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);

            // Evaluation. Correct left and right expressions.
            const lLeftExpression: LiteralValueExpressionAst = lExpressionNode.data.leftExpression as LiteralValueExpressionAst;
            const lRightExpression: LiteralValueExpressionAst = lExpressionNode.data.rightExpression as LiteralValueExpressionAst;
            expect(lLeftExpression).toBeInstanceOf(LiteralValueExpressionAst);
            expect(lLeftExpression.data.constantValue).toBe(lLeftValue);
            expect(lRightExpression).toBeInstanceOf(LiteralValueExpressionAst);
            expect(lRightExpression.data.constantValue).toBe(lRightValue);
        });

        await pContext.step('Binary AND', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} & ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.BinaryAnd);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);
        });

        await pContext.step('Binary XOR', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} ^ ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.BinaryXor);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);
        });
    });

    await pContext.step('Shift Operations', async (pContext) => {
        await pContext.step('Shift left', () => {
            // Setup.
            const lVariableName: string = 'shiftVariable';
            const lShiftAmount: number = 2;
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 5;
                    let result: ${PgslNumericType.typeName.signedInteger} = ${lVariableName} << ${lShiftAmount};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct expression type.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.ShiftLeft);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Shift right', () => {
            // Setup.
            const lVariableName: string = 'shiftVariable';
            const lShiftAmount: number = 2;
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 20u;
                    let result: ${PgslNumericType.typeName.unsignedInteger} = ${lVariableName} >> ${lShiftAmount}u;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct expression type.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.ShiftRight);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
        });
    });

    await pContext.step('Vector Binary Operations', async (pContext) => {
        await pContext.step('Vector binary OR', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(5, 3, 7);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(2, 6, 4);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = vectorOne | vectorTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.BinaryOr);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
            expect(lResultType.innerType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Vector binary AND', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(5, 3, 7);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(2, 6, 4);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = vectorOne & vectorTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.BinaryAnd);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
        });
    });
});

Deno.test('BinaryExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Bitwise Operations', async (pContext) => {
        await pContext.step('Binary OR', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} | ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:i32=${lLeftValue}|${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Binary AND', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} & ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:i32=${lLeftValue}&${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Binary XOR', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} ^ ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:i32=${lLeftValue}^${lRightValue};` +
                `}`
            );
        });
    });

    await pContext.step('Shift Operations', async (pContext) => {
        await pContext.step('Shift left', () => {
            // Setup.
            const lVariableName: string = 'shiftVariable';
            const lShiftAmount: number = 2;
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 5;
                    let result: ${PgslNumericType.typeName.signedInteger} = ${lVariableName} << ${lShiftAmount};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let ${lVariableName}:i32=5;` +
                `let result:i32=${lVariableName}<<${lShiftAmount};` +
                `}`
            );
        });

        await pContext.step('Shift right', () => {
            // Setup.
            const lVariableName: string = 'shiftVariable';
            const lShiftAmount: number = 2;
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 20u;
                    let result: ${PgslNumericType.typeName.unsignedInteger} = ${lVariableName} >> ${lShiftAmount}u;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let ${lVariableName}:u32=20u;` +
                `let result:u32=${lVariableName}>>${lShiftAmount}u;` +
                `}`
            );
        });
    });

    await pContext.step('Vector Binary Operations', async (pContext) => {
        await pContext.step('Vector binary OR', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(5, 3, 7);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(2, 6, 4);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = vectorOne | vectorTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let vectorOne:vec3<i32>=vec3(5,3,7);` +
                `let vectorTwo:vec3<i32>=vec3(2,6,4);` +
                `let testVariable:vec3<i32>=vectorOne|vectorTwo;` +
                `}`
            );
        });

        await pContext.step('Vector binary AND', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(5, 3, 7);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(2, 6, 4);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = vectorOne & vectorTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let vectorOne:vec3<i32>=vec3(5,3,7);` +
                `let vectorTwo:vec3<i32>=vec3(2,6,4);` +
                `let testVariable:vec3<i32>=vectorOne&vectorTwo;` +
                `}`
            );
        });
    });
});

Deno.test('BinaryExpressionAst - Error', async (pContext) => {
    await pContext.step('Non-integer types in binary operations', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let floatOne: ${PgslNumericType.typeName.float32} = 5.0;
                let floatTwo: ${PgslNumericType.typeName.float32} = 3.0;
                let testVariable: ${PgslNumericType.typeName.float32} = floatOne | floatTwo;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention integer types requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Binary operations can only be applied to integer types')
        )).toBe(true);
    });

    await pContext.step('Vector dimension mismatch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let vectorTwo: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector2}(5, 3);
                let vectorThree: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(2, 6, 4);
                let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = vectorTwo | vectorThree;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention vector size mismatch.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Left and right side of bit expression must be of the same vector size')
        )).toBe(true);
    });

    await pContext.step('Non-variable in shift left expression', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.signedInteger} = 5 << 2;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention variable requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Left expression of a shift operation must be a variable that can store a value')
        )).toBe(true);
    });

    await pContext.step('Non-unsigned integer in shift right expression', () => {
        // Setup.
        const lVariableName: string = 'shiftVariable';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 20;
                let result: ${PgslNumericType.typeName.signedInteger} = ${lVariableName} >> -2;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention unsigned integer requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Right expression of a shift operation must be an unsigned integer type')
        )).toBe(true);
    });
});
