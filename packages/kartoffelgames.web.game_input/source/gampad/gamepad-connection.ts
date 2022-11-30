import { Dictionary } from '@kartoffelgames/core.data';
import { GamepadButtonMapping } from '../configuration/gamepad/gamepad-button-mapping';
import { InputConfiguration } from '../configuration/input-configuration';
import { InputDevices } from '../input-devices';
import { GamepadGameInput, GamepadGameInputInformation } from './gamepad-game-input';

/**
 * Handles connect and disconnection of gamepads.
 */
export class GamepadConnection {
    private static readonly mGamepads: Dictionary<string, GamepadGameInput> = new Dictionary<string, GamepadGameInput>();

    /**
     * Constructor.
     * Initialize connecting and disconnecting gamepads.
     */
    public static init(): void {
        // Init connected gamepads.
        globalThis.addEventListener('gamepadconnected', (pEvent: GamepadEvent) => {
            GamepadConnection.initGamepad(pEvent.gamepad);
        });

        // Deconstruct disconnected gamepads.
        globalThis.addEventListener('gamepaddisconnected', (pEvent: GamepadEvent) => {
            GamepadConnection.deconstructGamepad(pEvent.gamepad);
        });

        // Init gamepads that are connected before constructor call.
        for (const lGamepad of globalThis.navigator.getGamepads()) {
            if (lGamepad !== null) {
                GamepadConnection.initGamepad(lGamepad);
            }
        }
    }

    /**
     * Desconstruct gamepad.
     * @param pGamepad - Gamepad.
     */
    private static deconstructGamepad(pGamepad: Gamepad): void {
        // Only disconnect GamepadInput
        if (GamepadConnection.mGamepads.has(pGamepad.id)) {
            GamepadConnection.mGamepads.get(pGamepad.id)!.connected = false;
        }
    }

    /**
     * Init gamepad.
     * Applies gamepad button mapping. 
     * @param pGamepad - Gamepad
     */
    private static initGamepad(pGamepad: Gamepad): void {
        // Enable gamepad when already created.
        if (GamepadConnection.mGamepads.has(pGamepad.id)) {
            GamepadConnection.mGamepads.get(pGamepad.id)!.connected = true;
            return;
        }

        // Try to find mappig by id assignment.
        let lFoundMapping: GamepadButtonMapping | null = InputConfiguration.gamepad.getMapping(pGamepad.id);

        // Fallback to gamepad mapping property.
        if (!lFoundMapping) {
            if (pGamepad.mapping === 'standard') {
                lFoundMapping = InputConfiguration.gamepad.standardMapping;
            } else {
                // There are more mapping types, but ignored for now. :) hehe
                lFoundMapping = InputConfiguration.gamepad.standardMapping;
            }
        }

        // Build general gamepad information.
        const lGamepadInformation: GamepadGameInputInformation = {
            index: pGamepad.index,
            id: pGamepad.id,
            mapping: lFoundMapping
        };

        const lGamepadInput: GamepadGameInput = new GamepadGameInput(lGamepadInformation);

        // Add GamepadGameInput to local store.
        GamepadConnection.mGamepads.add(pGamepad.id, lGamepadInput);

        // Add gamepad to global input devices.
        InputDevices.registerDevice(lGamepadInput);
    }
}