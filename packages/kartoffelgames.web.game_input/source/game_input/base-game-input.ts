import { Dictionary } from '@kartoffelgames/core.data';
import { InputConfiguration } from '../configuration/input-configuration';
import { InputDevice } from '../enum/input-device.enum';
import { InputButton } from '../types';
import { InputButtonEvent, InputButtonEventMap } from './input-button-event';

export abstract class BaseGameInput extends EventTarget {
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
        const lStateChanged: boolean = this.dispatchButtonChangeEvent(pButton, pValue, lButtonCurrentState);

        // Onyl trigger alias mapping on value change.
        if (lStateChanged) {
            // Update all alias targets that are assigned to this alias button.
            const lAliasTargetList = InputConfiguration.alias.assignedTargetOf(pButton) ?? [];
            for (const lAliasTarget of lAliasTargetList) {
                // Get all alias buttons of target button.
                const lAliasButtonList: Array<InputButton> = InputConfiguration.alias.aliasOf(lAliasTarget) ?? [];

                // Get lowest state of all alias buttons.
                let lAliasTargetNextState: number = lAliasButtonList.reduce((pCurrentValue: number, pNextValue: InputButton) => {
                    const lNextValue: number = this.mButtonState.get(pNextValue) ?? 0;

                    // Save changes closer to zero.
                    if (Math.abs(lNextValue) < Math.abs(pCurrentValue)) {
                        return lNextValue;
                    } else {
                        return pCurrentValue;
                    }
                }, 999);

                if (lAliasTargetNextState === 999) {
                    lAliasTargetNextState = 0;
                }

                // Set highest state to alias target state.
                const lAliasTargetCurrentState: number = this.mButtonState.get(lAliasTarget) ?? 0;
                this.mButtonState.set(lAliasTarget, lAliasTargetNextState);
                this.dispatchButtonChangeEvent(lAliasTarget, lAliasTargetNextState, lAliasTargetCurrentState);
            }
        }
    }

    /**
     * Dispatch button events based on changed state.
     * @param pButton - Target button.
     * @param pCurrentState - Current set state.
     * @param pLastState - Last state.
     */
    private dispatchButtonChangeEvent(pButton: InputButton, pCurrentState: number, pLastState: number): boolean {
        // Exit when values has not changed.
        if (pCurrentState === pLastState) {
            return false;
        }

        // Exit when input is not connected.
        if (!this.connected) {
            return false;
        }

        // Trigger pressed event when last state was zero.
        if (pLastState === 0) {
            this.dispatchEvent(new InputButtonEvent('press', pButton, pCurrentState));
        }

        // Trigger value change event.
        this.dispatchEvent(new InputButtonEvent('statechange', pButton, pCurrentState));

        return true;
    }
}