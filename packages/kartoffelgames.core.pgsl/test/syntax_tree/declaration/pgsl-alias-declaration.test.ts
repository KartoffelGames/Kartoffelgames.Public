import { expect } from '@kartoffelgames/core-test';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import { PgslAliasDeclaration } from '../../../source/syntax_tree/declaration/pgsl-alias-declaration.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/type/pgsl-numeric-type.ts';
import { PgslDocument } from "../../../source/syntax_tree/pgsl-document.ts";

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslAliasDeclaration - Parsing', async (pContext) => {
    await pContext.step('Scalar Types', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup.
            const lAliasName: string = 'TestFloatAlias';
            const lAliasType: string = PgslNumericType.typeName.float32;
            const lCodeText: string = `alias ${lAliasName} = ${lAliasType};`;

            // Process.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.childNodes).toHaveLength(1);

            // Evaluation. Correct type of child node.
            const lDeclarationNode: PgslAliasDeclaration = lDocument.childNodes[0] as PgslAliasDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslAliasDeclaration);

            // Evaluation. Correct structure.
            expect(lDeclarationNode.name).toBe(lAliasName);
        });

        await pContext.step('Integer', () => {
            // Setup.
            const lAliasName: string = 'TestIntegerAlias';
            const lAliasType: string = PgslNumericType.typeName.signedInteger;
            const lCodeText: string = `alias ${lAliasName} = ${lAliasType};`;

            // Process.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: PgslAliasDeclaration = lDocument.childNodes[0] as PgslAliasDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslAliasDeclaration);
            expect(lDeclarationNode.name).toBe(lAliasName);
        });

        await pContext.step('Boolean', () => {
            // Setup.
            const lAliasName: string = 'TestBooleanAlias';
            const lAliasType: string = 'bool';
            const lCodeText: string = `alias ${lAliasName} = ${lAliasType};`;

            // Process.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: PgslAliasDeclaration = lDocument.childNodes[0] as PgslAliasDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslAliasDeclaration);
            expect(lDeclarationNode.name).toBe(lAliasName);
        });
    });

    await pContext.step('Templated Types', async (pContext) => {
        await pContext.step('Array', () => {
            // Setup.
            const lAliasName: string = 'TestArrayAlias';
            const lAliasType: string = `Array<${PgslNumericType.typeName.float32}, 10>`;
            const lCodeText: string = `alias ${lAliasName} = ${lAliasType};`;

            // Process.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: PgslAliasDeclaration = lDocument.childNodes[0] as PgslAliasDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslAliasDeclaration);
            expect(lDeclarationNode.name).toBe(lAliasName);
        });

        await pContext.step('Vector', () => {
            // Setup.
            const lAliasName: string = 'TestVectorAlias';
            const lAliasType: string = `Vector3<${PgslNumericType.typeName.float32}>`;
            const lCodeText: string = `alias ${lAliasName} = ${lAliasType};`;

            // Process.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: PgslAliasDeclaration = lDocument.childNodes[0] as PgslAliasDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslAliasDeclaration);
            expect(lDeclarationNode.name).toBe(lAliasName);
        });
    });

    await pContext.step('Complex Types', async (pContext) => {
        await pContext.step('Struct', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lAliasName: string = 'TestStructAlias';
            const lCodeText: string = `
                struct ${lStructName} {
                    propertyOne: f32
                }
                alias ${lAliasName} = ${lStructName};
            `;

            // Process.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.childNodes).toHaveLength(2);

            // Evaluation. Correct structure.
            const lDeclarationNode: PgslAliasDeclaration = lDocument.childNodes[1] as PgslAliasDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslAliasDeclaration);
            expect(lDeclarationNode.name).toBe(lAliasName);
        });

        await pContext.step('Alias', () => {
            // Setup.
            const lFirstAliasName: string = 'TestFloatAlias';
            const lFirstAliasType: string = PgslNumericType.typeName.float32;
            const lSecondAliasName: string = 'TestAliasedAlias';
            const lCodeText: string = `
                alias ${lFirstAliasName} = ${lFirstAliasType};
                alias ${lSecondAliasName} = ${lFirstAliasName};
            `;

            // Process.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.childNodes).toHaveLength(2);

            // Evaluation. Both declarations are correct type.
            const lFirstDeclarationNode: PgslAliasDeclaration = lDocument.childNodes[0] as PgslAliasDeclaration;
            const lSecondDeclarationNode: PgslAliasDeclaration = lDocument.childNodes[1] as PgslAliasDeclaration;
            expect(lFirstDeclarationNode).toBeInstanceOf(PgslAliasDeclaration);
            expect(lSecondDeclarationNode).toBeInstanceOf(PgslAliasDeclaration);
            expect(lFirstDeclarationNode.name).toBe(lFirstAliasName);
            expect(lSecondDeclarationNode.name).toBe(lSecondAliasName);
        });
    });
});

