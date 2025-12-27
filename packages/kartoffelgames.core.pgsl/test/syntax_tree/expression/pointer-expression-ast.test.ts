import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { PointerExpressionAst } from '../../../source/abstract_syntax_tree/expression/storage/pointer-expression-ast.ts';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PointerExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Pointer type', async (pContext) => {
        await pContext.step('Function address space', () => {
            // Setup.
            const lVariableName: string = 'testValue';
            const lCodeText: string = `
                function testFunction(pPointer: *${PgslNumericType.typeName.float32}): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.float32} = *pPointer;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: PointerExpressionAst = lVariableDeclarationNode.data.expression as PointerExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(PointerExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);

            // Evaluation. Is storage value.
            expect(lExpressionNode.data.isStorage).toBe(true);
        });

        await pContext.step('Module address space', () => {
            // Setup.
            const lVariableName: string = 'moduleVariable';
            const lCodeText: string = `
                private ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let lPointer: *${PgslNumericType.typeName.float32} = &${lVariableName};
                    let testValue: ${PgslNumericType.typeName.float32} = *lPointer;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: PointerExpressionAst = lVariableDeclarationNode.data.expression as PointerExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(PointerExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Workgroup address space', () => {
            // Setup.
            const lVariableName: string = 'workgroupVariable';
            const lCodeText: string = `
                workgroup ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let lPointer: *${PgslNumericType.typeName.float32} = &${lVariableName};
                    let testValue: ${PgslNumericType.typeName.float32} = *lPointer;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: PointerExpressionAst = lVariableDeclarationNode.data.expression as PointerExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(PointerExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Uniform address space', () => {
            // Setup.
            const lVariableName: string = 'uniformVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let lPointer: *${PgslNumericType.typeName.float32} = &${lVariableName};
                    let testValue: ${PgslNumericType.typeName.float32} = *lPointer;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: PointerExpressionAst = lVariableDeclarationNode.data.expression as PointerExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(PointerExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Storage address space', () => {
            // Setup.
            const lVariableName: string = 'storageVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let lPointer: *${PgslNumericType.typeName.float32} = &${lVariableName};
                    let testValue: ${PgslNumericType.typeName.float32} = *lPointer;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: PointerExpressionAst = lVariableDeclarationNode.data.expression as PointerExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(PointerExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });
    });
});

Deno.test('PointerExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Pointer type', async (pContext) => {
        await pContext.step('Function address space', () => {
            // Setup.
            const lVariableName: string = 'testValue';
            const lCodeText: string = `
                function testFunction(pPointer: *${PgslNumericType.typeName.float32}): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.float32} = *pPointer;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(pPointer:ptr<function,f32>){` +
                `let ${lVariableName}:f32=*pPointer;` +
                `}`
            );
        });

        await pContext.step('Module address space', () => {
            // Setup.
            const lVariableName: string = 'moduleVariable';
            const lCodeText: string = `
                private ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let lPointer: *${PgslNumericType.typeName.float32} = &${lVariableName};
                    let testValue: ${PgslNumericType.typeName.float32} = *lPointer;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `var<private> ${lVariableName}:f32;` +
                `fn testFunction(){` +
                `let lPointer:ptr<private,f32>=&${lVariableName};` +
                `let testValue:f32=*lPointer;` +
                `}`
            );
        });

        await pContext.step('Workgroup address space', () => {
            // Setup.
            const lVariableName: string = 'workgroupVariable';
            const lCodeText: string = `
                workgroup ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let lPointer: *${PgslNumericType.typeName.float32} = &${lVariableName};
                    let testValue: ${PgslNumericType.typeName.float32} = *lPointer;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `var<workgroup> ${lVariableName}:f32;` +
                `fn testFunction(){` +
                `let lPointer:ptr<workgroup,f32>=&${lVariableName};` +
                `let testValue:f32=*lPointer;` +
                `}`
            );
        });

        await pContext.step('Uniform address space', () => {
            // Setup.
            const lVariableName: string = 'uniformVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let lPointer: *${PgslNumericType.typeName.float32} = &${lVariableName};
                    let testValue: ${PgslNumericType.typeName.float32} = *lPointer;
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
                `let lPointer:ptr<uniform,f32>=&${lVariableName};` +
                `let testValue:f32=*lPointer;` +
                `}`
            );
        });

        await pContext.step('Storage address space', () => {
            // Setup.
            const lVariableName: string = 'storageVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let lPointer: *${PgslNumericType.typeName.float32} = &${lVariableName};
                    let testValue: ${PgslNumericType.typeName.float32} = *lPointer;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<storage,read> ${lVariableName}:f32;` +
                `fn testFunction(){` +
                `let lPointer:ptr<storage,f32>=&${lVariableName};` +
                `let testValue:f32=*lPointer;` +
                `}`
            );
        });
    });
});

Deno.test('PointerExpressionAst - Error', async (pContext) => {
    await pContext.step('Non-pointer type expression', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.float32} = 5.0;
                let testResult: ${PgslNumericType.typeName.float32} = *testValue;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention non-pointer type.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Pointer of expression needs to be a pointer type`)
        )).toBe(true);
    });
});
