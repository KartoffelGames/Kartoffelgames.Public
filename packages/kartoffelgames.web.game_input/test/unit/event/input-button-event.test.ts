import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { KeyboardButton } from '../../../source/enum/keyboard-button.enum.ts';
import { InputButtonEvent } from '../../../source/event/input-button-event.ts';
import { InputButton } from '../../../source/types.ts';

describe('InputButtonEvent', () => {
    it('Property: button', () => {
        // Setup.
        const lButton: InputButton = KeyboardButton.KeyK;
        const lEvent: InputButtonEvent = new InputButtonEvent('buttondown', lButton, 0);

        // Process.
        const lResult: InputButton = lEvent.button;

        // Evaluation.
        expect(lResult).toBe(lButton);
    });

    it('Property: isPressed', () => {
        // Setup.
        const lButton: InputButton = KeyboardButton.KeyK;
        const lEvent: InputButtonEvent = new InputButtonEvent('buttondown', lButton, 0.001);

        // Process.
        const lResult: boolean = lEvent.isPressed;

        // Evaluation.
        expect(lResult).toBeTruthy();
    });

    it('Property: state', () => {
        // Setup.
        const lState: number = 0.333;
        const lEvent: InputButtonEvent = new InputButtonEvent('buttondown', KeyboardButton.KeyK, lState);

        // Process.
        const lResult: number = lEvent.state;

        // Evaluation.
        expect(lResult).toBe(lState);
    });
});