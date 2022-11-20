import { Dictionary } from '@kartoffelgames/core.data';
import { GamepadButtonType } from './enum/gamepad-button-type.enum';
import { GamepadMapping } from './gamepad-mapping';

export class GamepadHandler {
    private static mIntervalStarted: boolean = false;
    private static readonly mMappingList: Array<MappingAssignment> = new Array<MappingAssignment>();
    private static readonly mStandardMapping: GamepadMapping = ((): GamepadMapping => {
        const lMapping = {
            clusterButtonBottom: { type: GamepadButtonType.Button, index: 0 },
            clusterButtonRight: { type: GamepadButtonType.Button, index: 1 },
            clusterButtonLeft: { type: GamepadButtonType.Button, index: 2 },
            clusterButtonTop: { type: GamepadButtonType.Button, index: 3 },
            buttonLeft: { type: GamepadButtonType.Button, index: 4 },
            buttonRight: { type: GamepadButtonType.Button, index: 5 },
            triggerLeft: { type: GamepadButtonType.Button, index: 6 },
            triggerRight: { type: GamepadButtonType.Button, index: 7 },
            selectButton: { type: GamepadButtonType.Button, index: 8 },
            startButton: { type: GamepadButtonType.Button, index: 9 },
            homeButton: { type: GamepadButtonType.Button, index: 16 },
            directionalPadTop: { type: GamepadButtonType.Button, index: 12 },
            directionalPadBottom: { type: GamepadButtonType.Button, index: 13 },
            directionalPadRight: { type: GamepadButtonType.Button, index: 15 },
            directionalPadLeft: { type: GamepadButtonType.Button, index: 14 },
            leftThumbStickButton: { type: GamepadButtonType.Button, index: 10 },
            leftThumbStickXaxis: { type: GamepadButtonType.Axis, index: 0 },
            leftThumbStickYaxis: { type: GamepadButtonType.Axis, index: 1 },
            rightThumbStickButton: { type: GamepadButtonType.Button, index: 11 },
            rightThumbStickXaxis: { type: GamepadButtonType.Axis, index: 2 },
            rightThumbStickYaxis: { type: GamepadButtonType.Axis, index: 3 },
        };

        return new GamepadMapping(lMapping);
    })();

    /**
     * Add gamepad mapping by id matching.
     * @param pIdAssignment - Regex for assigning to matching gamepad ids.
     * @param pMapping - Gamepad mapping.
     */
    public static addMapping(pIdAssignment: RegExp, pMapping: GamepadMapping): void {
        this.mMappingList.push({ mapping: pMapping, idMatch: pIdAssignment });
    }

    private readonly mGamepads: Dictionary<number, GamepadInformation>;
    private readonly mGlobalConfig: GamepadConfiguration;

    /**
     * Constructor.
     * Initialize connecting and disconnecting gamepads.
     */
    public constructor(pConfig: GamepadConfiguration) {
        this.mGamepads = new Dictionary<number, GamepadInformation>();
        this.mGlobalConfig = pConfig;

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
        if (!GamepadHandler.mIntervalStarted) {
            GamepadHandler.mIntervalStarted = true;

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
        this.mGamepads.delete(pGamepadIndex);
    }

    /**
     * Init gamepad.
     * Applies gamepad button mapping. 
     * @param pGamepad - Gamepad
     */
    private initGamepad(pGamepad: Gamepad): void {
        let lFoundMapping: GamepadMapping | null = null;

        // Try to find mappig by id assignment.
        const lGamepadId: string = pGamepad.id;
        for (const lMappingAssignment of GamepadHandler.mMappingList) {
            if (lMappingAssignment.idMatch.test(lGamepadId)) {
                lFoundMapping = lMappingAssignment.mapping;
                break;
            }
        }

        // Fallback to gamepad mapping property.
        if (pGamepad.mapping === 'standard') {
            lFoundMapping = GamepadHandler.mStandardMapping;
        } else {
            // There are more mapping types, but ignored for now. :) hehe
            lFoundMapping = GamepadHandler.mStandardMapping;
        }

        // Build general gamepad information.
        const lGamepadInformation: GamepadInformation = {
            index: pGamepad.index,
            id: pGamepad.id,
            mapping: lFoundMapping
        };

        this.mGamepads.add(pGamepad.index, lGamepadInformation);
    }
}

type GamepadConfiguration = {
    triggerTolerance: number;
};

type GamepadInformation = {
    index: number;
    id: string;
    mapping: GamepadMapping;
};

type MappingAssignment = {
    mapping: GamepadMapping,
    idMatch: RegExp;
};
