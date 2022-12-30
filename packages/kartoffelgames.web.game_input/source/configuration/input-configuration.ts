import { GamepadConfiguration } from './gamepad/gamepad-configuration';

export class InputConfiguration {
    private readonly mGamepad: GamepadConfiguration;

    /**
     * Gamepad configuration.
     */
     public get gamepad(): GamepadConfiguration {
        return this.mGamepad;
    }

    public constructor() {
        this.mGamepad = new GamepadConfiguration();
    }
}