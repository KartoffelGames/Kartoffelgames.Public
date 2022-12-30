import { InputButton } from '../types';

export class InputButtonEvent extends Event {
    private readonly mButton: InputButton;
    private readonly mState: number;

    /**
     * Button.
     */
    public get button(): InputButton {
        return this.mButton;
    }

    /**
     * Button pressed state.
     */
    public get isPressed(): boolean {
        return this.mState > 0;
    }

    /**
     * Button state.
     */
    public get state(): number {
        return this.mState;
    }

    /**
     * Constructor.
     * @param pType - Event type.
     * @param pState - Button state.
     */
    public constructor(pType: keyof InputButtonEventMap, pButton: InputButton, pState: number) {
        super(pType);
        this.mState = pState;
        this.mButton = pButton;
    }
}

export interface InputButtonEventMap {
    'down': InputButtonEvent;
    'up': InputButtonEvent;
    'statechange': InputButtonEvent;
}
