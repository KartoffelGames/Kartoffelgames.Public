import type { CodeParser, Lexer } from '@kartoffelgames/core-parser';
import type { XmlDocument } from '../../source/index.ts';
import { XmlParser } from '../../source/index.ts';
import type { XmlToken } from '../../source/parser/xml-token.enum.ts';

/**
 * Shared runtime of every benchmark file.
 *
 * The parser instance is created exactly once per benchmark process and warmed up before the
 * first measurement, so the benchmarks measure tokenizing and parsing and never the one time
 * lexer and graph setup {@link BaseXmlParser} does on its first parse call.
 */
export class BenchmarkProject {
    /**
     * Parser instance shared by every benchmark file.
     */
    public static readonly PARSER: XmlParser = new XmlParser();

    /**
     * Lexer of {@link BenchmarkProject.PARSER}, read on first use.
     */
    private static mLexer: Lexer<XmlToken> | null = null;

    /**
     * Lexer the shared parser really uses.
     *
     * {@link BaseXmlParser} builds its {@link CodeParser} lazily on the first parse call and keeps
     * it private, so the lexer is read off the parser instance instead of being rebuilt here.
     * A rebuilt lexer would measure a copy of the configuration that silently drifts apart from
     * the one the parser actually runs.
     *
     * @throws {@link Error}
     * When the parser does not expose a code parser anymore.
     */
    private static get lexer(): Lexer<XmlToken> {
        // Only read the lexer once.
        if (BenchmarkProject.mLexer !== null) {
            return BenchmarkProject.mLexer;
        }

        // Force the parser to build its code parser.
        BenchmarkProject.PARSER.parse('<warmup />');

        // Read the internal code parser of the xml parser.
        const lInternals: BenchmarkProjectParserInternals = BenchmarkProject.PARSER as unknown as BenchmarkProjectParserInternals;
        if (!lInternals.mParser) {
            throw new Error('The xml parser does not expose an internal code parser anymore. The lexer benchmarks need to be reconnected.');
        }

        BenchmarkProject.mLexer = lInternals.mParser.lexer;

        return BenchmarkProject.mLexer;
    }

    /**
     * Parse xml text into a document.
     *
     * @param pXml - Xml text.
     *
     * @returns Parsed document.
     */
    public static parse(pXml: string): XmlDocument {
        return BenchmarkProject.PARSER.parse(pXml);
    }

    /**
     * Tokenize xml text without parsing it.
     * The generator is fully drained so the whole text is tokenized.
     *
     * @param pXml - Xml text.
     *
     * @returns Count of produced token.
     */
    public static tokenize(pXml: string): number {
        let lTokenCount: number = 0;

        // Drain the token generator.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _ of BenchmarkProject.lexer.tokenize(pXml)) {
            lTokenCount++;
        }

        return lTokenCount;
    }

    /**
     * Assert that a benchmark input is parsable before it gets measured.
     * A benchmark that measures a failing parse would measure the error path instead of the parser.
     *
     * @param pName - Name of the benchmark input.
     * @param pXml - Xml text.
     *
     * @throws {@link Error}
     * When the xml can not be parsed or results in an empty document.
     */
    public static validate(pName: string, pXml: string): void {
        // Parse the input and enrich a potential error with the input name.
        const lDocument: XmlDocument = (() => {
            try {
                return BenchmarkProject.parse(pXml);
            } catch (pError) {
                const lErrorMessage: string = pError instanceof Error ? pError.message : String(pError);
                throw new Error(`Benchmark input "${pName}" is not parsable: ${lErrorMessage}`);
            }
        })();

        // An empty document would silently benchmark nothing.
        if (lDocument.body.length === 0) {
            throw new Error(`Benchmark input "${pName}" parsed into an empty document.`);
        }
    }
}

/**
 * Internal shape of {@link BaseXmlParser} the lexer is read from.
 */
type BenchmarkProjectParserInternals = {
    mParser: CodeParser<XmlToken, XmlDocument> | null;
};
