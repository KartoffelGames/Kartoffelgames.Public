import { BenchmarkProject } from './benchmark_project/benchmark-project.ts';
import { BenchmarkSource } from './benchmark_project/benchmark-source.ts';

/**
 * Everyday sized input. One realistic module with records, enums, constants and functions
 * that use every statement and expression kind of the language.
 */
const gCode: string = BenchmarkSource.medium;

// Fail before measuring, a failing parse would measure the error path instead of the parser.
BenchmarkProject.validate('medium', gCode);

Deno.bench({
    name: 'lexer',
    group: 'medium',
    fn: (): void => {
        BenchmarkProject.tokenize(gCode);
    }
});

Deno.bench({
    name: 'lexer + parser',
    group: 'medium',
    baseline: true,
    fn: (): void => {
        BenchmarkProject.parse(gCode);
    }
});
