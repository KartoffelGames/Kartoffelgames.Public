import { expect } from '@kartoffelgames/core-test';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import { EnumDeclarationAst } from '../../../source/abstract_syntax_tree/declaration/enum-declaration-ast.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/type/pgsl-numeric-type.ts';
import { DocumentAst } from "../../../source/abstract_syntax_tree/document-ast.ts";
import { AttributeListAst } from "../../../source/abstract_syntax_tree/general/attribute-list-ast.ts";
import { PgslLiteralValueExpression } from "../../../source/abstract_syntax_tree/expression/single_value/pgsl-literal-value-expression.ts";
import { PgslStringValueExpression } from "../../../source/abstract_syntax_tree/expression/single_value/pgsl-string-value-expression.ts";

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslEnumDeclaration - Parsing', async (pContext) => {
    await pContext.step('Numeric enum', async (pContext) => {
        await pContext.step('Integer enum', () => {
            // Setup.
            const lEnumName: string = 'TestEnum';
            const lFirstValueName: string = 'ValueOne';
            const lFirstValueData: string = '1';
            const lSecondValueName: string = 'ValueTwo';
            const lSecondValueData: string = '2';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ${lFirstValueName} = ${lFirstValueData},
                    ${lSecondValueName} = ${lSecondValueData}
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parse(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.childNodes).toHaveLength(1);

            // Evaluation. Correct type of child node.
            const lDeclarationNode: EnumDeclarationAst = lDocument.childNodes[0] as EnumDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(EnumDeclarationAst);

            // Evaluation. Correct name.
            expect(lDeclarationNode.name).toBe(lEnumName);

            // Evaluation. Enum values.
            expect(lDeclarationNode.values).toHaveLength(2);
            expect(lDeclarationNode.values[0].name).toBe(lFirstValueName);
            expect(lDeclarationNode.values[0].value).toBeInstanceOf(PgslLiteralValueExpression);
            expect(lDeclarationNode.values[1].name).toBe(lSecondValueName);
            expect(lDeclarationNode.values[1].value).toBeInstanceOf(PgslLiteralValueExpression);
        });

        await pContext.step('Unsigned integer enum with suffix', () => {
            // Setup.
            const lEnumName: string = 'TestUnsignedEnum';
            const lFirstValueName: string = 'ValueOne';
            const lFirstValueData: string = '1u';
            const lSecondValueName: string = 'ValueTwo';
            const lSecondValueData: string = '2u';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ${lFirstValueName} = ${lFirstValueData},
                    ${lSecondValueName} = ${lSecondValueData}
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parse(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: EnumDeclarationAst = lDocument.childNodes[0] as EnumDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(EnumDeclarationAst);
            expect(lDeclarationNode.name).toBe(lEnumName);

            // Evaluation. Enum values.
            expect(lDeclarationNode.values).toHaveLength(2);
            expect(lDeclarationNode.values[0].name).toBe(lFirstValueName);
            expect(lDeclarationNode.values[0].value).toBeInstanceOf(PgslLiteralValueExpression);
            expect(lDeclarationNode.values[1].name).toBe(lSecondValueName);
            expect(lDeclarationNode.values[1].value).toBeInstanceOf(PgslLiteralValueExpression);
        });
    });

    await pContext.step('String Enums', async (pContext) => {
        await pContext.step('String enum', () => {
            // Setup.
            const lEnumName: string = 'TestStringEnum';
            const lFirstValueName: string = 'ValueOne';
            const lFirstValueData: string = '"StringOne"';
            const lSecondValueName: string = 'ValueTwo';
            const lSecondValueData: string = '"StringTwo"';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ${lFirstValueName} = ${lFirstValueData},
                    ${lSecondValueName} = ${lSecondValueData}
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parse(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: EnumDeclarationAst = lDocument.childNodes[0] as EnumDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(EnumDeclarationAst);
            expect(lDeclarationNode.name).toBe(lEnumName);

            // Evaluation. Enum values.
            expect(lDeclarationNode.values).toHaveLength(2);
            expect(lDeclarationNode.values[0].name).toBe(lFirstValueName);
            expect(lDeclarationNode.values[0].value).toBeInstanceOf(PgslStringValueExpression);
            expect(lDeclarationNode.values[1].name).toBe(lSecondValueName);
            expect(lDeclarationNode.values[1].value).toBeInstanceOf(PgslStringValueExpression);
        });
    });
});

