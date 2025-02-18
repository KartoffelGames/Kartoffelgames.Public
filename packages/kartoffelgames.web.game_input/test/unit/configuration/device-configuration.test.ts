import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { ButtonAction, DeviceConfiguration } from '../../../source/configuration/device-configuration.ts';
import { KeyboardButton } from '../../../source/enum/keyboard-button.enum.ts';

describe('DeviceConfiguration', () => {
    it('Property: keyActions', () => {
        // Setup. Variables.
        const lButtons = [KeyboardButton.KeyK];
        const lActionName = 'KEY_ACTION';

        // Setup.
        const lConfiguation: DeviceConfiguration = new DeviceConfiguration();
        lConfiguation.addAction(lActionName, lButtons);

        // Process.
        const lResult: Array<ButtonAction> = lConfiguation.keyActions;

        // Evaluation.
        expect(lResult).toBeDeepEqual([{ name: lActionName, buttons: lButtons }]);
    });

    it('Property: triggerTolerance', () => {
        // Setup. Variables.
        const lTriggerTolerance: number = 1;

        // Setup.
        const lConfiguation: DeviceConfiguration = new DeviceConfiguration();
        lConfiguation.triggerTolerance = lTriggerTolerance;

        // Process.
        const lResult: number = lConfiguation.triggerTolerance;

        // Evaluation.
        expect(lResult).toBe(lTriggerTolerance);
    });

    it('Method: addAction', () => {
        // Setup. Variables.
        const lButtons = [KeyboardButton.KeyK];
        const lActionName = 'KEY_ACTION';

        // Setup.
        const lConfiguation: DeviceConfiguration = new DeviceConfiguration();

        // Process.
        lConfiguation.addAction(lActionName, lButtons);
        const lResult: Array<ButtonAction> = lConfiguation.keyActions;

        // Evaluation.
        expect(lResult).toBeDeepEqual([{ name: lActionName, buttons: lButtons }]);
    });

    it('Method: clone', () => {
        // Setup.
        const lConfiguation: DeviceConfiguration = new DeviceConfiguration();
        lConfiguation.addAction('KEY_ACTION', [KeyboardButton.KeyK]);
        lConfiguation.triggerTolerance = 1;

        // Process.
        const lResult: DeviceConfiguration = lConfiguation.clone();

        // Evaluation.
        expect(lResult).toBeDeepEqual(lConfiguation);
    });

    describe('Method: getActionButtons', () => {
        it('-- Single action', () => {
            // Setup. Variables.
            const lButtons = [KeyboardButton.KeyK];
            const lActionName = 'KEY_ACTION';

            // Setup.
            const lConfiguation: DeviceConfiguration = new DeviceConfiguration();
            lConfiguation.addAction(lActionName, lButtons);

            // Process.
            const lResult = lConfiguation.getActionButtons(lActionName);

            // Evaluation.
            expect(lResult).toBeDeepEqual(lButtons);
        });

        it('-- No action', () => {
            // Setup.
            const lConfiguation: DeviceConfiguration = new DeviceConfiguration();

            // Process.
            const lResult = lConfiguation.getActionButtons('NOT_THERE');

            // Evaluation.
            expect(lResult).toHaveLength(0);
        });
    });

    describe('Method: getActionOfButton', () => {
        it('-- Single action', () => {
            // Setup. Variables.
            const lButton = KeyboardButton.KeyK;
            const lActionName = 'KEY_ACTION';

            // Setup.
            const lConfiguation: DeviceConfiguration = new DeviceConfiguration();
            lConfiguation.addAction(lActionName, [lButton]);

            // Process.
            const lResult = lConfiguation.getActionOfButton(lButton);

            // Evaluation.
            expect(lResult).toBeDeepEqual([lActionName]);
        });

        it('-- No action', () => {
            // Setup.
            const lConfiguation: DeviceConfiguration = new DeviceConfiguration();

            // Process.
            const lResult = lConfiguation.getActionOfButton(KeyboardButton.KeyK);

            // Evaluation.
            expect(lResult).toHaveLength(0);
        });
    });

});