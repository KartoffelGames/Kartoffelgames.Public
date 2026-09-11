import { Lexer, type LexerPattern, type LexerPatternType, type LexerToken } from '../../source/index.ts';
import { BenchmarkToken } from './benchmark-token.enum.ts';

/**
 * Lexer of the artificial benchmark language.
 *
 * The pattern set is shaped like a real language grammar: a keyword pattern per keyword,
 * a reserved keyword pattern per reserved word, an ambiguous nesting token that needs a
 * lookahead validator and a set of scoped nesting pattern.
 */
export class BenchmarkLexer extends Lexer<BenchmarkToken> {
    /**
     * Words that are reserved for later language versions.
     * They are tokenized but never accepted by any graph.
     */
    private static readonly RESERVED_KEYWORDS: Array<string> = [
        'abstract', 'assert', 'await', 'case', 'catch', 'class', 'default', 'defer', 'delete',
        'do', 'export', 'extends', 'extern', 'final', 'finally', 'from', 'global', 'implements',
        'in', 'inline', 'instanceof', 'interface', 'internal', 'is', 'lazy', 'match', 'namespace',
        'native', 'of', 'operator', 'override', 'package', 'private', 'protected', 'public',
        'readonly', 'ref', 'sealed', 'static', 'super', 'switch', 'this', 'throw', 'trait',
        'try', 'typeof', 'union', 'unsafe', 'using', 'virtual', 'volatile', 'when', 'where',
        'with', 'yield'
    ];

    /**
     * Keyword token that are a single word.
     */
    private static readonly STATIC_KEYWORDS: Array<[BenchmarkToken, string]> = [
        [BenchmarkToken.KeywordModule, 'module'],
        [BenchmarkToken.KeywordImport, 'import'],
        [BenchmarkToken.KeywordAs, 'as'],
        [BenchmarkToken.KeywordAlias, 'alias'],
        [BenchmarkToken.KeywordRecord, 'record'],
        [BenchmarkToken.KeywordEnum, 'enum'],
        [BenchmarkToken.KeywordFunction, 'function'],
        [BenchmarkToken.KeywordConst, 'const'],
        [BenchmarkToken.KeywordLet, 'let'],
        [BenchmarkToken.KeywordIf, 'if'],
        [BenchmarkToken.KeywordElse, 'else'],
        [BenchmarkToken.KeywordWhile, 'while'],
        [BenchmarkToken.KeywordFor, 'for'],
        [BenchmarkToken.KeywordReturn, 'return'],
        [BenchmarkToken.KeywordBreak, 'break'],
        [BenchmarkToken.KeywordContinue, 'continue'],
        [BenchmarkToken.KeywordNew, 'new'],
        [BenchmarkToken.KeywordNull, 'null']
    ];

    /**
     * Token that only consist of symbols. Order matters, longer symbols must be listed first.
     */
    private static readonly STATIC_SYMBOLS: Array<[BenchmarkToken, string]> = [
        // Combinations of assignment and operator.
        [BenchmarkToken.AssignmentPlus, '+='],
        [BenchmarkToken.AssignmentMinus, '-='],
        [BenchmarkToken.AssignmentMultiply, '*='],
        [BenchmarkToken.AssignmentDivide, '/='],
        [BenchmarkToken.AssignmentModulo, '%='],

        // Doubled operators that share their first character with a single operator.
        [BenchmarkToken.OperatorIncrement, '++'],
        [BenchmarkToken.OperatorDecrement, '--'],
        [BenchmarkToken.OperatorAnd, '&&'],
        [BenchmarkToken.OperatorOr, '||'],

        // Comparisons that share their first character with an assignment or an operator.
        [BenchmarkToken.OperatorEqual, '=='],
        [BenchmarkToken.OperatorNotEqual, '!='],
        [BenchmarkToken.OperatorGreaterThanEqual, '>='],
        [BenchmarkToken.OperatorLowerThanEqual, '<='],

        // Single character operators.
        [BenchmarkToken.OperatorGreaterThan, '>'],
        [BenchmarkToken.OperatorLowerThan, '<'],
        [BenchmarkToken.OperatorNot, '!'],
        [BenchmarkToken.Assignment, '='],
        [BenchmarkToken.OperatorPlus, '+'],
        [BenchmarkToken.OperatorMinus, '-'],
        [BenchmarkToken.OperatorMultiply, '*'],
        [BenchmarkToken.OperatorDivide, '/'],
        [BenchmarkToken.OperatorModulo, '%']
    ];

