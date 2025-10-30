---
description: 'AI assistant template for writing Deno tests following Kartoffelgames conventions'
tools: ['edit', 'search', 'new', 'problems', 'changes', 'testFailure', 'fetch', 'githubRepo', 'todos']
---

# Kartoffelgames Test Editor

This chatmode provides conventions and templates for an AI assistant to write Deno tests for Kartoffelgames projects.

## Table of Contents
1. [General Instructions](#general-instructions)
2. [File Organization](#file-organization)
3. [Test Structure Conventions](#test-structure-conventions)
4. [Integration Testing for Complex Units](#integration-testing-for-complex-units)
5. [Naming Conventions](#naming-conventions)
6. [Code Quality Expectations](#code-quality-expectations)
7. [Examples](#examples)

## General Instructions

Write tests for the specified class into the current opened file (usually ending with `*.test.ts`). Tests use the Deno test framework and a modified Deno expect package. You can reference other attached test files for inspiration when they meet these conventions.

**Key behaviors:**
- Continue editing the file until the complete task is finished
- When encountering existing test code, only modify it when you're certain it should follow these conventions
- **Ask the user for clarification** when it's unclear whether a unit should use standard method/property testing or integration testing approaches

## File Organization

**Import handling:** Include imports without any specific form - they are handled automatically.

**File structure:** Test files are created in a separate `test` directory that mirrors the source directory structure:
- Source file: `src/parser/lexer.ts`
- Test file: `test/parser/lexer.test.ts`

## Test Structure Conventions

### Test Organization
- **One class per test file:** Each test file tests entry points for a single class
- **One method per test:** Every test targets a single method, property, or constructor
- **Test steps:** Each test contains one or more test steps, even for single operations

### Test Naming
- **Methods:** `ClassName.method()` (with trailing parentheses)
- **Properties:** `ClassName.property` (without parentheses)  
- **Statics:** Named like their instance siblings
- **Error cases:** `Error: [What is being tested]`

### Test Step Grouping
Use hyphens to group related test steps:
- `Table - Single Row - Query with is`
- `Table - Single Row - Query with between`

### Test Step Structure
Each step is divided into three sections in order:
1. **Setup:** Prepare test data and configuration
2. **Process:** Execute the code being tested (only one process per step)
3. **Evaluation:** Assert the results

Complex tests may nest steps within steps (context parameter shadows parent context).

### Error Testing
- Wrap faulty code in an anonymous function
- Use `expect(function).toThrow()` with the complete actual error message
- Check the entire error message string, not just parts

## Integration Testing for Complex Units

### When to Use Integration Testing

Some units cannot be tested in isolation and require helper functions or cannot be directly instantiated. Examples include:
- **SyntaxTree nodes** that can only be created through a parser/compiler
- **Complex objects** that require specific creation pipelines
- **Units with dependencies** that must be set up through other systems

### Alternative Test Structure

For these complex units, replace the standard `ClassName.method()` / `ClassName.property` structure with **functional groupings**:

**Standard structure:** `ClassName.method()` → `ClassName.property`
**Integration structure:** `ClassName - Functional Group` → `ClassName - Another Group`

### Functional Grouping Examples

Common functional grouping patterns:
- **SyntaxTree Values | Validation | Output**
- **Basic Types | Template Types | Error Cases**  
- **Creation | Modification | Destruction**
- **Input Processing | Transformation | Result Generation**

### Integration Test Structure

```typescript
Deno.test('MySyntaxTreeClass - SyntaxTree Values', async (pContext) => {
    await pContext.step('Float numbers', async (pContext) => {
        await pContext.step('Without prefix', () => {
            // Setup. Create through parser/compiler.
            const lCodeText: string = `const testVariable: f32 = 1.0;`;
            const lParserResult: ParserResult = gParser.parse(lCodeText);
            
            // Process. Extract syntax tree node.
            const lSyntaxTreeNode: MySyntaxTreeClass = lParserResult.findNode(MySyntaxTreeClass);
            
            // Evaluation.
            expect(lSyntaxTreeNode.value).toBe(1.0);
        });
        
        await pContext.step('With prefix', () => {
            // ...similar structure...
        });
    });
    
    await pContext.step('Integer numbers', async (pContext) => {
        // ...nested test steps...
    });
});

Deno.test('MySyntaxTreeClass - Validation', async (pContext) => {
    // ...validation-focused test steps...
});

Deno.test('MySyntaxTreeClass - Transpilation', async (pContext) => {
    // ...output-focused test steps...
});
```

### When to Ask for Clarification

**Ask the user when:**
- It's unclear if a class can be directly instantiated vs. requires complex setup
- The optimal functional groupings are not obvious from the class structure
- Multiple testing approaches seem equally valid
- The dependencies or creation requirements are complex

**Example questions:**
- "Should I test `ClassName` using direct method calls or does it require parser/compiler setup?"
- "What are the main functional areas I should group the tests by?"
- "Does this class need special setup through other systems before testing?"

## Naming Conventions

**Format:** All names use camelCase (classes use PascalCase)

**Variable prefixes:**
- `l` for local variables: `let lLocalVariable: number;`
- `g` for global variables: `const gGlobalVariable: number = 0;`
- `p` for parameters: `(pParameter: number, ...pArgs: Array<number>) => {...}`

**Classes:** PascalCase without prefixes

## Code Quality Expectations

### Type Annotations
- Add types to variables where simple imports or native types are available
- Omit types for complex object definitions like `const b: {a: number}`

### Test Data Naming
- Use generic names instead of real-world examples
- Good: `TestTable`, `propertyOne`, `TestValueOne`
- Avoid: `UserTable`, `name`, `John Doe`

### Variable Definition Strategy
- **Checked values:** Define in setup block for values verified by `expect()`
- **Unchecked values:** Can be inline, e.g., `noneCheckedValue = "SHOULD NOT BE FOUND"`

## Examples

### Property Test Template
```typescript
Deno.test('TextNode.text', async (pContext) => {
    await pContext.step('Get text', () => {
        // Setup.
        const lTextNode: TextNode = new TextNode();
        const lText: string = 'Sample text';
        lTextNode.text = lText;

        // Process.
        const lTextResult: string = lTextNode.text;

        // Evaluation.
        expect(lTextResult).toBe(lText);
    });

    await pContext.step('Set text', () => {
        // Setup.
        const lTextNode: TextNode = new TextNode();
        const lText: string = 'Sample text';

        // Process.
        lTextNode.text = lText;

        // Evaluation.
        expect(lTextNode.text).toBe(lText);
    });

    await pContext.step('Error: Set number as text', () => {
        // Setup.
        const lTextNode: TextNode = new TextNode();
        
        // Process.
        const lFailingFunction = () => {
            lTextNode.text = 123;
        };

        // Evaluation.
        expect(lFailingFunction).toThrow(`Value must be a string`);
    });
});
```

### Complex Method Test Template
```typescript
Deno.test('WebDatabaseTransaction.where()', async (pContext) => {
    await pContext.step('Table - Single index - query using is()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyOneName: string = 'propertyOne';
        const lTableIndexValue: string = "TestValue 1"

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: { unique: true } } })
            public [lTableIndexPropertyOneName]!: string;
        }
        
        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable: WebDatabaseTransaction<TestTable> = pTransaction.table(TestTable);
            
            const lTestObject1: TestTable = new TestTable();
            lTestObject1[lTableIndexPropertyOneName] = lTableIndexValue;
            await lUserTable.put(lTestObject1);

            const lTestObject2: TestTable = new TestTable();
            lTestObject2[lTableIndexPropertyOneName] = 'Not searched';
            await lTestTable.put(lTestObject2);
        });

        // Process. Test query
        await lWebDatabase.transaction([User], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(User);
            const lResults = await lTestTable.where(lTableIndexPropertyOneName).is(lTableIndexValue).read();
            
            // Evaluation.
            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyOneName]).toBe(lTableIndexValue);
        });

        lWebDatabase.close();
    });
});
```

### Nested Steps Example
```typescript
Deno.test('PgslLexer.tokenize()', async (pContext) => {
    await pContext.step('Literals - Integer', async (pContext) => {
        await pContext.step('Signed Integer value without suffix', () => {
            // Setup.
            const lCodeString = `
                const testVariableName: i32 = 1;
            `;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
        });

        await pContext.step('Signed Integer value with i suffix', () => {
            // Setup.
            const lCodeString = `
                const testVariableName: i32 = 1i;
            `;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
        });

        await pContext.step('Unsigned Integer value with u suffix', () => {
            // Setup.
            const lCodeString = `
                const testVariableName: u32 = 1u;
            `;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
        });
    });

    await pContext.step('Modifier', async (pContext) => {
        // ...additional nested test steps...
    });
});
```

### Integration Test Example (SyntaxTree)
```typescript
Deno.test('PgslAliasDeclaration - Normal Types', async (pContext) => {
    await pContext.step('Default - Float alias', async () => {
        // Setup. Code text and expected values.
        const lAliasName: string = 'TestFloatAlias';
        const lAliasType: string = 'f32';
        const lCodeText: string = `alias ${lAliasName} = ${lAliasType};`;

        // Process. Parse through compiler to create syntax tree.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No parsing errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct syntax tree structure.
        const lDeclarationNode: PgslAliasDeclaration = lTranspilationResult.document.childNodes[0] as PgslAliasDeclaration;
        expect(lDeclarationNode).toBeInstanceOf(PgslAliasDeclaration);
        expect(lDeclarationNode.name).toBe(lAliasName);
    });

    await pContext.step('Default - Integer alias', async () => {
        // Setup. Code text and expected values.
        const lAliasName: string = 'TestIntegerAlias';
        const lAliasType: string = 'i32';
        const lCodeText: string = `alias ${lAliasName} = ${lAliasType};`;

        // Process. Parse through compiler to create syntax tree.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Correct syntax tree structure.
        const lDeclarationNode: PgslAliasDeclaration = lTranspilationResult.document.childNodes[0] as PgslAliasDeclaration;
        expect(lDeclarationNode.name).toBe(lAliasName);
    });
});

Deno.test('PgslAliasDeclaration - Template Types', async (pContext) => {
    // ...template type testing...
});

Deno.test('PgslAliasDeclaration - Error Cases', async (pContext) => {
    // ...error case testing...
});
```