Deno.test('PgslAliasDeclaration - Transpilation', async (pContext) => {
    await pContext.step('Scalar Types', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup.
            const lAliasName: string = 'TestFloatAlias';
            const lAliasType: string = PgslNumericType.typeName.float32;
            const lVariableName: string = 'testVariable';
            const lVariableValue: string = '5.0';
            const lCodeText: string = `
                alias ${lAliasName} = ${lAliasType};
                const ${lVariableName}: ${lAliasName} = ${lVariableValue};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the aliased type.
            expect(lTranspilationResult.source).toBe(`const ${lVariableName}:f32=${lVariableValue};`);
        });

        await pContext.step('Integer', () => {
            // Setup.
            const lAliasName: string = 'TestIntegerAlias';
            const lAliasType: string = PgslNumericType.typeName.signedInteger;
            const lVariableName: string = 'testVariable';
            const lVariableValue: string = '42';
            const lCodeText: string = `
                alias ${lAliasName} = ${lAliasType};
                const ${lVariableName}: ${lAliasName} = ${lVariableValue};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the aliased type.
            expect(lTranspilationResult.source).toBe(`const ${lVariableName}:i32=${lVariableValue};`);
        });

        await pContext.step('Boolean', () => {
            // Setup.
            const lAliasName: string = 'TestBooleanAlias';
            const lAliasType: string = 'bool';
            const lVariableName: string = 'testVariable';
            const lVariableValue: string = 'true';
            const lCodeText: string = `
                alias ${lAliasName} = ${lAliasType};
                const ${lVariableName}: ${lAliasName} = ${lVariableValue};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the aliased type.
            expect(lTranspilationResult.source).toBe(`const ${lVariableName}:bool=${lVariableValue};`);
        });
    });

    await pContext.step('Templated Types', async (pContext) => {
        await pContext.step('Array', () => {
            // Setup.
            const lAliasName: string = 'TestArrayAlias';
            const lAliasType: string = `Array<${PgslNumericType.typeName.float32}, 10>`;
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                alias ${lAliasName} = ${lAliasType};
                private ${lVariableName}: ${lAliasName};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the aliased type.
            expect(lTranspilationResult.source).toBe(`var<private> ${lVariableName}:array<f32,10>;`);
        });

        await pContext.step('Vector', () => {
            // Setup.
            const lAliasName: string = 'TestVectorAlias';
            const lAliasType: string = `Vector3<${PgslNumericType.typeName.float32}>`;
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                alias ${lAliasName} = ${lAliasType};
                private ${lVariableName}: ${lAliasName};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the aliased type.
            expect(lTranspilationResult.source).toBe(`var<private> ${lVariableName}:vec3<f32>;`);
        });
    });

    await pContext.step('Complex Types', async (pContext) => {
        await pContext.step('Struct', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lAliasName: string = 'TestStructAlias';
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                struct ${lStructName} {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
                alias ${lAliasName} = ${lStructName};
                private ${lVariableName}: ${lAliasName};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the aliased type.
            expect(lTranspilationResult.source).toBe(
                `struct ${lStructName}{propertyOne:f32}` +
                `var<private> ${lVariableName}:${lStructName};`
            );
        });

        await pContext.step('Alias', () => {
            // Setup.
            const lFirstAliasName: string = 'TestFloatAlias';
            const lFirstAliasType: string = PgslNumericType.typeName.float32;
            const lSecondAliasName: string = 'TestAliasedAlias';
            const lVariableName: string = 'testVariable';
            const lVariableValue: string = '5.0';
            const lCodeText: string = `
                alias ${lFirstAliasName} = ${lFirstAliasType};
                alias ${lSecondAliasName} = ${lFirstAliasName};
                const ${lVariableName}: ${lSecondAliasName} = ${lVariableValue};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses the final aliased type.
            expect(lTranspilationResult.source).toBe(`const ${lVariableName}:f32=${lVariableValue};`);
        });
    });
});

Deno.test('PgslAliasDeclaration - Error', async (pContext) => {
    await pContext.step('Undefined type in alias', () => {
        // Setup.
        const lAliasName: string = 'TestAlias';
        const lUndefinedTypeName: string = 'UndefinedType';
        const lCodeText: string = `alias ${lAliasName} = ${lUndefinedTypeName};`;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention undefined type.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Typename "${lUndefinedTypeName}" not defined.`)
        )).toBe(true);
    });

    await pContext.step('Circular alias reference', () => {
        // Setup.
        const lFirstAliasName: string = 'TestAliasOne';
        const lSecondAliasName: string = 'TestAliasTwo';
        const lCodeText: string = `
            alias ${lFirstAliasName} = ${lSecondAliasName};
            alias ${lSecondAliasName} = ${lFirstAliasName};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention circular reference or undefined type.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Typename "${lSecondAliasName}" not defined.`)
        )).toBe(true);
    });

    await pContext.step('Self-referencing alias', () => {
        // Setup.
        const lAliasName: string = 'TestSelfAlias';
        const lCodeText: string = `alias ${lAliasName} = ${lAliasName};`;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention self-reference or undefined type.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Typename "${lAliasName}" not defined.`)
        )).toBe(true);
    });

    await pContext.step('Invalid template Parameters', () => {
        // Setup.
        const lAliasName: string = 'TestInvalidTemplateAlias';
        const lInvalidTemplateParameter: string = 'InvalidType';
        const lInvalidTemplateType: string = `Array<${lInvalidTemplateParameter}, NotANumber>`;
        const lCodeText: string = `alias ${lAliasName} = ${lInvalidTemplateType};`;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention invalid template parameters.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Typename "${lInvalidTemplateParameter}" not defined.`)
        )).toBe(true);
    });

    await pContext.step('Duplicate alias names', () => {
        // Setup.
        const lAliasName: string = 'TestDuplicateAlias';
        const lFirstAliasType: string = PgslNumericType.typeName.float32;
        const lSecondAliasType: string = PgslNumericType.typeName.signedInteger;
        const lCodeText: string = `
            alias ${lAliasName} = ${lFirstAliasType};
            alias ${lAliasName} = ${lSecondAliasType};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention duplicate alias.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Alias with name "${lAliasName}" already defined.`)
        )).toBe(true);
    });
});
