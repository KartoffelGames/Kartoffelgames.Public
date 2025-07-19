import { expect } from '@kartoffelgames/core-test';
import { InteractionZoneEvent } from '../source/interaction-zone/interaction-zone-event.ts';
import { InteractionZone } from '../source/interaction-zone/interaction-zone.ts';
import './mock/request-animation-frame-mock-session.ts';

Deno.test('InteractionZoneEvent.data', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lData = {};
        const lReason: InteractionZoneEvent<TestTriggerType, typeof lData> = new InteractionZoneEvent(TestTriggerType, TestTriggerType.Custom, lZone, lData);

        // Process
        const lResult = lReason.data;

        // Evaluation.
        expect(lResult).toBe(lData);
    });
});

Deno.test('InteractionZoneEvent.origin', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lReason: InteractionZoneEvent<TestTriggerType, object> = new InteractionZoneEvent(TestTriggerType, TestTriggerType.Custom, lZone, {});

        // Process
        const lResult = lReason.origin;

        // Evaluation.
        expect(lResult).toBe(lZone);
    });
});

Deno.test('InteractionZoneEvent.stacktrace', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');

        // Setup. Named function.
        function lMycoolname() {
            return new InteractionZoneEvent(TestTriggerType, TestTriggerType.Custom, lZone, {});
        }

        // Process
        const lResultEvent = lMycoolname();
        const lResultStackTrace = lResultEvent.stacktrace.stack;

        // Evaluation.
        expect(lResultStackTrace).toContain('lMycoolname');
    });
});

Deno.test('InteractionZoneEvent.trigger', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lInteractionTrigger = TestTriggerType.CustomDifferent;
        const lReason: InteractionZoneEvent<TestTriggerType, object> = new InteractionZoneEvent(TestTriggerType, lInteractionTrigger, lZone, {});

        // Process
        const lResult = lReason.trigger;

        // Evaluation.
        expect(lResult).toBe(lInteractionTrigger);
    });
});

Deno.test('InteractionZoneEvent.type', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lInteractionType = TestTriggerType;
        const lReason: InteractionZoneEvent<TestTriggerType, object> = new InteractionZoneEvent(lInteractionType, TestTriggerType.Custom, lZone, {});

        // Process
        const lResult = lReason.type;

        // Evaluation.
        expect(lResult).toBe(TestTriggerType);
    });
});

Deno.test('InteractionZoneEvent.toString()', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lInteractionType: typeof TestTriggerType = TestTriggerType;
        const lInteractionTrigger: TestTriggerType = TestTriggerType.Custom;
        const lData = { a: 1 };
        const lReason: InteractionZoneEvent<TestTriggerType, typeof lData> = new InteractionZoneEvent(lInteractionType, lInteractionTrigger, lZone, lData);

        // Process
        const lResult: string = lReason.toString();

        // Evaluation.
        expect(lResult).toBe(`${lZone.name} -> ${lInteractionType[lInteractionTrigger]} - ${lData.toString()}`);
    });
});

enum TestTriggerType {
    Custom = 1,
    CustomDifferent = 2
}