import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from "../../../source/parser/pgsl-parser.ts";
import { PgslDocument } from "../../../source/syntax_tree/pgsl-document.ts";
import { PgslVariableDeclaration } from "../../../source/syntax_tree/declaration/pgsl-variable-declaration.ts";
import { PgslDeclarationType } from "../../../source/enum/pgsl-declaration-type.enum.ts";
import { BasePgslTypeDefinition } from "../../../source/syntax_tree/type/base-pgsl-type-definition.ts";
import { BasePgslExpression } from "../../../source/syntax_tree/expression/base-pgsl-expression.ts";
import { PgslValidationTrace } from "../../../source/syntax_tree/pgsl-validation-trace.ts";
import { PgslFileMetaInformation } from "../../../source/syntax_tree/pgsl-build-result.ts";

// Create parser instance with disabled validation.
const gPgslParser: PgslParser = new PgslParser();
gPgslParser.enableValidation = false;

Deno.test("PgslVariableDeclarationSyntaxTree - Const", async (pContext) => {
    await pContext.step("Default", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "const";
        const lVariableName: string = "testVariable";
        const lVariableType: string = "Float";
        const lVariableValue: string = "5.0";

        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text.
        const lCodeText: string = `${lDeclarationType} ${lVariableName}: ${lVariableType} = ${lVariableValue};`;

        // Execute.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. No errors.
        expect(lValidationTrace.errors).toHaveLength(0);

        // Validation. Correct number of child nodes.
        expect(lSyntaxTree.childNodes).toHaveLength(1);

        // Validation. Correct type of child node.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);

        // Validation. Correct structure.
        expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Const);
        expect(lDeclarationNode.name).toBe(lVariableName);
        expect(lDeclarationNode.type).toBeInstanceOf(BasePgslTypeDefinition as any);
        expect(lDeclarationNode.expression).toBeInstanceOf(BasePgslExpression as any);
    });

    await pContext.step("Const must be assignable to another const", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with const assignment.
        const lCodeText: string = `
            const testVariable: Float = 3.0;
            const anotherVariable: Float = testVariable;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have no errors.
        expect(lValidationTrace.errors.length).toBe(0);
    });

    await pContext.step("Error - Const without initialization expression", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text without initialization.
        const lCodeText: string = "const testVariable: Float;";

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention const requiring initialization.
        expect(lValidationTrace.errors.some(error => error.message.includes('Declaration type "const" must have an initializer.'))).toBe(true);
    });

    await pContext.step("Error - Const with non-constant expression", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with non-constant expression (assuming variable access is non-constant).
        const lCodeText: string = `
            private otherVariable: Float = 3.0;
            const testVariable: Float = otherVariable;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention const requiring constant expression.
        expect(lValidationTrace.errors.some(error => error.message.includes('The expression of declaration type "const" must be a constant expression.'))).toBe(true);
    });

    await pContext.step("Error - Const with non-constructible type", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with non-constant expression (assuming variable access is non-constant).
        const lCodeText: string = `
            const testVariable: TextureDepth2d = 3.0;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention const requiring constant expression.
        expect(lValidationTrace.errors.some(error => error.message.includes('The type of declaration type "const" must be constructible.'))).toBe(true);
    });

    await pContext.step("Error - Const with type mismatch", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with type mismatch (Float variable with Boolean value).
        const lCodeText: string = "const testVariable: Float = true;";

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention type assignment issue.
        expect(lValidationTrace.errors.some(error => error.message.includes(`Initializing value of type "Boolean" can't be assigned to "Float"`))).toBe(true);
    });

    await pContext.step("Error - Const with invalid attribute", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with invalid attribute.
        const lCodeText: string = `
            [AccessMode(AccessMode.Read)]
            const testVariable: Float = 5.0;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention const not allowing AccessMode attribute.
        expect(lValidationTrace.errors.some(error => error.message.includes('Declaration type "const" does not allow attribute "AccessMode".'))).toBe(true);
    });

    await pContext.step("Transpilation", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "const";
        const lVariableName: string = "testVariable";
        const lVariableValue: string = "5.0";

        // Setup. Code text.
        const lCodeText: string = `${lDeclarationType} ${lVariableName}: Float = ${lVariableValue};`;

        // Setup. Syntax tree.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(new PgslValidationTrace());

        // Execute.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        const lTranspilationResult: string = lDeclarationNode.transpile(new PgslFileMetaInformation());

        // Validation. No errors.
        expect(lTranspilationResult).toBe(`${lDeclarationType} ${lVariableName}: f32 = ${lVariableValue};`);
    });
});

Deno.test("PgslVariableDeclarationSyntaxTree - Storage", async (pContext) => {
    await pContext.step("Default", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "storage";
        const lVariableName: string = "testVariable";
        const lVariableType: string = "Float";

        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            ${lDeclarationType} ${lVariableName}: ${lVariableType};
        `;

        // Execute.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. No errors.
        expect(lValidationTrace.errors).toHaveLength(0);

        // Validation. Correct number of child nodes.
        expect(lSyntaxTree.childNodes).toHaveLength(1);

        // Validation. Correct type of child node.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);

        // Validation. Correct structure.
        expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Storage);
        expect(lDeclarationNode.name).toBe(lVariableName);
        expect(lDeclarationNode.type).toBeInstanceOf(BasePgslTypeDefinition as any);
        expect(lDeclarationNode.expression).toBe(null);
    });

    await pContext.step("Storage with optional AccessMode attribute", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with optional AccessMode attribute.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            [AccessMode(AccessMode.Read)]
            storage testVariable: Float;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have no errors.
        expect(lValidationTrace.errors.length).toBe(0);
    });

    await pContext.step("Error - Storage without required GroupBinding attribute", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text without required GroupBinding.
        const lCodeText: string = "storage testVariable: Float;";

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention missing GroupBinding requirement.
        expect(lValidationTrace.errors.some(error => error.message.includes('Declaration type "storage" requires attribute "GroupBinding".'))).toBe(true);
    });

    await pContext.step("Error - Storage with invalid attribute", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with invalid attribute.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            [Vertex()]
            storage testVariable: Float;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention storage not allowing InvalidAttribute.
        expect(lValidationTrace.errors.some(error => error.message.includes('Declaration type "storage" does not allow attribute "Vertex".'))).toBe(true);
    });

    await pContext.step("Error - Storage with initialization expression", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with initialization.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            storage testVariable: Float = 5.0;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention storage not allowing initializer.
        expect(lValidationTrace.errors.some(error => error.message.includes('Declaration type "storage" must not have an initializer.'))).toBe(true);
    });

    await pContext.step("Error - Storage with non-host-shareable type", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with non-host-shareable type.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            storage testVariable: Sampler;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention host shareable requirement.
        expect(lValidationTrace.errors.some(error => error.message.includes('The type of declaration type "storage" must be host shareable.'))).toBe(true);
    });

    await pContext.step("Transpilation", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "storage";
        const lVariableName: string = "testVariable";

        // Setup. Code text.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            ${lDeclarationType} ${lVariableName}: Float;
        `;

        // Setup. Syntax tree.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(new PgslValidationTrace());

        // Execute.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        const lTranspilationResult: string = lDeclarationNode.transpile(new PgslFileMetaInformation());

        // Validation.
        expect(lTranspilationResult).toBe(`@group(0) @binding(0) var<storage, read> ${lVariableName}: f32;`);
    });
});

Deno.test("PgslVariableDeclarationSyntaxTree - Uniform", async (pContext) => {
    await pContext.step("Default", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "uniform";
        const lVariableName: string = "testVariable";
        const lVariableType: string = "Float";

        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            ${lDeclarationType} ${lVariableName}: ${lVariableType};
        `;

        // Execute.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. No errors.
        expect(lValidationTrace.errors).toHaveLength(0);

        // Validation. Correct number of child nodes.
        expect(lSyntaxTree.childNodes).toHaveLength(1);

        // Validation. Correct type of child node.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);

        // Validation. Correct structure.
        expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Uniform);
        expect(lDeclarationNode.name).toBe(lVariableName);
        expect(lDeclarationNode.type).toBeInstanceOf(BasePgslTypeDefinition as any);
        expect(lDeclarationNode.expression).toBe(null);
    });

    await pContext.step("Uniform with optional AccessMode attribute", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with optional AccessMode attribute.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            [AccessMode(AccessMode.ReadWrite)]
            uniform testVariable: Float;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have no errors.
        expect(lValidationTrace.errors.length).toBe(0);
    });

    await pContext.step("Error - Uniform without required GroupBinding attribute", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text without required GroupBinding.
        const lCodeText: string = "uniform testVariable: Float;";

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention missing GroupBinding requirement.
        expect(lValidationTrace.errors.some(error => error.message.includes('Declaration type "uniform" requires attribute "GroupBinding".'))).toBe(true);
    });

    await pContext.step("Error - Uniform with invalid attribute", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with invalid attribute.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            [Vertex()]
            uniform testVariable: Float;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention uniform not allowing Vertex.
        expect(lValidationTrace.errors.some(error => error.message.includes('Declaration type "uniform" does not allow attribute "Vertex".'))).toBe(true);
    });

    await pContext.step("Error - Uniform with initialization expression", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with initialization.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            uniform testVariable: Float = 5.0;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention uniform not allowing initializer.
        expect(lValidationTrace.errors.some(error => error.message.includes('Declaration type "uniform" must not have an initializer.'))).toBe(true);
    });

    await pContext.step("Error - Uniform with non-constructible type", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with non-constructible type.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            uniform testVariable: TextureDepth2d;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention constructible requirement.
        expect(lValidationTrace.errors.some(error => error.message.includes('The type of declaration type "uniform" must be constructible.'))).toBe(true);
    });

    await pContext.step("Error - Uniform with non-host-shareable type", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with non-host-shareable type.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            uniform testVariable: TextureDepth2d;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention host shareable requirement.
        expect(lValidationTrace.errors.some(error => error.message.includes('The type of declaration type "uniform" must be host shareable.'))).toBe(true);
    });

    await pContext.step("Transpilation - Float type", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "uniform";
        const lVariableName: string = "testVariable";

        // Setup. Code text.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            ${lDeclarationType} ${lVariableName}: Float;
        `;

        // Setup. Syntax tree.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(new PgslValidationTrace());

        // Execute.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        const lTranspilationResult: string = lDeclarationNode.transpile(new PgslFileMetaInformation());

        // Validation.
        expect(lTranspilationResult).toBe(`@group(0) @binding(0) var<uniform> ${lVariableName}: f32;`);
    });

    await pContext.step("Transpilation - Texture type", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "uniform";
        const lVariableName: string = "testTexture";

        // Setup. Code text.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            ${lDeclarationType} ${lVariableName}: TextureDepth2d;
        `;

        // Setup. Syntax tree.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(new PgslValidationTrace());

        // Execute.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        const lTranspilationResult: string = lDeclarationNode.transpile(new PgslFileMetaInformation());

        // Validation.
        expect(lTranspilationResult).toBe(`@group(0) @binding(0) var ${lVariableName}: texture_depth_2d;`);
    });

    await pContext.step("Transpilation - Sampler type", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "uniform";
        const lVariableName: string = "testSampler";

        // Setup. Code text.
        const lCodeText: string = `
            [GroupBinding("test_group", "test_binding")]
            ${lDeclarationType} ${lVariableName}: Sampler;
        `;

        // Setup. Syntax tree.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(new PgslValidationTrace());

        // Execute.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        const lTranspilationResult: string = lDeclarationNode.transpile(new PgslFileMetaInformation());

        // Validation.
        expect(lTranspilationResult).toBe(`@group(0) @binding(0) var ${lVariableName}: sampler;`);
    });
});

