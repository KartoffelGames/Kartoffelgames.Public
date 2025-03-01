import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { KeyboardButton } from '../../../source/enum/keyboard-button.enum.ts';
import { InputActionEvent } from '../../../source/event/input-action-event.ts';
import type { InputButton } from '../../../source/types.ts';

describe('InputActionEvent', () => {
    it('Property: action', () => {
        // Setup.
        const lAction: string = 'ACTION_NAME';
        const lEvent: InputActionEvent = new InputActionEvent('actiondown', lAction, 0, [KeyboardButton.KeyK]);

        // Process.
        const lResult: string = lEvent.action;

        // Evaluation.
        expect(lResult).toBe(lAction);
    });

    it('Property: button', () => {
        // Setup.
        const lButtons: Array<InputButton> = [KeyboardButton.KeyK];
        const lEvent: InputActionEvent = new InputActionEvent('actiondown', 'ACTION_NAME', 0, lButtons);

        // Process.
        const lResult: Array<InputButton> = lEvent.buttons;

        // Evaluation.
        expect(lResult).toBeDeepEqual(lButtons);
    });

    it('Property: isPressed', () => {
        // Setup.
        const lEvent: InputActionEvent = new InputActionEvent('actiondown', 'ACTION_NAME', 0.001, [KeyboardButton.KeyK]);

        // Process.
        const lResult: boolean = lEvent.isPressed;

        // Evaluation.
        expect(lResult).toBeTruthy();
    });

    it('Property: state', () => {
        // Setup.
        const lState: number = 0.333;
        const lEvent: InputActionEvent = new InputActionEvent('actiondown', 'ACTION_NAME', lState, [KeyboardButton.KeyK]);

        // Process.
        const lResult: number = lEvent.state;

        // Evaluation.
        expect(lResult).toBe(lState);
    });
});