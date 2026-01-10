import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from "../source/parser/pgsl-parser.ts";
import { PgslParserResult } from "../source/parser_result/pgsl-parser-result.ts";
import { WgslTranspiler } from "../source/transpilation/wgsl/wgsl-transpiler.ts";

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('WebGPU - Compatibility', async () => {
    const lCodeText: string = `function testFunction(): void {}`; // TODO: Full shader code.

    // Setup. Transpile PGSL to WGSL.
    const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

    // Setup. Request WebGPU device.
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter?.requestDevice();
    if (!device) {
        throw new Error("No suitable adapter found");
    }

    // Process. Create shader module with new error scope.
    device.pushErrorScope('validation');
    const shaderModule = device.createShaderModule({
        code: lTranspilationResult.source
    });

    // Validate. Should produce no error.
    expect(await device.popErrorScope()).toBeNull();

    // TODO: Do something with the shader module.
});