Deno.test("PgslVariableDeclarationSyntaxTree - Workgroup", async (pContext) => {
    await pContext.step("Default without initializer", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "workgroup";
        const lVariableName: string = "testVariable";
        const lVariableType: string = "Float";

        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text.
        const lCodeText: string = `${lDeclarationType} ${lVariableName}: ${lVariableType};`;

        // Execute.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. No errors.
        expect(lValidationTrace.errors).toHaveLength(0);

        // Validation. Correct number of child nodes.
        expect(lSyntaxTree.childNodes).toHaveLength(1);

        // Validation. Correct type of child node.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);

        // Validation. Correct structure.
        expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Workgroup);
        expect(lDeclarationNode.name).toBe(lVariableName);
        expect(lDeclarationNode.type).toBeInstanceOf(BasePgslTypeDefinition as any);
        expect(lDeclarationNode.expression).toBe(null);
    });

    await pContext.step("Default with initializer", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "workgroup";
        const lVariableName: string = "testVariable";
        const lVariableType: string = "Float";
        const lVariableValue: string = "5.0";

        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text.
        const lCodeText: string = `${lDeclarationType} ${lVariableName}: ${lVariableType} = ${lVariableValue};`;

        // Execute.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. No errors.
        expect(lValidationTrace.errors).toHaveLength(0);

        // Validation. Correct structure.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Workgroup);
        expect(lDeclarationNode.expression).toBeInstanceOf(BasePgslExpression as any);
    });

    await pContext.step("Error - Workgroup with non-fixed-footprint type", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with non-fixed-footprint type.
        const lCodeText: string = "workgroup testVariable: TextureDepth2d;";

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention fixed footprint requirement.
        expect(lValidationTrace.errors.some(error => error.message.includes('The type of declaration type "workgroup" must have a fixed footprint.'))).toBe(true);
    });

    await pContext.step("Error - Workgroup with non-plain type", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with non-plain type.
        const lCodeText: string = "workgroup testVariable: TextureDepth2d;";

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention plain type requirement.
        expect(lValidationTrace.errors.some(error => error.message.includes('The type of declaration type "workgroup" must be a plain type.'))).toBe(true);
    });

    await pContext.step("Error - Workgroup with type mismatch", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with type mismatch (Float variable with Boolean value).
        const lCodeText: string = "workgroup testVariable: Float = true;";

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention type assignment issue.
        expect(lValidationTrace.errors.some(error => error.message.includes(`Initializing value of type "Boolean" can't be assigned to "Float"`))).toBe(true);
    });

    await pContext.step("Error - Workgroup with invalid attribute", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with invalid attribute.
        const lCodeText: string = `
            [AccessMode(AccessMode.Read)]
            workgroup testVariable: Float;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention workgroup not allowing AccessMode attribute.
        expect(lValidationTrace.errors.some(error => error.message.includes('Declaration type "workgroup" does not allow attribute "AccessMode".'))).toBe(true);
    });

    await pContext.step("Transpilation without initializer", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "workgroup";
        const lVariableName: string = "testVariable";

        // Setup. Code text.
        const lCodeText: string = `${lDeclarationType} ${lVariableName}: Float;`;

        // Setup. Syntax tree.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(new PgslValidationTrace());

        // Execute.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        const lTranspilationResult: string = lDeclarationNode.transpile(new PgslFileMetaInformation());

        // Validation.
        expect(lTranspilationResult).toBe(`var<workgroup> ${lVariableName}: f32;`);
    });

    await pContext.step("Transpilation with initializer", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "workgroup";
        const lVariableName: string = "testVariable";
        const lVariableValue: string = "5.0";

        // Setup. Code text.
        const lCodeText: string = `${lDeclarationType} ${lVariableName}: Float = ${lVariableValue};`;

        // Setup. Syntax tree.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(new PgslValidationTrace());

        // Execute.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        const lTranspilationResult: string = lDeclarationNode.transpile(new PgslFileMetaInformation());

        // Validation.
        expect(lTranspilationResult).toBe(`var<workgroup> ${lVariableName}: f32 = ${lVariableValue};`);
    });
});

Deno.test("PgslVariableDeclarationSyntaxTree - Private", async (pContext) => {
    await pContext.step("Default without initializer", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "private";
        const lVariableName: string = "testVariable";
        const lVariableType: string = "Float";

        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text.
        const lCodeText: string = `${lDeclarationType} ${lVariableName}: ${lVariableType};`;

        // Execute.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. No errors.
        expect(lValidationTrace.errors).toHaveLength(0);

        // Validation. Correct number of child nodes.
        expect(lSyntaxTree.childNodes).toHaveLength(1);

        // Validation. Correct type of child node.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);

        // Validation. Correct structure.
        expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Private);
        expect(lDeclarationNode.name).toBe(lVariableName);
        expect(lDeclarationNode.type).toBeInstanceOf(BasePgslTypeDefinition as any);
        expect(lDeclarationNode.expression).toBe(null);
    });

    await pContext.step("Default with initializer", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "private";
        const lVariableName: string = "testVariable";
        const lVariableType: string = "Float";
        const lVariableValue: string = "5.0";

        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text.
        const lCodeText: string = `${lDeclarationType} ${lVariableName}: ${lVariableType} = ${lVariableValue};`;

        // Execute.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. No errors.
        expect(lValidationTrace.errors).toHaveLength(0);

        // Validation. Correct structure.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Private);
        expect(lDeclarationNode.expression).toBeInstanceOf(BasePgslExpression as any);
    });

    await pContext.step("Error - Private with non-constructible type", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with non-constructible type.
        const lCodeText: string = "private testVariable: TextureDepth2d;";

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention constructible requirement.
        expect(lValidationTrace.errors.some(error => error.message.includes('The type of declaration type "private" must be constructible.'))).toBe(true);
    });

    await pContext.step("Error - Private with type mismatch", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with type mismatch (Float variable with Boolean value).
        const lCodeText: string = "private testVariable: Float = true;";

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention type assignment issue.
        expect(lValidationTrace.errors.some(error => error.message.includes(`Initializing value of type "Boolean" can't be assigned to "Float"`))).toBe(true);
    });

    await pContext.step("Error - Private with invalid attribute", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with invalid attribute.
        const lCodeText: string = `
            [AccessMode(AccessMode.Read)]
            private testVariable: Float;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention private not allowing AccessMode attribute.
        expect(lValidationTrace.errors.some(error => error.message.includes('Declaration type "private" does not allow attribute "AccessMode".'))).toBe(true);
    });

    await pContext.step("Transpilation without initializer", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "private";
        const lVariableName: string = "testVariable";

        // Setup. Code text.
        const lCodeText: string = `${lDeclarationType} ${lVariableName}: Float;`;

        // Setup. Syntax tree.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(new PgslValidationTrace());

        // Execute.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        const lTranspilationResult: string = lDeclarationNode.transpile(new PgslFileMetaInformation());

        // Validation.
        expect(lTranspilationResult).toBe(`var<private> ${lVariableName}: f32;`);
    });

    await pContext.step("Transpilation with initializer", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "private";
        const lVariableName: string = "testVariable";
        const lVariableValue: string = "5.0";

        // Setup. Code text.
        const lCodeText: string = `${lDeclarationType} ${lVariableName}: Float = ${lVariableValue};`;

        // Setup. Syntax tree.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(new PgslValidationTrace());

        // Execute.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        const lTranspilationResult: string = lDeclarationNode.transpile(new PgslFileMetaInformation());

        // Validation.
        expect(lTranspilationResult).toBe(`var<private> ${lVariableName}: f32 = ${lVariableValue};`);
    });
});

Deno.test("PgslVariableDeclarationSyntaxTree - Param", async (pContext) => {
    await pContext.step("Default", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "param";
        const lVariableName: string = "testVariable";
        const lVariableType: string = "Float";
        const lVariableValue: string = "5.0";

        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text.
        const lCodeText: string = `${lDeclarationType} ${lVariableName}: ${lVariableType} = ${lVariableValue};`;

        // Execute.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. No errors.
        expect(lValidationTrace.errors).toHaveLength(0);

        // Validation. Correct number of child nodes.
        expect(lSyntaxTree.childNodes).toHaveLength(1);

        // Validation. Correct type of child node.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);

        // Validation. Correct structure.
        expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Param);
        expect(lDeclarationNode.name).toBe(lVariableName);
        expect(lDeclarationNode.type).toBeInstanceOf(BasePgslTypeDefinition as any);
        expect(lDeclarationNode.expression).toBeInstanceOf(BasePgslExpression as any);
    });

    await pContext.step("Error - Param without initialization expression", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text without initialization.
        const lCodeText: string = "param testVariable: Float;";

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention param requiring initialization.
        expect(lValidationTrace.errors.some(error => error.message.includes('Declaration type "param" must have an initializer.'))).toBe(true);
    });

    await pContext.step("Error - Param with non-constructible type", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with non-constructible type.
        const lCodeText: string = "param testVariable: TextureDepth2d = 5.0;";

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention constructible requirement.
        expect(lValidationTrace.errors.some(error => error.message.includes('The type of declaration type "param" must be constructible.'))).toBe(true);
    });

    await pContext.step("Error - Param with non-scalar type", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with non-scalar type.
        const lCodeText: string = "param testVariable: TextureDepth2d = true;";

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention scalar type requirement.
        expect(lValidationTrace.errors.some(error => error.message.includes('The type of declaration type "param" must be a scalar type.'))).toBe(true);
    });

    await pContext.step("Error - Param with type mismatch", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with type mismatch (Float variable with Boolean value).
        const lCodeText: string = "param testVariable: Float = true;";

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention type assignment issue.
        expect(lValidationTrace.errors.some(error => error.message.includes(`Initializing value of type "Boolean" can't be assigned to "Float"`))).toBe(true);
    });

    await pContext.step("Error - Param with invalid attribute", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslValidationTrace();

        // Setup. Code text with invalid attribute.
        const lCodeText: string = `
            [AccessMode(AccessMode.Read)]
            param testVariable: Float = 5.0;
        `;

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);

        // Validation. Error should mention param not allowing AccessMode attribute.
        expect(lValidationTrace.errors.some(error => error.message.includes('Declaration type "param" does not allow attribute "AccessMode".'))).toBe(true);
    });

    await pContext.step("Transpilation", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "param";
        const lVariableName: string = "testVariable";
        const lVariableValue: string = "5.0";

        // Setup. Code text.
        const lCodeText: string = `${lDeclarationType} ${lVariableName}: Float = ${lVariableValue};`;

        // Setup. Syntax tree.
        const lSyntaxTree: PgslDocument = gPgslParser.parse(lCodeText).validate(new PgslValidationTrace());

        // Execute.
        const lDeclarationNode: PgslVariableDeclaration = lSyntaxTree.childNodes[0] as PgslVariableDeclaration;
        const lTranspilationResult: string = lDeclarationNode.transpile(new PgslFileMetaInformation());

        // Validation.
        expect(lTranspilationResult).toBe(`override ${lVariableName}: f32 = ${lVariableValue};`);
    });
});