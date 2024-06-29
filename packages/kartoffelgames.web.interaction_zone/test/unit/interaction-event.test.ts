import { Exception } from '@kartoffelgames/core';
import { expect } from 'chai';
import { InteractionEvent } from '../../source/zone/interaction-event';
import { InteractionZone } from '../../source/zone/interaction-zone';
import '../mock/request-animation-frame-mock-session';

describe('InteractionEvent', () => {
    describe('Functionality: InteractionReason', () => {
        it('-- Read origin zone without dispatch', () => {
            // Setup.
            const lReason: InteractionEvent = new InteractionEvent(InteractionResponseType.None, {});

            // Process
            const lErrorFunction = () => {
                lReason.origin;
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(Exception, 'Interaction reason not dispatched.');
        });

        it('-- Passthrough function name.', () => {
            // Setup. 
            const lTarget = function lFunctionName() { };
            const lTrigger: number = 112233;

            // Setup. Create reason.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName', { trigger: InteractionResponseType.Custom });
            const lReason: InteractionEvent = new InteractionEvent(InteractionResponseType.Custom, lTarget);
            lReason.setOrigin(lZone);

            // Process
            const lReasonAsString = lReason.toString();

            // Evaluation.
            expect(lReasonAsString).to.equal(`${lZone.name}: ${typeof lTarget}:${'lFunctionName'} -> ${lTrigger}`);
        });

        it('-- Passthrough class name.', () => {
            // Setup. 
            const lTarget = new class ClassName { }();
            const lTrigger: number = 112233;

            // Setup. Create reason.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName', { trigger: InteractionResponseType.Custom });
            const lReason: InteractionEvent = new InteractionEvent(InteractionResponseType.Custom, lTarget);
            lReason.setOrigin(lZone);

            // Process
            const lReasonAsString = lReason.toString();

            // Evaluation.
            expect(lReasonAsString).to.equal(`${lZone.name}: ${typeof lTarget}:${'ClassName'} -> ${lTrigger}`);
        });

        it('-- Passthrough property name.', () => {
            // Setup. 
            const lTarget = new class ClassName { }();
            const lPropertyName: string = 'PropertyName';
            const lTrigger: number = 112233;

            // Setup. Create reason.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName', { trigger: InteractionResponseType.Custom });
            const lReason: InteractionEvent = new InteractionEvent(InteractionResponseType.Custom, lTarget, lPropertyName);
            lReason.setOrigin(lZone);

            // Process
            const lReasonAsString = lReason.toString();

            // Evaluation.
            expect(lReasonAsString).to.equal(`${lZone.name}: ${typeof lTarget}:${'ClassName'}[${lPropertyName}] -> ${lTrigger}`);
        });

        it('-- Correct origin', () => {
            // Setup. Create reason.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName', { trigger: InteractionResponseType.Custom });
            const lReason: InteractionEvent = new InteractionEvent(InteractionResponseType.Custom, {});
            lReason.setOrigin(lZone);

            // Process
            const lReasonOrigin = lReason.origin;

            // Evaluation.
            expect(lReasonOrigin).to.equal(lZone);
        });
    });
});