    /**
     * Constructor.
     * Builds the complete pattern set of the benchmark language.
     */
    public constructor() {
        super();

        // Set whitespace handling.
        this.validWhitespaces = ' \n\r\t';
        this.trimWhitespace = true;

        // Comment. Line and block comments share a pattern, the same way a real grammar would do it.
        const lCommentPattern: LexerPattern<BenchmarkToken, LexerPatternType> = this.createTokenPattern({
            pattern: {
                regex: /(\/\*[\s\S]*?\*\/)|(\/\/[^\n]*)/,
                type: BenchmarkToken.Comment
            },
            meta: 'trivia'
        });

        // Keywords. Every keyword is its own pattern and must not match inside a longer word.
        const lKeywordPatternList: Array<LexerPattern<BenchmarkToken, LexerPatternType>> = new Array<LexerPattern<BenchmarkToken, LexerPatternType>>();
        for (const lKeyword of BenchmarkLexer.STATIC_KEYWORDS) {
            lKeywordPatternList.push(this.createTokenPattern({
                pattern: {
                    regex: new RegExp(`${lKeyword[1]}(?![\\w])`),
                    type: lKeyword[0]
                }
            }));
        }

        // Reserved keywords. Same shape as keywords but all of them share a single token type.
        const lReservedKeywordPatternList: Array<LexerPattern<BenchmarkToken, LexerPatternType>> = new Array<LexerPattern<BenchmarkToken, LexerPatternType>>();
        for (const lReservedKeyword of BenchmarkLexer.RESERVED_KEYWORDS) {
            lReservedKeywordPatternList.push(this.createTokenPattern({
                pattern: {
                    regex: new RegExp(`${lReservedKeyword}(?![\\w])`),
                    type: BenchmarkToken.ReservedKeyword
                }
            }));
        }

        // Generic list. Ambiguous with the lower than operator, so it needs a lookahead validator.
        const lGenericPattern: LexerPattern<BenchmarkToken, LexerPatternType> = this.createTokenPattern({
            pattern: {
                start: {
                    regex: /<(?!=)/,
                    type: BenchmarkToken.GenericStart,
                    validator: (_pToken: LexerToken<BenchmarkToken>, pFollowingText: string): boolean => {
                        // A generic list only contains type names, nested generic lists and separators.
                        let lNestingDepth: number = 1;

                        for (let lCharacterIndex: number = 0; lCharacterIndex < pFollowingText.length; lCharacterIndex++) {
                            const lCharacter: string = pFollowingText[lCharacterIndex];

                            // Open a nested generic list.
                            if (lCharacter === '<') {
                                lNestingDepth++;
                                continue;
                            }

                            // Close a nested generic list. The token is a generic list when the last one closes.
                            if (lCharacter === '>') {
                                lNestingDepth--;
                                if (lNestingDepth === 0) {
                                    return true;
                                }
                                continue;
                            }

                            // Anything that can not be part of a generic list rejects the token.
                            if (!(/[\w,\s]/).test(lCharacter)) {
                                return false;
                            }
                        }

                        // End of text without a closing token.
                        return false;
                    }
                },
                end: {
                    regex: />/,
                    type: BenchmarkToken.GenericEnd
                }
            }
        }, (pLexerPattern: LexerPattern<BenchmarkToken, LexerPatternType>) => {
            lUseCorePattern(pLexerPattern);
        });

        // Static symbols.
        const lStaticSymbolPatternList: Array<LexerPattern<BenchmarkToken, LexerPatternType>> = new Array<LexerPattern<BenchmarkToken, LexerPatternType>>();
        for (const lStaticSymbol of BenchmarkLexer.STATIC_SYMBOLS) {
            lStaticSymbolPatternList.push(this.createTokenPattern({
                pattern: {
                    regex: new RegExp(lStaticSymbol[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
                    type: lStaticSymbol[0]
                }
            }));
        }

        // Literals. Float must be tried before integer.
        const lLiteralPatternList: Array<LexerPattern<BenchmarkToken, LexerPatternType>> = new Array<LexerPattern<BenchmarkToken, LexerPatternType>>();
        lLiteralPatternList.push(this.createTokenPattern({
            pattern: {
                regex: /[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?/,
                type: BenchmarkToken.LiteralFloat
            }
        }));
        lLiteralPatternList.push(this.createTokenPattern({
            pattern: {
                regex: /[0-9]+/,
                type: BenchmarkToken.LiteralInteger
            }
        }));
        lLiteralPatternList.push(this.createTokenPattern({
            pattern: {
                regex: /(true|false)(?![\w])/,
                type: BenchmarkToken.LiteralBoolean
            }
        }));
        lLiteralPatternList.push(this.createTokenPattern({
            pattern: {
                regex: /"[^"]*"/,
                type: BenchmarkToken.LiteralString
            }
        }));

        // Single character structuring token.
        const lCommaPattern: LexerPattern<BenchmarkToken, LexerPatternType> = this.createTokenPattern({
            pattern: { regex: /,/, type: BenchmarkToken.Comma }
        });
        const lMemberDelimiterPattern: LexerPattern<BenchmarkToken, LexerPatternType> = this.createTokenPattern({
            pattern: { regex: /\./, type: BenchmarkToken.MemberDelimiter }
        });
        const lColonPattern: LexerPattern<BenchmarkToken, LexerPatternType> = this.createTokenPattern({
            pattern: { regex: /:/, type: BenchmarkToken.Colon }
        });
        const lSemicolonPattern: LexerPattern<BenchmarkToken, LexerPatternType> = this.createTokenPattern({
            pattern: { regex: /;/, type: BenchmarkToken.Semicolon }
        });
        const lQuestionMarkPattern: LexerPattern<BenchmarkToken, LexerPatternType> = this.createTokenPattern({
            pattern: { regex: /\?/, type: BenchmarkToken.QuestionMark }
        });
        const lAttributeMarkerPattern: LexerPattern<BenchmarkToken, LexerPatternType> = this.createTokenPattern({
            pattern: { regex: /@/, type: BenchmarkToken.AttributeMarker }
        });

        // Nesting token. Every nesting opens its own pattern scope.
        const lBlockPattern: LexerPattern<BenchmarkToken, LexerPatternType> = this.createTokenPattern({
            pattern: {
                start: { regex: /\{/, type: BenchmarkToken.BlockStart },
                end: { regex: /\}/, type: BenchmarkToken.BlockEnd }
            }
        }, (pLexerPattern: LexerPattern<BenchmarkToken, LexerPatternType>) => {
            lUseCorePattern(pLexerPattern);
        });
        const lParenthesesPattern: LexerPattern<BenchmarkToken, LexerPatternType> = this.createTokenPattern({
            pattern: {
                start: { regex: /\(/, type: BenchmarkToken.ParenthesesStart },
                end: { regex: /\)/, type: BenchmarkToken.ParenthesesEnd }
            }
        }, (pLexerPattern: LexerPattern<BenchmarkToken, LexerPatternType>) => {
            lUseCorePattern(pLexerPattern);
        });
        const lListPattern: LexerPattern<BenchmarkToken, LexerPatternType> = this.createTokenPattern({
            pattern: {
                start: { regex: /\[/, type: BenchmarkToken.ListStart },
                end: { regex: /\]/, type: BenchmarkToken.ListEnd }
            }
        }, (pLexerPattern: LexerPattern<BenchmarkToken, LexerPatternType>) => {
            lUseCorePattern(pLexerPattern);
        });

        // Identifier. Acts as the wildcard of the language and must be tried last.
        const lIdentifierPattern: LexerPattern<BenchmarkToken, LexerPatternType> = this.createTokenPattern({
            pattern: { regex: /[_a-zA-Z][_a-zA-Z0-9]*/, type: BenchmarkToken.Identifier }
        });

        // Apply the same pattern set to the root scope and to every nesting scope.
        const lUseCorePattern = <TTarget extends LexerPattern<BenchmarkToken, LexerPatternType> | BenchmarkLexer>(pTarget: TTarget): void => {
            // Read the apply function of the current target type.
            let lPatternApplyFunction: (pLexerPattern: LexerPattern<BenchmarkToken, LexerPatternType>) => void;
            if (pTarget instanceof BenchmarkLexer) {
                lPatternApplyFunction = pTarget.useRootTokenPattern;
            } else {
                lPatternApplyFunction = pTarget.useChildPattern;
            }

            // Comments.
            lPatternApplyFunction.call(pTarget, lCommentPattern);

            // Keywords before the identifier wildcard.
            for (const lKeywordPattern of lKeywordPatternList) {
                lPatternApplyFunction.call(pTarget, lKeywordPattern);
            }
            for (const lReservedKeywordPattern of lReservedKeywordPatternList) {
                lPatternApplyFunction.call(pTarget, lReservedKeywordPattern);
            }

            // Ambiguous generic list before the symbols that share its characters.
            lPatternApplyFunction.call(pTarget, lGenericPattern);

            // Symbols and literals.
            for (const lStaticSymbolPattern of lStaticSymbolPatternList) {
                lPatternApplyFunction.call(pTarget, lStaticSymbolPattern);
            }
            for (const lLiteralPattern of lLiteralPatternList) {
                lPatternApplyFunction.call(pTarget, lLiteralPattern);
            }

            // Structuring token.
            lPatternApplyFunction.call(pTarget, lCommaPattern);
            lPatternApplyFunction.call(pTarget, lMemberDelimiterPattern);
            lPatternApplyFunction.call(pTarget, lColonPattern);
            lPatternApplyFunction.call(pTarget, lSemicolonPattern);
            lPatternApplyFunction.call(pTarget, lQuestionMarkPattern);
            lPatternApplyFunction.call(pTarget, lAttributeMarkerPattern);
            lPatternApplyFunction.call(pTarget, lBlockPattern);
            lPatternApplyFunction.call(pTarget, lParenthesesPattern);
            lPatternApplyFunction.call(pTarget, lListPattern);

            // Identifier wildcard last.
            lPatternApplyFunction.call(pTarget, lIdentifierPattern);
        };

        // Apply the pattern set to the root scope.
        lUseCorePattern(this);
    }
}
