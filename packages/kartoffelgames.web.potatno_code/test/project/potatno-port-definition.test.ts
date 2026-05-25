import { expect } from '@kartoffelgames/core-test';
import { PotatnoPortDefinition } from '../../source/project/potatno-port-definition.ts';

Deno.test('PotatnoPortDefinition.new()', async (pContext) => {
    await pContext.step('Construct flow port', () => {
        // Setup. Process.
        const lPort = PotatnoPortDefinition.new({
            label: 'exec', id: 'exec', portType: 'flow'
        });

        // Evaluation.
        expect(lPort).toBeDefined();
        expect(lPort.portType).toBe('flow');
    });

    await pContext.step('Construct value port with concrete data type', () => {
        // Setup. Process.
        const lPort = PotatnoPortDefinition.new({
            label: 'value', id: 'value', portType: 'value', dataType: 'number' as never
        });

        // Evaluation.
        expect(lPort.portType).toBe('value');
        expect(lPort.dataType).toBe('number');
    });

    await pContext.step('Construct value port with generic data type', () => {
        // Setup. Process.
        const lPort = PotatnoPortDefinition.new({
            label: 'value', id: 'value', portType: 'value', dataType: '<T>'
        });

        // Evaluation.
        expect(lPort.portType).toBe('value');
        expect(lPort.dataType).toBe('<T>');
    });
});

Deno.test('PotatnoPortDefinition.label', async (pContext) => {
    await pContext.step('Returns the provided label', () => {
        // Setup.
        const lPort = PotatnoPortDefinition.new({
            label: 'theLabel', id: 'i', portType: 'flow'
        });

        // Process.
        const lResult: string = lPort.label;

        // Evaluation.
        expect(lResult).toBe('theLabel');
    });
});

Deno.test('PotatnoPortDefinition.id', async (pContext) => {
    await pContext.step('Returns the provided id', () => {
        // Setup.
        const lPort = PotatnoPortDefinition.new({
            label: 'l', id: 'theId', portType: 'flow'
        });

        // Process.
        const lResult: string = lPort.id;

        // Evaluation.
        expect(lResult).toBe('theId');
    });
});

Deno.test('PotatnoPortDefinition.portType', async (pContext) => {
    await pContext.step("Returns 'flow' for flow ports", () => {
        // Setup. Process.
        const lPort = PotatnoPortDefinition.new({ label: 'l', id: 'i', portType: 'flow' });

        // Evaluation.
        expect(lPort.portType).toBe('flow');
    });

    await pContext.step("Returns 'value' for value ports", () => {
        // Setup. Process.
        const lPort = PotatnoPortDefinition.new({
            label: 'l', id: 'i', portType: 'value', dataType: 'number' as never
        });

        // Evaluation.
        expect(lPort.portType).toBe('value');
    });
});

Deno.test('PotatnoPortDefinition.dataType', async (pContext) => {
    await pContext.step('Returns the configured data type for value ports', () => {
        // Setup.
        const lPort = PotatnoPortDefinition.new({
            label: 'l', id: 'i', portType: 'value', dataType: 'number' as never
        });

        // Process.
        const lResult = lPort.dataType;

        // Evaluation.
        expect(lResult).toBe('number');
    });

    await pContext.step('Returns null for flow ports', () => {
        // Setup.
        const lPort = PotatnoPortDefinition.new({ label: 'l', id: 'i', portType: 'flow' });

        // Process.
        const lResult = lPort.dataType;

        // Evaluation.
        expect(lResult).toBeNull();
    });
});

Deno.test('PotatnoPortDefinition.regions', async (pContext) => {
    await pContext.step('Returns empty add array when no regions provided', () => {
        // Setup. Process.
        const lPort = PotatnoPortDefinition.new({ label: 'l', id: 'i', portType: 'flow' });

        // Evaluation.
        expect(lPort.regions.add.length).toBe(0);
    });

    await pContext.step('Returns the configured add regions', () => {
        // Setup. Process.
        const lPort = PotatnoPortDefinition.new({
            label: 'l', id: 'i', portType: 'flow',
            regions: { add: ['regionOne', 'regionTwo'] }
        });

        // Evaluation.
        expect(lPort.regions.add.length).toBe(2);
        expect(lPort.regions.add[0]).toBe('regionOne');
        expect(lPort.regions.add[1]).toBe('regionTwo');
    });
});
