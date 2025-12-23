import { expect } from '@kartoffelgames/core-test';
import { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from "../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts";
import { DocumentAst } from "../../../source/abstract_syntax_tree/document-ast.ts";
import { VariableNameExpressionAst } from "../../../source/abstract_syntax_tree/expression/storage/variable-name-expression-ast.ts";
import { VariableDeclarationStatementAst } from "../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts";
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import { PgslParserResult } from "../../../source/parser_result/pgsl-parser-result.ts";
import { PgslBooleanType } from '../../../source/type/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../../source/type/pgsl-numeric-type.ts';
import { WgslTranspiler } from "../../../source/transpilation/wgsl/wgsl-transpiler.ts";
import { AttributeListAst } from "../../../source/abstract_syntax_tree/general/attribute-list-ast.ts";

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('VariableNameExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Variable References', async (pContext) => {
        await pContext.step('Let variable', () => {
            // Setup.
            const lVariableName: string = 'testLetVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: VariableNameExpressionAst = lVariableDeclarationNode.data.expression as VariableNameExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(VariableNameExpressionAst);

            // Evaluation. Correct variable name.
            expect(lExpressionNode.data.variableName).toBe(lVariableName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);

            // Evaluation. Is storage value.
            expect(lExpressionNode.data.isStorage).toBe(true);
        });

        await pContext.step('Function const variable', () => {
            // Setup.
            const lVariableName: string = 'testConstVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    const ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: VariableNameExpressionAst = lVariableDeclarationNode.data.expression as VariableNameExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(VariableNameExpressionAst);

            // Evaluation. Correct variable name.
            expect(lExpressionNode.data.variableName).toBe(lVariableName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Module const variable', () => {
            // Setup.
            const lVariableName: string = 'moduleVariable';
            const lCodeText: string = `
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                function testFunction(): void {
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: VariableNameExpressionAst = lVariableDeclarationNode.data.expression as VariableNameExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(VariableNameExpressionAst);

            // Evaluation. Correct variable name.
            expect(lExpressionNode.data.variableName).toBe(lVariableName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Parameter variable', () => {
            // Setup.
            const lParameterName: string = 'testParameter';
            const lCodeText: string = `
                function testFunction(${lParameterName}: ${PgslNumericType.typeName.float32}): void {
                    let testResult: ${PgslNumericType.typeName.float32} = ${lParameterName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: VariableNameExpressionAst = lVariableDeclarationNode.data.expression as VariableNameExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(VariableNameExpressionAst);

            // Evaluation. Correct variable name.
            expect(lExpressionNode.data.variableName).toBe(lParameterName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Uniform variable', () => {
            // Setup.
            const lVariableName: string = 'uniformVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: VariableNameExpressionAst = lVariableDeclarationNode.data.expression as VariableNameExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(VariableNameExpressionAst);

            // Evaluation. Correct variable name.
            expect(lExpressionNode.data.variableName).toBe(lVariableName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });
    });
});

Deno.test('VariableNameExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Variable References', async (pContext) => {
        await pContext.step('Let variable', () => {
            // Setup.
            const lVariableName: string = 'testLetVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let ${lVariableName}:f32=5.0;` +
                `let testResult:f32=${lVariableName};` +
                `}`
            );
        });

        await pContext.step('Function const variable', () => {
            // Setup.
            const lVariableName: string = 'testConstVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    const ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `const ${lVariableName}:f32=5.0;` +
                `let testResult:f32=${lVariableName};` +
                `}`
            );
        });

        await pContext.step('Module const variable', () => {
            // Setup.
            const lVariableName: string = 'moduleVariable';
            const lCodeText: string = `
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                function testFunction(): void {
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `const ${lVariableName}:f32=5.0;` +
                `fn testFunction(){` +
                `let testResult:f32=${lVariableName};` +
                `}`
            );
        });

        await pContext.step('Parameter variable', () => {
            // Setup.
            const lParameterName: string = 'testParameter';
            const lCodeText: string = `
                function testFunction(${lParameterName}: ${PgslNumericType.typeName.float32}): void {
                    let testResult: ${PgslNumericType.typeName.float32} = ${lParameterName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(${lParameterName}:f32){` +
                `let testResult:f32=${lParameterName};` +
                `}`
            );
        });

        await pContext.step('Uniform variable', () => {
            // Setup.
            const lVariableName: string = 'uniformVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};

                function testFunction(): void {
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:f32;` +
                `fn testFunction(){` +
                `let testResult:f32=${lVariableName};` +
                `}`
            );
        });
    });
});

Deno.test('VariableNameExpressionAst - Error', async (pContext) => {
    await pContext.step('Undefined variable', () => {
        // Setup.
        const lVariableName: string = 'undefinedVariable';
        const lCodeText: string = `
            function testFunction(): void {
                let testResult: ${PgslBooleanType.typeName.boolean} = ${lVariableName};
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention undefined variable.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Variable "${lVariableName}" not defined`)
        )).toBe(true);
    });

    await pContext.step('Undefined enum', () => {
        // Setup.
        const lEnumName: string = 'UndefinedEnum';
        const lCodeText: string = `
            function testFunction(): void {
                let testResult: ${PgslBooleanType.typeName.boolean} = ${lEnumName}.value;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention undefined enum.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`"${lEnumName}" not defined`) ||
            pIncident.message.includes(`Enum "${lEnumName}" not defined`)
        )).toBe(true);
    });

    await pContext.step('Using enum without decomposition', () => {
        // Setup.
        const lEnumName: string = 'TestEnum';
        const lCodeText: string = `
            enum ${lEnumName} {
                valueOne = 1u,
                valueTwo = 2u
            }
            function testFunction(): void {
                let testResult: ${PgslBooleanType.typeName.boolean} = ${lEnumName};
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention enum must be decomposed.
        expect(lTranspilationResult.incidents.some(pIncident =>
            // As for now, there is no specific error message for this case.
            pIncident.message.includes(`Expression values type can't be converted to variables type.`)
        )).toBe(true);
    });
});
