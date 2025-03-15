import { LexerToken } from "../lexer/lexer-token.ts";

type CodeParserCursor<TTokenType extends string> = {
    generator: Generator,
    level: number;
    tokenStack: {
        stack: Array<LexerToken<TTokenType>>,
        index: number
    }
}