import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from "../../../source/parser/pgsl-parser.ts";
import { PgslSyntaxDocument } from "../../../source/syntax_tree/pgsl-syntax-document.ts";
import { PgslVariableDeclarationSyntaxTree } from "../../../source/syntax_tree/declaration/pgsl-variable-declaration-syntax-tree.ts";
import { PgslDeclarationType } from "../../../source/enum/pgsl-declaration-type.enum.ts";
import { BasePgslTypeDefinitionSyntaxTree } from "../../../source/syntax_tree/type/base-pgsl-type-definition-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree } from "../../../source/syntax_tree/expression/base-pgsl-expression-syntax-tree.ts";

// Create parser instance with enabled validation.
const gPgslParser: PgslParser = new PgslParser();
gPgslParser.enableValidation = true;

Deno.test("PgslVariableDeclarationSyntaxTree - Const", async (pContext) => {
    await pContext.step("Default", async () => {
        // Setup. Code blocks.
        const lDeclarationType: string = "const";
        const lVariableName: string = "testVariable";
        const lVariableType: string = "Float";
        const lVariableValue: string = "5.0";

        // Setup. Code text.
        const lCodeText: string = `${lDeclarationType} ${lVariableName}: ${lVariableType} = ${lVariableValue};`;

        // Execute.
        const lSyntaxTree: PgslSyntaxDocument = gPgslParser.parse(lCodeText);

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

    // TODO: Check for error when:
    // - Using const without initialization expression.
    // - Using const with non-constant expression.
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