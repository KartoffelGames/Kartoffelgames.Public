import { Dictionary } from '@kartoffelgames/core.data';
import { GamepadButtonMapping } from '../configuration/gamepad/gamepad-button-mapping';
import { InputConfiguration } from '../configuration/input-configuration';
import { GamepadGameInput, GamepadGameInputInformation } from './gamepad-game-input';

/**
 * Handles connect and disconnection of gamepads.
 */
export class GamepadConnection {
    private readonly mGamepads: Dictionary<string, GamepadGameInput>;

    /**
     * Get all gamepads.
     */
    public get gamepads(): Array<GamepadGameInput> {
        return [...this.mGamepads.values()];
    }

    /**
     * Constructor.
     * Initialize connecting and disconnecting gamepads.
     */
    public constructor() {
        this.mGamepads = new Dictionary<string, GamepadGameInput>();

        // Init connected gamepads.
        globalThis.addEventListener('gamepadconnected', (pEvent: GamepadEvent) => {
            this.initGamepad(pEvent.gamepad);
        });

        // Deconstruct disconnected gamepads.
        globalThis.addEventListener('gamepaddisconnected', (pEvent: GamepadEvent) => {
            this.deconstructGamepad(pEvent.gamepad);
        });

        // Init gamepads that are connected before constructor call.
        for (const lGamepad of globalThis.navigator.getGamepads()) {
            if (lGamepad !== null) {
                this.initGamepad(lGamepad);
            }
        }
    }

    /**
     * Desconstruct gamepad.
     * @param pGamepad - Gamepad.
     */
    private deconstructGamepad(pGamepad: Gamepad): void {
        // Only disconnect GamepadInput
        if (this.mGamepads.has(pGamepad.id)) {
            this.mGamepads.get(pGamepad.id)!.connected = false;
        }
    }

    /**
     * Init gamepad.
     * Applies gamepad button mapping. 
     * @param pGamepad - Gamepad
     */
    private initGamepad(pGamepad: Gamepad): void {
        // Enable gamepad when already created.
        if (this.mGamepads.has(pGamepad.id)) {
            this.mGamepads.get(pGamepad.id)!.connected = true;
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

        // Add GamepadGameInput
        this.mGamepads.add(pGamepad.id, new GamepadGameInput(lGamepadInformation));
    }
}