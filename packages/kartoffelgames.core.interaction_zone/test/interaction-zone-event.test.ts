import { expect } from '@kartoffelgames/core-test';
import { InteractionZoneEvent } from '../source/interaction-zone/interaction-zone-event.ts';
import { InteractionZone } from '../source/interaction-zone/interaction-zone.ts';

Deno.test('InteractionZoneEvent.data', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.create('ZoneName');
        const lData = {};
        const lReason: InteractionZoneEvent<typeof lData> = new InteractionZoneEvent(TestTriggerType.Custom, lZone, lData);

        // Process
        const lResult = lReason.data;

        // Evaluation.
        expect(lResult).toBe(lData);
    });
});

Deno.test('InteractionZoneEvent.origin', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.create('ZoneName');
        const lReason: InteractionZoneEvent<object> = new InteractionZoneEvent(TestTriggerType.Custom, lZone, {});

        // Process
        const lResult = lReason.origin;

        // Evaluation.
        expect(lResult).toBe(lZone);
    });
});

Deno.test('InteractionZoneEvent.triggerType', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.create('ZoneName');
        const lInteractionTrigger = TestTriggerType.CustomDifferent;
        const lReason: InteractionZoneEvent<object> = new InteractionZoneEvent(lInteractionTrigger, lZone, {});

        // Process
        const lResult = lReason.triggerType;

        // Evaluation.
        expect(lResult).toBe(lInteractionTrigger);
    });
});

enum TestTriggerType {
    Custom = 1,
    CustomDifferent = 2
}
