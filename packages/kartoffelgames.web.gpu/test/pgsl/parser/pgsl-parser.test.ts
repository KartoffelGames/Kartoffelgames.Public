import { ParserException } from '@kartoffelgames/core.parser';
import { expect } from 'chai';
import { PgslParser } from 'packages/kartoffelgames.web.gpu/source/pgsl/parser/pgsl-parser';
import { PgslDocument } from 'packages/kartoffelgames.web.gpu/source/pgsl/pgsl-document';

describe('PsglLexer', () => {
    const lPgslParser: PgslParser = new PgslParser();

    describe('-- Modulescope variable declarations', () => {
        describe('-- const declaration', () => {
            it('-- Declaration with const value', () => {
                // Setup.
                const lSourceCode: string = `
                    const myInt: int = 10;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration with const expression', () => {
                // Setup.
                const lSourceCode: string = `
                    const otherConst: int = 10;
                    const myInt: int = 10 * otherConst;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Reject const declaration without assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    const myInt: int;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(ParserException);
            });

            it('-- Reject const declaration with attributes', () => {
                // Setup.
                const lSourceCode: string = `
                    @attribute() const myInt: int = 1;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(ParserException);
            });
        });

        describe('-- param declaration', () => {
            it('-- Declaration with const value', () => {
                // Setup.
                const lSourceCode: string = `
                    param myInt: int = 10;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration with other param expression', () => {
                // Setup.
                const lSourceCode: string = `
                    param otherParam: int = 10;
                    param myInt: int = 10 * otherParam;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration with const expression', () => {
                // Setup.
                const lSourceCode: string = `
                    const otherConst: int = 10;
                    param myInt: int = 10 * otherConst;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Reject param declaration without assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    param myInt: int;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(ParserException);
            });

            it('-- Reject param declaration with attributes', () => {
                // Setup.
                const lSourceCode: string = `
                    @attribute() param myInt: int = 1;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(ParserException);
            });
        });

        describe('-- private declaration', () => {
            it('-- Declaration with const value assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    private myInt: int = 10;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration without assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    private myInt: int;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration with expression value assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    private myInt: int = 10 + 11;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Reject private declaration with attributes', () => {
                // Setup.
                const lSourceCode: string = `
                    @attribute() private myInt: int;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(ParserException);
            });
        });

        describe('-- workgroup declaration', () => { // TODO: Better naming
            it('-- Declaration with expression value', () => {
                // Setup.
                const lSourceCode: string = `
                    workgroup myInt: int;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Reject workgroup declaration with assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    workgroup myInt: int = 10;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(ParserException);
            });

            it('-- Reject workgroup declaration with attributes', () => {
                // Setup.
                const lSourceCode: string = `
                    @attribute() workgroup myInt: int;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(ParserException);
            });
        });

        describe('-- uniform declaration', () => {
            it('-- Declaration with const value', () => {
                // Setup.
                const lSourceCode: string = `
                    uniform myInt: int = 10;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Reject uniform declaration without binding', () => {
                // Setup.
                const lSourceCode: string = `
                    uniform myInt: int;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(ParserException);
            });

            it('-- Reject storage declaration with assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    @groupBind(x, y) uniform myInt: int = 10;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(ParserException);
            });

            // TODO: sampler and texture values.
        });

        describe('-- storage declaration', () => {
            it('-- Declaration with read access', () => {
                // Setup.
                const lSourceCode: string = `
                    @groupBind(x, y) @accessMode(AccessMode.Read) storage myInt: int;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration  with write access', () => {
                // Setup.
                const lSourceCode: string = `
                    @groupBind(x, y) @accessMode(AccessMode.Write) storage myInt: int;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration with read write access', () => {
                // Setup.
                const lSourceCode: string = `
                    @groupBind(x, y) @accessMode(AccessMode.ReadWrite) storage myInt: int;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Reject storage declaration without binding', () => {
                // Setup.
                const lSourceCode: string = `
                    @accessMode(AccessMode.ReadWrite) storage myInt: int;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(ParserException);
            });

            it('-- Reject storage declaration without access mode', () => {
                // Setup.
                const lSourceCode: string = `
                    @groupBind(x, y) storage myInt: int;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(ParserException);
            });

            it('-- Reject storage declaration with assignment', () => {
                // Setup.
                const lSourceCode: string = `
                    @groupBind(x, y) @accessMode(AccessMode.ReadWrite) storage myInt: int = 10;
                `;

                // Process.
                const lErrorFunction = () => {
                    lPgslParser.parse(lSourceCode);
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(ParserException);
            });
        });
    });
});