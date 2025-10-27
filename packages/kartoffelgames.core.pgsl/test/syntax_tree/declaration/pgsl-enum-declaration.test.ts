import { expect } from '@kartoffelgames/core-test';
import type { PgslParserResult } from '../../../source/parser/pgsl-parser-result.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import { PgslEnumDeclaration } from '../../../source/syntax_tree/declaration/pgsl-enum-declaration.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/type/pgsl-numeric-type.ts';
import { PgslAttributeList } from "../../../source/syntax_tree/general/pgsl-attribute-list.ts";

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslEnumDeclaration - Numeric Enums', async (pContext) => {
    await pContext.step('Default - Integer enum', async () => {
        // Setup. Code blocks.
        const lEnumName: string = 'TestEnum';
        const lFirstValueName: string = 'ValueOne';
        const lFirstValueData: string = '1';
        const lSecondValueName: string = 'ValueTwo';
        const lSecondValueData: string = '2';

        // Setup. Code text.
        const lCodeText: string = `
            enum ${lEnumName} {
                ${lFirstValueName} = ${lFirstValueData},
                ${lSecondValueName} = ${lSecondValueData}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct number of child nodes.
        expect(lTranspilationResult.document.childNodes).toHaveLength(1);

        // Evaluation. Correct type of child node.
        const lDeclarationNode: PgslEnumDeclaration = lTranspilationResult.document.childNodes[0] as PgslEnumDeclaration;
        expect(lDeclarationNode).toBeInstanceOf(PgslEnumDeclaration);

        // Evaluation. Correct structure.
        expect(lDeclarationNode.name).toBe(lEnumName);
    });

    await pContext.step('Default - Unsigned integer enum with suffix', async () => {
        // Setup. Code blocks.
        const lEnumName: string = 'TestUnsignedEnum';
        const lFirstValueName: string = 'ValueOne';
        const lFirstValueData: string = '1u';
        const lSecondValueName: string = 'ValueTwo';
        const lSecondValueData: string = '2u';

        // Setup. Code text.
        const lCodeText: string = `
            enum ${lEnumName} {
                ${lFirstValueName} = ${lFirstValueData},
                ${lSecondValueName} = ${lSecondValueData}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslEnumDeclaration = lTranspilationResult.document.childNodes[0] as PgslEnumDeclaration;
        expect(lDeclarationNode.name).toBe(lEnumName);
    });

    await pContext.step('Transpilation - Enum value usage in variable', async () => {
        // Setup. Code blocks.
        const lEnumName: string = 'TestEnum';
        const lValueName: string = 'ValueOne';
        const lValueData: string = '42';
        const lVariableName: string = 'testVariable';

        // Setup. Code text.
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

        // Evaluation. Transpiled output uses the enum value.
        expect(lTranspilationResult.source).toContain(`const ${lVariableName}: u32 = ${lValueData};`);
    });
});

