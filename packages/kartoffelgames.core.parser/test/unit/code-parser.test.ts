import { expect } from 'chai';
import { CodeParser } from '../../source/code-parser';
import { Lexer } from '../../source/lexer';

describe('CodeParser', () => {
    enum TokenType {
        Identifier = 'Identifier',
        Modifier = 'Modifier',
        Assignment = 'Assignment',
        TypeDelimiter = 'TypeDelimiter',
        Semicolon = 'Semicolon'
    }

    const lCreateLexer = (): Lexer<TokenType> => {
        const lLexter = new Lexer<TokenType>();
        lLexter.addTokenPattern(/const/, TokenType.Modifier, 0);
        lLexter.addTokenPattern(/=/, TokenType.Assignment, 1);
        lLexter.addTokenPattern(/[a-zA-Z]+/, TokenType.Identifier, 2);
        lLexter.addTokenPattern(/:/, TokenType.TypeDelimiter, 2);
        lLexter.addTokenPattern(/;/, TokenType.Semicolon, 2);

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
    });
});