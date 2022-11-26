import { Dictionary } from '@kartoffelgames/core.data';
import { InputConfiguration } from '../configuration/input-configuration';
import { InputDevice } from '../enum/input-device.enum';
import { InputButton } from '../types';

export abstract class BaseGenericInput extends EventTarget {
    private readonly mButtonState: Dictionary<InputButton, number>;
    private mConnected: boolean;
    private readonly mDeviceType: InputDevice;
    private readonly mId: string;

    /**
     * Get connection state.
     */
    public get connected(): boolean {
        return this.mConnected;
    } set connected(pConnected: boolean) {
        this.mConnected = pConnected;
    }

    /**
     * Device type.
     */
    public get deviceType(): InputDevice {
        return this.mDeviceType;
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
    public constructor(pId: string, pDeviceType: InputDevice) {
        super();

        this.mId = pId;
        this.mConnected = true;
        this.mDeviceType = pDeviceType;
        this.mButtonState = new Dictionary<InputButton, number>();
    }

    /**
     * Add event listener.
     * @param pType - Event type.
     * @param pCallback - Callback.
     * @param pOptions - Event options.
     */
    public override addEventListener<T extends keyof InputButtonEventMap>(pType: T, pListener: (pEvent: InputButtonEventMap[T]) => any): void;
    public override addEventListener(pType: string, pCallback: EventListenerOrEventListenerObject | null, pOptions?: AddEventListenerOptions | boolean): void;
    public override addEventListener(pType: string, pCallback: EventListenerOrEventListenerObject | null, pOptions?: AddEventListenerOptions | boolean): void {
        super.addEventListener(pType, pCallback, pOptions);
    }

    /**
     * Get float value of button state. Range between 0..1.
     * @param pButton - Button
     */
    public getButtonState(pButton: InputButton): number {
        return this.mButtonState.get(pButton) ?? 0;
    }

    /**
     * Check for button pressed.
     * @param pButton - Button.
     */
    public isPressed(pButton: InputButton): boolean {
        return this.getButtonState(pButton) > 0;
    }

    /**
     * Set button state. 
     * Updates states of alias buttons.
     * @param pButton - Target button.
     * @param pValue - New state value of button.
     */
    protected setButtonState(pButton: InputButton, pValue: number): void {
        // Save current state.
        const lButtonCurrentState: number = this.mButtonState.get(pButton) ?? 0;

        // Set next target button state and trigger button change.
        this.mButtonState.set(pButton, pValue);
        this.dispatchButtonChangeEvent(pButton, pValue, lButtonCurrentState);

        // Update all alias targets that are assigned to this alias button.
        const lAliasTargetList = InputConfiguration.alias.assignedTargetOf(pButton) ?? [];
        for (const lAliasTarget of lAliasTargetList) {
            // Get all alias buttons of target button.
            const lAliasButtonList: Array<InputButton> = InputConfiguration.alias.aliasOf(lAliasTarget) ?? [];

            // Get lowest state of all alias buttons.
            const lMinState: number = lAliasButtonList.reduce((pCurrentValue: number, pNextValue: InputButton) => {
                return Math.min(pCurrentValue, this.mButtonState.get(pNextValue) ?? 0);
            }, 0);

            // Set highest state to alias target state.
            const lAliasTargetCurrentState: number = this.mButtonState.get(lAliasTarget) ?? 0;
            const lAliasTargetNextState: number = Math.max(lAliasTargetCurrentState, lMinState);
            this.mButtonState.set(lAliasTarget, lAliasTargetNextState);
            this.dispatchButtonChangeEvent(lAliasTarget, lAliasTargetNextState, lAliasTargetCurrentState);
        }
    }

    /**
     * Dispatch button events based on changed state.
     * @param pButton - Target button.
     * @param pCurrentState - Current set state.
     * @param pLastState - Last state.
     */
    private dispatchButtonChangeEvent(pButton: InputButton, pCurrentState: number, pLastState: number): void {
        // Exit when values has not changed.
        if (pCurrentState === pLastState) {
            return;
        }

        // Exit when input is not connected.
        if (!this.connected) {
            return;
        }

        // Trigger pressed event when last state was zero.
        if (pLastState === 0) {
            this.dispatchEvent(new InputButtonEvent('press', pButton, pCurrentState));
        }

        // Trigger value change event.
        this.dispatchEvent(new InputButtonEvent('statechange', pButton, pCurrentState));
    }
}

export interface InputButtonEventMap {
    'press': InputButtonEvent;
    'statechange': InputButtonEvent;
}

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