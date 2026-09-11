import { BenchmarkProject } from './benchmark_project/benchmark-project.ts';
import { BenchmarkSource } from './benchmark_project/benchmark-source.ts';

/**
 * Smallest input that still produces a complete document.
 * One module declaration, one constant and one single statement function.
 */
const gCode: string = BenchmarkSource.SMALL;

// Fail before measuring, a failing parse would measure the error path instead of the parser.
BenchmarkProject.validate('small', gCode);

Deno.bench({
    name: 'lexer',
    group: 'small',
    fn: (): void => {
        BenchmarkProject.tokenize(gCode);
    }
});

Deno.bench({
    name: 'lexer + parser',
    group: 'small',
    baseline: true,
    fn: (): void => {
        BenchmarkProject.parse(gCode);
    }
});
