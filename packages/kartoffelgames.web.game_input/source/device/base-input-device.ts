import { Dictionary } from '@kartoffelgames/core';
import type { DeviceConfiguration } from '../configuration/device-configuration.ts';
import type { InputDevice } from '../enum/input-device.enum.ts';
import { InputActionEvent, type InputActionEventMap } from '../event/input-action-event.ts';
import { InputButtonEvent, type InputButtonEventMap } from '../event/input-button-event.ts';
import type { InputButton } from '../types.ts';

export abstract class BaseInputDevice extends EventTarget {
    private readonly mActionStates: Dictionary<string, number>;
    private readonly mButtonState: Dictionary<InputButton, number>;
    private mConnected: boolean;
    private readonly mDeviceConfiguration: DeviceConfiguration;
    private readonly mDeviceType: InputDevice;
    private readonly mId: string;

    /**
     * Get connection state.
     */
    public get connected(): boolean {
        return this.mConnected;
    } set connected(pConnected: boolean) {
        this.mConnected = pConnected;

        // Call state change method.
        this.onConnectionStateChange();
    }

    /**
     * Device configuration.
     */
    public get deviceConfiguration(): DeviceConfiguration {
        return this.mDeviceConfiguration;
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
    public constructor(pId: string, pDeviceType: InputDevice, pDeviceConfiguration: DeviceConfiguration) {
        super();

        this.mId = pId;
        this.mConnected = false;
        this.mDeviceType = pDeviceType;
        this.mButtonState = new Dictionary<InputButton, number>();
        this.mActionStates = new Dictionary<string, number>();
        this.mDeviceConfiguration = pDeviceConfiguration;
    }

    /**
     * Add event listener.
     * @param pType - Event type.
     * @param pCallback - Callback.
     * @param pOptions - Event options.
     */
    public override addEventListener<T extends keyof InputActionEventMap>(pType: T, pListener: (pEvent: InputActionEventMap[T]) => any): void;
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
        return this.getButtonState(pButton) !== 0;
    }

    /**
     * Set button state. 
     * Updates states of alias buttons.
     * @param pButton - Target button.
     * @param pValue - New state value of button.
     */
    protected setButtonState(pButton: InputButton, pValue: number): void {
        // Exit when input is not connected.
        if (!this.connected) {
            return;
        }

        // Save current state.
        const lLastButtonState: number = this.mButtonState.get(pButton) ?? 0;

        // Apply tolerance. Absolute values for negative axis.
        let lButtonState: number = pValue;
        if (Math.abs(lButtonState) < this.mDeviceConfiguration.triggerTolerance) {
            lButtonState = 0;
        }

        // Exit when values has not changed.
        if (lLastButtonState === lButtonState) {
            return;
        }

        // Set next target button state and trigger button change.
        this.mButtonState.set(pButton, lButtonState);
        this.dispatchButtonChangeEvent(pButton, lButtonState, lLastButtonState);

        // Check all actions of this buttons.
        for (const lAction of this.deviceConfiguration.getActionOfButton(pButton)) {
            const lActionButtonList: Array<InputButton> = this.deviceConfiguration.getActionButtons(lAction);

            // Get lowest state of all alias buttons.
            const lActionState: number = lActionButtonList.reduce((pCurrentValue: number, pNextValue: InputButton) => {
                const lNextValue: number = this.mButtonState.get(pNextValue) ?? 0;

                // Save changes closer to zero.
                if (Math.abs(lNextValue) < Math.abs(pCurrentValue)) {
                    return lNextValue;
                } else {
                    return pCurrentValue;
                }
            }, 999);

            // Set highest state to alias target state.
            const lActionLastState: number = this.mActionStates.get(lAction) ?? 0;

            // Exit when values has not changed.
            if (lActionLastState === lActionState) {
                return;
            }

            // Update action state.
            this.mActionStates.set(lAction, lActionState);

            // Trigger events.
            this.dispatchActionChangeEvent(lAction, lActionState, lActionLastState, lActionButtonList);
        }
    }

    /**
     * Dispatch action events based on changed state.
     * @param pAction - Target action.
     * @param pCurrentState - Current set state.
     * @param pLastState - Last state.
     */
    private dispatchActionChangeEvent(pAction: string, pCurrentState: number, pLastState: number, pAffectedButtons: Array<InputButton>): boolean {
        // Trigger pressed event when last state was zero.
        if (pLastState === 0) {
            this.dispatchEvent(new InputActionEvent('actiondown', pAction, pCurrentState, pAffectedButtons));
        } else if (Math.abs(pLastState) > 0 && pCurrentState === 0) {
            this.dispatchEvent(new InputActionEvent('actionup', pAction, pCurrentState, pAffectedButtons));
        }

        // Trigger value change event.
        this.dispatchEvent(new InputActionEvent('actionstatechange', pAction, pCurrentState, pAffectedButtons));

        return true;
    }

    /**
     * Dispatch button events based on changed state.
     * @param pButton - Target button.
     * @param pCurrentState - Current set state.
     * @param pLastState - Last state.
     */
    private dispatchButtonChangeEvent(pButton: InputButton, pCurrentState: number, pLastState: number): boolean {
        // Trigger pressed event when last state was zero.
        if (pLastState === 0) {
            this.dispatchEvent(new InputButtonEvent('buttondown', pButton, pCurrentState));
        } else if (Math.abs(pLastState) > 0 && pCurrentState === 0) {
            this.dispatchEvent(new InputButtonEvent('buttonup', pButton, pCurrentState));
        }

        // Trigger value change event.
        this.dispatchEvent(new InputButtonEvent('buttonstatechange', pButton, pCurrentState));

        return true;
    }

    /**
     * Called on connection change.
     */
    protected abstract onConnectionStateChange(): void;
}