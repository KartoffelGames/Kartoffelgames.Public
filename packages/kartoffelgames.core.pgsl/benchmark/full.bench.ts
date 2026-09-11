import { BenchmarkProject } from './benchmark_project/benchmark-project.ts';
import { BenchmarkSource } from './benchmark_project/benchmark-source.ts';

/**
 * Input that exceeds everyday usage. The realistic shader of the medium benchmark with its
 * shading block repeated eight times under renamed declarations, roughly 43 kB and 8000 token.
 */
const gCode: string = BenchmarkSource.full(8);

// Fail before measuring. A shader with incidents never reaches the transpiler and would
// benchmark the validation error path instead of the pipeline.
BenchmarkProject.validate('full', gCode);

Deno.bench({
    name: 'lexer',
    group: 'full',
    fn: (): void => {
        BenchmarkProject.tokenize(gCode);
    }
});

Deno.bench({
    name: 'parser (cst)',
    group: 'full',
    fn: (): void => {
        BenchmarkProject.parse(gCode);
    }
});

Deno.bench({
    name: 'syntax tree (ast)',
    group: 'full',
    fn: (): void => {
        BenchmarkProject.parseAst(gCode);
    }
});

Deno.bench({
    name: 'transpile (wgsl)',
    group: 'full',
    baseline: true,
    fn: (): void => {
        BenchmarkProject.transpile(gCode);
    }
});
