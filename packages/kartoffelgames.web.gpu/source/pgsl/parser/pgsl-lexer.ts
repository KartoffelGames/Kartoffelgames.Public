import { Dictionary, Stack } from '@kartoffelgames/core';
import { Lexer, LexerToken } from '@kartoffelgames/core.parser';
import { PgslToken } from './pgsl-token.enum';

export class PgslLexer extends Lexer<PgslToken> {
    /**
     * Type Value pairs of token used for value assignments.
     */
    private static readonly mAssignments: Dictionary<PgslToken, string> = (() => {
        const lKeywords: Dictionary<PgslToken, string> = new Dictionary<PgslToken, string>();
        lKeywords.set(PgslToken.Assignment, '=');
        lKeywords.set(PgslToken.AssignmentPlus, '+=');
        lKeywords.set(PgslToken.AssignmentMinus, '-=');
        lKeywords.set(PgslToken.AssignmentMultiply, '*=');
        lKeywords.set(PgslToken.AssignmentDivide, '/=');
        lKeywords.set(PgslToken.AssignmentModulo, '%=');
        lKeywords.set(PgslToken.AssignmentBinaryAnd, '&=');
        lKeywords.set(PgslToken.AssignmentBinaryOr, '|=');
        lKeywords.set(PgslToken.AssignmentBinaryXor, '^=');
        lKeywords.set(PgslToken.AssignmentShiftRight, '>>=');
        lKeywords.set(PgslToken.AssignmentShiftLeft, '<<=');

        return lKeywords;
    })();

    /**
     * Hardcoded system reserved keywords.
     */
    private static readonly mKeywords: Dictionary<PgslToken, string> = (() => {
        const lKeywords: Dictionary<PgslToken, string> = new Dictionary<PgslToken, string>();
        lKeywords.set(PgslToken.KeywordAlias, 'alias');
        lKeywords.set(PgslToken.KeywordBreak, 'break');
        lKeywords.set(PgslToken.KeywordCase, 'case');
        lKeywords.set(PgslToken.KeywordDeclarationConst, 'const');
        lKeywords.set(PgslToken.KeywordConstAssert, 'const_assert');
        lKeywords.set(PgslToken.KeywordContinue, 'continue');
        lKeywords.set(PgslToken.KeywordContinuing, 'continuing');
        lKeywords.set(PgslToken.KeywordDefault, 'default');
        lKeywords.set(PgslToken.KeywordDiagnostic, 'diagnostic');
        lKeywords.set(PgslToken.KeywordDiscard, 'discard');
        lKeywords.set(PgslToken.KeywordElse, 'else');
        lKeywords.set(PgslToken.KeywordEnable, 'enable');
        lKeywords.set(PgslToken.KeywordFunction, 'function');
        lKeywords.set(PgslToken.KeywordFor, 'for');
        lKeywords.set(PgslToken.KeywordIf, 'if');
        lKeywords.set(PgslToken.KeywordLoop, 'loop');
        lKeywords.set(PgslToken.KeywordRequires, 'requires');
        lKeywords.set(PgslToken.KeywordReturn, 'return');
        lKeywords.set(PgslToken.KeywordStruct, 'struct');
        lKeywords.set(PgslToken.KeywordSwitch, 'switch');
        lKeywords.set(PgslToken.KeywordWhile, 'while');
        lKeywords.set(PgslToken.KeywordEnum, 'enum');

        // Declarations
        lKeywords.set(PgslToken.KeywordDeclarationLet, 'let');
        lKeywords.set(PgslToken.KeywordDeclarationVar, 'var');
        lKeywords.set(PgslToken.KeywordDeclarationStorage, 'storage');
        lKeywords.set(PgslToken.KeywordDeclarationUniform, 'uniform');
        lKeywords.set(PgslToken.KeywordDeclarationWorkgroup, 'workgroup');
        lKeywords.set(PgslToken.KeywordDeclarationPrivate, 'private');
        lKeywords.set(PgslToken.KeywordDeclarationParam, 'param');

        return lKeywords;
    })();

