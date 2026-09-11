import type { DocumentAst } from '../../source/abstract_syntax_tree/document-ast.ts';
import type { DocumentCst } from '../../source/concrete_syntax_tree/general.type.ts';
import { PgslParser } from '../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../source/parser_result/pgsl-parser-result.ts';
import type { PgslParserResultIncident } from '../../source/parser_result/pgsl-parser-result.incident.ts';
import { WgslTranspiler } from '../../source/transpilation/wgsl/wgsl-transpiler.ts';

/**
 * Shared runtime of every benchmark file.
 *
 * Parser and transpiler are built exactly once per benchmark process, so the benchmarks
 * measure the pipeline and never the one time graph setup.
 *
 * The pipeline stages build on each other. `parse` tokenizes, `parseAst` parses and
 * `transpile` builds the syntax tree, so every stage contains the cost of the stage before it.
 * The cost of a single stage is the difference to the stage before it.
 */
export class BenchmarkProject {
    /**
     * Parser instance shared by every benchmark file.
     */
    public static readonly PARSER: PgslParser = new PgslParser();

    /**
     * Transpiler instance shared by every benchmark file.
     * The transpiler keeps no state between calls, every call creates its own meta object.
     */
    public static readonly TRANSPILER: WgslTranspiler = new WgslTranspiler();

    /**
     * Parse PGSL code into a concrete syntax tree.
     *
     * @param pCode - PGSL code.
     *
     * @returns Concrete syntax tree of the code.
     */
    public static parse(pCode: string): DocumentCst {
        return BenchmarkProject.PARSER.parse(pCode);
    }

    /**
     * Parse PGSL code into an abstract syntax tree.
     *
     * @param pCode - PGSL code.
     *
     * @returns Abstract syntax tree of the code.
     */
    public static parseAst(pCode: string): DocumentAst {
        return BenchmarkProject.PARSER.parseAst(pCode);
    }

    /**
     * Tokenize PGSL code without parsing it.
     * The generator is fully drained so the whole text is tokenized.
     *
     * @param pCode - PGSL code.
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
     * Transpile PGSL code into WGSL.
     *
     * @param pCode - PGSL code.
     *
     * @returns Transpilation result of the code.
     */
    public static transpile(pCode: string): PgslParserResult {
        return BenchmarkProject.PARSER.transpile(pCode, BenchmarkProject.TRANSPILER);
    }

    /**
     * Assert that a benchmark input transpiles before it gets measured.
     *
     * A shader with incidents never reaches the transpiler, the parser returns an empty result
     * instead of throwing. Without this check a broken input would silently benchmark the
     * validation error path instead of the pipeline.
     *
     * @param pName - Name of the benchmark input.
     * @param pCode - PGSL code.
     *
     * @throws {@link Error}
     * When the code produces incidents or transpiles into nothing.
     */
    public static validate(pName: string, pCode: string): void {
        const lResult: PgslParserResult = BenchmarkProject.transpile(pCode);

        // Report every incident of the input.
        if (lResult.incidents.length > 0) {
            const lIncidentTextList: Array<string> = lResult.incidents.map((pIncident: PgslParserResultIncident) => {
                return `    [${pIncident.line}:${pIncident.column}] ${pIncident.message}`;
            });

            throw new Error(`Benchmark input "${pName}" has ${lResult.incidents.length} incident(s):\n${lIncidentTextList.join('\n')}`);
        }

        // An empty result would silently benchmark nothing.
        if (lResult.source.length === 0) {
            throw new Error(`Benchmark input "${pName}" transpiled into an empty result.`);
        }
    }
}
