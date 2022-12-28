import { Dictionary } from '@kartoffelgames/core.data';
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
        return this.getButtonState(pButton) !== 0;
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
            this.dispatchEvent(new InputButtonEvent('down', pButton, pCurrentState));
        } else if(pLastState > 0 && pCurrentState === 0) {
            this.dispatchEvent(new InputButtonEvent('up', pButton, pCurrentState));
        }

        // Trigger value change event.
        this.dispatchEvent(new InputButtonEvent('statechange', pButton, pCurrentState));

        return true;
    }
}