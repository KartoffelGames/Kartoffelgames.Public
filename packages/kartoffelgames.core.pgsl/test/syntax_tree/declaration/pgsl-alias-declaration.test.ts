import { expect } from '@kartoffelgames/core-test';
import type { PgslParserResult } from '../../../source/parser/pgsl-parser-result.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import { PgslAliasDeclaration } from '../../../source/syntax_tree/declaration/pgsl-alias-declaration.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/type/pgsl-numeric-type.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslAliasDeclaration - Normal Types', async (pContext) => {
    await pContext.step('Default - Float alias', async () => {
        // Setup. Code blocks.
        const lAliasName: string = 'TestFloatAlias';
        const lAliasType: string = PgslNumericType.typeName.float32;

        // Setup. Code text.
        const lCodeText: string = `alias ${lAliasName} = ${lAliasType};`;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct number of child nodes.
        expect(lTranspilationResult.document.childNodes).toHaveLength(1);

        // Evaluation. Correct type of child node.
        const lDeclarationNode: PgslAliasDeclaration = lTranspilationResult.document.childNodes[0] as PgslAliasDeclaration;
        expect(lDeclarationNode).toBeInstanceOf(PgslAliasDeclaration);

        // Evaluation. Correct structure.
        expect(lDeclarationNode.name).toBe(lAliasName);
    });

    await pContext.step('Default - Integer alias', async () => {
        // Setup. Code blocks.
        const lAliasName: string = 'TestIntegerAlias';
        const lAliasType: string = PgslNumericType.typeName.signedInteger;

        // Setup. Code text.
        const lCodeText: string = `alias ${lAliasName} = ${lAliasType};`;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslAliasDeclaration = lTranspilationResult.document.childNodes[0] as PgslAliasDeclaration;
        expect(lDeclarationNode.name).toBe(lAliasName);
    });

    await pContext.step('Transpilation - Float alias usage', async () => {
        // Setup. Code blocks.
        const lAliasName: string = 'TestFloatAlias';
        const lAliasType: string = PgslNumericType.typeName.float32;
        const lVariableName: string = 'testVariable';
        const lVariableValue: string = '5.0';

        // Setup. Code text.
        const lCodeText: string = `
            alias ${lAliasName} = ${lAliasType};
            const ${lVariableName}: ${lAliasName} = ${lVariableValue};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses the aliased type.
        expect(lTranspilationResult.source).toContain(`const ${lVariableName}: f32 = ${lVariableValue};`);
    });

    await pContext.step('Transpilation - Integer alias usage', async () => {
        // Setup. Code blocks.
        const lAliasName: string = 'TestIntegerAlias';
        const lAliasType: string = PgslNumericType.typeName.signedInteger;
        const lVariableName: string = 'testVariable';
        const lVariableValue: string = '42';

        // Setup. Code text.
        const lCodeText: string = `
            alias ${lAliasName} = ${lAliasType};
            const ${lVariableName}: ${lAliasName} = ${lVariableValue};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses the aliased type.
        expect(lTranspilationResult.source).toContain(`const ${lVariableName}: i32 = ${lVariableValue};`);
    });
});

Deno.test('PgslAliasDeclaration - Template Types', async (pContext) => {
    await pContext.step('Default - Array alias', async () => {
        // Setup. Code blocks.
        const lAliasName: string = 'TestArrayAlias';
        const lAliasType: string = `Array<${PgslNumericType.typeName.float32}, 10>`;

        // Setup. Code text.
        const lCodeText: string = `alias ${lAliasName} = ${lAliasType};`;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslAliasDeclaration = lTranspilationResult.document.childNodes[0] as PgslAliasDeclaration;
        expect(lDeclarationNode.name).toBe(lAliasName);
    });

    await pContext.step('Default - Vector alias', async () => {
        // Setup. Code blocks.
        const lAliasName: string = 'TestVectorAlias';
        const lAliasType: string = `Vector3<${PgslNumericType.typeName.float32}>`;

        // Setup. Code text.
        const lCodeText: string = `alias ${lAliasName} = ${lAliasType};`;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslAliasDeclaration = lTranspilationResult.document.childNodes[0] as PgslAliasDeclaration;
        expect(lDeclarationNode.name).toBe(lAliasName);
    });

    await pContext.step('Transpilation - Array alias usage', async () => {
        // Setup. Code blocks.
        const lAliasName: string = 'TestArrayAlias';
        const lAliasType: string = `Array<${PgslNumericType.typeName.float32}, 10>`;
        const lVariableName: string = 'testVariable';

        // Setup. Code text.
        const lCodeText: string = `
            alias ${lAliasName} = ${lAliasType};
            private ${lVariableName}: ${lAliasName};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses the aliased type.
        expect(lTranspilationResult.source).toContain(`var<private> ${lVariableName}: array<f32, 10>;`);
    });

    await pContext.step('Transpilation - Vector alias usage', async () => {
        // Setup. Code blocks.
        const lAliasName: string = 'TestVectorAlias';
        const lAliasType: string = `Vector3<${PgslNumericType.typeName.float32}>`;
        const lVariableName: string = 'testVariable';

        // Setup. Code text.
        const lCodeText: string = `
            alias ${lAliasName} = ${lAliasType};
            private ${lVariableName}: ${lAliasName};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses the aliased type.
        expect(lTranspilationResult.source).toContain(`var<private> ${lVariableName}: vec3<f32>;`);
    });
});

