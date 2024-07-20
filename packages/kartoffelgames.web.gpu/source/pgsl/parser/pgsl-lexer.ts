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
                        const lNestingStack: Stack<'(' | '[' | '<'> = new Stack<'(' | '[' | '<'>();

                        const lPermittedCodePoints: Set<string> = new Set<string>([';', ':', '{', '}']);
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
                                case (lCurrentCodePoint === '[' || lCurrentCodePoint === '('): {
                                    lNestingStack.push(lCurrentCodePoint);
                                    break;
                                }

                                // Pop nested [, ( 
                                case (lCurrentCodePoint === ']' || lCurrentCodePoint === ')'): {
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

                                // Token can be a short circuit.
                                case (lCurrentCodePoint === '|' || lCurrentCodePoint === '&'): {
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

                                // Potential negated comparison.
                                case (lCurrentCodePoint === '!'): {
                                    // When a comparisson. Skip = to not trigger a assignment.
                                    const lNextCodePoint: string = pText[lCurrentTextIndex + 1];
                                    if (lNextCodePoint === '=') {
                                        lCurrentTextIndex++;
                                    }

                                    break;
                                }

                                // Potential forbidden assignment.
                                case (lCurrentCodePoint === '='): {
                                    // When assignment is actually a comparison.
                                    const lNextCodePoint: string = pText[lCurrentTextIndex + 1];
                                    if (lNextCodePoint === '=') {
                                        lCurrentTextIndex++;
                                        break;
                                    }

                                    // When assignment is actually a comparison.
                                    const lPrevCodePoint: string = pText[lCurrentTextIndex - 1];
                                    if (lPrevCodePoint === '!' || lPrevCodePoint === '<' || lPrevCodePoint === '>') {
                                        break;
                                    }

                                    // Forbidden assignment found, current token can not be a template start.
                                    return true;
                                }

                                // Potential template list closing.
                                case (lCurrentCodePoint === '>'): {
                                    // Currently nothing is nested, if so this closes the template list.
                                    if (lNestingStack.size === 0) {
                                        return true;
                                    }

                                    // Pop current nesting when it closes a nested template list.
                                    const lCurrentNesting: string = lNestingStack.top!;
                                    if(lCurrentNesting  === '<') {
                                        lNestingStack.pop();
                                    }

                                    break;
                                }

                                // Potential nested template list.
                                case (lCurrentCodePoint === '<'): {
                                    // When template list is actually a comparison or bit shift.
                                    const lNextCodePoint: string = pText[lCurrentTextIndex + 1];
                                    if (lNextCodePoint === '=' || lNextCodePoint === '<') {
                                        lCurrentTextIndex++;
                                        break;
                                    }

                                    // Push nested 
                                    lTemplateListOpeningRegex.lastIndex = lCurrentTextIndex;
                                    if (lTemplateListOpeningRegex.exec(pText)) {
                                        lNestingStack.push(lCurrentCodePoint);
                                    }

                                    break;
                                }
                            }

                            // When nothing special happened, check next code point.
                            lCurrentTextIndex++;
                        }

                        return false;
                    }
                },
                end: {
                    regex: />/,
                    type: PgslToken.TemplateListEnd
                }
            }
        }, () => {
            // TODO: Add comma, value, type and enums abd templatelists.
        });

    }
}
