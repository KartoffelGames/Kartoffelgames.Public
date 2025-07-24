import { CodeParserException } from '@kartoffelgames/core-parser';
import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from '../../../source/pgsl/parser/pgsl-parser.ts';
import { PgslModuleSyntaxTree } from '../../../source/pgsl/syntax_tree/pgsl-module-syntax-tree.ts';
import { PgslVariableDeclarationSyntaxTree } from '../../../source/pgsl/syntax_tree/declaration/pgsl-variable-declaration-syntax-tree.ts';
import { PgslDeclarationType } from '../../../source/pgsl/enum/pgsl-declaration-type.enum.ts';

const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslParser.parse() - Module scope variable declarations - General', async (pContext) => {
    await pContext.step('Basic properties', async (pContext) => {
        await pContext.step('Correct name', () => {
            // Setup.
            const lVariableName: string = 'testVariableName';
            const lSourceCode: string = `
                const ${lVariableName}: Integer = 10;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);
            const lResultDeclaration: PgslVariableDeclarationSyntaxTree = lResult.getScopedValue(lVariableName) as PgslVariableDeclarationSyntaxTree;

            // Evaluation.
            expect(lResultDeclaration.name).toBe(lVariableName);
        });

        await pContext.step('Correct declaration type', () => {
            // Setup.
            const lVariableName: string = 'testVariableName';
            const lExpectedDeclarationType = PgslDeclarationType.Const;
            const lSourceCode: string = `
                const ${lVariableName}: Integer = 10;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);
            const lResultDeclaration: PgslVariableDeclarationSyntaxTree = lResult.getScopedValue(lVariableName) as PgslVariableDeclarationSyntaxTree;

            // Evaluation.
            expect(lResultDeclaration.declarationType).toBe(lExpectedDeclarationType);
        });
    });

    await pContext.step('Error cases', async (pContext) => {
        await pContext.step('Error: Wrong type assignment', () => {
            // Setup.
            const lSourceCode: string = `
                const testVariable: Integer = 10f;
            `;

            // Process.
            const lErrorFunction = () => {
                gPgslParser.parse(lSourceCode);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(CodeParserException);
        });
    });
});

Deno.test('PgslParser.parse() - Module scope variable declarations - Const declaration', async (pContext) => {
    await pContext.step('Valid const declarations', async (pContext) => {
        await pContext.step('Correct constant flag', () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lSourceCode: string = `
                const ${lVariableName}: Integer = 10;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);
            const lResultDeclaration: PgslVariableDeclarationSyntaxTree = lResult.getScopedValue(lVariableName) as PgslVariableDeclarationSyntaxTree;

            // Evaluation.
            expect(lResultDeclaration.isConstant).toBe(true);
        });

        await pContext.step('Declaration with const value', () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lSourceCode: string = `
                const ${lVariableName}: Integer = 10;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);
            const lResultDeclaration: PgslVariableDeclarationSyntaxTree = lResult.getScopedValue(lVariableName) as PgslVariableDeclarationSyntaxTree;

            // Evaluation.
            expect(lResultDeclaration.isConstant).toBe(true);
        });

        await pContext.step('Declaration with const expression', () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lSourceCode: string = `
                const otherConst: Integer = 10;
                const ${lVariableName}: Integer = 10 * otherConst;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);
            const lResultDeclaration: PgslVariableDeclarationSyntaxTree = lResult.getScopedValue(lVariableName) as PgslVariableDeclarationSyntaxTree;

            // Evaluation.
            expect(lResultDeclaration.isConstant).toBe(true);
        });

        await pContext.step('Const declaration with attributes', () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lAttributeName: string = 'CustomAttribute';
            const lSourceCode: string = `
                [${lAttributeName}()]
                const ${lVariableName}: Integer = 10;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);
            const lResultDeclaration: PgslVariableDeclarationSyntaxTree = lResult.getScopedValue(lVariableName) as PgslVariableDeclarationSyntaxTree;
            const lAttribute = lResultDeclaration.attributes.getAttribute(lAttributeName);

            // Evaluation.
            expect(lAttribute).not.toBeNull();
        });
    });

    await pContext.step('Error cases', async (pContext) => {
        await pContext.step('Error: Const declaration with non-const assignment', () => {
            // Setup.
            const lSourceCode: string = `
                private notAConst: Integer = 10;
                const testVariable: Integer = notAConst;
            `;

            // Process.
            const lErrorFunction = () => {
                gPgslParser.parse(lSourceCode);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(CodeParserException);
        });

        await pContext.step('Error: Const declaration without assignment', () => {
            // Setup.
            const lSourceCode: string = `
                const testVariable: Integer;
            `;

            // Process.
            const lErrorFunction = () => {
                gPgslParser.parse(lSourceCode);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(CodeParserException);
        });
    });
});

