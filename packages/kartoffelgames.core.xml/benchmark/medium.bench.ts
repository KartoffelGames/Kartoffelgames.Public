import { BenchmarkProject } from './benchmark_project/benchmark-project.ts';
import { BenchmarkSource } from './benchmark_project/benchmark-source.ts';

/**
 * Everyday sized input. One shallow nested document of roughly 20 elements with a default
 * namespace, prefixed namespaces, prefixed attributes, comments and text content.
 */
const gXml: string = BenchmarkSource.MEDIUM;

// Fail before measuring, a failing parse would measure the error path instead of the parser.
BenchmarkProject.validate('medium', gXml);

Deno.bench({
    name: 'lexer',
    group: 'medium',
    fn: (): void => {
        BenchmarkProject.tokenize(gXml);
    }
});

Deno.bench({
    name: 'lexer + parser',
    group: 'medium',
    baseline: true,
    fn: (): void => {
        BenchmarkProject.parse(gXml);
    }
});
