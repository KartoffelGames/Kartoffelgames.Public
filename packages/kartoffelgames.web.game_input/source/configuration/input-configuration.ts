import { GamepadConfiguration } from './gamepad/gamepad-configuaration';

export class InputConfiguration {
    private static readonly mGamepad: GamepadConfiguration = new GamepadConfiguration();

    /**
     * Gamepad configuration.
     */
    public static get gamepad(): GamepadConfiguration {
        return InputConfiguration.mGamepad;
    }
}