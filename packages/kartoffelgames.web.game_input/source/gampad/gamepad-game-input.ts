import { EnumUtil } from '@kartoffelgames/core.data';
import { GamepadButtonMapping } from '../configuration/gamepad/gamepad-button-mapping';
import { InputConfiguration } from '../configuration/input-configuration';
import { GamepadButton } from '../enum/gamepad-button.enum';
import { InputDevice } from '../enum/input-device.enum';
import { BaseGameInput } from '../game_input/base-game-input';

export class GamepadGameInput extends BaseGameInput {
    private readonly mGamepadInformation: GamepadGameInputInformation;

    /**
     * Constructor.
     * @param pGamepad - Gamepad object.
     */
    public constructor(pGamepad: GamepadGameInputInformation) {
        super(`gamepad_${pGamepad.id}`, InputDevice.Gamepad);

        this.mGamepadInformation = pGamepad;
        this.startScanLoop();
    }

    private startScanLoop(): void {
        // Get all gamepad buttons.
        const lGamepadButtonList: Array<GamepadButton> = EnumUtil.enumValuesToArray<GamepadButton>(GamepadButton);

        const lLoop = () => {
            // Only scan on connected gamepads.
            if (this.connected) {
                // Find connected gamepad.
                const lGamepad = globalThis.navigator.getGamepads().find((pGamepad) => {
                    return pGamepad?.id === this.mGamepadInformation.id;
                });

                // On found gamepad.
                if (lGamepad) {
                    // Scan each gamepad button.
                    for (const lButton of lGamepadButtonList) {
                        // Read button value.
                        let lButtonValue = this.mGamepadInformation.mapping.executeMapping(lButton, lGamepad);

                        // Apply tolerance.
                        if (lButtonValue < InputConfiguration.gamepad.triggerTolerance) {
                            lButtonValue = 0;
                        }

                        // Set button value.
                        this.setButtonState(lButton, lButtonValue);
                    }
                } else {
                    // Disconnect gamepad when not found.
                    this.connected = false;
                }
            }

            window.requestAnimationFrame(lLoop);
        };

        // Request starting animation frame.
        window.requestAnimationFrame(lLoop);
    }
}

export type GamepadGameInputInformation = {
    index: number;
    id: string;
    mapping: GamepadButtonMapping;
};