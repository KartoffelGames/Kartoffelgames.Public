import { BenchmarkProject } from './benchmark_project/benchmark-project.ts';
import { BenchmarkSource } from './benchmark_project/benchmark-source.ts';

/**
 * Smallest input that still produces transpiled code.
 * One module constant and one single statement function.
 */
const gCode: string = BenchmarkSource.SMALL;

// Fail before measuring. A shader with incidents never reaches the transpiler and would
// benchmark the validation error path instead of the pipeline.
BenchmarkProject.validate('small', gCode);

Deno.bench({
    name: 'lexer',
    group: 'small',
    fn: (): void => {
        BenchmarkProject.tokenize(gCode);
    }
});

Deno.bench({
    name: 'parser (cst)',
    group: 'small',
    fn: (): void => {
        BenchmarkProject.parse(gCode);
    }
});

Deno.bench({
    name: 'syntax tree (ast)',
    group: 'small',
    fn: (): void => {
        BenchmarkProject.parseAst(gCode);
    }
});

Deno.bench({
    name: 'transpile (wgsl)',
    group: 'small',
    baseline: true,
    fn: (): void => {
        BenchmarkProject.transpile(gCode);
    }
});
