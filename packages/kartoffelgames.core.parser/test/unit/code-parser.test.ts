import { expect } from 'chai';
import { CodeParser } from '../../source/code-parser';
import { Lexer } from '../../source/lexer';

describe('CodeParser', () => {
    enum TokenType {
        Identifier = 'Identifier',
        Modifier = 'Modifier',
        Assignment = 'Assignment',
        TypeDelimiter = 'TypeDelimiter',
        Semicolon = 'Semicolon',
        String = 'String',
        Number = 'Number'
    }

    const lCreateLexer = (): Lexer<TokenType> => {
        const lLexter = new Lexer<TokenType>();
        lLexter.addTokenPattern(/const/, TokenType.Modifier, 0);
        lLexter.addTokenPattern(/=/, TokenType.Assignment, 1);
        lLexter.addTokenPattern(/[a-zA-Z]+/, TokenType.Identifier, 2);
        lLexter.addTokenPattern(/:/, TokenType.TypeDelimiter, 2);
        lLexter.addTokenPattern(/;/, TokenType.Semicolon, 2);
        lLexter.addTokenPattern(/[0-9]+/, TokenType.Number, 2);
        lLexter.addTokenPattern(/".*?"/, TokenType.String, 2);

        lLexter.validWhitespaces = ' \n\t\r';
        lLexter.trimWhitespace = true;

        return lLexter;
    };

    describe('Method: parse', () => {
        it('-- Linear Parsing no optionals', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
            const lCodeText: string = 'const name: number;';

            // Setup. Define graph part and set as root.
            lParser.defineGraphPart('LinearCode',
                lParser.graph().single(TokenType.Modifier, 'modifier').single(TokenType.Identifier, 'variableName').single(TokenType.TypeDelimiter).single(TokenType.Identifier, 'typeName').single(TokenType.Semicolon),
                (pData: any) => {
                    return pData;
                }
            );
            lParser.setRootGraphPart('LinearCode');

            // Process. Convert code.
            const lParsedData: any = lParser.parse(lCodeText);

            // Evaluation.
            expect(lParsedData).has.property('modifier').and.equals('const');
            expect(lParsedData).has.property('variableName').and.equals('name');
            expect(lParsedData).has.property('typeName').and.equals('number');
        });

        it('-- Linear Parsing with optionals', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
            const lCodeText: string = 'const name: number';

            // Setup. Define graph part and set as root.
            lParser.defineGraphPart('LinearCode',
                lParser.graph().single(TokenType.Modifier, 'modifier').single(TokenType.Identifier, 'variableName').single(TokenType.TypeDelimiter).single(TokenType.Identifier, 'typeName').optional(TokenType.Semicolon),
                (pData: any) => {
                    return pData;
                }
            );
            lParser.setRootGraphPart('LinearCode');

            // Process. Convert code.
            const lParsedData: any = lParser.parse(lCodeText);

            // Evaluation.
            expect(lParsedData).has.property('modifier').and.equals('const');
            expect(lParsedData).has.property('variableName').and.equals('name');
            expect(lParsedData).has.property('typeName').and.equals('number');
        });

        it('-- Branch Parsing without optionals', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
            const lCodeTextModifier: string = 'const';
            const lCodeTextIdentifier: string = 'notconst';

            // Setup. Define graph part and set as root.
            lParser.defineGraphPart('BranchCode',
                lParser.graph().branch('data', [
                    TokenType.Identifier,
                    TokenType.Modifier
                ]),
                (pData: any) => {
                    return pData;
                }
            );
            lParser.setRootGraphPart('BranchCode');

            // Process. Convert code.
            const lParsedIdentifierData: any = lParser.parse(lCodeTextIdentifier);
            const lParsedModifierData: any = lParser.parse(lCodeTextModifier);

            // Evaluation.
            expect(lParsedIdentifierData).has.property('data').and.equals('notconst');
            expect(lParsedModifierData).has.property('data').and.equals('const');
        });

        it('-- Branch Parsing with existing optionals', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
            const lCodeTextNumber: string = '123';
            const lCodeTextIdentifier: string = 'myname';

            // Setup. Define graph part and set as root.
            lParser.defineGraphPart('BranchCode',
                lParser.graph().branch('data', [
                    lParser.graph().single(TokenType.Identifier, 'required'),
                    lParser.graph().optional(TokenType.Number, 'optional')
                ]),
                (pData: any) => {
                    return pData;
                }
            );
            lParser.setRootGraphPart('BranchCode');

            // Process. Convert code.
            const lParsedIdentifierData: any = lParser.parse(lCodeTextIdentifier);
            const lParsedNumberData: any = lParser.parse(lCodeTextNumber);

            // Evaluation.
            expect(lParsedIdentifierData).has.property('data').and.deep.equals({ data: { required: '123' } });
            expect(lParsedNumberData).has.property('data').and.deep.equals({ data: { required: 'myname' } });
        });

        it('-- Branch Parsing with missing optionals', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
            const lCodeText: string = 'const';

            // Setup. Define graph part and set as root.
            lParser.defineGraphPart('BranchCode',
                lParser.graph().single(TokenType.Modifier).branch('data', [
                    lParser.graph().optional(TokenType.Modifier, 'optional')
                ]),
                (pData: any) => {
                    return pData;
                }
            );
            lParser.setRootGraphPart('BranchCode');

            // Process. Convert code.
            const lParsedData: any = lParser.parse(lCodeText);

            // Evaluation.
            expect(lParsedData).has.property('data').and.deep.equals({ data: {} });
        });
    });
});