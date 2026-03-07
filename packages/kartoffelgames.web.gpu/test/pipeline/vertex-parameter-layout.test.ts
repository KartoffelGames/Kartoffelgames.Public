import { expect } from '@kartoffelgames/core-test';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { VertexParameterLayout } from '../../source/pipeline/vertex_parameter/vertex-parameter-layout.ts';
import { VertexParameterStepMode } from '../../source/constant/vertex-parameter-step-mode.enum.ts';
import { BufferItemFormat } from '../../source/constant/buffer-item-format.enum.ts';
import { BufferItemMultiplier } from '../../source/constant/buffer-item-multiplier.enum.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function requestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

Deno.test('VertexParameterLayout.setup() -- single buffer with parameters', async (pContext) => {
    await pContext.step('Setup with a single vertex buffer and two parameters', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: VertexParameterLayout = new VertexParameterLayout(lDevice);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.buffer('vertexBuffer', VertexParameterStepMode.Vertex)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector3)
                .withParameter('color', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        });

        // Evaluation.
        const lBufferNames: Array<string> = lLayout.bufferNames;
        expect(lBufferNames.length).toBe(1);
        expect(lBufferNames[0]).toBe('vertexBuffer');

        const lParamNames: Array<string> = lLayout.parameterNames;
        expect(lParamNames.length).toBe(2);
    });
});

Deno.test('VertexParameterLayout.parameter()', async (pContext) => {
    await pContext.step('Returns parameter with correct name and location', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: VertexParameterLayout = new VertexParameterLayout(lDevice);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.buffer('buf', VertexParameterStepMode.Vertex)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector3)
                .withParameter('normal', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
        });

        // Evaluation.
        const lPositionParam = lLayout.parameter('position');
        expect(lPositionParam.name).toBe('position');
        expect(lPositionParam.location).toBe(0);

        const lNormalParam = lLayout.parameter('normal');
        expect(lNormalParam.name).toBe('normal');
        expect(lNormalParam.location).toBe(1);
    });
});

Deno.test('VertexParameterLayout.parameterBuffer()', async (pContext) => {
    await pContext.step('Returns buffer with computed layout sizes', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: VertexParameterLayout = new VertexParameterLayout(lDevice);

        // Process. Float32 Vector3 = 12 bytes, Float32 Vector4 = 16 bytes.
        lLayout.setup((pSetup) => {
            pSetup.buffer('vertexBuffer', VertexParameterStepMode.Vertex)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector3)
                .withParameter('color', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        });

        // Evaluation.
        const lBuffer = lLayout.parameterBuffer('vertexBuffer');
        expect(lBuffer.name).toBe('vertexBuffer');
        expect(lBuffer.stepMode).toBe(VertexParameterStepMode.Vertex);

        // The layout should have computed properties for each parameter.
        expect(lBuffer.layout.properties.length).toBe(2);
        expect(lBuffer.layout.properties[0].name).toBe('position');
        expect(lBuffer.layout.properties[0].byteSize).toBe(12); // Float32 * 3
        expect(lBuffer.layout.properties[1].name).toBe('color');
        expect(lBuffer.layout.properties[1].byteSize).toBe(16); // Float32 * 4
    });

    await pContext.step('Computed layout fixedSize is aligned to struct alignment', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: VertexParameterLayout = new VertexParameterLayout(lDevice);

        // Process. Single Float32 Single = 4 bytes, packed alignment = 1.
        lLayout.setup((pSetup) => {
            pSetup.buffer('simpleBuf', VertexParameterStepMode.Vertex)
                .withParameter('value', 0, BufferItemFormat.Float32, BufferItemMultiplier.Single);
        });

        // Evaluation. Packed alignment struct: fixedSize should be 4 (no padding needed).
        const lBuffer = lLayout.parameterBuffer('simpleBuf');
        expect(lBuffer.layout.fixedSize).toBe(4);
    });
});

Deno.test('VertexParameterLayout.indexable', async (pContext) => {
    await pContext.step('Returns false when any buffer uses Vertex step mode', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: VertexParameterLayout = new VertexParameterLayout(lDevice);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.buffer('vertexBuf', VertexParameterStepMode.Vertex)
                .withParameter('pos', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
        });

        // Evaluation.
        expect(lLayout.indexable).toBe(false);
    });

    await pContext.step('Returns true when all buffers use Instance or Index step mode', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: VertexParameterLayout = new VertexParameterLayout(lDevice);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.buffer('instanceBuf', VertexParameterStepMode.Instance)
                .withParameter('instanceData', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        });

        // Evaluation.
        expect(lLayout.indexable).toBe(true);
    });
});

Deno.test('VertexParameterLayout.setup() -- multiple buffers', async (pContext) => {
    await pContext.step('Setup with multiple vertex buffers', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: VertexParameterLayout = new VertexParameterLayout(lDevice);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.buffer('positions', VertexParameterStepMode.Vertex)
                .withParameter('pos', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
            pSetup.buffer('instances', VertexParameterStepMode.Instance)
                .withParameter('instanceOffset', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
        });

        // Evaluation.
        const lBufferNames: Array<string> = lLayout.bufferNames;
        expect(lBufferNames.length).toBe(2);

        const lParamNames: Array<string> = lLayout.parameterNames;
        expect(lParamNames.length).toBe(2);

        // Mixed step modes: vertex buffer present, so not indexable.
        expect(lLayout.indexable).toBe(false);
    });
});

Deno.test('VertexParameterLayout -- computed byte offsets', async (pContext) => {
    await pContext.step('Parameters have sequential byte offsets based on packed alignment', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: VertexParameterLayout = new VertexParameterLayout(lDevice);

        // Process. Two Float32 Vector3 parameters = 12 bytes each.
        lLayout.setup((pSetup) => {
            pSetup.buffer('buf', VertexParameterStepMode.Vertex)
                .withParameter('a', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector3)
                .withParameter('b', 1, BufferItemFormat.Float32, BufferItemMultiplier.Vector3);
        });

        // Evaluation. Packed alignment so no padding.
        const lBuffer = lLayout.parameterBuffer('buf');
        expect(lBuffer.layout.properties[0].byteOffset).toBe(0);
        expect(lBuffer.layout.properties[1].byteOffset).toBe(12);
    });
});
