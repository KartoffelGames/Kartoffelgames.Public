import { Dictionary } from '@kartoffelgames/core.data';
import { BaseGameInput } from './game_input/base-game-input';

export class InputDevices {
    private static readonly mConnectionChangeListenerList: Array<ConnectionChangeListener> = new Array<ConnectionChangeListener>();
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
    public static onConnectionChange(pListener: ConnectionChangeListener): void {
        InputDevices.mConnectionChangeListenerList.push(pListener);
    }

    /**
     * Register new device.
     * @param pDevice - Device.
     */
    public static registerDevice(pDevice: BaseGameInput): void {
        let lDevice: BaseGameInput;

        // Init new device or reconnect old.
        if (InputDevices.mInputDevices.has(pDevice.id)) {
            lDevice = InputDevices.mInputDevices.get(pDevice.id)!;
        } else {
            InputDevices.mInputDevices.set(pDevice.id, pDevice);
            lDevice = pDevice;
        }

        lDevice.connected = true;

        InputDevices.dispatchConnectionChangeEvent(lDevice);
    }

    /**
     * Unregister device.
     * @param pDevice - Device.
     */
    public static unregisterDevice(pDevice: BaseGameInput): void {
        if (InputDevices.mInputDevices.has(pDevice.id)) {
            const lDevice: BaseGameInput = InputDevices.mInputDevices.get(pDevice.id)!;
            lDevice.connected = false;

            InputDevices.dispatchConnectionChangeEvent(lDevice);
        }
    }

    /**
     * Call all connection change listener.
     * @param pDevice - Changed device.
     */
    private static dispatchConnectionChangeEvent(pDevice: BaseGameInput): void {
        for (const lCallback of InputDevices.mConnectionChangeListenerList) {
            lCallback.apply(this, [pDevice]);
        }
    }
}

type ConnectionChangeListener = (pDevice: BaseGameInput) => void;