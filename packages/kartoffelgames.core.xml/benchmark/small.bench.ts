import { BenchmarkProject } from './benchmark_project/benchmark-project.ts';
import { BenchmarkSource } from './benchmark_project/benchmark-source.ts';

/**
 * Smallest input that still produces a complete document.
 * One root node with one child node.
 */
const gXml: string = BenchmarkSource.SMALL;

// Fail before measuring, a failing parse would measure the error path instead of the parser.
BenchmarkProject.validate('small', gXml);

Deno.bench({
    name: 'lexer',
    group: 'small',
    fn: (): void => {
        BenchmarkProject.tokenize(gXml);
    }
});

Deno.bench({
    name: 'lexer + parser',
    group: 'small',
    baseline: true,
    fn: (): void => {
        BenchmarkProject.parse(gXml);
    }
});
