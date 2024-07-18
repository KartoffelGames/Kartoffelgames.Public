import { Lexer, LexerToken } from '@kartoffelgames/core.parser';
import { PgslToken } from './pgsl-token.enum';

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
                    regex: /<(?![<=])(?=[^;:{}]*>)/, // TODO: a<b || b>c will be detected.
                    type: PgslToken.TemplateListEnd
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
