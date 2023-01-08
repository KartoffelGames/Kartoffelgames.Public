import { ButtonValueType } from '../../source/enum/button-value-type.enum';

class GamepadEvent extends Event {
    public gamepad: Gamepad;
    constructor(pName: string, pOptions: { gamepad: Gamepad; }) {
        super(pName);
        this.gamepad = pOptions.gamepad;
    }
}

const gGamepads: Map<number, Gamepad> = new Map<number, Gamepad>();

export function AddGamepad(pGamepadIndex: number, pButtonIndex: number, pType: ButtonValueType, pValue: number): void {
    let lNewConnected: boolean = false;

    let lGamepad: Gamepad;
    if (!gGamepads.has(pGamepadIndex)) {
        lGamepad = {
            id: 'Gamepad_mock',
            buttons: [],
            axes: [],
            connected: true,
            index: pGamepadIndex,
            hapticActuators: [],
            mapping: 'standard',
            timestamp: 0
        };

        gGamepads.set(pGamepadIndex, lGamepad);
        lNewConnected = true;
    } else {
        lGamepad = gGamepads.get(pGamepadIndex)!;

        if (!(<any>lGamepad).connected) {
            lNewConnected = true;
            (<any>lGamepad).connected = true;
        }
    }

    if (pType === ButtonValueType.Axis) {
        (<any>lGamepad.axes)[pButtonIndex] = pValue;
    } else {
        (<any>lGamepad.buttons)[pButtonIndex] = { value: pValue, pressed: (pValue === 1), touched: (pValue > 0) };
    }

    // Init connected gamepads.
    if (lNewConnected) {
        const lGamepadEvent = new GamepadEvent('gamepadconnected', {
            gamepad: lGamepad
        });

        window.dispatchEvent(lGamepadEvent);
    }
}

export function RemoveGamepad(pGamepadIndex: number): void {
    if (gGamepads.has(pGamepadIndex)) {
        const lGamepad: Gamepad = gGamepads.get(pGamepadIndex)!;

        (<any>lGamepad).connected = false;

        const lGamepadEvent = new GamepadEvent('gamepaddisconnected', {
            gamepad: lGamepad
        });

        window.dispatchEvent(lGamepadEvent);
    }
}

// Global set.
globalThis.navigator.getGamepads = (): Array<Gamepad> => {
    return [...gGamepads.values()];
};