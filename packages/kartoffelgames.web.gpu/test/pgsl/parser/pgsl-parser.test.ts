import { ParserException } from '@kartoffelgames/core.parser';
import { expect } from 'chai';
import { PgslParser } from '../../../source/pgsl/parser/pgsl-parser';
import { PgslModuleSyntaxTree } from '../../../source/pgsl/syntax_tree/pgsl-module-syntax-tree';

describe('PsglParser', () => {
    const lPgslParser: PgslParser = new PgslParser();

    describe('-- Modulescope variable declarations', () => {
        describe('-- const declaration', () => {
            it('-- Declaration with const value', () => {
                // Setup.
                const lSourceCode: string = `
                    const myInt: Integer = 10;
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration with const expression', () => {
                // Setup.
                const lSourceCode: string = `
                    const otherConst: Integer = 10;
                    const myInt: Integer = 10 * otherConst;
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Reject const declaration without assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    const myInt: Integer;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation. // TODO:
                expect(lErrorFunction).to.throw(ParserException);
            });

            it('-- Reject const declaration with attributes', () => {
                // Setup.
                const lSourceCode: string = `
                    [Attribute]
                    const myInt: Integer = 1;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation. // TODO:
                expect(lErrorFunction).to.throw(ParserException);
            });
        });

        describe('-- param declaration', () => {
            it('-- Declaration with const value', () => {
                // Setup.
                const lSourceCode: string = `
                    param myInt: Integer = 10;
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration with other param expression', () => {
                // Setup.
                const lSourceCode: string = `
                    param otherParam: Integer = 10;
                    param myInt: Integer = 10 * otherParam;
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration with const expression', () => {
                // Setup.
                const lSourceCode: string = `
                    const otherConst: Integer = 10;
                    param myInt: Integer = 10 * otherConst;
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Reject param declaration without assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    param myInt: Integer;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation. // TODO:
                expect(lErrorFunction).to.throw(ParserException);
            });

            it('-- Reject param declaration with attributes', () => {
                // Setup.
                const lSourceCode: string = ` 
                    [Attribute]
                    param myInt: Integer = 1;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation. // TODO:
                expect(lErrorFunction).to.throw(ParserException);
            });
        });

        describe('-- private declaration', () => {
            it('-- Declaration with const value assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    private myInt: Integer = 10;
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration without assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    private myInt: Integer;
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration with expression value assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    private myInt: Integer = 10 + 11;
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Reject private declaration with attributes', () => {
                // Setup.
                const lSourceCode: string = `
                    [Attribute]
                    private myInt: Integer;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation. // TODO:
                expect(lErrorFunction).to.throw(ParserException);
            });
        });

        describe('-- workgroup declaration', () => { // TODO: Better naming
            it('-- Declaration with expression value', () => {
                // Setup.
                const lSourceCode: string = `
                    workgroup myInt: Integer;
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Reject workgroup declaration with assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    workgroup myInt: Integer = 10;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation. // TODO:
                expect(lErrorFunction).to.throw(ParserException);
            });

            it('-- Reject workgroup declaration with attributes', () => {
                // Setup.
                const lSourceCode: string = `
                    [Attribute]
                    workgroup myInt: Integer;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation. // TODO:
                expect(lErrorFunction).to.throw(ParserException);
            });
        });

        describe('-- uniform declaration', () => {
            it('-- Declaration with const value', () => {
                // Setup.
                const lSourceCode: string = `
                    uniform myInt: Integer = 10;
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Reject uniform declaration without binding', () => {
                // Setup.
                const lSourceCode: string = `
                    uniform myInt: Integer;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation. // TODO:
                expect(lErrorFunction).to.throw(ParserException);
            });

            it('-- Reject uniform declaration with assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    [GroupBinding(x, y)]
                    uniform myInt: Integer = 10;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation. // TODO:
                expect(lErrorFunction).to.throw(ParserException);
            });

            // TODO: sampler and texture values.
        });

        describe('-- storage declaration', () => {
            it('-- Declaration with read access', () => {
                // Setup.
                const lSourceCode: string = `
                    [GroupBinding(x, y)]
                    [AccessMode(AccessMode.Read)]
                    storage myInt: Integer;
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration with write access', () => {
                // Setup.
                const lSourceCode: string = `
                    [GroupBinding(x, y)]
                    [AccessMode(AccessMode.Write)]
                    storage myInt: Integer;
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration with read write access', () => {
                // Setup.
                const lSourceCode: string = `
                    [GroupBinding(x, y)]
                    [AccessMode(AccessMode.ReadWrite)]
                    storage myInt: Integer;
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Reject storage declaration without binding', () => {
                // Setup.
                const lSourceCode: string = `
                    [AccessMode(AccessMode.ReadWrite)]
                    storage myInt: Integer;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation. // TODO:
                expect(lErrorFunction).to.throw(ParserException);
            });

            it('-- Reject storage declaration without access mode', () => {
                // Setup.
                const lSourceCode: string = `
                    [GroupBinding(x, y)]
                    storage myInt: Integer;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation. // TODO:
                expect(lErrorFunction).to.throw(ParserException);
            });

            it('-- Reject storage declaration with assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    [GroupBinding(x, y)]
                    [AccessMode(AccessMode.ReadWrite)]
                    storage myInt: Integer = 10;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation. // TODO:
                expect(lErrorFunction).to.throw(ParserException);
            });
        });
    });

    describe('-- Templatelist', () => {
        it('-- Single', () => {
            // Setup.
            const lSourceCode: string = `
                const valName: Array<Integer>;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

            // Evaluation. // TODO:
            expect(lResult).to.be.true;
        });

        it('-- List', () => {
            // Setup.
            const lSourceCode: string = `
                const valName: Array<Integer, 3>;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

            // Evaluation. // TODO:
            expect(lResult).to.be.true;
        });

        it('-- Nested', () => {
            // Setup.
            const lSourceCode: string = `
                const valName: Array<Vector<Integer>>;
            `;

            // Process.
            const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

            // Evaluation. // TODO:
            expect(lResult).to.be.true;
        });
    });

    describe('-- Expression', () => {
        describe('-- Variable expression', () => {
            it('-- Variable name', () => {
                // Setup.
                const lSourceCode: string = `
                    const valName: Integer = 10;

                    function test(): void {
                        let value: Integer = valName;
                    }
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Index value', () => {
                // Setup.
                const lSourceCode: string = `
                    function test(): void {
                        let valName: Array<Integer, 3> = new Array<Integer, 3>(1, 2, 3);

                        let value: Integer = valName[10];
                    }
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Composite value', () => {
                // Setup.
                const lSourceCode: string = `
                    struct MyStruct {
                        prop: Integer
                    }

                    function test(): void {
                        let valName: MyStruct;

                        let value: Integer = valName.prop;
                    }
                `;

                // Process.
                const lResult: PgslModuleSyntaxTree = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });
        });
    });
});