import { BenchmarkProject } from './benchmark_project/benchmark-project.ts';
import { BenchmarkSource } from './benchmark_project/benchmark-source.ts';

/**
 * Input that exceeds everyday usage. The realistic module of the medium benchmark repeated
 * eight times with renamed declarations, roughly 43 kB and 9200 token.
 */
const gCode: string = BenchmarkSource.full(8);

/**
 * Shapes that are pathological for a top down parser. Measured on their own, so a rewrite
 * shows which shape it improved instead of hiding all of them inside one total.
 */
const gStressDeepNesting: string = BenchmarkSource.stressDeepNesting(3);
const gStressLongChain: string = BenchmarkSource.stressLongChain(512);
const gStressWideRecord: string = BenchmarkSource.stressWideRecord(512);
const gStressWideCall: string = BenchmarkSource.stressWideCall(256);
const gStressBacktracking: string = BenchmarkSource.stressBacktracking(64);

// Fail before measuring, a failing parse would measure the error path instead of the parser.
BenchmarkProject.validate('full', gCode);
BenchmarkProject.validate('full - deep nesting', gStressDeepNesting);
BenchmarkProject.validate('full - long chain', gStressLongChain);
BenchmarkProject.validate('full - wide record', gStressWideRecord);
BenchmarkProject.validate('full - wide call', gStressWideCall);
BenchmarkProject.validate('full - backtracking', gStressBacktracking);

Deno.bench({
    name: 'lexer',
    group: 'full',
    fn: (): void => {
        BenchmarkProject.tokenize(gCode);
    }
});

Deno.bench({
    name: 'lexer + parser',
    group: 'full',
    baseline: true,
    fn: (): void => {
        BenchmarkProject.parse(gCode);
    }
});

Deno.bench({
    name: 'deep nesting',
    group: 'full - stress',
    fn: (): void => {
        BenchmarkProject.parse(gStressDeepNesting);
    }
});

Deno.bench({
    name: 'long chain',
    group: 'full - stress',
    fn: (): void => {
        BenchmarkProject.parse(gStressLongChain);
    }
});

Deno.bench({
    name: 'wide record',
    group: 'full - stress',
    fn: (): void => {
        BenchmarkProject.parse(gStressWideRecord);
    }
});

Deno.bench({
    name: 'wide call',
    group: 'full - stress',
    fn: (): void => {
        BenchmarkProject.parse(gStressWideCall);
    }
});

Deno.bench({
    name: 'backtracking',
    group: 'full - stress',
    fn: (): void => {
        BenchmarkProject.parse(gStressBacktracking);
    }
});
