import { KeyboardButton } from '../enum/keyboard-button.enum';

export abstract class BaseGenericInput extends EventTarget {
    // TODO: Two axis-controls. One direction.
    // TODO:
    // TODO: Pressed state controlled here.

    private readonly mId: string;
    private mConnected: boolean;

    /**
     * Get connection state.
     */
    public get connected(): boolean {
        return this.mConnected;
    }

    /**
     * Unique game input id.
     * Consistent on reconnect.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * Constructor.s
     * @param pId - Game input id.
     */
    public constructor(pId: string) {
        super();

        this.mId = pId;
        this.mConnected = true;
    }

    // How to apply mapping
    public isPressed(key): boolean;
    public valueOf(key): number; 
}

class GameInputMapping {

    public keyboardToGamepad(pKeyBoardButton: KeyboardButton): GamepadButton {

    }

    public gamepadToKeyboard(pGamepadButton: GamepadButton):  KeyboardButton {

    }
}