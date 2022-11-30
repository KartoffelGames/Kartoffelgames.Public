import { Dictionary } from '@kartoffelgames/core.data';
import { BaseGameInput } from './game_input/base-game-input';

export class InputDevices {
    private static readonly mConnectionChange: Array<ConnectionChangeListener> = new Array<ConnectionChangeListener>();
    private static readonly mInputDevices: Dictionary<string, BaseGameInput> = new Dictionary<string, BaseGameInput>();

    /**
     * Get all inout devices.
     */
    public static get devices(): Array<BaseGameInput> {
        return [...InputDevices.mInputDevices.values()];
    }

    /**
     * On connection change.
     * @param pListener - Connection change listener.
     */
    public static onConnectionChange(pListener: ConnectionChangeListener): void{
        InputDevices.mConnectionChange.push(pListener);
    }

    /**
     * Register new device.
     * @param pDevice - Device.
     */
    public static registerDevice(pDevice: BaseGameInput): void {
        this.mInputDevices.set(pDevice.id, pDevice);
    }

    /**
     * Unregister device.
     * @param pDevice - Device.
     */
    public static unregisterDevice(pDevice: BaseGameInput): void {
        this.mInputDevices.delete(pDevice.id);
    }
}

type ConnectionChangeListener = (pDevice: BaseGameInput) => void;