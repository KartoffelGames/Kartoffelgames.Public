import { expect } from 'chai';
import { GamepadButton } from '../../../source/enum/gamepad-button.enum';
import { GamepadButtonMapping } from '../../../source/configuration/gamepad-button-mapping';
import { ButtonValueType } from '../../../source/enum/button-value-type.enum';

const gGetGamepad = (pButtonIndex: number, pType: ButtonValueType, pValue: number) => {
    const lGamepad: any = {
        buttons: [],
        axes: []
    };

    if (pType === ButtonValueType.Axis) {
        lGamepad.axes[pButtonIndex] = pValue;
    } else {
        lGamepad.buttons[pButtonIndex] = { value: pValue, pressed: (pValue === 1), touched: (pValue > 0) };
    }

    return lGamepad;
};

describe('GamepadButtonMapping', () => {
    describe('Method: constructor', () => {
        it('-- With mapping', () => {
            // Setup.
            const lButton: GamepadButton = GamepadButton.ButtonLeft;
            const lButtonType: ButtonValueType = ButtonValueType.Button;
            const lButtonIndex: number = 1;
            const lButtonValue: number = 1;

            const lGamepad = gGetGamepad(lButtonIndex, lButtonType, lButtonValue);

            // Process.
            const lMapping: GamepadButtonMapping = new GamepadButtonMapping({
                [lButton]: { type: lButtonType, index: lButtonIndex }
            });
            const lMappingResult = lMapping.executeMapping(lButton, lGamepad);

            // Evaluation.
            expect(lMappingResult).to.equal(lButtonValue);
        });

        it('-- Without mapping', () => {
            // Setup.
            const lGamepad = gGetGamepad(1, ButtonValueType.Button, 1);

            // Process.
            const lMapping: GamepadButtonMapping = new GamepadButtonMapping();
            const lMappingResult = lMapping.executeMapping(GamepadButton.ButtonLeft, lGamepad);

            // Evaluation.
            expect(lMappingResult).to.equal(0);
        });
    });

    it('Method: addMapping', () => {
        // Setup.
        const lButton: GamepadButton = GamepadButton.ButtonLeft;
        const lButtonType: ButtonValueType = ButtonValueType.Button;
        const lButtonIndex: number = 1;
        const lButtonValue: number = 1;
        const lMapping: GamepadButtonMapping = new GamepadButtonMapping();
        const lGamepad = gGetGamepad(lButtonIndex, lButtonType, lButtonValue);

        // Process.
        lMapping.addMapping(lButton, lButtonType, lButtonIndex);
        const lMappingResult = lMapping.executeMapping(lButton, lGamepad);

        // Evaluation.
        expect(lMappingResult).to.equal(lButtonValue);
    });

    describe('Method: executeMapping', () => {
        it('-- Without mapping', () => {
            // Setup.
            const lGamepad = gGetGamepad(1, ButtonValueType.Button, 1);

            // Process.
            const lMapping: GamepadButtonMapping = new GamepadButtonMapping();
            const lMappingResult = lMapping.executeMapping(GamepadButton.ButtonLeft, lGamepad);

            // Evaluation.
            expect(lMappingResult).to.equal(0);
        });

        it('-- Button mapping', () => {
            // Setup.
            const lButton: GamepadButton = GamepadButton.ButtonLeft;
            const lButtonType: ButtonValueType = ButtonValueType.Button;
            const lButtonIndex: number = 1;
            const lButtonValue: number = 1;
            const lMapping: GamepadButtonMapping = new GamepadButtonMapping({
                [lButton]: { type: lButtonType, index: lButtonIndex }
            });
            const lGamepad = gGetGamepad(lButtonIndex, lButtonType, lButtonValue);

            // Process.
            const lMappingResult = lMapping.executeMapping(lButton, lGamepad);

            // Evaluation.
            expect(lMappingResult).to.equal(lButtonValue);
        });

        it('-- Axis mapping', () => {
            // Setup.
            const lButton: GamepadButton = GamepadButton.LeftThumbStickYaxis;
            const lButtonType: ButtonValueType = ButtonValueType.Axis;
            const lButtonIndex: number = 1;
            const lButtonValue: number = 0.4;
            const lMapping: GamepadButtonMapping = new GamepadButtonMapping({
                [lButton]: { type: lButtonType, index: lButtonIndex }
            });
            const lGamepad = gGetGamepad(lButtonIndex, lButtonType, lButtonValue);

            // Process.
            const lMappingResult = lMapping.executeMapping(lButton, lGamepad);

            // Evaluation.
            expect(lMappingResult).to.equal(lButtonValue);
        });
    });
});