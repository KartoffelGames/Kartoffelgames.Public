import { expect } from '@kartoffelgames/core-test';
import { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from "../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts";
import { DocumentAst } from "../../../source/abstract_syntax_tree/document-ast.ts";
import { ComparisonExpressionAst } from "../../../source/abstract_syntax_tree/expression/operation/comparison-expression-ast.ts";
import { LiteralValueExpressionAst } from "../../../source/abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts";
import { VariableDeclarationStatementAst } from "../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts";
import { PgslBooleanType } from "../../../source/abstract_syntax_tree/type/pgsl-boolean-type.ts";
import { PgslNumericType } from "../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { PgslVectorType } from "../../../source/abstract_syntax_tree/type/pgsl-vector-type.ts";
import { PgslOperator } from "../../../source/enum/pgsl-operator.enum.ts";
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import { PgslParserResult } from "../../../source/parser_result/pgsl-parser-result.ts";
import { WgslTranspiler } from "../../../source/transpilation/wgsl/wgsl-transpiler.ts";

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ComparisonExpressionAst - Parsing', async (pContext) => {
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
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Process. Assume correct parsing.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Equal);

                // Evaluation. Correct result type.
                const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
                expect(lResultType).toBeInstanceOf(PgslBooleanType);
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
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Process. Assume correct parsing.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Equal);

                // Evaluation. Correct result type with dimension.
                const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
                expect(lResultType).toBeInstanceOf(PgslVectorType);
                expect(lResultType.dimension).toBe(3);
                expect(lResultType.innerType).toBeInstanceOf(PgslBooleanType);
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
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Process. Assume correct parsing.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.NotEqual);

                // Evaluation. Correct result type.
                const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
                expect(lResultType).toBeInstanceOf(PgslBooleanType);

                // Evaluation. Correct left and right expressions.
                const lLeftExpression: LiteralValueExpressionAst = lExpressionNode.data.leftExpression as LiteralValueExpressionAst;
                const lRightExpression: LiteralValueExpressionAst = lExpressionNode.data.rightExpression as LiteralValueExpressionAst;
                expect(lLeftExpression).toBeInstanceOf(LiteralValueExpressionAst);
                expect(lLeftExpression.data.constantValue).toBe(lLeftValue);
                expect(lRightExpression).toBeInstanceOf(LiteralValueExpressionAst);
                expect(lRightExpression.data.constantValue).toBe(lRightValue);
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
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Process. Assume correct parsing.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.NotEqual);

                // Evaluation. Correct result type with dimension.
                const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
                expect(lResultType).toBeInstanceOf(PgslVectorType);
                expect(lResultType.dimension).toBe(3);
                expect(lResultType.innerType).toBeInstanceOf(PgslBooleanType);
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
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Process. Assume correct parsing.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.LowerThan);

                // Evaluation. Correct result type.
                const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
                expect(lResultType).toBeInstanceOf(PgslBooleanType);
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
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Process. Assume correct parsing.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct result type with dimension.
                const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
                expect(lResultType).toBeInstanceOf(PgslVectorType);
                expect(lResultType.dimension).toBe(3);
                expect(lResultType.innerType).toBeInstanceOf(PgslBooleanType);
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
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Process. Assume correct parsing.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.LowerThanEqual);

                // Evaluation. Correct result type.
                const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
                expect(lResultType).toBeInstanceOf(PgslBooleanType);
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
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Process. Assume correct parsing.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct result type with dimension.
                const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
                expect(lResultType).toBeInstanceOf(PgslVectorType);
                expect(lResultType.dimension).toBe(3);
                expect(lResultType.innerType).toBeInstanceOf(PgslBooleanType);
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
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Process. Assume correct parsing.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.GreaterThan);

                // Evaluation. Correct result type.
                const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
                expect(lResultType).toBeInstanceOf(PgslBooleanType);
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
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Process. Assume correct parsing.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct result type with dimension.
                const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
                expect(lResultType).toBeInstanceOf(PgslVectorType);
                expect(lResultType.dimension).toBe(3);
                expect(lResultType.innerType).toBeInstanceOf(PgslBooleanType);
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
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Process. Assume correct parsing.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.GreaterThanEqual);

                // Evaluation. Correct result type.
                const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
                expect(lResultType).toBeInstanceOf(PgslBooleanType);
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
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Process. Assume correct parsing.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct result type with dimension.
                const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
                expect(lResultType).toBeInstanceOf(PgslVectorType);
                expect(lResultType.dimension).toBe(3);
                expect(lResultType.innerType).toBeInstanceOf(PgslBooleanType);
            });
        });
    });
});

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
                    `let boolOne:bool=true;` +
                    `let boolTwo:bool=false;` +
                    `let testVariable:bool=boolOne==boolTwo;` +
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
                    `let vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                    `let vectorTwo:vec3<f32>=vec3(1.0,2.0,3.0);` +
                    `let testVariable:vec3<bool>=vectorOne==vectorTwo;` +
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
                    `let testVariable:bool=${lLeftValue}!=${lRightValue};` +
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
                    `let vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                    `let vectorTwo:vec3<f32>=vec3(4.0,5.0,6.0);` +
                    `let testVariable:vec3<bool>=vectorOne!=vectorTwo;` +
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
                    `let testVariable:bool=${lLeftValue}<${lRightValue};` +
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
                    `let vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                    `let vectorTwo:vec3<f32>=vec3(4.0,5.0,6.0);` +
                    `let testVariable:vec3<bool>=vectorOne<vectorTwo;` +
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
                    `let testVariable:bool=${lLeftValue}<=${lRightValue};` +
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
                    `let vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                    `let vectorTwo:vec3<f32>=vec3(4.0,5.0,6.0);` +
                    `let testVariable:vec3<bool>=vectorOne<=vectorTwo;` +
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
                    `let testVariable:bool=${lLeftValue}>${lRightValue};` +
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
                    `let vectorOne:vec3<f32>=vec3(4.0,5.0,6.0);` +
                    `let vectorTwo:vec3<f32>=vec3(1.0,2.0,3.0);` +
                    `let testVariable:vec3<bool>=vectorOne>vectorTwo;` +
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
                    `let testVariable:bool=${lLeftValue}>=${lRightValue};` +
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
                    `let vectorOne:vec3<f32>=vec3(4.0,5.0,6.0);` +
                    `let vectorTwo:vec3<f32>=vec3(1.0,2.0,3.0);` +
                    `let testVariable:vec3<bool>=vectorOne>=vectorTwo;` +
                    `}`
                );
            });
        });
    });
});

Deno.test('ComparisonExpressionAst - Error', async (pContext) => {
    await pContext.step('Type mismatch in comparison', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let floatValue: ${PgslNumericType.typeName.float32} = 5.0;
                let intValue: ${PgslNumericType.typeName.signedInteger} = 3;
                let testVariable: bool = floatValue == intValue;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention type requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Comparison can only be between values of the same type')
        )).toBe(true);
    });

    await pContext.step('Non-scalar type comparison', () => {
        // Setup.
        const lCodeText: string = `
            struct TestStruct {
                propertyOne: ${PgslNumericType.typeName.float32}
            }
            function testFunction(): void {
                let structOne: TestStruct = new TestStruct();
                let structTwo: TestStruct = new TestStruct();
                let testVariable: bool = structOne == structTwo;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention scalar values requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Comparison can only be between scalar values')
        )).toBe(true);
    });
});
