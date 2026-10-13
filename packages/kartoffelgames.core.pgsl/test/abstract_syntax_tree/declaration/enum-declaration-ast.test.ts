import { expect } from '@kartoffelgames/core-test';
import { EnumDeclarationAst } from '../../../source/abstract_syntax_tree/declaration/enum-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { LiteralValueExpressionAst } from '../../../source/abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts';
import { StringValueExpressionAst } from '../../../source/abstract_syntax_tree/expression/single_value/string-value-expression-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('EnumDeclarationAst - Parsing', async (pContext) => {
    await pContext.step('Numeric enum', async (pContext) => {
        await pContext.step('Integer enum', () => {
            // Setup.
            const lEnumName: string = 'TestEnum';
            const lFirstValueName: string = 'ValueOne';
            const lSecondValueName: string = 'ValueTwo';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ${lFirstValueName} = 1,
                    ${lSecondValueName} = 2
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.data.content).toHaveLength(1);

            // Evaluation. Correct type of child node.
            const lDeclarationNode: EnumDeclarationAst = lDocument.data.content[0] as EnumDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(EnumDeclarationAst);

            // Evaluation. Correct name.
            expect(lDeclarationNode.data.name).toBe(lEnumName);

            // Evaluation. Enum values.
            expect(lDeclarationNode.data.values.size).toBe(2);
            expect(lDeclarationNode.data.values.get(lFirstValueName)).toBeInstanceOf(LiteralValueExpressionAst);
            expect(lDeclarationNode.data.values.get(lSecondValueName)).toBeInstanceOf(LiteralValueExpressionAst);
        });

        await pContext.step('Unsigned integer enum with suffix', () => {
            // Setup.
            const lEnumName: string = 'TestUnsignedEnum';
            const lFirstValueName: string = 'ValueOne';
            const lSecondValueName: string = 'ValueTwo';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ${lFirstValueName} = 1u,
                    ${lSecondValueName} = 2u
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: EnumDeclarationAst = lDocument.data.content[0] as EnumDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(EnumDeclarationAst);
            expect(lDeclarationNode.data.name).toBe(lEnumName);

            // Evaluation. Enum values.
            expect(lDeclarationNode.data.values.size).toBe(2);
            expect(lDeclarationNode.data.values.get(lFirstValueName)).toBeInstanceOf(LiteralValueExpressionAst);
            expect(lDeclarationNode.data.values.get(lSecondValueName)).toBeInstanceOf(LiteralValueExpressionAst);
        });
    });

    await pContext.step('String Enums', async (pContext) => {
        await pContext.step('String enum', () => {
            // Setup.
            const lEnumName: string = 'TestStringEnum';
            const lFirstValueName: string = 'ValueOne';
            const lSecondValueName: string = 'ValueTwo';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ${lFirstValueName} = "StringOne",
                    ${lSecondValueName} = "StringTwo"
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: EnumDeclarationAst = lDocument.data.content[0] as EnumDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(EnumDeclarationAst);
            expect(lDeclarationNode.data.name).toBe(lEnumName);

            // Evaluation. Enum values.
            expect(lDeclarationNode.data.values.size).toBe(2);
            expect(lDeclarationNode.data.values.get(lFirstValueName)).toBeInstanceOf(StringValueExpressionAst);
            expect(lDeclarationNode.data.values.get(lSecondValueName)).toBeInstanceOf(StringValueExpressionAst);
        });
    });
});
