import { expect } from '@kartoffelgames/core-test';
import { InteractionEvent } from '../source/zone/interaction-event.ts';
import { InteractionZone } from '../source/zone/interaction-zone.ts';
import './mock/request-animation-frame-mock-session.ts';

Deno.test('InteractionEvent.data', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lData = {};
        const lReason: InteractionEvent<TestTriggerType, typeof lData> = new InteractionEvent(TestTriggerType, TestTriggerType.Custom, lZone, lData);

        // Process
        const lResult = lReason.data;

        // Evaluation.
        expect(lResult).toBe(lData);
    });
});

Deno.test('InteractionEvent.origin', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lReason: InteractionEvent<TestTriggerType, object> = new InteractionEvent(TestTriggerType, TestTriggerType.Custom, lZone, {});

        // Process
        const lResult = lReason.origin;

        // Evaluation.
        expect(lResult).toBe(lZone);
    });
});

Deno.test('InteractionEvent.stacktrace', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');

        // Setup. Named function.
        function lMycoolname() {
            return new InteractionEvent(TestTriggerType, TestTriggerType.Custom, lZone, {});
        }

        // Process
        const lResultEvent = lMycoolname();
        const lResultStackTrace = lResultEvent.stacktrace.stack;

        // Evaluation.
        expect(lResultStackTrace).toContain('lMycoolname');
    });
});

Deno.test('InteractionEvent.trigger', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lInteractionTrigger = TestTriggerType.CustomDifferent;
        const lReason: InteractionEvent<TestTriggerType, object> = new InteractionEvent(TestTriggerType, lInteractionTrigger, lZone, {});

        // Process
        const lResult = lReason.trigger;

        // Evaluation.
        expect(lResult).toBe(lInteractionTrigger);
    });
});

Deno.test('InteractionEvent.type', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lInteractionType = TestTriggerType;
        const lReason: InteractionEvent<TestTriggerType, object> = new InteractionEvent(lInteractionType, TestTriggerType.Custom, lZone, {});

        // Process
        const lResult = lReason.type;

        // Evaluation.
        expect(lResult).toBe(TestTriggerType);
    });
});

Deno.test('InteractionEvent.toString()', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lInteractionType: typeof TestTriggerType = TestTriggerType;
        const lInteractionTrigger: TestTriggerType = TestTriggerType.Custom;
        const lData = { a: 1 };
        const lReason: InteractionEvent<TestTriggerType, typeof lData> = new InteractionEvent(lInteractionType, lInteractionTrigger, lZone, lData);

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