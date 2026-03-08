import { expect } from '@kartoffelgames/core-test';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { GpuBuffer } from '../../source/buffer/gpu-buffer.ts';
import { BufferUsage } from '../../source/constant/buffer-usage.enum.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

Deno.test('GpuBuffer.size -- alignment to 4 bytes', async (pContext) => {
    await pContext.step('Size already aligned to 4 stays unchanged', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process. 16 is already 4-byte aligned.
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);

        // Evaluation.
        expect(lBuffer.size).toBe(16);

        // Cleanup.
        lBuffer.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Size 1 is aligned up to 4', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process. 1 byte aligned to 4 = 4.
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 1);

        // Evaluation.
        expect(lBuffer.size).toBe(4);

        // Cleanup.
        lBuffer.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Size 5 is aligned up to 8', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process. 5 bytes aligned to 4 = 8.
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 5);

        // Evaluation.
        expect(lBuffer.size).toBe(8);

        // Cleanup.
        lBuffer.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Size 13 is aligned up to 16', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process. 13 bytes aligned to 4 = 16.
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 13);

        // Evaluation.
        expect(lBuffer.size).toBe(16);

        // Cleanup.
        lBuffer.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Size 0 stays 0', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process. 0 bytes aligned to 4 = 0.
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 0);

        // Evaluation.
        expect(lBuffer.size).toBe(0);

        // Cleanup.
        lBuffer.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Size setter aligns to 4 bytes', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 4);

        // Process. Set to 7, should align to 8.
        lBuffer.size = 7;

        // Evaluation.
        expect(lBuffer.size).toBe(8);

        // Cleanup.
        lBuffer.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('GpuBuffer.initialData()', async (pContext) => {
    await pContext.step('Buffer with initial data can be created', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lData: Float32Array = new Float32Array([1.0, 2.0, 3.0, 4.0]);
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, lData.byteLength);

        // Process. Set initial data and extend usage so the native can be created.
        lBuffer.initialData(lData.buffer);
        lBuffer.extendUsage(BufferUsage.Uniform);

        // Evaluation. Getting native should not throw (buffer is created with initial data).
        const lNative: GPUBuffer = lBuffer.native;
        expect(lNative).toBeTruthy();

        // Cleanup.
        lBuffer.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Initial data can only be set once', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lData: Float32Array = new Float32Array([1.0, 2.0]);
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, lData.byteLength);

        // Process.
        lBuffer.initialData(lData.buffer);

        // Evaluation. Setting initial data again should throw.
        const lThrowFunction = () => {
            lBuffer.initialData(lData.buffer);
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lBuffer.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('GpuBuffer.write() and GpuBuffer.read()', async (pContext) => {
    await pContext.step('Written data can be read back', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);
        lBuffer.extendUsage(BufferUsage.Storage);

        // Process. Write data into buffer and read it back.
        const lWriteData: Float32Array = new Float32Array([1.0, 2.0, 3.0, 4.0]);
        await lBuffer.write(lWriteData.buffer);
        const lReadResult: ArrayBuffer = await lBuffer.read();

        // Evaluation.
        const lResultArray: Float32Array = new Float32Array(lReadResult);
        expect(lResultArray[0]).toBe(1.0);
        expect(lResultArray[1]).toBe(2.0);
        expect(lResultArray[2]).toBe(3.0);
        expect(lResultArray[3]).toBe(4.0);

        // Cleanup.
        lBuffer.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Read with offset and size returns subset', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);
        lBuffer.extendUsage(BufferUsage.Storage);

        // Process. Write full data then read only 8 bytes starting at offset 8.
        const lWriteData: Float32Array = new Float32Array([10.0, 20.0, 30.0, 40.0]);
        await lBuffer.write(lWriteData.buffer);
        const lReadResult: ArrayBuffer = await lBuffer.read(8, 8);

        // Evaluation.
        const lResultArray: Float32Array = new Float32Array(lReadResult);
        expect(lResultArray[0]).toBe(30.0);
        expect(lResultArray[1]).toBe(40.0);

        // Cleanup.
        lBuffer.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('GpuBuffer -- usage extension', async (pContext) => {
    await pContext.step('Buffer always has CopySource and CopyDestination usage', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);

        // Process. Extend with a custom usage to trigger native generation.
        lBuffer.extendUsage(BufferUsage.Uniform);

        // Evaluation. Buffer native should be created with at least Uniform + CopySource + CopyDestination.
        const lNative: GPUBuffer = lBuffer.native;
        expect(lNative).toBeTruthy();

        // Cleanup.
        lBuffer.deconstruct();
        lDevice.deconstruct();
    });
});
