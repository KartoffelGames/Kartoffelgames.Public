import { BenchmarkProject } from './benchmark_project/benchmark-project.ts';
import { BenchmarkSource } from './benchmark_project/benchmark-source.ts';

/**
 * Element count of every case that scales by node count.
 *
 * All three cases run the full range. A root with more than roughly 64_500 direct children used
 * to throw "Maximum call stack size exceeded", which was never a parser recursion but two nested
 * argument spreads in this package. Both are loops now, so the native argument stack no longer
 * caps the child count.
 */
const gElementCount: number = 100_000;

/**
 * Target size of the file size case.
 */
const gFileSizeByteCount: number = 50 * 1024 * 1024;

/**
 * Iteration cap for the cases that need more than ten seconds per run.
 *
 * Sibling and attribute lists are still quadratic, because a right recursive list copies the
 * whole accumulated tail once per level, in {@link GraphNode.mergeData} and again in the content
 * list converter. At the full range that means about 67 s for one linear run and about 19 s for
 * one attribute run. Without a cap, Deno measures twelve iterations of each, which would push
 * this file past twenty minutes. The cap trades sample count for a usable total runtime.
 *
 * Drop the cap from an entry as soon as its case parses in well under a second.
 */
const gSlowCaseOptions = { n: 1, warmup: 0 } as const;

/**
 * Shapes that are extreme for the xml parser. Every shape is generated instead of hardcoded and
 * measured on its own, so a rewrite shows which shape it improved instead of hiding all of them
 * inside one total.
 */
const gLinear: string = BenchmarkSource.linear(gElementCount);
const gNested: string = BenchmarkSource.nested(gElementCount);
const gAttributes: string = BenchmarkSource.attributes(gElementCount);
const gFileSize: string = BenchmarkSource.fileSize(gFileSizeByteCount);

// Fail before measuring, a failing parse would measure the error path instead of the parser.
// Validated at a small scale on purpose. Validating the full range would parse every case a
// second time and add about ninety seconds to this file, while a generator that builds a broken
// shape builds it broken at every size. A failure that only appears at the full range still
// fails the benchmark entry itself.
BenchmarkProject.validate('full - linear', BenchmarkSource.linear(100));
BenchmarkProject.validate('full - nested', BenchmarkSource.nested(100));
BenchmarkProject.validate('full - attributes', BenchmarkSource.attributes(100));
BenchmarkProject.validate('full - file size', BenchmarkSource.fileSize(64 * 1024));

Deno.bench({
    name: 'lexer',
    group: 'full - linear',
    fn: (): void => {
        BenchmarkProject.tokenize(gLinear);
    }
});

Deno.bench({
    name: 'lexer + parser',
    group: 'full - linear',
    baseline: true,
    ...gSlowCaseOptions,
    fn: (): void => {
        BenchmarkProject.parse(gLinear);
    }
});

Deno.bench({
    name: 'lexer',
    group: 'full - nested',
    fn: (): void => {
        BenchmarkProject.tokenize(gNested);
    }
});

Deno.bench({
    name: 'lexer + parser',
    group: 'full - nested',
    baseline: true,
    fn: (): void => {
        BenchmarkProject.parse(gNested);
    }
});

Deno.bench({
    name: 'lexer',
    group: 'full - attributes',
    fn: (): void => {
        BenchmarkProject.tokenize(gAttributes);
    }
});

Deno.bench({
    name: 'lexer + parser',
    group: 'full - attributes',
    baseline: true,
    ...gSlowCaseOptions,
    fn: (): void => {
        BenchmarkProject.parse(gAttributes);
    }
});

Deno.bench({
    name: 'lexer',
    group: 'full - file size',
    fn: (): void => {
        BenchmarkProject.tokenize(gFileSize);
    }
});

Deno.bench({
    name: 'lexer + parser',
    group: 'full - file size',
    baseline: true,
    fn: (): void => {
        BenchmarkProject.parse(gFileSize);
    }
});
