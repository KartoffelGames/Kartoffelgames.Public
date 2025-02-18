import { InputButton } from '../types.ts';

export class InputActionEvent extends Event {
    private readonly mAction: string;
    private readonly mButtons: Array<InputButton>;
    private readonly mState: number;

    /**
     * Triggered action.
     */
    public get action(): string {
        return this.mAction;
    }

    /**
     * Action Buttons.
     */
    public get buttons(): Array<InputButton> {
        return this.mButtons;
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
    public constructor(pType: keyof InputActionEventMap, pAction: string, pState: number, pButtons: Array<InputButton>) {
        super(pType);
        this.mAction = pAction;
        this.mState = pState;
        this.mButtons = pButtons;
    }
}

export interface InputActionEventMap {
    'actiondown': InputActionEvent;
    'actionup': InputActionEvent;
    'actionstatechange': InputActionEvent;
}
