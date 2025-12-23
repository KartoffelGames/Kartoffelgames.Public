import { expect } from '@kartoffelgames/core-test';
import { EnumDeclarationAst } from "../../../source/abstract_syntax_tree/declaration/enum-declaration-ast.ts";
import { DocumentAst } from "../../../source/abstract_syntax_tree/document-ast.ts";
import { StringValueExpressionAst } from "../../../source/abstract_syntax_tree/expression/single_value/string-value-expression-ast.ts";
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import { PgslParserResult } from "../../../source/parser_result/pgsl-parser-result.ts";
import { WgslTranspiler } from "../../../source/transpilation/wgsl/wgsl-transpiler.ts";
import { PgslStringType } from '../../../source/type/pgsl-string-type.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('StringValueExpressionAst - Parsing', async (pContext) => {
    await pContext.step('String Literals', async (pContext) => {
        await pContext.step('Simple string', () => {
            // Setup.
            const lStringValue: string = 'TestString';
            const lValueName: string = 'FirstValue';
            const lCodeText: string = `
                enum TestEnum {
                    ${lValueName} = "${lStringValue}"
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lVariableNode: EnumDeclarationAst = lDocument.data.content[0] as EnumDeclarationAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: StringValueExpressionAst = lVariableNode.data.values.get(lValueName) as StringValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(StringValueExpressionAst);

            // Evaluation. Correct string value.
            expect(lExpressionNode.data.value).toBe(lStringValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslStringType);
        });

        await pContext.step('Empty string', () => {
            // Setup.
            const lStringValue: string = '';
            const lValueName: string = 'FirstValue';
            const lCodeText: string = `
                enum TestEnum {
                    ${lValueName} = "${lStringValue}"
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lVariableNode: EnumDeclarationAst = lDocument.data.content[0] as EnumDeclarationAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: StringValueExpressionAst = lVariableNode.data.values.get(lValueName) as StringValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(StringValueExpressionAst);

            // Evaluation. Correct string value.
            expect(lExpressionNode.data.value).toBe(lStringValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslStringType);
        });
    });
});

Deno.test('StringValueExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('String Literals', async (pContext) => {
        await pContext.step('Simple string', () => {
            // Setup.
            const lStringValue: string = 'TestString';
            const lValueName: string = 'FirstValue';
            const lCodeText: string = `
                enum TestEnum {
                    ${lValueName} = "${lStringValue}"
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. String and enum are not represented in WGSL.
            expect(lTranspilationResult.source).toBe('');
        });

        await pContext.step('Empty string', () => {
            // Setup.
            const lStringValue: string = '';
            const lValueName: string = 'FirstValue';
            const lCodeText: string = `
                enum TestEnum {
                    ${lValueName} = "${lStringValue}"
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. String and enum are not represented in WGSL.
            expect(lTranspilationResult.source).toBe('');
        });
    });
});

Deno.test('StringValueExpressionAst - Error', async (pContext) => {
    await pContext.step('String with quotation marks', () => {
        // Setup.
        const lCodeText: string = `
            enum TestEnum {
                FirstValue = "String with \"quotation\" marks"
            }
        `;

        // Process.
        const lErrorFunction = () => {
            gPgslParser.transpile(lCodeText, new WgslTranspiler());
        }

        // Evaluation. Should have errors.
        expect(lErrorFunction).toThrow(/^Unexpected token/);
    });
});