Deno.test('PgslEnumDeclaration - Transpilation', async (pContext) => {
    await pContext.step('Numeric enum', async (pContext) => {
        await pContext.step('Enum value usage in variable', () => {
            // Setup.
            const lEnumName: string = 'TestEnum';
            const lValueName: string = 'ValueOne';
            const lValueData: string = '42';
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ${lValueName} = ${lValueData}
                }
                const ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = ${lEnumName}.${lValueName};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Enum reference replaced with value.
            expect(lTranspilationResult.source).toBe(`const ${lVariableName}:u32=${lValueData};`);
        });

        await pContext.step('Multiple enum values', () => {
            // Setup.
            const lEnumName: string = 'TestEnum';
            const lFirstValueName: string = 'ValueOne';
            const lFirstValueData: string = '1';
            const lSecondValueName: string = 'ValueTwo';
            const lSecondValueData: string = '2';
            const lFirstVariableName: string = 'testVariableOne';
            const lSecondVariableName: string = 'testVariableTwo';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ${lFirstValueName} = ${lFirstValueData},
                    ${lSecondValueName} = ${lSecondValueData}
                }
                const ${lFirstVariableName}: ${PgslNumericType.typeName.unsignedInteger} = ${lEnumName}.${lFirstValueName};
                const ${lSecondVariableName}: ${PgslNumericType.typeName.unsignedInteger} = ${lEnumName}.${lSecondValueName};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Both enum references replaced with values.
            expect(lTranspilationResult.source).toBe(
                `const ${lFirstVariableName}:u32=${lFirstValueData};` +
                `const ${lSecondVariableName}:u32=${lSecondValueData};`
            );
        });
    });

    await pContext.step('String Enums', async (pContext) => {
        await pContext.step('String enum value usage', () => {
            // Setup. Code blocks.
            const lEnumName: string = 'TestStringEnum';
            const lValueNameOne: string = 'ValueOne';
            const lValueNameTwo: string = 'ValueTwo';
            const lValueDataOne: string = '"TestString"';
            const lValueDataTwo: string = '"TestString2"';
            const lVariableName: string = 'testVariable';

            // Setup. Code text.
            const lCodeText: string = `
                enum ${lEnumName} {
                    ${lValueNameOne} = ${lValueDataOne},
                    ${lValueNameTwo} = ${lValueDataTwo}
                }
                [${AttributeListAst.attributeNames.groupBinding}(${lEnumName}.${lValueNameOne}, ${lEnumName}.${lValueNameTwo})]
                uniform ${lVariableName}: float;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the enum value.
            expect(lTranspilationResult.source).toBe(`@group(0)@binding(0)var<uniform> ${lVariableName}:f32;`);
        });
    });
});

Deno.test('PgslEnumDeclaration - Error', async (pContext) => {
    await pContext.step('Duplicate value names', () => {
        // Setup.
        const lEnumName: string = 'TestEnum';
        const lDuplicateValueName: string = 'DuplicateValue';
        const lFirstValueData: string = '1';
        const lSecondValueData: string = '2';
        const lCodeText: string = `
            enum ${lEnumName} {
                ${lDuplicateValueName} = ${lFirstValueData},
                ${lDuplicateValueName} = ${lSecondValueData}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention duplicate value.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Value "${lDuplicateValueName}" was already added to enum "${lEnumName}"`)
        )).toBe(true);
    });

    await pContext.step('Invalid value type', () => {
        // Setup.
        const lEnumName: string = 'TestEnum';
        const lValueName: string = 'InvalidValue';
        const lInvalidValueData: string = 'true';
        const lCodeText: string = `
            enum ${lEnumName} {
                ${lValueName} = ${lInvalidValueData}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention invalid type.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Enum "${lEnumName}" can only hold unsigned integer values.`)
        )).toBe(true);
    });

    await pContext.step('Undefined enum value access', () => {
        // Setup.
        const lEnumName: string = 'TestEnum';
        const lValueName: string = 'ExistingValue';
        const lValueData: string = '1';
        const lUndefinedValueName: string = 'UndefinedValue';
        const lVariableName: string = 'testVariable';
        const lCodeText: string = `
            enum ${lEnumName} {
                ${lValueName} = ${lValueData}
            }
            const ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = ${lEnumName}.${lUndefinedValueName};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention undefined property.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Enum "${lEnumName}" does not contain a value for property "${lUndefinedValueName}".`)
        )).toBe(true);
    });
});
