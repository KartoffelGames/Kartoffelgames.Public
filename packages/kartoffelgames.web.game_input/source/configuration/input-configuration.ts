import { GamepadConfiguration } from './gamepad/gamepad-configuaration';
import { InputButtonAlias } from './input-button-alias';

export class InputConfiguration {
    private static readonly mGamepadMapping: GamepadConfiguration = new GamepadConfiguration();
    private static readonly mInputAlias: InputButtonAlias = new InputButtonAlias();

    /**
     * Button alias.
     */
    public static get alias(): InputButtonAlias {
        return InputConfiguration.alias;
    }

    /**
     * Gamepad configuration.
     */
    public static get gamepad(): GamepadConfiguration {
        return InputConfiguration.mGamepadMapping;
    }
}