import { Dictionary } from '@kartoffelgames/core';
import { GamepadButtonMapping } from '../configuration/gamepad-button-mapping';
import { IInputConnector } from '../interface/i-input-connector.interface';
import { InputDevices } from '../input-devices';
import { GamepadInputDevice, GamepadGameInputInformation } from '../device/gamepad-input-device';

/**
 * Handles connect and disconnection of gamepads.
 */
export class GamepadConnector implements IInputConnector {
    private static readonly mGamepads: Dictionary<number, GamepadInputDevice> = new Dictionary<number, GamepadInputDevice>();

    /**
     * Constructor.
     * Initialize connecting and disconnecting gamepads.
     */
    public init(pDevices: InputDevices): void {
        // Init connected gamepads.
        globalThis.addEventListener('gamepadconnected', (pEvent: GamepadEvent) => {
            this.connectGamepad(pEvent.gamepad, pDevices);
        });

        // Deconstruct disconnected gamepads.
        globalThis.addEventListener('gamepaddisconnected', (pEvent: GamepadEvent) => {
            this.disconnectGamepad(pEvent.gamepad, pDevices);
        });

        // Init gamepads that are connected before constructor call.
        for (const lGamepad of globalThis.navigator.getGamepads()) {
            if (lGamepad !== null) {
                this.connectGamepad(lGamepad, pDevices);
            }
        }
    }

    /**
     * Init gamepad.
     * Applies gamepad button mapping. 
     * @param pGamepad - Gamepad
     */
    private connectGamepad(pGamepad: Gamepad, pDevices: InputDevices): void {
        // Enable gamepad when already created.
        if (GamepadConnector.mGamepads.has(pGamepad.index)) {
            pDevices.registerDevice(GamepadConnector.mGamepads.get(pGamepad.index)!);
            return;
        }

        // Try to find mappig by id assignment.
        const lFoundMapping: GamepadButtonMapping = pDevices.configuration.getGampadMapping(pGamepad.id, pGamepad.mapping);

        // Build general gamepad information.
        const lGamepadInformation: GamepadGameInputInformation = {
            index: pGamepad.index,
            id: pGamepad.id,
            mapping: lFoundMapping
        };

        const lGamepadInput: GamepadInputDevice = new GamepadInputDevice(lGamepadInformation, pDevices.configuration);

        // Add GamepadGameInput to local store.
        GamepadConnector.mGamepads.add(pGamepad.index, lGamepadInput);

        // Add gamepad to global input devices.
        pDevices.registerDevice(lGamepadInput);
    }

    /**
     * Desconstruct gamepad.
     * @param pGamepad - Gamepad.
     */
    private disconnectGamepad(pGamepad: Gamepad, pDevices: InputDevices): void {
        // Only disconnect GamepadInput
        if (GamepadConnector.mGamepads.has(pGamepad.index)) {
            pDevices.unregisterDevice(GamepadConnector.mGamepads.get(pGamepad.index)!);
        }
    }
}