    /**
     * Type Value pairs of token used for value operations.
     */
    private static readonly mOperations: Dictionary<PgslToken, string> = (() => {
        const lKeywords: Dictionary<PgslToken, string> = new Dictionary<PgslToken, string>();

        // Increment and decrement operator
        lKeywords.set(PgslToken.OperatorIncrement, '++');
        lKeywords.set(PgslToken.OperatorDecrement, '--');

        // Math
        lKeywords.set(PgslToken.OperatorPlus, '+');
        lKeywords.set(PgslToken.OperatorMinus, '-');
        lKeywords.set(PgslToken.OperatorMultiply, '*');
        lKeywords.set(PgslToken.OperatorDivide, '/');
        lKeywords.set(PgslToken.OperatorModulo, '%');

        // Some other stuff
        lKeywords.set(PgslToken.OperatorNot, '!');

        // Compare stuff
        lKeywords.set(PgslToken.OperatorEqual, '==');
        lKeywords.set(PgslToken.OperatorGreaterThan, '>');
        lKeywords.set(PgslToken.OperatorLowerThan, '<');
        lKeywords.set(PgslToken.OperatorShortCircuitAnd, '&&');
        lKeywords.set(PgslToken.OperatorShortCircuitOr, '||');
        lKeywords.set(PgslToken.OperatorGreaterThanEqual, '>=');
        lKeywords.set(PgslToken.OperatorLowerThanEqual, '<=');
        lKeywords.set(PgslToken.OperatorNotEqual, '!=');

        // Binary operations
        lKeywords.set(PgslToken.OperatorBinaryAnd, '&');
        lKeywords.set(PgslToken.OperatorBinaryOr, '|');
        lKeywords.set(PgslToken.OperatorBinaryXor, '^');
        lKeywords.set(PgslToken.OperatorBinaryNegate, '~');
        lKeywords.set(PgslToken.OperatorShiftLeft, '<<');
        lKeywords.set(PgslToken.OperatorShiftRight, '>>');


        return lKeywords;
    })();

    /**
     * List of reserved token values that might be used later.
     */
    private static readonly mReservedKeywords: Array<string> = (() => {
        return ['NULL', 'Self', 'abstract', 'active', 'alignas', 'alignof', 'as', 'asm', 'asm_fragment', 'async', 'attribute', 'auto', 'await',
            'binding_array', 'cast', 'catch', 'class', 'co_await', 'co_return', 'co_yield', 'coherent', 'column_major', 'common', 'compile',
            'compile_fragment', 'concept', 'const_cast', 'consteval', 'constexpr', 'constinit', 'crate', 'debugger', 'decltype', 'delete',
            'demote', 'demote_to_helper', 'do', 'dynamic_cast', 'enum', 'explicit', 'export', 'extends', 'extern', 'external', 'fallthrough',
            'filter', 'final', 'finally', 'friend', 'from', 'fxgroup', 'get', 'goto', 'groupshared', 'highp', 'impl', 'implements', 'import',
            'inline', 'instanceof', 'interface', 'layout', 'lowp', 'macro', 'macro_rules', 'match', 'mediump', 'meta', 'mod', 'module', 'move',
            'mut', 'mutable', 'namespace', 'new', 'nil', 'noexcept', 'noinline', 'nointerpolation', 'noperspective', 'null', 'nullptr', 'of',
            'operator', 'package', 'packoffset', 'partition', 'pass', 'patch', 'pixelfragment', 'precise', 'precision', 'premerge', 'priv',
            'protected', 'pub', 'public', 'readonly', 'ref', 'regardless', 'register', 'reinterpret_cast', 'require', 'resource', 'restrict',
            'self', 'set', 'shared', 'sizeof', 'smooth', 'snorm', 'static', 'static_assert', 'static_cast', 'std', 'subroutine', 'super', 'target',
            'template', 'this', 'thread_local', 'throw', 'trait', 'try', 'type', 'typedef', 'typeid', 'typename', 'typeof', 'union', 'unless',
            'unorm', 'unsafe', 'unsized', 'use', 'using', 'varying', 'virtual', 'volatile', 'wgsl', 'where', 'with', 'writeonly', 'yield', 'become'
        ];
    })();

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

