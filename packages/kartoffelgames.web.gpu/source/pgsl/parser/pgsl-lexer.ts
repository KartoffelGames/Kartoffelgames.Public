import { Lexer, LexerToken } from '@kartoffelgames/core.parser';
import { PgslToken } from './pgsl-token.enum';
import { Stack } from '@kartoffelgames/core';

export class PgslLexer extends Lexer<PgslToken> {

    public constructor() {
        super();

        // Trimm whitspace. space, horizontal tab, line feed, vertical tab, form feed, carriage return, next line, left-to-right mark, right-to-left mark, line separator, paragraph separator
        this.trimWhitespace = true;
        this.validWhitespaces = '\u0020\u0009\u000A\u000B\u000C\u000D\u0085\u200E\u200F\u2028\u2029';

        // Comment.
        this.addTokenTemplate('Comment', {
            pattern: {
                regex: /(\/\*(.|\n)*?\*\/)|(\/\/.*?\n)/,
                type: PgslToken.Comment
            },
        });

        // Identifier.
        this.addTokenTemplate('Identifier', {
            pattern: {
                regex: /([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/u,
                type: PgslToken.Identifier
            },
        });

        // Literal values.
        this.addTokenTemplate('LiteralIntegerValue', {
            pattern: {
                regex: /(0[xX][0-9a-fA-F]+[iu]?)|(0[iu]?)|([1-9][0-9]*[iu]?)/,
                type: PgslToken.LiteralInteger
            },
        });
        this.addTokenTemplate('LiteralFloatValue', {
            pattern: {
                regex: /(0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?)|(0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?)|(0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?)|(0[fh])|([1-9][0-9]*[fh])|([0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?)|([0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?)|([0-9]+[eE][+-]?[0-9]+[fh]?)/,
                type: PgslToken.LiteralFloat
            },
        });
        this.addTokenTemplate('LiteralIntegerValue', {
            pattern: {
                regex: /true|false/,
                type: PgslToken.LiteralBoolean
            },
        });

        // Template list.
        this.addTokenTemplate('TemplateList', {
            pattern: {
                start: {
                    regex: /(?<=([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}]))<(?![<=])/u, // TODO: a<b || b>c will be detected.
                    type: PgslToken.TemplateListEnd,
                    validator: (pToken: LexerToken<PgslToken>, pText: string, pIndex: number): boolean => {
                        // Init nexting stack.
                        const lNestingStack: Stack<string> = new Stack<string>();

                        const lPermittedCodePoints: Set<string> = new Set<string>([';', ':', '{', '}']);
                        const lPermittedClosingCodePoint: Set<string> = new Set<string>(['>', '=']);
                        const lNestingOpenCodePoints: Set<string> = new Set<string>(['[', '(']);
                        const lNestingCloseCodePoints: Set<string> = new Set<string>([']', ')']);
                        const lShortCircuits: Set<string> = new Set<string>(['&', '|']);
                        const lTemplateListOpeningRegex: RegExp = /(?<=([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}]))<(?![<=])/u;

                        // Iterate each code point.
                        let lCurrentTextIndex: number = pIndex + pToken.value.length;
                        while (lCurrentTextIndex < pText.length) {
                            const lCurrentCodePoint: string = pText[lCurrentTextIndex];

                            // Branch for special code points..
                            switch (true) {
                                // When any ;:{ or } is between the closing > return false.
                                case (lPermittedCodePoints.has(lCurrentCodePoint)): {
                                    return false;
                                }

                                // Push nestings [, ( 
                                case (lNestingOpenCodePoints.has(lCurrentCodePoint)): {
                                    lNestingStack.push(lCurrentCodePoint);
                                    break;
                                }

                                // Pop nested [, ( 
                                case (lNestingCloseCodePoints.has(lCurrentCodePoint)): {
                                    const lClosedNesting: string | undefined = lNestingStack.pop();
                                    if (!lClosedNesting) {
                                        return false;
                                    }

                                    // When closed nesting does not correspond the current pending nesting. 
                                    if (lCurrentCodePoint === ')' && lClosedNesting !== '(' || lCurrentCodePoint === ']' && lClosedNesting !== '[') {
                                        return false;
                                    }

                                    // No error. Continue search for closing.
                                    break;
                                }

                                // Potential nested template list.
                                case (lCurrentCodePoint === '<'): {
                                    // TODO: We need nesting :( vec<array<i32>> Triggers early closing.

                                    lTemplateListOpeningRegex.lastIndex = lCurrentTextIndex;
                                    if(lTemplateListOpeningRegex.exec(pText)) {
                                        // TODO: Test for something ??
                                    }

                                    break;
                                }

                                // Potential template list closing.
                                case (lCurrentCodePoint === '>'): {

                                    // Ignore it when it is not on the root nesting level.
                                    if (lNestingStack.size > 0) {
                                        break;
                                    }

                                    // When current  code point interferes with the next, advance this code point and continue searching. 
                                    const lNextCodePoint: string = pText[lCurrentTextIndex + 1];
                                    if (lPermittedClosingCodePoint.has(lNextCodePoint)) {
                                        lCurrentTextIndex++;
                                        break;
                                    }

                                    // Closing of current template list is found.
                                    return true;
                                }

                                // Token can be a comparison.
                                case (lShortCircuits.has(lCurrentCodePoint)): {
                                    // Ignore when next code point is not the same char, as it is not a short circuit.
                                    const lNextCodePoint: string = pText[lCurrentTextIndex + 1];
                                    if (lNextCodePoint !== lCurrentCodePoint) {
                                        break;
                                    }

                                    // When currently nested, it does not affect the root nesting.
                                    if (lNestingStack.size > 0) {
                                        // When current nesting is a template list, pop nesting, as the used template start code point was a comparison.
                                        if (lNestingStack.top === '<') {
                                            lNestingStack.pop();
                                        }

                                        break;
                                    }

                                    // The found template list start token is a comparison.
                                    return false;
                                }
                            }

                            // When nothing special happened, check next code point.
                            lCurrentTextIndex++;
                        }

                        return true;
                    }
                },
                end: {
                    regex: />/,
                    type: PgslToken.TemplateListEnd
                }
            }
        }, () => {
            // TODO: Add comma, value, type and enums abd templatelists.
            // Calulcations need to be inside parentheses
        });
    }


    public override tokenize(pText: string): Generator<LexerToken<PgslToken>> {
        // TODO: Maybe Add custom templat string implementation to tokenize override that replaces start and end with customs like $<$ and $>$

        return super.tokenize(pText);
    }
}