Deno.test('PgslEnumDeclaration - String Enums', async (pContext) => {
    await pContext.step('Default - String enum', async () => {
        // Setup. Code blocks.
        const lEnumName: string = 'TestStringEnum';
        const lFirstValueName: string = 'ValueOne';
        const lFirstValueData: string = '"StringOne"';
        const lSecondValueName: string = 'ValueTwo';
        const lSecondValueData: string = '"StringTwo"';

        // Setup. Code text.
        const lCodeText: string = `
            enum ${lEnumName} {
                ${lFirstValueName} = ${lFirstValueData},
                ${lSecondValueName} = ${lSecondValueData}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslEnumDeclaration = lTranspilationResult.document.childNodes[0] as PgslEnumDeclaration;
        expect(lDeclarationNode.name).toBe(lEnumName);
    });

    await pContext.step('Transpilation - String enum value usage', async () => {
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
            [${PgslAttributeList.attributeNames.groupBinding}(${lEnumName}.${lValueNameOne}, ${lEnumName}.${lValueNameTwo})]
            uniform ${lVariableName}: float;
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses the enum value.
        expect(lTranspilationResult.source).toContain(`@group(0) @binding(0) var<uniform> ${lVariableName}: f32;`);
    });
});

Deno.test('PgslEnumDeclaration - Error Cases', async (pContext) => {
    await pContext.step('Error - Duplicate value names', async () => {
        // Setup. Code blocks.
        const lEnumName: string = 'TestEnum';
        const lDuplicateValueName: string = 'DuplicateValue';
        const lFirstValueData: string = '1';
        const lSecondValueData: string = '2';

        // Setup. Code text.
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

    await pContext.step('Error - Invalid value type', async () => {
        // Setup. Code blocks.
        const lEnumName: string = 'TestEnum';
        const lValueName: string = 'InvalidValue';
        const lInvalidValueData: string = 'true';

        // Setup. Code text.
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

    await pContext.step('Error - Mixed value types', async () => {
        // Setup. Code blocks.
        const lEnumName: string = 'TestMixedEnum';
        const lFirstValueName: string = 'IntegerValue';
        const lFirstValueData: string = '1';
        const lSecondValueName: string = 'StringValue';
        const lSecondValueData: string = '"TestString"';

        // Setup. Code text.
        const lCodeText: string = `
            enum ${lEnumName} {
                ${lFirstValueName} = ${lFirstValueData},
                ${lSecondValueName} = ${lSecondValueData}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention mixed types.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Enum "${lEnumName}" has mixed value types. Expected all values to be of the same type.`)
        )).toBe(true);
    });

    await pContext.step('Error - Empty enum', async () => {
        // Setup. Code blocks.
        const lEnumName: string = 'TestEmptyEnum';

        // Setup. Code text.
        const lCodeText: string = `
            enum ${lEnumName} {
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention no values.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Enum ${lEnumName} has no values`)
        )).toBe(true);
    });

    await pContext.step('Error - Duplicate enum names', async () => {
        // Setup. Code blocks.
        const lEnumName: string = 'TestDuplicateEnum';
        const lFirstValueName: string = 'ValueOne';
        const lFirstValueData: string = '1';
        const lSecondValueName: string = 'ValueTwo';
        const lSecondValueData: string = '2';

        // Setup. Code text.
        const lCodeText: string = `
            enum ${lEnumName} {
                ${lFirstValueName} = ${lFirstValueData}
            }
            enum ${lEnumName} {
                ${lSecondValueName} = ${lSecondValueData}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention duplicate enum.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Enum "${lEnumName}" is already defined.`)
        )).toBe(true);
    });
});

Deno.test('PgslEnumDeclaration - Usage in Expressions', async (pContext) => {
    await pContext.step('Enum value access', async () => {
        // Setup. Code blocks.
        const lEnumName: string = 'TestEnum';
        const lValueName: string = 'TestValue';
        const lValueData: string = '42';
        const lVariableName: string = 'testVariable';

        // Setup. Code text.
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

        // Evaluation. Variable should use the enum value.
        expect(lTranspilationResult.source).toContain(`const ${lVariableName}: u32 = ${lValueData};`);
    });

    await pContext.step('Multiple enum values', async () => {
        // Setup. Code blocks.
        const lEnumName: string = 'TestEnum';
        const lFirstValueName: string = 'ValueOne';
        const lFirstValueData: string = '1';
        const lSecondValueName: string = 'ValueTwo';
        const lSecondValueData: string = '2';
        const lFirstVariableName: string = 'testVariableOne';
        const lSecondVariableName: string = 'testVariableTwo';

        // Setup. Code text.
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

        // Evaluation. Both variables should use their respective enum values.
        expect(lTranspilationResult.source).toContain(`const ${lFirstVariableName}: u32 = ${lFirstValueData};`);
        expect(lTranspilationResult.source).toContain(`const ${lSecondVariableName}: u32 = ${lSecondValueData};`);
    });

    await pContext.step('Error - Undefined enum value access', async () => {
        // Setup. Code blocks.
        const lEnumName: string = 'TestEnum';
        const lValueName: string = 'ExistingValue';
        const lValueData: string = '1';
        const lUndefinedValueName: string = 'UndefinedValue';
        const lVariableName: string = 'testVariable';

        // Setup. Code text.
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