import { BenchmarkProject } from './benchmark_project/benchmark-project.ts';
import { BenchmarkSource } from './benchmark_project/benchmark-source.ts';

/**
 * Everyday sized input. One realistic forward shader with world, object and material bindings,
 * a full shading block and a vertex and fragment entry point.
 */
const gCode: string = BenchmarkSource.medium;

// Fail before measuring. A shader with incidents never reaches the transpiler and would
// benchmark the validation error path instead of the pipeline.
BenchmarkProject.validate('medium', gCode);

Deno.bench({
    name: 'lexer',
    group: 'medium',
    fn: (): void => {
        BenchmarkProject.tokenize(gCode);
    }
});

Deno.bench({
    name: 'parser (cst)',
    group: 'medium',
    fn: (): void => {
        BenchmarkProject.parse(gCode);
    }
});

Deno.bench({
    name: 'syntax tree (ast)',
    group: 'medium',
    fn: (): void => {
        BenchmarkProject.parseAst(gCode);
    }
});

Deno.bench({
    name: 'transpile (wgsl)',
    group: 'medium',
    baseline: true,
    fn: (): void => {
        BenchmarkProject.transpile(gCode);
    }
});
