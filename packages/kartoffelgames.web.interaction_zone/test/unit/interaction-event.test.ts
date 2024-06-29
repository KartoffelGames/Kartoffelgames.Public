import { expect } from 'chai';
import { InteractionEvent } from '../../source/zone/interaction-event';
import { InteractionZone } from '../../source/zone/interaction-zone';
import '../mock/request-animation-frame-mock-session';

describe('InteractionEvent', () => {
    it('Property: data', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lData = {};
        const lReason: InteractionEvent<object, number> = new InteractionEvent('CustomType', 1, lZone, lData);

        // Process
        const lResult = lReason.data;

        // Evaluation.
        expect(lResult).to.equal(lData);
    });

    it('Property: interactionTrigger', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lInteractionTrigger = 112244;
        const lReason: InteractionEvent<object, number> = new InteractionEvent('CustomType', lInteractionTrigger, lZone, {});

        // Process
        const lResult = lReason.interactionTrigger;

        // Evaluation.
        expect(lResult).to.equal(lInteractionTrigger);
    });

    it('Property: interactionType', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lInteractionType = 'MyOwnType';
        const lReason: InteractionEvent<object, number> = new InteractionEvent(lInteractionType, 11, lZone, {});

        // Process
        const lResult = lReason.interactionType;

        // Evaluation.
        expect(lResult).to.equal(lInteractionType);
    });

    it('Property: origin', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lReason: InteractionEvent<object, number> = new InteractionEvent('CustomType', 1, lZone, {});

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
            return new InteractionEvent('CustomType', 1, lZone, {});
        }

        // Process
        const lResultEvent = lMycoolname();
        const lResultStackTrace = lResultEvent.stacktrace.stack;

        // Evaluation.
        expect(lResultStackTrace).to.contain('lMycoolname');
    });

    describe('Method: addPushedZone', () => {
        it('-- Push new zone', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
            const lReason: InteractionEvent<object, number> = new InteractionEvent('CustomType', 1, lZone, {});

            // Process.
            const lResult = lReason.addPushedZone(lZone);

            // Evaluation.
            expect(lResult).to.be.false;
        });

        it('-- Push existing zone', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
            const lReason: InteractionEvent<object, number> = new InteractionEvent('CustomType', 1, lZone, {});

            // Process.
            lReason.addPushedZone(lZone);
            const lResult = lReason.addPushedZone(lZone);

            // Evaluation.
            expect(lResult).to.be.true;
        });
    });

    it('Method: toString', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lInteractionType: string = 'InterType';
        const lInteractionTrigger: number = 112266;
        const lData = { a: 1 };
        const lReason: InteractionEvent<object, number> = new InteractionEvent(lInteractionType, lInteractionTrigger, lZone, lData);

        // Process.
        const lResult = lReason.addPushedZone(lZone);

        // Evaluation.
        expect(lResult).to.equal(`${lZone.name} -> ${lInteractionType}:${lInteractionTrigger} - ${lData.toString()}`);

    });
});