import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { AddressOfExpressionAst } from '../../../source/abstract_syntax_tree/expression/single_value/address-of-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslArrayType } from '../../../source/abstract_syntax_tree/type/pgsl-array-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslPointerType } from '../../../source/abstract_syntax_tree/type/pgsl-pointer-type.ts';
import { PgslSamplerType } from '../../../source/abstract_syntax_tree/type/pgsl-sampler-type.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('AddressOfExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Variable Address', async (pContext) => {
        await pContext.step('Simple variable address', () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: AddressOfExpressionAst = lVariableDeclarationNode.data.expression as AddressOfExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(AddressOfExpressionAst);

            // Evaluation. Correct result type.
            const lResultType: PgslPointerType = lExpressionNode.data.resolveType as PgslPointerType;
            expect(lResultType).toBeInstanceOf(PgslPointerType);
            expect(lResultType.referencedType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Struct property address', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lPropertyName: string = 'propertyOne';
            const lVariableName: string = 'structVariable';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lPropertyName}: ${PgslNumericType.typeName.float32}
                }
                function testFunction(): void {
                    let ${lVariableName}: ${lStructName} = new ${lStructName}();
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName}.${lPropertyName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: AddressOfExpressionAst = lVariableDeclarationNode.data.expression as AddressOfExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(AddressOfExpressionAst);

            // Evaluation. Correct result type.
            const lResultType: PgslPointerType = lExpressionNode.data.resolveType as PgslPointerType;
            expect(lResultType).toBeInstanceOf(PgslPointerType);
        });

        await pContext.step('Array element address', () => {
            // Setup.
            const lArrayName: string = 'arrayVariable';
            const lArrayIndex: number = 2;
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lArrayName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 5> = new ${PgslArrayType.typeName.array}(1.0, 2.0, 3.0, 4.0, 5.0);
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lArrayName}[${lArrayIndex}];
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: AddressOfExpressionAst = lVariableDeclarationNode.data.expression as AddressOfExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(AddressOfExpressionAst);

            // Evaluation. Correct result type.
            const lResultType: PgslPointerType = lExpressionNode.data.resolveType as PgslPointerType;
            expect(lResultType).toBeInstanceOf(PgslPointerType);
            expect(lResultType.referencedType).toBeInstanceOf(PgslNumericType);
        });
    });

    await pContext.step('Address Space Variations', async (pContext) => {
        await pContext.step('Function address space', () => {
            // Setup.
            const lVariableName: string = 'functionVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: AddressOfExpressionAst = lVariableDeclarationNode.data.expression as AddressOfExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(AddressOfExpressionAst);

            // Evaluation. Correct result type.
            const lResultType: PgslPointerType = lExpressionNode.data.resolveType as PgslPointerType;
            expect(lResultType).toBeInstanceOf(PgslPointerType);
        });

        await pContext.step('Private address space', () => {
            // Setup.
            const lVariableName: string = 'privateVariable';
            const lCodeText: string = `
                private ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: AddressOfExpressionAst = lVariableDeclarationNode.data.expression as AddressOfExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(AddressOfExpressionAst);

            // Evaluation. Correct result type.
            const lResultType: PgslPointerType = lExpressionNode.data.resolveType as PgslPointerType;
            expect(lResultType).toBeInstanceOf(PgslPointerType);
        });

        await pContext.step('Storage address space', () => {
            // Setup.
            const lVariableName: string = 'storageVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: AddressOfExpressionAst = lVariableDeclarationNode.data.expression as AddressOfExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(AddressOfExpressionAst);

            // Evaluation. Correct result type.
            const lResultType: PgslPointerType = lExpressionNode.data.resolveType as PgslPointerType;
            expect(lResultType).toBeInstanceOf(PgslPointerType);
        });
    });
});

Deno.test('AddressOfExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Variable Address', async (pContext) => {
        await pContext.step('Simple variable address', () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName};
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
                `let pointerVariable:ptr<function,f32>=&${lVariableName};` +
                `}`
            );
        });

        await pContext.step('Struct property address', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lPropertyName: string = 'propertyOne';
            const lVariableName: string = 'structVariable';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lPropertyName}: ${PgslNumericType.typeName.float32}
                }
                function testFunction(): void {
                    let ${lVariableName}: ${lStructName};
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName}.${lPropertyName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lStructName}{` +
                `${lPropertyName}:f32` +
                `}` +
                `fn testFunction(){` +
                `let ${lVariableName}:${lStructName};` +
                `let pointerVariable:ptr<function,f32>=&${lVariableName}.${lPropertyName};` +
                `}`
            );
        });

        await pContext.step('Array element address', () => {
            // Setup.
            const lArrayName: string = 'arrayVariable';
            const lArrayIndex: number = 2;
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lArrayName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 5> = new ${PgslArrayType.typeName.array}(1.0, 2.0, 3.0, 4.0, 5.0);
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lArrayName}[${lArrayIndex}];
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let ${lArrayName}:array<f32,5>=array(1.0,2.0,3.0,4.0,5.0);` +
                `let pointerVariable:ptr<function,f32>=&${lArrayName}[${lArrayIndex}];` +
                `}`
            );
        });
    });

    await pContext.step('Address Space Variations', async (pContext) => {
        await pContext.step('Function address space', () => {
            // Setup.
            const lVariableName: string = 'functionVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName};
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
                `let pointerVariable:ptr<function,f32>=&${lVariableName};` +
                `}`
            );
        });

        await pContext.step('Private address space', () => {
            // Setup.
            const lVariableName: string = 'privateVariable';
            const lCodeText: string = `
                private ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName};
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
                `let pointerVariable:ptr<private,f32>=&${lVariableName};` +
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
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &${lVariableName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)`+
                `var<storage,read> ${lVariableName}:f32;` +
                `fn testFunction(){` +
                `let pointerVariable:ptr<storage,f32>=&${lVariableName};` +
                `}`
            );
        });
    });
});

Deno.test('AddressOfExpressionAst - Error', async (pContext) => {
    await pContext.step('Non-storage value target', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let pointerVariable: *${PgslNumericType.typeName.float32} = &5.0;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention stored value requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Target of address needs to a stored value')
        )).toBe(true);
    });

    await pContext.step('Non-storable type target', () => {
        // Setup.
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
            uniform textureVariable: ${PgslSamplerType.typeName.sampler};
            function testFunction(): void {
                let pointerVariable: *${PgslSamplerType.typeName.sampler} = &textureVariable;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention storable requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Target of address needs to storable')
        )).toBe(true);
    });
});
