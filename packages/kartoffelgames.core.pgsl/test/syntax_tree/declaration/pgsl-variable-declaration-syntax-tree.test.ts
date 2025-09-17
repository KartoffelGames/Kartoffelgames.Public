import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from "../../../source/parser/pgsl-parser.ts";
import { PgslSyntaxDocument } from "../../../source/syntax_tree/pgsl-syntax-document.ts";
import { PgslVariableDeclarationSyntaxTree } from "../../../source/syntax_tree/declaration/pgsl-variable-declaration-syntax-tree.ts";
import { PgslDeclarationType } from "../../../source/enum/pgsl-declaration-type.enum.ts";
import { BasePgslTypeDefinitionSyntaxTree } from "../../../source/syntax_tree/type/base-pgsl-type-definition-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree } from "../../../source/syntax_tree/expression/base-pgsl-expression-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../../../source/syntax_tree/pgsl-syntax-tree-validation-trace.ts";

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
        const lValidationTrace = new PgslSyntaxTreeValidationTrace();

        // Setup. Code text.
        const lCodeText: string = `${lDeclarationType} ${lVariableName}: ${lVariableType} = ${lVariableValue};`;

        // Execute.
        const lSyntaxTree: PgslSyntaxDocument = gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. No errors.
        expect(lValidationTrace.errors).toHaveLength(0);

        // Validation. Correct number of child nodes.
        expect(lSyntaxTree.childNodes).toHaveLength(1);

        // Validation. Correct type of child node.
        const lDeclarationNode: PgslVariableDeclarationSyntaxTree = lSyntaxTree.childNodes[0] as PgslVariableDeclarationSyntaxTree;
        expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclarationSyntaxTree);

        // Validation. Correct structure.
        expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Const);
        expect(lDeclarationNode.name).toBe(lVariableName);
        expect(lDeclarationNode.type).toBeInstanceOf(BasePgslTypeDefinitionSyntaxTree as any);
        expect(lDeclarationNode.expression).toBeInstanceOf(BasePgslExpressionSyntaxTree as any);
    });

    await pContext.step("Error - Const without initialization expression", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslSyntaxTreeValidationTrace();

        // Setup. Code text without initialization.
        const lCodeText: string = "const testVariable: Float;";

        // Execute.
        gPgslParser.parse(lCodeText).validate(lValidationTrace);

        // Validation. Should have errors.
        expect(lValidationTrace.errors.length).toBeGreaterThan(0);
        
        // Validation. Error should mention const requiring initialization.
        expect(lValidationTrace.errors.some(error => error.message === 'Declaration type "const" must have an initializer.')).toBe(true);
    });

    await pContext.step("Error - Const with non-constant expression", async () => {
        // Setup. Validation trace.
        const lValidationTrace = new PgslSyntaxTreeValidationTrace();

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
        expect(lValidationTrace.errors.some(error => error.message === 'The expression of declaration type "const" must be a constant expression.')).toBe(true);
    });
});

Deno.test("PgslVariableDeclarationSyntaxTree - Storage", async (pContext) => {
    await pContext.step("", async () => {});
});

Deno.test("PgslVariableDeclarationSyntaxTree - Uniform", async (pContext) => {
    await pContext.step("", async () => {});
});

Deno.test("PgslVariableDeclarationSyntaxTree - Workgroup", async (pContext) => {
    await pContext.step("", async () => {});
});

Deno.test("PgslVariableDeclarationSyntaxTree - Private", async (pContext) => {
    await pContext.step("", async () => {});
});

Deno.test("PgslVariableDeclarationSyntaxTree - Param", async (pContext) => {
    await pContext.step("", async () => {});
});