        // Comma.
        this.addTokenTemplate('Comma', {
            pattern: {
                regex: /,/,
                type: PgslToken.Comma
            },
        });

        // MemberDelimiter.
        this.addTokenTemplate('MemberDelimiter', {
            pattern: {
                regex: /\./,
                type: PgslToken.MemberDelimiter
            },
        });

        // Colon.
        this.addTokenTemplate('Colon', {
            pattern: {
                regex: /:/,
                type: PgslToken.Colon
            },
        });

        // Semicolon.
        this.addTokenTemplate('Semicolon', {
            pattern: {
                regex: /;/,
                type: PgslToken.Semicolon
            },
        });

        // AttributeIndicator.
        this.addTokenTemplate('AttributeIndicator', {
            pattern: {
                regex: /@/,
                type: PgslToken.AttributeIndicator
            },
        });

        // Parentheses.
        this.addTokenTemplate('Parentheses', {
            pattern: {
                start: {
                    regex: /\(/,
                    type: PgslToken.ParenthesesStart
                },
                end: {
                    regex: /\)/,
                    type: PgslToken.ParenthesesEnd
                }
            }
        }, () => {
            lApplyTemplates();
        });

        // Lists.
        this.addTokenTemplate('List', {
            pattern: {
                start: {
                    regex: /\[/,
                    type: PgslToken.ListStart
                },
                end: {
                    regex: /\]/,
                    type: PgslToken.ListEnd
                }
            }
        }, () => {
            lApplyTemplates();
        });

        // Block
        this.addTokenTemplate('Block', {
            pattern: {
                start: {
                    regex: /\{/,
                    type: PgslToken.BlockStart
                },
                end: {
                    regex: /\}/,
                    type: PgslToken.BlockEnd
                }
            }
        }, () => {
            lApplyTemplates();
        });