Deno.test('PgslAliasDeclaration - Aliased Aliases', async (pContext) => {
    await pContext.step('Default - Alias of normal type alias', async () => {
        // Setup. Code blocks.
        const lFirstAliasName: string = 'TestFloatAlias';
        const lFirstAliasType: string = PgslNumericType.typeName.float32;
        const lSecondAliasName: string = 'TestAliasedAlias';

        // Setup. Code text.
        const lCodeText: string = `
            alias ${lFirstAliasName} = ${lFirstAliasType};
            alias ${lSecondAliasName} = ${lFirstAliasName};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct number of child nodes.
        expect(lTranspilationResult.document.childNodes).toHaveLength(2);

        // Evaluation. Both declarations are correct type.
        const lFirstDeclarationNode: PgslAliasDeclaration = lTranspilationResult.document.childNodes[0] as PgslAliasDeclaration;
        const lSecondDeclarationNode: PgslAliasDeclaration = lTranspilationResult.document.childNodes[1] as PgslAliasDeclaration;
        expect(lFirstDeclarationNode).toBeInstanceOf(PgslAliasDeclaration);
        expect(lSecondDeclarationNode).toBeInstanceOf(PgslAliasDeclaration);
        expect(lFirstDeclarationNode.name).toBe(lFirstAliasName);
        expect(lSecondDeclarationNode.name).toBe(lSecondAliasName);
    });

    await pContext.step('Default - Alias of template type alias', async () => {
        // Setup. Code blocks.
        const lFirstAliasName: string = 'TestVectorAlias';
        const lFirstAliasType: string = `Vector3<${PgslNumericType.typeName.float32}>`;
        const lSecondAliasName: string = 'TestAliasedVectorAlias';

        // Setup. Code text.
        const lCodeText: string = `
            alias ${lFirstAliasName} = ${lFirstAliasType};
            alias ${lSecondAliasName} = ${lFirstAliasName};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct structure.
        const lSecondDeclarationNode: PgslAliasDeclaration = lTranspilationResult.document.childNodes[1] as PgslAliasDeclaration;
        expect(lSecondDeclarationNode.name).toBe(lSecondAliasName);
    });

    await pContext.step('Transpilation - Aliased normal type alias usage', async () => {
        // Setup. Code blocks.
        const lFirstAliasName: string = 'TestFloatAlias';
        const lFirstAliasType: string = PgslNumericType.typeName.float32;
        const lSecondAliasName: string = 'TestAliasedAlias';
        const lVariableName: string = 'testVariable';
        const lVariableValue: string = '5.0';

        // Setup. Code text.
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
        expect(lTranspilationResult.source).toContain(`const ${lVariableName}: f32 = ${lVariableValue};`);
    });

    await pContext.step('Transpilation - Aliased template type alias usage', async () => {
        // Setup. Code blocks.
        const lFirstAliasName: string = 'TestVectorAlias';
        const lFirstAliasType: string = `Vector3<${PgslNumericType.typeName.float32}>`;
        const lSecondAliasName: string = 'TestAliasedVectorAlias';
        const lVariableName: string = 'testVariable';

        // Setup. Code text.
        const lCodeText: string = `
            alias ${lFirstAliasName} = ${lFirstAliasType};
            alias ${lSecondAliasName} = ${lFirstAliasName};
            private ${lVariableName}: ${lSecondAliasName};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses the final aliased type.
        expect(lTranspilationResult.source).toContain(`var<private> ${lVariableName}: vec3<f32>;`);
    });

    await pContext.step('Chain - Multiple aliased aliases', async () => {
        // Setup. Code blocks.
        const lFirstAliasName: string = 'TestFloatAlias';
        const lFirstAliasType: string = PgslNumericType.typeName.float32;
        const lSecondAliasName: string = 'TestSecondAlias';
        const lThirdAliasName: string = 'TestThirdAlias';
        const lVariableName: string = 'testVariable';
        const lVariableValue: string = '5.0';

        // Setup. Code text.
        const lCodeText: string = `
            alias ${lFirstAliasName} = ${lFirstAliasType};
            alias ${lSecondAliasName} = ${lFirstAliasName};
            alias ${lThirdAliasName} = ${lSecondAliasName};
            const ${lVariableName}: ${lThirdAliasName} = ${lVariableValue};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses the final aliased type.
        expect(lTranspilationResult.source).toContain(`const ${lVariableName}: f32 = ${lVariableValue};`);
    });
});

Deno.test('PgslAliasDeclaration - Error Cases', async (pContext) => {
    await pContext.step('Error - Undefined type in alias', async () => {
        // Setup. Code blocks.
        const lAliasName: string = 'TestAlias';
        const lUndefinedTypeName: string = 'UndefinedType';

        // Setup. Code text.
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

    await pContext.step('Error - Circular alias reference', async () => {
        // Setup. Code blocks.
        const lFirstAliasName: string = 'TestAliasOne';
        const lSecondAliasName: string = 'TestAliasTwo';

        // Setup. Code text.
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

    await pContext.step('Error - Self-referencing alias', async () => {
        // Setup. Code blocks.
        const lAliasName: string = 'TestSelfAlias';

        // Setup. Code text.
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

    await pContext.step('Error - Invalid template parameters', async () => {
        // Setup. Code blocks.
        const lAliasName: string = 'TestInvalidTemplateAlias';
        const lInvalidTemplateParameter: string = 'InvalidType';
        const lInvalidTemplateType: string = `Array<${lInvalidTemplateParameter}, NotANumber>`;

        // Setup. Code text.
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

    await pContext.step('Error - Duplicate alias names', async () => {
        // Setup. Code blocks.
        const lAliasName: string = 'TestDuplicateAlias';
        const lFirstAliasType: string = PgslNumericType.typeName.float32;
        const lSecondAliasType: string = PgslNumericType.typeName.signedInteger;

        // Setup. Code text.
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
