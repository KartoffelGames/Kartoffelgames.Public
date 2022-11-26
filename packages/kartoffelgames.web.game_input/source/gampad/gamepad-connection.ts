import { Dictionary } from '@kartoffelgames/core.data';
import { InputConfiguration } from '../configuration/input-configuration';
import { GamepadButtonMapping } from '../configuration/gamepad/gamepad-button-mapping';

// TODO: Listener
// TODO: Pressed state. Apply tolerance.
// TODO: GamepadGameInput for each connected gamepad.
// TODO: Disconnect and not delete on gamepad disconnect.

export class GamepadConnection {
    private static mIntervalStarted: boolean = false;

    private readonly mGamepads: Dictionary<number, GamepadInformation>;

    /**
     * Constructor.
     * Initialize connecting and disconnecting gamepads.
     */
    public constructor() {
        this.mGamepads = new Dictionary<number, GamepadInformation>();

        // Init connected gamepads.
        globalThis.addEventListener('gamepadconnected', (pEvent: GamepadEvent) => {
            this.initGamepad(pEvent.gamepad);
        });

        // Deconstruct disconnected gamepads.
        globalThis.addEventListener('gamepaddisconnected', (pEvent: GamepadEvent) => {
            this.deconstructGamepad(pEvent.gamepad.index);
        });

        // Init gamepads that are connected before constructor call.
        for (const lGamepad of globalThis.navigator.getGamepads()) {
            if (lGamepad !== null) {
                this.initGamepad(lGamepad);
            }
        }

        // Polling when no auto connection is available. Only starte once.
        if (!GamepadConnection.mIntervalStarted) {
            GamepadConnection.mIntervalStarted = true;

            // Poll connection state every one second.
            globalThis.setInterval(() => {
                // Connect gamepads.
                const lGamepadList = globalThis.navigator.getGamepads();
                for (const lGamepad of lGamepadList) {
                    if (lGamepad !== null && !this.mGamepads.has(lGamepad.index) && lGamepad.connected) {
                        // Dispatch gamepad connect event.
                        globalThis.dispatchEvent(new GamepadEvent('gamepadconnected', { gamepad: lGamepad }));
                    }
                }

                // Disconnect gamepads.
                for (const lGamepadIndex of this.mGamepads.keys()) {
                    const lGamepad: Gamepad | null | undefined = lGamepadList[lGamepadIndex];
                    if (!lGamepad || !lGamepad.connected) {
                        globalThis.dispatchEvent(new GamepadEvent('gamepaddisconnected', { gamepad: <Gamepad>{ index: lGamepadIndex } }));
                    }
                }
            }, 1000);
        }
    }

    /**
     * Desconstruct gamepad.
     * @param pGamepadIndex - Gamepad index.
     */
    private deconstructGamepad(pGamepadIndex: number): void {
        // TODO: Only disconnect GamepadInput
        this.mGamepads.delete(pGamepadIndex);
    }

    /**
     * Init gamepad.
     * Applies gamepad button mapping. 
     * @param pGamepad - Gamepad
     */
    private initGamepad(pGamepad: Gamepad): void {
        // TODO: Enable gamepad when allready created.

        let lFoundMapping: GamepadButtonMapping | null = null;

        // Try to find mappig by id assignment.
        lFoundMapping = InputConfiguration.gamepad.getMapping(pGamepad.id);

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
        const lGamepadInformation: GamepadInformation = {
            index: pGamepad.index,
            id: pGamepad.id,
            mapping: lFoundMapping
        };

        // TODO: Add BaseGenericInput => GamepadInput

        this.mGamepads.add(pGamepad.index, lGamepadInformation);
    }
}


type GamepadInformation = {
    index: number;
    id: string;
    mapping: GamepadButtonMapping;
};