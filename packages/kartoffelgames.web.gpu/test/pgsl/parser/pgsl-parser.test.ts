import { expect } from 'chai';
import { PgslParser } from 'packages/kartoffelgames.web.gpu/source/pgsl/parser/pgsl-parser';
import { PgslDocument } from 'packages/kartoffelgames.web.gpu/source/pgsl/pgsl-document';

describe('PsglLexer', () => {
    const lPgslParser: PgslParser = new PgslParser();

    describe('-- Modulescope variable declarations', () => {
        // TODO: Check if they can have a initial value.

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
        });

        describe('-- private declaration', () => { 
            it('-- Declaration with const value', () => {
                // Setup.
                const lSourceCode: string = `
                    private myInt: int = 10;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration with expression value', () => {
                // Setup.
                const lSourceCode: string = `
                    private myInt: int = 10 + 11;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });
        });

        describe('-- workgroup declaration', () => { // TODO: Better naming
            it('-- Declaration with const value', () => {
                // Setup.
                const lSourceCode: string = `
                    workgroup myInt: int = 10;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration with expression value', () => {
                // Setup.
                const lSourceCode: string = `
                    workgroup myInt: int = 10 + 11;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
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

            it('-- Declaration with expression value', () => {
                // Setup.
                const lSourceCode: string = `
                    uniform myInt: int = 10 + 11;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });
         });

        describe('-- storage declaration', () => { 
            // TODO: How to do read write access?
            it('-- Declaration with const value', () => {
                // Setup.
                const lSourceCode: string = `
                    storage myInt: int = 10;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });

            it('-- Declaration with expression value', () => {
                // Setup.
                const lSourceCode: string = `
                    storage myInt: int = 10 + 11;
                `;

                // Process.
                const lResult: PgslDocument = lPgslParser.parse(lSourceCode);

                // Evaluation. // TODO:
                expect(lResult).to.be.true;
            });
        });

        // TODO: handle ??? How
    });
});