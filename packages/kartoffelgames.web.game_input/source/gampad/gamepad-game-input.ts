import { GamepadButtonMapping } from '../configuration/gamepad/gamepad-button-mapping';
import { InputDevice } from '../enum/input-device.enum';
import { BaseGameInput } from '../game_input/base-game-input';

export class GamepadGameInput extends BaseGameInput {
    private readonly mGamepadId: string;

    /**
     * Constructor.
     * @param pGamepad - Gamepad object.
     */
    public constructor(pGamepad: GamepadGameInputInformation) {
        super(`gamepad_${pGamepad.id}`, InputDevice.Gamepad);

        this.mGamepadId = pGamepad.id;
        this.startScanLoop();
    }

    private startScanLoop(): void {
        const lLoop = () => {
            // Only scan on connected gamepads.
            if (this.connected) {
                // Find connected gamepad.
                const lGamepad = globalThis.navigator.getGamepads().find((pGamepad) => {
                    return pGamepad?.id === this.mGamepadId;
                });

                // TODO: Pressed state. Apply tolerance.
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