        // Assignments.
        const lAssignmentTemplateList: Array<string> = new Array<string>();
        for (const [lTokenType, lTokenValue] of PgslLexer.mAssignments) {
            const lTemplateName: string = 'Assignment' + lTokenType;
            lAssignmentTemplateList.push(lTemplateName);

            this.addTokenTemplate(lTemplateName, {
                pattern: {
                    regex: new RegExp(lTokenValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
                    type: lTokenType
                },
            });
        }

        // Literal values.
        const lLiteralTemplateList = ['LiteralIntegerValue', 'LiteralFloatValue', 'LiteralBooleanValue'] as const;
        this.addTokenTemplate(lLiteralTemplateList[0], {
            pattern: {
                regex: /(0[xX][0-9a-fA-F]+[iu]?)|(0[iu]?)|([1-9][0-9]*[iu]?)/,
                type: PgslToken.LiteralInteger
            },
        });
        this.addTokenTemplate(lLiteralTemplateList[1], {
            pattern: {
                regex: /(0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?)|(0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?)|(0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?)|(0[fh])|([1-9][0-9]*[fh])|([0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?)|([0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?)|([0-9]+[eE][+-]?[0-9]+[fh]?)/,
                type: PgslToken.LiteralFloat
            },
        });
        this.addTokenTemplate(lLiteralTemplateList[2], {
            pattern: {
                regex: /true|false/,
                type: PgslToken.LiteralBoolean
            },
        });

        // Template list.
        this.addTokenTemplate('TemplateList', {
            pattern: {
                start: {
                    regex: /(?<=(?:([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}]))(?:\s*))<(?![<=])/u,
                    type: PgslToken.TemplateListStart,
                    validator: (pToken: LexerToken<PgslToken>, pText: string, pIndex: number): boolean => {
                        // Init nexting stack.
                        const lNestingStack: Stack<'(' | '[' | '<'> = new Stack<'(' | '[' | '<'>();

                        const lPermittedCodePoints: Set<string> = new Set<string>([';', ':', '{', '}']);
                        const lTemplateListOpeningRegex: RegExp = /(?<=(?:([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}]))(?:\s*))<(?![<=])/ug;

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
                                    let lClosedNesting: string | undefined = lNestingStack.pop();

                                    // Nested template list was a comparison. Pop the next nesting.
                                    if (lClosedNesting === '<') {
                                        lClosedNesting = lNestingStack.pop();
                                    }

                                    // When something that should be nested, was not nested, then something is very off.
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
                                    return false;
                                }

                                // Potential template list closing.
                                case (lCurrentCodePoint === '>'): {
                                    // Currently nothing is nested, if so this closes the template list.
                                    if (lNestingStack.size === 0) {
                                        return true;
                                    }

                                    // Pop current nesting when it closes a nested template list.
                                    const lCurrentNesting: string = lNestingStack.top!;
                                    if (lCurrentNesting === '<') {
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
            lApplyTemplates();
        });

        // Keywords
        const lKeywordTemplateList: Array<string> = new Array<string>();
        for (const [lTokenType, lTokenValue] of PgslLexer.mKeywords) {
            const lTemplateName: string = 'Keyword' + lTokenType;
            lKeywordTemplateList.push(lTemplateName);

            this.addTokenTemplate(lTemplateName, {
                pattern: {
                    regex: new RegExp(`${lTokenValue}(?![\\w])`),
                    type: lTokenType
                },
            });
        }

        // ReservedKeywords.
        const lReservedKeywordTemplateList: Array<string> = new Array<string>();
        for (const lTokenValue of PgslLexer.mReservedKeywords) {
            const lTemplateName: string = 'ReservedKeyword' + lTokenValue;
            lReservedKeywordTemplateList.push(lTemplateName);

            this.addTokenTemplate(lTemplateName, {
                pattern: {
                    regex: new RegExp(`${lTokenValue}(?![\\w])`),
                    type: PgslToken.ReservedKeyword
                },
            });
        }

        // Operations
        const lOperationTemplateList: Array<string> = new Array<string>();
        for (const [lTokenType, lTokenValue] of PgslLexer.mOperations) {
            const lTemplateName: string = 'Operation' + lTokenType;
            lOperationTemplateList.push(lTemplateName);

            this.addTokenTemplate(lTemplateName, {
                pattern: {
                    regex: new RegExp(lTokenValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
                    type: lTokenType
                },
            });
        }

        // Apply templates with specificity.
        const lApplyTemplates = () => {
            // Comments.
            this.useTokenTemplate('Comment', 0);

            // Structoring tokens.
            this.useTokenTemplate('Comma', 1);
            this.useTokenTemplate('MemberDelimiter', 1);
            this.useTokenTemplate('Colon', 1);
            this.useTokenTemplate('Semicolon', 1);
            this.useTokenTemplate('Block', 1);
            this.useTokenTemplate('Parentheses', 1);
            this.useTokenTemplate('List', 1);
            this.useTokenTemplate('AttributeIndicator', 1);

            // Tokens with ambiguity. 
            this.useTokenTemplate('TemplateList', 1);

            // Assignments.
            for (const lTemplateName of lAssignmentTemplateList) {
                this.useTokenTemplate(lTemplateName, 1);
            }

            // Literals.
            for (const lTemplateName of lLiteralTemplateList) {
                this.useTokenTemplate(lTemplateName, 1);
            }

            // Keywords.
            for (const lTemplateName of lKeywordTemplateList) {
                this.useTokenTemplate(lTemplateName, 1);
            }

            // Reserved keywords.
            for (const lTemplateName of lReservedKeywordTemplateList) {
                this.useTokenTemplate(lTemplateName, 1);
            }

            // Operations.
            for (const lTemplateName of lOperationTemplateList) {
                this.useTokenTemplate(lTemplateName, 1);
            }

            this.useTokenTemplate('Identifier', 99);
        };

        lApplyTemplates();
    }
}
