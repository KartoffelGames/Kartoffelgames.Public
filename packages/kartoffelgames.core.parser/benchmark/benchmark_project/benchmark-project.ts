import { BenchmarkParser } from './benchmark-parser.ts';
import type { BenchmarkDocumentNode } from './benchmark-syntax-tree.type.ts';

/**
 * Shared runtime of every benchmark file.
 *
 * Lexer and parser are built exactly once per benchmark process, so the benchmarks
 * measure tokenizing and parsing and never the one time graph setup.
 */
export class BenchmarkProject {
    /**
     * Parser instance shared by every benchmark file.
     */
    public static readonly PARSER: BenchmarkParser = new BenchmarkParser();

    /**
     * Parse code into the benchmark language syntax tree.
     *
     * @param pCode - Benchmark language code.
     *
     * @returns Document node of the parsed code.
     */
    public static parse(pCode: string): BenchmarkDocumentNode {
        return BenchmarkProject.PARSER.parse(pCode);
    }

    /**
     * Tokenize code without parsing it.
     * The generator is fully drained so the whole text is tokenized.
     *
     * @param pCode - Benchmark language code.
     *
     * @returns Count of produced token.
     */
    public static tokenize(pCode: string): number {
        let lTokenCount: number = 0;

        // Drain the token generator.
        for (const _ of BenchmarkProject.PARSER.lexer.tokenize(pCode)) {
            lTokenCount++;
        }

        return lTokenCount;
    }

    /**
     * Assert that a benchmark input is parsable before it gets measured.
     * A benchmark that measures a failing parse would measure the error path instead of the parser.
     *
     * @param pName - Name of the benchmark input.
     * @param pCode - Benchmark language code.
     *
     * @throws {@link Error}
     * When the code can not be parsed or results in an empty document.
     */
    public static validate(pName: string, pCode: string): void {
        // Parse the input and enrich a potential error with the input name.
        const lDocument: BenchmarkDocumentNode = (() => {
            try {
                return BenchmarkProject.parse(pCode);
            } catch (pError) {
                const lErrorMessage: string = pError instanceof Error ? pError.message : String(pError);
                throw new Error(`Benchmark input "${pName}" is not parsable: ${lErrorMessage}`);
            }
        })();

        // An empty document would silently benchmark nothing.
        if (lDocument.declarations.length === 0) {
            throw new Error(`Benchmark input "${pName}" parsed into an empty document.`);
        }
    }
}
