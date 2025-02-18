import { Dictionary } from '@kartoffelgames/core';
import { BaseInputDevice } from './device/base-input-device.ts';
import { InputConfiguration } from './configuration/input-configuration.ts';
import { IInputConnector } from './interface/i-input-connector.interface.ts';

export class InputDevices {
    private readonly mConfiguration: InputConfiguration;
    private readonly mConnectionChangeListenerList: Array<ConnectionChangeListener> = new Array<ConnectionChangeListener>();
    private readonly mInputDevices: Dictionary<string, BaseInputDevice> = new Dictionary<string, BaseInputDevice>();

    /**
     * Get input device configuration.
     */
    public get configuration(): InputConfiguration {
        return this.mConfiguration;
    }

    /**
     * Get all input devices.
     */
    public get devices(): Array<BaseInputDevice> {
        return [...this.mInputDevices.values()];
    }

    /**
     * Constructor.
     * @param pConfiguration - input configuration.
     */
    public constructor(pConfiguration: InputConfiguration) {
        this.mConfiguration = pConfiguration;
    }

    /**
     * On connection change.
     * @param pListener - Connection change listener.
     */
    public onConnectionChange(pListener: ConnectionChangeListener): void {
        this.mConnectionChangeListenerList.push(pListener);
    }

    /**
     * Register input connector.
     * @param pConnector - Input connector.
     */
    public registerConnector(pConnector: IInputConnector): void {
        pConnector.init(this);
    }

    /**
     * Register new device.
     * @param pDevice - Device.
     */
    public registerDevice(pDevice: BaseInputDevice): void {
        let lDevice: BaseInputDevice;

        // Init new device or reconnect old.
        if (this.mInputDevices.has(pDevice.id)) {
            lDevice = this.mInputDevices.get(pDevice.id)!;
        } else {
            this.mInputDevices.set(pDevice.id, pDevice);
            lDevice = pDevice;
        }

        lDevice.connected = true;

        this.dispatchConnectionChangeEvent(lDevice);
    }

    /**
     * Unregister device.
     * @param pDevice - Device.
     */
    public unregisterDevice(pDevice: BaseInputDevice): void {
        if (this.mInputDevices.has(pDevice.id)) {
            const lDevice: BaseInputDevice = this.mInputDevices.get(pDevice.id)!;
            lDevice.connected = false;

            this.dispatchConnectionChangeEvent(lDevice);
        }
    }

    /**
     * Call all connection change listener.
     * @param pDevice - Changed device.
     */
    private dispatchConnectionChangeEvent(pDevice: BaseInputDevice): void {
        for (const lCallback of this.mConnectionChangeListenerList) {
            lCallback.apply(this, [pDevice]);
        }
    }
}

type ConnectionChangeListener = (pDevice: BaseInputDevice) => void;