import { expect } from 'chai';
import { InteractionEvent } from '../../source/zone/interaction-event';
import { InteractionZone } from '../../source/zone/interaction-zone';
import '../mock/request-animation-frame-mock-session';

describe('InteractionEvent', () => {
    it('Property: data', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lData = {};
        const lReason: InteractionEvent<TestTriggerType, typeof lData> = new InteractionEvent(TestTriggerType, TestTriggerType.Custom, lZone, lData);

        // Process
        const lResult = lReason.data;

        // Evaluation.
        expect(lResult).to.equal(lData);
    });

    it('Property: origin', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lReason: InteractionEvent<TestTriggerType, object> = new InteractionEvent(TestTriggerType, TestTriggerType.Custom, lZone, {});

        // Process
        const lResult = lReason.origin;

        // Evaluation.
        expect(lResult).to.equal(lZone);
    });

    it('Property: stacktrace', () => {
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
        expect(lResultStackTrace).to.contain('lMycoolname');
    });

    it('Property: trigger', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lInteractionTrigger = TestTriggerType.CustomDifferent;
        const lReason: InteractionEvent<TestTriggerType, object> = new InteractionEvent(TestTriggerType, lInteractionTrigger, lZone, {});

        // Process
        const lResult = lReason.trigger;

        // Evaluation.
        expect(lResult).to.equal(lInteractionTrigger);
    });

    it('Property: type', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lInteractionType = TestTriggerType;
        const lReason: InteractionEvent<TestTriggerType, object> = new InteractionEvent(lInteractionType, TestTriggerType.Custom, lZone, {});

        // Process
        const lResult = lReason.type;

        // Evaluation.
        expect(lResult).to.equal(TestTriggerType);
    });

    it('Method: toString', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lInteractionType: typeof TestTriggerType = TestTriggerType;
        const lInteractionTrigger: TestTriggerType = TestTriggerType.Custom;
        const lData = { a: 1 };
        const lReason: InteractionEvent<TestTriggerType, typeof lData> = new InteractionEvent(lInteractionType, lInteractionTrigger, lZone, lData);

        // Process
        const lResult: string = lReason.toString();

        // Evaluation.
        expect(lResult).to.equal(`${lZone.name} -> ${lInteractionType}:${lInteractionTrigger} - ${lData.toString()}`);

    });
});

enum TestTriggerType {
    Custom = 1,
    CustomDifferent = 2
}