Deno.test('PgslParser.parse() - Module scope variable declarations - Param declaration', async (pContext) => {
    await pContext.step('Valid param declarations', async (pContext) => {
        await pContext.step('Declaration with const value', () => {
            // Setup.
            const lSourceCode: string = `
                param testVariable: Integer = 10;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });

        await pContext.step('Declaration with other param expression', () => {
            // Setup.
            const lSourceCode: string = `
                param otherParam: Integer = 10;
                param testVariable: Integer = 10 * otherParam;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });

        await pContext.step('Declaration with const expression', () => {
            // Setup.
            const lSourceCode: string = `
                const otherConst: Integer = 10;
                param testVariable: Integer = 10 * otherConst;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });
    });

    await pContext.step('Error cases', async (pContext) => {
        await pContext.step('Error: Param declaration without assignment', () => {
            // Setup.
            const lSourceCode: string = `
                param testVariable: Integer;
            `;

            // Process.
            const lErrorFunction = () => {
                gPgslParser.parse(lSourceCode);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(CodeParserException);
        });

        await pContext.step('Error: Param declaration with attributes', () => {
            // Setup.
            const lSourceCode: string = ` 
                [Attribute]
                param testVariable: Integer = 1;
            `;

            // Process.
            const lErrorFunction = () => {
                gPgslParser.parse(lSourceCode);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(CodeParserException);
        });
    });
});

Deno.test('PgslParser.parse() - Module scope variable declarations - Private declaration', async (pContext) => {
    await pContext.step('Valid private declarations', async (pContext) => {
        await pContext.step('Declaration with const value assignment', () => {
            // Setup.
            const lSourceCode: string = `
                private testVariable: Integer = 10;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });

        await pContext.step('Declaration without assignment', () => {
            // Setup.
            const lSourceCode: string = `
                private testVariable: Integer;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });

        await pContext.step('Declaration with expression value assignment', () => {
            // Setup.
            const lSourceCode: string = `
                private testVariable: Integer = 10 + 11;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });
    });

    await pContext.step('Error cases', async (pContext) => {
        await pContext.step('Error: Private declaration with attributes', () => {
            // Setup.
            const lSourceCode: string = `
                [Attribute]
                private testVariable: Integer;
            `;

            // Process.
            const lErrorFunction = () => {
                gPgslParser.parse(lSourceCode);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(CodeParserException);
        });
    });
});

Deno.test('PgslParser.parse() - Module scope variable declarations - Workgroup declaration', async (pContext) => {
    await pContext.step('Valid workgroup declarations', async (pContext) => {
        await pContext.step('Declaration with expression value', () => {
            // Setup.
            const lSourceCode: string = `
                workgroup testVariable: Integer;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });
    });

    await pContext.step('Error cases', async (pContext) => {
        await pContext.step('Error: Workgroup declaration with assignment', () => {
            // Setup.
            const lSourceCode: string = `
                workgroup testVariable: Integer = 10;
            `;

            // Process.
            const lErrorFunction = () => {
                gPgslParser.parse(lSourceCode);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(CodeParserException);
        });

        await pContext.step('Error: Workgroup declaration with attributes', () => {
            // Setup.
            const lSourceCode: string = `
                [Attribute]
                workgroup testVariable: Integer;
            `;

            // Process.
            const lErrorFunction = () => {
                gPgslParser.parse(lSourceCode);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(CodeParserException);
        });
    });
});

Deno.test('PgslParser.parse() - Module scope variable declarations - Uniform declaration', async (pContext) => {
    await pContext.step('Valid uniform declarations', async (pContext) => {
        await pContext.step('Declaration with const value', () => {
            // Setup.
            const lSourceCode: string = `
                uniform testVariable: Integer = 10;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });
    });

    await pContext.step('Error cases', async (pContext) => {
        await pContext.step('Error: Uniform declaration without binding', () => {
            // Setup.
            const lSourceCode: string = `
                uniform testVariable: Integer;
            `;

            // Process.
            const lErrorFunction = () => {
                gPgslParser.parse(lSourceCode);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(CodeParserException);
        });

        await pContext.step('Error: Uniform declaration with assignment', () => {
            // Setup.
            const lSourceCode: string = `
                [GroupBinding(x, y)]
                uniform testVariable: Integer = 10;
            `;

            // Process.
            const lErrorFunction = () => {
                gPgslParser.parse(lSourceCode);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(CodeParserException);
        });
    });
});

Deno.test('PgslParser.parse() - Module scope variable declarations - Storage declaration', async (pContext) => {
    await pContext.step('Valid storage declarations', async (pContext) => {
        await pContext.step('Declaration with read access', () => {
            // Setup.
            const lSourceCode: string = `
                [GroupBinding(x, y)]
                [AccessMode(AccessMode.Read)]
                storage testVariable: Integer;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });

        await pContext.step('Declaration with write access', () => {
            // Setup.
            const lSourceCode: string = `
                [GroupBinding(x, y)]
                [AccessMode(AccessMode.Write)]
                storage testVariable: Integer;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });

        await pContext.step('Declaration with read write access', () => {
            // Setup.
            const lSourceCode: string = `
                [GroupBinding(x, y)]
                [AccessMode(AccessMode.ReadWrite)]
                storage testVariable: Integer;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });
    });

    await pContext.step('Error cases', async (pContext) => {
        await pContext.step('Error: Storage declaration without binding', () => {
            // Setup.
            const lSourceCode: string = `
                [AccessMode(AccessMode.ReadWrite)]
                storage testVariable: Integer;
            `;

            // Process.
            const lErrorFunction = () => {
                gPgslParser.parse(lSourceCode);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(CodeParserException);
        });

        await pContext.step('Error: Storage declaration without access mode', () => {
            // Setup.
            const lSourceCode: string = `
                [GroupBinding(x, y)]
                storage testVariable: Integer;
            `;

            // Process.
            const lErrorFunction = () => {
                gPgslParser.parse(lSourceCode);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(CodeParserException);
        });

        await pContext.step('Error: Storage declaration with assignment', () => {
            // Setup.
            const lSourceCode: string = `
                [GroupBinding(x, y)]
                [AccessMode(AccessMode.ReadWrite)]
                storage testVariable: Integer = 10;
            `;

            // Process.
            const lErrorFunction = () => {
                gPgslParser.parse(lSourceCode);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(CodeParserException);
        });
    });
});

Deno.test('PgslParser.parse() - Template list', async (pContext) => {
    await pContext.step('Template list variations', async (pContext) => {
        await pContext.step('Single', () => {
            // Setup.
            const lSourceCode: string = `
                private testVariable: Array<Integer>;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });

        await pContext.step('List', () => {
            // Setup.
            const lSourceCode: string = `
                const testVariable: Array<Integer, 3>;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });

        await pContext.step('Nested', () => {
            // Setup.
            const lSourceCode: string = `
                const testVariable: Array<Vector2<Integer>, 2>;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });
    });
});

Deno.test('PgslParser.parse() - Expression - Variable expression', async (pContext) => {
    await pContext.step('Variable access types', async (pContext) => {
        await pContext.step('Variable name', () => {
            // Setup.
            const lSourceCode: string = `
                const testVariable: Integer = 10;

                function test(): void {
                    let value: Integer = testVariable;
                }
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });

        await pContext.step('Index value', () => {
            // Setup.
            const lSourceCode: string = `
                function test(): void {
                    let testVariable: Array<Integer, 3> = new Array<Integer, 3>(1, 2, 3);

                    let value: Integer = testVariable[10];
                }
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });

        await pContext.step('Composite value', () => {
            // Setup.
            const lSourceCode: string = `
                struct TestStruct {
                    prop: Integer
                }

                function test(): void {
                    let testVariable: TestStruct;

                    let value: Integer = testVariable.prop;
                }
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });
    });
});